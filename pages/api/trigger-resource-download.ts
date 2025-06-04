import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, firstName, lastName, resourceName, downloadLink } = req.body;

  if (!email || !resourceName) {
    return res.status(400).json({ error: 'Email and resource name are required' });
  }

  try {
    // 1. Add or update subscriber
    const { data: subscriber, error: subscriberError } = await supabaseAdmin
      .from('subscribers')
      .upsert({
        email,
        first_name: firstName || '',
        last_name: lastName || '',
        status: 'active',
        source: 'resource_download',
        metadata: {
          last_resource_downloaded: resourceName,
          download_date: new Date().toISOString()
        }
      }, {
        onConflict: 'email'
      })
      .select()
      .single();

    if (subscriberError) {
      console.error('Error adding subscriber:', subscriberError);
      return res.status(500).json({ error: 'Failed to add subscriber' });
    }

    // 2. Log the resource download event
    await supabaseAdmin
      .from('analytics_events')
      .insert({
        event_type: 'resource_download',
        event_data: {
          resource_name: resourceName,
          email: email,
          subscriber_id: subscriber.id
        },
        metadata: {
          download_link: downloadLink,
          timestamp: new Date().toISOString()
        }
      });

    // 3. Create a trigger event for the email automation
    // The cron job will pick this up and send the appropriate emails
    await supabaseAdmin
      .from('email_automation_triggers')
      .insert({
        subscriber_id: subscriber.id,
        trigger_type: 'resource_download',
        trigger_data: {
          resource_name: resourceName,
          download_link: downloadLink || `/resources/${resourceName.toLowerCase().replace(/\s+/g, '-')}`
        },
        triggered_at: new Date().toISOString()
      });

    // 4. Send immediate welcome email with resource
    // This is handled by the email automation system based on the trigger above

    return res.status(200).json({ 
      success: true,
      message: 'Resource download tracked and email sequence triggered',
      subscriber_id: subscriber.id
    });

  } catch (error) {
    console.error('Error triggering resource download sequence:', error);
    return res.status(500).json({ 
      error: 'Failed to trigger resource download sequence',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}