import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, subscriber, url } = req.query;

  if (!id || !subscriber || !url) {
    return res.redirect('/');
  }

  try {
    // Update the email automation log
    await supabaseAdmin
      .from('email_automation_logs')
      .update({ 
        clicked_at: new Date().toISOString(),
        metadata: supabaseAdmin.sql`metadata || jsonb_build_object('clicked_url', ${url}, 'click_ip', ${req.headers['x-forwarded-for'] || req.socket.remoteAddress})`
      })
      .eq('id', id)
      .eq('subscriber_id', subscriber);

    // Log the click event
    await supabaseAdmin
      .from('analytics_events')
      .insert({
        type: 'email_clicked',
        page: '/email',
        session_id: `email-${id}`,
        data: {
          email_log_id: id,
          subscriber_id: subscriber,
          clicked_url: url
        }
      });

  } catch (error) {
    console.error('Error tracking email click:', error);
  }

  // Redirect to the actual URL
  return res.redirect(decodeURIComponent(url as string));
}