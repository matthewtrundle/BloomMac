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

    // Debug logging
    console.log('Total subscribers fetched:', subscribers.length);
    if (subscribers.length > 0) {
      console.log('First subscriber sample:', JSON.stringify(subscribers[0], null, 2));
      console.log('Subscriber keys:', Object.keys(subscribers[0]));
    }
    console.log('Unique subscribed values:', [...new Set(subscribers.map(s => s.subscribed))]);
    console.log('Unique status values:', [...new Set(subscribers.map(s => s.status))]);

    // Calculate stats - check both 'subscribed' and 'status' fields
    const totalSubscribers = subscribers.length;
    const activeSubscribers = subscribers.filter(s => 
      s.subscribed === true || s.status === 'active' || s.status === 'subscribed'
    ).length;
    const unsubscribed = subscribers.filter(s => 
      s.subscribed === false || s.status === 'unsubscribed' || s.status === 'inactive'
    ).length;
    
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

    // Filter active subscribers - check both 'subscribed' and 'status' fields
    const activeSubscribersList = subscribers.filter(s => 
      s.subscribed === true || s.status === 'active' || s.status === 'subscribed'
    );
    console.log('Active subscribers after filter:', activeSubscribersList.length);
    
    // If no active subscribers found with filter, show all (for debugging)
    const subscribersToShow = activeSubscribersList.length > 0 ? activeSubscribersList : subscribers;
    if (activeSubscribersList.length === 0 && subscribers.length > 0) {
      console.log('WARNING: No active subscribers found, showing all subscribers');
    }
    
    // Return the expected structure
    return NextResponse.json({
      stats,
      subscribers: subscribersToShow
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
      
      // Get active subscribers - check both possible fields
      const { data: activeSubscribers, error: subError } = await supabase
        .from('subscribers')
        .select('email')
        .or('subscribed.eq.true,status.eq.active,status.eq.subscribed');

      if (subError) throw subError;

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
          subscribed: true,
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
  console.log('[Newsletter Admin DELETE] Starting request processing');
  
  try {
    let body;
    try {
      const text = await request.text();
      console.log('[Newsletter Admin DELETE] Raw request body:', text);
      
      if (!text) {
        return NextResponse.json({ 
          error: 'Empty request body', 
          details: 'Request body cannot be empty' 
        }, { status: 400 });
      }
      
      body = JSON.parse(text);
    } catch (parseError) {
      console.error('[Newsletter Admin DELETE] Failed to parse request body:', parseError);
      return NextResponse.json({ 
        error: 'Invalid request body', 
        details: 'Request body must be valid JSON' 
      }, { status: 400 });
    }
    
    console.log('[Newsletter Admin DELETE] Parsed body:', body);
    
    const { subscriberIds } = body;

    if (!subscriberIds || !Array.isArray(subscriberIds) || subscriberIds.length === 0) {
      return NextResponse.json({ 
        error: 'Subscriber IDs are required', 
        details: `Received: ${JSON.stringify(body)}` 
      }, { status: 400 });
    }

    console.log('[Newsletter Admin DELETE] Unsubscribing subscriber IDs:', subscriberIds);
    console.log('[Newsletter Admin DELETE] ID types:', subscriberIds.map(id => typeof id));

    const supabase = getServiceSupabase();
    
    // First check if the field exists
    console.log('[Newsletter Admin DELETE] Checking subscriber fields...');
    const { data: sampleSubscriber, error: sampleError } = await supabase
      .from('subscribers')
      .select('*')
      .limit(1)
      .single();
      
    if (sampleError) {
      console.error('[Newsletter Admin DELETE] Error getting sample subscriber:', sampleError);
      // Continue anyway, we'll try to update with basic fields
    }
    
    console.log('[Newsletter Admin DELETE] Sample subscriber fields:', sampleSubscriber ? Object.keys(sampleSubscriber) : 'No subscribers found');
    
    // Try to update with just subscribed field first
    const updateData: any = { subscribed: false };
    
    // Only add unsubscribed_at if the field exists
    if (sampleSubscriber && 'unsubscribed_at' in sampleSubscriber) {
      updateData.unsubscribed_at = new Date().toISOString();
    }
    
    // If there's a status field, update that too
    if (sampleSubscriber && 'status' in sampleSubscriber) {
      updateData.status = 'unsubscribed';
    }
    
    console.log('[Newsletter Admin DELETE] Updating with data:', updateData);
    
    const { error } = await supabase
      .from('subscribers')
      .update(updateData)
      .in('id', subscriberIds);

    if (error) {
      console.error('[Newsletter Admin DELETE] Supabase update error:', error);
      throw error;
    }

    console.log('[Newsletter Admin DELETE] Update successful');
    
    const response = NextResponse.json({ 
      success: true, 
      message: `Successfully unsubscribed ${subscriberIds.length} subscriber(s)` 
    });
    
    console.log('[Newsletter Admin DELETE] Sending response');
    return response;
  } catch (error: any) {
    console.error('[Newsletter Admin DELETE] Error unsubscribing:', error);
    console.error('[Newsletter Admin DELETE] Error stack:', error.stack);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to unsubscribe';
    let errorDetails = error.message || 'Unknown error';
    
    if (error.message?.includes('Invalid input syntax for type uuid')) {
      errorMessage = 'Invalid subscriber ID format';
      errorDetails = 'The subscriber IDs must be valid UUIDs';
    } else if (error.message?.includes('permission denied')) {
      errorMessage = 'Permission denied';
      errorDetails = 'The API key does not have permission to update subscribers';
    } else if (error.message?.includes('relation "subscribers" does not exist')) {
      errorMessage = 'Database error';
      errorDetails = 'The subscribers table does not exist';
    }
    
    console.log('[Newsletter Admin DELETE] Sending error response');
    return NextResponse.json(
      { error: errorMessage, details: errorDetails },
      { status: 500 }
    );
  }
}
