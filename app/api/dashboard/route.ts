import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { data, error } = await supabase.rpc('get_user_dashboard_data', { p_user_id: session.user.id });

    if (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      ...data
    });
    
  } catch (error) {
    console.error('Error in dashboard API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
