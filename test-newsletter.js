const testEmail = `test-${Date.now()}@example.com`;

async function testNewsletterSignup() {
  console.log('Testing newsletter signup with email:', testEmail);
  
  try {
    // Test the /api/user/newsletter-subscribe endpoint
    const response = await fetch('http://localhost:3002/api/user/newsletter-subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        firstName: 'Test',
        lastName: 'User'
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('Response body:', text);
    
    // Try to parse as JSON
    try {
      const json = JSON.parse(text);
      console.log('Parsed JSON:', json);
    } catch (e) {
      console.log('Failed to parse as JSON');
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Also test the main newsletter-signup endpoint directly
async function testMainEndpoint() {
  console.log('\nTesting main newsletter-signup endpoint...');
  
  try {
    const response = await fetch('http://localhost:3000/api/newsletter-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail + '.direct',
        firstName: 'Test',
        lastName: 'Direct',
        source: 'test'
      })
    });

    console.log('Response status:', response.status);
    const text = await response.text();
    console.log('Response body:', text);
    
  } catch (error) {
    console.error('Direct test failed:', error);
  }
}

testNewsletterSignup().then(() => testMainEndpoint());