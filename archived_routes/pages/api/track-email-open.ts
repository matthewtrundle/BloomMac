import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, subscriber } = req.query;

  if (!id || !subscriber) {
    // Return 1x1 transparent pixel
    const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    res.setHeader('Content-Type', 'image/gif');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return res.status(200).send(pixel);
  }

  try {
    // Update the email automation log
    await supabaseAdmin
      .from('email_automation_logs')
      .update({ 
        opened_at: new Date().toISOString(),
        metadata: supabaseAdmin.sql`metadata || jsonb_build_object('ip', ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}, 'user_agent', ${req.headers['user-agent']})`
      })
      .eq('id', id)
      .eq('subscriber_id', subscriber)
      .is('opened_at', null); // Only update if not already opened

    // Log the open event
    await supabaseAdmin
      .from('analytics_events')
      .insert({
        type: 'email_opened',
        page: '/email',
        session_id: `email-${id}`,
        data: {
          email_log_id: id,
          subscriber_id: subscriber
        }
      });

  } catch (error) {
    console.error('Error tracking email open:', error);
  }

  // Always return the tracking pixel
  const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  return res.status(200).send(pixel);
}