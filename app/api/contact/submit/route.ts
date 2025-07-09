import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, createSupabaseServiceClient } from '@/lib/supabase-server';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { z } from 'zod';
import { enrollmentManager } from '@/lib/email-automation/enrollment-manager';

// Input validation schema
const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().optional(),
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  service: z.string().optional(),
  concerns: z.string().optional(),
  message: z.string().min(1, 'Message is required').optional(),
  newsletter: z.boolean().optional()
});

async function findOrCreateSubscriber(email: string, firstName?: string, lastName?: string, newsletter?: boolean) {
    const emailLower = email.toLowerCase();
    const supabaseAdmin = createSupabaseServiceClient();
    
    // Check if subscriber exists
    let { data: subscriber, error } = await supabaseAdmin
        .from('subscribers')
        .select('id, status')
        .eq('email', emailLower)
        .single();

    if (error && error.code !== 'PGRST116') { // Ignore 'not found' error
        throw error;
    }

    // Create if not found
    if (!subscriber) {
        const { data: newSubscriber, error: insertError } = await supabaseAdmin
            .from('subscribers')
            .insert({
                email: emailLower,
                first_name: firstName,
                last_name: lastName,
                status: newsletter ? 'active' : 'transactional', // Active if they want newsletter, transactional if not
                source: 'contact_form'
            })
            .select('id, status')
            .single();
        
        if (insertError) throw insertError;
        subscriber = newSubscriber;
    } else if (newsletter && subscriber.status !== 'active') {
        // Update existing subscriber to active if they opted in
        const { data: updatedSubscriber, error: updateError } = await supabaseAdmin
            .from('subscribers')
            .update({ status: 'active' })
            .eq('id', subscriber.id)
            .select('id, status')
            .single();
        
        if (updateError) throw updateError;
        subscriber = updatedSubscriber;
    }

    return subscriber;
}

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
    
    // Validate input
    const validationResult = contactSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    
    // Handle different field names from form
    const name = data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim();
    const message = data.message || data.concerns || '';
    const { email, phone, service, newsletter } = data;
    
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Get additional info
    const page = request.headers.get('referer') || '/contact';
    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';

    // Create public Supabase client
    const supabase = createPublicClient();
    
    // Save to database using RPC function for anonymous submissions
    const { data: submission, error: dbError } = await supabase
      .rpc('submit_contact_form', {
        contact_data: {
          p_name: name,
          p_email: email,
          p_phone: phone || null,
          p_service: service || 'general',
          p_message: message,
          p_page: page,
          p_user_agent: userAgent,
          p_ip_address: ip
        }
      });

    if (dbError) {
      console.error('Database error:', dbError);
      
      // Check if it's a permissions error
      if (dbError.message?.includes('permission') || dbError.code === '42501') {
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

    // Send immediate notification email to Jana
    try {
      const { sendEmail } = await import('@/lib/resend-client');
      
      if (!sendEmail) {
        console.log('Email service not configured, skipping email notification');
      } else {
      
      const displayName = name || 'Anonymous';
      const serviceDisplay = service || 'General Inquiry';
      
      const notificationHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color: #333; line-height: 1.6; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1e3a5f 0%, #f8b5c4 100%); padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .content { background: white; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 8px 8px; }
    .field { margin-bottom: 15px; display: flex; }
    .field-name { font-weight: 600; color: #1e3a5f; width: 120px; flex-shrink: 0; }
    .field-value { flex: 1; }
    .message-box { background: #f8f9fa; border-left: 4px solid #f8b5c4; padding: 15px; margin: 15px 0; border-radius: 4px; }
    .footer { text-align: center; margin-top: 20px; font-size: 14px; color: #666; }
    .cta-button { display: inline-block; background: #1e3a5f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📧 New Contact Form Submission</h1>
      <p style="color: white; margin: 5px 0 0 0;">Bloom Psychology Website</p>
    </div>
    
    <div class="content">
      <div class="field">
        <div class="field-name">Name:</div>
        <div class="field-value">${displayName}</div>
      </div>
      
      <div class="field">
        <div class="field-name">Email:</div>
        <div class="field-value"><a href="mailto:${email}" style="color: #1e3a5f;">${email}</a></div>
      </div>
      
      ${phone ? `<div class="field">
        <div class="field-name">Phone:</div>
        <div class="field-value"><a href="tel:${phone}" style="color: #1e3a5f;">${phone}</a></div>
      </div>` : ''}
      
      <div class="field">
        <div class="field-name">Service:</div>
        <div class="field-value">${serviceDisplay}</div>
      </div>
      
      <div class="field">
        <div class="field-name">Page:</div>
        <div class="field-value">${page}</div>
      </div>
      
      <div class="message-box">
        <strong>Message:</strong><br>
        ${message.replace(/\n/g, '<br>')}
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="mailto:${email}" class="cta-button">Reply to ${displayName}</a>
      </div>
    </div>
    
    <div class="footer">
      <p>Submitted on ${new Date().toLocaleString('en-US', {
        timeZone: 'America/Chicago',
        dateStyle: 'full',
        timeStyle: 'short'
      })} (Austin Time)</p>
      <p>You can view all submissions in your <a href="https://bloompsychologynorthaustin.com/admin/contacts" style="color: #1e3a5f;">admin dashboard</a></p>
    </div>
  </div>
</body>
</html>`;

      await sendEmail({
        from: 'Bloom Psychology Website <noreply@bloompsychologynorthaustin.com>',
        to: ['jana@bloompsychologynorthaustin.com', 'matt@bloompsychologynorthaustin.com'],
        subject: `🌸 New Contact: ${displayName} - ${serviceDisplay}`,
        html: notificationHtml,
        tags: [
          { name: 'type', value: 'contact_notification' },
          { name: 'service', value: service || 'general' }
        ]
      });

      console.log('Contact notification email sent to Jana');

      // Also send a confirmation email to the customer
      const confirmationHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color: #333; line-height: 1.6; margin: 0; padding: 0; background: #f8f9fa; }
    .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #1e3a5f 0%, #f8b5c4 100%); padding: 30px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .header p { color: white; margin: 10px 0 0 0; opacity: 0.9; }
    .content { padding: 30px; }
    .message-box { background: #f8f9fa; border-left: 4px solid #f8b5c4; padding: 20px; margin: 20px 0; border-radius: 4px; }
    .next-steps { background: #e8f5e9; border: 1px solid #c8e6c9; padding: 20px; border-radius: 6px; margin: 20px 0; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
    .cta-button { display: inline-block; background: #1e3a5f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thank You for Reaching Out! 🌸</h1>
      <p>We've received your message and will respond soon</p>
    </div>
    
    <div class="content">
      <p>Dear ${displayName},</p>
      
      <p>Thank you for contacting Bloom Psychology. We truly appreciate you taking the time to reach out to us.</p>
      
      <div class="message-box">
        <strong>Your message:</strong><br>
        "${message}"
      </div>
      
      <div class="next-steps">
        <h3 style="margin-top: 0; color: #2e7d32;">📅 What happens next?</h3>
        <ul style="margin: 0; padding-left: 20px;">
          <li><strong>Within 24-48 hours:</strong> Dr. Jana Rundle will personally review your message</li>
          <li><strong>Response:</strong> We'll email you back to schedule a free 15-minute consultation</li>
          <li><strong>Questions:</strong> Feel free to call or text us at <a href="tel:+15128989510" style="color: #1e3a5f;">(512) 898-9510</a></li>
        </ul>
      </div>
      
      <p>In the meantime, feel free to explore our resources:</p>
      <ul>
        <li><a href="https://bloompsychologynorthaustin.com/resources" style="color: #1e3a5f;">Free Mental Health Resources</a></li>
        <li><a href="https://bloompsychologynorthaustin.com/new-mom-program" style="color: #1e3a5f;">New Mom Program</a></li>
        <li><a href="https://bloompsychologynorthaustin.com/courses" style="color: #1e3a5f;">Online Courses</a></li>
      </ul>
      
      <p>Thank you for choosing Bloom Psychology. We look forward to supporting you on your journey.</p>
      
      <p>Warmly,<br>
      <strong>Dr. Jana Rundle</strong><br>
      Licensed Clinical Psychologist<br>
      Bloom Psychology</p>
    </div>
    
    <div class="footer">
      <p><strong>Bloom Psychology</strong><br>
      📧 jana@bloompsychologynorthaustin.com<br>
      📞 (512) 898-9510<br>
      🌐 bloompsychologynorthaustin.com</p>
      
      <p style="font-size: 12px; margin-top: 15px;">
        <strong>Crisis Support:</strong> If you're experiencing a mental health emergency, 
        please call 911 or text/call 988 for the Suicide & Crisis Lifeline.
      </p>
    </div>
  </div>
</body>
</html>`;

      await sendEmail({
        from: 'Dr. Jana Rundle <jana@bloompsychologynorthaustin.com>',
        to: email,
        subject: `Thank you for contacting Bloom Psychology, ${displayName}`,
        html: confirmationHtml,
        tags: [
          { name: 'type', value: 'contact_confirmation' },
          { name: 'service', value: service || 'general' }
        ]
      });

      console.log('Confirmation email sent to customer:', email);
      }
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
      // Don't fail the form submission if notification email fails
    }

    // Trigger contact form email automation sequence for customer
    try {
        const subscriber = await findOrCreateSubscriber(email, data.firstName, data.lastName, newsletter);
        if (subscriber) {
            // Always enroll in contact form sequence
            await enrollmentManager.enrollSubscriber({
                subscriberId: subscriber.id,
                trigger: 'contact_form',
                source: 'contact_form_submission',
                metadata: {
                    service: service || 'general',
                    page,
                    newsletter: newsletter || false
                }
            });
            console.log('Successfully enrolled contact form submitter in sequence:', email);

            // If they opted into newsletter and are active, also enroll in newsletter sequence
            if (newsletter && subscriber.status === 'active') {
                await enrollmentManager.enrollSubscriber({
                    subscriberId: subscriber.id,
                    trigger: 'newsletter_signup',
                    source: 'contact_form_newsletter_optin',
                    metadata: {
                        service: service || 'general',
                        page
                    }
                });
                console.log('Also enrolled in newsletter sequence:', email);
            }
        }
    } catch (emailError) {
      console.error('Email automation trigger failed:', emailError);
      // Don't fail the main submission if email automation fails
    }

    // Analytics tracking is handled by the RPC function

    return NextResponse.json({
      success: true,
      message: 'Thank you for contacting us. We will respond within 24-48 hours.',
      submission_id: submission?.id || crypto.randomUUID()
    });
  } catch (error) {
    console.error('Contact form error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}