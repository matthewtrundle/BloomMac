import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/resend-client';

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

// Function to replace template variables with test data
function personalizeTestEmail(content: string): string {
  const testData = {
    firstName: 'Matthew',
    lastName: 'Trundle', 
    email: 'matthewtrundle@gmail.com',
    unsubscribeLink: 'https://bloompsychologynorthaustin.com/unsubscribe?test=true'
  };

  return content
    .replace(/\{\{firstName\}\}/g, testData.firstName)
    .replace(/\{\{lastName\}\}/g, testData.lastName)
    .replace(/\{\{email\}\}/g, testData.email)
    .replace(/\{\{unsubscribeLink\}\}/g, testData.unsubscribeLink);
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
    const testEmail = 'matthewtrundle@gmail.com';
    
    // Personalize the email content with test data
    const personalizedHtml = html ? personalizeTestEmail(html) : personalizeTestEmail(`<p>${text}</p>`);
    const personalizedText = text ? personalizeTestEmail(text) : personalizeTestEmail(html.replace(/<[^>]*>/g, ''));
    const personalizedSubject = personalizeTestEmail(subject);
    
    const result = await sendEmail({
      from: 'Bloom Psychology <noreply@bloompsychologynorthaustin.com>',
      to: testEmail,
      subject: `[TEST] ${personalizedSubject}`,
      html: personalizedHtml,
      text: personalizedText
    });

    return NextResponse.json({
      success: true,
      message: `Test email sent to ${testEmail} with personalized content`,
      recipient: testEmail,
      personalized: true,
      data: result
    });

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