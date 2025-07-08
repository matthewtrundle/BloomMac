import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const { supabase, applySetCookies } = createSupabaseRouteHandlerClient(request);
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      const response = NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
      return applySetCookies(response);
    }
    
    const { data, error } = await supabase.rpc('get_user_course_stats', { p_user_id: session.user.id });

    if (error) {
      console.error('Error fetching course stats:', error);
      throw error;
    }
    
    const response = NextResponse.json({
      success: true,
      stats: data
    });
    return applySetCookies(response);
    
  } catch (error) {
    console.error('Error fetching course stats:', error);
    const response = NextResponse.json(
      { success: false, error: 'Failed to fetch course statistics' },
      { status: 500 }
    );
    return applySetCookies(response);
  }
}
