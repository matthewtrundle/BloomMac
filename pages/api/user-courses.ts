import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.query;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email parameter is required' });
    }

    // Get user's course enrollments
    const { data: enrollments, error: enrollmentError } = await supabase
      .from('course_enrollments')
      .select('*')
      .eq('user_email', email.toLowerCase())
      .eq('access_granted', true)
      .order('enrolled_at', { ascending: false });

    if (enrollmentError) {
      console.error('Error fetching enrollments:', enrollmentError);
      return res.status(500).json({ error: 'Failed to fetch enrollments' });
    }

    // Get progress data for each enrollment
    const enrollmentsWithProgress = await Promise.all(
      (enrollments || []).map(async (enrollment) => {
        const { data: progressData } = await supabase
          .from('course_progress')
          .select('*')
          .eq('enrollment_id', enrollment.id);

        // Calculate overall progress
        const progress = progressData?.reduce((acc: any, item: any) => {
          if (!acc[item.module_id]) {
            acc[item.module_id] = {};
          }
          acc[item.module_id][item.lesson_id] = {
            completed: item.completed,
            progress_percentage: item.progress_percentage,
            time_spent: item.time_spent,
            completed_at: item.completed_at
          };
          return acc;
        }, {});

        // Calculate total time spent
        const totalTimeSpent = progressData?.reduce((total: number, item: any) => {
          return total + (item.time_spent || 0);
        }, 0) || 0;

        // Find last accessed date
        const lastAccessed = progressData?.length > 0 
          ? Math.max(...progressData.map((item: any) => new Date(item.updated_at).getTime()))
          : new Date(enrollment.enrolled_at).getTime();

        return {
          ...enrollment,
          progress: {
            ...progress,
            totalTimeSpent,
            lastAccessed: new Date(lastAccessed).toISOString()
          }
        };
      })
    );

    res.status(200).json({
      success: true,
      enrollments: enrollmentsWithProgress
    });

  } catch (error) {
    console.error('User courses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}