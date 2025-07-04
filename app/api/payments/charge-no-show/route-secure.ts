import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient, getAuthenticatedUser, checkUserRole } from '@/lib/supabase-server';
import Stripe from 'stripe';
import { z } from 'zod';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Input validation schema
const chargeSchema = z.object({
  appointmentId: z.string().uuid(),
  amount: z.number().positive().max(1000) // Max $1000 for safety
});

export async function POST(request: NextRequest) {
  try {
    // Create authenticated Supabase client
    const { supabase } = createSupabaseRouteHandlerClient(request);
    
    // Get authenticated user
    const user = await getAuthenticatedUser(supabase);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user has admin/provider role
    const isAuthorized = await checkUserRole(supabase, user.id, 'provider');
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Forbidden - Provider access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate input
    let validatedData;
    try {
      validatedData = chargeSchema.parse(body);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { 
            error: 'Invalid input',
            details: validationError.errors
          },
          { status: 400 }
        );
      }
      throw validationError;
    }

    const { appointmentId, amount } = validatedData;

    // Get appointment details to verify it exists and get user ID
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointment_data')
      .select('id, user_id, status, no_show_fee_charged, calendly_event_id')
      .eq('id', appointmentId)
      .single();

    if (appointmentError || !appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Verify appointment is marked as no-show
    if (appointment.status !== 'no_show') {
      return NextResponse.json(
        { error: 'Appointment must be marked as no-show before charging fee' },
        { status: 400 }
      );
    }

    // Check if already charged
    if (appointment.no_show_fee_charged) {
      return NextResponse.json(
        { error: 'No-show fee already charged for this appointment' },
        { status: 400 }
      );
    }

    // Get user's Stripe customer ID
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('stripe_customer_id, email, first_name, last_name')
      .eq('id', appointment.user_id)
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
        user_id: appointment.user_id,
        type: 'no_show_fee',
        charged_by: user.id,
        charged_at: new Date().toISOString()
      },
      confirm: true,
      off_session: true,
      error_on_requires_action: true, // Fail if requires additional auth
    });

    // Update appointment with payment info
    const { error: updateError } = await supabase
      .from('appointment_data')
      .update({
        no_show_fee_charged: true,
        no_show_fee_amount: amount,
        payment_status: 'charged',
        stripe_payment_intent_id: paymentIntent.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', appointmentId);

    if (updateError) {
      console.error('Error updating appointment:', updateError);
      // Continue - payment was successful even if update failed
    }

    // Log the charge in admin activity log
    await supabase
      .from('admin_activity_log')
      .insert({
        action: 'charge_no_show_fee',
        entity_type: 'appointment',
        entity_id: appointmentId,
        details: {
          user_id: appointment.user_id,
          amount: amount,
          payment_intent_id: paymentIntent.id,
          customer_email: profile.email
        },
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        user_agent: request.headers.get('user-agent')
      });

    // Send receipt email
    try {
      const { sendEmail } = await import('@/lib/resend-client');
      await sendEmail({
        to: profile.email,
        subject: 'No-Show Fee Receipt - Bloom Psychology',
        html: `
          <h2>No-Show Fee Receipt</h2>
          <p>Dear ${profile.first_name},</p>
          <p>A no-show fee of $${amount.toFixed(2)} has been charged to your account for missing your scheduled appointment.</p>
          <p><strong>Appointment ID:</strong> ${appointmentId}</p>
          <p><strong>Payment ID:</strong> ${paymentIntent.id}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p>If you believe this charge was made in error, please contact us immediately.</p>
          <p>Best regards,<br>Bloom Psychology</p>
        `,
        tags: [
          { name: 'type', value: 'no_show_receipt' }
        ]
      });
    } catch (emailError) {
      console.error('Error sending receipt email:', emailError);
    }

    return NextResponse.json({
      success: true,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      status: paymentIntent.status
    });

  } catch (error) {
    console.error('Error charging no-show fee:', error);
    
    // Handle specific Stripe errors
    if (error instanceof Stripe.errors.StripeError) {
      if (error.type === 'StripeCardError') {
        return NextResponse.json(
          { error: 'Card declined. Please update payment method.' },
          { status: 402 }
        );
      }
      if (error.type === 'StripeInvalidRequestError') {
        return NextResponse.json(
          { error: 'Invalid payment request' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to charge no-show fee' },
      { status: 500 }
    );
  }
}