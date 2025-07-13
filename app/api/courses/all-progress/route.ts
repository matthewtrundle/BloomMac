import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const { supabase, applySetCookies } = createSupabaseRouteHandlerClient(request);
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      const response = NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
      return applySetCookies(response);
    }
    
    // Get all courses
    const { data: allCourses, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .order('created_at');

    if (coursesError) {
      throw coursesError;
    }

    // Get user's course access based on email
    const { data: userAccess, error: accessError } = await supabase
      .from('user_course_access')
      .select('*')
      .eq('customer_email', session.user.email);

    if (accessError) {
      console.error('Error fetching user access:', accessError);
      // Continue without access data rather than failing
    }

    // Combine course data with access information
    const coursesWithProgress = allCourses.map(course => {
      const hasAccess = userAccess?.find(access => access.course_id === course.slug);
      return {
        id: course.slug,
        title: course.title,
        subtitle: course.subtitle || '',
        description: course.description || '',
        totalLessons: course.total_lessons || 24,
        duration: course.duration || '6 weeks',
        price: course.price || 297,
        isFree: course.is_free || false,
        isEnrolled: !!hasAccess,
        progress: hasAccess && hasAccess.progress_data?.progress ? hasAccess.progress_data.progress : 0,
        lessonsCompleted: hasAccess && hasAccess.progress_data?.completed ? hasAccess.progress_data.completed : 0,
        lastActivity: hasAccess ? hasAccess.last_accessed_at : null
      };
    });
    
    const response = NextResponse.json({
      success: true,
      courses: coursesWithProgress
    });
    return applySetCookies(response);
    
  } catch (error) {
    console.error('Error fetching all courses progress:', error);
    const response = NextResponse.json(
      { success: false, error: 'Failed to fetch courses progress' },
      { status: 500 }
    );
    return applySetCookies(response);
  }
}
