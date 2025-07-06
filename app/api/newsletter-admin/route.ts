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


    // Calculate stats - use the actual 'status' column
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

    // Filter active subscribers - use the actual 'status' column
    const activeSubscribersList = subscribers.filter(s => s.status === 'active');
    
    // Return the expected structure
    return NextResponse.json({
      stats,
      subscribers: activeSubscribersList
        .map(s => ({
          id: s.id,
          email: s.email,
          firstName: s.first_name || '',
          lastName: s.last_name || '',
          signupSource: s.source || 'unknown',
          timestamp: s.created_at,
          interests: []
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
    const body = await request.json();
    const supabase = getServiceSupabase();

    // Check if this is a newsletter send request (has subject and content)
    if (body.subject && body.content) {
      const { subject, content, preview } = body;
      
      // Get active subscribers - use a simple select and filter in code
      const { data: allSubscribers, error: subError } = await supabase
        .from('subscribers')
        .select('*');
        
      if (subError) throw subError;
      
      // Filter active subscribers using the 'status' column
      const activeSubscribers = allSubscribers.filter(s => s.status === 'active');

      // Add to email queue for each subscriber
      const emailJobs = activeSubscribers.map(subscriber => ({
        to_email: subscriber.email,
        subject,
        template_id: 'newsletter',
        template_data: { content, preview },
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

    // Check if this is an add subscriber request (has action)
    if (body.action === 'add_subscriber') {
      const { email, source = 'admin' } = body;
      
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

    return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });

  } catch (error) {
    console.error('Error processing newsletter action:', error);
    return NextResponse.json(
      { error: 'Failed to process action', details: error.message },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 200 });
}

export async function DELETE(request: NextRequest) {
  try {
    const { subscriberIds } = await request.json();

    if (!subscriberIds || !Array.isArray(subscriberIds) || subscriberIds.length === 0) {
      return NextResponse.json({ 
        error: 'Subscriber IDs are required', 
        details: `Received: ${JSON.stringify(body)}` 
      }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    
    // Update status to 'unsubscribed' for the selected subscribers
    const updateData = {
      status: 'unsubscribed',
      updated_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('subscribers')
      .update(updateData)
      .in('id', subscriberIds);

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      message: `Successfully unsubscribed ${subscriberIds.length} subscriber(s)` 
    });
  } catch (error: any) {
    console.error('Error unsubscribing:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe', details: error.message },
      { status: 500 }
    );
  }
}
