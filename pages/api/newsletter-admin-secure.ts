import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { getResendClient } from '@/lib/resend-client';
import { withAuth } from '@/lib/auth-secure';
import { z } from 'zod';

// Create authenticated client (will use auth from cookies)
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

// Validation schemas
const sendNewsletterSchema = z.object({
  subject: z.string().min(1).max(200),
  htmlContent: z.string().min(1),
  textContent: z.string().optional(),
  recipientIds: z.array(z.string().uuid()).optional()
});

const bulkUnsubscribeSchema = z.object({
  subscriberIds: z.array(z.string().uuid()).min(1).max(100)
});

async function handler(req: NextApiRequest, res: NextApiResponse, user: any) {
  const supabase = getAuthenticatedSupabase(req);
  const resend = getResendClient();

  // Check if user has admin role
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.userId)
    .single();

  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  switch (req.method) {
    case 'GET':
      // Get all subscribers
      try {
        const { data: subscribers, error } = await supabase
          .from('subscribers')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Calculate stats
        const allSubscribers = subscribers || [];
        const activeSubscribers = allSubscribers.filter(s => s.status === 'active');
        const unsubscribed = allSubscribers.filter(s => s.status === 'unsubscribed');
        
        // Recent signups (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentSignups = allSubscribers.filter(s => 
          new Date(s.created_at) > thirtyDaysAgo
        ).length;
        
        // Group by source
        const sourceMap = new Map();
        allSubscribers.forEach(s => {
          const source = s.signup_source || 'website';
          sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
        });
        
        const signupSources = Array.from(sourceMap.entries()).map(([source, count]) => ({
          source,
          count,
          percentage: Math.round((count / allSubscribers.length) * 100) || 0
        }));
        
        // Calculate growth trend from actual data
        const { data: dailyStats } = await supabase
          .rpc('get_subscriber_growth_trend', { days: 30 });
        
        // Format subscribers for the component
        const formattedSubscribers = allSubscribers.map(s => ({
          id: s.id,
          email: s.email,
          firstName: s.first_name || '',
          lastName: s.last_name || '',
          signupSource: s.signup_source || 'website',
          timestamp: s.created_at,
          interests: s.interests || [],
          status: s.status
        }));

        // Log admin activity
        await supabase
          .from('admin_activity_log')
          .insert({
            action: 'view_subscribers',
            entity_type: 'subscribers',
            details: {
              total_viewed: allSubscribers.length,
              active_count: activeSubscribers.length
            }
          });
        
        return res.status(200).json({
          stats: {
            total_subscribers: allSubscribers.length,
            active_subscribers: activeSubscribers.length,
            unsubscribed: unsubscribed.length,
            recent_signups: recentSignups,
            signup_sources: signupSources,
            growth_trend: dailyStats || []
          },
          subscribers: formattedSubscribers
        });
      } catch (error) {
        console.error('Error fetching subscribers:', error);
        return res.status(500).json({ 
          error: 'Failed to fetch subscribers',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }

    case 'POST':
      // Send newsletter email
      try {
        const validatedData = sendNewsletterSchema.parse(req.body);
        const { subject, htmlContent, textContent, recipientIds } = validatedData;
        
        if (!resend) {
          return res.status(500).json({ error: 'Email service not configured' });
        }
        
        // Get selected recipients
        let query = supabase
          .from('subscribers')
          .select('*')
          .eq('status', 'active');
        
        if (recipientIds && recipientIds.length > 0) {
          query = query.in('id', recipientIds);
        }
        
        const { data: recipients, error: recipientError } = await query;
        
        if (recipientError) throw recipientError;
        
        if (!recipients || recipients.length === 0) {
          return res.status(400).json({ error: 'No active recipients found' });
        }
        
        // Create newsletter record
        const { data: newsletter, error: newsletterError } = await supabase
          .from('newsletter_sends')
          .insert({
            subject,
            html_content: htmlContent,
            text_content: textContent,
            recipient_count: recipients.length,
            sent_by: user.userId,
            status: 'sending'
          })
          .select()
          .single();
        
        if (newsletterError) throw newsletterError;
        
        // Create email HTML with tracking
        const emailHtml = createNewsletterHtml(htmlContent, newsletter.id);
        
        // Send emails using Resend batch API
        const emails = recipients.map(recipient => ({
          from: 'Dr. Jana Rundle <jana@bloompsychologynorthaustin.com>',
          to: recipient.email,
          subject: subject,
          html: emailHtml
            .replace('{{unsubscribe_link}}', `https://bloompsychologynorthaustin.com/api/unsubscribe?email=${recipient.email}&token=${generateUnsubscribeToken(recipient.email)}`)
            .replace('{{email_id}}', newsletter.id)
            .replace('{{recipient_email}}', recipient.email),
          text: textContent || 'Please view this email in HTML format.',
          tags: [
            { name: 'newsletter', value: 'true' },
            { name: 'newsletter_id', value: newsletter.id }
          ]
        }));
        
        // Send in batches of 100 (Resend limit)
        const batchSize = 100;
        let sentCount = 0;
        let failedCount = 0;
        
        for (let i = 0; i < emails.length; i += batchSize) {
          const batch = emails.slice(i, i + batchSize);
          const { data, error } = await resend.batch.send(batch);
          
          if (error) {
            console.error('Batch send error:', error);
            failedCount += batch.length;
          } else {
            sentCount += batch.length;
          }
        }
        
        // Update newsletter status
        await supabase
          .from('newsletter_sends')
          .update({
            status: 'sent',
            sent_count: sentCount,
            failed_count: failedCount,
            sent_at: new Date().toISOString()
          })
          .eq('id', newsletter.id);
        
        // Log the newsletter send
        await supabase
          .from('admin_activity_log')
          .insert({
            action: 'newsletter_sent',
            entity_type: 'newsletter',
            entity_id: newsletter.id,
            details: {
              subject,
              recipient_count: sentCount,
              failed_count: failedCount,
              total_attempted: emails.length
            }
          });
        
        return res.status(200).json({ 
          success: true,
          message: `Newsletter sent to ${sentCount} subscribers`,
          sentCount,
          failedCount,
          totalAttempted: emails.length,
          newsletterId: newsletter.id
        });
        
      } catch (error) {
        console.error('Newsletter send error:', error);
        
        if (error instanceof z.ZodError) {
          return res.status(400).json({ 
            error: 'Invalid request data',
            details: error.errors
          });
        }
        
        return res.status(500).json({ 
          error: 'Failed to send newsletter',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }

    case 'DELETE':
      // Bulk unsubscribe
      try {
        const validatedData = bulkUnsubscribeSchema.parse(req.body);
        const { subscriberIds } = validatedData;
        
        const { data, error } = await supabase
          .from('subscribers')
          .update({ 
            status: 'unsubscribed',
            unsubscribed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .in('id', subscriberIds)
          .select();
        
        if (error) throw error;
        
        // Log admin activity
        await supabase
          .from('admin_activity_log')
          .insert({
            action: 'bulk_unsubscribe',
            entity_type: 'subscribers',
            details: {
              subscriber_count: data?.length || 0,
              subscriber_ids: subscriberIds,
              admin_initiated: true
            }
          });
        
        return res.status(200).json({ 
          success: true,
          message: `Successfully unsubscribed ${data?.length || 0} subscriber(s)`,
          unsubscribedCount: data?.length || 0
        });
        
      } catch (error) {
        console.error('Bulk unsubscribe error:', error);
        
        if (error instanceof z.ZodError) {
          return res.status(400).json({ 
            error: 'Invalid request data',
            details: error.errors
          });
        }
        
        return res.status(500).json({ 
          error: 'Failed to unsubscribe subscribers',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

// Export with auth wrapper
export default withAuth(handler);

// Helper functions
function generateUnsubscribeToken(email: string): string {
  // In production, use proper HMAC with secret
  const timestamp = Date.now();
  const data = `${email}:${timestamp}`;
  return Buffer.from(data).toString('base64');
}

function createNewsletterHtml(content: string, newsletterId: string): string {
  const trackingPixel = `<img src="https://bloompsychologynorthaustin.com/api/track-email-open?id={{email_id}}&email={{recipient_email}}" width="1" height="1" style="display:block;" alt="">`;
  
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bloom Psychology Newsletter</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
        background-color: #f5f5f5;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
      }
      .header {
        background: linear-gradient(135deg, #6B21A8 0%, #A855F7 100%);
        padding: 30px 20px;
        text-align: center;
      }
      .content {
        padding: 30px 20px;
      }
      .footer {
        background-color: #f8f9fa;
        padding: 20px;
        text-align: center;
        font-size: 12px;
        color: #666;
      }
      a {
        color: #6B21A8;
        text-decoration: none;
      }
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #C06B93;
        color: white;
        text-decoration: none;
        border-radius: 6px;
        margin: 10px 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->
      <div class="header">
        <img src="https://bloompsychologynorthaustin.com/images/Logo/logo.jpg" alt="Bloom Psychology" style="max-width: 120px; height: auto; margin-bottom: 15px; background: white; padding: 8px; border-radius: 6px;">
        <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 600;">Monthly Mental Health Insights</h1>
        <p style="color: #E9D5FF; margin: 5px 0 0 0; font-size: 14px;">From Dr. Jana Rundle & The Bloom Psychology Team</p>
      </div>

      <!-- Content -->
      <div class="content">
        ${content}
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>
          You're receiving this email because you subscribed to our newsletter.<br>
          <a href="{{unsubscribe_link}}">Unsubscribe</a> | 
          <a href="https://bloompsychologynorthaustin.com/contact">Contact Us</a>
        </p>
        <p>
          © ${new Date().getFullYear()} Bloom Psychology. All rights reserved.<br>
          13706 N Highway 183, Suite 114, Austin, TX 78750
        </p>
      </div>
    </div>
    ${trackingPixel}
  </body>
</html>`;
}

// SQL functions needed:
/*
-- Get subscriber growth trend
CREATE OR REPLACE FUNCTION get_subscriber_growth_trend(days INTEGER)
RETURNS TABLE(
  date DATE,
  subscribers INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH date_series AS (
    SELECT generate_series(
      CURRENT_DATE - INTERVAL '1 day' * (days - 1),
      CURRENT_DATE,
      '1 day'::interval
    )::date AS date
  )
  SELECT 
    ds.date,
    COUNT(s.id) FILTER (WHERE s.created_at::date <= ds.date AND (s.status = 'active' OR s.unsubscribed_at::date > ds.date)) as subscribers
  FROM date_series ds
  LEFT JOIN subscribers s ON true
  GROUP BY ds.date
  ORDER BY ds.date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Newsletter sends table
CREATE TABLE IF NOT EXISTS newsletter_sends (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  subject VARCHAR(200) NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  recipient_count INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  sent_by UUID REFERENCES user_profiles(id),
  status VARCHAR(20) DEFAULT 'draft',
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

GRANT SELECT, INSERT, UPDATE ON newsletter_sends TO authenticated;
*/