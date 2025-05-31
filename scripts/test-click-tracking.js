// Test click tracking by simulating a click event
const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function testClickTracking() {
  console.log('🧪 Testing click tracking API...\n');

  // Simulate click data
  const clickData = {
    clicks: [
      {
        x: 500,
        y: 300,
        elementType: 'button',
        elementText: 'Test Button',
        elementId: 'test-btn',
        elementClass: 'btn-primary',
        pageX: 500,
        pageY: 300,
        viewportWidth: 1920,
        viewportHeight: 1080,
        pageWidth: 1920,
        pageHeight: 2000,
        timestamp: Date.now()
      }
    ],
    page: '/',
    sessionId: 'test-session-' + Date.now(),
    userId: 'test-user'
  };

  try {
    console.log('Sending test click to:', `${baseUrl}/api/track-clicks`);
    
    const response = await fetch(`${baseUrl}/api/track-clicks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clickData)
    });

    const responseText = await response.text();
    console.log('Response status:', response.status);
    console.log('Response:', responseText);

    if (response.ok) {
      const data = JSON.parse(responseText);
      console.log('\n✅ Click tracking API is working!');
      console.log('Tracked:', data.tracked, 'clicks');
    } else {
      console.log('\n❌ Click tracking API failed');
    }
  } catch (error) {
    console.error('\n❌ Error testing click tracking:', error);
  }
}

// Run test
testClickTracking();