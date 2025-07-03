import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (!user || authError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { appointmentId, amount, description } = body;
    
    if (!appointmentId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: appointmentId, amount' },
        { status: 400 }
      );
    }
    
    // Verify the appointment belongs to the user
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointment_data')
      .select('*')
      .eq('id', appointmentId)
      .eq('user_id', user.id)
      .single();
      
    if (appointmentError || !appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }
    
    // Check if payment already exists
    const { data: existingPayment } = await supabase
      .from('appointment_payments')
      .select('*')
      .eq('appointment_id', appointmentId)
      .single();
      
    if (existingPayment && existingPayment.status !== 'failed') {
      return NextResponse.json(
        { error: 'Payment already exists for this appointment' },
        { status: 400 }
      );
    }
    
    // Get user's default payment method
    const { data: paymentMethod, error: pmError } = await supabase
      .from('user_payment_methods')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_default', true)
      .eq('status', 'active')
      .single();
      
    if (pmError || !paymentMethod) {
      return NextResponse.json(
        { error: 'No default payment method found' },
        { status: 400 }
      );
    }
    
    // Get or create Stripe customer
    let stripeCustomerId = paymentMethod.stripe_customer_id;
    
    if (!stripeCustomerId) {
      // Create Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: user.id
        }
      });
      stripeCustomerId = customer.id;
      
      // Update payment method with customer ID
      await supabase
        .from('user_payment_methods')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', paymentMethod.id);
    }
    
    // Create payment intent with authorization only (capture_method: manual)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      customer: stripeCustomerId,
      payment_method: paymentMethod.stripe_payment_method_id,
      capture_method: 'manual', // Important: This authorizes but doesn't capture
      confirmation_method: 'automatic',
      confirm: true,
      description: description || `Appointment ${appointmentId}`,
      metadata: {
        appointment_id: appointmentId,
        user_id: user.id,
        appointment_type: appointment.appointment_type
      }
    });
    
    // Save payment record
    const { error: insertError } = await supabase
      .from('appointment_payments')
      .insert({
        appointment_id: appointmentId,
        user_id: user.id,
        payment_intent_id: paymentIntent.id,
        amount: amount * 100, // Store in cents
        currency: 'usd',
        status: paymentIntent.status === 'requires_capture' ? 'authorized' : paymentIntent.status,
        payment_method_id: paymentMethod.id,
        created_at: new Date().toISOString()
      });
      
    if (insertError) {
      console.error('[Payment] Error saving payment record:', insertError);
      // Cancel the payment intent if we can't save the record
      await stripe.paymentIntents.cancel(paymentIntent.id);
      return NextResponse.json(
        { error: 'Failed to save payment record' },
        { status: 500 }
      );
    }
    
    // Update appointment payment status
    await supabase
      .from('appointment_data')
      .update({ 
        payment_status: 'authorized',
        payment_authorized_at: new Date().toISOString()
      })
      .eq('id', appointmentId);
    
    console.log(`[Payment] Created payment intent ${paymentIntent.id} for appointment ${appointmentId}`);
    
    return NextResponse.json({
      success: true,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      amount: amount,
      message: 'Payment authorized successfully'
    });
    
  } catch (error) {
    console.error('[Payment] Error creating payment intent:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { 
          success: false,
          error: error.message,
          type: error.type
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create payment intent'
      },
      { status: 500 }
    );
  }
}