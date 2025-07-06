#!/usr/bin/env node

/**
 * Test script to verify session creation after signup
 */

const fetch = require('node-fetch');

async function testSignupSession() {
  const baseUrl = 'http://localhost:3000';
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';
  
  console.log('🧪 Testing signup and session creation...\n');
  
  try {
    // Step 1: Create account
    console.log('1️⃣ Creating account...');
    const signupResponse = await fetch(`${baseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        firstName: 'Test',
        lastName: 'User',
        phone: '555-1234'
      })
    });
    
    const signupData = await signupResponse.json();
    console.log('Signup response:', {
      status: signupResponse.status,
      success: signupData.success,
      requiresEmailConfirmation: signupData.requiresEmailConfirmation,
      hasUser: !!signupData.user
    });
    
    // Extract cookies
    const cookies = signupResponse.headers.get('set-cookie');
    console.log('\nCookies set:', cookies ? 'Yes' : 'No');
    
    if (!signupData.success) {
      throw new Error('Signup failed: ' + (signupData.error || 'Unknown error'));
    }
    
    // Step 2: Wait a bit for session to propagate
    console.log('\n2️⃣ Waiting 2 seconds for session to establish...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Step 3: Try to access profile
    console.log('\n3️⃣ Attempting to fetch profile...');
    const profileResponse = await fetch(`${baseUrl}/api/profile/get`, {
      headers: {
        'Cookie': cookies || ''
      }
    });
    
    const profileData = await profileResponse.json();
    console.log('Profile response:', {
      status: profileResponse.status,
      success: profileData.success,
      hasProfile: !!profileData.profile
    });
    
    // Summary
    console.log('\n📊 Summary:');
    console.log('- Account created:', signupData.success ? '✅' : '❌');
    console.log('- Session cookies:', cookies ? '✅' : '❌');
    console.log('- Profile accessible:', profileResponse.status === 200 ? '✅' : '❌');
    console.log('- Email confirmation required:', signupData.requiresEmailConfirmation ? 'Yes' : 'No');
    
    if (profileResponse.status === 401) {
      console.log('\n⚠️  Issue confirmed: Session not immediately available after signup');
      console.log('This explains the 401 errors users are experiencing.');
    }
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

// Run the test
testSignupSession();