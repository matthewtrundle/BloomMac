#!/usr/bin/env node

/**
 * Test Resend email sending directly
 */

require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

async function testResendEmail() {
  console.log('=== TESTING RESEND EMAIL ===\n');

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log('❌ RESEND_API_KEY is not set');
    return;
  }

  console.log('✅ RESEND_API_KEY is configured');

  try {
    const resend = new Resend(apiKey);
    
    // Test sending to both recipients
    const result = await resend.emails.send({
      from: 'Bloom Test <noreply@bloompsychologynorthaustin.com>',
      to: ['jana@bloompsychologynorthaustin.com', 'matt@bloompsychologynorthaustin.com'],
      subject: 'Test: Contact Form Email System',
      html: `
        <h2>Contact Form Email Test</h2>
        <p>This is a test email to verify that the contact form notification system is working.</p>
        <p>If you receive this email, it means:</p>
        <ul>
          <li>✅ Resend API is properly configured</li>
          <li>✅ Email sending functionality works</li>
          <li>✅ Both jana@ and matt@ addresses are receiving emails</li>
        </ul>
        <p>Sent at: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })}</p>
      `,
      tags: [
        { name: 'type', value: 'test' },
        { name: 'source', value: 'contact-form-test' }
      ]
    });

    console.log('✅ Email sent successfully!');
    console.log('Email ID:', result.data?.id);
    console.log('\nPlease check your inbox for the test email.');
    
  } catch (error) {
    console.log('❌ Error sending email:', error.message);
    if (error.response) {
      console.log('Response:', error.response.body);
    }
  }
}

testResendEmail().catch(console.error);