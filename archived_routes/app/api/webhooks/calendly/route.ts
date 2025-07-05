import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const webhookSecret = process.env.CALENDLY_WEBHOOK_SECRET!;

// Calendly webhook event types
type CalendlyEvent = {
  event: string;
  time: string;
  payload: {
    event_type?: {
      uuid: string;
      kind: string;
      slug: string;
      name: string;
    };
    event?: {
      uuid: string;
      assigned_to: string[];
      start_time: string;
      end_time: string;
      invitees_counter: {
        total: number;
        active: number;
        limit: number;
      };
      location?: {
        type: string;
        location?: string;
      };
      cancellation?: {
        canceled_by: string;
        reason?: string;
      };
    };
    invitee?: {
      uuid: string;
      email: string;
      name: string;
      status: string;
      questions_and_answers?: Array<{
        position: number;
        question: string;
        answer: string;
      }>;
      tracking?: {
        utm_source?: string;
        utm_medium?: string;
        utm_campaign?: string;
      };
      cancel_url: string;
      reschedule_url: string;
    };
    tracking?: {
      utm_source?: string;
      utm_medium?: string;
      utm_campaign?: string;
    };
  };
};

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get('calendly-webhook-signature');

    // Verify webhook signature if provided
    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex');

      if (signature !== expectedSignature) {
        console.error('Invalid Calendly webhook signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }

    const event: CalendlyEvent = JSON.parse(body);

    // Store webhook event to prevent duplicate processing
    const eventUuid = event.payload.event?.uuid || event.payload.invitee?.uuid || crypto.randomUUID();
    
    const { data: existingEvent } = await supabase
      .from('calendly_webhook_events')
      .select('id')
      .eq('event_uuid', eventUuid)
      .eq('event_type', event.event)
      .single();

    if (existingEvent) {
      console.log('Calendly event already processed:', eventUuid);
      return NextResponse.json({ received: true });
    }

    // Store the webhook event
    const { error: insertError } = await supabase
      .from('calendly_webhook_events')
      .insert({
        event_uuid: eventUuid,
        event_type: event.event,
        uri: event.payload.event?.uuid || event.payload.invitee?.uuid,
        event_data: event,
      });

    if (insertError) {
      console.error('Failed to store Calendly webhook event:', insertError);
      return NextResponse.json(
        { error: 'Failed to store event' },
        { status: 500 }
      );
    }

    // Process the event based on type
    try {
      switch (event.event) {
        case 'invitee.created':
          await handleInviteeCreated(event);
          break;

        case 'invitee.canceled':
          await handleInviteeCanceled(event);
          break;

        case 'invitee.rescheduled':
          await handleInviteeRescheduled(event);
          break;

        default:
          console.log(`Unhandled Calendly event type: ${event.event}`);
      }

      // Mark webhook as processed
      await supabase
        .from('calendly_webhook_events')
        .update({ processed: true, processed_at: new Date().toISOString() })
        .eq('event_uuid', eventUuid)
        .eq('event_type', event.event);

    } catch (error: any) {
      console.error('Error processing Calendly webhook:', error);
      
      // Mark webhook as failed
      await supabase
        .from('calendly_webhook_events')
        .update({ 
          processed: false, 
          error_message: error.message,
          retry_count: 1 
        })
        .eq('event_uuid', eventUuid);

      return NextResponse.json(
        { error: 'Webhook processing failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Calendly webhook error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

async function handleInviteeCreated(event: CalendlyEvent) {
  const { invitee, event: eventData } = event.payload;
  
  if (!invitee || !eventData) {
    throw new Error('Missing invitee or event data');
  }

  // Extract user ID from custom answers
  const userIdAnswer = invitee.questions_and_answers?.find(qa => qa.question === 'User ID');
  const userId = userIdAnswer?.answer;

  if (!userId) {
    console.error('No user ID found in Calendly event');
    return;
  }

  // Determine appointment type from event slug
  const appointmentType = eventData.kind === 'consultation' ? 'consultation' : 
                         eventData.kind === 'therapy' ? 'therapy' : 'consultation';

  // Create appointment record
  const { data: appointment, error: appointmentError } = await supabase
    .from('appointment_data')
    .insert({
      user_id: userId,
      appointment_type: appointmentType,
      calendly_event_uri: eventData.uuid,
      calendly_invitee_uri: invitee.uuid,
      appointment_date: eventData.start_time,
      appointment_end: eventData.end_time,
      status: 'scheduled',
      metadata: {
        invitee_email: invitee.email,
        invitee_name: invitee.name,
        location: eventData.location,
        questions_answers: invitee.questions_and_answers,
        tracking: invitee.tracking,
      },
    })
    .select()
    .single();

  if (appointmentError) {
    throw new Error(`Failed to create appointment: ${appointmentError.message}`);
  }

  // Create payment authorization
  const { error: paymentError } = await supabase
    .from('appointment_payments')
    .insert({
      appointment_id: appointment.id,
      user_id: userId,
      amount_cents: 15000, // $150.00
      status: 'pending',
      payment_type: 'appointment',
    });

  if (paymentError) {
    console.error('Failed to create payment record:', paymentError);
  }

  // Create user notification
  await supabase.rpc('create_user_notification', {
    p_user_id: userId,
    p_type: 'appointment',
    p_title: 'Appointment Confirmed',
    p_message: `Your ${appointmentType} appointment is confirmed for ${new Date(eventData.start_time).toLocaleDateString()}.`,
    p_data: { appointment_id: appointment.id },
    p_action_url: '/appointments'
  });

  // Award achievement for first appointment
  const { count } = await supabase
    .from('appointment_data')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (count === 1) {
    await supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_id: 'first_appointment_scheduled'
      })
      .select();
  }
}

async function handleInviteeCanceled(event: CalendlyEvent) {
  const { invitee, event: eventData } = event.payload;
  
  if (!invitee || !eventData) {
    throw new Error('Missing invitee or event data');
  }

  // Update appointment status
  const { data: appointment, error } = await supabase
    .from('appointment_data')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('calendly_event_uri', eventData.uuid)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update appointment: ${error.message}`);
  }

  // Update payment status
  await supabase
    .from('appointment_payments')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('appointment_id', appointment.id);

  // Create notification
  await supabase.rpc('create_user_notification', {
    p_user_id: appointment.user_id,
    p_type: 'appointment',
    p_title: 'Appointment Cancelled',
    p_message: 'Your appointment has been cancelled. Any pending charges have been reversed.',
    p_data: { 
      appointment_id: appointment.id,
      cancellation_reason: eventData.cancellation?.reason 
    }
  });

  // Check cancellation policy (24 hours)
  const appointmentDate = new Date(appointment.appointment_date);
  const now = new Date();
  const hoursUntilAppointment = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursUntilAppointment < 24) {
    // Apply cancellation fee
    await supabase
      .from('appointment_payments')
      .insert({
        appointment_id: appointment.id,
        user_id: appointment.user_id,
        amount_cents: 5000, // $50 cancellation fee
        status: 'pending',
        payment_type: 'cancellation_fee',
      });

    await supabase.rpc('create_user_notification', {
      p_user_id: appointment.user_id,
      p_type: 'payment',
      p_title: 'Cancellation Fee Applied',
      p_message: 'A $50 cancellation fee has been applied due to late cancellation.',
    });
  }
}

async function handleInviteeRescheduled(event: CalendlyEvent) {
  const { invitee, event: eventData } = event.payload;
  
  if (!invitee || !eventData) {
    throw new Error('Missing invitee or event data');
  }

  // Update appointment with new time
  const { data: appointment, error } = await supabase
    .from('appointment_data')
    .update({
      appointment_date: eventData.start_time,
      appointment_end: eventData.end_time,
      updated_at: new Date().toISOString(),
      metadata: {
        rescheduled_at: new Date().toISOString(),
        rescheduled_from: event.time,
      }
    })
    .eq('calendly_event_uri', eventData.uuid)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update appointment: ${error.message}`);
  }

  // Create notification
  await supabase.rpc('create_user_notification', {
    p_user_id: appointment.user_id,
    p_type: 'appointment',
    p_title: 'Appointment Rescheduled',
    p_message: `Your appointment has been rescheduled to ${new Date(eventData.start_time).toLocaleDateString()}.`,
    p_data: { appointment_id: appointment.id },
    p_action_url: '/appointments'
  });
}