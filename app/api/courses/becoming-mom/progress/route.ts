import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Get user's progress
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
    
    // Get user's progress for all lessons
    const { data: progress, error } = await supabase
      .from('user_progress')
      .select(`
        lesson_id,
        completed,
        progress_percentage,
        last_position_seconds,
        completed_at
      `)
      .eq('user_id', session.user.id)
      .eq('course_id', 'becoming-mom');
    
    if (error) throw error;
    
    // Calculate overall progress
    const totalLessons = 4;
    const completedLessons = progress?.filter(p => p.completed).length || 0;
    const overallProgress = Math.round((completedLessons / totalLessons) * 100);
    
    return NextResponse.json({
      success: true,
      progress: progress || [],
      overallProgress,
      completedLessons,
      totalLessons
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}

// Update lesson progress
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { lessonId, progress, completed, lastPosition } = body;
    
    if (!lessonId) {
      return NextResponse.json(
        { success: false, error: 'Lesson ID required' },
        { status: 400 }
      );
    }
    
    // Upsert progress record
    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: session.user.id,
        course_id: 'becoming-mom',
        lesson_id: lessonId,
        progress_percentage: progress || 0,
        completed: completed || false,
        last_position_seconds: lastPosition || 0,
        completed_at: completed ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,lesson_id'
      });
    
    if (error) throw error;
    
    // Log activity
    await supabase
      .from('course_activity_logs')
      .insert({
        user_id: session.user.id,
        course_id: 'becoming-mom',
        lesson_id: lessonId,
        activity_type: completed ? 'lesson_completed' : 'lesson_progress',
        activity_data: { progress, completed }
      });
    
    // Check if course is completed
    if (completed) {
      const { data: allProgress } = await supabase
        .from('user_progress')
        .select('completed')
        .eq('user_id', session.user.id)
        .eq('course_id', 'becoming-mom');
      
      const totalCompleted = allProgress?.filter(p => p.completed).length || 0;
      
      if (totalCompleted === 4) {
        // Course completed - could trigger certificate generation
        await supabase
          .from('course_completions')
          .insert({
            user_id: session.user.id,
            course_id: 'becoming-mom',
            completed_at: new Date().toISOString()
          });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Progress updated successfully'
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}