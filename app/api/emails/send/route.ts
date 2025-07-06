import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Email service configuration using Resend
async function sendEmail(to: string, subject: string, html: string, text?: string) {
  // Check if we have the Resend API key
  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      const result = await resend.emails.send({
        from: 'Bloom Psychology <noreply@bloompsychologynorthaustin.com>',
        to,
        subject,
        html,
        text
      });
      
      console.log('[Email] Successfully sent email via Resend:', { to, subject, id: result.data?.id });
      return { success: true, id: result.data?.id || 'resend-email' };
    } catch (error) {
      console.error('[Email] Resend error:', error);
      // Fall back to mock if Resend fails
    }
  }

  // For development or if Resend isn't configured, just log the email
  console.log('[Email] Would send email (no Resend API key):', { to, subject });
  console.log('[Email] HTML content:', html);
  return { success: true, id: 'mock-email-id' };
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    // For internal API calls, also check for API key
    const apiKey = request.headers.get('x-api-key');
    const isInternalCall = apiKey === process.env.INTERNAL_API_KEY;
    
    if (!user && !isInternalCall) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { to, subject, template, data } = body;
    
    if (!to || !subject || !template) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, template' },
        { status: 400 }
      );
    }
    
    // Generate HTML based on template
    let html = '';
    let text = '';
    
    switch (template) {
      case 'appointment-reminder-24h':
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #8B9B7A; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Appointment Reminder</h1>
            </div>
            <div style="padding: 30px; background-color: #f9f9f9;">
              <p>Dear ${data.clientName},</p>
              <p>This is a reminder that you have an appointment scheduled with Dr. Jana Rundle tomorrow.</p>
              <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Date:</strong> ${data.appointmentDate}</p>
                <p style="margin: 5px 0;"><strong>Time:</strong> ${data.appointmentTime}</p>
                <p style="margin: 5px 0;"><strong>Type:</strong> ${data.appointmentType}</p>
              </div>
              <p>Please ensure you're in a quiet, private space with a stable internet connection.</p>
              <p>If you need to reschedule or cancel, please do so at least 24 hours in advance to avoid a cancellation fee.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.confirmLink}" style="background-color: #8B9B7A; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">Confirm Appointment</a>
              </div>
              <p style="color: #666; font-size: 14px;">If you have any questions, please don't hesitate to contact us.</p>
            </div>
          </div>
        `;
        text = `Appointment Reminder: You have an appointment tomorrow at ${data.appointmentTime}. Please confirm your attendance.`;
        break;
        
      case 'appointment-reminder-2h':
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #E8A0A6; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Your Appointment is Coming Up!</h1>
            </div>
            <div style="padding: 30px; background-color: #f9f9f9;">
              <p>Hi ${data.clientName},</p>
              <p>Just a friendly reminder that your appointment with Dr. Jana is in 2 hours.</p>
              <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Time:</strong> ${data.appointmentTime}</p>
                <p style="margin: 5px 0;"><strong>Type:</strong> ${data.appointmentType}</p>
              </div>
              <h3>Quick Preparation Checklist:</h3>
              <ul>
                <li>Find a quiet, private space</li>
                <li>Test your internet connection</li>
                <li>Have a glass of water nearby</li>
                <li>Take a few deep breaths to center yourself</li>
              </ul>
              <p>Looking forward to our session!</p>
            </div>
          </div>
        `;
        text = `Your appointment is in 2 hours at ${data.appointmentTime}. Please be ready!`;
        break;
        
      case 'appointment-confirmation':
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #8B9B7A; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Appointment Confirmed</h1>
            </div>
            <div style="padding: 30px; background-color: #f9f9f9;">
              <p>Dear ${data.clientName},</p>
              <p>Your appointment has been successfully scheduled!</p>
              <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Date:</strong> ${data.appointmentDate}</p>
                <p style="margin: 5px 0;"><strong>Time:</strong> ${data.appointmentTime}</p>
                <p style="margin: 5px 0;"><strong>Type:</strong> ${data.appointmentType}</p>
                <p style="margin: 5px 0;"><strong>Duration:</strong> ${data.duration}</p>
              </div>
              <p>You'll receive reminder emails 24 hours and 2 hours before your appointment.</p>
              <p><strong>Payment:</strong> Your payment method has been saved and will be charged 24 hours before your appointment.</p>
              <p style="color: #666; font-size: 14px;">Need to make changes? Please provide at least 24 hours notice to avoid cancellation fees.</p>
            </div>
          </div>
        `;
        text = `Your appointment is confirmed for ${data.appointmentDate} at ${data.appointmentTime}.`;
        break;
        
      case 'no-show-notification':
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #D4A574; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Missed Appointment Notice</h1>
            </div>
            <div style="padding: 30px; background-color: #f9f9f9;">
              <p>Dear ${data.clientName},</p>
              <p>We noticed you missed your scheduled appointment today at ${data.appointmentTime}.</p>
              <p>As per our cancellation policy, a no-show fee of $${data.feeAmount} has been charged to your payment method on file.</p>
              <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffeeba;">
                <p style="margin: 0;">We understand that unexpected situations arise. If this was due to an emergency, please contact us and we'll be happy to discuss your situation.</p>
              </div>
              <p>Would you like to reschedule? We're here to support your wellness journey.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.rescheduleLink}" style="background-color: #8B9B7A; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">Reschedule Appointment</a>
              </div>
            </div>
          </div>
        `;
        text = `You missed your appointment today. A no-show fee of $${data.feeAmount} has been charged. Please contact us to reschedule.`;
        break;
        
      case 'payment-receipt':
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #8B9B7A; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Payment Receipt</h1>
            </div>
            <div style="padding: 30px; background-color: #f9f9f9;">
              <p>Dear ${data.clientName},</p>
              <p>Thank you for your payment. Here's your receipt for your records.</p>
              <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Date:</strong> ${data.paymentDate}</p>
                <p style="margin: 5px 0;"><strong>Amount:</strong> $${data.amount}</p>
                <p style="margin: 5px 0;"><strong>Description:</strong> ${data.description}</p>
                <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${data.paymentMethod}</p>
                <p style="margin: 5px 0;"><strong>Transaction ID:</strong> ${data.transactionId}</p>
              </div>
              <p style="color: #666; font-size: 14px;">This receipt may be used for insurance reimbursement or tax purposes.</p>
            </div>
          </div>
        `;
        text = `Payment receipt: $${data.amount} paid on ${data.paymentDate}. Transaction ID: ${data.transactionId}`;
        break;

      case 'contact-admin-notification':
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #8B9B7A; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">New Contact Form Submission</h1>
            </div>
            <div style="padding: 30px; background-color: #f9f9f9;">
              <h2 style="color: #333; margin-bottom: 20px;">Contact Details</h2>
              <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 5px 0;"><strong>Name:</strong> ${data.name}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${data.email}</p>
                ${data.phone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> ${data.phone}</p>` : ''}
                <p style="margin: 5px 0;"><strong>Service Interest:</strong> ${data.service}</p>
                <p style="margin: 5px 0;"><strong>Submission ID:</strong> ${data.submissionId}</p>
                <p style="margin: 5px 0;"><strong>Page:</strong> ${data.page}</p>
                <p style="margin: 5px 0;"><strong>Date:</strong> ${data.timestamp}</p>
              </div>
              <h3 style="color: #333;">Message:</h3>
              <div style="background-color: white; padding: 20px; border-radius: 8px; white-space: pre-wrap; font-family: Georgia, serif; line-height: 1.6;">
                ${data.message}
              </div>
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #666; font-size: 14px; margin: 0;">
                  <strong>Action Required:</strong> Please respond to this inquiry within 24-48 hours.
                </p>
              </div>
            </div>
          </div>
        `;
        text = `New contact form submission from ${data.name} (${data.email}). Message: ${data.message}`;
        break;
        
      default:
        return NextResponse.json(
          { error: `Unknown email template: ${template}` },
          { status: 400 }
        );
    }
    
    // Send the email
    const result = await sendEmail(to, subject, html, text);
    
    // Log email sent for auditing
    if (user || isInternalCall) {
      await supabase
        .from('email_logs')
        .insert({
          user_id: user?.id || 'system',
          to_email: to,
          subject,
          template,
          status: result.success ? 'sent' : 'failed',
          sent_at: new Date().toISOString()
        });
    }
    
    return NextResponse.json({
      success: result.success,
      messageId: result.id,
      message: 'Email sent successfully'
    });
    
  } catch (error) {
    console.error('[Email] Error sending email:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email'
      },
      { status: 500 }
    );
  }
}