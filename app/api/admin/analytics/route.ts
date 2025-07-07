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

    // Fetch analytics data using the new database function
    const { data, error } = await supabase.rpc('get_analytics_dashboard', { days_ago: days });

    if (error) {
      console.error('Analytics RPC error:', error);
      throw error;
    }

    // Log admin activity
    await supabase
      .from('admin_activity_log')
      .insert({
        user_id: userId,
        action: 'view_analytics',
        entity_type: 'analytics_dashboard',
        details: { days }
      });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
