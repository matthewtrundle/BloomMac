import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    // Get user info from headers (set by middleware)
    const userId = request.headers.get('x-user-id');
    const userEmail = request.headers.get('x-user-email');
    const userRole = request.headers.get('x-user-role');
    
    // Use service client to verify admin status
    const supabase = createSupabaseServiceClient();

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify the user is still an active admin
    const { data: adminProfile, error } = await supabase
      .from('user_profiles')
      .select('id, first_name, last_name, role')
      .eq('id', userId)
      .eq('role', 'admin')
      .single();

    if (error || !adminProfile) {
      return NextResponse.json(
        { error: 'Admin access revoked' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: userId,
        email: userEmail,
        name: `${adminProfile.first_name} ${adminProfile.last_name}`.trim(),
        role: adminProfile.role
      }
    });
  } catch (error) {
    console.error('[Admin Session] Error:', error);
    return NextResponse.json(
      { error: 'An error occurred checking session' },
      { status: 500 }
    );
  }
}
