import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient, getAuthenticatedUser } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    // Create authenticated Supabase client
    const { supabase } = createSupabaseRouteHandlerClient(request);
    
    // Get authenticated user (optional - logout should work even if session is invalid)
    const user = await getAuthenticatedUser(supabase);
    
    if (user) {
      // Log the logout activity
      try {
        await supabase
          .from('admin_activity_log')
          .insert({
            action: 'admin_logout',
            entity_type: 'auth',
            details: {
              user_id: user.id,
              email: user.email,
              ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
              user_agent: request.headers.get('user-agent')
            }
          });
      } catch (logError) {
        // Don't fail logout if logging fails
        console.error('[Admin Logout] Failed to log activity:', logError);
      }
    }

    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('[Admin Logout] Supabase signOut error:', error);
      // Continue with logout even if Supabase signOut fails
    }

    // Create response
    const response = NextResponse.json({ 
      success: true,
      message: 'Successfully logged out'
    });

    // Clear all auth cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 0, // Expire immediately
      path: '/'
    };

    response.cookies.set('sb-access-token', '', cookieOptions);
    response.cookies.set('sb-refresh-token', '', cookieOptions);
    response.cookies.set('sb-provider-token', '', cookieOptions);
    
    // Clear any legacy admin token
    response.cookies.set('adminToken', '', cookieOptions);

    return response;
    
  } catch (error) {
    console.error('[Admin Logout] Unexpected error:', error);
    
    // Even on error, try to clear cookies
    const response = NextResponse.json(
      { 
        error: 'An error occurred during logout',
        success: false 
      },
      { status: 500 }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 0,
      path: '/'
    };

    response.cookies.set('sb-access-token', '', cookieOptions);
    response.cookies.set('sb-refresh-token', '', cookieOptions);
    response.cookies.set('sb-provider-token', '', cookieOptions);
    response.cookies.set('adminToken', '', cookieOptions);

    return response;
  }
}