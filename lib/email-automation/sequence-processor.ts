import { supabaseAdmin } from '@/lib/supabase';
import { getResendClient } from '@/lib/resend-client';
import { addHours, addDays, isBefore } from 'date-fns';

export interface ProcessingResult {
  processed: number;
  sent: number;
  errors: number;
  details: any[];
}

export class SequenceProcessor {
  private resend: any;

  constructor() {
    this.resend = getResendClient();
  }

  /**
   * Process all pending sequence emails
   */
  async processSequences(): Promise<ProcessingResult> {
    const result: ProcessingResult = {
      processed: 0,
      sent: 0,
      errors: 0,
      details: []
    };

    try {
      // Get all active enrollments with emails ready to send
      const { data: enrollments, error: enrollmentError } = await supabaseAdmin
        .from('sequence_enrollments')
        .select(`
          *,
          subscriber:subscribers!inner(
            id,
            email,
            first_name,
            last_name,
            status
          ),
          sequence:email_sequences(
            id,
            name,
            status
          )
        `)
        .eq('status', 'active')
        .lte('next_send_at', new Date().toISOString())
        .not('next_send_at', 'is', null)
        .eq('subscriber.status', 'active') // Only send to active subscribers
        .eq('sequence.status', 'active'); // Only process active sequences

      if (enrollmentError) {
        console.error('Error fetching enrollments:', enrollmentError);
        throw enrollmentError;
      }

      if (!enrollments || enrollments.length === 0) {
        console.log('No emails ready to send');
        return result;
      }

      console.log(`Processing ${enrollments.length} enrollments...`);

      // Process each enrollment
      for (const enrollment of enrollments) {
        result.processed++;

        try {
          await this.processEnrollment(enrollment);
          result.sent++;
          result.details.push({
            enrollment_id: enrollment.id,
            subscriber_email: enrollment.subscriber.email,
            status: 'sent'
          });
        } catch (error) {
          result.errors++;
          console.error(`Failed to process enrollment ${enrollment.id}:`, error);
          result.details.push({
            enrollment_id: enrollment.id,
            subscriber_email: enrollment.subscriber.email,
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
          });

          // Log the error
          await this.logError(enrollment.id, error);
        }
      }

      console.log(`Processing complete: ${result.sent} sent, ${result.errors} errors`);
      return result;

    } catch (error) {
      console.error('SequenceProcessor error:', error);
      throw error;
    }
  }

  /**
   * Process a single enrollment
   */
  private async processEnrollment(enrollment: any): Promise<void> {
    // Get the next email in the sequence
    const nextPosition = enrollment.current_position + 1;
    
    const { data: sequenceEmail, error: emailError } = await supabaseAdmin
      .from('sequence_emails')
      .select(`
        *,
        template:email_templates(
          id,
          name,
          subject,
          content,
          variables
        )
      `)
      .eq('sequence_id', enrollment.sequence_id)
      .eq('position', nextPosition)
      .single();

    if (emailError || !sequenceEmail) {
      // No more emails in sequence - mark as completed
      await this.completeEnrollment(enrollment.id);
      return;
    }

    // Send the email
    const sent = await this.sendSequenceEmail(
      enrollment.subscriber,
      sequenceEmail,
      enrollment
    );

    if (sent) {
      // Update enrollment for next email
      await this.updateEnrollmentPosition(
        enrollment.id,
        nextPosition,
        sequenceEmail
      );
    }
  }

  /**
   * Send a sequence email
   */
  private async sendSequenceEmail(
    subscriber: any,
    sequenceEmail: any,
    enrollment: any
  ): Promise<boolean> {
    try {
      if (!this.resend) {
        throw new Error('Resend client not initialized');
      }

      // Get the template content
      const template = sequenceEmail.template;
      if (!template) {
        throw new Error(`No template found for sequence email ${sequenceEmail.id}`);
      }

      // Personalize the email
      const personalizedContent = this.personalizeEmail(
        template.content,
        template.subject,
        {
          firstName: subscriber.first_name || 'Friend',
          lastName: subscriber.last_name || '',
          email: subscriber.email
        }
      );

      // Create tracking record
      const { data: emailSend, error: trackError } = await supabaseAdmin
        .from('sequence_email_sends')
        .insert({
          enrollment_id: enrollment.id,
          sequence_email_id: sequenceEmail.id,
          email_template_id: template.id,
          status: 'pending'
        })
        .select()
        .single();

      if (trackError) {
        throw trackError;
      }

      // Send via Resend
      const { data: sendResult, error: sendError } = await this.resend.emails.send({
        from: 'Dr. Jana Rundle <jana@bloompsychologynorthaustin.com>',
        to: subscriber.email,
        subject: personalizedContent.subject,
        html: personalizedContent.content,
        tags: [
          { name: 'sequence', value: enrollment.sequence.name },
          { name: 'position', value: sequenceEmail.position.toString() },
          { name: 'enrollment_id', value: enrollment.id },
          { name: 'send_id', value: emailSend.id }
        ]
      });

      if (sendError) {
        throw sendError;
      }

      // Update send record with success
      await supabaseAdmin
        .from('sequence_email_sends')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
          resend_id: sendResult.id
        })
        .eq('id', emailSend.id);

