import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase-unified';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    
    // Get email analytics data
    const { data: emailLogs, error: logsError } = await supabase
      .from('email_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (logsError) throw logsError;

    // Get email sends data
    const { data: emailSends, error: sendsError } = await supabase
      .from('email_sends')
      .select('*')
      .order('sent_at', { ascending: false })
      .limit(100);

    if (sendsError) throw sendsError;

    // Calculate analytics
    const totalSent = emailLogs?.length || 0;
    const totalOpened = emailLogs?.filter(log => log.opened_at).length || 0;
    const totalClicked = emailLogs?.filter(log => log.clicked_at).length || 0;
    
    const openRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0;
    const clickRate = totalSent > 0 ? Math.round((totalClicked / totalSent) * 100) : 0;

    // Calculate unsubscribe rate from subscribers
    const { count: totalSubscribers } = await supabase
      .from('subscribers')
      .select('*', { count: 'exact', head: true });

    const { count: unsubscribedCount } = await supabase
      .from('subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'unsubscribed');

    const unsubscribeRate = totalSubscribers > 0 
      ? Math.round((unsubscribedCount / totalSubscribers) * 100) 
      : 0;

    // Get recent email activity
    const recentActivity = emailLogs?.slice(0, 10).map(log => ({
      id: log.id,
      email: log.to_email,
      subject: log.subject || 'Unknown',
      status: log.status,
      sentAt: log.created_at,
      openedAt: log.opened_at,
      clickedAt: log.clicked_at
    })) || [];

    return NextResponse.json({
      overview: {
        totalSent,
        openRate,
        clickRate,
        unsubscribeRate
      },
      recentActivity,
      campaignPerformance: [],
      timeSeriesData: {
        labels: [],
        datasets: []
      }
    });

  } catch (error) {
    console.error('Error fetching email analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email analytics', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();
    const supabase = getServiceSupabase();

    if (action === 'track_open') {
      const { emailId } = data;
      
      const { error } = await supabase
        .from('email_logs')
        .update({ 
          opened_at: new Date().toISOString(),
          open_count: supabase.rpc('increment', { x: 1 })
        })
        .eq('id', emailId);

      if (error) throw error;

      return NextResponse.json({ success: true });
    }

    if (action === 'track_click') {
      const { emailId, link } = data;
      
      const { error } = await supabase
        .from('email_logs')
        .update({ 
          clicked_at: new Date().toISOString(),
          click_count: supabase.rpc('increment', { x: 1 })
        })
        .eq('id', emailId);

      if (error) throw error;

      // Also log the specific link clicked
      await supabase
        .from('email_analytics')
        .insert({
          email_log_id: emailId,
          event_type: 'click',
          event_data: { link },
          created_at: new Date().toISOString()
        });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });

  } catch (error) {
    console.error('Error tracking email event:', error);
    return NextResponse.json(
      { error: 'Failed to track event', details: error.message },
      { status: 500 }
    );
  }
}