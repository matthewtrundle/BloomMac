import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
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
  message: z.string().min(1, 'Message is required').optional()
});

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
    const { email, phone, service } = data;
    
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

    // Trigger contact form follow-up email sequence
    console.log('Contact form submission successful:', submission?.id);
    
    try {
      // First, check if subscriber exists or create one
      const { data: existingSubscriber } = await supabaseAdmin
        .from('subscribers')
        .select('id')
        .eq('email', email.toLowerCase())
        .single();
      
      let subscriberId;
      if (existingSubscriber) {
        subscriberId = existingSubscriber.id;
      } else {
        // Create subscriber record for contact form submission
        const { data: newSubscriber, error: subscriberError } = await supabaseAdmin
          .from('subscribers')
          .insert({
            email: email.toLowerCase(),
            first_name: name.split(' ')[0] || 'Friend',
            last_name: name.split(' ').slice(1).join(' ') || '',
            status: 'pending', // Not subscribed to newsletter yet
            source: 'contact_form',
            metadata: {
              contact_submission_id: submission?.id,
              service: service || 'general',
              initial_message: message
            }
          })
          .select()
          .single();
        
        if (subscriberError || !newSubscriber) {
          console.error('Failed to create subscriber:', subscriberError);
          throw subscriberError;
        }
        subscriberId = newSubscriber.id;
      }
      
      // Enroll in contact form sequence
      await enrollmentManager.enrollSubscriber({
        subscriberId: subscriberId,
        trigger: 'contact_form',
        source: 'contact_form_submission',
        metadata: {
          submission_id: submission?.id,
          service: service || 'general',
          message: message
        }
      });
      
      console.log('Contact follow-up email sequence initiated');
    } catch (emailError) {
      console.error('Failed to initiate follow-up sequence:', emailError);
      // Don't fail the submission if email fails
    }

    // Send admin notification email
    try {
      const adminEmails = ['drjana@bloompsychologynorthaustin.com', 'matt@bloompsychologynorthaustin.com'];
      
      for (const adminEmail of adminEmails) {
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #8B9B7A; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">New Contact Form Submission</h1>
            </div>
            <div style="padding: 30px; background-color: #f9f9f9;">
              <h2 style="color: #333; margin-bottom: 20px;">Contact Details</h2>
              <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
                ${phone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> ${phone}</p>` : ''}
                <p style="margin: 5px 0;"><strong>Service Interest:</strong> ${service || 'General'}</p>
                <p style="margin: 5px 0;"><strong>Submission ID:</strong> ${submission?.id}</p>
                <p style="margin: 5px 0;"><strong>Page:</strong> ${page}</p>
                <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
              </div>
              <h3 style="color: #333;">Message:</h3>
              <div style="background-color: white; padding: 20px; border-radius: 8px; white-space: pre-wrap; font-family: Georgia, serif; line-height: 1.6;">
                ${message}
              </div>
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #666; font-size: 14px; margin: 0;">
                  <strong>Action Required:</strong> Please respond to this inquiry within 24-48 hours.
                </p>
              </div>
            </div>
          </div>
        `;

        // Send using the internal email API
        const response = await fetch(new URL('/api/emails/send', request.url), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.INTERNAL_API_KEY || 'fallback-key'
          },
          body: JSON.stringify({
            to: adminEmail,
            subject: `New Contact Form Submission from ${name}`,
            template: 'contact-admin-notification',
            data: {
              name,
              email,
              phone,
              service: service || 'General',
              message,
              submissionId: submission?.id,
              page,
              timestamp: new Date().toLocaleString()
            }
          })
        });

        if (response.ok) {
          console.log(`Admin notification sent to ${adminEmail}`);
        } else {
          console.error(`Failed to send admin notification to ${adminEmail}:`, await response.text());
        }
      }
    } catch (adminEmailError) {
      console.error('Failed to send admin notification emails:', adminEmailError);
      // Don't fail the submission if admin email fails
    }

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