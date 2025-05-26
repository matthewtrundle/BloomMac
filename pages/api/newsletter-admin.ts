import { NextApiRequest, NextApiResponse } from 'next';
import { getNewsletterSubscribers, sendNewsletter, type NewsletterSubscriber } from './newsletter-signup';

interface NewsletterStats {
  total_subscribers: number;
  active_subscribers: number;
  unsubscribed: number;
  recent_signups: number;
  signup_sources: {
    source: string;
    count: number;
    percentage: number;
  }[];
  growth_trend: {
    date: string;
    subscribers: number;
  }[];
}

interface SendNewsletterRequest {
  subject: string;
  content: string;
  preview?: string;
}

interface SendNewsletterResponse {
  success: boolean;
  sent: number;
  failed: number;
  message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Basic auth check (in production, use proper authentication)
  const { authorization } = req.headers;
  if (!authorization || authorization !== 'Bearer admin-token-123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    // Get newsletter statistics and subscriber list
    return getNewsletterStats(req, res);
  } else if (req.method === 'POST') {
    // Send newsletter to all subscribers
    return sendNewsletterToSubscribers(req, res);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}

const getNewsletterStats = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const subscribers = getNewsletterSubscribers();
    const activeSubscribers = subscribers.filter(sub => sub.status === 'active');
    const unsubscribed = subscribers.filter(sub => sub.status === 'unsubscribed');
    
    // Calculate recent signups (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentSignups = subscribers.filter(sub => 
      new Date(sub.timestamp) > sevenDaysAgo && sub.status === 'active'
    );

    // Calculate signup sources
    const sourceCounts = activeSubscribers.reduce((acc, sub) => {
      acc[sub.signupSource] = (acc[sub.signupSource] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const signupSources = Object.entries(sourceCounts).map(([source, count]) => ({
      source,
      count,
      percentage: Math.round((count / activeSubscribers.length) * 100)
    })).sort((a, b) => b.count - a.count);

    // Generate growth trend (last 30 days)
    const growthTrend = generateGrowthTrend(subscribers);

    const stats: NewsletterStats = {
      total_subscribers: subscribers.length,
      active_subscribers: activeSubscribers.length,
      unsubscribed: unsubscribed.length,
      recent_signups: recentSignups.length,
      signup_sources: signupSources,
      growth_trend: growthTrend
    };

    return res.status(200).json({
      stats,
      subscribers: activeSubscribers.map(sub => ({
        id: sub.id,
        email: sub.email,
        firstName: sub.firstName,
        lastName: sub.lastName,
        signupSource: sub.signupSource,
        timestamp: sub.timestamp,
        interests: sub.interests
      }))
    });

  } catch (error) {
    console.error('Newsletter stats error:', error);
    return res.status(500).json({ error: 'Failed to get newsletter statistics' });
  }
};

const sendNewsletterToSubscribers = async (
  req: NextApiRequest, 
  res: NextApiResponse<SendNewsletterResponse | { error: string }>
) => {
  try {
    const { subject, content, preview }: SendNewsletterRequest = req.body;

    if (!subject || !content) {
      return res.status(400).json({ error: 'Subject and content are required' });
    }

    // Format the newsletter content
    const formattedContent = formatNewsletterContent(content, preview);

    // Send to all active subscribers
    const result = await sendNewsletter(subject, formattedContent);

    console.log('Newsletter sent:', {
      subject,
      sent: result.sent,
      failed: result.failed,
      timestamp: new Date().toISOString()
    });

    return res.status(200).json({
      success: true,
      sent: result.sent,
      failed: result.failed,
      message: `Newsletter sent successfully to ${result.sent} subscribers${result.failed > 0 ? ` (${result.failed} failed)` : ''}`
    });

  } catch (error) {
    console.error('Send newsletter error:', error);
    return res.status(500).json({ error: 'Failed to send newsletter' });
  }
};

const generateGrowthTrend = (subscribers: NewsletterSubscriber[]) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const dailyCounts = new Map<string, number>();

  // Initialize with zeros
  for (let i = 30; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    dailyCounts.set(dateStr, 0);
  }

  // Count cumulative subscribers by day
  subscribers
    .filter(sub => new Date(sub.timestamp) > thirtyDaysAgo)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .forEach((sub, index) => {
      const dateStr = sub.timestamp.split('T')[0];
      if (dailyCounts.has(dateStr)) {
        dailyCounts.set(dateStr, index + 1);
      }
    });

  return Array.from(dailyCounts.entries()).map(([date, subscribers]) => ({
    date,
    subscribers
  }));
};

const formatNewsletterContent = (content: string, preview?: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bloom Psychology Newsletter</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #6B21A8 0%, #A855F7 100%); padding: 30px 20px; text-align: center;">
          <img src="https://bloompsychologynorthaustin.com/images/Logo/logo.jpg" alt="Bloom Psychology" style="max-width: 120px; height: auto; margin-bottom: 15px; background: white; padding: 8px; border-radius: 6px;">
          <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 600;">Weekly Mental Health Insights</h1>
          <p style="color: #E9D5FF; margin: 5px 0 0 0; font-size: 14px;">From Dr. Jana Rundle & The Bloom Psychology Team</p>
        </div>

        <!-- Preview Text -->
        ${preview ? `
        <div style="background-color: #F3F4F6; padding: 20px; text-align: center; border-bottom: 1px solid #E5E7EB;">
          <p style="margin: 0; font-size: 16px; color: #6B7280; font-style: italic;">${preview}</p>
        </div>
        ` : ''}

        <!-- Main Content -->
        <div style="padding: 40px 30px;">
          ${content}
        </div>

        <!-- Footer -->
        <div style="background-color: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
          <div style="margin-bottom: 20px;">
            <p style="margin: 0; color: #6B7280; font-size: 14px;">
              <strong>Bloom Psychology</strong><br>
              13706 N Highway 183, Suite 114<br>
              Austin, TX 78750<br>
              (512) 898-9510
            </p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <a href="https://bloompsychologynorthaustin.com" style="color: #A855F7; text-decoration: none; margin: 0 8px; font-size: 14px;">Website</a>
            <a href="https://bloompsychologynorthaustin.com/book" style="color: #A855F7; text-decoration: none; margin: 0 8px; font-size: 14px;">Book Consultation</a>
            <a href="https://bloompsychologynorthaustin.com/blog" style="color: #A855F7; text-decoration: none; margin: 0 8px; font-size: 14px;">Blog</a>
            <a href="https://bloompsychologynorthaustin.com/contact" style="color: #A855F7; text-decoration: none; margin: 0 8px; font-size: 14px;">Contact</a>
          </div>
          
          <p style="margin: 0; color: #9CA3AF; font-size: 12px;">
            You're receiving this because you subscribed to our newsletter. 
            <a href="mailto:jana@bloompsychologynorthaustin.com?subject=Unsubscribe" style="color: #9CA3AF;">Unsubscribe</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};