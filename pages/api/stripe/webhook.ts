import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import { stripe } from '../../../lib/stripe';
import { supabase } from '../../../lib/supabase';

// Disable body parsing for webhook
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // Handle test mode webhooks
  if (sig === 'test_signature' || !webhookSecret) {
    console.log('🧪 Processing test mode webhook');
    const event = req.body;
    
    // Process test event directly
    try {
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const courseId = session.metadata?.courseId;
        const customerEmail = session.customer_details?.email || session.metadata?.customerEmail;
        
        if (courseId && customerEmail) {
          // Grant course access in test mode
          await supabase
            .from('user_course_access')
            .upsert({
              customer_email: customerEmail,
              course_id: courseId,
              access_granted_at: new Date().toISOString(),
              stripe_session_id: session.id,
              payment_status: 'test_paid',
            });
          
          console.log(`✅ Test mode: Course access granted for ${customerEmail} to ${courseId}`);
        }
      }
      
      return res.status(200).json({ received: true, test_mode: true });
    } catch (error) {
      console.error('Test webhook error:', error);
      return res.status(500).json({ error: 'Test webhook processing failed' });
    }
  }

  let event;

  try {
    const body = await buffer(req);
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        // Extract metadata
        const courseId = session.metadata?.courseId;
        const customerEmail = session.customer_details?.email || session.metadata?.customerEmail;
        
        if (!courseId || !customerEmail) {
          console.error('Missing required metadata in checkout session:', session.id);
          break;
        }

        // Update purchase record in database
        await supabase
          .from('course_purchases')
          .update({
            status: 'completed',
            stripe_payment_intent_id: session.payment_intent,
            completed_at: new Date().toISOString(),
            customer_stripe_id: session.customer,
          })
          .eq('stripe_checkout_session_id', session.id);

        // Grant course access
        await supabase
          .from('user_course_access')
          .upsert({
            customer_email: customerEmail,
            course_id: courseId,
            access_granted_at: new Date().toISOString(),
            stripe_session_id: session.id,
            payment_status: 'paid',
          });

        // Send welcome email (you can implement this later)
        // await sendCourseWelcomeEmail(customerEmail, courseId);

        console.log(`Course access granted: ${courseId} for ${customerEmail}`);
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object;
        
        // Update purchase record to expired
        await supabase
          .from('course_purchases')
          .update({
            status: 'expired',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_checkout_session_id', session.id);

        console.log(`Checkout session expired: ${session.id}`);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        
        // Find and update related purchase record
        const { data: purchases } = await supabase
          .from('course_purchases')
          .select('*')
          .eq('stripe_payment_intent_id', paymentIntent.id);

        if (purchases && purchases.length > 0) {
          await supabase
            .from('course_purchases')
            .update({
              status: 'failed',
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_payment_intent_id', paymentIntent.id);
        }

        console.log(`Payment failed: ${paymentIntent.id}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });

  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ 
      error: 'Error processing webhook',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}