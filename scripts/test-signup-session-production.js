#!/usr/bin/env node

/**
 * Test script to verify session creation after signup in PRODUCTION
 */

const fetch = require('node-fetch');

async function testSignupSessionProduction() {
  const baseUrl = 'https://www.bloompsychologynorthaustin.com';
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';
  
  console.log('🧪 Testing signup and session creation on PRODUCTION...\n');
  console.log('URL:', baseUrl);
  console.log('Test email:', testEmail);
  console.log('---\n');
  
  try {
    // Step 1: Create account
    console.log('1️⃣ Creating account...');
    const signupResponse = await fetch(`${baseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      },
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
      message: signupData.message,
      hasUser: !!signupData.user
    });
    
    // Extract cookies
    const setCookieHeader = signupResponse.headers.raw()['set-cookie'];
    const hasCookies = setCookieHeader && setCookieHeader.length > 0;
    console.log('\nSession cookies set:', hasCookies ? '✅ Yes' : '❌ No');
    
    if (hasCookies) {
      console.log('Cookie types:', setCookieHeader.map(c => c.split('=')[0]).join(', '));
    }
    
    if (!signupData.success) {
      throw new Error('Signup failed: ' + (signupData.error || signupData.message || 'Unknown error'));
    }
    
    // Step 2: Build cookie string for next request
    let cookieString = '';
    if (setCookieHeader) {
      cookieString = setCookieHeader
        .map(cookie => cookie.split(';')[0])
        .join('; ');
    }
    
    // Step 3: Wait a bit for session to propagate
    console.log('\n2️⃣ Waiting 3 seconds for session to establish...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Step 4: Try to access profile
    console.log('\n3️⃣ Attempting to fetch profile...');
    const profileResponse = await fetch(`${baseUrl}/api/profile/get`, {
      headers: {
        'Cookie': cookieString,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    const profileData = await profileResponse.json();
    console.log('Profile response:', {
      status: profileResponse.status,
      success: profileData.success,
      hasProfile: !!profileData.profile,
      error: profileData.error
    });
    
    if (profileData.profile) {
      console.log('Profile data:', {
        firstName: profileData.profile.first_name,
        lastName: profileData.profile.last_name,
        hasId: !!profileData.profile.id
      });
    }
    
    // Summary
    console.log('\n📊 Summary:');
    console.log('- Account created:', signupData.success ? '✅' : '❌');
    console.log('- Session cookies:', hasCookies ? '✅' : '❌');
    console.log('- Profile accessible:', profileResponse.status === 200 ? '✅' : '❌');
    console.log('- Email confirmation required:', signupData.requiresEmailConfirmation ? 'Yes' : 'No');
    
    if (profileResponse.status === 401) {
      console.log('\n⚠️  Issue: Session not available after signup');
      console.log('Possible causes:');
      console.log('1. Email confirmation is still enabled');
      console.log('2. Session cookies not being set properly');
      console.log('3. Cookie domain/path issues');
    } else if (profileResponse.status === 200) {
      console.log('\n✅ Success! Users can now access the wellness hub immediately after signup.');
    }
    
    // Cleanup note
    console.log('\n🧹 Cleanup: You may want to delete this test user from Supabase Dashboard');
    console.log(`Test email: ${testEmail}`);
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Tip: This script tests against production, not localhost');
    }
  }
}

// Run the test
console.log('🚀 Starting production test...\n');
testSignupSessionProduction();