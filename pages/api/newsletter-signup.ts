import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import { enhancedEmailTemplates, personalizeEmail } from '@/lib/email-templates/enhanced-emails';
import { supabaseAdmin } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SignupRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  source?: string;
  interests?: string[];
}

interface SignupResponse {
  success: boolean;
  message: string;
  subscriberId?: string;
}

// Send welcome email to new subscriber
async function sendWelcomeEmail(subscriber: any) {
  const firstName = subscriber.first_name || 'Friend';
  
  try {
    // Get the enhanced welcome email template
    const welcomeTemplate = enhancedEmailTemplates.newsletter.welcome;
    const personalizedEmail = personalizeEmail(welcomeTemplate, {
      firstName,
      name: firstName
    });
    
    await resend.emails.send({
      from: 'Bloom Psychology <hello@bloompsychologynorthaustin.com>',
      to: subscriber.email,
      subject: personalizedEmail.subject,
      html: personalizedEmail.content,
      tags: [
        { name: 'sequence', value: 'newsletter' },
        { name: 'step', value: 'welcome' },
        { name: 'enhanced', value: 'true' }
      ]
    });
    console.log('Enhanced welcome email sent to:', subscriber.email);
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    // Don't throw - we still want to save the subscriber even if email fails
  }
}

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<SignupResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email, firstName, lastName, source = 'other', interests = [] }: SignupRequest = req.body;

    // Validate email
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address is required' });
    }

    // Check if email already exists in Supabase
    const { data: existingSubscriber } = await supabaseAdmin
      .from('subscribers')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();
    
    if (existingSubscriber) {
      if (existingSubscriber.status === 'active') {
        return res.status(409).json({ 
          error: 'This email address is already subscribed to our newsletter.' 
        });
      } else {
        // Reactivate unsubscribed user
        const { data: reactivated, error: reactivateError } = await supabaseAdmin
          .from('subscribers')
          .update({ 
            status: 'active',
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSubscriber.id)
          .select()
          .single();
        
        if (reactivateError) {
          throw reactivateError;
        }
        
        return res.status(200).json({
          success: true,
          message: 'Welcome back! You\'ve been resubscribed to our newsletter.',
          subscriberId: reactivated.id
        });
      }
    }

    // Create new subscriber in Supabase
    const newSubscriber = {
      email: email.toLowerCase(),
      first_name: firstName,
      last_name: lastName,
      status: 'active',
      tags: [],
      signup_source: source,
      interests: interests,
      metadata: {},
      ip_address: req.headers['x-forwarded-for'] as string || req.connection.remoteAddress,
      user_agent: req.headers['user-agent'],
      referrer: req.headers.referer,
      confirmed: true // Auto-confirm for now
    };

    const { data: subscriber, error: insertError } = await supabaseAdmin
      .from('subscribers')
      .insert(newSubscriber)
      .select()
      .single();
    
    if (insertError) {
      throw insertError;
    }

    // Send welcome email
    try {
      await sendWelcomeEmail(subscriber);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Continue - subscriber is still saved
    }

    // Log admin activity
    await supabaseAdmin
      .from('admin_activity_log')
      .insert({
        action: 'newsletter_signup',
        entity_type: 'subscriber',
        entity_id: subscriber.id,
        details: {
          email: subscriber.email,
          source: source,
          interests: interests
        }
      });

    // Track analytics event
    await supabaseAdmin
      .from('analytics_events')
      .insert({
        type: 'newsletter_signup',
        page: req.headers.referer || 'unknown',
        data: {
          email: email,
          source: source
        }
      });

    return res.status(200).json({
      success: true,
      message: 'Thank you for subscribing! You\'ll receive monthly insights on mental health and wellness.',
      subscriberId: subscriber.id
    });

  } catch (error) {
    console.error('Newsletter signup error:', error);
    
    return res.status(500).json({ 
      error: 'Something went wrong. Please try again later.' 
    });
  }
}