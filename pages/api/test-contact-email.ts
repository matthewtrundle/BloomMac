import { Resend } from 'resend';
import { NextApiRequest, NextApiResponse } from 'next';

// Log API key presence (truncated for security)
console.log('API key loaded:', process.env.RESEND_API_KEY ? 
  `${process.env.RESEND_API_KEY.substring(0, 3)}...${process.env.RESEND_API_KEY.substring(process.env.RESEND_API_KEY.length - 3)}` : 
  'undefined/missing');

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('Test contact email endpoint called');
    
    // Create a test contact submission
    const testData = {
      firstName: 'Test',
      lastName: 'Contact',
      email: 'test@example.com',
      phone: '555-123-4567',
      service: 'women',
      message: 'This is a test message from the contact form.'
    };
    
    // In test mode, all emails go to the developer
    const to = 'matthewtrundle@gmail.com';
    
    console.log('Attempting to send test contact email to:', to);
    
    // Create a stylized HTML email using the same template from send-email.ts
    const displayName = testData.firstName && testData.lastName 
      ? `${testData.firstName} ${testData.lastName}` 
      : testData.firstName || testData.lastName || 'Anonymous';
      
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
      <p>From: Contact Page (TEST)</p>
    </div>
    
    <table cellpadding="5" cellspacing="0" border="0" width="100%">
      <tr>
        <td class="field-name">Name:</td>
        <td>${displayName}</td>
      </tr>
      <tr>
        <td class="field-name">Email:</td>
        <td>${testData.email}</td>
      </tr>
      <tr>
        <td class="field-name">Phone:</td>
        <td>${testData.phone}</td>
      </tr>
      <tr>
        <td class="field-name">Service:</td>
        <td>${testData.service}</td>
      </tr>
      <tr>
        <td class="field-name">Message:</td>
        <td>
          <div class="message-content">${testData.message.replace(/\n/g, '<br>')}</div>
        </td>
      </tr>
    </table>
    
    <div class="footer">
      <p>This is a TEST email sent automatically from your Bloom Psychology website.</p>
    </div>
  </div>
</body>
</html>
    `;
    
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: to,
      subject: '[TEST] New contact from Test Contact',
      html: emailContent,
    });
    
    console.log('Test contact email sent successfully:', data);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Test contact email sent successfully',
      to: to,
      data: data 
    });
  } catch (error) {
    console.error('Error sending test contact email:', error);
    return res.status(500).json({ 
      error: 'Email send failed', 
      details: error,
      apiKeyPresent: !!process.env.RESEND_API_KEY
    });
  }
}