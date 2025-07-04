import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient, getAuthenticatedUser, checkUserRole } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    // Create authenticated Supabase client
    const { supabase } = createSupabaseRouteHandlerClient(request);
    
    // Get authenticated user
    const user = await getAuthenticatedUser(supabase);
    
    if (!user) {
      return NextResponse.json(
        { 
          authenticated: false,
          error: 'Not authenticated' 
        },
        { status: 401 }
      );
    }
    
    // Get user profile with role
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id, email, first_name, last_name, role, status')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.error('[Admin Session] Profile error:', profileError);
      return NextResponse.json(
        { 
          authenticated: false,
          error: 'User profile not found' 
        },
        { status: 403 }
      );
    }

    // Check if user is an admin
    const isAdmin = ['admin', 'super_admin'].includes(profile.role);
    
    if (!isAdmin) {
      return NextResponse.json(
        { 
          authenticated: true,
          isAdmin: false,
          error: 'Admin access required' 
        },
        { status: 403 }
      );
    }

    // Check if account is active
    if (profile.status !== 'active') {
      return NextResponse.json(
        { 
          authenticated: true,
          isAdmin: true,
          isActive: false,
          error: 'Account is not active' 
        },
        { status: 403 }
      );
    }

    // Get session details
    const { data: { session } } = await supabase.auth.getSession();
    
    // Calculate session expiry
    let expiresAt = null;
    if (session?.expires_at) {
      expiresAt = new Date(session.expires_at * 1000).toISOString();
    }

    // Return session info
    return NextResponse.json({
      authenticated: true,
      isAdmin: true,
      isActive: true,
      user: {
        id: user.id,
        email: profile.email,
        name: `${profile.first_name} ${profile.last_name}`.trim(),
        role: profile.role
      },
      session: {
        expiresAt,
        provider: session?.user?.app_metadata?.provider || 'email'
      }
    });
    
  } catch (error) {
    console.error('[Admin Session] Unexpected error:', error);
    return NextResponse.json(
      { 
        authenticated: false,
        error: 'An error occurred checking session' 
      },
      { status: 500 }
    );
  }
}