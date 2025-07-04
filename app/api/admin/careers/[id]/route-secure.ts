import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient, getAuthenticatedUser, checkUserRole } from '@/lib/supabase-server';
import { z } from 'zod';

// Update validation schema
const updateSchema = z.object({
  status: z.enum(['new', 'reviewing', 'interviewing', 'hired', 'rejected']).optional(),
  admin_notes: z.string().max(5000).optional(),
  interview_date: z.string().datetime().optional(),
  interview_notes: z.string().max(2000).optional()
});

// Get single application
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate ID format
    if (!z.string().uuid().safeParse(params.id).success) {
      return NextResponse.json({ error: 'Invalid application ID' }, { status: 400 });
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

    const { data: application, error } = await supabase
      .from('career_applications')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Mark as reviewed if it's new (auto-transition)
    if (application.status === 'new') {
      const { error: updateError } = await supabase
        .from('career_applications')
        .update({ 
          status: 'reviewing',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', params.id);
      
      if (!updateError) {
        application.status = 'reviewing';
        application.reviewed_by = user.id;
        application.reviewed_at = new Date().toISOString();
      }
    }

    // Log view activity
    await supabase
      .from('admin_activity_log')
      .insert({
        action: 'view_application_detail',
        entity_type: 'career_applications',
        entity_id: params.id,
        details: {
          applicant_name: `${application.first_name} ${application.last_name}`,
          position: application.position,
          status: application.status
        },
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        user_agent: request.headers.get('user-agent')
      });

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
    // Validate ID format
    if (!z.string().uuid().safeParse(params.id).success) {
      return NextResponse.json({ error: 'Invalid application ID' }, { status: 400 });
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

    // Get user profile for reviewer info
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
    if (validatedData.status) {
      updates.reviewed_by = user.id;
      updates.reviewed_at = new Date().toISOString();
    }

    // Get current application data for comparison
    const { data: currentApp } = await supabase
      .from('career_applications')
      .select('*')
      .eq('id', params.id)
      .single();

    if (!currentApp) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const { data: updated, error } = await supabase
      .from('career_applications')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Update error:', error);
      return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
    }

    // Log activity with detailed changes
    const changes: any = {};
    Object.keys(validatedData).forEach(key => {
      if (currentApp[key] !== validatedData[key as keyof typeof validatedData]) {
        changes[key] = {
          from: currentApp[key],
          to: validatedData[key as keyof typeof validatedData]
        };
      }
    });

    await supabase
      .from('admin_activity_log')
      .insert({
        action: 'update_application',
        entity_type: 'career_applications',
        entity_id: params.id,
        details: {
          changes,
          reviewer: profile ? `${profile.first_name} ${profile.last_name}` : user.email,
          applicant_name: `${updated.first_name} ${updated.last_name}`,
          position: updated.position
        },
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        user_agent: request.headers.get('user-agent')
      });

    // Send notification email if status changed to interviewing
    if (validatedData.status === 'interviewing' && currentApp.status !== 'interviewing') {
      try {
        const { sendEmail } = await import('@/lib/resend-client');
        await sendEmail({
          to: updated.email,
          subject: 'Interview Invitation - Bloom Psychology',
          html: `
            <h2>Congratulations!</h2>
            <p>Dear ${updated.first_name},</p>
            <p>We're impressed with your application for the <strong>${updated.position}</strong> position at Bloom Psychology.</p>
            <p>We would like to invite you for an interview. Our team will contact you within the next 2 business days to schedule a convenient time.</p>
            <p>Best regards,<br>Bloom Psychology HR Team</p>
          `,
          tags: [
            { name: 'type', value: 'interview_invitation' }
          ]
        });
      } catch (emailError) {
        console.error('Failed to send interview email:', emailError);
      }
    }

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
    // Validate ID format
    if (!z.string().uuid().safeParse(params.id).success) {
      return NextResponse.json({ error: 'Invalid application ID' }, { status: 400 });
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

    // Get application info before deleting for logging
    const { data: application } = await supabase
      .from('career_applications')
      .select('*')
      .eq('id', params.id)
      .single();

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const { error } = await supabase
      .from('career_applications')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Delete error:', error);
      return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 });
    }

    // Log activity with full details
    await supabase
      .from('admin_activity_log')
      .insert({
        action: 'delete_application',
        entity_type: 'career_applications',
        entity_id: params.id,
        details: {
          deleted_application: application,
          applicant_name: `${application.first_name} ${application.last_name}`,
          applicant_email: application.email,
          position: application.position,
          status_at_deletion: application.status
        },
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        user_agent: request.headers.get('user-agent')
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete application error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}