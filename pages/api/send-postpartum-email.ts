import { Resend } from 'resend';
import { NextApiRequest, NextApiResponse } from 'next';

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
  const { name, email, phone, message } = req.body;
  
  // Validate required fields
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  
  try {
    // Create a stylized HTML email
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
      <h1>New Postpartum Support Lead</h1>
      <p>From: Postpartum Landing Page</p>
    </div>
    
    <table cellpadding="5" cellspacing="0" border="0" width="100%">
      <tr>
        <td class="field-name">Name:</td>
        <td>${name || 'Not provided'}</td>
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
      <p>This email was sent automatically from your Bloom Psychology website's postpartum landing page.</p>
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
        subject: `${isDevMode ? '[TEST] ' : ''}New postpartum support lead from ${name || 'Website Visitor'}`,
        html: emailContent,
      });
      
      console.log('Email sent successfully:', data);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      console.error('Resend API error:', error);
      return res.status(500).json({ error: 'Email send failed', details: error });
    }
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}