import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { withAuth } from '@/lib/auth-secure';
import { z } from 'zod';

// Create authenticated client
const getAuthenticatedSupabase = (req: NextApiRequest) => {
  const token = req.cookies['sb-access-token'];
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    }
  );
};

// Query validation
const querySchema = z.object({
  range: z.enum(['7d', '30d', '90d']).default('30d')
});

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
    topDomains: {
      domain: string;
      count: number;
      percentage: number;
    }[];
  };
  engagement: {
    byHour: { hour: number; opens: number }[];
    byDay: { day: string; opens: number }[];
    bestSendTime: string;
  };
}

async function handler(req: NextApiRequest, res: NextApiResponse, user: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const supabase = getAuthenticatedSupabase(req);

  // Check if user has admin role
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.userId)
    .single();

  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  try {
    // Validate query parameters
    const query = querySchema.parse(req.query);
    const { range } = query;
    
    // Calculate date range
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    
    // Get email analytics using RPC function
    const { data: analytics, error: analyticsError } = await supabase
      .rpc('get_email_analytics', { 
        days_ago: days 
      });
      
    if (analyticsError) {
      console.error('Error fetching email analytics:', analyticsError);
      throw analyticsError;
    }
    
    // Get newsletter campaigns
    const { data: campaigns, error: campaignsError } = await supabase
      .from('newsletter_sends')
      .select('*')
      .gte('created_at', startDate)
      .order('created_at', { ascending: false })
      .limit(10);
      
    if (campaignsError) {
      console.error('Error fetching campaigns:', campaignsError);
    }
    
    // Get subscriber metrics
    const { data: subscriberStats } = await supabase
      .rpc('get_subscriber_stats', { days_ago: days });
    
    // Get engagement patterns from email events
    const { data: engagementData } = await supabase
      .rpc('get_email_engagement_patterns', { days_ago: days });
    
    // Format campaign data
    const formattedCampaigns = (campaigns || []).map(campaign => ({
      id: campaign.id,
      subject: campaign.subject,
      sentAt: campaign.sent_at || campaign.created_at,
      sent: campaign.sent_count || 0,
      opened: campaign.opened_count || 0,
      clicked: campaign.clicked_count || 0,
      openRate: campaign.sent_count > 0 
        ? Math.round((campaign.opened_count / campaign.sent_count) * 1000) / 10 
        : 0,
      clickRate: campaign.opened_count > 0 
        ? Math.round((campaign.clicked_count / campaign.opened_count) * 1000) / 10 
        : 0,
      status: campaign.status as 'sent' | 'scheduled' | 'draft'
    }));
    
    const response: EmailAnalytics = {
      overview: {
        totalSent: analytics?.total_sent || 0,
        totalOpened: analytics?.total_opened || 0,
        totalClicked: analytics?.total_clicked || 0,
        totalUnsubscribed: analytics?.total_unsubscribed || 0,
        avgOpenRate: analytics?.avg_open_rate || 0,
        avgClickRate: analytics?.avg_click_rate || 0,
        period: `Last ${days} days`
      },
      campaigns: formattedCampaigns,
      subscriberMetrics: {
        totalActive: subscriberStats?.total_active || 0,
        newThisMonth: subscriberStats?.new_subscribers || 0,
        unsubscribedThisMonth: subscriberStats?.unsubscribed || 0,
        growthRate: subscriberStats?.growth_rate || 0,
        topDomains: subscriberStats?.top_domains || []
      },
      engagement: {
        byHour: engagementData?.hourly_distribution || generateDefaultHourly(),
        byDay: engagementData?.daily_distribution || generateDefaultDaily(),
        bestSendTime: engagementData?.best_send_time || 'Tuesday 10:00 AM'
      }
    };
    
    // Log admin activity
    await supabase
      .from('admin_activity_log')
      .insert({
        action: 'view_email_analytics',
        entity_type: 'analytics',
        details: {
          range: range,
          campaigns_viewed: formattedCampaigns.length
        }
      });
    
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(response);
    
  } catch (error) {
    console.error('Email analytics error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Invalid parameters',
        details: error.errors 
      });
    }
    
    return res.status(500).json({ error: 'Failed to generate email analytics' });
  }
}

// Export with auth wrapper
export default withAuth(handler);

// Helper functions
function generateDefaultHourly() {
  return new Array(24).fill(0).map((_, hour) => ({
    hour,
    opens: 0
  }));
}

function generateDefaultDaily() {
  return [
    { day: 'Mon', opens: 0 },
    { day: 'Tue', opens: 0 },
    { day: 'Wed', opens: 0 },
    { day: 'Thu', opens: 0 },
    { day: 'Fri', opens: 0 },
    { day: 'Sat', opens: 0 },
    { day: 'Sun', opens: 0 }
  ];
}

