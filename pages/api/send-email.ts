import { Resend } from 'resend';
import { NextApiRequest, NextApiResponse } from 'next';

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
    
    await resend.emails.send({
      from: 'onboarding@resend.dev', // Will need to change to verified domain later
      to: 'jana@bloompsychologynorthaustin.com',
      cc: ['matt@bloompsychologynorthaustin.com'],
      subject: `New contact from ${displayName}`,
      html: emailContent,
    });
    
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Email send failed' });
  }
}
