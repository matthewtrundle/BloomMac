import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import { enhancedEmailTemplates, personalizeEmail } from '@/lib/email-templates/enhanced-emails';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle GET request to check configuration
  if (req.method === 'GET') {
    const configured = !!process.env.RESEND_API_KEY;
    return res.status(200).json({ 
      configured,
      message: configured ? 'Resend API is configured' : 'Resend API key is missing',
      apiKeyPrefix: configured ? process.env.RESEND_API_KEY?.substring(0, 7) + '...' : null
    });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { to, type = 'welcome', sequence, step } = req.body;

    if (!to || !to.includes('@')) {
      return res.status(400).json({ error: 'Valid email address is required' });
    }

    console.log(`Sending test ${type} email to:`, to);

    let emailData;

    // Handle enhanced email templates
    if (sequence && step) {
      const sequenceTemplates = enhancedEmailTemplates[sequence];
      if (!sequenceTemplates) {
        return res.status(400).json({ error: 'Invalid sequence type' });
      }

      const template = sequenceTemplates[step];
      if (!template) {
        return res.status(400).json({ error: 'Invalid step for sequence' });
      }

      const personalizedEmail = personalizeEmail(template, {
        firstName: 'Test User',
        name: 'Test User'
      });

      emailData = {
        from: 'Bloom Psychology <hello@bloompsychologynorthaustin.com>',
        to,
        subject: `[TEST] ${personalizedEmail.subject}`,
        html: personalizedEmail.content
      };
    } else {
      // Legacy test email types
      switch (type) {
        case 'welcome':
          const welcomeTemplate = enhancedEmailTemplates.newsletter.welcome;
          const personalizedWelcome = personalizeEmail(welcomeTemplate, {
            firstName: 'Test User',
            name: 'Test User'
          });
          emailData = {
            from: 'Bloom Psychology <hello@bloompsychologynorthaustin.com>',
            to,
            subject: `[TEST] ${personalizedWelcome.subject}`,
            html: personalizedWelcome.content
          };
          break;

        case 'contact':
          const contactTemplate = enhancedEmailTemplates.contactFollowup.immediate;
          const personalizedContact = personalizeEmail(contactTemplate, {
            firstName: 'Test User',
            name: 'Test User'
          });
          emailData = {
            from: 'Bloom Psychology <hello@bloompsychologynorthaustin.com>',
            to,
            subject: `[TEST] ${personalizedContact.subject}`,
            html: personalizedContact.content
          };
          break;

        case 'booking':
          const bookingTemplate = enhancedEmailTemplates.bookingConfirmation.confirmation;
          const personalizedBooking = personalizeEmail(bookingTemplate, {
            firstName: 'Test User',
            name: 'Test User',
            appointmentDetails: {
              date: 'Tomorrow, February 1st',
              time: '2:00 PM CST',
              format: 'Video Call'
            }
          });
          emailData = {
            from: 'Bloom Psychology <hello@bloompsychologynorthaustin.com>',
            to,
            subject: `[TEST] ${personalizedBooking.subject}`,
            html: personalizedBooking.content
          };
          break;

        case 'nurture':
          const nurtureTemplate = enhancedEmailTemplates.leadNurture.thankYou;
          const personalizedNurture = personalizeEmail(nurtureTemplate, {
            firstName: 'Test User',
            name: 'Test User',
            resourceName: 'Anxiety Management Guide'
          });
          emailData = {
            from: 'Bloom Psychology <hello@bloompsychologynorthaustin.com>',
            to,
            subject: `[TEST] ${personalizedNurture.subject}`,
            html: personalizedNurture.content
          };
          break;

        // Legacy cases for backward compatibility
        case 'newsletter':
          emailData = {
            from: 'Dr. Jana Rundle <jana@bloompsychologynorthaustin.com>',
            to,
            subject: '[TEST] Weekly Wellness Insights from Bloom Psychology',
            html: `
              <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
                <h1 style="color: #6B3654;">This Week's Wellness Insight</h1>
                <p>This is a test newsletter email. In a real newsletter, this would contain:</p>
                <ul>
                  <li>Weekly mental health tips</li>
                  <li>Featured blog posts</li>
                  <li>Upcoming workshops or groups</li>
                  <li>Inspirational quotes or exercises</li>
                </ul>
                <p style="margin-top: 30px;">
                  <a href="https://bloompsychologynorthaustin.com/blog" 
                     style="background: #C06B93; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
                    Read More on Our Blog
                  </a>
                </p>
              </div>
            `
          };
          break;

        case 'appointment':
          emailData = {
            from: 'Bloom Psychology <noreply@bloompsychologynorthaustin.com>',
            to,
            subject: '[TEST] Appointment Reminder - Bloom Psychology',
            html: `
              <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
                <h2 style="color: #6B3654;">Appointment Reminder</h2>
                <p>This is a test appointment reminder email.</p>
                <div style="background: #FDF5F9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p><strong>Date:</strong> Tomorrow, January 15, 2024</p>
                  <p><strong>Time:</strong> 2:00 PM CST</p>
                  <p><strong>Provider:</strong> Dr. Jana Rundle</p>
                  <p><strong>Type:</strong> Individual Therapy Session</p>
                  <p><strong>Location:</strong> Telehealth (link will be sent 15 minutes before)</p>
                </div>
                <p>If you need to reschedule, please let us know at least 24 hours in advance.</p>
                <p>Looking forward to seeing you!</p>
              </div>
            `
          };
          break;

        default:
          return res.status(400).json({ error: 'Invalid email type' });
      }
    }

    const result = await resend.emails.send(emailData);

    console.log('Test email sent successfully:', result);

    return res.status(200).json({ 
      success: true, 
      message: `Test ${type} email sent successfully to ${to}`,
      id: result.id
    });

  } catch (error) {
    console.error('Error sending test email:', error);
    return res.status(500).json({ 
      error: 'Failed to send test email', 
      details: error instanceof Error ? error.message : 'Unknown error',
      apiKeyPresent: !!process.env.RESEND_API_KEY
    });
  }
}