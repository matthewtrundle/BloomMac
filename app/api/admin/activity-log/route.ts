import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase-unified';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;
    const action = searchParams.get('action');
    const entityType = searchParams.get('entityType');

    const supabase = getServiceSupabase();
    
    // Build query
    let query = supabase
      .from('admin_activity_log')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply filters if provided
    if (action) {
      query = query.eq('action', action);
    }
    if (entityType) {
      query = query.eq('entity_type', entityType);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error) throw error;

    // Format the response
    const formattedData = data.map(item => ({
      id: item.id,
      action: item.action,
      entityType: item.entity_type,
      entityId: item.entity_id,
      details: item.details || {},
      ipAddress: item.ip_address,
      userAgent: item.user_agent,
      createdAt: item.created_at
    }));

    return NextResponse.json({
      activities: formattedData,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching activity log:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity log', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, entityType, entityId, details } = await request.json();
    
    if (!action || !entityType) {
      return NextResponse.json(
        { error: 'Action and entityType are required' },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();
    
    // Get user info from headers (set by middleware)
    const userEmail = request.headers.get('x-user-email');
    const userId = request.headers.get('x-user-id');
    
    const { data, error } = await supabase
      .from('admin_activity_log')
      .insert({
        action,
        entity_type: entityType,
        entity_id: entityId,
        details: {
          ...details,
          admin_email: userEmail,
          admin_id: userId
        },
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        user_agent: request.headers.get('user-agent'),
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      success: true,
      activity: data
    });

  } catch (error) {
    console.error('Error logging activity:', error);
    return NextResponse.json(
      { error: 'Failed to log activity', details: error.message },
      { status: 500 }
    );
  }
}