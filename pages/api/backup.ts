import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Simple auth check
  const authHeader = req.headers.authorization;
  const adminKey = process.env.ADMIN_API_KEY;
  
  if (!authHeader || authHeader !== `Bearer ${adminKey}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { type = 'all' } = req.query;

  try {
    switch (type) {
      case 'subscribers':
        const { data: subscribers, error: subError } = await supabaseAdmin
          .from('subscribers')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (subError) throw subError;
        
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=subscribers-${new Date().toISOString().split('T')[0]}.json`);
        res.status(200).json(subscribers || []);
        break;

      case 'analytics':
        // Get last 30 days of analytics
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const { data: analytics, error: analyticsError } = await supabaseAdmin
          .from('analytics_events')
          .select('*')
          .gte('created_at', thirtyDaysAgo.toISOString())
          .order('created_at', { ascending: false });
        
        if (analyticsError) throw analyticsError;
        
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=analytics-${new Date().toISOString().split('T')[0]}.json`);
        res.status(200).json(analytics || []);
        break;

      case 'csv':
        // Export subscribers as CSV
        const { data: csvSubscribers, error: csvError } = await supabaseAdmin
          .from('subscribers')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (csvError) throw csvError;
        
        const csv = [
          'Email,First Name,Last Name,Status,Signup Date,Source,Interests',
          ...(csvSubscribers || []).map((s: any) => 
            [
              s.email,
              s.first_name || '',
              s.last_name || '',
              s.status,
              new Date(s.created_at).toISOString(),
              s.signup_source,
              (s.interests || []).join(';')
            ].map(field => `"${field}"`).join(',')
          )
        ].join('\n');
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=subscribers-${new Date().toISOString().split('T')[0]}.csv`);
        res.status(200).send(csv);
        break;

      case 'all':
        // Return all data as a combined JSON
        const allData: any = {
          exportDate: new Date().toISOString(),
          subscribers: [],
          analytics: [],
          blog_posts: [],
          contact_submissions: [],
          career_applications: []
        };

        // Get all subscribers
        const { data: allSubscribers } = await supabaseAdmin
          .from('subscribers')
          .select('*')
          .order('created_at', { ascending: false });
        allData.subscribers = allSubscribers || [];

        // Get recent analytics (last 30 days)
        const recentDate = new Date();
        recentDate.setDate(recentDate.getDate() - 30);
        const { data: allAnalytics } = await supabaseAdmin
          .from('analytics_events')
          .select('*')
          .gte('created_at', recentDate.toISOString())
          .order('created_at', { ascending: false });
        allData.analytics = allAnalytics || [];
        
        // Get all blog posts
        const { data: allPosts } = await supabaseAdmin
          .from('blog_posts')
          .select('*')
          .order('published_at', { ascending: false });
        allData.blog_posts = allPosts || [];
        
        // Get contact submissions
        const { data: allContacts } = await supabaseAdmin
          .from('contact_submissions')
          .select('*')
          .order('created_at', { ascending: false });
        allData.contact_submissions = allContacts || [];
        
        // Get career applications
        const { data: allApplications } = await supabaseAdmin
          .from('career_applications')
          .select('*')
          .order('created_at', { ascending: false });
        allData.career_applications = allApplications || [];

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=bloom-backup-${new Date().toISOString().split('T')[0]}.json`);
        res.status(200).json(allData);
        break;

      default:
        res.status(400).json({ error: 'Invalid backup type' });
    }
  } catch (error) {
    console.error('Backup error:', error);
    res.status(500).json({ error: 'Failed to generate backup' });
  }
}