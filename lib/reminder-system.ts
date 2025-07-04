import { createClient } from '@supabase/supabase-js';
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

const DEFAULT_REMINDER_SETTINGS: ReminderSettings = {
  email24Hours: true,
  sms24Hours: true,
  email2Hours: false,
  sms2Hours: true,
  requireConfirmation: true
};

// Send appointment reminders
export async function sendAppointmentReminders() {
  try {
    const now = new Date();
    
    // 24-hour reminders
    const twentyFourHoursFromNow = new Date(now.getTime() + (24 * 60 * 60 * 1000));
    await processReminders(twentyFourHoursFromNow, '24_hour');
    
    // 2-hour reminders
    const twoHoursFromNow = new Date(now.getTime() + (2 * 60 * 60 * 1000));
    await processReminders(twoHoursFromNow, '2_hour');
    
    return { success: true };
  } catch (error) {
    console.error('Error sending appointment reminders:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function processReminders(targetTime: Date, reminderType: '24_hour' | '2_hour') {
  try {
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
        metadata
      `)
      .eq('status', 'scheduled')
      .gte('appointment_date', new Date(targetTime.getTime() - 30 * 60 * 1000).toISOString()) // 30 min window
      .lte('appointment_date', new Date(targetTime.getTime() + 30 * 60 * 1000).toISOString())
      .neq('reminder_sent', true);

    if (error) {
      console.error('Error fetching appointments for reminders:', error);
      return;
    }

    if (!appointments || appointments.length === 0) {
      console.log(`No ${reminderType} reminders to send`);
      return;
    }

    console.log(`Processing ${appointments.length} ${reminderType} reminders`);

    for (const appointment of appointments) {
      try {
        // Get user details
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('first_name, last_name, phone')
          .eq('id', appointment.user_id)
          .single();

        const { data: user } = await supabase.auth.admin.getUserById(appointment.user_id);

        if (!user.user?.email) {
          console.error('No email found for user:', appointment.user_id);
          continue;
        }

        // Get user's reminder preferences
        const { data: preferences } = await supabase
          .from('user_preferences')
          .select('reminder_settings')
          .eq('user_id', appointment.user_id)
          .single();

        const settings = preferences?.reminder_settings || DEFAULT_REMINDER_SETTINGS;

        // Send email reminder
        if ((reminderType === '24_hour' && settings.email24Hours) || 
            (reminderType === '2_hour' && settings.email2Hours)) {
          await sendEmailReminder(appointment, user.user.email, profile);
        }

        // Send SMS reminder
        if ((reminderType === '24_hour' && settings.sms24Hours) || 
            (reminderType === '2_hour' && settings.sms2Hours)) {
          if (profile?.phone) {
            await sendSMSReminder(appointment, profile.phone, profile);
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
    console.error('Error in processReminders:', error);
  }
}

// Send email reminder
async function sendEmailReminder(appointment: any, email: string, profile: any) {
  try {
    const appointmentDate = new Date(appointment.appointment_date);
    const confirmationUrl = `${process.env.NEXT_PUBLIC_URL}/appointments/confirm/${appointment.id}`;
    
    await fetch('/api/emails/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email,
        template: 'appointment_reminder',
        data: {
          firstName: profile?.first_name || 'there',
          appointmentType: appointment.appointment_type,
          appointmentDate: appointmentDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          appointmentTime: appointmentDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
          }),
          confirmationUrl,
          rescheduleUrl: `${process.env.NEXT_PUBLIC_URL}/appointments/reschedule/${appointment.id}`,
          cancelUrl: `${process.env.NEXT_PUBLIC_URL}/appointments/cancel/${appointment.id}`
        }
      })
    });

    console.log(`Email reminder sent for appointment ${appointment.id}`);
  } catch (error) {
    console.error('Error sending email reminder:', error);
  }
}

// Send SMS reminder
async function sendSMSReminder(appointment: any, phone: string, profile: any) {
  if (!twilioClient) {
    console.warn('Twilio not configured, skipping SMS reminder');
    return;
  }

  try {
    const appointmentDate = new Date(appointment.appointment_date);
    const confirmationUrl = `${process.env.NEXT_PUBLIC_URL}/appointments/confirm/${appointment.id}`;
    
    const message = `Hi ${profile?.first_name || 'there'}! Reminder: You have a ${appointment.appointment_type} appointment on ${appointmentDate.toLocaleDateString()} at ${appointmentDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}. Please confirm: ${confirmationUrl}`;

    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
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