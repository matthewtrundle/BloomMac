import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Fetch all contact submissions
      const { data: contacts, error } = await supabaseAdmin
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate stats
      const total = contacts?.length || 0;
      const newCount = contacts?.filter(c => c.status === 'new').length || 0;
      const repliedCount = contacts?.filter(c => c.status === 'replied').length || 0;
      const responseRate = total > 0 ? Math.round((repliedCount / total) * 100) : 0;

      return res.status(200).json({
        contacts: contacts || [],
        stats: {
          total,
          new: newCount,
          replied: repliedCount,
          responseRate
        }
      });
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return res.status(500).json({ error: 'Failed to fetch contacts' });
    }
  }

  res.setHeader('Allow', ['GET']);
  return res.status(405).json({ error: 'Method not allowed' });
}