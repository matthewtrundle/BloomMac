import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Get user info from headers (set by middleware)
    const userId = request.headers.get('x-user-id');
    const userEmail = request.headers.get('x-user-email');
    const userRole = request.headers.get('x-user-role');

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify the user is still active
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('id, email, name, role, is_active')
      .eq('id', userId)
      .single();

    if (error || !adminUser || !adminUser.is_active) {
      return NextResponse.json(
        { error: 'Admin access revoked' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: userId,
        email: adminUser.email || userEmail,
        name: adminUser.name,
        role: adminUser.role
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