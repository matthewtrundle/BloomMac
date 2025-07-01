import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { checkMilestoneAchievements } from './achievements';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface CourseProgress {
  userId: string;
  courseId: string;
  weekNumber: number;
  lessonNumber: number;
  status: 'not_started' | 'in_progress' | 'completed';
  videoProgressPercentage: number;
  timeSpentMinutes: number;
  startedAt?: Date;
  completedAt?: Date;
  lastAccessedAt: Date;
}

export interface CourseStats {
  userId: string;
  courseId: string;
  weeksStarted: number;
  weeksCompleted: number;
  lessonsCompleted: number;
  totalLessons: number;
  completionPercentage: number;
  totalTimeSpentMinutes: number;
  lastActivity: Date;
  courseStartedAt?: Date;
  courseCompleted: boolean;
}

export interface LessonActivity {
  type: 'lesson_start' | 'lesson_complete' | 'video_play' | 'video_pause' | 'video_complete' | 'exercise_complete' | 'reflection_submit' | 'resource_download';
  data?: Record<string, any>;
}

// Update lesson progress
export async function updateLessonProgress(
  userId: string,
  courseId: string,
  weekNumber: number,
  lessonNumber: number,
  updates: {
    status?: CourseProgress['status'];
    videoProgress?: number;
    timeSpent?: number;
  }
) {
  try {
    const { data, error } = await supabase.rpc('update_course_progress', {
      p_user_id: userId,
      p_course_id: courseId,
      p_week_number: weekNumber,
      p_lesson_number: lessonNumber,
      p_status: updates.status || 'in_progress',
      p_video_progress: updates.videoProgress,
      p_time_spent: updates.timeSpent || 0
    });

    if (error) throw error;

    // Check for course completion achievements
    const stats = await getCourseStats(userId, courseId);
    if (stats) {
      await checkMilestoneAchievements(userId, {
        coursesCompleted: stats.courseCompleted ? 1 : 0
      });
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error updating lesson progress:', error);
    return { success: false, error };
  }
}

// Get course progress for a user
export async function getCourseProgress(userId: string, courseId: string) {
  try {
    const { data, error } = await supabase
      .from('course_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .order('week_number', { ascending: true })
      .order('lesson_number', { ascending: true });

    if (error) throw error;

    return { success: true, progress: data || [] };
  } catch (error) {
    console.error('Error fetching course progress:', error);
    return { success: false, progress: [] };
  }
}

// Get course stats for dashboard
export async function getCourseStats(userId: string, courseId: string): Promise<CourseStats | null> {
  try {
    const { data, error } = await supabase
      .from('user_course_stats')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();

    if (error) throw error;

    return data ? {
      userId: data.user_id,
      courseId: data.course_id,
      weeksStarted: data.weeks_started,
      weeksCompleted: data.weeks_completed,
      lessonsCompleted: data.lessons_completed,
      totalLessons: data.total_lessons,
      completionPercentage: parseFloat(data.completion_percentage),
      totalTimeSpentMinutes: data.total_time_spent_minutes,
      lastActivity: new Date(data.last_activity),
      courseStartedAt: data.course_started_at ? new Date(data.course_started_at) : undefined,
      courseCompleted: data.course_completed
    } : null;
  } catch (error) {
    console.error('Error fetching course stats:', error);
    return null;
  }
}

// Get next lesson to continue
export async function getNextLesson(userId: string, courseId: string) {
  try {
    // Get all progress records
    const { data: progress } = await supabase
      .from('course_progress')
      .select('week_number, lesson_number, status')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .order('week_number', { ascending: true })
      .order('lesson_number', { ascending: true });

    if (!progress || progress.length === 0) {
      // No progress yet, start with Week 1, Lesson 1
      return { weekNumber: 1, lessonNumber: 1 };
    }

    // Find the first incomplete lesson
    const incomplete = progress.find(p => p.status !== 'completed');
    if (incomplete) {
      return { 
        weekNumber: incomplete.week_number, 
        lessonNumber: incomplete.lesson_number 
      };
    }

    // All lessons completed, return the last one
    const last = progress[progress.length - 1];
    return { 
      weekNumber: last.week_number, 
      lessonNumber: last.lesson_number 
    };
  } catch (error) {
    console.error('Error getting next lesson:', error);
    return { weekNumber: 1, lessonNumber: 1 };
  }
}

// Log course activity
export async function logCourseActivity(
  userId: string,
  courseId: string,
  weekNumber: number,
  lessonNumber: number,
  activity: LessonActivity
) {
  try {
    await supabase.rpc('log_course_activity', {
      p_user_id: userId,
      p_course_id: courseId,
      p_week_number: weekNumber,
      p_lesson_number: lessonNumber,
      p_activity_type: activity.type,
      p_activity_data: activity.data || {}
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

// Mark lesson as started
export async function startLesson(
  userId: string,
  courseId: string,
  weekNumber: number,
  lessonNumber: number
) {
  await updateLessonProgress(userId, courseId, weekNumber, lessonNumber, {
    status: 'in_progress'
  });
  
  await logCourseActivity(userId, courseId, weekNumber, lessonNumber, {
    type: 'lesson_start'
  });
}

// Mark lesson as completed
export async function completeLesson(
  userId: string,
  courseId: string,
  weekNumber: number,
  lessonNumber: number,
  timeSpent: number
) {
  await updateLessonProgress(userId, courseId, weekNumber, lessonNumber, {
    status: 'completed',
    videoProgress: 100,
    timeSpent
  });
  
  await logCourseActivity(userId, courseId, weekNumber, lessonNumber, {
    type: 'lesson_complete',
    data: { timeSpent }
  });
}

// Update video progress
export async function updateVideoProgress(
  userId: string,
  courseId: string,
  weekNumber: number,
  lessonNumber: number,
  progressPercentage: number,
  timeWatched: number
) {
  await updateLessonProgress(userId, courseId, weekNumber, lessonNumber, {
    videoProgress: progressPercentage,
    timeSpent: Math.floor(timeWatched / 60) // Convert seconds to minutes
  });

  if (progressPercentage >= 95) {
    await logCourseActivity(userId, courseId, weekNumber, lessonNumber, {
      type: 'video_complete',
      data: { timeWatched }
    });
  }
}

// Get user's course certificate
export async function getUserCertificate(userId: string, courseId: string) {
  try {
    const { data, error } = await supabase
      .from('course_certificates')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows

    return data;
  } catch (error) {
    console.error('Error fetching certificate:', error);
    return null;
  }
}