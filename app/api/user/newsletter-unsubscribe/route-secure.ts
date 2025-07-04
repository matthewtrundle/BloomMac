import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient, getAuthenticatedUser } from '@/lib/supabase-server';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { z } from 'zod';

// Input validation schema
const unsubscribeSchema = z.object({
  email: z.string().email().optional(), // Optional - we'll use authenticated user's email
  reason: z.string().max(500).optional(),
  token: z.string().optional() // For email link unsubscribes
});

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const identifier = 
    request.headers.get('x-forwarded-for') || 
    request.headers.get('x-real-ip') ||
    'anonymous';
    
  const rateLimitResult = await rateLimit(RATE_LIMITS.auth, identifier);
  
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    
    // Validate input
    let validatedData;
    try {
      validatedData = unsubscribeSchema.parse(body);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { 
            error: 'Invalid input',
            details: validationError.errors
          },
          { status: 400 }
        );
      }
      throw validationError;
    }

    const { email: providedEmail, reason, token } = validatedData;

    // Create Supabase client
    const { supabase } = createSupabaseRouteHandlerClient(request);

    let emailToUnsubscribe: string;

    // If token provided, validate it (for email link unsubscribes)
    if (token) {
      // Decode and validate unsubscribe token
      const { data: tokenData, error: tokenError } = await supabase
        .rpc('validate_unsubscribe_token', { 
          unsubscribe_token: token 
        });

      if (tokenError || !tokenData?.email) {
        return NextResponse.json(
          { error: 'Invalid or expired unsubscribe link' },
          { status: 400 }
        );
      }

      emailToUnsubscribe = tokenData.email;
    } else {
      // For authenticated requests, use the user's email
      const user = await getAuthenticatedUser(supabase);
      
      if (!user) {
        // If no auth and no token, require email
        if (!providedEmail) {
          return NextResponse.json(
            { error: 'Email or authentication required' },
            { status: 400 }
          );
        }
        emailToUnsubscribe = providedEmail;
      } else {
        // Get user's email from profile
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('email')
          .eq('id', user.id)
          .single();

        emailToUnsubscribe = profile?.email || providedEmail || user.email!;
      }
    }

    if (!emailToUnsubscribe) {
      return NextResponse.json(
        { error: 'Email address not found' },
        { status: 400 }
      );
    }

    // Unsubscribe user
    const { data, error } = await supabase
      .from('subscribers')
      .update({
        status: 'unsubscribed',
        unsubscribed_at: new Date().toISOString(),
        unsubscribe_reason: reason || null,
        updated_at: new Date().toISOString()
      })
      .eq('email', emailToUnsubscribe.toLowerCase())
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not in subscriber list - that's ok
        return NextResponse.json({
          success: true,
          message: 'You are not currently subscribed to our newsletter',
          isSubscribed: false
        });
      }
      throw error;
    }

    // Track analytics
    try {
      await supabase
        .from('analytics_events')
        .insert({
          type: 'newsletter_unsubscribe',
          page: request.headers.get('referer') || '/unsubscribe',
          session_id: crypto.randomUUID(),
          data: {
            method: token ? 'email_link' : 'authenticated',
            has_reason: !!reason
          },
          ip_address: identifier,
          user_agent: request.headers.get('user-agent') || ''
        });
    } catch (analyticsError) {
      console.error('Analytics tracking failed:', analyticsError);
    }

    // Send confirmation email
    try {
      const { sendEmail } = await import('@/lib/resend-client');
      await sendEmail({
        to: emailToUnsubscribe,
        subject: 'Unsubscribed from Bloom Psychology Newsletter',
        html: `
          <h2>You've been unsubscribed</h2>
          <p>You've successfully unsubscribed from the Bloom Psychology newsletter.</p>
          <p>We're sorry to see you go! If you change your mind, you can always resubscribe on our website.</p>
          ${reason ? `<p>Your feedback: ${reason}</p>` : ''}
          <p>Best regards,<br>Dr. Jana Rundle</p>
        `,
        tags: [
          { name: 'type', value: 'unsubscribe_confirmation' }
        ]
      });
    } catch (emailError) {
      console.error('Failed to send unsubscribe confirmation:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter',
      isSubscribed: false
    });

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe from newsletter' },
      { status: 500 }
    );
  }
}

// SQL function needed:
/*
CREATE OR REPLACE FUNCTION validate_unsubscribe_token(unsubscribe_token TEXT)
RETURNS TABLE(email TEXT) AS $$
BEGIN
  -- Simple implementation - in production, use proper token validation
  -- This assumes token format: base64(email:timestamp:signature)
  -- You should implement proper HMAC validation
  
  -- For now, just decode the email part
  RETURN QUERY
  SELECT 
    split_part(convert_from(decode(unsubscribe_token, 'base64'), 'UTF8'), ':', 1) as email
  WHERE 
    -- Check token isn't too old (7 days)
    to_timestamp(split_part(convert_from(decode(unsubscribe_token, 'base64'), 'UTF8'), ':', 2)::bigint) > NOW() - INTERVAL '7 days';
    
  EXCEPTION
    WHEN OTHERS THEN
      -- Invalid token format
      RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION validate_unsubscribe_token TO anon;
*/