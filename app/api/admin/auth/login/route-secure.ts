import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient } from '@/lib/supabase-server';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { z } from 'zod';

// Input validation schema
const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(1).max(100)
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
        error: 'Too many login attempts', 
        message: `Please wait before trying again. Try again after ${rateLimitResult.reset.toLocaleTimeString()}.` 
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
      validatedData = loginSchema.parse(body);
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

    const { email, password } = validatedData;

    // Create anonymous Supabase client
    const { supabase } = createSupabaseRouteHandlerClient(request);

    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password
    });

    if (authError || !authData.user) {
      console.error('[Admin Login] Auth error:', authError);
      
      // Log failed attempt
      await logFailedLogin(supabase, email, identifier, request.headers.get('user-agent'));
      
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user has admin role in user_profiles
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id, email, first_name, last_name, role, status')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profile) {
      console.error('[Admin Login] Profile error:', profileError);
      
      // Sign out the user
      await supabase.auth.signOut();
      
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 403 }
      );
    }

    // Check if user is an admin and active
    if (!['admin', 'super_admin'].includes(profile.role) || profile.status !== 'active') {
      console.error('[Admin Login] Not an admin or inactive');
      
      // Log unauthorized access attempt
      await supabase
        .from('admin_activity_log')
        .insert({
          action: 'unauthorized_admin_login_attempt',
          entity_type: 'auth',
          details: {
            user_id: authData.user.id,
            email: email,
            role: profile.role,
            status: profile.status,
            ip_address: identifier,
            user_agent: request.headers.get('user-agent')
          }
        });
      
      // Sign out the user
      await supabase.auth.signOut();
      
      return NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }

    // Update last login in user_profiles
    await supabase
      .from('user_profiles')
      .update({
        last_login_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', authData.user.id);

    // Log successful admin login
    await supabase
      .from('admin_activity_log')
      .insert({
        action: 'admin_login',
        entity_type: 'auth',
        details: {
          user_id: authData.user.id,
          email: profile.email,
          role: profile.role,
          ip_address: identifier,
          user_agent: request.headers.get('user-agent'),
          session_id: authData.session.access_token.substring(0, 8) + '...'
        }
      });

    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: profile.email,
        name: `${profile.first_name} ${profile.last_name}`.trim(),
        role: profile.role
      }
    });

    // Set Supabase session cookies
    response.cookies.set('sb-access-token', authData.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: authData.session.expires_in || 3600, // Use session expiry
      path: '/'
    });

    response.cookies.set('sb-refresh-token', authData.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400 * 7, // 7 days
      path: '/'
    });

    // Store provider if available
    if (authData.session.provider_token) {
      response.cookies.set('sb-provider-token', authData.session.provider_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: authData.session.expires_in || 3600,
        path: '/'
      });
    }

    return response;
    
  } catch (error) {
    console.error('[Admin Login] Unexpected error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}

async function logFailedLogin(
  supabase: any, 
  email: string, 
  ipAddress: string, 
  userAgent: string | null
) {
  try {
    // Check if this email exists in our system
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('id, role')
      .eq('email', email.toLowerCase())
      .single();

    await supabase
      .from('admin_activity_log')
      .insert({
        action: 'failed_admin_login',
        entity_type: 'auth',
        details: {
          email: email,
          user_exists: !!profile,
          user_role: profile?.role || null,
          ip_address: ipAddress,
          user_agent: userAgent
        }
      });
  } catch (err) {
    console.error('Failed to log failed login:', err);
  }
}

// SQL needed:
/*
-- Add last_login_at to user_profiles if not exists
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

-- Ensure admin_activity_log can accept anonymous inserts for failed logins
CREATE POLICY "Allow anonymous to log failed logins" ON admin_activity_log
  FOR INSERT TO anon
  WITH CHECK (action IN ('failed_admin_login', 'unauthorized_admin_login_attempt'));
*/