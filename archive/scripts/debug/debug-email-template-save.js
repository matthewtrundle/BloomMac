// Quick script to test the email template save endpoint directly

const testEmailTemplateSave = async () => {
  const testData = {
    id: 'newsletter-welcome',
    sequence: 'newsletter',
    step: 'welcome',
    subject: 'Test Subject - Updated',
    content: '<p>Test content - Updated at ' + new Date().toISOString() + '</p>'
  };

  try {
    console.log('Sending PUT request to /api/email-templates...');
    console.log('Data:', testData);
    
    const response = await fetch('http://localhost:3000/api/email-templates', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    const responseText = await response.text();
    console.log('Response body:', responseText);
    
    try {
      const responseJson = JSON.parse(responseText);
      console.log('Parsed response:', responseJson);
    } catch (e) {
      console.log('Response is not JSON');
    }

  } catch (error) {
    console.error('Error:', error);
  }
};

console.log('Make sure your Next.js dev server is running on port 3000');
console.log('Run this with: node scripts/debug-email-template-save.js\n');

testEmailTemplateSave();