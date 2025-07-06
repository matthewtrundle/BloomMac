import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceClient } from '@/lib/supabase-server';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const identifier = 
    request.headers.get('x-forwarded-for') || 
    request.headers.get('x-real-ip') ||
    'anonymous';
    
  const rateLimitResult = await rateLimit(RATE_LIMITS.contact, identifier);
  
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
    const { email, password, firstName, lastName, phone } = body;

    // Validate required fields
    if (!email || !password || !firstName) {
      return NextResponse.json(
        { error: 'Email, password, and first name are required' },
        { status: 400 }
      );
    }

    // Create Supabase service client for user creation
    const supabase = createSupabaseServiceClient();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email.toLowerCase().trim(),
      password,
      email_confirm: false, // Require email confirmation
      user_metadata: {
        first_name: firstName.trim(),
        last_name: lastName?.trim() || '',
        phone: phone?.trim() || '',
        signup_source: 'website'
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

    // Create user profile
    try {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          first_name: firstName.trim(),
          last_name: lastName?.trim() || '',
          phone: phone?.trim() || '',
          status: 'active',
          created_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Don't fail the signup if profile creation fails
      }
    } catch (profileErr) {
      console.error('Profile creation failed:', profileErr);
      // Continue with signup even if profile creation fails
    }

    // Add to newsletter if they opted in (we'll assume they did for now)
    try {
      await supabase
        .from('subscribers')
        .upsert({
          email: email.toLowerCase().trim(),
          first_name: firstName.trim(),
          last_name: lastName?.trim() || '',
          status: 'active',
          source: 'signup',
          metadata: {
            signup_date: new Date().toISOString(),
            user_id: authData.user.id
          }
        }, {
          onConflict: 'email'
        });
    } catch (subscriberErr) {
      console.error('Newsletter signup failed:', subscriberErr);
      // Continue with signup even if newsletter signup fails
    }

    // Track analytics event
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
          }
        });
    } catch (analyticsErr) {
      console.error('Analytics tracking failed:', analyticsErr);
      // Continue with signup even if analytics fails
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