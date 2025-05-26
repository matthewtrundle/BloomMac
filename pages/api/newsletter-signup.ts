import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

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
  const welcomeHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Bloom Psychology Newsletter</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #6B21A8 0%, #A855F7 100%); padding: 40px 20px; text-align: center;">
          <img src="https://bloompsychologynorthaustin.com/images/Logo/logo.jpg" alt="Bloom Psychology" style="max-width: 150px; height: auto; margin-bottom: 20px; background: white; padding: 10px; border-radius: 8px;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Welcome to Our Newsletter!</h1>
          <p style="color: #E9D5FF; margin: 10px 0 0 0; font-size: 16px;">Weekly insights for mental wellness</p>
        </div>

        <!-- Main Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #6B21A8; margin-bottom: 20px; font-size: 20px;">
            ${subscriber.firstName ? `Hi ${subscriber.firstName}` : 'Hello'},
          </h2>
          
          <p style="margin-bottom: 20px; font-size: 16px; color: #4B5563;">
            Thank you for joining our mental health community! You're now subscribed to receive weekly insights, tips, and resources to support your wellness journey.
          </p>

          <div style="background-color: #F3F4F6; padding: 25px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #6B21A8; margin-top: 0; font-size: 18px;">What to expect:</h3>
            <ul style="margin: 15px 0; padding-left: 20px; color: #4B5563;">
              <li style="margin-bottom: 8px;">Weekly blog posts on mental health topics</li>
              <li style="margin-bottom: 8px;">Evidence-based wellness tips and strategies</li>
              <li style="margin-bottom: 8px;">Resources for women, mothers, and parents</li>
              <li style="margin-bottom: 8px;">Updates on our services and workshops</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://bloompsychologynorthaustin.com/blog" 
               style="display: inline-block; background-color: #A855F7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px;">
              Read Our Latest Blog Posts
            </a>
          </div>

          <p style="margin-bottom: 20px; font-size: 16px; color: #4B5563;">
            If you have any questions or topics you'd like us to cover, feel free to reply to this email. We love hearing from our community!
          </p>

          <p style="margin-bottom: 0; font-size: 16px; color: #4B5563;">
            Warm regards,<br>
            <strong style="color: #6B21A8;">Dr. Jana Rundle & The Bloom Psychology Team</strong>
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
          <div style="margin-bottom: 20px;">
            <p style="margin: 0; color: #6B7280; font-size: 14px;">
              <strong>Bloom Psychology</strong><br>
              13706 N Highway 183, Suite 114<br>
              Austin, TX 78750<br>
              (512) 898-9510
            </p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <a href="https://bloompsychologynorthaustin.com" style="color: #A855F7; text-decoration: none; margin: 0 10px;">Website</a>
            <a href="https://bloompsychologynorthaustin.com/book" style="color: #A855F7; text-decoration: none; margin: 0 10px;">Book Consultation</a>
            <a href="https://bloompsychologynorthaustin.com/contact" style="color: #A855F7; text-decoration: none; margin: 0 10px;">Contact</a>
          </div>
          
          <p style="margin: 0; color: #9CA3AF; font-size: 12px;">
            You're receiving this because you signed up for our newsletter. 
            <a href="mailto:jana@bloompsychologynorthaustin.com?subject=Unsubscribe" style="color: #9CA3AF;">Unsubscribe</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  await resend.emails.send({
    from: 'Bloom Psychology <noreply@bloompsychologynorthaustin.com>',
    to: subscriber.email,
    subject: 'Welcome to Bloom Psychology Newsletter 🌸',
    html: welcomeHtml,
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