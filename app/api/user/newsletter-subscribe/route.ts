import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getResendClient } from '@/lib/resend-client';
import { enrollmentManager } from '@/lib/email-automation/enrollment-manager';

// Send welcome email to new subscriber
async function sendWelcomeEmail(subscriber: any, isReactivated: boolean = false) {
  const firstName = subscriber.first_name || 'Friend';
  
  try {
    // Validate email before attempting to send
    if (!subscriber.email || typeof subscriber.email !== 'string' || !subscriber.email.includes('@')) {
      console.error('Invalid subscriber email:', subscriber.email);
      return;
    }
    
    // Get the appropriate email template from database
    const templateName = isReactivated ? 'Newsletter Welcome Back' : 'Newsletter Welcome';
    const { data: template, error: templateError } = await supabaseAdmin
      .from('email_templates')
      .select('*')
      .eq('name', templateName)
      .single();
    
    if (templateError || !template) {
      console.error(`Failed to fetch ${templateName} template:`, templateError);
      return;
    }
    
    // Replace variables in the template
    let emailContent = template.content;
    let emailSubject = template.subject;
    
    // Replace {{firstName}} with actual value
    emailContent = emailContent.replace(/\{\{firstName\}\}/g, firstName);
    emailSubject = emailSubject.replace(/\{\{firstName\}\}/g, firstName);
    
    const resend = getResendClient();
    if (!resend) {
      console.error('Resend client not initialized - skipping welcome email');
      return;
    }
    
    await resend.emails.send({
      from: 'Dr. Jana Rundle <jana@bloompsychologynorthaustin.com>',
      to: subscriber.email,
      subject: emailSubject,
      html: emailContent,
      tags: [
        { name: 'sequence', value: 'newsletter' },
        { name: 'step', value: isReactivated ? 'welcome_back' : 'welcome' },
        { name: 'template_id', value: template.id }
      ]
    });
    console.log(`${isReactivated ? 'Welcome back' : 'Welcome'} email sent to:`, subscriber.email);
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    // Don't throw - we still want to save the subscriber even if email fails
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName } = body;

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
        
        // Send welcome back email for reactivated subscribers
        await sendWelcomeEmail(reactivated, true);
        
        // Enroll in email sequences
        await enrollmentManager.enrollSubscriber({
          subscriberId: reactivated.id,
          trigger: 'newsletter_signup',
          source: 'profile_settings_reactivation',
          metadata: {
            reactivated: true,
            previous_status: existingSubscriber.status
          }
        });
        
        return NextResponse.json({
          success: true,
          message: 'Welcome back! You\'ve been resubscribed to our newsletter.',
          isSubscribed: true
        });
      }
    }

    // Create new subscriber
    const { data: subscriber, error: insertError } = await supabaseAdmin
      .from('subscribers')
      .insert({
        email: email.toLowerCase(),
        first_name: firstName,
        last_name: lastName,
        status: 'active',
        signup_source: 'profile_settings',
        confirmed: true
      })
      .select()
      .single();
    
    if (insertError) {
      throw insertError;
    }

    // Send welcome email for new subscribers
    await sendWelcomeEmail(subscriber, false);

    // Enroll in email sequences
    await enrollmentManager.enrollSubscriber({
      subscriberId: subscriber.id,
      trigger: 'newsletter_signup',
      source: 'profile_settings',
      metadata: {
        new_subscriber: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      isSubscribed: true
    });

  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    
    // Always return valid JSON
    return NextResponse.json(
      { 
        error: 'Failed to subscribe to newsletter',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}