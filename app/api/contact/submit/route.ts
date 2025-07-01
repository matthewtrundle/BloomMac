import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const identifier = 
    request.headers.get('x-forwarded-for') || 
    request.headers.get('x-real-ip') ||
    'anonymous';
    
  const rateLimitResult = await rateLimit(RATE_LIMITS.contact, identifier);
  
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { 
        error: 'Too many requests', 
        message: `Please wait before submitting another contact form. Try again after ${rateLimitResult.reset.toLocaleTimeString()}.` 
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
    const { name, email, phone, service, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Get additional info
    const page = request.headers.get('referer') || '/contact';
    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';

    // Save to database
    const { data: submission, error: dbError } = await supabase
      .from('contact_submissions')
      .insert({
        name,
        email,
        phone: phone || null,
        service: service || 'general',
        message,
        status: 'new',
        source: 'website',
        metadata: {
          page,
          user_agent: userAgent,
          ip_address: ip,
          submitted_at: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save submission' },
        { status: 500 }
      );
    }

    // Trigger contact form email automation sequence
    try {
      // 1. Add or update subscriber for email automation
      const { data: subscriber, error: subscriberError } = await supabase
        .from('subscribers')
        .upsert({
          email,
          first_name: name.split(' ')[0] || name,
          last_name: name.split(' ').slice(1).join(' ') || '',
          status: 'active',
          source: 'contact_form',
          metadata: {
            last_contact_date: new Date().toISOString(),
            service_interest: service || 'general',
            contact_message: message.substring(0, 100) + '...' // Truncated for storage
          }
        }, {
          onConflict: 'email'
        })
        .select()
        .single();

      if (!subscriberError && subscriber) {
        // 2. Create email automation trigger
        await supabase
          .from('email_automation_triggers')
          .insert({
            subscriber_id: subscriber.id,
            trigger_type: 'contact_form',
            trigger_data: {
              service_interest: service || 'general',
              contact_message: message,
              phone: phone || null,
              source_page: page
            },
            triggered_at: new Date().toISOString()
          });

        console.log('Contact form email automation triggered for:', email);
      }
    } catch (emailError) {
      console.error('Email automation trigger failed:', emailError);
      // Don't fail the main submission if email automation fails
    }

    // Track analytics event
    await supabase
      .from('analytics_events')
      .insert({
        type: 'contact_form_submission',
        page,
        session_id: crypto.randomUUID(),
        data: {
          service: service || 'general',
          has_phone: !!phone
        }
      });

    return NextResponse.json({
      success: true,
      message: 'Thank you for contacting us. We will respond within 24-48 hours.',
      submission_id: submission.id
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}