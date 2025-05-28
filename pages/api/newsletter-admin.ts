import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Auth is handled by middleware - check headers
  const userId = req.headers['x-user-id'];
  const userEmail = req.headers['x-user-email'];
  const userRole = req.headers['x-user-role'];
  
  if (!userId || !userEmail) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      // Get all subscribers from Supabase
      try {
        const { data: subscribers, error } = await supabaseAdmin
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
          const source = s.source || 'website';
          sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
        });
        
        const signupSources = Array.from(sourceMap.entries()).map(([source, count]) => ({
          source,
          count,
          percentage: Math.round((count / allSubscribers.length) * 100)
        }));
        
        // Growth trend (mock data for now)
        const growthTrend = [];
        for (let i = 29; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          growthTrend.push({
            date: date.toISOString().split('T')[0],
            subscribers: Math.max(0, allSubscribers.length - (i * 2))
          });
        }
        
        // Format subscribers for the component
        const formattedSubscribers = allSubscribers.map(s => ({
          id: s.id,
          email: s.email,
          firstName: s.first_name || '',
          lastName: s.last_name || '',
          signupSource: s.source || 'website',
          timestamp: s.created_at,
          interests: s.interests || []
        }));
        
        return res.status(200).json({
          stats: {
            total_subscribers: allSubscribers.length,
            active_subscribers: activeSubscribers.length,
            unsubscribed: unsubscribed.length,
            recent_signups: recentSignups,
            signup_sources: signupSources,
            growth_trend: growthTrend
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
      const { subject, htmlContent, textContent, recipientIds } = req.body;
      
      if (!subject || !htmlContent) {
        return res.status(400).json({ error: 'Subject and HTML content are required' });
      }
      
      try {
        // Get selected recipients from Supabase
        let query = supabaseAdmin
          .from('subscribers')
          .select('*')
          .eq('status', 'active');
        
        if (recipientIds && recipientIds.length > 0) {
          query = query.in('id', recipientIds);
        }
        
        const { data: recipients, error: recipientError } = await query;
        
        if (recipientError) throw recipientError;
        
        if (!recipients || recipients.length === 0) {
          return res.status(400).json({ error: 'No recipients found' });
        }
        
        // Create email HTML with unsubscribe link
        const emailHtml = createNewsletterHtml(htmlContent);
        
        // Send emails using Resend batch API
        const emails = recipients.map(recipient => ({
          from: 'Bloom Psychology <newsletter@bloompsychologynorthaustin.com>',
          to: recipient.email,
          subject: subject,
          html: emailHtml.replace('{{unsubscribe_link}}', `https://bloompsychologynorthaustin.com/api/unsubscribe?email=${recipient.email}`),
          text: textContent || 'Please view this email in HTML format.',
          tags: [
            { name: 'newsletter', value: 'true' },
            { name: 'batch_id', value: new Date().toISOString() }
          ]
        }));
        
        // Send in batches of 100 (Resend limit)
        const batchSize = 100;
        let sentCount = 0;
        
        for (let i = 0; i < emails.length; i += batchSize) {
          const batch = emails.slice(i, i + batchSize);
          const { data, error } = await resend.batch.send(batch);
          
          if (error) {
            console.error('Batch send error:', error);
          } else {
            sentCount += batch.length;
          }
        }
        
        // Log the newsletter send in admin activity
        await supabaseAdmin
          .from('admin_activity_log')
          .insert({
            action: 'newsletter_sent',
            entity_type: 'newsletter',
            details: {
              subject,
              recipient_count: sentCount,
              total_attempted: emails.length
            }
          });
        
        return res.status(200).json({ 
          success: true,
          message: `Newsletter sent to ${sentCount} subscribers`,
          sentCount,
          totalAttempted: emails.length
        });
        
      } catch (error) {
        console.error('Newsletter send error:', error);
        return res.status(500).json({ 
          error: 'Failed to send newsletter',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }

    case 'DELETE':
      // Unsubscribe user
      const { email } = req.query;
      
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: 'Email is required' });
      }
      
      try {
        const { data, error } = await supabaseAdmin
          .from('subscribers')
          .update({ 
            status: 'unsubscribed',
            updated_at: new Date().toISOString()
          })
          .eq('email', email.toLowerCase())
          .select()
          .single();
        
        if (error) {
          if (error.code === 'PGRST116') {
            return res.status(404).json({ error: 'Subscriber not found' });
          }
          throw error;
        }
        
        return res.status(200).json({ 
          success: true,
          message: 'Successfully unsubscribed'
        });
        
      } catch (error) {
        console.error('Unsubscribe error:', error);
        return res.status(500).json({ 
          error: 'Failed to unsubscribe',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

function createNewsletterHtml(content: string): string {
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
  </body>
</html>`;
}