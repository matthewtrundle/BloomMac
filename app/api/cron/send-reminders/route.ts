import { NextRequest, NextResponse } from 'next/server';
import { sendAppointmentReminders } from '@/lib/reminder-system';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[Cron] Starting appointment reminder job...');
    
    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get current timestamp
    const now = new Date();
    
    // Find appointments that need reminders
    // 24-hour reminders: appointments tomorrow at this time
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // 2-hour reminders: appointments in 2 hours
    const twoHoursLater = new Date(now);
    twoHoursLater.setHours(twoHoursLater.getHours() + 2);
    
    // Fetch appointments needing 24-hour reminders
    const { data: appointments24h, error: error24h } = await supabase
      .from('appointment_data')
      .select('*, users:user_id(email, raw_user_meta_data)')
      .eq('status', 'scheduled')
      .eq('reminder_24h_sent', false)
      .gte('appointment_date', tomorrow.toISOString())
      .lt('appointment_date', new Date(tomorrow.getTime() + 60 * 60 * 1000).toISOString());
    
    if (error24h) {
      console.error('[Cron] Error fetching 24h appointments:', error24h);
    } else {
      console.log(`[Cron] Found ${appointments24h?.length || 0} appointments needing 24h reminders`);
    }
    
    // Fetch appointments needing 2-hour reminders
    const { data: appointments2h, error: error2h } = await supabase
      .from('appointment_data')
      .select('*, users:user_id(email, raw_user_meta_data)')
      .eq('status', 'scheduled')
      .eq('reminder_2h_sent', false)
      .gte('appointment_date', twoHoursLater.toISOString())
      .lt('appointment_date', new Date(twoHoursLater.getTime() + 60 * 60 * 1000).toISOString());
    
    if (error2h) {
      console.error('[Cron] Error fetching 2h appointments:', error2h);
    } else {
      console.log(`[Cron] Found ${appointments2h?.length || 0} appointments needing 2h reminders`);
    }
    
    let reminders24hSent = 0;
    let reminders2hSent = 0;
    let errors = 0;
    
    // Send 24-hour reminders
    if (appointments24h && appointments24h.length > 0) {
      for (const appointment of appointments24h) {
        try {
          const result = await sendAppointmentReminders(appointment.id, '24hour');
          if (result.success) {
            reminders24hSent++;
            
            // Update appointment to mark reminder as sent
            await supabase
              .from('appointment_data')
              .update({ 
                reminder_24h_sent: true,
                reminder_24h_sent_at: new Date().toISOString()
              })
              .eq('id', appointment.id);
          } else {
            errors++;
            console.error(`[Cron] Failed to send 24h reminder for appointment ${appointment.id}:`, result.error);
          }
        } catch (error) {
          errors++;
          console.error(`[Cron] Error sending 24h reminder for appointment ${appointment.id}:`, error);
        }
      }
    }
    
    // Send 2-hour reminders
    if (appointments2h && appointments2h.length > 0) {
      for (const appointment of appointments2h) {
        try {
          const result = await sendAppointmentReminders(appointment.id, '2hour');
          if (result.success) {
            reminders2hSent++;
            
            // Update appointment to mark reminder as sent
            await supabase
              .from('appointment_data')
              .update({ 
                reminder_2h_sent: true,
                reminder_2h_sent_at: new Date().toISOString()
              })
              .eq('id', appointment.id);
          } else {
            errors++;
            console.error(`[Cron] Failed to send 2h reminder for appointment ${appointment.id}:`, result.error);
          }
        } catch (error) {
          errors++;
          console.error(`[Cron] Error sending 2h reminder for appointment ${appointment.id}:`, error);
        }
      }
    }
    
    const summary = {
      success: true,
      timestamp: now.toISOString(),
      reminders: {
        '24_hour': {
          checked: appointments24h?.length || 0,
          sent: reminders24hSent
        },
        '2_hour': {
          checked: appointments2h?.length || 0,
          sent: reminders2hSent
        }
      },
      errors,
      message: `Sent ${reminders24hSent + reminders2hSent} reminders with ${errors} errors`
    };
    
    console.log('[Cron] Reminder job completed:', summary);
    
    return NextResponse.json(summary);
    
  } catch (error) {
    console.error('[Cron] Reminder job failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Also support POST for some cron services
export async function POST(request: NextRequest) {
  return GET(request);
}