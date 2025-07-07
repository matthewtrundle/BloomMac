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
    
    // TODO: Implement get_all_courses_with_user_progress function in database
    // For now, return empty array to prevent 500 errors
    console.log('get_all_courses_with_user_progress function not yet implemented');
    
    return NextResponse.json({
      success: true,
      courses: []
    });
    
  } catch (error) {
    console.error('Error fetching all courses progress:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch courses progress' },
      { status: 500 }
    );
  }
}
