import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Store webhook event to prevent duplicate processing
    const { data: existingEvent } = await supabase
      .from('stripe_webhook_events')
      .select('id')
      .eq('stripe_event_id', event.id)
      .single();

    if (existingEvent) {
      console.log('Event already processed:', event.id);
      return NextResponse.json({ received: true });
    }

    // Store the webhook event
    const { error: insertError } = await supabase
      .from('stripe_webhook_events')
      .insert({
        stripe_event_id: event.id,
        event_type: event.type,
        event_data: event,
      });

    if (insertError) {
      console.error('Failed to store webhook event:', insertError);
      return NextResponse.json(
        { error: 'Failed to store event' },
        { status: 500 }
      );
    }

    // Process the event based on type
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await handlePaymentIntentSucceeded(event);
          break;

        case 'payment_intent.payment_failed':
          await handlePaymentIntentFailed(event);
          break;

        case 'checkout.session.completed':
          await handleCheckoutSessionCompleted(event);
          break;

        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          await handleSubscriptionChange(event);
          break;

        case 'payment_method.attached':
          await handlePaymentMethodAttached(event);
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      // Mark webhook as processed
      await supabase
        .from('stripe_webhook_events')
        .update({ processed: true, processed_at: new Date().toISOString() })
        .eq('stripe_event_id', event.id);

    } catch (error: any) {
      console.error('Error processing webhook:', error);
      
      // Mark webhook as failed
      await supabase
        .from('stripe_webhook_events')
        .update({ 
          processed: false, 
          error_message: error.message,
          retry_count: 1 
        })
        .eq('stripe_event_id', event.id);

      return NextResponse.json(
        { error: 'Webhook processing failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

async function handlePaymentIntentSucceeded(event: Stripe.Event) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  
  // Update appointment payment status
  const { error } = await supabase
    .from('appointment_payments')
    .update({
      status: 'charged',
      charged_at: new Date().toISOString(),
    })
    .eq('stripe_payment_intent_id', paymentIntent.id);

  if (error) {
    throw new Error(`Failed to update payment status: ${error.message}`);
  }

  // Create user notification
  const appointmentResult = await supabase
    .from('appointment_payments')
    .select('user_id, appointment_id')
    .eq('stripe_payment_intent_id', paymentIntent.id)
    .single();

  if (appointmentResult.data) {
    await supabase.rpc('create_user_notification', {
      p_user_id: appointmentResult.data.user_id,
      p_type: 'payment',
      p_title: 'Payment Successful',
      p_message: `Your payment of $${(paymentIntent.amount / 100).toFixed(2)} has been processed successfully.`,
      p_data: { payment_intent_id: paymentIntent.id }
    });
  }
}

async function handlePaymentIntentFailed(event: Stripe.Event) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  
  // Update payment status
  const { error } = await supabase
    .from('appointment_payments')
    .update({
      status: 'failed',
      failure_reason: paymentIntent.last_payment_error?.message || 'Unknown error',
    })
    .eq('stripe_payment_intent_id', paymentIntent.id);

  if (error) {
    throw new Error(`Failed to update payment status: ${error.message}`);
  }

  // Create user notification
  const appointmentResult = await supabase
    .from('appointment_payments')
    .select('user_id')
    .eq('stripe_payment_intent_id', paymentIntent.id)
    .single();

  if (appointmentResult.data) {
    await supabase.rpc('create_user_notification', {
      p_user_id: appointmentResult.data.user_id,
      p_type: 'payment',
      p_title: 'Payment Failed',
      p_message: 'Your payment could not be processed. Please update your payment method.',
      p_action_url: '/appointments'
    });
  }
}

async function handleCheckoutSessionCompleted(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;
  
  if (session.payment_status === 'paid' && session.metadata?.course_id) {
    // Update course enrollment
    const { error } = await supabase
      .from('course_enrollments')
      .update({
        payment_status: 'paid',
        stripe_session_id: session.id,
        amount_paid: (session.amount_total || 0) / 100,
      })
      .eq('user_id', session.metadata.user_id)
      .eq('course_id', session.metadata.course_id);

    if (error) {
      throw new Error(`Failed to update enrollment: ${error.message}`);
    }

    // Create notification
    await supabase.rpc('create_user_notification', {
      p_user_id: session.metadata.user_id,
      p_type: 'course',
      p_title: 'Course Access Granted',
      p_message: 'Welcome to your course! You now have full access.',
      p_action_url: `/course/${session.metadata.course_id}`
    });

    // Award achievement
    await supabase
      .from('user_achievements')
      .insert({
        user_id: session.metadata.user_id,
        achievement_id: 'first_course_enrolled'
      })
      .select();
  }
}

async function handleSubscriptionChange(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  
  // Handle subscription logic here
  console.log('Subscription event:', event.type, subscription.id);
}

async function handlePaymentMethodAttached(event: Stripe.Event) {
  const paymentMethod = event.data.object as Stripe.PaymentMethod;
  
  if (paymentMethod.customer) {
    // Find user by stripe customer ID
    const { data: userData } = await supabase
      .from('user_profiles')
      .select('user_id')
      .eq('stripe_customer_id', paymentMethod.customer)
      .single();

    if (userData) {
      // Check if this is the first payment method
      const { count } = await supabase
        .from('user_payment_methods')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userData.user_id);

      // Store payment method
      await supabase
        .from('user_payment_methods')
        .insert({
          user_id: userData.user_id,
          stripe_payment_method_id: paymentMethod.id,
          payment_method_type: paymentMethod.type,
          card_details: paymentMethod.card ? {
            brand: paymentMethod.card.brand,
            last4: paymentMethod.card.last4,
            exp_month: paymentMethod.card.exp_month,
            exp_year: paymentMethod.card.exp_year,
          } : null,
          is_default: count === 0, // First payment method is default
        });
    }
  }
}