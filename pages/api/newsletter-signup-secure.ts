import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { enhancedEmailTemplates, personalizeEmail } from '@/lib/email-templates/enhanced-emails';
import { getResendClient } from '@/lib/resend-client';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { z } from 'zod';

// Create anonymous Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Input validation schema
const signupSchema = z.object({
  email: z.string().email().max(255),
  firstName: z.string().max(50).optional(),
  lastName: z.string().max(50).optional(),
  source: z.string().max(50).default('website'),
  interests: z.array(z.string()).max(10).optional()
});

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
    
    const resend = getResendClient();
    if (!resend) {
      console.error('Resend client not initialized - skipping welcome email');
      return;
    }
    
    await resend.emails.send({
      from: 'Dr. Jana Rundle <jana@bloompsychologynorthaustin.com>',
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

  // Apply rate limiting
  const identifier = 
    req.headers['x-forwarded-for'] as string || 
    req.headers['x-real-ip'] as string ||
    req.socket.remoteAddress ||
    'anonymous';
    
  const rateLimitResult = await rateLimit(RATE_LIMITS.newsletter, identifier);
  
  if (!rateLimitResult.success) {
    res.setHeader('X-RateLimit-Limit', rateLimitResult.limit.toString());
    res.setHeader('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    res.setHeader('X-RateLimit-Reset', rateLimitResult.reset.toISOString());
    res.setHeader('Retry-After', Math.ceil((rateLimitResult.reset.getTime() - Date.now()) / 1000).toString());
    
    return res.status(429).json({ 
      error: `Too many newsletter signups. Please try again after ${rateLimitResult.reset.toLocaleTimeString()}.` 
    });
  }

  try {
    // Validate input
    let validatedData;
    try {
      validatedData = signupSchema.parse(req.body);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return res.status(400).json({ 
          error: 'Invalid input: ' + validationError.errors.map(e => e.message).join(', ')
        });
      }
      throw validationError;
    }

    const { email, firstName, lastName, source, interests = [] } = validatedData;

    // Use RPC function to handle newsletter signup (with proper permissions)
    const { data, error } = await supabase.rpc('handle_newsletter_signup', {
      subscriber_email: email.toLowerCase(),
      subscriber_first_name: firstName || null,
      subscriber_last_name: lastName || null,
      signup_source: source,
      subscriber_interests: interests,
      ip_address: identifier,
      user_agent: req.headers['user-agent'] || null,
      referrer: req.headers.referer || null
    });

    if (error) {
      console.error('Newsletter signup error:', error);
      
      // Check for specific error cases
      if (error.message?.includes('already_active')) {
        return res.status(409).json({ 
          error: 'This email address is already subscribed to our newsletter.' 
        });
      }
      
      throw error;
    }

    // Send welcome email
    if (data?.subscriber) {
      try {
        await sendWelcomeEmail(data.subscriber);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Continue - subscriber is still saved
      }
    }

    // Track analytics event (public insert allowed)
    try {
      await supabase
        .from('analytics_events')
        .insert({
          type: 'newsletter_signup',
          page: req.headers.referer || 'unknown',
          session_id: crypto.randomUUID(),
          data: {
            source: source,
            has_interests: interests.length > 0
          },
          ip_address: identifier,
          user_agent: req.headers['user-agent'] || ''
        });
    } catch (analyticsError) {
      console.error('Analytics tracking failed:', analyticsError);
    }

    const message = data?.reactivated 
      ? 'Welcome back! You\'ve been resubscribed to our newsletter.'
      : 'Thank you for subscribing! You\'ll receive monthly insights on mental health and wellness.';

    return res.status(200).json({
      success: true,
      message,
      subscriberId: data?.subscriber?.id
    });

  } catch (error) {
    console.error('Newsletter signup error:', error);
    
    return res.status(500).json({ 
      error: 'Something went wrong. Please try again later.' 
    });
  }
}

// SQL function needed:
/*
CREATE OR REPLACE FUNCTION handle_newsletter_signup(
  subscriber_email TEXT,
  subscriber_first_name TEXT,
  subscriber_last_name TEXT,
  signup_source TEXT,
  subscriber_interests TEXT[],
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT
)
RETURNS JSONB AS $$
DECLARE
  existing_subscriber RECORD;
  new_subscriber RECORD;
  result JSONB;
BEGIN
  -- Check if subscriber exists
  SELECT * INTO existing_subscriber
  FROM subscribers
  WHERE email = LOWER(subscriber_email);
  
  IF existing_subscriber.id IS NOT NULL THEN
    IF existing_subscriber.status = 'active' THEN
      -- Already active
      RAISE EXCEPTION 'already_active';
    ELSE
      -- Reactivate
      UPDATE subscribers
      SET 
        status = 'active',
        updated_at = NOW()
      WHERE id = existing_subscriber.id
      RETURNING * INTO new_subscriber;
      
      result := jsonb_build_object(
        'subscriber', row_to_json(new_subscriber),
        'reactivated', true
      );
    END IF;
  ELSE
    -- Create new subscriber
    INSERT INTO subscribers (
      email,
      first_name,
      last_name,
      status,
      signup_source,
      interests,
      ip_address,
      user_agent,
      referrer,
      confirmed,
      created_at
    ) VALUES (
      LOWER(subscriber_email),
      subscriber_first_name,
      subscriber_last_name,
      'active',
      signup_source,
      subscriber_interests,
      ip_address,
      user_agent,
      referrer,
      true,
      NOW()
    )
    RETURNING * INTO new_subscriber;
    
    result := jsonb_build_object(
      'subscriber', row_to_json(new_subscriber),
      'reactivated', false
    );
  END IF;
  
  -- Log activity
  INSERT INTO admin_activity_log (
    action,
    entity_type,
    entity_id,
    details,
    created_at
  ) VALUES (
    'newsletter_signup',
    'subscriber',
    new_subscriber.id::TEXT,
    jsonb_build_object(
      'email', new_subscriber.email,
      'source', signup_source,
      'reactivated', (result->>'reactivated')::boolean
    ),
    NOW()
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION handle_newsletter_signup TO anon;
*/