      // Log success
      await this.logActivity(enrollment.id, 'email_sent', {
        sequence_email_id: sequenceEmail.id,
        position: sequenceEmail.position,
        template_name: template.name,
        resend_id: sendResult.id
      });

      console.log(`✅ Sent email to ${subscriber.email} (position ${sequenceEmail.position})`);
      return true;

    } catch (error) {
      console.error('Failed to send email:', error);
      
      // Update send record with error
      if (sequenceEmail.id) {
        await supabaseAdmin
          .from('sequence_email_sends')
          .update({
            status: 'failed',
            error_message: error instanceof Error ? error.message : 'Unknown error'
          })
          .eq('enrollment_id', enrollment.id)
          .eq('sequence_email_id', sequenceEmail.id)
          .order('created_at', { ascending: false })
          .limit(1);
      }

      throw error;
    }
  }

  /**
   * Personalize email content with subscriber data
   */
  private personalizeEmail(
    content: string,
    subject: string,
    data: Record<string, any>
  ): { content: string; subject: string } {
    let personalizedContent = content;
    let personalizedSubject = subject;

    // Replace variables like {{firstName}}, {{lastName}}, etc.
    Object.entries(data).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      personalizedContent = personalizedContent.replace(regex, value || '');
      personalizedSubject = personalizedSubject.replace(regex, value || '');
    });

    // Add unsubscribe link
    const unsubscribeLink = `${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?email=${encodeURIComponent(data.email)}`;
    personalizedContent = personalizedContent.replace(/\{\{unsubscribeLink\}\}/g, unsubscribeLink);

    return {
      content: personalizedContent,
      subject: personalizedSubject
    };
  }

  /**
   * Update enrollment position and calculate next send time
   */
  private async updateEnrollmentPosition(
    enrollmentId: string,
    newPosition: number,
    currentEmail: any
  ): Promise<void> {
    // Get the next email in sequence to calculate send time
    const { data: nextEmail } = await supabaseAdmin
      .from('sequence_emails')
      .select('*')
      .eq('sequence_id', currentEmail.sequence_id)
      .eq('position', newPosition + 1)
      .single();

    let nextSendAt = null;
    if (nextEmail) {
      nextSendAt = this.calculateNextSendTime(nextEmail);
    }

    // Update enrollment
    const { error } = await supabaseAdmin
      .from('sequence_enrollments')
      .update({
        current_position: newPosition,
        next_send_at: nextSendAt,
        updated_at: new Date().toISOString()
      })
      .eq('id', enrollmentId);

    if (error) throw error;

    await this.logActivity(enrollmentId, 'position_updated', {
      new_position: newPosition,
      next_send_at: nextSendAt
    });
  }

  /**
   * Calculate when to send the next email
   */
  private calculateNextSendTime(email: any): string {
    let sendTime = new Date();

    // Apply delay
    if (email.delay_hours > 0) {
      sendTime = addHours(sendTime, email.delay_hours);
    }
    if (email.delay_days > 0) {
      sendTime = addDays(sendTime, email.delay_days);
    }

    // Adjust to business hours
    sendTime = this.adjustToBusinessHours(sendTime);

    return sendTime.toISOString();
  }

  /**
   * Adjust send time to business hours
   */
  private adjustToBusinessHours(date: Date): Date {
    const hour = date.getHours();
    const dayOfWeek = date.getDay();

    // Skip weekends
    if (dayOfWeek === 0) {
      // Sunday -> Monday
      date.setDate(date.getDate() + 1);
    } else if (dayOfWeek === 6) {
      // Saturday -> Monday
      date.setDate(date.getDate() + 2);
    }

    // Adjust to business hours (9 AM - 5 PM)
    if (hour < 9) {
      date.setHours(9, 0, 0, 0);
    } else if (hour >= 17) {
      // After 5 PM -> Next day 9 AM
      date.setDate(date.getDate() + 1);
      date.setHours(9, 0, 0, 0);
      
      // Check if we moved to weekend
      return this.adjustToBusinessHours(date);
    }

    return date;
  }

  /**
   * Mark an enrollment as completed
   */
  private async completeEnrollment(enrollmentId: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('sequence_enrollments')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        next_send_at: null
      })
      .eq('id', enrollmentId);

    if (error) throw error;

    await this.logActivity(enrollmentId, 'sequence_completed', {});
  }

  /**
   * Log activity for audit trail
   */
  private async logActivity(
    enrollmentId: string,
    action: string,
    details: Record<string, any>
  ): Promise<void> {
    try {
      await supabaseAdmin
        .from('email_automation_logs')
        .insert({
          enrollment_id: enrollmentId,
          action,
          details
        });
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  }

  /**
   * Log error for debugging
   */
  private async logError(enrollmentId: string, error: any): Promise<void> {
    try {
      await supabaseAdmin
        .from('email_automation_logs')
        .insert({
          enrollment_id: enrollmentId,
          action: 'error',
          error_message: error instanceof Error ? error.message : 'Unknown error',
          details: {
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString()
          }
        });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
  }
}

// Export singleton instance
export const sequenceProcessor = new SequenceProcessor();