import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase-unified';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('range')?.replace('d', '') || '30');

    const { data, error } = await supabase.rpc('get_email_analytics', { days_ago: days });

    if (error) {
      console.error('Email analytics RPC error:', error);
      throw error;
    }

    return NextResponse.json(data);

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
