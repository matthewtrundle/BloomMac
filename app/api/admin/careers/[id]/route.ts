import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceClient } from '@/lib/supabase-server';

// Get single application
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create Supabase service client for admin operations
    const supabase = createSupabaseServiceClient();

    const { data: application, error } = await supabase
      .from('career_applications')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Mark as reviewed if it's new
    if (application.status === 'new') {
      await supabase
        .from('career_applications')
        .update({ 
          status: 'reviewing',
          reviewed_by: userId,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', params.id);
      
      application.status = 'reviewing';
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error('Get application error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Update application
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id');
    const userEmail = request.headers.get('x-user-email');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create Supabase service client for admin operations
    const supabase = createSupabaseServiceClient();

    const updates = await request.json();
    const allowedUpdates = ['status', 'admin_notes', 'reviewed_at', 'reviewed_by'];
    
    // Filter to only allowed fields
    const filteredUpdates: any = {};
    for (const key of allowedUpdates) {
      if (key in updates) {
        filteredUpdates[key] = updates[key];
      }
    }

    // Set metadata for status changes
    if (filteredUpdates.status) {
      filteredUpdates.reviewed_by = userId;
      filteredUpdates.reviewed_at = new Date().toISOString();
    }

    const { data: updated, error } = await supabase
      .from('career_applications')
      .update(filteredUpdates)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Update error:', error);
      return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
    }

    // Log activity
    await supabase
      .from('admin_activity_log')
      .insert({
        user_id: userId,
        action: 'update_application',
        entity_type: 'career_applications',
        entity_id: params.id,
        details: {
          updates: filteredUpdates,
          admin_email: userEmail,
          applicant_name: `${updated.first_name} ${updated.last_name}`
        }
      });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update application error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Delete application
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create Supabase service client for admin operations
    const supabase = createSupabaseServiceClient();

    // Get application info before deleting for logging
    const { data: application } = await supabase
      .from('career_applications')
      .select('first_name, last_name, email, position')
      .eq('id', params.id)
      .single();

    const { error } = await supabase
      .from('career_applications')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Delete error:', error);
      return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 });
    }

    // Log activity
    await supabase
      .from('admin_activity_log')
      .insert({
        user_id: userId,
        action: 'delete_application',
        entity_type: 'career_applications',
        entity_id: params.id,
        details: {
          applicant_name: application ? `${application.first_name} ${application.last_name}` : 'Unknown',
          applicant_email: application?.email,
          position: application?.position
        }
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete application error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}