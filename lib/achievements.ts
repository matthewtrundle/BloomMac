import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'journey' | 'wellness' | 'community' | 'growth';
  points: number;
}

// Define all available achievements
export const ACHIEVEMENTS: Record<string, Achievement> = {
  welcome_star: {
    id: 'welcome_star',
    name: 'Welcome Star',
    description: 'Started your wellness journey with Bloom',
    icon: '⭐',
    category: 'journey',
    points: 10
  },
  first_week_complete: {
    id: 'first_week_complete',
    name: 'Week One Warrior',
    description: 'Completed your first week of content',
    icon: '🌟',
    category: 'growth',
    points: 25
  },
  wellness_check_in: {
    id: 'wellness_check_in',
    name: 'Self-Care Champion',
    description: 'Completed a wellness check-in',
    icon: '💫',
    category: 'wellness',
    points: 15
  },
  workshop_attendee: {
    id: 'workshop_attendee',
    name: 'Workshop Explorer',
    description: 'Attended your first workshop',
    icon: '🎯',
    category: 'community',
    points: 20
  },
  course_complete: {
    id: 'course_complete',
    name: 'Course Graduate',
    description: 'Completed the full Bloom course',
    icon: '🏆',
    category: 'journey',
    points: 100
  },
  appointment_scheduled: {
    id: 'appointment_scheduled',
    name: 'Connection Seeker',
    description: 'Scheduled a 1:1 appointment',
    icon: '🤝',
    category: 'community',
    points: 20
  }
};

// Award an achievement to a user
export async function awardAchievement(userId: string, achievementId: string) {
  try {
    // Check if user already has this achievement
    const { data: existing } = await supabase
      .from('user_achievements')
      .select('id')
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .single();

    if (existing) {
      return { success: true, alreadyEarned: true };
    }

    // Award the achievement
    const { error } = await supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_id: achievementId,
        earned_at: new Date().toISOString()
      });

    if (error) throw error;

    // Update user's total stars
    await updateUserStars(userId);

    return { success: true, alreadyEarned: false };
  } catch (error) {
    console.error('Error awarding achievement:', error);
    return { success: false, error };
  }
}

// Get all achievements for a user
export async function getUserAchievements(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('achievement_id, earned_at')
      .eq('user_id', userId);

    if (error) throw error;

    // Map to full achievement data
    const achievements = data?.map(record => ({
      ...ACHIEVEMENTS[record.achievement_id],
      earnedAt: record.earned_at
    })) || [];

    return { success: true, achievements };
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return { success: false, achievements: [] };
  }
}

// Update user's total star count
async function updateUserStars(userId: string) {
  try {
    const { data: achievements } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId);

    const totalStars = achievements?.reduce((sum, record) => {
      const achievement = ACHIEVEMENTS[record.achievement_id];
      return sum + (achievement?.points || 0);
    }, 0) || 0;

    // Update user profile with total stars
    await supabase
      .from('user_profiles')
      .update({ total_stars: totalStars })
      .eq('user_id', userId);
  } catch (error) {
    console.error('Error updating star count:', error);
  }
}

// Check and award milestone achievements
export async function checkMilestoneAchievements(userId: string, context: {
  coursesCompleted?: number;
  workshopsAttended?: number;
  wellnessCheckIns?: number;
}) {
  const achievementsToCheck = [];

  // Check for course-related achievements
  if (context.coursesCompleted === 1) {
    achievementsToCheck.push('first_week_complete');
  }
  if (context.coursesCompleted === 6) {
    achievementsToCheck.push('course_complete');
  }

  // Check for workshop achievement
  if (context.workshopsAttended === 1) {
    achievementsToCheck.push('workshop_attendee');
  }

  // Check for wellness achievement
  if (context.wellnessCheckIns === 1) {
    achievementsToCheck.push('wellness_check_in');
  }

  // Award any earned achievements
  for (const achievementId of achievementsToCheck) {
    await awardAchievement(userId, achievementId);
  }
}