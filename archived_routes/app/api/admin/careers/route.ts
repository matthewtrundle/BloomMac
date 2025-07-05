import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Get user ID from headers (set by middleware)
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const position = searchParams.get('position');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabase
      .from('career_applications')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (position && position !== 'all') {
      query = query.eq('position', position);
    }

    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,position.ilike.%${search}%`);
    }

    const { data: applications, error, count } = await query;

    if (error) {
      console.error('Error fetching applications:', error);
      return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
    }

    // Calculate stats
    const { data: statsData } = await supabase
      .from('career_applications')
      .select('status, position');

    const stats = {
      total: count || 0,
      new: statsData?.filter(a => a.status === 'new').length || 0,
      reviewing: statsData?.filter(a => a.status === 'reviewing').length || 0,
      interviewing: statsData?.filter(a => a.status === 'interviewing').length || 0,
      hired: statsData?.filter(a => a.status === 'hired').length || 0
    };

    // Get unique positions for filter dropdown
    const positions = [...new Set(statsData?.map(a => a.position) || [])];

    // Log admin activity
    await supabase
      .from('admin_activity_log')
      .insert({
        user_id: userId,
        action: 'view_applications',
        entity_type: 'career_applications',
        details: { filters: { status, search, position } }
      });

    return NextResponse.json({
      applications: applications || [],
      stats,
      positions,
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (offset + limit) < (count || 0)
      }
    });
  } catch (error) {
    console.error('Career applications API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Bulk operations
export async function PATCH(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, applicationIds, newStatus } = await request.json();

    if (action === 'bulk_update_status') {
      const { error } = await supabase
        .from('career_applications')
        .update({ 
          status: newStatus,
          reviewed_by: userId,
          reviewed_at: new Date().toISOString()
        })
        .in('id', applicationIds);

      if (error) {
        console.error('Error updating applications:', error);
        return NextResponse.json({ error: 'Failed to update applications' }, { status: 500 });
      }

      // Log activity
      await supabase
        .from('admin_activity_log')
        .insert({
          user_id: userId,
          action: 'bulk_update_applications',
          entity_type: 'career_applications',
          details: { 
            application_ids: applicationIds, 
            new_status: newStatus,
            count: applicationIds.length
          }
        });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Bulk update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Delete applications
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ids } = await request.json();
    
    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { error } = await supabase
      .from('career_applications')
      .delete()
      .in('id', ids);

    if (error) {
      console.error('Error deleting applications:', error);
      return NextResponse.json({ error: 'Failed to delete applications' }, { status: 500 });
    }

    // Log activity
    await supabase
      .from('admin_activity_log')
      .insert({
        user_id: userId,
        action: 'delete_applications',
        entity_type: 'career_applications',
        details: { deleted_ids: ids }
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete applications error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}