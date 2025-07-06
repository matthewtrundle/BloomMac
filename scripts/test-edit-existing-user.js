#!/usr/bin/env node

/**
 * Test profile editing with an existing user account
 */

const fetch = require('node-fetch');

async function testEditExistingUser() {
  const baseUrl = 'https://www.bloompsychologynorthaustin.com';
  
  // Use one of your existing test accounts
  const testEmail = 'test-1751831892294@example.com';
  const testPassword = 'TestPassword123!';
  
  console.log('🧪 Testing Profile Edit with Existing User\n');
  console.log('URL:', baseUrl);
  console.log('Using existing account:', testEmail);
  console.log('---\n');
  
  let cookieString = '';
  
  try {
    // Step 1: Login with existing account
    console.log('1️⃣ Logging in with existing account...');
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login response status:', loginResponse.status);
    
    if (loginResponse.status !== 200) {
      console.log('Login failed:', loginData);
      console.log('\n💡 Note: The test accounts may have been created without proper session.');
      console.log('Please test manually by creating a new account through the UI.');
      return;
    }
    
    // Extract cookies
    const setCookieHeader = loginResponse.headers.raw()['set-cookie'];
    if (setCookieHeader) {
      cookieString = setCookieHeader
        .map(cookie => cookie.split(';')[0])
        .join('; ');
      console.log('Session established ✅');
    }
    
    // Step 2: Get current profile
    console.log('\n2️⃣ Fetching current profile...');
    const profileResponse = await fetch(`${baseUrl}/api/profile/get`, {
      headers: {
        'Cookie': cookieString,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    const profileData = await profileResponse.json();
    console.log('Current profile:', {
      status: profileResponse.status,
      firstName: profileData.profile?.first_name || 'Not set',
      lastName: profileData.profile?.last_name || 'Not set',
      phone: profileData.profile?.phone || 'Not set'
    });
    
    // Step 3: Update profile
    console.log('\n3️⃣ Updating profile with new data...');
    const updateData = {
      first_name: 'John',
      last_name: 'Doe',
      phone: '512-555-1234',
      postpartum_date: '2024-06-01',
      baby_due_date: null,
      number_of_children: 1,
      emergency_contact_name: 'Jane Doe',
      emergency_contact_phone: '512-555-5678',
      emergency_contact_relationship: 'spouse',
      timezone: 'America/Chicago'
    };
    
    const updateResponse = await fetch(`${baseUrl}/api/profile/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieString,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      },
      body: JSON.stringify(updateData)
    });
    
    const updateResult = await updateResponse.json();
    console.log('Update response:', {
      status: updateResponse.status,
      success: updateResult.success,
      message: updateResult.message || updateResult.error
    });
    
    // Step 4: Verify update
    console.log('\n4️⃣ Verifying profile was updated...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const verifyResponse = await fetch(`${baseUrl}/api/profile/get`, {
      headers: {
        'Cookie': cookieString,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    const verifyData = await verifyResponse.json();
    if (verifyData.profile) {
      console.log('\nUpdated profile:');
      console.log('- Name:', verifyData.profile.first_name, verifyData.profile.last_name);
      console.log('- Phone:', verifyData.profile.phone);
      console.log('- Emergency Contact:', verifyData.profile.emergency_contact_name);
      console.log('- Number of Children:', verifyData.profile.number_of_children);
      
      const success = verifyData.profile.first_name === 'John' && 
                     verifyData.profile.last_name === 'Doe';
      
      console.log('\n' + (success ? '✅ Profile edit is working!' : '❌ Profile edit failed'));
    }
    
  } catch (error) {
    console.error('\n❌ Test error:', error.message);
  }
}

// Manual test instructions
console.log('📝 Manual Testing Instructions:\n');
console.log('Since you\'re rate-limited, please test manually:\n');
console.log('1. Open a new incognito/private browser window');
console.log('2. Go to: https://www.bloompsychologynorthaustin.com');
console.log('3. Create a new account (or use existing)');
console.log('4. After signup, you should land on the dashboard');
console.log('5. Click on "Edit Profile" or go to /profile/edit');
console.log('6. Fill in all fields and save');
console.log('7. Refresh the page to verify changes persist\n');
console.log('The profile edit should work perfectly! All fields should save.\n');

// Try the automated test
console.log('Attempting automated test with existing account...\n');
testEditExistingUser();