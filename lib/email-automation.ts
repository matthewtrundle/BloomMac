import { Resend } from 'resend';
import { supabaseAdmin } from './supabase';
import { courseWelcomeTemplate, courseWelcomeTextTemplate } from './email-templates/course-welcome';

// Lazy-load Resend client to avoid initialization errors
let resend: Resend | null = null;

function getResendClient() {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      console.warn('[email-automation] RESEND_API_KEY not found in environment');
      return null;
    }
    try {
      resend = new Resend(process.env.RESEND_API_KEY);
    } catch (error) {
      console.error('[email-automation] Error initializing Resend:', error);
      return null;
    }
  }
  return resend;
}

interface SendEmailParams {
  to: string;
  subject: string;
  template?: string;
  data?: any;
  html?: string;
  text?: string;
}

export async function sendEmail({ to, subject, template, data, html, text }: SendEmailParams) {
  try {
    let emailHtml = html;
    let emailText = text;

    // Use template if provided
    if (template && data) {
      switch (template) {
        case 'course-welcome':
          emailHtml = courseWelcomeTemplate(data);
          emailText = courseWelcomeTextTemplate(data);
          break;
        default:
          throw new Error(`Unknown template: ${template}`);
      }
    }

    const client = getResendClient();
    if (!client) {
      throw new Error('Resend API key not configured');
    }

    const { data: result, error } = await client.emails.send({
      from: 'Dr. Jana Rundle <jana@bloompsychologynorthaustin.com>',
      to,
      subject,
      html: emailHtml,
      text: emailText,
      tags: [
        { name: 'type', value: template || 'manual' }
      ]
    });

    if (error) {
      throw error;
    }

    return { success: true, id: result.id };

  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

interface SendAutomatedEmailParams {
  sequenceId: string;
  emailId: string;
  subscriberId: string;
  to: string;
  subject: string;
  content: string;
}

export async function sendAutomatedEmail({
  sequenceId,
  emailId,
  subscriberId,
  to,
  subject,
  content
}: SendAutomatedEmailParams) {
  try {
    // Validate email address
    if (!to || typeof to !== 'string' || !to.includes('@')) {
      throw new Error(`Invalid email address: ${to}`);
    }

    // Create a log entry
    const { data: logEntry, error: logError } = await supabaseAdmin
      .from('email_automation_logs')
      .insert({
        sequence_id: sequenceId,
        email_id: emailId,
        subscriber_id: subscriberId,
        status: 'sending'
      })
      .select()
      .single();

    if (logError || !logEntry) {
      throw new Error('Failed to create log entry');
    }

    // Add tracking to the email content
    const trackedContent = addTrackingToEmail(content, logEntry.id, subscriberId);
    
    // Send the email
    const client = getResendClient();
    if (!client) {
      throw new Error('Resend API key not configured');
    }
    
    const { data, error } = await client.emails.send({
      from: 'Dr. Jana Rundle <jana@bloompsychologynorthaustin.com>',
      to,
      subject,
      html: trackedContent,
      tags: [
        { name: 'automated', value: 'true' },
        { name: 'sequence_id', value: sequenceId },
        { name: 'email_id', value: emailId }
      ]
    });

    if (error) {
      // Update log with failure
      await supabaseAdmin
        .from('email_automation_logs')
        .update({ 
          status: 'failed',
          metadata: { error: error.message }
        })
        .eq('id', logEntry.id);
      
      throw error;
    }

    // Update log with success
    await supabaseAdmin
      .from('email_automation_logs')
      .update({ 
        status: 'sent',
        metadata: { resend_id: data.id }
      })
      .eq('id', logEntry.id);

    return { success: true, logId: logEntry.id };

  } catch (error) {
    console.error('Error sending automated email:', error);
    throw error;
  }
}

function addTrackingToEmail(content: string, logId: string, subscriberId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bloompsychologynorthaustin.com';
  
  // Add tracking pixel before closing body tag
  const trackingPixel = `<img src="${baseUrl}/api/track-email-open?id=${logId}&subscriber=${subscriberId}" width="1" height="1" style="display:block;" alt="" />`;
  
  // Replace all links with tracked versions
  const trackedContent = content.replace(
    /<a\s+href=["']([^"']+)["']/gi,
    (match, url) => {
      // Don't track unsubscribe links
      if (url.includes('unsubscribe')) {
        return match;
      }
      const trackedUrl = `${baseUrl}/api/track-email-click?id=${logId}&subscriber=${subscriberId}&url=${encodeURIComponent(url)}`;
      return `<a href="${trackedUrl}"`;
    }
  );

  // Add tracking pixel before </body>
  return trackedContent.replace('</body>', `${trackingPixel}</body>`);
}

export async function processScheduledEmails() {
  try {
    // Get active sequences
    const { data: activeSequences } = await supabaseAdmin
      .from('email_sequences')
      .select(`
        *,
        sequence_emails (*)
      `)
      .eq('status', 'active');

    if (!activeSequences) return;

    for (const sequence of activeSequences) {
      // Process each email in the sequence
      for (const email of sequence.sequence_emails) {
        await processSequenceEmail(sequence, email);
      }
    }

  } catch (error) {
    console.error('Error processing scheduled emails:', error);
  }
}

async function processSequenceEmail(sequence: any, email: any) {
  // Calculate when this email should be sent
  const delayHours = (email.delay_days * 24) + email.delay_hours;
  
  // Find subscribers who should receive this email - only get those with valid emails
  const { data: eligibleSubscribers } = await supabaseAdmin
    .from('subscribers')
    .select('*')
    .eq('status', 'active')
    .not('email', 'is', null)
    .not('email', 'eq', '');

  if (!eligibleSubscribers) return;

  for (const subscriber of eligibleSubscribers) {
    // Validate subscriber email before any processing
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!subscriber.email || typeof subscriber.email !== 'string' || !emailRegex.test(subscriber.email)) {
      console.error(`[Email Automation] Skipping email for subscriber ${subscriber.id} - invalid email: ${subscriber.email}`);
      
      // Log the error to track issues
      try {
        await supabaseAdmin
          .from('email_automation_errors')
          .insert({
            subscriber_id: subscriber.id,
            sequence_id: sequence.id,
            email_id: email.id,
            error: 'Invalid or missing email address',
            error_details: { 
              email: subscriber.email,
              subscriber_source: subscriber.signup_source,
              sequence_name: sequence.name 
            },
            created_at: new Date().toISOString()
          });
      } catch (logError) {
        console.error('[Email Automation] Failed to log error:', logError);
      }
      
      continue;
    }

    // Check if we've already sent this email to this subscriber
    const { data: existingLog } = await supabaseAdmin
      .from('email_automation_logs')
      .select('id')
      .eq('sequence_id', sequence.id)
      .eq('email_id', email.id)
      .eq('subscriber_id', subscriber.id)
      .single();

    if (existingLog) continue; // Already sent

    // Check trigger conditions
    if (await shouldSendEmail(sequence, subscriber, delayHours)) {
      try {
        await sendAutomatedEmail({
          sequenceId: sequence.id,
          emailId: email.id,
          subscriberId: subscriber.id,
          to: subscriber.email,
          subject: personalizeContent(email.subject, subscriber),
          content: personalizeContent(email.content, subscriber)
        });
      } catch (emailError) {
        console.error(`[Email Automation] Failed to send email to subscriber ${subscriber.id}:`, emailError);
      }
    }
  }
}

async function shouldSendEmail(sequence: any, subscriber: any, delayHours: number): Promise<boolean> {
  // Check when the trigger event occurred
  let triggerTime: Date | null = null;

  switch (sequence.trigger) {
    case 'newsletter_signup':
      triggerTime = new Date(subscriber.created_at);
      break;
    case 'contact_form':
      // Check for recent contact form submission
      const { data: contactForm } = await supabaseAdmin
        .from('contact_submissions')
        .select('created_at')
        .eq('email', subscriber.email)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (contactForm) {
        triggerTime = new Date(contactForm.created_at);
      }
      break;
    case 'resource_download':
      // Check subscriber metadata for resource download
      if (subscriber.metadata?.download_date) {
        triggerTime = new Date(subscriber.metadata.download_date);
      } else if (subscriber.source === 'resource_download') {
        // Fallback to created_at if source indicates resource download
        triggerTime = new Date(subscriber.created_at);
      }
      break;
    // Add other triggers as needed
  }

  if (!triggerTime) return false;

  // Check if enough time has passed
  const now = new Date();
  const sendTime = new Date(triggerTime.getTime() + (delayHours * 60 * 60 * 1000));
  
  return now >= sendTime;
}

function personalizeContent(content: string, subscriber: any): string {
  // Get resource name from metadata if available
  const resourceName = subscriber.metadata?.last_resource_downloaded || 'resource';
  const downloadLink = subscriber.metadata?.download_link || 
    `/resources/${resourceName.toLowerCase().replace(/\s+/g, '-')}`;

  return content
    .replace(/{{first_name}}/g, subscriber.first_name || 'Friend')
    .replace(/{{last_name}}/g, subscriber.last_name || '')
    .replace(/{{email}}/g, subscriber.email)
    .replace(/{{resource_name}}/g, resourceName)
    .replace(/{{download_link}}/g, downloadLink);
}