import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export interface AppointmentPayment {
  appointmentId: string;
  userId: string;
  amount: number; // in cents
  paymentMethodId?: string;
  status: 'pending' | 'authorized' | 'charged' | 'failed' | 'refunded';
  stripePaymentIntentId?: string;
  noShowFeeCharged?: boolean;
}

export interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
  isDefault: boolean;
}

// Create payment intent for appointment booking
export async function createAppointmentPaymentIntent(
  userId: string,
  appointmentId: string,
  amount: number, // in dollars
  description: string = 'Therapy Session'
): Promise<{ success: boolean; clientSecret?: string; error?: string }> {
  try {
    // Convert dollars to cents
    const amountInCents = Math.round(amount * 100);

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      capture_method: 'manual', // Authorize only, charge later
      metadata: {
        userId,
        appointmentId,
        type: 'appointment_booking'
      },
      description
    });

    // Save payment record to database
    await supabase
      .from('appointment_payments')
      .insert({
        appointment_id: appointmentId,
        user_id: userId,
        amount_cents: amountInCents,
        stripe_payment_intent_id: paymentIntent.id,
        status: 'pending',
        created_at: new Date().toISOString()
      });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment setup failed'
    };
  }
}

// Authorize payment (capture later)
export async function authorizeAppointmentPayment(
  paymentIntentId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Confirm the payment intent (this authorizes the card)
    await stripe.paymentIntents.confirm(paymentIntentId);

    // Update database status
    await supabase
      .from('appointment_payments')
      .update({ 
        status: 'authorized',
        authorized_at: new Date().toISOString()
      })
      .eq('stripe_payment_intent_id', paymentIntentId);

    return { success: true };
  } catch (error) {
    console.error('Error authorizing payment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Authorization failed'
    };
  }
}

// Capture payment (24 hours before appointment)
export async function captureAppointmentPayment(
  appointmentId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get payment record
    const { data: payment, error: fetchError } = await supabase
      .from('appointment_payments')
      .select('*')
      .eq('appointment_id', appointmentId)
      .eq('status', 'authorized')
      .single();

    if (fetchError || !payment) {
      return { success: false, error: 'Payment record not found' };
    }

    // Capture the payment with Stripe
    await stripe.paymentIntents.capture(payment.stripe_payment_intent_id);

    // Update database status
    await supabase
      .from('appointment_payments')
      .update({ 
        status: 'charged',
        charged_at: new Date().toISOString()
      })
      .eq('appointment_id', appointmentId);

    return { success: true };
  } catch (error) {
    console.error('Error capturing payment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment capture failed'
    };
  }
}

// Charge no-show fee
export async function chargeNoShowFee(
  appointmentId: string,
  feeAmount: number = 50 // Default $50 no-show fee
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get appointment and user info
    const { data: appointment, error: aptError } = await supabase
      .from('appointment_data')
      .select('user_id, appointment_type')
      .eq('id', appointmentId)
      .single();

    if (aptError || !appointment) {
      return { success: false, error: 'Appointment not found' };
    }

    // Get user's default payment method
    const { data: paymentMethods } = await supabase
      .from('user_payment_methods')
      .select('stripe_payment_method_id')
      .eq('user_id', appointment.user_id)
      .eq('is_default', true)
      .single();

    if (!paymentMethods) {
      return { success: false, error: 'No payment method on file' };
    }

    // Create and charge payment intent for no-show fee
    const paymentIntent = await stripe.paymentIntents.create({
      amount: feeAmount * 100, // Convert to cents
      currency: 'usd',
      payment_method: paymentMethods.stripe_payment_method_id,
      confirm: true,
      return_url: `${process.env.NEXT_PUBLIC_URL}/appointments`,
      metadata: {
        userId: appointment.user_id,
        appointmentId,
        type: 'no_show_fee'
      },
      description: `No-show fee for ${appointment.appointment_type} appointment`
    });

    // Record the no-show fee
    await supabase
      .from('appointment_payments')
      .insert({
        appointment_id: appointmentId,
        user_id: appointment.user_id,
        amount_cents: feeAmount * 100,
        stripe_payment_intent_id: paymentIntent.id,
        status: 'charged',
        payment_type: 'no_show_fee',
        charged_at: new Date().toISOString()
      });

    // Update appointment record
    await supabase
      .from('appointment_data')
      .update({ 
        no_show_fee_charged: true,
        status: 'no_show'
      })
      .eq('id', appointmentId);

    return { success: true };
  } catch (error) {
    console.error('Error charging no-show fee:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'No-show fee failed'
    };
  }
}

