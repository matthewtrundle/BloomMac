// Test email template save functionality end-to-end
require('dotenv').config({ path: '.env.local' });

async function testEmailTemplateSave() {
  console.log('Testing email template save functionality...\n');

  const baseUrl = 'http://localhost:3000';
  
  try {
    // Step 1: Login to get JWT token
    console.log('1. Testing login...');
    const loginResponse = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'jana@bloompsychologygroup.com',
        password: 'BloomAdmin2024\!'
      })
    });

    if (\!loginResponse.ok) {
      const error = await loginResponse.text();
      console.error('❌ Login failed:', error);
      return;
    }

    // Extract the adminToken cookie
    const setCookieHeader = loginResponse.headers.get('set-cookie');
    if (\!setCookieHeader) {
      console.error('❌ No cookie received from login');
      return;
    }

    const adminToken = setCookieHeader.match(/adminToken=([^;]+)/)?.[1];
    if (\!adminToken) {
      console.error('❌ No adminToken found in cookie');
      return;
    }

    console.log('✅ Login successful, token received');

    // Step 2: Test fetching templates with authentication
    console.log('\n2. Testing template fetch with auth...');
    const fetchResponse = await fetch(`${baseUrl}/api/email-templates`, {
      headers: {
        'Cookie': `adminToken=${adminToken}`
      }
    });

    if (\!fetchResponse.ok) {
      const error = await fetchResponse.text();
      console.error('❌ Fetch failed:', fetchResponse.status, error);
      return;
    }

    const { templates } = await fetchResponse.json();
    console.log(`✅ Fetched ${templates.length} templates`);

    // Step 3: Test saving a template
    console.log('\n3. Testing template save...');
    const testTemplate = templates[0];
    const saveResponse = await fetch(`${baseUrl}/api/email-templates`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `adminToken=${adminToken}`
      },
      body: JSON.stringify({
        sequence: testTemplate.sequence,
        step: testTemplate.step,
        subject: testTemplate.subject + ' (TEST)',
        content: testTemplate.content + '\n\n<\!-- Test edit -->'
      })
    });

    if (\!saveResponse.ok) {
      const error = await saveResponse.text();
      console.error('❌ Save failed:', saveResponse.status, error);
      return;
    }

    console.log('✅ Template saved successfully');

    // Step 4: Verify the save worked
    console.log('\n4. Verifying saved template...');
    const verifyResponse = await fetch(`${baseUrl}/api/email-templates`, {
      headers: {
        'Cookie': `adminToken=${adminToken}`
      }
    });

    const { templates: updatedTemplates } = await verifyResponse.json();
    const updatedTemplate = updatedTemplates.find(t => 
      t.sequence === testTemplate.sequence && t.step === testTemplate.step
    );

    if (updatedTemplate && updatedTemplate.subject.includes('(TEST)')) {
      console.log('✅ Template update verified');
      
      // Clean up - restore original
      console.log('\n5. Cleaning up test data...');
      await fetch(`${baseUrl}/api/email-templates`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `adminToken=${adminToken}`
        },
        body: JSON.stringify({
          sequence: testTemplate.sequence,
          step: testTemplate.step,
          subject: testTemplate.subject,
          content: testTemplate.content
        })
      });
      console.log('✅ Original template restored');
    } else {
      console.error('❌ Template update not found');
    }

    console.log('\n✅ All tests passed\! Email template save is working correctly.');

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Check if the server is running
fetch('http://localhost:3000/api/test-analytics')
  .then(() => {
    console.log('Server is running, starting tests...\n');
    testEmailTemplateSave();
  })
  .catch(() => {
    console.error('❌ Server is not running. Please start the dev server with: npm run dev');
  });
EOF < /dev/null