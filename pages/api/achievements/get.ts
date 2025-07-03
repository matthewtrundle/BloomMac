import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';

// Define achievements locally to avoid external dependencies for now
const ACHIEVEMENTS: Record<string, any> = {
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
    category: 'journey',
    points: 25
  },
  profile_complete: {
    id: 'profile_complete',
    name: 'Profile Pro',
    description: 'Completed your wellness profile',
    icon: '👤',
    category: 'setup',
    points: 15
  },
  first_workbook: {
    id: 'first_workbook',
    name: 'Reflection Rookie',
    description: 'Submitted your first workbook response',
    icon: '📝',
    category: 'wellness',
    points: 20
  },
  appointment_keeper: {
    id: 'appointment_keeper',
    name: 'Appointment Keeper',
    description: 'Attended your first therapy session',
    icon: '🤝',
    category: 'connection',
    points: 30
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let user = null;
    let authError = null;
    
    // Authentication (same pattern as profile/get.ts)
    if (req.headers.authorization) {
      const token = req.headers.authorization.replace('Bearer ', '');
      
      const supabaseService = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      
      const { data: { user: tokenUser }, error: tokenError } = await supabaseService.auth.getUser(token);
      
      if (tokenUser && !tokenError) {
        user = tokenUser;
      } else {
        authError = tokenError;
      }
    }
    
    if (!user) {
      const supabaseAuth = createServerSupabaseClient({ req, res });
      const result = await supabaseAuth.auth.getUser();
      user = result.data.user;
      authError = result.error;
    }

    if (authError || !user) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        details: authError?.message || 'No user found'
      });
    }

    // Use service role client
    const supabaseService = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Try to fetch user achievements from database
    const { data: userAchievements, error: achievementsError } = await supabaseService
      .from('user_achievements')
      .select('achievement_id, earned_at, points')
      .eq('user_id', user.id);

    if (achievementsError) {
      console.error('Achievements fetch error:', achievementsError);
      // Return basic achievements for new users
      return res.status(200).json({ 
        achievements: [ACHIEVEMENTS.welcome_star] // Everyone gets welcome star
      });
    }

    // Map database achievements to full achievement objects
    const achievements = (userAchievements || []).map(userAch => ({
      ...ACHIEVEMENTS[userAch.achievement_id],
      earnedAt: userAch.earned_at,
      points: userAch.points
    })).filter(Boolean); // Remove any undefined achievements

    // If no achievements found, give them the welcome star
    if (achievements.length === 0) {
      achievements.push({
        ...ACHIEVEMENTS.welcome_star,
        earnedAt: new Date().toISOString()
      });
    }

    return res.status(200).json({ achievements });
  } catch (error: any) {
    console.error('Achievements GET error:', error);
    
    // Return minimal achievements on error
    return res.status(200).json({ 
      achievements: [ACHIEVEMENTS.welcome_star]
    });
  }
}