import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient, getAuthenticatedUser, checkUserRole } from '@/lib/supabase-server';
import { z } from 'zod';

// Update validation schema
const updateSchema = z.object({
  status: z.enum(['new', 'in_progress', 'responded', 'archived']).optional(),
  admin_notes: z.string().max(5000).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  assigned_to: z.string().uuid().nullable().optional()
});

// Get single contact
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate ID format
    if (!z.string().uuid().safeParse(params.id).success) {
      return NextResponse.json({ error: 'Invalid contact ID' }, { status: 400 });
    }

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

    const { data: contact, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    // Mark as in_progress if it's new (auto-transition)
    if (contact.status === 'new') {
      const { error: updateError } = await supabase
        .from('contact_submissions')
        .update({ 
          status: 'in_progress',
          viewed_by: user.id,
          viewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', params.id);
      
      if (!updateError) {
        contact.status = 'in_progress';
        contact.viewed_by = user.id;
        contact.viewed_at = new Date().toISOString();
      }
    }

    // Log view activity
    await supabase
      .from('admin_activity_log')
      .insert({
        action: 'view_contact_detail',
        entity_type: 'contact_submissions',
        entity_id: params.id,
        details: {
          contact_name: contact.name,
          contact_email: contact.email,
          status: contact.status
        },
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        user_agent: request.headers.get('user-agent')
      });

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
    // Validate ID format
    if (!z.string().uuid().safeParse(params.id).success) {
      return NextResponse.json({ error: 'Invalid contact ID' }, { status: 400 });
    }

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
    let validatedData;
    try {
      validatedData = updateSchema.parse(body);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { 
            error: 'Invalid update data',
            details: validationError.errors
          },
          { status: 400 }
        );
      }
      throw validationError;
    }

    // Get user profile for responder info
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('first_name, last_name, email')
      .eq('id', user.id)
      .single();

    // Build update object
    const updates: any = {
      ...validatedData,
      updated_at: new Date().toISOString()
    };

    // Set metadata for status changes
    if (validatedData.status === 'responded') {
      updates.responded_at = new Date().toISOString();
      updates.responded_by = user.id;
    }

    // Get current contact data for comparison
    const { data: currentContact } = await supabase
      .from('contact_submissions')
      .select('*')
      .eq('id', params.id)
      .single();

    if (!currentContact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    const { data: updated, error } = await supabase
      .from('contact_submissions')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Update error:', error);
      return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
    }

    // Log activity with detailed changes
    const changes: any = {};
    Object.keys(validatedData).forEach(key => {
      if (currentContact[key] !== validatedData[key as keyof typeof validatedData]) {
        changes[key] = {
          from: currentContact[key],
          to: validatedData[key as keyof typeof validatedData]
        };
      }
    });

    await supabase
      .from('admin_activity_log')
      .insert({
        action: 'update_contact',
        entity_type: 'contact_submissions',
        entity_id: params.id,
        details: {
          changes,
          responder: profile ? `${profile.first_name} ${profile.last_name}` : user.email,
          contact_name: updated.name,
          contact_email: updated.email
        },
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        user_agent: request.headers.get('user-agent')
      });

    // Send notification email if status changed to responded
    if (validatedData.status === 'responded' && currentContact.status !== 'responded') {
      try {
        // Send internal notification to track response
        const { sendEmail } = await import('@/lib/resend-client');
        await sendEmail({
          to: 'jana@bloompsychologynorthaustin.com',
          subject: `Contact Marked as Responded: ${updated.name}`,
          html: `
            <h3>Contact Response Completed</h3>
            <p><strong>Contact:</strong> ${updated.name} (${updated.email})</p>
            <p><strong>Responded by:</strong> ${profile ? `${profile.first_name} ${profile.last_name}` : user.email}</p>
            <p><strong>Original Message:</strong></p>
            <blockquote>${updated.message}</blockquote>
            ${updated.admin_notes ? `<p><strong>Admin Notes:</strong> ${updated.admin_notes}</p>` : ''}
          `,
          tags: [
            { name: 'type', value: 'contact_response_notification' }
          ]
        });
      } catch (emailError) {
        console.error('Failed to send notification email:', emailError);
      }
    }

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
    // Validate ID format
    if (!z.string().uuid().safeParse(params.id).success) {
      return NextResponse.json({ error: 'Invalid contact ID' }, { status: 400 });
    }

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

    // Get contact info before deleting for logging
    const { data: contact } = await supabase
      .from('contact_submissions')
      .select('*')
      .eq('id', params.id)
      .single();

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    const { error } = await supabase
      .from('contact_submissions')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Delete error:', error);
      return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
    }

    // Log activity with full details
    await supabase
      .from('admin_activity_log')
      .insert({
        action: 'delete_contact',
        entity_type: 'contact_submissions',
        entity_id: params.id,
        details: {
          deleted_contact: contact,
          contact_name: contact.name,
          contact_email: contact.email,
          status_at_deletion: contact.status,
          had_admin_notes: !!contact.admin_notes
        },
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        user_agent: request.headers.get('user-agent')
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete contact error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}