import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, courseId } = req.body;

    if (!email || !courseId) {
      return res.status(400).json({ error: 'Email and courseId are required' });
    }

    // Check if user has access to this course
    const { data: access, error } = await supabase
      .from('user_course_access')
      .select('*')
      .eq('customer_email', email.toLowerCase().trim())
      .eq('course_id', courseId)
      .eq('payment_status', 'paid')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    const hasAccess = !!access;

    if (hasAccess) {
      // Update last accessed timestamp
      await supabase
        .from('user_course_access')
        .update({ last_accessed_at: new Date().toISOString() })
        .eq('id', access.id);
    }

    res.status(200).json({ 
      hasAccess,
      accessDetails: hasAccess ? {
        grantedAt: access.access_granted_at,
        lastAccessed: access.last_accessed_at,
        progressData: access.progress_data || {}
      } : null
    });

  } catch (error) {
    console.error('Error checking course access:', error);
    res.status(500).json({ 
      error: 'Error checking course access',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}