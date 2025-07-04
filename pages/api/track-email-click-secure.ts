import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Create anonymous Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Query validation
const querySchema = z.object({
  id: z.string(),
  url: z.string().url(),
  email: z.string().email().optional()
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Validate query parameters
    let validatedQuery;
    try {
      validatedQuery = querySchema.parse(req.query);
    } catch (validationError) {
      // Invalid parameters, redirect to home
      return res.redirect(302, 'https://www.bloompsychologynorthaustin.com');
    }

    const { id, url, email } = validatedQuery;

    // Track email click (don't wait for response)
    const eventData = {
      type: 'email_click',
      page: `/email/${id}`,
      session_id: id,
      data: {
        email_id: id,
        clicked_url: url,
        recipient: email || 'unknown',
        clicked_at: new Date().toISOString(),
        user_agent: req.headers['user-agent'] || 'unknown'
      },
      ip_address: 
        req.headers['x-forwarded-for'] as string || 
        req.headers['x-real-ip'] as string ||
        'unknown',
      user_agent: req.headers['user-agent'] || '',
      created_at: new Date().toISOString()
    };

    // Save to analytics_events asynchronously
    supabase
      .from('analytics_events')
      .insert(eventData)
      .then(({ error }) => {
        if (error) {
          console.error('Error tracking email click:', error);
        }
      });

    // Update email stats if we have a table for it
    supabase
      .from('email_sends')
      .update({ 
        clicked_at: new Date().toISOString(),
        click_count: supabase.sql`click_count + 1`
      })
      .eq('id', id)
      .then(({ error }) => {
        if (error) {
          console.error('Error updating email click stats:', error);
        }
      });

    // Redirect to the target URL
    return res.redirect(302, url);

  } catch (error) {
    console.error('Email click tracking error:', error);
    // On any error, just redirect to home
    return res.redirect(302, 'https://www.bloompsychologynorthaustin.com');
  }
}