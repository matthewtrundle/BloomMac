import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient, getAuthenticatedUser, checkUserRole } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    // Create authenticated Supabase client
    const { supabase } = createSupabaseRouteHandlerClient(request);
    
    // Get authenticated user
    const user = await getAuthenticatedUser(supabase);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user has admin role
    const isAdmin = await checkUserRole(supabase, user.id, 'admin');
    if (!isAdmin) {
      // Log unauthorized access attempt
      await supabase
        .from('admin_activity_log')
        .insert({
          action: 'unauthorized_access_attempt',
          entity_type: 'admin_contacts',
          details: {
            user_id: user.id,
            endpoint: '/api/admin/contacts'
          },
          ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
          user_agent: request.headers.get('user-agent')
        });
        
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || 'all';
    const search = searchParams.get('search') || '';
    
    // Validate parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }
    
    const offset = (page - 1) * limit;
    
    // Build query
    let query = supabase
      .from('contact_submissions')
      .select('*', { count: 'exact' });
    
    // Apply filters
    if (status !== 'all') {
      query = query.eq('status', status);
    }
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,message.ilike.%${search}%`);
    }
    
    // Apply pagination and ordering
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    const { data: contacts, error, count } = await query;
    
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch contacts' },
        { status: 500 }
      );
    }
    
    // Log admin activity
    await supabase
      .from('admin_activity_log')
      .insert({
        action: 'view_contacts',
        entity_type: 'contact_submissions',
        details: {
          page,
          limit,
          status,
          search,
          results_count: contacts?.length || 0
        },
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        user_agent: request.headers.get('user-agent')
      });
    
    return NextResponse.json({
      contacts: contacts || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Create authenticated Supabase client
    const { supabase } = createSupabaseRouteHandlerClient(request);
    
    // Get authenticated user
    const user = await getAuthenticatedUser(supabase);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check admin role
    const isAdmin = await checkUserRole(supabase, user.id, 'admin');
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    const { ids, status } = body;
    
    // Validate input
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Invalid contact IDs' },
        { status: 400 }
      );
    }
    
    const validStatuses = ['new', 'contacted', 'converted', 'archived'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }
    
    // Update contacts
    const { data, error } = await supabase
      .from('contact_submissions')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .in('id', ids)
      .select();
    
    if (error) {
      console.error('Update error:', error);
      return NextResponse.json(
        { error: 'Failed to update contacts' },
        { status: 500 }
      );
    }
    
    // Log admin activity
    await supabase
      .from('admin_activity_log')
      .insert({
        action: 'update_contact_status',
        entity_type: 'contact_submissions',
        details: {
          ids,
          new_status: status,
          updated_count: data?.length || 0
        },
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        user_agent: request.headers.get('user-agent')
      });
    
    return NextResponse.json({
      success: true,
      updated: data?.length || 0
    });
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}