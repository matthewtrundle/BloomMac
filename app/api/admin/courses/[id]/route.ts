import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceClient } from '@/lib/supabase-server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get user info from headers (set by middleware)
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const courseId = params.id;
    const supabase = createSupabaseServiceClient();

    // Fetch course details
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Fetch course modules/weeks
    const { data: modules, error: modulesError } = await supabase
      .from('course_modules')
      .select(`
        *,
        course_lessons (*)
      `)
      .eq('course_id', courseId)
      .order('week_number', { ascending: true });

    if (modulesError) {
      console.error('Error fetching modules:', modulesError);
    }

    // Rename modules to weeks for frontend compatibility
    const weeks = modules?.map(module => ({
      ...module,
      course_lessons: module.course_lessons || []
    })) || [];

    // Fetch course assets (if table exists)
    const { data: assets } = await supabase
      .from('course_resources')
      .select('*')
      .eq('course_id', courseId);

    return NextResponse.json({ 
      course,
      weeks,
      assets: assets || []
    });
  } catch (error) {
    console.error('Course fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get user info from headers (set by middleware)
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const courseId = params.id;
    
    if (!courseId) {
      return NextResponse.json({ error: 'Course ID required' }, { status: 400 });
    }

    const supabase = createSupabaseServiceClient();

    // Update course status
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (body.status) {
      updateData.is_active = body.status === 'active';
    }

    const { data, error } = await supabase
      .from('courses')
      .update(updateData)
      .eq('id', courseId)
      .select()
      .single();

    if (error) {
      console.error('Error updating course:', error);
      return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
    }

    return NextResponse.json({ course: data });
  } catch (error) {
    console.error('Course update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get user info from headers (set by middleware)
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const courseId = params.id;
    const supabase = createSupabaseServiceClient();

    // Delete course (will cascade to modules and lessons if foreign keys are set up properly)
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId);

    if (error) {
      console.error('Error deleting course:', error);
      return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Course delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}