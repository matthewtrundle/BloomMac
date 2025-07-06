import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase-unified';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const supabase = getServiceSupabase();
    
    // Fetch multiple types of recent activities
    const [
      // Recent admin activities
      { data: adminActivities, error: adminError },
      // Recent contact submissions
      { data: contacts, error: contactError },
      // Recent newsletter signups
      { data: subscribers, error: subError },
      // Recent analytics events
      { data: analytics, error: analyticsError }
    ] = await Promise.all([
      supabase
        .from('admin_activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit),
      
      supabase
        .from('contact_submissions')
        .select('id, name, email, created_at, status')
        .order('created_at', { ascending: false })
        .limit(5),
      
      supabase
        .from('subscribers')
        .select('id, email, first_name, last_name, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5),
      
      supabase
        .from('analytics_events')
        .select('id, type, page, created_at')
        .order('created_at', { ascending: false })
        .limit(10)
    ]);

    // Combine and format all activities
    const allActivities = [];

    // Add admin activities
    if (adminActivities && !adminError) {
      adminActivities.forEach(activity => {
        allActivities.push({
          id: activity.id,
          type: 'admin_action',
          action: activity.action,
          description: formatAdminAction(activity),
          entityType: activity.entity_type,
          entityId: activity.entity_id,
          timestamp: activity.created_at,
          icon: getActivityIcon(activity.action),
          color: 'blue'
        });
      });
    }

    // Add contact submissions
    if (contacts && !contactError) {
      contacts.forEach(contact => {
        allActivities.push({
          id: `contact-${contact.id}`,
          type: 'contact_submission',
          action: 'new_contact',
          description: `New contact from ${contact.name} (${contact.email})`,
          entityType: 'contact',
          entityId: contact.id,
          timestamp: contact.created_at,
          icon: 'mail',
          color: 'green'
        });
      });
    }

    // Add newsletter signups
    if (subscribers && !subError) {
      subscribers.forEach(sub => {
        if (sub.created_at > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) {
          allActivities.push({
            id: `subscriber-${sub.id}`,
            type: 'newsletter_signup',
            action: 'newsletter_signup',
            description: `${sub.first_name || sub.email} subscribed to newsletter`,
            entityType: 'subscriber',
            entityId: sub.id,
            timestamp: sub.created_at,
            icon: 'user-plus',
            color: 'purple'
          });
        }
      });
    }

    // Add page views (limited to avoid clutter)
    if (analytics && !analyticsError) {
      const recentPageViews = analytics.filter(event => 
        event.type === 'page_view' && 
        event.created_at > new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      ).slice(0, 5);
      
      recentPageViews.forEach(event => {
        allActivities.push({
          id: `analytics-${event.id}`,
          type: 'page_view',
          action: 'page_view',
          description: `Page view: ${event.page}`,
          entityType: 'analytics',
          entityId: event.id,
          timestamp: event.created_at,
          icon: 'eye',
          color: 'gray'
        });
      });
    }

    // Sort by timestamp
    allActivities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Return limited results
    return NextResponse.json({
      activities: allActivities.slice(0, limit),
      total: allActivities.length
    });

  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent activity', details: error.message },
      { status: 500 }
    );
  }
}

function formatAdminAction(activity: any): string {
  const details = activity.details || {};
  
  switch (activity.action) {
    case 'newsletter_signup':
      return `New newsletter signup: ${details.email}`;
    case 'blog_publish':
      return `Published blog post: ${details.title}`;
    case 'email_sent':
      return `Sent email: ${details.subject}`;
    case 'contact_reply':
      return `Replied to contact: ${details.email}`;
    default:
      return `${activity.action.replace(/_/g, ' ')} on ${activity.entity_type}`;
  }
}

function getActivityIcon(action: string): string {
  const iconMap = {
    'newsletter_signup': 'mail',
    'blog_publish': 'file-text',
    'email_sent': 'send',
    'contact_reply': 'message-circle',
    'login': 'log-in',
    'logout': 'log-out',
    'settings_update': 'settings',
    'page_view': 'eye'
  };
  
  return iconMap[action] || 'activity';
}