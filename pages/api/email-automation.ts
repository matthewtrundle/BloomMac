import { Resend } from 'resend';
import { NextApiRequest, NextApiResponse } from 'next';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailSequenceData {
  email: string;
  name: string;
  sequenceType: 'contact_followup' | 'booking_confirmation' | 'lead_nurture';
  step: number;
  leadSource?: string;
  serviceInterest?: string;
}

const emailTemplates = {
  contact_followup: {
    1: {
      subject: "Thank you for reaching out to Bloom Psychology",
      content: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #f8e1e7; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
    .content { padding: 20px 0; }
    .cta-button { display: inline-block; background-color: #C63780; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
    .footer { margin-top: 30px; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: #4a3842; margin: 0;">Thank You for Reaching Out</h1>
    </div>
    
    <div class="content">
      <p>Hi {{name}},</p>
      
      <p>Thank you for contacting Bloom Psychology. We understand that reaching out for mental health support takes courage, and we're honored that you've chosen us.</p>
      
      <p>We've received your message and one of our licensed specialists will respond within 24 hours. In the meantime, you can:</p>
      
      <ul>
        <li>Browse our <a href="https://bloompsychologynorthaustin.com/blog">helpful resources</a></li>
        <li>Learn more about our <a href="https://bloompsychologynorthaustin.com/services">specialized services</a></li>
        <li>Schedule directly using our <a href="https://bloompsychologynorthaustin.com/book">online calendar</a></li>
      </ul>
      
      <div style="text-align: center;">
        <a href="https://bloompsychologynorthaustin.com/book" class="cta-button">Book Your Free Consultation</a>
      </div>
      
      <p>We offer same-week appointments and both virtual and in-person sessions to accommodate your needs.</p>
      
      <p>Warm regards,<br>
      The Bloom Psychology Team</p>
    </div>
    
    <div class="footer">
      <p>Bloom Psychology<br>
      13706 N Highway 183, Suite 114<br>
      Austin, TX 78750</p>
      
      <p>If you need immediate support, please contact the Crisis Text Line by texting HOME to 741741 or call 988 for the Suicide & Crisis Lifeline.</p>
    </div>
  </div>
</body>
</html>
      `
    },
    2: {
      subject: "Following up on your consultation request",
      content: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #f8e1e7; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
    .content { padding: 20px 0; }
    .cta-button { display: inline-block; background-color: #C63780; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: #4a3842; margin: 0;">Ready to Take the Next Step?</h1>
    </div>
    
    <div class="content">
      <p>Hi {{name}},</p>
      
      <p>We wanted to follow up on your recent inquiry about our therapy services. Sometimes taking that first step can feel overwhelming, and we're here to make it as easy as possible.</p>
      
      <p>Our free 15-minute consultation allows you to:</p>
      <ul>
        <li>Share what's bringing you to therapy</li>
        <li>Learn about our approach and services</li>
        <li>Ask any questions you might have</li>
        <li>Determine if we're a good fit for your needs</li>
      </ul>
      
      <div style="text-align: center;">
        <a href="https://bloompsychologynorthaustin.com/book" class="cta-button">Schedule Your Free Consultation</a>
      </div>
      
      <p>Remember, seeking support is a sign of strength, not weakness. We're here when you're ready.</p>
      
      <p>Best,<br>
      Dr. Jana Rundle & Team</p>
    </div>
  </div>
</body>
</html>
      `
    }
  },
  booking_confirmation: {
    1: {
      subject: "Your consultation is confirmed - What to expect",
      content: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #f8e1e7; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
    .content { padding: 20px 0; }
    .highlight-box { background-color: #f0f8ff; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #C63780; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: #4a3842; margin: 0;">Your Consultation is Confirmed!</h1>
    </div>
    
    <div class="content">
      <p>Hi {{name}},</p>
      
      <p>We're looking forward to speaking with you during your free consultation. Here's what to expect:</p>
      
      <div class="highlight-box">
        <h3 style="margin-top: 0;">Before Your Session:</h3>
        <ul>
          <li>Take a few minutes to think about what's bringing you to therapy</li>
          <li>Prepare any questions about our services or approach</li>
          <li>Find a quiet, private space for the call</li>
        </ul>
      </div>
      
      <p><strong>During the consultation:</strong></p>
      <ul>
        <li>We'll learn about your current situation and goals</li>
        <li>Discuss how we might be able to help</li>
        <li>Answer any questions you have about therapy</li>
        <li>Determine next steps if we're a good fit</li>
      </ul>
      
      <p>If you need to reschedule, please let us know at least 24 hours in advance.</p>
      
      <p>We're honored that you've chosen Bloom Psychology for your mental health journey.</p>
      
      <p>Warmly,<br>
      The Bloom Psychology Team</p>
    </div>
  </div>
</body>
</html>
      `
    }
  },
  lead_nurture: {
    1: {
      subject: "Thank you for downloading our resource",
      content: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #f8e1e7; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
    .content { padding: 20px 0; }
    .cta-button { display: inline-block; background-color: #C63780; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
    .footer { margin-top: 30px; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: #4a3842; margin: 0;">Thank You for Your Interest</h1>
    </div>
    
    <div class="content">
      <p>Hi {{name}},</p>
      
      <p>Thank you for downloading our resource! We hope you find it helpful on your journey.</p>
      
      <p>At Bloom Psychology, we understand that taking the first step toward getting support can feel overwhelming. You're already showing strength by seeking resources and information.</p>
      
      <p>If you have any questions about the resource or would like to discuss how therapy might help you, we're here for you.</p>
      
      <div style="text-align: center;">
        <a href="https://bloompsychologynorthaustin.com/book" class="cta-button">Schedule Your Free Consultation</a>
      </div>
      
      <p>Remember, seeking support is a sign of strength, not weakness.</p>
      
      <p>Take care,<br>
      Dr. Jana Rundle & Team</p>
    </div>
    
    <div class="footer">
      <p>Bloom Psychology<br>
      13706 N Highway 183, Suite 114<br>
      Austin, TX 78750</p>
    </div>
  </div>
</body>
</html>
      `
    }
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { email, name, sequenceType, step, leadSource, serviceInterest }: EmailSequenceData = req.body;

  if (!email || !name || !sequenceType || !step) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const template = emailTemplates[sequenceType]?.[step as keyof typeof emailTemplates[typeof sequenceType]];
    
    if (!template) {
      return res.status(400).json({ error: 'Invalid sequence type or step' });
    }

    // Replace template variables
    const emailContent = template.content.replace(/\{\{name\}\}/g, name);
    const subject = template.subject;

    const isDevMode = process.env.NODE_ENV === 'development';
    const emailTo = isDevMode ? 'matthewtrundle@gmail.com' : email;

    console.log(`Sending email automation: ${sequenceType} step ${step} to ${emailTo}`);

    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: emailTo,
      subject: `${isDevMode ? '[TEST] ' : ''}${subject}`,
      html: emailContent,
    });

    console.log('Email automation sent successfully:', data);
    return res.status(200).json({ success: true, data });

  } catch (error) {
    console.error('Email automation error:', error);
    return res.status(500).json({ error: 'Email send failed', details: error });
  }
}