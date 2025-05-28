import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    // Get activity logs
    const { data: logs, error, count } = await supabaseAdmin
      .from('admin_activity_log')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + Number(limit) - 1);

    if (error) {
      console.error('Error fetching activity logs:', error);
      return res.status(500).json({ error: 'Failed to fetch activity logs' });
    }

    // Get unique action types for filtering
    const { data: actionTypes } = await supabaseAdmin
      .from('admin_activity_log')
      .select('action')
      .order('action');
    
    const uniqueActions = [...new Set(actionTypes?.map(log => log.action) || [])];

    return res.status(200).json({
      logs: logs || [],
      totalCount: count || 0,
      currentPage: Number(page),
      totalPages: Math.ceil((count || 0) / Number(limit)),
      actionTypes: uniqueActions
    });

  } catch (error) {
    console.error('Activity log error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}