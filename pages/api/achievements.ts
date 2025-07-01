import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { awardAchievement, getUserAchievements } from '@/lib/achievements';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient({ req, res });

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const userId = session.user.id;

  if (req.method === 'GET') {
    // Get user's achievements
    const result = await getUserAchievements(userId);
    return res.status(200).json(result);
  } else if (req.method === 'POST') {
    // Award achievement
    const { achievementId } = req.body;

    if (!achievementId) {
      return res.status(400).json({ error: 'Achievement ID required' });
    }

    const result = await awardAchievement(userId, achievementId);
    return res.status(200).json(result);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}