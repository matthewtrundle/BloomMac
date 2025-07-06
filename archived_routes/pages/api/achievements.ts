import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Create authenticated Supabase client
    const supabase = createServerSupabaseClient({ req, res });
    
    // Get the user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { achievementId } = req.body;

    // For now, just log the achievement
    // In production, you would save this to a database
    console.log('Achievement Awarded:', {
      userId: user.id,
      achievementId,
      timestamp: new Date().toISOString()
    });

    // Return success
    res.status(200).json({ 
      success: true,
      achievement: {
        id: achievementId,
        name: achievementId === 'welcome_star' ? 'Welcome Star' : achievementId,
        description: 'Achievement unlocked!'
      }
    });
  } catch (error) {
    console.error('Achievement error:', error);
    res.status(500).json({ error: 'Failed to award achievement' });
  }
}