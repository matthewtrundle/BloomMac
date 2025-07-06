import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase-unified';

interface NewsletterStats {
  total_subscribers: number;
  active_subscribers: number;
  unsubscribed: number;
  recent_signups: number;
  signup_sources: { source: string; count: number; percentage: number }[];
  growth_trend: { date: string; subscribers: number }[];
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    
    // Get all subscribers
    const { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Calculate stats
    const totalSubscribers = subscribers.length;
    const activeSubscribers = subscribers.filter(s => s.status === 'active').length;
    const unsubscribed = subscribers.filter(s => s.status === 'unsubscribed').length;
    
    // Recent signups (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentSignups = subscribers.filter(s => 
      new Date(s.created_at) > thirtyDaysAgo
    ).length;

    // Signup sources
    const sourceMap = new Map();
    subscribers.forEach(s => {
      const source = s.source || 'unknown';
      sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
    });
    
    const signupSources = Array.from(sourceMap.entries()).map(([source, count]) => ({
      source,
      count,
      percentage: Math.round((count / totalSubscribers) * 100)
    }));

    // Growth trend (last 30 days)
    const growthTrend = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const subscribersUpToDate = subscribers.filter(s => 
        new Date(s.created_at) <= date
      ).length;
      
      growthTrend.push({
        date: dateStr,
        subscribers: subscribersUpToDate
      });
    }

    const stats: NewsletterStats = {
      total_subscribers: totalSubscribers,
      active_subscribers: activeSubscribers,
      unsubscribed,
      recent_signups: recentSignups,
      signup_sources: signupSources,
      growth_trend: growthTrend
    };

    // Return the expected structure
    return NextResponse.json({
      stats,
      subscribers: subscribers.map(s => ({
        id: s.id,
        email: s.email,
        firstName: s.first_name || '',
        lastName: s.last_name || '',
        status: s.status || 'active',
        signupSource: s.signup_source || s.source || 'unknown',
        timestamp: s.created_at,
        created_at: s.created_at,
        unsubscribed_at: s.unsubscribe_reason
      }))
    });

  } catch (error) {
    console.error('Error fetching newsletter data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch newsletter data', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json();
    const supabase = getServiceSupabase();

    if (action === 'add_subscriber') {
      const { email, source = 'admin' } = data;
      
      if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
      }

      const { data: newSubscriber, error } = await supabase
        .from('subscribers')
        .insert({
          email: email.toLowerCase().trim(),
          source,
          status: 'active',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          return NextResponse.json({ error: 'Email already subscribed' }, { status: 409 });
        }
        throw error;
      }

      return NextResponse.json(newSubscriber, { status: 201 });
    }

    if (action === 'send_newsletter') {
      const { subject, content, template_id } = data;
      
      // Get active subscribers
      const { data: activeSubscribers, error: subError } = await supabase
        .from('subscribers')
        .select('email')
        .eq('status', 'active');

      if (subError) throw subError;

      // Add to email queue for each subscriber
      const emailJobs = activeSubscribers.map(subscriber => ({
        to_email: subscriber.email,
        subject,
        template_id: template_id || 'newsletter',
        template_data: { content },
        status: 'pending',
        scheduled_at: new Date().toISOString()
      }));

      const { error: queueError } = await supabase
        .from('email_queue')
        .insert(emailJobs);

      if (queueError) throw queueError;

      return NextResponse.json({ 
        success: true, 
        queued: emailJobs.length,
        message: `Newsletter queued for ${emailJobs.length} subscribers`
      });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });

  } catch (error) {
    console.error('Error processing newsletter action:', error);
    return NextResponse.json(
      { error: 'Failed to process action', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscriberIds } = body;

    if (!subscriberIds || subscriberIds.length === 0) {
      return NextResponse.json({ error: 'Subscriber IDs are required' }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    
    const { error } = await supabase
      .from('subscribers')
      .update({ 
        status: 'unsubscribed',
        updated_at: new Date().toISOString()
      })
      .in('id', subscriberIds);

    if (error) throw error;

    return NextResponse.json({ success: true, unsubscribed: subscriberIds.length });
  } catch (error) {
    console.error('Error unsubscribing:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe', details: error.message },
      { status: 500 }
    );
  }
}
