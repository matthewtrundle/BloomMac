import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient } from '@/lib/supabase-server';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { z } from 'zod';

// Input validation schema
const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  phone: z.string().regex(/^\+?[\d\s()-]+$/).optional().nullable(),
  service: z.string().max(100).optional(),
  message: z.string().min(1).max(5000)
});

export async function POST(request: NextRequest) {
  // Apply rate limiting (public endpoint)
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
    
    // Validate input
    let validatedData;
    try {
      validatedData = contactSchema.parse(body);
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

    const { name, email, phone, service, message } = validatedData;

    // Get additional info
    const page = request.headers.get('referer') || '/contact';
    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';

    // Create anonymous Supabase client (public endpoint)
    const { supabase } = createSupabaseRouteHandlerClient(request);

    // Save to database (RLS policies should allow public inserts to contact_submissions)
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
        ip_address: ip,
        user_agent: userAgent,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      
      // Check if it's a RLS policy error
      if (dbError.code === '42501') {
        return NextResponse.json(
          { error: 'Database permissions error. Please contact support.' },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to save submission' },
        { status: 500 }
      );
    }

    // Handle email notifications separately
    try {
      // Send notification email to Jana
      await sendNotificationEmail(submission);
      
      // Send confirmation email to customer
      await sendConfirmationEmail(submission);
      
      // Add to email automation
      await triggerEmailAutomation(supabase, submission);
      
    } catch (emailError) {
      // Log error but don't fail the submission
      console.error('Email notification error:', emailError);
      // Could add to a retry queue here
    }

    // Track analytics event
    try {
      await supabase
        .from('analytics_events')
        .insert({
          type: 'contact_form_submission',
          page,
          session_id: crypto.randomUUID(),
          data: {
            service: service || 'general',
            has_phone: !!phone
          },
          ip_address: ip,
          user_agent: userAgent
        });
    } catch (analyticsError) {
      // Don't fail on analytics errors
      console.error('Analytics error:', analyticsError);
    }

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

// Separate email functions (move to lib/email-notifications.ts later)
async function sendNotificationEmail(submission: any) {
  const { sendEmail } = await import('@/lib/resend-client');
  
  const notificationHtml = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${submission.name}</p>
    <p><strong>Email:</strong> ${submission.email}</p>
    ${submission.phone ? `<p><strong>Phone:</strong> ${submission.phone}</p>` : ''}
    <p><strong>Service:</strong> ${submission.service}</p>
    <p><strong>Message:</strong></p>
    <p>${submission.message.replace(/\n/g, '<br>')}</p>
  `;

  await sendEmail({
    from: 'Bloom Psychology Website <jana@bloompsychologynorthaustin.com>',
    to: 'jana@bloompsychologynorthaustin.com',
    subject: `🌸 New Contact: ${submission.name} - ${submission.service}`,
    html: notificationHtml,
    tags: [
      { name: 'type', value: 'contact_notification' },
      { name: 'service', value: submission.service }
    ]
  });
}

async function sendConfirmationEmail(submission: any) {
  const { sendEmail } = await import('@/lib/resend-client');
  
  const confirmationHtml = `
    <h2>Thank you for contacting Bloom Psychology</h2>
    <p>Dear ${submission.name},</p>
    <p>We've received your message and will respond within 24-48 hours.</p>
    <p>If you need immediate assistance, please call us at (512) 898-9510.</p>
    <p>Best regards,<br>Dr. Jana Rundle</p>
  `;

  await sendEmail({
    from: 'Dr. Jana Rundle <jana@bloompsychologynorthaustin.com>',
    to: submission.email,
    subject: `Thank you for contacting Bloom Psychology`,
    html: confirmationHtml,
    tags: [
      { name: 'type', value: 'contact_confirmation' }
    ]
  });
}

async function triggerEmailAutomation(supabase: any, submission: any) {
  // Only add to automation if user consents (could add checkbox to form)
  const { error } = await supabase
    .from('subscribers')
    .upsert({
      email: submission.email,
      first_name: submission.name.split(' ')[0],
      last_name: submission.name.split(' ').slice(1).join(' ') || '',
      status: 'active',
      signup_source: 'contact_form',
      tags: ['contact_form', submission.service],
      metadata: {
        initial_service_interest: submission.service,
        contact_date: new Date().toISOString()
      }
    }, {
      onConflict: 'email',
      ignoreDuplicates: false // Update existing subscriber
    });

  if (!error) {
    // Trigger automation
    await supabase
      .from('email_automation_triggers')
      .insert({
        subscriber_email: submission.email,
        trigger_type: 'contact_form',
        trigger_data: {
          service_interest: submission.service,
          has_phone: !!submission.phone
        }
      });
  }
}