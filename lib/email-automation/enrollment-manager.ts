import { supabaseAdmin } from '@/lib/supabase';
import { addHours, addDays } from 'date-fns';

export interface EnrollmentOptions {
  subscriberId: string;
  trigger: string;
  source: string;
  metadata?: Record<string, any>;
}

export interface SequenceEmail {
  id: string;
  sequence_id: string;
  position: number;
  delay_hours: number;
  delay_days: number;
  email_template_id: string;
}

export class EnrollmentManager {
  /**
   * Enroll a subscriber in all active sequences matching the trigger
   */
  async enrollSubscriber({
    subscriberId,
    trigger,
    source,
    metadata = {}
  }: EnrollmentOptions): Promise<{ success: boolean; enrollments: any[]; errors: any[] }> {
    const enrollments: any[] = [];
    const errors: any[] = [];

    try {
      // Find all active sequences for this trigger
      const { data: sequences, error: sequenceError } = await supabaseAdmin
        .from('email_sequences')
        .select('*')
        .eq('trigger', trigger)
        .eq('status', 'active');

      if (sequenceError) {
        throw new Error(`Failed to fetch sequences: ${sequenceError.message}`);
      }

      if (!sequences || sequences.length === 0) {
        console.log(`No active sequences found for trigger: ${trigger}`);
        return { success: true, enrollments: [], errors: [] };
      }

      // Process each matching sequence
      for (const sequence of sequences) {
        try {
          const enrollment = await this.enrollInSequence({
            subscriberId,
            sequenceId: sequence.id,
            source,
            metadata: {
              ...metadata,
              trigger,
              sequence_name: sequence.name
            }
          });

          if (enrollment) {
            enrollments.push(enrollment);
            console.log(`✅ Enrolled subscriber ${subscriberId} in sequence: ${sequence.name}`);
          }
        } catch (error) {
          console.error(`Failed to enroll in sequence ${sequence.name}:`, error);
          errors.push({
            sequence_id: sequence.id,
            sequence_name: sequence.name,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      // Log the enrollment activity
      await this.logEnrollmentActivity({
        subscriber_id: subscriberId,
        action: 'bulk_enrollment',
        details: {
          trigger,
          source,
          enrolled_count: enrollments.length,
          error_count: errors.length,
          sequences: enrollments.map(e => e.sequence_name)
        }
      });

      return {
        success: errors.length === 0,
        enrollments,
        errors
      };

    } catch (error) {
      console.error('EnrollmentManager error:', error);
      return {
        success: false,
        enrollments: [],
        errors: [{
          error: error instanceof Error ? error.message : 'Unknown error'
        }]
      };
    }
  }

  /**
   * Enroll a subscriber in a specific sequence
   */
  private async enrollInSequence({
    subscriberId,
    sequenceId,
    source,
    metadata
  }: {
    subscriberId: string;
    sequenceId: string;
    source: string;
    metadata: Record<string, any>;
  }): Promise<any> {
    // Check if already enrolled and active
    const { data: existingEnrollment } = await supabaseAdmin
      .from('sequence_enrollments')
      .select('id, status')
      .eq('subscriber_id', subscriberId)
      .eq('sequence_id', sequenceId)
      .eq('status', 'active')
      .single();

    if (existingEnrollment) {
      console.log(`Subscriber already actively enrolled in sequence ${sequenceId}`);
      return null;
    }

    // Get the first email in the sequence
    const { data: firstEmail, error: emailError } = await supabaseAdmin
      .from('sequence_emails')
      .select('*')
      .eq('sequence_id', sequenceId)
      .eq('position', 1)
      .single();

    if (emailError || !firstEmail) {
      throw new Error(`No emails found for sequence ${sequenceId}`);
    }

    // Calculate when to send the first email
    const nextSendAt = this.calculateNextSendTime(firstEmail);

    // Create the enrollment
    const { data: enrollment, error: enrollmentError } = await supabaseAdmin
      .from('sequence_enrollments')
      .insert({
        subscriber_id: subscriberId,
        sequence_id: sequenceId,
        enrollment_source: source,
        status: 'active',
        current_position: 0,
        next_send_at: nextSendAt,
        metadata
      })
      .select()
      .single();

    if (enrollmentError) {
      throw enrollmentError;
    }

    // Log the enrollment
    await this.logEnrollmentActivity({
      enrollment_id: enrollment.id,
      subscriber_id: subscriberId,
      action: 'enrolled',
      details: {
        sequence_id: sequenceId,
        source,
        first_email_scheduled: nextSendAt
      }
    });

    return {
      ...enrollment,
      sequence_name: metadata.sequence_name
    };
  }

  /**
   * Calculate when to send an email based on its delay settings
   */
  private calculateNextSendTime(email: SequenceEmail): string {
    let sendTime = new Date();

    // Apply delay
    if (email.delay_hours > 0) {
      sendTime = addHours(sendTime, email.delay_hours);
    }
    if (email.delay_days > 0) {
      sendTime = addDays(sendTime, email.delay_days);
    }

    // If no delay, send in 5 minutes to allow for processing
    if (email.delay_hours === 0 && email.delay_days === 0) {
      sendTime = addHours(sendTime, 0.083); // 5 minutes
    }

    // Adjust to business hours (9 AM - 5 PM CST)
    sendTime = this.adjustToBusinessHours(sendTime);

    return sendTime.toISOString();
  }

  /**
   * Adjust send time to fall within business hours
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
   * Log enrollment activity for audit trail
   */
  private async logEnrollmentActivity({
    enrollment_id,
    subscriber_id,
    action,
    details
  }: {
    enrollment_id?: string;
    subscriber_id?: string;
    action: string;
    details: Record<string, any>;
  }): Promise<void> {
    try {
      await supabaseAdmin
        .from('email_automation_logs')
        .insert({
          enrollment_id,
          action,
          details: {
            ...details,
            subscriber_id,
            timestamp: new Date().toISOString()
          }
        });
    } catch (error) {
      console.error('Failed to log enrollment activity:', error);
      // Don't throw - logging failures shouldn't break the main flow
    }
  }

  /**
   * Pause an enrollment
   */
  async pauseEnrollment(enrollmentId: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('sequence_enrollments')
      .update({
        status: 'paused',
        paused_at: new Date().toISOString()
      })
      .eq('id', enrollmentId);

    if (error) throw error;

    await this.logEnrollmentActivity({
      enrollment_id: enrollmentId,
      action: 'paused',
      details: {}
    });
  }

  /**
   * Resume a paused enrollment
   */
  async resumeEnrollment(enrollmentId: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('sequence_enrollments')
      .update({
        status: 'active',
        paused_at: null
      })
      .eq('id', enrollmentId);

    if (error) throw error;

    await this.logEnrollmentActivity({
      enrollment_id: enrollmentId,
      action: 'resumed',
      details: {}
    });
  }

  /**
   * Unsubscribe from a specific enrollment
   */
  async unsubscribeEnrollment(enrollmentId: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('sequence_enrollments')
      .update({
        status: 'unsubscribed'
      })
      .eq('id', enrollmentId);

    if (error) throw error;

    await this.logEnrollmentActivity({
      enrollment_id: enrollmentId,
      action: 'unsubscribed',
      details: {}
    });
  }

  /**
   * Unsubscribe a subscriber from all active enrollments
   */
  async unsubscribeAll(subscriberId: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('sequence_enrollments')
      .update({
        status: 'unsubscribed'
      })
      .eq('subscriber_id', subscriberId)
      .eq('status', 'active');

    if (error) throw error;

    await this.logEnrollmentActivity({
      subscriber_id: subscriberId,
      action: 'unsubscribed_all',
      details: {}
    });
  }
}

// Export a singleton instance
export const enrollmentManager = new EnrollmentManager();