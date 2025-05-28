import { Resend } from 'resend';
import { supabaseAdmin } from './supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const { data, error } = await resend.emails.send({
      from: 'Bloom Psychology <newsletter@bloompsychologynorthaustin.com>',
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
  
  // Find subscribers who should receive this email
  const { data: eligibleSubscribers } = await supabaseAdmin
    .from('subscribers')
    .select('*')
    .eq('status', 'active');

  if (!eligibleSubscribers) return;

  for (const subscriber of eligibleSubscribers) {
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
      await sendAutomatedEmail({
        sequenceId: sequence.id,
        emailId: email.id,
        subscriberId: subscriber.id,
        to: subscriber.email,
        subject: personalizeContent(email.subject, subscriber),
        content: personalizeContent(email.content, subscriber)
      });
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
    // Add other triggers as needed
  }

  if (!triggerTime) return false;

  // Check if enough time has passed
  const now = new Date();
  const sendTime = new Date(triggerTime.getTime() + (delayHours * 60 * 60 * 1000));
  
  return now >= sendTime;
}

function personalizeContent(content: string, subscriber: any): string {
  return content
    .replace(/{{first_name}}/g, subscriber.first_name || 'Friend')
    .replace(/{{last_name}}/g, subscriber.last_name || '')
    .replace(/{{email}}/g, subscriber.email);
}