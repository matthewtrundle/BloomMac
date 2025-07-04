import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient } from '@/lib/supabase-server';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { z } from 'zod';

// Input validation schema
const unsubscribeSchema = z.object({
  email: z.string().email(),
  token: z.string().optional()
});

// HTML template for responses
function generateHTML(title: string, content: string, isError: boolean = false) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} - Bloom Psychology</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
            line-height: 1.6;
            color: #333;
          }
          .message { 
            color: ${isError ? '#d32f2f' : '#2e7d32'}; 
            background: ${isError ? '#ffebee' : '#e8f5e8'}; 
            padding: 20px; 
            border-radius: 8px; 
            border-left: 4px solid ${isError ? '#f44336' : '#4caf50'};
          }
          .logo { 
            text-align: center; 
            margin-bottom: 30px; 
          }
          .actions {
            margin-top: 30px;
            text-align: center;
          }
          .btn {
            display: inline-block;
            padding: 12px 24px;
            background: #6B21A8;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 10px;
          }
          .btn:hover {
            background: #553285;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            text-align: center;
            color: #666;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="logo">
          <img src="https://www.bloompsychologynorthaustin.com/images/Logo/logo.jpg" alt="Bloom Psychology" style="max-width: 120px;">
        </div>
        ${content}
        <div class="footer">
          <p>If you have any questions or concerns, please contact us:</p>
          <p>
            <strong>Bloom Psychology</strong><br>
            13706 N Highway 183, Suite 114<br>
            Austin, TX 78750<br>
            <a href="mailto:support@bloompsychologynorthaustin.com">support@bloompsychologynorthaustin.com</a>
          </p>
        </div>
      </body>
    </html>
  `;
}

export async function GET(request: NextRequest) {
  // Apply rate limiting
  const identifier = 
    request.headers.get('x-forwarded-for') || 
    request.headers.get('x-real-ip') ||
    'anonymous';
    
  const rateLimitResult = await rateLimit(RATE_LIMITS.auth, identifier);
  
  if (!rateLimitResult.success) {
    return new NextResponse(
      generateHTML(
        'Too Many Requests',
        `<h1>Too Many Requests</h1>
        <div class="message">
          <p>Please wait before trying again.</p>
        </div>`,
        true
      ),
      {
        status: 429,
        headers: { 'Content-Type': 'text/html' }
      }
    );
  }

  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  // Validate parameters
  try {
    const validated = unsubscribeSchema.parse({ email, token });
  } catch (error) {
    return new NextResponse(
      generateHTML(
        'Unsubscribe Error',
        `<h1>Unsubscribe Error</h1>
        <div class="message">
          <p>Invalid unsubscribe link. Please check your email for the correct link.</p>
        </div>`,
        true
      ),
      {
        status: 400,
        headers: { 'Content-Type': 'text/html' }
      }
    );
  }

  try {
    // Create anonymous Supabase client
    const { supabase } = createSupabaseRouteHandlerClient(request);

    // If token is provided, validate it
    if (token) {
      const { data: tokenData, error: tokenError } = await supabase
        .rpc('validate_unsubscribe_token', { 
          unsubscribe_token: token 
        });

      if (tokenError || !tokenData?.email || tokenData.email !== email) {
        return new NextResponse(
          generateHTML(
            'Invalid Link',
            `<h1>Invalid Unsubscribe Link</h1>
            <div class="message">
              <p>This unsubscribe link is invalid or has expired.</p>
              <p>Please use the latest unsubscribe link from your email.</p>
            </div>`,
            true
          ),
          {
            status: 400,
            headers: { 'Content-Type': 'text/html' }
          }
        );
      }
    }

    // Update subscriber status using RPC function
    const { data, error } = await supabase
      .rpc('handle_email_unsubscribe', {
        subscriber_email: email!.toLowerCase(),
        unsubscribe_source: 'email_link',
        ip_address: identifier,
        user_agent: request.headers.get('user-agent') || null
      });

    if (error) {
      throw error;
    }

    if (data?.already_unsubscribed) {
      return new NextResponse(
        generateHTML(
          'Already Unsubscribed',
          `<h1>Already Unsubscribed</h1>
          <div class="message">
            <p>The email address <strong>${email}</strong> has already been unsubscribed.</p>
            <p>If you continue to receive emails, please contact us.</p>
          </div>`
        ),
        {
          status: 200,
          headers: { 'Content-Type': 'text/html' }
        }
      );
    }

    // Track analytics event
    try {
      await supabase
        .from('analytics_events')
        .insert({
          type: 'newsletter_unsubscribe',
          page: '/unsubscribe',
          session_id: crypto.randomUUID(),
          data: {
            method: 'email_link',
            has_token: !!token
          },
          ip_address: identifier,
          user_agent: request.headers.get('user-agent') || ''
        });
    } catch (analyticsError) {
      console.error('Analytics tracking failed:', analyticsError);
    }

    return new NextResponse(
      generateHTML(
        'Successfully Unsubscribed',
        `<h1>Successfully Unsubscribed</h1>
        <div class="message">
          <p><strong>You have been successfully unsubscribed.</strong></p>
          <p>The email address <strong>${email}</strong> has been removed from our newsletter list.</p>
          <p>You will no longer receive marketing emails from Bloom Psychology.</p>
        </div>
        <p>We're sorry to see you go! If you unsubscribed by mistake, you can easily resubscribe at any time.</p>
        <div class="actions">
          <a href="https://www.bloompsychologynorthaustin.com/newsletter" class="btn">Resubscribe</a>
          <a href="https://www.bloompsychologynorthaustin.com" class="btn">Visit Our Website</a>
        </div>`
      ),
      {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      }
    );

  } catch (error) {
    console.error('Unsubscribe error:', error);
    
    return new NextResponse(
      generateHTML(
        'Unsubscribe Error',
        `<h1>Unsubscribe Error</h1>
        <div class="message">
          <p>We encountered an error processing your unsubscribe request.</p>
          <p>Please contact us directly to unsubscribe.</p>
        </div>`,
        true
      ),
      {
        status: 500,
        headers: { 'Content-Type': 'text/html' }
      }
    );
  }
}

// Handle POST requests for form-based unsubscribe
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const email = formData.get('email') as string;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Reuse the same logic as GET
    const url = new URL(request.url);
    url.searchParams.set('email', email);
    
    // Create a new request with the email as a query parameter
    const getRequest = new NextRequest(url.toString(), {
      method: 'GET',
      headers: request.headers
    });

    return await GET(getRequest);

  } catch (error) {
    console.error('POST unsubscribe error:', error);
    return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 });
  }
}

// SQL function needed:
/*
CREATE OR REPLACE FUNCTION handle_email_unsubscribe(
  subscriber_email TEXT,
  unsubscribe_source TEXT,
  ip_address TEXT,
  user_agent TEXT
)
RETURNS JSONB AS $$
DECLARE
  existing_subscriber RECORD;
  result JSONB;
BEGIN
  -- Check if subscriber exists
  SELECT * INTO existing_subscriber
  FROM subscribers
  WHERE email = LOWER(subscriber_email);
  
  IF existing_subscriber.id IS NULL THEN
    -- Not in list
    result := jsonb_build_object(
      'success', true,
      'already_unsubscribed', true,
      'message', 'Email not found in subscriber list'
    );
  ELSIF existing_subscriber.status = 'unsubscribed' THEN
    -- Already unsubscribed
    result := jsonb_build_object(
      'success', true,
      'already_unsubscribed', true,
      'message', 'Already unsubscribed'
    );
  ELSE
    -- Unsubscribe
    UPDATE subscribers
    SET 
      status = 'unsubscribed',
      unsubscribed_at = NOW(),
      updated_at = NOW()
    WHERE id = existing_subscriber.id;
    
    -- Log activity
    INSERT INTO admin_activity_log (
      action,
      entity_type,
      entity_id,
      details,
      created_at
    ) VALUES (
      'newsletter_unsubscribe',
      'subscriber',
      existing_subscriber.id::TEXT,
      jsonb_build_object(
        'email', subscriber_email,
        'source', unsubscribe_source,
        'ip_address', ip_address,
        'user_agent', user_agent
      ),
      NOW()
    );
    
    result := jsonb_build_object(
      'success', true,
      'already_unsubscribed', false,
      'message', 'Successfully unsubscribed'
    );
  END IF;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION handle_email_unsubscribe TO anon;
*/