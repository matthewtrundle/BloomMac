import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Get single contact
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: contact, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    // Mark as read if it's new
    if (contact.status === 'new') {
      await supabase
        .from('contact_submissions')
        .update({ status: 'in_progress' })
        .eq('id', params.id);
    }

    return NextResponse.json(contact);
  } catch (error) {
    console.error('Get contact error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Update contact
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

    const updates = await request.json();
    const allowedUpdates = ['status', 'admin_notes', 'responded_at', 'responded_by'];
    
    // Filter to only allowed fields
    const filteredUpdates: any = {};
    for (const key of allowedUpdates) {
      if (key in updates) {
        filteredUpdates[key] = updates[key];
      }
    }

    // If marking as responded, set metadata
    if (filteredUpdates.status === 'responded' && !filteredUpdates.responded_at) {
      filteredUpdates.responded_at = new Date().toISOString();
      filteredUpdates.responded_by = userId;
    }

    const { data: updated, error } = await supabase
      .from('contact_submissions')
      .update(filteredUpdates)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Update error:', error);
      return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
    }

    // Log activity
    await supabase
      .from('admin_activity_log')
      .insert({
        user_id: userId,
        action: 'update_contact',
        entity_type: 'contact_submissions',
        entity_id: params.id,
        details: {
          updates: filteredUpdates,
          admin_email: userEmail
        }
      });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update contact error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Delete contact
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('contact_submissions')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Delete error:', error);
      return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
    }

    // Log activity
    await supabase
      .from('admin_activity_log')
      .insert({
        user_id: userId,
        action: 'delete_contact',
        entity_type: 'contact_submissions',
        entity_id: params.id
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete contact error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}