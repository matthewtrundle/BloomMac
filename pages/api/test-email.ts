import { Resend } from 'resend';
import { NextApiRequest, NextApiResponse } from 'next';

// Log API key presence (truncated for security)
console.log('API key loaded:', process.env.RESEND_API_KEY ? 
  `${process.env.RESEND_API_KEY.substring(0, 3)}...${process.env.RESEND_API_KEY.substring(process.env.RESEND_API_KEY.length - 3)}` : 
  'undefined/missing');

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('Test email endpoint called');
    
    // In development, we can only send to the email that owns the API key
    // In this case, it's the developer's email
    const to = 'matthewtrundle@gmail.com';
    
    console.log('Attempting to send test email to:', to);
    
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: to,
      subject: 'Bloom Psychology Test Email',
      html: `
        <h1>Test Email from Bloom Psychology</h1>
        <p>This is a test email to verify that the Resend integration is working properly.</p>
        <p>Time sent: ${new Date().toLocaleString()}</p>
        <p>Environment: ${process.env.NODE_ENV || 'development'}</p>
      `,
    });
    
    console.log('Test email sent successfully:', data);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Test email sent successfully',
      to: to,
      data: data 
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    return res.status(500).json({ 
      error: 'Email send failed', 
      details: error,
      apiKeyPresent: !!process.env.RESEND_API_KEY
    });
  }
}