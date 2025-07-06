import { NextRequest, NextResponse } from 'next/server';
import { enhancedEmailTemplates, personalizeEmail } from '@/lib/email-templates/enhanced-emails';
import { supabaseAdmin } from '@/lib/supabase';
import { getResendClient } from '@/lib/resend-client';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';

interface SignupRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  source?: string;
  interests?: string[];
}

// Send welcome email to new subscriber
async function sendWelcomeEmail(subscriber: any) {
  const firstName = subscriber.first_name || 'Friend';
  
  try {
    // Validate email before attempting to send
    if (!subscriber.email || typeof subscriber.email !== 'string' || !subscriber.email.includes('@')) {
      console.error('Invalid subscriber email:', subscriber.email);
      return;
    }
    
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

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const identifier = 
    request.headers.get('x-forwarded-for') || 
    request.headers.get('x-real-ip') ||
    'anonymous';
    
  const rateLimitResult = await rateLimit(RATE_LIMITS.newsletter, identifier);
  
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { 
        error: 'Too many requests', 
        message: `Too many newsletter signups. Please try again after ${rateLimitResult.reset.toLocaleTimeString()}.` 
      },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.reset.toISOString(),
          'Retry-After': Math.ceil((rateLimitResult.reset.getTime() - Date.now()) / 1000).toString(),
        }
      }
    );
  }

  try {
    const body = await request.json();
    const { email, firstName, lastName, source = 'other', interests = [] }: SignupRequest = body;

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const { data: existingSubscriber } = await supabaseAdmin
      .from('subscribers')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();
    
    if (existingSubscriber) {
      if (existingSubscriber.status === 'active') {
        return NextResponse.json(
          { error: 'This email address is already subscribed to our newsletter.' },
          { status: 409 }
        );
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
        
        // Send welcome email for reactivated subscribers too
        try {
          await sendWelcomeEmail(reactivated);
        } catch (emailError) {
          console.error('Failed to send welcome email to reactivated subscriber:', emailError);
          // Continue - subscriber is still reactivated
        }
        
        return NextResponse.json({
          success: true,
          message: 'Welcome back! You\'ve been resubscribed to our newsletter.',
          subscriberId: reactivated.id
        });
      }
    }

    // Create new subscriber
    const newSubscriber = {
      email: email.toLowerCase(),
      first_name: firstName,
      last_name: lastName,
      status: 'active',
      signup_source: source,
      interests: interests,
      metadata: {},
      ip_address: request.headers.get('x-forwarded-for') || '',
      user_agent: request.headers.get('user-agent') || '',
      referrer: request.headers.get('referer') || '',
      confirmed: true
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

    // Log analytics event
    try {
      await supabaseAdmin
        .from('analytics_events')
        .insert({
          type: 'newsletter_signup',
          page: request.headers.get('referer') || 'unknown',
          data: {
            email: email,
            source: source
          }
        });
    } catch (analyticsError) {
      console.error('Failed to log analytics:', analyticsError);
      // Continue - subscriber is still saved
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing! You\'ll receive monthly insights on mental health and wellness.',
      subscriberId: subscriber.id
    });

  } catch (error) {
    console.error('Newsletter signup error:', error);
    
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}