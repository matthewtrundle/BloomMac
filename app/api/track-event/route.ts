import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { supabase } = createSupabaseRouteHandlerClient(request);
    
    // Get user session (optional - analytics can work without auth)
    const { data: { session } } = await supabase.auth.getSession();
    
    // Create analytics event
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        type: body.type,
        page: body.page,
        session_id: body.sessionId,
        user_id: session?.user?.id || body.userId || null,
        data: body.data || {},
        created_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error tracking event:', error);
      // Don't fail the request - analytics shouldn't break the app
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error in track-event API:', error);
    // Return success even on error - analytics shouldn't break the app
    return NextResponse.json({ success: true });
  }
}

// Support OPTIONS for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 200 });
}