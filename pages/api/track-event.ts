import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabase';

export interface AnalyticsEvent {
  id: string;
  type: 'page_view' | 'contact_form' | 'booking_click' | 'exit_intent' | 'scroll_banner' | 'resource_download' | 'chatbot_interaction' | 'newsletter_signup' | 'new_mom_signup';
  page: string;
  timestamp: string;
  sessionId?: string;
  userId?: string;
  data?: {
    source?: string;
    service?: string;
    action?: string;
    value?: string;
    referrer?: string;
    userAgent?: string;
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const event = req.body as Omit<AnalyticsEvent, 'id' | 'timestamp'>;
    
    // Validate event
    if (!event.type || !event.page) {
      return res.status(400).json({ error: 'Missing required fields: type and page' });
    }

    // Create event data for Supabase
    const eventData = {
      type: event.type,
      page: event.page,
      session_id: event.sessionId || null,
      user_id: event.userId || null,
      data: {
        ...event.data,
        userAgent: req.headers['user-agent'],
        referrer: req.headers.referer || 'direct'
      }
    };

    // Save to Supabase
    const { data: savedEvent, error } = await supabaseAdmin
      .from('analytics_events')
      .insert(eventData)
      .select()
      .single();

    if (error) {
      console.error('Error saving analytics event:', error);
      return res.status(500).json({ error: 'Failed to track event' });
    }

    // Log for debugging
    console.log('Analytics event tracked:', {
      type: savedEvent.type,
      page: savedEvent.page,
      timestamp: savedEvent.timestamp
    });

    return res.status(200).json({ 
      success: true, 
      eventId: savedEvent.id 
    });

  } catch (error) {
    console.error('Error tracking event:', error);
    return res.status(500).json({ error: 'Failed to track event' });
  }
}