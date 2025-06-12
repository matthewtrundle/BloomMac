import { Resend } from 'resend';
import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabase';

// Lazy-load Resend client to avoid initialization errors
let resend: Resend | null = null;

function getResendClient() {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      console.warn('[send-email] RESEND_API_KEY not found in environment');
      return null;
    }
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }
  
  // Extract form data
  const { name, email, message, firstName, lastName, phone, service } = req.body;
  
  // Validate required fields
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' });
  }
  
  try {
    // Determine which form the submission came from
    const formSource = req.headers.referer?.includes('postpartum-start') 
      ? 'Postpartum Landing Page' 
      : 'Contact Page';
    
    // Build email content based on available fields
    const displayName = name || (firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || 'Anonymous');
    
    // Create a more stylized HTML email
    const emailContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #f8e1e7; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
    .header h1 { color: #4a3842; margin: 0; }
    .field { margin-bottom: 10px; }
    .field-name { font-weight: bold; width: 120px; vertical-align: top; }
    .message-content { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 5px; }
    .footer { margin-top: 30px; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Contact Form Submission</h1>
      <p>From: ${formSource}</p>
    </div>
    
    <table cellpadding="5" cellspacing="0" border="0" width="100%">
      <tr>
        <td class="field-name">Name:</td>
        <td>${displayName}</td>
      </tr>
      <tr>
        <td class="field-name">Email:</td>
        <td>${email}</td>
      </tr>
      ${phone ? `
      <tr>
        <td class="field-name">Phone:</td>
        <td>${phone}</td>
      </tr>
      ` : ''}
      ${service ? `
      <tr>
        <td class="field-name">Service:</td>
        <td>${service}</td>
      </tr>
      ` : ''}
      ${message ? `
      <tr>
        <td class="field-name">Message:</td>
        <td>
          <div class="message-content">${message.replace(/\n/g, '<br>')}</div>
        </td>
      </tr>
      ` : ''}
    </table>
    
    <div class="footer">
      <p>This email was sent automatically from your Bloom Psychology website.</p>
    </div>
  </div>
</body>
</html>
    `;
    
    const isDevMode = process.env.NODE_ENV === 'development';
    const emailTo = isDevMode ? 'matthewtrundle@gmail.com' : 'jana@bloompsychologynorthaustin.com';
    const emailCC = isDevMode ? [] : ['matt@bloompsychologynorthaustin.com'];

    console.log('Attempting to send email to:', emailTo, isDevMode ? '(development mode)' : '');

    try {
      // Use the variables defined above

      const client = getResendClient();
      if (!client) {
        throw new Error('Email service not configured');
      }
      
      const data = await client.emails.send({
        from: 'Dr. Jana Rundle <jana@bloompsychologynorthaustin.com>',
        to: emailTo,
        cc: emailCC,
        subject: `${isDevMode ? '[TEST] ' : ''}New contact from ${displayName}`,
        html: emailContent,
      });

      console.log('Email sent successfully:', data);

      // Get custom email template from database
      let confirmationEmailContent = '';
      let confirmationSubject = 'Thank you for contacting Bloom Psychology North Austin';
      
      try {
        console.log('Fetching custom contact template...');
        const { data: customTemplate, error: templateError } = await supabaseAdmin
          .from('email_templates_custom')
          .select('subject, content')
          .eq('sequence', 'contactFollowup')
          .eq('step', 'immediate')
          .single();
          
        if (templateError) {
          console.error('Template query error:', templateError);
        } else if (customTemplate) {
          console.log('Custom template found, using it');
          confirmationSubject = customTemplate.subject;
          // Replace firstName placeholder with the actual name
          const userFirstName = firstName || name?.split(' ')[0] || displayName.split(' ')[0] || 'there';
          confirmationEmailContent = customTemplate.content.replace(/\{\{firstName\}\}/g, userFirstName);
        } else {
          console.log('No custom template returned from query');
        }
      } catch (templateError) {
        console.error('Template fetch error:', templateError);
      }
      
      // Fallback to default template if no custom template exists
      if (!confirmationEmailContent) {
        confirmationEmailContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #f8e1e7; padding: 20px; border-radius: 8px; margin-bottom: 25px; text-align: center; }
    .header h1 { color: #4a3842; margin: 0; font-size: 24px; }
    .content { padding: 20px 0; }
    .footer { margin-top: 30px; font-size: 14px; color: #666; border-top: 1px solid #eee; padding-top: 15px; }
    .highlight { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0; }
    .cta { text-align: center; margin: 25px 0; }
    .cta a { background-color: #d1477a; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thank You for Contacting Bloom Psychology</h1>
    </div>
    
    <div class="content">
      <p>Dear ${displayName},</p>
      
      <p>Thank you for reaching out to Bloom Psychology North Austin. We have received your message and appreciate you taking the time to contact us.</p>
      
      <div class="highlight">
        <p><strong>What happens next:</strong></p>
        <ul>
          <li>Dr. Jana Rundle will personally review your message</li>
          <li>We typically respond within 1-2 business days</li>
          <li>If you're seeking therapy services, we'll discuss how we can best support you</li>
          <li>For urgent mental health concerns, please call 988 (Suicide & Crisis Lifeline) or visit your nearest emergency room</li>
        </ul>
      </div>
      
      <p>In the meantime, feel free to explore our resources on postpartum mental health, anxiety, and wellness at <a href="https://www.bloompsychologynorthaustin.com">bloompsychologynorthaustin.com</a>.</p>
      
      <div class="cta">
        <a href="https://www.bloompsychologynorthaustin.com/blog">Read Our Blog</a>
      </div>
      
      <p>We look forward to connecting with you soon.</p>
      
      <p>Warm regards,<br>
      Dr. Jana Rundle, LCP<br>
      Bloom Psychology North Austin</p>
    </div>
    
    <div class="footer">
      <p><strong>Bloom Psychology North Austin</strong><br>
      Specializing in Maternal Mental Health & Women's Wellness<br>
      Website: <a href="https://www.bloompsychologynorthaustin.com">bloompsychologynorthaustin.com</a><br>
      Email: jana@bloompsychologynorthaustin.com</p>
      
      <p style="font-size: 12px; color: #999; margin-top: 15px;">
      This is an automated confirmation email. Please do not reply to this message. 
      If you have additional questions, please use our contact form or call our office directly.
      </p>
    </div>
  </div>
</body>
</html>
        `;
      }

      try {
        const confirmationData = await client.emails.send({
          from: 'Dr. Jana Rundle <jana@bloompsychologynorthaustin.com>',
          to: email, // Send to the person who submitted the form
          subject: confirmationSubject,
          html: confirmationEmailContent,
        });
        
        console.log('Confirmation email sent successfully:', confirmationData);
      } catch (confirmationError) {
        console.error('Error sending confirmation email:', confirmationError);
        // Don't fail the main request if confirmation email fails
      }
      
      // Save contact submission to Supabase
      try {
        const contactData = {
          name: displayName,
          email,
          phone: phone || null,
          service: service || null,
          message: message || null,
          source: formSource.toLowerCase().replace(/ /g, '_'),
          page: req.headers.referer || 'unknown'
        };
        
        const { error: dbError } = await supabaseAdmin
          .from('contact_submissions')
          .insert(contactData);
          
        if (dbError) {
          console.error('Error saving to database:', dbError);
          // Don't fail the whole request if DB save fails
        } else {
          console.log('Contact submission saved to database');
        }
        
        // Also track as analytics event
        await supabaseAdmin
          .from('analytics_events')
          .insert({
            type: 'contact_form',
            page: req.headers.referer || '/contact',
            data: { 
              source: formSource,
              service: service || null
            }
          });
          
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Continue even if DB operations fail
      }
      
      return res.status(200).json({ success: true, data });
    } catch (error) {
      console.error('Resend API error:', error);
      return res.status(500).json({ error: 'Email send failed', details: error });
    }
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Email send failed' });
  }
}
