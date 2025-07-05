import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient, createSupabaseServiceClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    // Get user ID from headers (set by middleware)
    const userId = request.headers.get('x-user-id');
    
    // Create route handler client for authenticated operations
    const { supabase: authClient, applySetCookies } = createSupabaseRouteHandlerClient(request);
    
    // Use service client for admin logging
    const serviceClient = createSupabaseServiceClient();

    if (userId) {
      // Log the logout activity
      await serviceClient
        .from('admin_activity_log')
        .insert({
          user_id: userId,
          action: 'logout',
          entity_type: 'auth',
          entity_id: userId,
          details: {
            ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
            user_agent: request.headers.get('user-agent')
          }
        });
    }

    // Sign out from Supabase using auth client
    await authClient.auth.signOut();

    // Create response
    const response = NextResponse.json({ success: true });

    // Apply any cookies set by Supabase
    applySetCookies(response);

    // Clear all auth cookies
    response.cookies.delete('adminToken');
    response.cookies.delete('sb-access-token');
    response.cookies.delete('sb-refresh-token');

    return response;
  } catch (error) {
    console.error('[Admin Logout] Error:', error);
    return NextResponse.json(
      { error: 'An error occurred during logout' },
      { status: 500 }
    );
  }
}