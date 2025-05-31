import { Resend } from 'resend';
import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabase';

// Log API key presence (truncated for security)
console.log('API key loaded:', process.env.RESEND_API_KEY ?
  `${process.env.RESEND_API_KEY.substring(0, 3)}...${process.env.RESEND_API_KEY.substring(process.env.RESEND_API_KEY.length - 3)}` :
  'undefined/missing');

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }
  
  // Extract form data
  const { name, email, message, firstName, lastName, phone, service } = req.body;
  
  // Validate required fields
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
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

      const data = await resend.emails.send({
        from: 'Dr. Jana Rundle <jana@bloompsychologynorthaustin.com>',
        to: emailTo,
        cc: emailCC,
        subject: `${isDevMode ? '[TEST] ' : ''}New contact from ${displayName}`,
        html: emailContent,
      });

      console.log('Email sent successfully:', data);
      
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
