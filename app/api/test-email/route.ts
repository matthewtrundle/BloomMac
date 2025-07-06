import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    // Check if Resend is configured
    const hasResendKey = !!process.env.RESEND_API_KEY;
    
    return NextResponse.json({
      configured: hasResendKey,
      provider: 'resend'
    });

  } catch (error) {
    console.error('Error checking email configuration:', error);
    return NextResponse.json(
      { error: 'Failed to check configuration', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html, text } = await request.json();
    
    if (!to || !subject || (!html && !text)) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, and either html or text' },
        { status: 400 }
      );
    }

    // Use the admin email as the test recipient
    const testEmail = 'jana@bloompsychologynorthaustin.com';
    
    const result = await sendEmail({
      to: testEmail,
      subject: `[TEST] ${subject}`,
      html: html || `<p>${text}</p>`,
      text: text || html.replace(/<[^>]*>/g, '')
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Test email sent to ${testEmail}`,
        data: result.data
      });
    } else {
      throw new Error(result.error || 'Failed to send email');
    }

  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to send test email', 
        message: error.message 
      },
      { status: 500 }
    );
  }
}