// SQL functions needed:
/*
-- Get email analytics
CREATE OR REPLACE FUNCTION get_email_analytics(days_ago INTEGER)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  WITH email_stats AS (
    SELECT 
      COUNT(*) FILTER (WHERE type = 'email_sent') as total_sent,
      COUNT(*) FILTER (WHERE type = 'email_open') as total_opened,
      COUNT(*) FILTER (WHERE type = 'email_click') as total_clicked,
      COUNT(*) FILTER (WHERE type = 'newsletter_unsubscribe' AND data->>'source' = 'email_link') as total_unsubscribed
    FROM analytics_events
    WHERE created_at >= NOW() - INTERVAL '1 day' * days_ago
      AND type IN ('email_sent', 'email_open', 'email_click', 'newsletter_unsubscribe')
  )
  SELECT jsonb_build_object(
    'total_sent', COALESCE(total_sent, 0),
    'total_opened', COALESCE(total_opened, 0),
    'total_clicked', COALESCE(total_clicked, 0),
    'total_unsubscribed', COALESCE(total_unsubscribed, 0),
    'avg_open_rate', 
      CASE 
        WHEN total_sent > 0 
        THEN ROUND((total_opened::NUMERIC / total_sent) * 100, 1)
        ELSE 0
      END,
    'avg_click_rate',
      CASE 
        WHEN total_opened > 0 
        THEN ROUND((total_clicked::NUMERIC / total_opened) * 100, 1)
        ELSE 0
      END
  ) INTO result
  FROM email_stats;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get subscriber stats
CREATE OR REPLACE FUNCTION get_subscriber_stats(days_ago INTEGER)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  WITH stats AS (
    SELECT 
      COUNT(*) FILTER (WHERE status = 'active') as total_active,
      COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '1 day' * days_ago) as new_subscribers,
      COUNT(*) FILTER (WHERE status = 'unsubscribed' AND unsubscribed_at >= NOW() - INTERVAL '1 day' * days_ago) as unsubscribed
    FROM subscribers
  ),
  domains AS (
    SELECT 
      split_part(email, '@', 2) as domain,
      COUNT(*) as count
    FROM subscribers
    WHERE status = 'active'
    GROUP BY domain
    ORDER BY count DESC
    LIMIT 5
  )
  SELECT jsonb_build_object(
    'total_active', stats.total_active,
    'new_subscribers', stats.new_subscribers,
    'unsubscribed', stats.unsubscribed,
    'growth_rate', 
      CASE 
        WHEN stats.new_subscribers > 0 
        THEN ROUND(((stats.new_subscribers - stats.unsubscribed)::NUMERIC / stats.new_subscribers) * 100, 1)
        ELSE 0
      END,
    'top_domains', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'domain', domain,
          'count', count,
          'percentage', ROUND((count::NUMERIC / stats.total_active) * 100, 1)
        )
      )
      FROM domains
    )
  ) INTO result
  FROM stats;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get email engagement patterns
CREATE OR REPLACE FUNCTION get_email_engagement_patterns(days_ago INTEGER)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  WITH hourly AS (
    SELECT 
      EXTRACT(HOUR FROM created_at) as hour,
      COUNT(*) as opens
    FROM analytics_events
    WHERE type = 'email_open'
      AND created_at >= NOW() - INTERVAL '1 day' * days_ago
    GROUP BY hour
  ),
  daily AS (
    SELECT 
      TO_CHAR(created_at, 'Dy') as day,
      COUNT(*) as opens
    FROM analytics_events
    WHERE type = 'email_open'
      AND created_at >= NOW() - INTERVAL '1 day' * days_ago
    GROUP BY day
  )
  SELECT jsonb_build_object(
    'hourly_distribution', (
      SELECT jsonb_agg(
        jsonb_build_object('hour', hour::INTEGER, 'opens', opens)
        ORDER BY hour
      )
      FROM generate_series(0, 23) as hour
      LEFT JOIN hourly USING (hour)
    ),
    'daily_distribution', (
      SELECT jsonb_agg(
        jsonb_build_object('day', day, 'opens', COALESCE(opens, 0))
      )
      FROM (VALUES ('Mon'), ('Tue'), ('Wed'), ('Thu'), ('Fri'), ('Sat'), ('Sun')) as d(day)
      LEFT JOIN daily USING (day)
    ),
    'best_send_time', 'Tuesday 10:00 AM' -- Placeholder
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update newsletter_sends table
ALTER TABLE newsletter_sends
ADD COLUMN IF NOT EXISTS opened_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS clicked_count INTEGER DEFAULT 0;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_email_analytics TO authenticated;
GRANT EXECUTE ON FUNCTION get_subscriber_stats TO authenticated;
GRANT EXECUTE ON FUNCTION get_email_engagement_patterns TO authenticated;
*/