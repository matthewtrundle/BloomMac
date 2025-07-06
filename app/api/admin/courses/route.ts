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
      .order('created_at', { ascending: false });

    if (coursesError) {
      console.error('Error fetching courses:', coursesError);
      return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
    }

    // Fetch course weeks/modules for each course
    const courseWeeks: Record<string, any[]> = {};
    
    if (courses && courses.length > 0) {
      for (const course of courses) {
        const { data: modules, error: modulesError } = await supabase
          .from('course_modules')
          .select('*')
          .eq('course_id', course.id)
          .order('week_number', { ascending: true });

        if (!modulesError && modules) {
          // For each module, count the lessons
          const modulesWithCounts = await Promise.all(
            modules.map(async (module) => {
              const { count } = await supabase
                .from('course_lessons')
                .select('*', { count: 'exact', head: true })
                .eq('module_id', module.id);
              
              return {
                id: module.id,
                week_number: module.week_number,
                title: module.title,
                lesson_count: count || 0
              };
            })
          );
          
          courseWeeks[course.id] = modulesWithCounts;
        }
      }
    }

    return NextResponse.json({ 
      courses: courses || [],
      courseWeeks
    });
  } catch (error) {
    console.error('Course API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

