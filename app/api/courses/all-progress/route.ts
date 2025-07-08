import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const { supabase } = createSupabaseRouteHandlerClient(request);
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { data, error } = await supabase.rpc('get_all_courses_with_user_progress', { p_user_id: session.user.id });

    if (error) {
      console.error('Error fetching all courses progress:', error);
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      courses: data || []
    });
    
  } catch (error) {
    console.error('Error fetching all courses progress:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch courses progress' },
      { status: 500 }
    );
  }
}
