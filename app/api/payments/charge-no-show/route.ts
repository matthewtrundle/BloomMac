import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  try {
    const { userId, appointmentId, amount } = await request.json();

    if (!userId || !appointmentId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user's Stripe customer ID
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    if (profileError || !profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'User not found or no Stripe customer ID' },
        { status: 400 }
      );
    }

    // Get default payment method
    const customer = await stripe.customers.retrieve(profile.stripe_customer_id);
    
    if (!customer || customer.deleted) {
      return NextResponse.json(
        { error: 'Stripe customer not found' },
        { status: 400 }
      );
    }

    const defaultPaymentMethod = (customer as Stripe.Customer).invoice_settings?.default_payment_method;
    
    if (!defaultPaymentMethod) {
      return NextResponse.json(
        { error: 'No default payment method found' },
        { status: 400 }
      );
    }

    // Create and immediately capture payment intent for no-show fee
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      customer: profile.stripe_customer_id,
      payment_method: defaultPaymentMethod as string,
      description: `No-show fee for appointment ${appointmentId}`,
      metadata: {
        appointment_id: appointmentId,
        user_id: userId,
        type: 'no_show_fee'
      },
      confirm: true,
      off_session: true,
    });

    // Update appointment with payment info
    const { error: updateError } = await supabase
      .from('appointment_data')
      .update({
        no_show_fee_charged: true,
        status: 'no_show',
        payment_status: 'charged',
        stripe_payment_intent_id: paymentIntent.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', appointmentId);

    if (updateError) {
      console.error('Error updating appointment:', updateError);
    }

    return NextResponse.json({
      success: true,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      status: paymentIntent.status
    });

  } catch (error) {
    console.error('Error charging no-show fee:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to charge no-show fee' },
      { status: 500 }
    );
  }
}