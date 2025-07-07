import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import { enrollmentManager } from '@/lib/email-automation/enrollment-manager';

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
        
        // Enroll in email sequences
        try {
          const { data: subscriber } = await supabaseAdmin
            .from('subscribers')
            .select('id')
            .eq('email', event.payload.invitee.email.toLowerCase())
            .single();

          if (subscriber) {
            await enrollmentManager.enrollSubscriber({
              subscriberId: subscriber.id,
              trigger: 'booking_confirmation',
              source: 'calendly_webhook',
              metadata: {
                calendly_event_id: event.payload.event.name,
              }
            });
          }
        } catch (enrollError) {
          console.error('Failed to enroll user from Calendly webhook:', enrollError);
        }
        
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
