import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import { welcomeEmailTemplate } from '@/lib/email-templates/welcome';

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
    const { to, type = 'welcome' } = req.body;

    if (!to || !to.includes('@')) {
      return res.status(400).json({ error: 'Valid email address is required' });
    }

    console.log(`Sending test ${type} email to:`, to);

    let emailData;

    switch (type) {
      case 'welcome':
        const { subject, html, text } = welcomeEmailTemplate('Test User');
        emailData = {
          from: 'Bloom Psychology <noreply@bloompsychologynorthaustin.com>',
          to,
          subject: `[TEST] ${subject}`,
          html,
          text
        };
        break;

      case 'contact':
        emailData = {
          from: 'Bloom Psychology <noreply@bloompsychologynorthaustin.com>',
          to,
          subject: '[TEST] New Contact Form Submission',
          html: `
            <h2>Test Contact Form Submission</h2>
            <p>This is a test of the contact form notification email.</p>
            <hr>
            <p><strong>Name:</strong> Test User</p>
            <p><strong>Email:</strong> test@example.com</p>
            <p><strong>Phone:</strong> (512) 555-0123</p>
            <p><strong>Service Interest:</strong> Anxiety & Stress Management</p>
            <p><strong>Message:</strong> This is a test message to verify email functionality.</p>
            <hr>
            <p><em>Sent from Bloom Psychology website</em></p>
          `
        };
        break;

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