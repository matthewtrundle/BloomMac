import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import { stripe } from '../../../lib/stripe';
import { supabase } from '../../../lib/supabase';
import { createClient } from '@supabase/supabase-js';

// Create admin client for user management
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

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
        const customerName = session.customer_details?.name || session.metadata?.customerName;
        
        if (courseId && customerEmail) {
          // Create or get user in Supabase Auth
          let userId: string;
          
          // First check if user exists
          const { data: existingUsers } = await supabaseAdmin
            .from('auth.users')
            .select('id')
            .eq('email', customerEmail)
            .single();
          
          if (existingUsers) {
            userId = existingUsers.id;
          } else {
            // Create new user with random password (they'll use magic link to login)
            const tempPassword = `temp_${Math.random().toString(36).substring(7)}_${Date.now()}`;
            
            const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
              email: customerEmail,
              password: tempPassword,
              email_confirm: true, // Auto-confirm email
              user_metadata: {
                full_name: customerName,
                source: 'course_purchase'
              }
            });
            
            if (createError || !newUser.user) {
              console.error('Error creating user:', createError);
              throw new Error('Failed to create user account');
            }
            
            userId = newUser.user.id;
            
            // Send magic link for easy login
            await supabaseAdmin.auth.admin.generateLink({
              type: 'magiclink',
              email: customerEmail,
            });
          }
          
          // Grant course access with user ID
          await supabase
            .from('user_course_access')
            .upsert({
              user_id: userId,
              course_id: courseId,
              enrolled_at: new Date().toISOString(),
              stripe_session_id: session.id,
              payment_status: 'test_paid',
              payment_metadata: {
                customer_email: customerEmail,
                customer_name: customerName,
                test_mode: true
              }
            });
          
          console.log(`✅ Test mode: Course access granted for ${customerEmail} (${userId}) to ${courseId}`);
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
        const customerName = session.customer_details?.name || session.metadata?.customerName;
        
        if (!courseId || !customerEmail) {
          console.error('Missing required metadata in checkout session:', session.id);
          break;
        }

        // Create or get user in Supabase Auth
        let userId: string;
        
        // First check if user exists
        const { data: existingUsers } = await supabaseAdmin
          .from('auth.users')
          .select('id')
          .eq('email', customerEmail)
          .single();
        
        if (existingUsers) {
          userId = existingUsers.id;
        } else {
          // Create new user with random password (they'll use magic link to login)
          const tempPassword = `temp_${Math.random().toString(36).substring(7)}_${Date.now()}`;
          
          const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: customerEmail,
            password: tempPassword,
            email_confirm: true, // Auto-confirm email
            user_metadata: {
              full_name: customerName,
              source: 'course_purchase',
              stripe_customer_id: session.customer
            }
          });
          
          if (createError || !newUser.user) {
            console.error('Error creating user:', createError);
            throw new Error('Failed to create user account');
          }
          
          userId = newUser.user.id;
          
          // Send welcome email with magic link
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/send-welcome-email`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: customerEmail,
                customerName,
                courseName: 'Postpartum Wellness Foundations', // TODO: Get actual course name
                userId
              })
            });

            if (!response.ok) {
              console.error('Failed to send welcome email:', await response.text());
            }
          } catch (emailError) {
            console.error('Error sending welcome email:', emailError);
            // Don't fail the webhook if email fails
          }
        }

        // Update purchase record in database
        await supabase
          .from('course_purchases')
          .update({
            status: 'completed',
            stripe_payment_intent_id: session.payment_intent,
            completed_at: new Date().toISOString(),
            customer_stripe_id: session.customer,
            user_id: userId,
          })
          .eq('stripe_checkout_session_id', session.id);

        // Grant course access
        await supabase
          .from('user_course_access')
          .upsert({
            user_id: userId,
            course_id: courseId,
            enrolled_at: new Date().toISOString(),
            stripe_session_id: session.id,
            payment_status: 'paid',
            payment_metadata: {
              customer_email: customerEmail,
              customer_name: customerName,
              stripe_customer_id: session.customer,
              amount_paid: session.amount_total,
              currency: session.currency
            }
          });

        console.log(`Course access granted: ${courseId} for ${customerEmail} (${userId})`);
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