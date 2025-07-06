import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    // Get user ID from headers (set by middleware)
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create Supabase service client for admin operations
    const supabase = createSupabaseServiceClient();

    // Get date range from query params (default to last 30 days)
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch analytics data
    const [
      contactStats,
      careerStats,
      pageViews,
      userActivity,
      conversionStats
    ] = await Promise.all([
      // Contact form submissions
      supabase
        .from('contact_submissions')
        .select('status, created_at')
        .gte('created_at', startDate.toISOString()),
      
      // Career applications
      supabase
        .from('career_applications')
        .select('status, created_at')
        .gte('created_at', startDate.toISOString()),
      
      // Page views/Analytics events
      supabase
        .from('analytics_events')
        .select('type, page, created_at')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false }),
      
      // User activity
      supabase
        .from('user_profiles')
        .select('created_at')
        .gte('created_at', startDate.toISOString()),
      
      // Newsletter signups
      supabase
        .from('newsletter_subscribers')
        .select('status, created_at')
        .gte('created_at', startDate.toISOString())
    ]);

    // Process the data
    const analytics = {
      overview: {
        totalContacts: contactStats.data?.length || 0,
        newContacts: contactStats.data?.filter(c => c.status === 'new').length || 0,
        respondedContacts: contactStats.data?.filter(c => c.status === 'responded').length || 0,
        totalApplications: careerStats.data?.length || 0,
        newUsers: userActivity.data?.length || 0,
        newsletterSignups: conversionStats.data?.length || 0,
      },
      
      // Daily breakdown for charts
      dailyStats: generateDailyStats(startDate, {
        contacts: contactStats.data || [],
        applications: careerStats.data || [],
        signups: conversionStats.data || [],
        users: userActivity.data || []
      }),
      
      // Page analytics
      topPages: getTopPages(pageViews.data || []),
      
      // Conversion funnel
      conversionFunnel: {
        pageViews: pageViews.data?.length || 0,
        contactFormViews: pageViews.data?.filter(e => e.page === '/contact').length || 0,
        contactFormSubmissions: contactStats.data?.length || 0,
        conversionRate: calculateConversionRate(
          pageViews.data?.filter(e => e.page === '/contact').length || 0,
          contactStats.data?.length || 0
        )
      }
    };

    // Log admin activity
    await supabase
      .from('admin_activity_log')
      .insert({
        user_id: userId,
        action: 'view_analytics',
        entity_type: 'analytics',
        details: { days, date_range: { start: startDate, end: new Date() } }
      });

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper functions
function generateDailyStats(startDate: Date, data: any) {
  const dailyStats = [];
  const today = new Date();
  const currentDate = new Date(startDate);
  
  while (currentDate <= today) {
    const dateStr = currentDate.toISOString().split('T')[0];
    
    dailyStats.push({
      date: dateStr,
      contacts: data.contacts.filter((c: any) => 
        c.created_at.startsWith(dateStr)
      ).length,
      applications: data.applications.filter((a: any) => 
        a.created_at.startsWith(dateStr)
      ).length,
      signups: data.signups.filter((s: any) => 
        s.created_at.startsWith(dateStr)
      ).length,
      users: data.users.filter((u: any) => 
        u.created_at.startsWith(dateStr)
      ).length
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dailyStats;
}

function getTopPages(events: any[]) {
  const pageCounts: Record<string, number> = {};
  
  events.forEach(event => {
    if (event.page) {
      pageCounts[event.page] = (pageCounts[event.page] || 0) + 1;
    }
  });
  
  return Object.entries(pageCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([page, views]) => ({ page, views }));
}

function calculateConversionRate(views: number, conversions: number): number {
  if (views === 0) return 0;
  return Math.round((conversions / views) * 100 * 100) / 100; // Round to 2 decimal places
}