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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabase
      .from('contact_submissions')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,message.ilike.%${search}%`);
    }

    const { data: contacts, error, count } = await query;

    if (error) {
      console.error('Error fetching contacts:', error);
      return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
    }

    // Calculate stats
    const { data: statsData } = await supabase
      .from('contact_submissions')
      .select('status');

    const stats = {
      total: count || 0,
      new: statsData?.filter(c => c.status === 'new').length || 0,
      replied: statsData?.filter(c => c.status === 'responded').length || 0,
      responseRate: 0
    };

    if (stats.total > 0) {
      stats.responseRate = Math.round((stats.replied / stats.total) * 100);
    }

    // Log admin activity
    await supabase
      .from('admin_activity_log')
      .insert({
        user_id: userId,
        action: 'view_contacts',
        entity_type: 'contact_submissions',
        details: { filters: { status, search } }
      });

    return NextResponse.json({
      contacts: contacts || [],
      stats,
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (offset + limit) < (count || 0)
      }
    });
  } catch (error) {
    console.error('Contacts API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Delete contact
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create Supabase service client for admin operations
    const supabase = createSupabaseServiceClient();

    const { ids } = await request.json();
    
    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { error } = await supabase
      .from('contact_submissions')
      .delete()
      .in('id', ids);

    if (error) {
      console.error('Error deleting contacts:', error);
      return NextResponse.json({ error: 'Failed to delete contacts' }, { status: 500 });
    }

    // Log activity
    await supabase
      .from('admin_activity_log')
      .insert({
        user_id: userId,
        action: 'delete_contacts',
        entity_type: 'contact_submissions',
        details: { deleted_ids: ids }
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete contacts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}