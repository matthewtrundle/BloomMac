import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    // Get user info from headers (set by middleware)
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const supabase = createSupabaseServiceClient();

    // Fetch all courses
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (coursesError) {
      console.error('Error fetching courses:', coursesError);
      return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
    }

    // Get course weeks for each course
    const courseWeeks: Record<string, any[]> = {};
    
    for (const course of courses) {
      const { data: modules } = await supabase
        .from('course_modules')
        .select('id, week_number, title')
        .eq('course_id', course.id)
        .order('week_number', { ascending: true });
      
      if (modules) {
        // For each module, get lesson count
        const modulesWithLessonCount = await Promise.all(
          modules.map(async (module) => {
            const { count: lessonCount } = await supabase
              .from('course_lessons')
              .select('*', { count: 'exact', head: true })
              .eq('module_id', module.id);
            
            return {
              ...module,
              lesson_count: lessonCount || 0
            };
          })
        );
        
        courseWeeks[course.id] = modulesWithLessonCount;
      }
    }

    // Return in the expected format
    return NextResponse.json({
      courses,
      courseWeeks
    });
  } catch (error) {
    console.error('Course API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

