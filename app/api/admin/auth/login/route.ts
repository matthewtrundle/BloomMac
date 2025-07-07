import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { createSupabaseServiceClient } from '@/lib/supabase-server';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'bloom-admin-secret-key-change-in-production'
);

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    // Use service client for authentication operations
    const supabase = createSupabaseServiceClient();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError || !authData.user) {
      console.error('[Admin Login] Auth error:', authError);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user is an admin in the user_profiles table
    const { data: adminProfile, error: adminError } = await supabase
      .from('user_profiles')
      .select('id, first_name, last_name, role')
      .eq('id', authData.user.id)
      .eq('role', 'admin')
      .single();

    if (adminError || !adminProfile) {
      console.error('[Admin Login] Not an admin or inactive:', adminError);
      
      // Sign out the user since they're not an admin
      await supabase.auth.signOut();
      
      return NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }

    // Update last login
    await supabase
      .from('user_profiles')
      .update({
        last_login_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', authData.user.id);

    // Log the admin activity
    await supabase
      .from('admin_activity_log')
      .insert({
        user_id: authData.user.id,
        action: 'login',
        entity_type: 'auth',
        entity_id: authData.user.id,
        details: {
          ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
          user_agent: request.headers.get('user-agent')
        }
      });

    // Create JWT token for middleware compatibility
    const token = await new SignJWT({
      userId: authData.user.id,
      email: authData.user.email,
      role: adminProfile.role,
      name: `${adminProfile.first_name} ${adminProfile.last_name}`.trim()
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: adminProfile.role
      }
    });

    // Set secure HTTP-only cookie
    response.cookies.set('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400, // 24 hours
      path: '/'
    });

    // Also set the Supabase session
    response.cookies.set('sb-access-token', authData.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400,
      path: '/'
    });

    response.cookies.set('sb-refresh-token', authData.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400 * 7, // 7 days
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('[Admin Login] Unexpected error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
