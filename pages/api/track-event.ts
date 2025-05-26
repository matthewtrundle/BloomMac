import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

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

// File-based storage for analytics (in production, use a proper database)
const ANALYTICS_FILE = path.join(process.cwd(), 'data', 'analytics.json');

async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

async function getAnalyticsData(): Promise<AnalyticsEvent[]> {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(ANALYTICS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveAnalyticsData(events: AnalyticsEvent[]): Promise<void> {
  await ensureDataDirectory();
  
  // Keep only last 30 days of data to prevent file from growing too large
  const cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recentEvents = events.filter(e => new Date(e.timestamp) > cutoffDate);
  
  await fs.writeFile(ANALYTICS_FILE, JSON.stringify(recentEvents, null, 2));
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

    // Create full event
    const fullEvent: AnalyticsEvent = {
      ...event,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      timestamp: new Date().toISOString(),
      data: {
        ...event.data,
        userAgent: req.headers['user-agent'],
        referrer: req.headers.referer || 'direct'
      }
    };

    // Get existing events and add new one
    const events = await getAnalyticsData();
    events.push(fullEvent);

    // Save updated events
    await saveAnalyticsData(events);

    // Log for debugging
    console.log('Analytics event tracked:', {
      type: fullEvent.type,
      page: fullEvent.page,
      timestamp: fullEvent.timestamp
    });

    return res.status(200).json({ 
      success: true, 
      eventId: fullEvent.id 
    });

  } catch (error) {
    console.error('Error tracking event:', error);
    return res.status(500).json({ error: 'Failed to track event' });
  }
}