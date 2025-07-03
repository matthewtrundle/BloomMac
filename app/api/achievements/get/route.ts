import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Default achievements that all users can earn
const ACHIEVEMENT_TYPES = {
  FIRST_LOGIN: {
    id: 'first-login',
    name: 'Welcome Explorer',
    description: 'Started your wellness journey',
    icon: '🌟',
    points: 10
  },
  FIRST_COURSE: {
    id: 'first-course',
    name: 'Learning Begins',
    description: 'Enrolled in your first course',
    icon: '📚',
    points: 20
  },
  FIRST_WORKBOOK: {
    id: 'first-workbook',
    name: 'Reflection Master',
    description: 'Completed your first workbook',
    icon: '📝',
    points: 15
  },
  COURSE_COMPLETE: {
    id: 'course-complete',
    name: 'Course Champion',
    description: 'Completed an entire course',
    icon: '🎓',
    points: 50
  },
  APPOINTMENT_BOOKED: {
    id: 'appointment-booked',
    name: 'Connection Seeker',
    description: 'Booked your first appointment',
    icon: '🤝',
    points: 25
  },
  WEEK_STREAK: {
    id: 'week-streak',
    name: 'Consistency Star',
    description: 'Active for 7 days in a row',
    icon: '🔥',
    points: 30
  }
};

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
    
    // Try to get user achievements from database
    const { data: userAchievements, error } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', session.user.id)
      .order('earned_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching achievements:', error);
      
      // If table doesn't exist, return sample achievements
      if (error.code === '42P01') {
        // Check what the user has done to generate achievements
        const achievements = [];
        
        // Always give welcome achievement
        achievements.push({
          ...ACHIEVEMENT_TYPES.FIRST_LOGIN,
          earnedAt: session.user.created_at
        });
        
        // Check if user has enrolled in any courses
        const { data: enrollments } = await supabase
          .from('course_enrollments')
          .select('id')
          .eq('user_id', session.user.id)
          .limit(1);
        
        if (enrollments && enrollments.length > 0) {
          achievements.push({
            ...ACHIEVEMENT_TYPES.FIRST_COURSE,
            earnedAt: new Date().toISOString()
          });
        }
        
        // Check if user has completed any workbooks
        const { data: workbooks } = await supabase
          .from('workbook_responses')
          .select('id')
          .eq('user_id', session.user.id)
          .eq('is_submitted', true)
          .limit(1);
        
        if (workbooks && workbooks.length > 0) {
          achievements.push({
            ...ACHIEVEMENT_TYPES.FIRST_WORKBOOK,
            earnedAt: new Date().toISOString()
          });
        }
        
        return NextResponse.json({
          success: true,
          achievements
        });
      }
      
      throw error;
    }
    
    // Format achievements with proper structure
    const formattedAchievements = userAchievements?.map(achievement => ({
      id: achievement.id,
      name: achievement.name || ACHIEVEMENT_TYPES[achievement.type as keyof typeof ACHIEVEMENT_TYPES]?.name || 'Achievement',
      description: achievement.description || ACHIEVEMENT_TYPES[achievement.type as keyof typeof ACHIEVEMENT_TYPES]?.description || '',
      icon: achievement.icon || ACHIEVEMENT_TYPES[achievement.type as keyof typeof ACHIEVEMENT_TYPES]?.icon || '⭐',
      points: achievement.points || 10,
      earnedAt: achievement.earned_at
    })) || [];
    
    return NextResponse.json({
      success: true,
      achievements: formattedAchievements
    });
    
  } catch (error) {
    console.error('Error in achievements API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch achievements' },
      { status: 500 }
    );
  }
}