// Refund appointment payment
export async function refundAppointmentPayment(
  appointmentId: string,
  refundAmount?: number // Optional partial refund
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get payment record
    const { data: payment, error: fetchError } = await supabase
      .from('appointment_payments')
      .select('*')
      .eq('appointment_id', appointmentId)
      .eq('status', 'charged')
      .single();

    if (fetchError || !payment) {
      return { success: false, error: 'No charged payment found' };
    }

    // Create refund with Stripe
    const refund = await stripe.refunds.create({
      payment_intent: payment.stripe_payment_intent_id,
      amount: refundAmount ? refundAmount * 100 : undefined // Full refund if amount not specified
    });

    // Update database status
    await supabase
      .from('appointment_payments')
      .update({ 
        status: 'refunded',
        refunded_at: new Date().toISOString(),
        refund_amount_cents: refund.amount
      })
      .eq('appointment_id', appointmentId);

    return { success: true };
  } catch (error) {
    console.error('Error processing refund:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Refund failed'
    };
  }
}

// Get user's payment methods
export async function getUserPaymentMethods(userId: string): Promise<PaymentMethod[]> {
  try {
    const { data: methods, error } = await supabase
      .from('user_payment_methods')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false });

    if (error) throw error;

    return methods?.map(method => ({
      id: method.id,
      type: method.payment_method_type,
      card: method.card_details ? {
        brand: method.card_details.brand,
        last4: method.card_details.last4,
        expMonth: method.card_details.exp_month,
        expYear: method.card_details.exp_year
      } : undefined,
      isDefault: method.is_default
    })) || [];
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }
}

// Save payment method for user
export async function saveUserPaymentMethod(
  userId: string,
  paymentMethodId: string,
  setAsDefault: boolean = false
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get payment method details from Stripe
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

    // If setting as default, unset other defaults
    if (setAsDefault) {
      await supabase
        .from('user_payment_methods')
        .update({ is_default: false })
        .eq('user_id', userId);
    }

    // Save to database
    await supabase
      .from('user_payment_methods')
      .insert({
        user_id: userId,
        stripe_payment_method_id: paymentMethodId,
        payment_method_type: paymentMethod.type,
        card_details: paymentMethod.card ? {
          brand: paymentMethod.card.brand,
          last4: paymentMethod.card.last4,
          exp_month: paymentMethod.card.exp_month,
          exp_year: paymentMethod.card.exp_year
        } : null,
        is_default: setAsDefault,
        created_at: new Date().toISOString()
      });

    return { success: true };
  } catch (error) {
    console.error('Error saving payment method:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save payment method'
    };
  }
}

// Get payment history for user
export async function getUserPaymentHistory(userId: string) {
  try {
    const { data, error } = await supabase
      .from('appointment_payments')
      .select(`
        *,
        appointment_data (
          appointment_date,
          appointment_type,
          status
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(payment => ({
      id: payment.id,
      amount: payment.amount_cents / 100,
      status: payment.status,
      type: payment.payment_type || 'appointment',
      date: payment.created_at,
      appointment: payment.appointment_data ? {
        date: payment.appointment_data.appointment_date,
        type: payment.appointment_data.appointment_type,
        status: payment.appointment_data.status
      } : null
    })) || [];
  } catch (error) {
    console.error('Error fetching payment history:', error);
    return [];
  }
}