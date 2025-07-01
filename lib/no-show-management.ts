import { createClient } from '@supabase/supabase-js';
import { chargeNoShowFee } from './payment-management';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface NoShowPolicy {
  windowMinutes: number; // How long after appointment time to wait
  feeAmount: number; // Fee in dollars
  gracePeriod: number; // Minutes of grace period
  autoProcess: boolean; // Whether to automatically process no-shows
}

const DEFAULT_NO_SHOW_POLICY: NoShowPolicy = {
  windowMinutes: 15, // Wait 15 minutes after appointment time
  feeAmount: 50, // $50 no-show fee
  gracePeriod: 5, // 5-minute grace period
  autoProcess: true
};

// Check for no-shows and process them
export async function processNoShows(policy: NoShowPolicy = DEFAULT_NO_SHOW_POLICY) {
  try {
    const now = new Date();
    const cutoffTime = new Date(now.getTime() - (policy.windowMinutes * 60 * 1000));

    // Find appointments that should be marked as no-shows
    const { data: appointments, error } = await supabase
      .from('appointment_data')
      .select('id, user_id, appointment_date, appointment_type, status, no_show_fee_charged')
      .eq('status', 'scheduled')
      .eq('no_show_fee_charged', false)
      .lt('appointment_date', cutoffTime.toISOString());

    if (error) {
      console.error('Error fetching appointments for no-show processing:', error);
      return { success: false, error: error.message };
    }

    if (!appointments || appointments.length === 0) {
      return { success: true, processed: 0, message: 'No appointments to process' };
    }

    console.log(`Processing ${appointments.length} potential no-shows`);

    let processed = 0;
    const results = [];

    for (const appointment of appointments) {
      try {
        // Mark appointment as no-show
        const { error: updateError } = await supabase
          .from('appointment_data')
          .update({ 
            status: 'no_show',
            updated_at: new Date().toISOString()
          })
          .eq('id', appointment.id);

        if (updateError) {
          console.error(`Error updating appointment ${appointment.id}:`, updateError);
          continue;
        }

        // Charge no-show fee if auto-processing is enabled
        if (policy.autoProcess) {
          const feeResult = await chargeNoShowFee(appointment.id, policy.feeAmount);
          
          if (feeResult.success) {
            console.log(`No-show fee charged for appointment ${appointment.id}`);
            processed++;
            results.push({
              appointmentId: appointment.id,
              status: 'fee_charged',
              amount: policy.feeAmount
            });
          } else {
            console.error(`Failed to charge no-show fee for appointment ${appointment.id}:`, feeResult.error);
            results.push({
              appointmentId: appointment.id,
              status: 'fee_failed',
              error: feeResult.error
            });
          }
        } else {
          processed++;
          results.push({
            appointmentId: appointment.id,
            status: 'marked_no_show'
          });
        }

        // Send notification to user about no-show
        await sendNoShowNotification(appointment);

      } catch (error) {
        console.error(`Error processing no-show for appointment ${appointment.id}:`, error);
      }
    }

    return {
      success: true,
      processed,
      total: appointments.length,
      results
    };

  } catch (error) {
    console.error('Error in processNoShows:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Send notification about no-show
async function sendNoShowNotification(appointment: any) {
  try {
    // Get user email
    const { data: user } = await supabase.auth.admin.getUserById(appointment.user_id);
    
    if (!user.user?.email) {
      console.error('No email found for user:', appointment.user_id);
      return;
    }

    // Send email notification (you'll need to implement this with your email service)
    await fetch('/api/emails/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: user.user.email,
        template: 'no_show_notification',
        data: {
          appointmentType: appointment.appointment_type,
          appointmentDate: new Date(appointment.appointment_date).toLocaleDateString(),
          appointmentTime: new Date(appointment.appointment_date).toLocaleTimeString(),
          noShowFee: DEFAULT_NO_SHOW_POLICY.feeAmount
        }
      })
    });

  } catch (error) {
    console.error('Error sending no-show notification:', error);
  }
}

// Manual no-show marking (for provider dashboard)
export async function markAppointmentNoShow(
  appointmentId: string,
  chargeNoShowFee: boolean = true,
  feeAmount: number = DEFAULT_NO_SHOW_POLICY.feeAmount
) {
  try {
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

    let feeResult = null;

    // Charge fee if requested
    if (chargeNoShowFee) {
      feeResult = await chargeNoShowFee(appointmentId, feeAmount);
      
      if (!feeResult.success) {
        console.error('Failed to charge no-show fee:', feeResult.error);
        // Don't fail the whole operation if fee charging fails
      }
    }

    // Get appointment details for notification
    const { data: appointment } = await supabase
      .from('appointment_data')
      .select('*')
      .eq('id', appointmentId)
      .single();

    if (appointment) {
      await sendNoShowNotification(appointment);
    }

    return {
      success: true,
      feeCharged: feeResult?.success || false,
      feeError: feeResult?.error
    };

  } catch (error) {
    console.error('Error marking appointment as no-show:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Check if appointment should be considered a no-show
export function isAppointmentNoShow(
  appointmentDate: string,
  policy: NoShowPolicy = DEFAULT_NO_SHOW_POLICY
): boolean {
  const now = new Date();
  const aptDate = new Date(appointmentDate);
  const cutoffTime = new Date(aptDate.getTime() + (policy.windowMinutes * 60 * 1000));
  
  return now > cutoffTime;
}

// Get no-show statistics for a provider
export async function getNoShowStats(
  providerId?: string,
  startDate?: string,
  endDate?: string
) {
  try {
    let query = supabase
      .from('appointment_data')
      .select('id, appointment_date, status, no_show_fee_charged');

    if (providerId) {
      query = query.eq('provider_id', providerId);
    }

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
    
    const noShowRate = total > 0 ? (noShows / total) * 100 : 0;

    return {
      success: true,
      stats: {
        totalAppointments: total,
        noShows,
        noShowRate: Math.round(noShowRate * 100) / 100,
        feesCharged,
        feeCollectionRate: noShows > 0 ? (feesCharged / noShows) * 100 : 0
      }
    };

  } catch (error) {
    console.error('Error getting no-show stats:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Cron job function to run automated no-show processing
export async function noShowCronJob() {
  console.log('Running no-show processing cron job...');
  
  const result = await processNoShows();
  
  if (result.success) {
    console.log(`No-show processing completed: ${result.processed} appointments processed`);
  } else {
    console.error('No-show processing failed:', result.error);
  }
  
  return result;
}