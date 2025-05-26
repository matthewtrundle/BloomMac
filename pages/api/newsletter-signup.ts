import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import { welcomeEmailTemplate } from '@/lib/email-templates/welcome';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface NewsletterSubscriber {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  signupSource: 'banner' | 'landing_page' | 'footer' | 'popup' | 'other';
  interests: string[];
  timestamp: string;
  status: 'active' | 'unsubscribed' | 'pending';
  confirmed: boolean;
  ipAddress?: string;
  userAgent?: string;
}

// In-memory storage for this implementation
// In production, you would use a database
let newsletterSubscribers: NewsletterSubscriber[] = [];

interface SignupRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  source?: string;
  interests?: string[];
}

interface SignupResponse {
  success: boolean;
  message: string;
  subscriberId?: string;
}

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<SignupResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email, firstName, lastName, source = 'other', interests = [] }: SignupRequest = req.body;

    // Validate email
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address is required' });
    }

    // Check if email already exists
    const existingSubscriber = newsletterSubscribers.find(sub => sub.email.toLowerCase() === email.toLowerCase());
    
    if (existingSubscriber) {
      if (existingSubscriber.status === 'active') {
        return res.status(200).json({
          success: true,
          message: 'You\'re already subscribed to our newsletter! Thank you for your continued interest.',
          subscriberId: existingSubscriber.id
        });
      } else if (existingSubscriber.status === 'unsubscribed') {
        // Reactivate the subscription
        existingSubscriber.status = 'active';
        existingSubscriber.timestamp = new Date().toISOString();
        existingSubscriber.signupSource = source as any;
        
        return res.status(200).json({
          success: true,
          message: 'Welcome back! Your newsletter subscription has been reactivated.',
          subscriberId: existingSubscriber.id
        });
      }
    }

    // Create new subscriber
    const subscriberId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    const newSubscriber: NewsletterSubscriber = {
      id: subscriberId,
      email: email.toLowerCase().trim(),
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      signupSource: source as any,
      interests: interests || ['mental-health', 'postpartum-support'],
      timestamp: new Date().toISOString(),
      status: 'active',
      confirmed: true, // Auto-confirm for now
      ipAddress: req.headers['x-forwarded-for'] as string || req.connection.remoteAddress,
      userAgent: req.headers['user-agent']
    };

    newsletterSubscribers.push(newSubscriber);

    // Send welcome email
    try {
      await sendWelcomeEmail(newSubscriber);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the signup if email fails
    }

    // Send notification email to admin
    try {
      await sendAdminNotification(newSubscriber);
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError);
      // Don't fail the signup if notification fails
    }

    console.log('Newsletter signup successful:', {
      email: newSubscriber.email,
      source: newSubscriber.signupSource,
      subscriberId: newSubscriber.id
    });

    return res.status(200).json({
      success: true,
      message: 'Thank you for subscribing! You\'ll receive weekly insights on mental health and wellness.',
      subscriberId: newSubscriber.id
    });

  } catch (error) {
    console.error('Newsletter signup error:', error);
    return res.status(500).json({ error: 'Failed to process newsletter signup' });
  }
}

const sendWelcomeEmail = async (subscriber: NewsletterSubscriber) => {
  const { subject, html, text } = welcomeEmailTemplate(subscriber.firstName || '');
  
  await resend.emails.send({
    from: 'Bloom Psychology <noreply@bloompsychologynorthaustin.com>',
    to: subscriber.email,
    subject,
    html,
    text
  });
};

