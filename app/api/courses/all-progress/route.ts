import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Define all available courses
const ALL_COURSES = [
  {
    id: 'postpartum-wellness-foundations',
    title: 'Postpartum Wellness',
    subtitle: '6-Week Journey',
    totalLessons: 24,
    duration: '6 weeks',
    price: 197
  },
  {
    id: 'anxiety-management-new-moms',
    title: 'Anxiety Management',
    subtitle: 'Peace of Mind',
    totalLessons: 16,
    duration: '4 weeks',
    price: 127
  },
  {
    id: 'partner-support-bootcamp',
    title: 'Partner Support',
    subtitle: 'For Partners',
    totalLessons: 8,
    duration: '2 weeks',
    price: 97
  }
];

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      // Return courses without enrollment data for non-authenticated users
      return NextResponse.json({
        success: true,
        courses: ALL_COURSES.map(course => ({
          ...course,
          isEnrolled: false,
          progress: 0,
          lessonsCompleted: 0,
          lastActivity: null
        }))
      });
    }
    
    // Get user's enrollments
    const { data: enrollments } = await supabase
      .from('course_enrollments')
      .select('course_id, enrolled_at')
      .eq('user_id', session.user.id)
      .eq('status', 'active');
    
    const enrolledCourseIds = enrollments?.map(e => e.course_id) || [];
    
    // Get progress data for enrolled courses
    const coursesWithProgress = await Promise.all(
      ALL_COURSES.map(async (course) => {
        const isEnrolled = enrolledCourseIds.includes(course.id);
        
        if (!isEnrolled) {
          return {
            ...course,
            isEnrolled: false,
            progress: 0,
            lessonsCompleted: 0,
            lastActivity: null
          };
        }
        
        // Get progress data
        const { data: progress } = await supabase
          .from('user_progress')
          .select('completed')
          .eq('user_id', session.user.id)
          .eq('course_id', course.id)
          .eq('completed', true);
        
        const lessonsCompleted = progress?.length || 0;
        const progressPercentage = course.totalLessons > 0 
          ? Math.round((lessonsCompleted / course.totalLessons) * 100)
          : 0;
        
        // Get last activity
        const { data: lastActivityData } = await supabase
          .from('course_activity_logs')
          .select('created_at')
          .eq('user_id', session.user.id)
          .eq('course_id', course.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        return {
          ...course,
          isEnrolled: true,
          progress: progressPercentage,
          lessonsCompleted,
          lastActivity: lastActivityData?.created_at || enrollments?.find(e => e.course_id === course.id)?.enrolled_at || null
        };
      })
    );
    
    return NextResponse.json({
      success: true,
      courses: coursesWithProgress
    });
    
  } catch (error) {
    console.error('Error fetching all courses progress:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch courses progress' },
      { status: 500 }
    );
  }
}