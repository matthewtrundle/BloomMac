import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'PATCH') {
    try {
      const updates: any = {};
      
      if (req.body.status) {
        updates.status = req.body.status;
        if (req.body.status === 'replied') {
          updates.replied_at = new Date().toISOString();
        }
      }
      
      if (req.body.notes !== undefined) {
        updates.notes = req.body.notes;
      }

      const { data, error } = await supabaseAdmin
        .from('contact_submissions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json(data);
    } catch (error) {
      console.error('Error updating contact:', error);
      return res.status(500).json({ error: 'Failed to update contact' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { error } = await supabaseAdmin
        .from('contact_submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return res.status(204).end();
    } catch (error) {
      console.error('Error deleting contact:', error);
      return res.status(500).json({ error: 'Failed to delete contact' });
    }
  }

  res.setHeader('Allow', ['PATCH', 'DELETE']);
  return res.status(405).json({ error: 'Method not allowed' });
}