const sendAdminNotification = async (subscriber: NewsletterSubscriber) => {
  const notificationHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Newsletter Subscriber</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #6B21A8 0%, #A855F7 100%); padding: 30px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">🎉 New Newsletter Subscriber!</h1>
        </div>

        <!-- Main Content -->
        <div style="padding: 30px;">
          <h2 style="color: #6B21A8; margin-bottom: 20px; font-size: 20px;">
            You have a new newsletter subscriber!
          </h2>
          
          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #6B21A8; margin-top: 0; font-size: 16px;">Subscriber Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #4B5563; font-weight: 600;">Email:</td>
                <td style="padding: 8px 0; color: #4B5563;">${subscriber.email}</td>
              </tr>
              ${subscriber.firstName ? `
              <tr>
                <td style="padding: 8px 0; color: #4B5563; font-weight: 600;">First Name:</td>
                <td style="padding: 8px 0; color: #4B5563;">${subscriber.firstName}</td>
              </tr>
              ` : ''}
              ${subscriber.lastName ? `
              <tr>
                <td style="padding: 8px 0; color: #4B5563; font-weight: 600;">Last Name:</td>
                <td style="padding: 8px 0; color: #4B5563;">${subscriber.lastName}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; color: #4B5563; font-weight: 600;">Signup Source:</td>
                <td style="padding: 8px 0; color: #4B5563;">${subscriber.signupSource}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #4B5563; font-weight: 600;">Interests:</td>
                <td style="padding: 8px 0; color: #4B5563;">${subscriber.interests.join(', ')}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #4B5563; font-weight: 600;">Date/Time:</td>
                <td style="padding: 8px 0; color: #4B5563;">${new Date(subscriber.timestamp).toLocaleString('en-US', { 
                  timeZone: 'America/Chicago',
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #4B5563; font-weight: 600;">Subscriber ID:</td>
                <td style="padding: 8px 0; color: #4B5563; font-family: monospace; font-size: 12px;">${subscriber.id}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #F0F9FF; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3B82F6;">
            <h4 style="color: #1E40AF; margin-top: 0; margin-bottom: 10px; font-size: 16px;">📊 Quick Stats:</h4>
            <p style="margin: 5px 0; color: #1E40AF;">
              Total Active Subscribers: <strong>${newsletterSubscribers.filter(s => s.status === 'active').length}</strong>
            </p>
            <p style="margin: 5px 0; color: #1E40AF;">
              Subscribers Today: <strong>${newsletterSubscribers.filter(s => 
                new Date(s.timestamp).toDateString() === new Date().toDateString()
              ).length}</strong>
            </p>
            <p style="margin: 5px 0; color: #1E40AF;">
              This Week: <strong>${newsletterSubscribers.filter(s => {
                const subDate = new Date(s.timestamp);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return subDate > weekAgo;
              }).length}</strong>
            </p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
            <p style="color: #6B7280; font-size: 14px; margin: 0;">
              This is an automated notification. The subscriber has already received a welcome email.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #F9FAFB; padding: 20px; text-align: center; border-top: 1px solid #E5E7EB;">
          <p style="margin: 0; color: #9CA3AF; font-size: 12px;">
            Bloom Psychology Newsletter System<br>
            <a href="https://bloompsychologynorthaustin.com/admin/newsletter" style="color: #A855F7;">View All Subscribers</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Send notification to admin email
  await resend.emails.send({
    from: 'Bloom Newsletter System <noreply@bloompsychologynorthaustin.com>',
    to: 'jana@bloompsychologynorthaustin.com',
    subject: `🎉 New Newsletter Subscriber: ${subscriber.email}`,
    html: notificationHtml,
  });
};

// Export function to get subscribers for admin use
export const getNewsletterSubscribers = (): NewsletterSubscriber[] => {
  return newsletterSubscribers;
};

// Export function to send newsletter to all subscribers
export const sendNewsletter = async (subject: string, content: string): Promise<{ sent: number; failed: number }> => {
  const activeSubscribers = newsletterSubscribers.filter(sub => sub.status === 'active');
  let sent = 0;
  let failed = 0;

  for (const subscriber of activeSubscribers) {
    try {
      await resend.emails.send({
        from: 'Dr. Jana Rundle <jana@bloompsychologynorthaustin.com>',
        to: subscriber.email,
        subject: subject,
        html: content,
      });
      sent++;
    } catch (error) {
      console.error(`Failed to send newsletter to ${subscriber.email}:`, error);
      failed++;
    }
  }

  return { sent, failed };
};