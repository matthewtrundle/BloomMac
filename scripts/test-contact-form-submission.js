#!/usr/bin/env node

/**
 * Test contact form submission end-to-end
 */

require('dotenv').config({ path: '.env.local' });

async function testContactFormSubmission() {
  console.log('=== TESTING CONTACT FORM SUBMISSION ===\n');

  const testData = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phone: '512-555-0123',
    service: 'anxiety',
    message: 'This is a test contact form submission to verify email functionality.'
  };

  console.log('Submitting test contact form with data:');
  console.log(JSON.stringify(testData, null, 2));

  try {
    // Make request to local API
    const response = await fetch('http://localhost:3000/api/contact/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'http://localhost:3000/contact'
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('\n✅ Contact form submitted successfully!');
      console.log('Response:', JSON.stringify(result, null, 2));
      
      console.log('\n📧 Expected emails:');
      console.log('1. Notification email to: jana@bloompsychologynorthaustin.com');
      console.log('2. Notification email to: matt@bloompsychologynorthaustin.com');
      console.log('3. Confirmation email to:', testData.email);
      console.log('\nPlease check these inboxes to verify emails were received.');
      
    } else {
      console.log('\n❌ Contact form submission failed:');
      console.log('Status:', response.status);
      console.log('Error:', result);
    }
    
  } catch (error) {
    console.log('\n❌ Error submitting contact form:');
    console.log(error.message);
    console.log('\nMake sure the development server is running: npm run dev');
  }
}

// Check if dev server is running first
fetch('http://localhost:3000')
  .then(() => {
    console.log('✅ Development server is running\n');
    testContactFormSubmission();
  })
  .catch(() => {
    console.log('❌ Development server is not running');
    console.log('Please start it with: npm run dev');
  });