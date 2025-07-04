// Client-safe version of no-show management
// This file can be imported in client components

import { createClient } from '@supabase/supabase-js';
import { chargeNoShowFee } from './payment-management-client';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface NoShowPolicy {
  windowMinutes: number;
  feeAmount: number;
  gracePeriod: number;
  autoProcess: boolean;
}

// Mark appointment as no-show and optionally charge fee
export async function markAppointmentNoShow(
  appointmentId: string,
  chargeFee: boolean = false,
  feeAmount: number = 50
): Promise<{ success: boolean; error?: string }> {
  try {
    // First, get appointment details
    const { data: appointment, error: fetchError } = await supabase
      .from('appointment_data')
      .select('user_id, status, no_show_fee_charged')
      .eq('id', appointmentId)
      .single();

    if (fetchError || !appointment) {
      return { success: false, error: 'Appointment not found' };
    }

    if (appointment.status === 'no_show') {
      return { success: false, error: 'Appointment already marked as no-show' };
    }

    // Update appointment status
    const { error: updateError } = await supabase
      .from('appointment_data')
      .update({
        status: 'no_show',
        updated_at: new Date().toISOString()
      })
      .eq('id', appointmentId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // Charge fee if requested
    if (chargeFee && !appointment.no_show_fee_charged) {
      const chargeResult = await chargeNoShowFee(
        appointment.user_id,
        appointmentId,
        feeAmount
      );

      if (!chargeResult.success) {
        console.error('Failed to charge no-show fee:', chargeResult.error);
        // Don't fail the whole operation if fee charging fails
        // The appointment is already marked as no-show
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error marking no-show:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to mark as no-show' 
    };
  }
}

// Get no-show statistics
export async function getNoShowStats(
  providerId?: string,
  startDate?: string,
  endDate?: string
): Promise<{ 
  success: boolean; 
  stats?: {
    totalAppointments: number;
    noShows: number;
    noShowRate: number;
    feesCharged: number;
  };
  error?: string;
}> {
  try {
    let query = supabase
      .from('appointment_data')
      .select('id, status, no_show_fee_charged');

    if (startDate) {
      query = query.gte('appointment_date', startDate);
    }

    if (endDate) {
      query = query.lte('appointment_date', endDate);
    }

    const { data: appointments, error } = await query;

    if (error) {
      return { success: false, error: error.message };
    }

    const total = appointments?.length || 0;
    const noShows = appointments?.filter(apt => apt.status === 'no_show').length || 0;
    const feesCharged = appointments?.filter(apt => apt.no_show_fee_charged).length || 0;
    const noShowRate = total > 0 ? Math.round((noShows / total) * 100) : 0;

    return {
      success: true,
      stats: {
        totalAppointments: total,
        noShows,
        noShowRate,
        feesCharged
      }
    };
  } catch (error) {
    console.error('Error getting no-show stats:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get statistics'
    };
  }
}

// Check if appointment can be marked as no-show
export async function canMarkAsNoShow(appointmentId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('appointment_data')
      .select('appointment_date, status')
      .eq('id', appointmentId)
      .single();

    if (error || !data) {
      return false;
    }

    // Can only mark as no-show if:
    // 1. Status is 'scheduled'
    // 2. Appointment time has passed
    const appointmentTime = new Date(data.appointment_date);
    const now = new Date();

    return data.status === 'scheduled' && appointmentTime < now;
  } catch (error) {
    console.error('Error checking no-show eligibility:', error);
    return false;
  }
}