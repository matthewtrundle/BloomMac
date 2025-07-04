// Client-safe version of payment management
// This file can be imported in client components

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

// Charge no-show fee through API route
export async function chargeNoShowFee(
  userId: string,
  appointmentId: string,
  amount: number = 50
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/payments/charge-no-show', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        appointmentId,
        amount
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to charge no-show fee' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error charging no-show fee:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to charge no-show fee' 
    };
  }
}

// Get user's payment methods
export async function getUserPaymentMethods(userId: string): Promise<PaymentMethod[]> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    if (error || !data?.stripe_customer_id) {
      return [];
    }

    // In a real implementation, you'd call an API route that fetches from Stripe
    // For now, return empty array
    return [];
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }
}

// Check if user has valid payment method
export async function hasValidPaymentMethod(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    return !error && !!data?.stripe_customer_id;
  } catch (error) {
    console.error('Error checking payment method:', error);
    return false;
  }
}

// Get appointment payment status
export async function getAppointmentPaymentStatus(appointmentId: string) {
  try {
    const { data, error } = await supabase
      .from('appointment_data')
      .select('payment_status, no_show_fee_charged, stripe_payment_intent_id')
      .eq('id', appointmentId)
      .single();

    if (error) {
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching payment status:', error);
    return null;
  }
}

// Get user payment history
export async function getUserPaymentHistory(userId: string): Promise<any[]> {
  try {
    // In a real implementation, this would fetch from a payments table
    // For now, return empty array to prevent errors
    console.log('Getting payment history for user:', userId);
    return [];
  } catch (error) {
    console.error('Error fetching payment history:', error);
    return [];
  }
}