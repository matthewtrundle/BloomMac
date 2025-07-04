import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient } from '@/lib/supabase-server';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { z } from 'zod';

// Input validation schema
const signupSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(100),
  firstName: z.string().min(1).max(50),
  lastName: z.string().max(50).optional(),
  phone: z.string().regex(/^\+?[\d\s()-]+$/).max(20).optional()
});

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const identifier = 
    request.headers.get('x-forwarded-for') || 
    request.headers.get('x-real-ip') ||
    'anonymous';
    
  const rateLimitResult = await rateLimit(RATE_LIMITS.auth, identifier);
  
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { 
        error: 'Too many requests', 
        message: `Please wait before creating another account. Try again after ${rateLimitResult.reset.toLocaleTimeString()}.` 
      },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.reset.toISOString(),
          'Retry-After': Math.ceil((rateLimitResult.reset.getTime() - Date.now()) / 1000).toString(),
        }
      }
    );
  }

  try {
    const body = await request.json();
    
    // Validate input
    let validatedData;
    try {
      validatedData = signupSchema.parse(body);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { 
            error: 'Invalid input',
            details: validationError.errors
          },
          { status: 400 }
        );
      }
      throw validationError;
    }

    const { email, password, firstName, lastName, phone } = validatedData;

    // Additional password validation
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      return NextResponse.json(
        { error: 'Password must contain uppercase, lowercase, and numbers' },
        { status: 400 }
      );
    }

    // Create anonymous Supabase client
    const { supabase } = createSupabaseRouteHandlerClient(request);

    // Use regular signup (not admin) - this is the key difference
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
      options: {
        data: {
          first_name: firstName.trim(),
          last_name: lastName?.trim() || '',
          phone: phone?.trim() || '',
          signup_source: 'website'
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
      }
    });

    if (authError) {
      console.error('Signup auth error:', authError);
      
      if (authError.message.includes('already registered')) {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to create account' },
        { status: 500 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      );
    }

    // Create user profile using a database function with proper permissions
    // This function should be created with SECURITY DEFINER to allow profile creation
    try {
      const { error: profileError } = await supabase
        .rpc('create_user_profile', {
          user_id: authData.user.id,
          user_email: email.toLowerCase().trim(),
          user_first_name: firstName.trim(),
          user_last_name: lastName?.trim() || '',
          user_phone: phone?.trim() || ''
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Log but don't fail the signup
      }
    } catch (profileErr) {
      console.error('Profile creation failed:', profileErr);
    }

    // Add to newsletter if they opted in
    try {
      // Use RPC function for newsletter signup to avoid needing service role
      await supabase
        .rpc('subscribe_to_newsletter', {
          subscriber_email: email.toLowerCase().trim(),
          subscriber_first_name: firstName.trim(),
          subscriber_last_name: lastName?.trim() || '',
          subscriber_source: 'signup'
        });
    } catch (subscriberErr) {
      console.error('Newsletter signup failed:', subscriberErr);
    }

    // Track analytics event (public insert allowed)
    try {
      await supabase
        .from('analytics_events')
        .insert({
          type: 'user_signup',
          page: '/signup',
          session_id: crypto.randomUUID(),
          data: {
            signup_source: 'website',
            has_phone: !!phone
          },
          ip_address: identifier,
          user_agent: request.headers.get('user-agent') || ''
        });
    } catch (analyticsErr) {
      console.error('Analytics tracking failed:', analyticsErr);
    }

    // Send welcome email via edge function
    try {
      await supabase.functions.invoke('send-welcome-email', {
        body: {
          email: email.toLowerCase().trim(),
          firstName: firstName.trim()
        }
      });
    } catch (emailErr) {
      console.error('Welcome email failed:', emailErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully! Please check your email to verify your account.',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        firstName: firstName.trim(),
        lastName: lastName?.trim() || ''
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during signup' },
      { status: 500 }
    );
  }
}

// Helper SQL functions needed in Supabase:
/*
-- Create user profile function
CREATE OR REPLACE FUNCTION create_user_profile(
  user_id UUID,
  user_email TEXT,
  user_first_name TEXT,
  user_last_name TEXT,
  user_phone TEXT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_profiles (id, email, first_name, last_name, phone, status, created_at)
  VALUES (user_id, user_email, user_first_name, user_last_name, user_phone, 'active', NOW())
  ON CONFLICT (id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Subscribe to newsletter function
CREATE OR REPLACE FUNCTION subscribe_to_newsletter(
  subscriber_email TEXT,
  subscriber_first_name TEXT,
  subscriber_last_name TEXT,
  subscriber_source TEXT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO subscribers (email, first_name, last_name, status, source, created_at)
  VALUES (subscriber_email, subscriber_first_name, subscriber_last_name, 'active', subscriber_source, NOW())
  ON CONFLICT (email) DO UPDATE
  SET first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS policies needed:
-- Allow public to insert into analytics_events
CREATE POLICY "Public can insert analytics events" ON analytics_events
  FOR INSERT TO anon
  WITH CHECK (true);
*/