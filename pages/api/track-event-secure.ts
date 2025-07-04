import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { z } from 'zod';

// Create anonymous Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Event validation schema
const eventSchema = z.object({
  type: z.enum([
    'page_view',
    'contact_form',
    'booking_click',
    'exit_intent',
    'scroll_banner',
    'resource_download',
    'chatbot_interaction',
    'newsletter_signup',
    'new_mom_signup',
    'button_click',
    'form_start',
    'form_abandon'
  ]),
  page: z.string().max(500),
  sessionId: z.string().max(100).optional(),
  userId: z.string().uuid().optional(),
  data: z.object({
    source: z.string().max(100).optional(),
    service: z.string().max(100).optional(),
    action: z.string().max(100).optional(),
    value: z.string().max(500).optional(),
    referrer: z.string().max(500).optional(),
    element_id: z.string().max(100).optional(),
    element_text: z.string().max(200).optional()
  }).optional()
});

export interface AnalyticsEvent {
  id: string;
  type: string;
  page: string;
  timestamp: string;
  sessionId?: string;
  userId?: string;
  data?: Record<string, any>;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Apply rate limiting
  const identifier = 
    req.headers['x-forwarded-for'] as string || 
    req.headers['x-real-ip'] as string ||
    req.socket.remoteAddress ||
    'anonymous';
    
  const rateLimitResult = await rateLimit(RATE_LIMITS.analytics, identifier);
  
  if (!rateLimitResult.success) {
    // Silently drop events when rate limited (don't block user experience)
    return res.status(200).json({ success: true, rateLimited: true });
  }

  try {
    // Validate input
    let validatedEvent;
    try {
      validatedEvent = eventSchema.parse(req.body);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return res.status(400).json({ 
          error: 'Invalid event data',
          details: validationError.errors 
        });
      }
      throw validationError;
    }

    // Create event data for Supabase
    const eventData = {
      type: validatedEvent.type,
      page: validatedEvent.page,
      session_id: validatedEvent.sessionId || crypto.randomUUID(),
      user_id: validatedEvent.userId || null,
      data: {
        ...validatedEvent.data,
        user_agent: req.headers['user-agent'],
        referrer: validatedEvent.data?.referrer || req.headers.referer || 'direct',
        ip_country: req.headers['cf-ipcountry'] || null, // Cloudflare header
        device_type: getDeviceType(req.headers['user-agent'] || '')
      },
      ip_address: identifier,
      user_agent: req.headers['user-agent'] || '',
      created_at: new Date().toISOString()
    };

    // Save to Supabase (RLS allows public inserts)
    const { data: savedEvent, error } = await supabase
      .from('analytics_events')
      .insert(eventData)
      .select()
      .single();

    if (error) {
      console.error('Error saving analytics event:', error);
      
      // Check if it's a RLS policy error
      if (error.code === '42501') {
        return res.status(500).json({ 
          error: 'Database permissions error' 
        });
      }
      
      // Don't fail the user experience for analytics errors
      return res.status(200).json({ 
        success: true, 
        warning: 'Event not saved' 
      });
    }

    // Log for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics event tracked:', {
        type: savedEvent.type,
        page: savedEvent.page,
        session_id: savedEvent.session_id
      });
    }

    // Process special events asynchronously
    if (validatedEvent.type === 'contact_form' || validatedEvent.type === 'newsletter_signup') {
      // Trigger conversion tracking
      try {
        await supabase
          .from('conversion_events')
          .insert({
            event_type: validatedEvent.type,
            session_id: savedEvent.session_id,
            page: validatedEvent.page,
            value: validatedEvent.type === 'contact_form' ? 100 : 20, // Assign values
            created_at: new Date().toISOString()
          });
      } catch (conversionError) {
        // Log but don't fail
        console.error('Conversion tracking error:', conversionError);
      }
    }

    return res.status(200).json({ 
      success: true, 
      eventId: savedEvent.id 
    });

  } catch (error) {
    console.error('Error tracking event:', error);
    // Don't fail the user experience for analytics errors
    return res.status(200).json({ 
      success: true, 
      warning: 'Event processing error' 
    });
  }
}

// Helper function to detect device type
function getDeviceType(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (/mobile|android|iphone|ipad|phone/i.test(ua)) {
    return 'mobile';
  } else if (/tablet|ipad/i.test(ua)) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}

// SQL needed:
/*
-- Create conversion events table if not exists
CREATE TABLE IF NOT EXISTS conversion_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  session_id VARCHAR(100),
  user_id UUID REFERENCES user_profiles(id),
  page VARCHAR(500),
  value NUMERIC(10,2),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for queries
CREATE INDEX IF NOT EXISTS idx_conversion_events_session ON conversion_events(session_id);
CREATE INDEX IF NOT EXISTS idx_conversion_events_created_at ON conversion_events(created_at);

-- Allow public to insert conversion events
CREATE POLICY "Public can insert conversion events" ON conversion_events
  FOR INSERT TO anon
  WITH CHECK (true);
*/