import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient, getAuthenticatedUser, checkUserRole } from '@/lib/supabase-server';
import { z } from 'zod';

// Query validation
const querySchema = z.object({
  status: z.enum(['all', 'new', 'reviewing', 'interviewing', 'hired', 'rejected']).optional(),
  search: z.string().max(100).optional(),
  position: z.string().max(100).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0)
});

// Bulk update validation
const bulkUpdateSchema = z.object({
  action: z.literal('bulk_update_status'),
  applicationIds: z.array(z.string().uuid()).min(1).max(100),
  newStatus: z.enum(['new', 'reviewing', 'interviewing', 'hired', 'rejected'])
});

// Delete validation
const deleteSchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(50)
});

export async function GET(request: NextRequest) {
  try {
    // Create authenticated Supabase client
    const { supabase } = createSupabaseRouteHandlerClient(request);
    
    // Get authenticated user
    const user = await getAuthenticatedUser(supabase);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if user has admin role
    const isAdmin = await checkUserRole(supabase, user.id, 'admin');
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const query = querySchema.parse({
      status: searchParams.get('status') || undefined,
      search: searchParams.get('search') || undefined,
      position: searchParams.get('position') || undefined,
      limit: searchParams.get('limit') || undefined,
      offset: searchParams.get('offset') || undefined
    });

    const { status, search, position, limit, offset } = query;

    // Build query
    let dbQuery = supabase
      .from('career_applications')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (status && status !== 'all') {
      dbQuery = dbQuery.eq('status', status);
    }

    if (position && position !== 'all') {
      dbQuery = dbQuery.eq('position', position);
    }

    if (search) {
      dbQuery = dbQuery.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,position.ilike.%${search}%`
      );
    }

    const { data: applications, error, count } = await dbQuery;

    if (error) {
      console.error('Error fetching applications:', error);
      return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
    }

    // Get stats using RPC function for better performance
    const { data: stats, error: statsError } = await supabase
      .rpc('get_career_application_stats');

    if (statsError) {
      console.error('Error fetching stats:', statsError);
    }

    // Get unique positions for filter dropdown
    const { data: positions } = await supabase
      .from('career_applications')
      .select('position')
      .order('position')
      .limit(50);

    const uniquePositions = [...new Set(positions?.map(a => a.position) || [])];

    // Log admin activity
    await supabase
      .from('admin_activity_log')
      .insert({
        action: 'view_applications',
        entity_type: 'career_applications',
        details: { 
          filters: { status, search, position },
          results_count: applications?.length || 0
        },
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        user_agent: request.headers.get('user-agent')
      });

    return NextResponse.json({
      applications: applications || [],
      stats: stats || {
        total: count || 0,
        new: 0,
        reviewing: 0,
        interviewing: 0,
        hired: 0,
        rejected: 0
      },
      positions: uniquePositions,
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (offset + limit) < (count || 0)
      }
    });
  } catch (error) {
    console.error('Career applications API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Bulk operations
export async function PATCH(request: NextRequest) {
  try {
    // Create authenticated Supabase client
    const { supabase } = createSupabaseRouteHandlerClient(request);
    
    // Get authenticated user
    const user = await getAuthenticatedUser(supabase);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check admin role
    const isAdmin = await checkUserRole(supabase, user.id, 'admin');
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validatedData = bulkUpdateSchema.parse(body);
    const { action, applicationIds, newStatus } = validatedData;

    if (action === 'bulk_update_status') {
      // Get user profile for reviewer info
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();

      const { error } = await supabase
        .from('career_applications')
        .update({ 
          status: newStatus,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
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
          action: 'bulk_update_applications',
          entity_type: 'career_applications',
          details: { 
            application_ids: applicationIds, 
            new_status: newStatus,
            count: applicationIds.length,
            reviewer_name: profile ? `${profile.first_name} ${profile.last_name}` : user.email
          },
          ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
          user_agent: request.headers.get('user-agent')
        });

      return NextResponse.json({ 
        success: true,
        updated: applicationIds.length 
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Bulk update error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Delete applications
export async function DELETE(request: NextRequest) {
  try {
    // Create authenticated Supabase client
    const { supabase } = createSupabaseRouteHandlerClient(request);
    
    // Get authenticated user
    const user = await getAuthenticatedUser(supabase);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check super admin role (only super admins can delete)
    const isSuperAdmin = await checkUserRole(supabase, user.id, 'super_admin');
    if (!isSuperAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Super admin access required for deletion' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validatedData = deleteSchema.parse(body);
    const { ids } = validatedData;

    // Get application details before deletion for audit log
    const { data: applicationsToDelete } = await supabase
      .from('career_applications')
      .select('id, first_name, last_name, email, position')
      .in('id', ids);

    const { error } = await supabase
      .from('career_applications')
      .delete()
      .in('id', ids);

    if (error) {
      console.error('Error deleting applications:', error);
      return NextResponse.json({ error: 'Failed to delete applications' }, { status: 500 });
    }

    // Log activity with details
    await supabase
      .from('admin_activity_log')
      .insert({
        action: 'delete_applications',
        entity_type: 'career_applications',
        details: { 
          deleted_ids: ids,
          deleted_applications: applicationsToDelete || [],
          count: ids.length
        },
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        user_agent: request.headers.get('user-agent')
      });

    return NextResponse.json({ 
      success: true,
      deleted: ids.length 
    });
  } catch (error) {
    console.error('Delete applications error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// SQL function needed:
/*
CREATE OR REPLACE FUNCTION get_career_application_stats()
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total', COUNT(*),
    'new', COUNT(*) FILTER (WHERE status = 'new'),
    'reviewing', COUNT(*) FILTER (WHERE status = 'reviewing'),
    'interviewing', COUNT(*) FILTER (WHERE status = 'interviewing'),
    'hired', COUNT(*) FILTER (WHERE status = 'hired'),
    'rejected', COUNT(*) FILTER (WHERE status = 'rejected')
  ) INTO result
  FROM career_applications;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_career_application_stats TO authenticated;
*/