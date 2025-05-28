import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabase';

interface EmailAnalytics {
  overview: {
    totalSent: number;
    totalOpened: number;
    totalClicked: number;
    totalUnsubscribed: number;
    avgOpenRate: number;
    avgClickRate: number;
    period: string;
  };
  campaigns: {
    id: string;
    subject: string;
    sentAt: string;
    sent: number;
    opened: number;
    clicked: number;
    openRate: number;
    clickRate: number;
    status: 'sent' | 'scheduled' | 'draft';
  }[];
  subscriberMetrics: {
    totalActive: number;
    newThisMonth: number;
    unsubscribedThisMonth: number;
    growthRate: number;
    mostEngaged: {
      email: string;
      opens: number;
      clicks: number;
    }[];
  };
  engagement: {
    byHour: { hour: number; opens: number }[];
    byDay: { day: string; opens: number }[];
    bestSendTime: string;
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { range = '30d' } = req.query;
    
    // Calculate date range
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    
    // Get email queue data
    const { data: emailsSent, error: emailError } = await supabaseAdmin
      .from('email_queue')
      .select('*')
      .gte('created_at', startDate)
      .order('created_at', { ascending: false });
      
    if (emailError) {
      console.error('Error fetching email data:', emailError);
    }
    
    // Get subscriber data
    const { data: subscribers, error: subError } = await supabaseAdmin
      .from('subscribers')
      .select('*');
      
    if (subError) {
      console.error('Error fetching subscribers:', subError);
    }
    
    // Get recent subscribes/unsubscribes
    const { data: recentSubs } = await supabaseAdmin
      .from('subscribers')
      .select('*')
      .gte('created_at', startDate)
      .eq('status', 'active');
      
    const { data: recentUnsubs } = await supabaseAdmin
      .from('subscribers')
      .select('*')
      .gte('updated_at', startDate)
      .eq('status', 'unsubscribed');
    
    // Calculate metrics
    const totalSent = emailsSent?.length || 0;
    const sentEmails = emailsSent?.filter(e => e.status === 'sent') || [];
    const totalOpened = sentEmails.filter(e => e.metadata?.opened).length;
    const totalClicked = sentEmails.filter(e => e.metadata?.clicked).length;
    const totalActive = subscribers?.filter(s => s.status === 'active').length || 0;
    
    const avgOpenRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0;
    const avgClickRate = totalOpened > 0 ? (totalClicked / totalOpened) * 100 : 0;
    
    // Generate campaign data (simulated for now)
    const campaigns = generateCampaignData(emailsSent || []);
    
    // Generate engagement patterns
    const engagement = generateEngagementData(sentEmails);
    
    const response: EmailAnalytics = {
      overview: {
        totalSent,
        totalOpened,
        totalClicked,
        totalUnsubscribed: recentUnsubs?.length || 0,
        avgOpenRate: Math.round(avgOpenRate * 10) / 10,
        avgClickRate: Math.round(avgClickRate * 10) / 10,
        period: `Last ${days} days`
      },
      campaigns,
      subscriberMetrics: {
        totalActive,
        newThisMonth: recentSubs?.length || 0,
        unsubscribedThisMonth: recentUnsubs?.length || 0,
        growthRate: calculateGrowthRate(recentSubs?.length || 0, recentUnsubs?.length || 0),
        mostEngaged: getMostEngagedSubscribers(sentEmails)
      },
      engagement
    };
    
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(response);
    
  } catch (error) {
    console.error('Email analytics error:', error);
    return res.status(500).json({ error: 'Failed to generate email analytics' });
  }
}

function generateCampaignData(emails: any[]): EmailAnalytics['campaigns'] {
  // Group emails by subject/campaign
  const campaigns = new Map<string, any>();
  
  emails.forEach(email => {
    const subject = email.subject || 'Newsletter';
    if (!campaigns.has(subject)) {
      campaigns.set(subject, {
        id: `campaign-${campaigns.size + 1}`,
        subject,
        sentAt: email.created_at,
        emails: []
      });
    }
    campaigns.get(subject).emails.push(email);
  });
  
  return Array.from(campaigns.values()).map(campaign => {
    const sent = campaign.emails.filter((e: any) => e.status === 'sent').length;
    const opened = campaign.emails.filter((e: any) => e.metadata?.opened).length;
    const clicked = campaign.emails.filter((e: any) => e.metadata?.clicked).length;
    
    return {
      id: campaign.id,
      subject: campaign.subject,
      sentAt: campaign.sentAt,
      sent,
      opened,
      clicked,
      openRate: sent > 0 ? Math.round((opened / sent) * 1000) / 10 : 0,
      clickRate: opened > 0 ? Math.round((clicked / opened) * 1000) / 10 : 0,
      status: 'sent' as const
    };
  }).slice(0, 10);
}

function generateEngagementData(emails: any[]): EmailAnalytics['engagement'] {
  // Generate hourly distribution with zeros for now (no real data yet)
  const hourlyData = new Array(24).fill(0).map((_, hour) => ({
    hour,
    opens: 0
  }));
  
  // Generate daily distribution with zeros
  const dailyData = [
    { day: 'Mon', opens: 0 },
    { day: 'Tue', opens: 0 },
    { day: 'Wed', opens: 0 },
    { day: 'Thu', opens: 0 },
    { day: 'Fri', opens: 0 },
    { day: 'Sat', opens: 0 },
    { day: 'Sun', opens: 0 }
  ];
  
  return {
    byHour: hourlyData,
    byDay: dailyData,
    bestSendTime: 'Not enough data'
  };
}

function calculateGrowthRate(newSubs: number, unsubs: number): number {
  const netGrowth = newSubs - unsubs;
  const growthRate = newSubs > 0 ? (netGrowth / newSubs) * 100 : 0;
  return Math.round(growthRate * 10) / 10;
}

function getMostEngagedSubscribers(emails: any[]): any[] {
  // Return empty array until we have real engagement data
  return [];
}