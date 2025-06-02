import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import { enhancedEmailTemplates } from '@/lib/email-templates/enhanced-emails';

// Calendly webhook event types
interface CalendlyEvent {
  event: string; // 'invitee.created' or 'invitee.canceled'
  time: string;
  payload: {
    event_type: {
      name: string;
      duration: number;
    };
    event: {
      name: string;
      start_time: string;
      end_time: string;
      location?: {
        type: string;
        location?: string;
      };
    };
    invitee: {
      name: string;
      email: string;
      first_name?: string;
      last_name?: string;
      timezone: string;
      questions_and_answers?: Array<{
        question: string;
        answer: string;
      }>;
    };
    tracking?: {
      utm_source?: string;
      utm_medium?: string;
      utm_campaign?: string;
    };
  };
}

// Helper to format appointment details
function formatAppointmentDetails(payload: CalendlyEvent['payload']) {
  const startDate = new Date(payload.event.start_time);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  };
  
  const formattedDate = startDate.toLocaleDateString('en-US', options);
  const location = payload.event.location?.type === 'physical' 
    ? payload.event.location.location 
    : 'Video Call (link will be sent separately)';
    
  return {
    date: formattedDate,
    time: startDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      timeZoneName: 'short'
    }),
    format: location,
    duration: `${payload.event_type.duration} minutes`
  };
}

// Helper to send email using your existing email system
async function sendBookingEmail(
  to: string,
  firstName: string,
  appointmentDetails: any,
  emailType: 'confirmation' | 'reminder24' | 'cancellation'
) {
  try {
    // Get the appropriate template
    const templates = enhancedEmailTemplates.bookingConfirmation;
    let template;
    
    switch (emailType) {
      case 'confirmation':
        template = templates.confirmation;
        break;
      case 'reminder24':
        template = templates.reminder24;
        break;
      case 'cancellation':
        // You might want to create a cancellation template
        return; // For now, skip cancellation emails
      default:
        return;
    }
    
    // Generate email content
    const content = typeof template.content === 'function' 
      ? template.content(firstName, appointmentDetails)
      : template.content;
    
    // Send email via your existing email service
    const response = await fetch(process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}/api/send-email`
      : 'http://localhost:3000/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to,
        subject: template.subject,
        html: content,
        from: 'Jana Rundle <jana@bloompsychologynorthaustin.com>',
        replyTo: 'jana@bloompsychologynorthaustin.com'
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to send email');
    }
    
    // Log the email send
    await supabaseAdmin
      .from('email_automation_log')
      .insert({
        email: to,
        sequence: 'bookingConfirmation',
        step: emailType,
        status: 'sent',
        sent_at: new Date().toISOString()
      })
      .catch(err => console.error('Failed to log email:', err));
      
    console.log(`Booking ${emailType} email sent to ${to}`);
    
  } catch (error) {
    console.error(`Failed to send booking ${emailType} email:`, error);
  }
}

// Helper to schedule reminder email
async function scheduleReminderEmail(
  to: string,
  firstName: string,
  appointmentDetails: any,
  appointmentTime: string
) {
  try {
    // Calculate 24 hours before appointment
    const appointmentDate = new Date(appointmentTime);
    const reminderDate = new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000);
    
    // Store scheduled email in database
    await supabaseAdmin
      .from('email_automation_queue')
      .insert({
        email: to,
        sequence: 'bookingConfirmation',
        step: 'reminder24',
        scheduled_for: reminderDate.toISOString(),
        data: {
          firstName,
          appointmentDetails
        },
        status: 'scheduled'
      });
      
    console.log(`Reminder email scheduled for ${to} at ${reminderDate.toISOString()}`);
    
  } catch (error) {
    console.error('Failed to schedule reminder email:', error);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Verify webhook signature if provided by Calendly
    const signature = req.headers['calendly-webhook-signature'];
    if (signature && process.env.CALENDLY_WEBHOOK_SECRET) {
      // TODO: Implement signature verification
      // For now, we'll accept all requests
    }
    
    const event: CalendlyEvent = req.body;
    
    console.log('Calendly webhook received:', {
      event: event.event,
      invitee: event.payload.invitee.email,
      time: event.time
    });
    
    // Handle different event types
    switch (event.event) {
      case 'invitee.created':
        // New booking created
        const firstName = event.payload.invitee.first_name || 
                         event.payload.invitee.name.split(' ')[0] || 
                         'there';
        
        const appointmentDetails = formatAppointmentDetails(event.payload);
        
        // Send confirmation email immediately
        await sendBookingEmail(
          event.payload.invitee.email,
          firstName,
          appointmentDetails,
          'confirmation'
        );
        
        // Schedule reminder email for 24 hours before
        await scheduleReminderEmail(
          event.payload.invitee.email,
          firstName,
          appointmentDetails,
          event.payload.event.start_time
        );
        
        // Store booking information
        await supabaseAdmin
          .from('bookings')
          .insert({
            email: event.payload.invitee.email,
            name: event.payload.invitee.name,
            appointment_time: event.payload.event.start_time,
            appointment_type: event.payload.event_type.name,
            status: 'confirmed',
            calendly_event_id: event.payload.event.name,
            data: event.payload
          })
          .catch(err => console.error('Failed to store booking:', err));
        
        break;
        
      case 'invitee.canceled':
        // Booking canceled
        await supabaseAdmin
          .from('bookings')
          .update({ status: 'canceled' })
          .eq('calendly_event_id', event.payload.event.name)
          .catch(err => console.error('Failed to update booking status:', err));
          
        // Cancel any scheduled reminder emails
        await supabaseAdmin
          .from('email_automation_queue')
          .update({ status: 'canceled' })
          .eq('email', event.payload.invitee.email)
          .eq('sequence', 'bookingConfirmation')
          .eq('step', 'reminder24')
          .eq('status', 'scheduled')
          .catch(err => console.error('Failed to cancel reminder:', err));
        
        break;
        
      default:
        console.log(`Unhandled Calendly event type: ${event.event}`);
    }
    
    // Always return 200 to acknowledge receipt
    return res.status(200).json({ received: true });
    
  } catch (error) {
    console.error('Calendly webhook error:', error);
    // Still return 200 to prevent Calendly from retrying
    return res.status(200).json({ received: true, error: 'Processing failed' });
  }
}

// Disable body parsing to access raw body for signature verification
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};