import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const { supabase } = createSupabaseRouteHandlerClient(request);
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // TODO: Implement get_user_course_stats function in database
    // For now, return empty stats to prevent 500 errors
    console.log('get_user_course_stats function not yet implemented');
    
    return NextResponse.json({
      success: true,
      stats: {
        weeksStarted: 0,
        weeksCompleted: 0,
        lessonsCompleted: 0,
        totalLessons: 0,
        completionPercentage: 0,
        totalTimeSpentMinutes: 0,
        lastActivity: new Date().toISOString(),
        courseCompleted: false
      }
    });
    
  } catch (error) {
    console.error('Error fetching course stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch course statistics' },
      { status: 500 }
    );
  }
}
