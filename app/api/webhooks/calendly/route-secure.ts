import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceClient, validateWebhookSignature } from '@/lib/supabase-server';
import crypto from 'crypto';

// Calendly event types we handle
const HANDLED_EVENTS = [
  'invitee.created',
  'invitee.canceled',
  'invitee_no_show.created',
  'invitee_no_show.deleted'
];

export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await request.text();
    
    // Verify Calendly webhook signature
    const signature = request.headers.get('Calendly-Webhook-Signature');
    if (!signature) {
      console.error('Missing Calendly webhook signature');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }
    
    // Validate signature
    const webhookSecret = process.env.CALENDLY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('CALENDLY_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      );
    }
    
    // Calendly uses different signature format
    const isValid = verifyCalendlySignature(rawBody, signature, webhookSecret);
    if (!isValid) {
      console.error('Invalid Calendly webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }
    
    // Parse the webhook payload
    const event = JSON.parse(rawBody);
    
    // Check if we handle this event type
    if (!HANDLED_EVENTS.includes(event.event)) {
      console.log(`Ignoring unhandled event type: ${event.event}`);
      return NextResponse.json({ received: true });
    }
    
    // Log webhook receipt
    console.log(`Processing Calendly webhook: ${event.event}`, {
      event_id: event.payload?.event?.uuid,
      invitee_email: event.payload?.invitee?.email
    });
    
    // For webhooks, we need service role to create appointments
    // This is acceptable because we've validated the webhook signature
    const supabase = createSupabaseServiceClient();
    
    // Process based on event type
    switch (event.event) {
      case 'invitee.created':
        await handleInviteeCreated(supabase, event.payload);
        break;
        
      case 'invitee.canceled':
        await handleInviteeCanceled(supabase, event.payload);
        break;
        
      case 'invitee_no_show.created':
        await handleNoShowCreated(supabase, event.payload);
        break;
        
      case 'invitee_no_show.deleted':
        await handleNoShowDeleted(supabase, event.payload);
        break;
    }
    
    // Return success
    return NextResponse.json({ received: true });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    
    // Return success to prevent Calendly from retrying
    // Log the error for investigation
    return NextResponse.json({ received: true });
  }
}

function verifyCalendlySignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  // Calendly signature format: t=timestamp,v1=signature
  const elements = signature.split(',');
  let timestamp = '';
  let signatures: string[] = [];
  
  for (const element of elements) {
    const [key, value] = element.split('=');
    if (key === 't') {
      timestamp = value;
    } else if (key === 'v1') {
      signatures.push(value);
    }
  }
  
  if (!timestamp || signatures.length === 0) {
    return false;
  }
  
  // Verify timestamp is within 5 minutes
  const currentTime = Math.floor(Date.now() / 1000);
  const webhookTime = parseInt(timestamp);
  if (currentTime - webhookTime > 300) {
    console.error('Webhook timestamp too old');
    return false;
  }
  
  // Calculate expected signature
  const signedPayload = `${timestamp}.${payload}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');
  
  // Compare signatures
  return signatures.some(sig => 
    crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSignature))
  );
}

async function handleInviteeCreated(supabase: any, payload: any) {
  const { invitee, event } = payload;
  
  // Extract user info
  const email = invitee.email;
  const name = invitee.name;
  const [firstName, ...lastNameParts] = name.split(' ');
  const lastName = lastNameParts.join(' ');
  
  // Find or create user profile
  let userId;
  
  // First check if user exists by email
  const { data: existingUser } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('email', email)
    .single();
  
  if (existingUser) {
    userId = existingUser.id;
  } else {
    // Create a basic profile for the appointment
    const { data: newProfile, error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        email,
        first_name: firstName,
        last_name: lastName,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (profileError) {
      console.error('Error creating user profile:', profileError);
      // Continue anyway - appointment more important than profile
    } else {
      userId = newProfile.id;
    }
  }
  
  // Create appointment record
  const appointmentData = {
    user_id: userId,
    calendly_event_id: event.uuid,
    calendly_invitee_id: invitee.uuid,
    appointment_date: event.start_time,
    appointment_type: event.event_type.slug,
    duration_minutes: event.event_type.duration,
    status: 'scheduled',
    payment_status: 'pending',
    calendly_cancel_url: invitee.cancel_url,
    calendly_reschedule_url: invitee.reschedule_url,
    metadata: {
      event_name: event.event_type.name,
      location: event.location,
      questions_answers: invitee.questions_and_answers,
      timezone: invitee.timezone
    },
    created_at: new Date().toISOString()
  };
  
  const { error: appointmentError } = await supabase
    .from('appointment_data')
    .insert(appointmentData);
  
  if (appointmentError) {
    console.error('Error creating appointment:', appointmentError);
    throw appointmentError;
  }
  
  // Send confirmation email
  try {
    const { sendEmail } = await import('@/lib/resend-client');
    await sendEmail({
      to: email,
      subject: 'Appointment Confirmed - Bloom Psychology',
      html: `
        <h2>Your appointment is confirmed!</h2>
        <p>Hi ${firstName},</p>
        <p>Your appointment with Dr. Jana Rundle is confirmed for:</p>
        <p><strong>${new Date(event.start_time).toLocaleString()}</strong></p>
        <p>Location: ${event.location?.location || 'Virtual Session'}</p>
        <p>If you need to change your appointment:</p>
        <ul>
          <li><a href="${invitee.reschedule_url}">Reschedule</a></li>
          <li><a href="${invitee.cancel_url}">Cancel</a></li>
        </ul>
        <p>We look forward to seeing you!</p>
      `,
      tags: [
        { name: 'type', value: 'appointment_confirmation' }
      ]
    });
  } catch (emailError) {
    console.error('Error sending confirmation email:', emailError);
  }
  
  console.log(`Appointment created for ${email} on ${event.start_time}`);
}

async function handleInviteeCanceled(supabase: any, payload: any) {
  const { invitee, event } = payload;
  
  // Update appointment status
  const { error } = await supabase
    .from('appointment_data')
    .update({
      status: 'canceled',
      updated_at: new Date().toISOString(),
      canceled_at: new Date().toISOString(),
      cancellation_reason: invitee.cancellation?.reason
    })
    .eq('calendly_invitee_id', invitee.uuid);
  
  if (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }
  
  console.log(`Appointment canceled for ${invitee.email}`);
}

async function handleNoShowCreated(supabase: any, payload: any) {
  const { invitee, event } = payload;
  
  // Update appointment as no-show
  const { error } = await supabase
    .from('appointment_data')
    .update({
      status: 'no_show',
      no_show_marked_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('calendly_invitee_id', invitee.uuid);
  
  if (error) {
    console.error('Error marking no-show:', error);
    throw error;
  }
  
  // TODO: Trigger no-show fee processing
  console.log(`No-show marked for ${invitee.email}`);
}

async function handleNoShowDeleted(supabase: any, payload: any) {
  const { invitee } = payload;
  
  // Remove no-show status
  const { error } = await supabase
    .from('appointment_data')
    .update({
      status: 'completed',
      no_show_marked_at: null,
      updated_at: new Date().toISOString()
    })
    .eq('calendly_invitee_id', invitee.uuid);
  
  if (error) {
    console.error('Error removing no-show:', error);
    throw error;
  }
  
  console.log(`No-show removed for ${invitee.email}`);
}