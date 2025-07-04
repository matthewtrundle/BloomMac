import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Create anonymous Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 1x1 transparent pixel
const PIXEL = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { id, email } = req.query;

    if (!id || !email) {
      // Return pixel anyway to not break email clients
      res.setHeader('Content-Type', 'image/gif');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      return res.status(200).send(PIXEL);
    }

    // Track email open
    const eventData = {
      type: 'email_open',
      page: `/email/${id}`,
      session_id: String(id),
      data: {
        email_id: String(id),
        recipient: String(email),
        opened_at: new Date().toISOString(),
        user_agent: req.headers['user-agent'] || 'unknown',
        ip_country: req.headers['cf-ipcountry'] || null
      },
      ip_address: 
        req.headers['x-forwarded-for'] as string || 
        req.headers['x-real-ip'] as string ||
        'unknown',
      user_agent: req.headers['user-agent'] || '',
      created_at: new Date().toISOString()
    };

    // Save to analytics_events (don't wait for response)
    supabase
      .from('analytics_events')
      .insert(eventData)
      .then(({ error }) => {
        if (error) {
          console.error('Error tracking email open:', error);
        }
      });

    // Update email stats if we have a table for it
    supabase
      .from('email_sends')
      .update({ 
        opened_at: new Date().toISOString(),
        open_count: supabase.sql`open_count + 1`
      })
      .eq('id', String(id))
      .then(({ error }) => {
        if (error) {
          console.error('Error updating email stats:', error);
        }
      });

  } catch (error) {
    console.error('Email tracking error:', error);
  }

  // Always return the pixel
  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  return res.status(200).send(PIXEL);
}