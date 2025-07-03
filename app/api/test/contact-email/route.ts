import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Testing contact form email notification...');
    
    // Import the sendEmail function
    const { sendEmail } = await import('@/lib/resend-client');
    
    // Test data
    const testData = {
      name: 'Test User',
      email: 'testuser@example.com',
      phone: '555-123-4567',
      service: 'therapy-for-women',
      message: 'This is a test message to verify the contact form email notification is working properly.',
      page: '/contact'
    };
    
    const displayName = testData.name;
    const serviceDisplay = 'Therapy for Women';
    
    const notificationHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color: #333; line-height: 1.6; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1e3a5f 0%, #f8b5c4 100%); padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .content { background: white; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 8px 8px; }
    .field { margin-bottom: 15px; display: flex; }
    .field-name { font-weight: 600; color: #1e3a5f; width: 120px; flex-shrink: 0; }
    .field-value { flex: 1; }
    .message-box { background: #f8f9fa; border-left: 4px solid #f8b5c4; padding: 15px; margin: 15px 0; border-radius: 4px; }
    .footer { text-align: center; margin-top: 20px; font-size: 14px; color: #666; }
    .cta-button { display: inline-block; background: #1e3a5f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
    .test-banner { background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 4px; margin-bottom: 20px; text-align: center; color: #856404; }
  </style>
</head>
<body>
  <div class="container">
    <div class="test-banner">
      <strong>🧪 TEST EMAIL</strong> - This is a test of the contact form notification system
    </div>
    
    <div class="header">
      <h1>📧 New Contact Form Submission</h1>
      <p style="color: white; margin: 5px 0 0 0;">Bloom Psychology Website</p>
    </div>
    
    <div class="content">
      <div class="field">
        <div class="field-name">Name:</div>
        <div class="field-value">${displayName}</div>
      </div>
      
      <div class="field">
        <div class="field-name">Email:</div>
        <div class="field-value"><a href="mailto:${testData.email}" style="color: #1e3a5f;">${testData.email}</a></div>
      </div>
      
      <div class="field">
        <div class="field-name">Phone:</div>
        <div class="field-value"><a href="tel:${testData.phone}" style="color: #1e3a5f;">${testData.phone}</a></div>
      </div>
      
      <div class="field">
        <div class="field-name">Service:</div>
        <div class="field-value">${serviceDisplay}</div>
      </div>
      
      <div class="field">
        <div class="field-name">Page:</div>
        <div class="field-value">${testData.page}</div>
      </div>
      
      <div class="message-box">
        <strong>Message:</strong><br>
        ${testData.message.replace(/\n/g, '<br>')}
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="mailto:${testData.email}" class="cta-button">Reply to ${displayName}</a>
      </div>
    </div>
    
    <div class="footer">
      <p>Submitted on ${new Date().toLocaleString('en-US', { 
        timeZone: 'America/Chicago',
        dateStyle: 'full',
        timeStyle: 'short'
      })} (Austin Time)</p>
      <p>You can view all submissions in your <a href="https://bloompsychologynorthaustin.com/admin/contacts" style="color: #1e3a5f;">admin dashboard</a></p>
    </div>
  </div>
</body>
</html>`;

    // Send test email
    const result = await sendEmail({
      from: 'Bloom Psychology Website <jana@bloompsychologynorthaustin.com>',
      to: 'jana@bloompsychologynorthaustin.com',
      subject: `🧪 TEST: Contact Form Notification - ${displayName}`,
      html: notificationHtml,
      tags: [
        { name: 'type', value: 'test_contact_notification' },
        { name: 'environment', value: process.env.NODE_ENV || 'development' }
      ]
    });

    console.log('Test email sent successfully:', result);

    return NextResponse.json({
      success: true,
      message: 'Test contact notification email sent successfully',
      result: result.data,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Test email failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to send test email',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}