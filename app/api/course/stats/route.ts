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
    
    // Get all enrolled courses
    const { data: enrollments } = await supabase
      .from('course_enrollments')
      .select('course_id')
      .eq('user_id', session.user.id)
      .eq('status', 'active');
    
    if (!enrollments || enrollments.length === 0) {
      return NextResponse.json({
        success: true,
        stats: {
          weeksStarted: 0,
          weeksCompleted: 0,
          lessonsCompleted: 0,
          totalLessons: 0,
          completionPercentage: 0,
          totalTimeSpentMinutes: 0,
          lastActivity: null,
          courseCompleted: false
        }
      });
    }
    
    // Get progress for all enrolled courses
    const { data: progress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', session.user.id)
      .in('course_id', enrollments.map(e => e.course_id));
    
    // Get last activity
    const { data: lastActivityData } = await supabase
      .from('course_activity_logs')
      .select('created_at')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    // Calculate stats
    const lessonsCompleted = progress?.filter(p => p.completed).length || 0;
    
    // Get total lessons for enrolled courses (rough estimate)
    const totalLessonsPerCourse = {
      'becoming-mom': 4,
      'postpartum-wellness-foundations': 24,
      'anxiety-management-new-moms': 16,
      'partner-support-bootcamp': 8
    };
    
    const totalLessons = enrollments.reduce((sum, enrollment) => {
      return sum + (totalLessonsPerCourse[enrollment.course_id as keyof typeof totalLessonsPerCourse] || 0);
    }, 0);
    
    const completionPercentage = totalLessons > 0 
      ? Math.round((lessonsCompleted / totalLessons) * 100)
      : 0;
    
    // Calculate weeks (rough estimate based on lessons)
    const weeksStarted = Math.ceil(lessonsCompleted / 4);
    const weeksCompleted = Math.floor(lessonsCompleted / 4);
    
    // Estimate time spent (10 minutes per completed lesson)
    const totalTimeSpentMinutes = lessonsCompleted * 10;
    
    return NextResponse.json({
      success: true,
      stats: {
        weeksStarted,
        weeksCompleted,
        lessonsCompleted,
        totalLessons,
        completionPercentage,
        totalTimeSpentMinutes,
        lastActivity: lastActivityData?.created_at || null,
        courseCompleted: completionPercentage === 100
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