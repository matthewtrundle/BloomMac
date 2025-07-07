import { createClient } from '@supabase/supabase-js';
import { enrollmentManager } from './email-automation/enrollment-manager';
// import { Twilio } from 'twilio'; // Optional - uncomment when Twilio is configured

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Initialize Twilio client
// const twilioClient = process.env.TWILIO_ACCOUNT_SID ? new Twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// ) : null;
const twilioClient = null; // Twilio disabled until configured

export interface ReminderSettings {
  email24Hours: boolean;
  sms24Hours: boolean;
  email2Hours: boolean;
  sms2Hours: boolean;
  requireConfirmation: boolean;
}

// Send appointment reminders
export async function sendAppointmentReminders() {
  try {
    const { data: rules, error: rulesError } = await supabase
      .from('reminder_rules')
      .select('*')
      .eq('is_active', true);

    if (rulesError) {
      console.error('Error fetching reminder rules:', rulesError);
      return { success: false, error: rulesError.message };
    }

    for (const rule of rules) {
      await processReminderRule(rule);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error sending appointment reminders:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function processReminderRule(rule: any) {
  try {
    const hoursBefore = rule.trigger_config?.hours_before;
    if (!hoursBefore) return;

    const targetTime = new Date(new Date().getTime() + hoursBefore * 60 * 60 * 1000);

    // Get appointments that need reminders
    const { data: appointments, error } = await supabase
      .from('appointment_data')
      .select(`
        id,
        user_id,
        appointment_date,
        appointment_type,
        status,
        reminder_sent,
        confirmation_received,
        metadata,
        user_profiles (
          first_name,
          last_name,
          phone
        )
      `)
      .eq('status', 'scheduled')
      .gte('appointment_date', new Date(targetTime.getTime() - 30 * 60 * 1000).toISOString()) // 30 min window
      .lte('appointment_date', new Date(targetTime.getTime() + 30 * 60 * 1000).toISOString())
      .neq('reminder_sent', true);

    if (error) {
      console.error(`Error fetching appointments for ${rule.name}:`, error);
      return;
    }

    if (!appointments || appointments.length === 0) {
      console.log(`No reminders to send for ${rule.name}`);
      return;
    }

    console.log(`Processing ${appointments.length} reminders for ${rule.name}`);

    for (const appointment of appointments) {
      try {
        for (const action of rule.actions) {
          if (action.action === 'send_email') {
            await sendEmailReminder(appointment, action.template);
          } else if (action.action === 'send_sms') {
            await sendSMSReminder(appointment, action.template);
          }
        }

        // Mark reminder as sent
        await supabase
          .from('appointment_data')
          .update({ 
            reminder_sent: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', appointment.id);

      } catch (error) {
        console.error(`Error sending reminder for appointment ${appointment.id}:`, error);
      }
    }

  } catch (error) {
    console.error(`Error in processReminderRule for ${rule.name}:`, error);
  }
}

// Send email reminder
async function sendEmailReminder(appointment: any, template: string) {
  try {
    const { data: subscriber } = await supabase
      .from('subscribers')
      .select('id')
      .eq('email', appointment.user_profiles.email.toLowerCase())
      .single();

    if (subscriber) {
      await enrollmentManager.enrollSubscriber({
        subscriberId: subscriber.id,
        trigger: 'appointment_reminder',
        source: 'reminder_system',
        metadata: {
          appointment_id: appointment.id,
          appointment_type: appointment.appointment_type,
          appointment_date: appointment.appointment_date,
          template: template
        }
      });
      console.log(`Email reminder sent for appointment ${appointment.id}`);
    }
  } catch (error) {
    console.error('Error sending email reminder:', error);
  }
}

// Send SMS reminder
async function sendSMSReminder(appointment: any, template: string) {
  if (!twilioClient) {
    console.warn('Twilio not configured, skipping SMS reminder');
    return;
  }

  try {
    const appointmentDate = new Date(appointment.appointment_date);
    const confirmationUrl = `${process.env.NEXT_PUBLIC_URL}/appointments/confirm/${appointment.id}`;
    
    const message = `Hi ${appointment.user_profiles?.first_name || 'there'}! Reminder: You have a ${appointment.appointment_type} appointment on ${appointmentDate.toLocaleDateString()} at ${appointmentDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}. Please confirm: ${confirmationUrl}`;

    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: appointment.user_profiles.phone
    });

    console.log(`SMS reminder sent for appointment ${appointment.id}`);
  } catch (error) {
    console.error('Error sending SMS reminder:', error);
  }
}

// Confirm appointment
export async function confirmAppointment(appointmentId: string) {
  try {
    const { error } = await supabase
      .from('appointment_data')
      .update({ 
        confirmation_received: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', appointmentId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error confirming appointment:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Get reminder statistics
export async function getReminderStats(startDate?: string, endDate?: string) {
  try {
    let query = supabase
      .from('appointment_data')
      .select('id, reminder_sent, confirmation_received, status');

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
    const remindersSent = appointments?.filter(apt => apt.reminder_sent).length || 0;
    const confirmationsReceived = appointments?.filter(apt => apt.confirmation_received).length || 0;
    
    const reminderRate = total > 0 ? (remindersSent / total) * 100 : 0;
    const confirmationRate = remindersSent > 0 ? (confirmationsReceived / remindersSent) * 100 : 0;

    return {
      success: true,
      stats: {
        totalAppointments: total,
        remindersSent,
        confirmationsReceived,
        reminderRate: Math.round(reminderRate * 100) / 100,
        confirmationRate: Math.round(confirmationRate * 100) / 100
      }
    };

  } catch (error) {
    console.error('Error getting reminder stats:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Update user reminder preferences
export async function updateReminderPreferences(
  userId: string, 
  settings: ReminderSettings
) {
  try {
    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        reminder_settings: settings,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating reminder preferences:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Cron job function for sending reminders
export async function reminderCronJob() {
  console.log('Running appointment reminder cron job...');
  
  const result = await sendAppointmentReminders();
  
  if (result.success) {
    console.log('Appointment reminders sent successfully');
  } else {
    console.error('Reminder sending failed:', result.error);
  }
  
  return result;
}
