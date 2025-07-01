import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    console.error('❌ No stripe-signature header');
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log(`✅ Stripe webhook received: ${event.type}`);

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      default:
        console.log(`🔔 Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('💰 Payment succeeded:', paymentIntent.id);
  
  // Log payment in database
  const { error } = await supabase
    .from('payments')
    .insert({
      stripe_payment_intent_id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: 'succeeded',
      customer_email: paymentIntent.receipt_email,
      metadata: paymentIntent.metadata
    });

  if (error) {
    console.error('Failed to log payment:', error);
  }

  // If this was for a course purchase, grant access
  if (paymentIntent.metadata?.type === 'course_purchase') {
    await grantCourseAccess(
      paymentIntent.metadata.user_id,
      paymentIntent.metadata.course_id
    );
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('❌ Payment failed:', paymentIntent.id);
  
  // Log failed payment
  await supabase
    .from('payments')
    .insert({
      stripe_payment_intent_id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: 'failed',
      customer_email: paymentIntent.receipt_email,
      metadata: paymentIntent.metadata,
      failure_reason: paymentIntent.last_payment_error?.message
    });
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('📱 Subscription created:', subscription.id);
  
  // Create subscription record
  await supabase
    .from('subscriptions')
    .insert({
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer as string,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000),
      metadata: subscription.metadata
    });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('📱 Subscription updated:', subscription.id);
  
  // Update subscription record
  await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000),
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id);
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  console.log('❌ Subscription canceled:', subscription.id);
  
  // Update subscription status
  await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('📄 Invoice payment succeeded:', invoice.id);
  
  // Log invoice payment
  await supabase
    .from('invoice_payments')
    .insert({
      stripe_invoice_id: invoice.id,
      stripe_subscription_id: invoice.subscription as string,
      amount_paid: invoice.amount_paid,
      currency: invoice.currency,
      status: 'paid',
      period_start: new Date(invoice.period_start * 1000),
      period_end: new Date(invoice.period_end * 1000)
    });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('🛒 Checkout completed:', session.id);
  
  // Handle different checkout types
  if (session.metadata?.type === 'course_purchase') {
    await grantCourseAccess(
      session.metadata.user_id,
      session.metadata.course_id
    );
  }
  
  if (session.metadata?.type === 'appointment_booking') {
    await confirmAppointment(session.metadata.appointment_id);
  }
}

async function grantCourseAccess(userId: string, courseId: string) {
  console.log(`🎓 Granting course access: User ${userId} → Course ${courseId}`);
  
  try {
    // Create course enrollment
    const { error } = await supabase
      .from('course_enrollments')
      .upsert({
        user_id: userId,
        course_id: courseId,
        status: 'active',
        enrolled_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,course_id'
      });

    if (error) {
      console.error('Failed to grant course access:', error);
    } else {
      console.log('✅ Course access granted successfully');
    }
  } catch (error) {
    console.error('Error granting course access:', error);
  }
}

async function confirmAppointment(appointmentId: string) {
  console.log(`📅 Confirming appointment: ${appointmentId}`);
  
  try {
    const { error } = await supabase
      .from('appointments')
      .update({
        status: 'confirmed',
        payment_status: 'paid',
        updated_at: new Date().toISOString()
      })
      .eq('id', appointmentId);

    if (error) {
      console.error('Failed to confirm appointment:', error);
    } else {
      console.log('✅ Appointment confirmed successfully');
    }
  } catch (error) {
    console.error('Error confirming appointment:', error);
  }
}