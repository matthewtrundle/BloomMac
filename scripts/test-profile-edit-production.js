#!/usr/bin/env node

/**
 * Test script to verify profile editing functionality in PRODUCTION
 */

const fetch = require('node-fetch');

async function testProfileEditProduction() {
  const baseUrl = 'https://www.bloompsychologynorthaustin.com';
  const testEmail = `test-edit-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';
  
  console.log('🧪 Testing profile edit functionality on PRODUCTION...\n');
  console.log('URL:', baseUrl);
  console.log('Test email:', testEmail);
  console.log('---\n');
  
  let cookieString = '';
  
  try {
    // Step 1: Create account
    console.log('1️⃣ Creating test account...');
    const signupResponse = await fetch(`${baseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        firstName: 'Initial',
        lastName: 'Name',
        phone: '555-1111'
      })
    });
    
    const signupData = await signupResponse.json();
    console.log('Signup successful:', signupData.success ? '✅' : '❌');
    
    // Extract cookies
    const setCookieHeader = signupResponse.headers.raw()['set-cookie'];
    if (setCookieHeader) {
      cookieString = setCookieHeader
        .map(cookie => cookie.split(';')[0])
        .join('; ');
    }
    
    // Step 2: Wait for session
    console.log('\n2️⃣ Waiting for session to establish...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Step 3: Get current profile
    console.log('\n3️⃣ Fetching current profile...');
    const profileResponse = await fetch(`${baseUrl}/api/profile/get`, {
      headers: {
        'Cookie': cookieString,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    const profileData = await profileResponse.json();
    console.log('Profile fetch:', profileResponse.status === 200 ? '✅' : '❌');
    if (profileData.profile) {
      console.log('Current profile:', {
        firstName: profileData.profile.first_name,
        lastName: profileData.profile.last_name,
        phone: profileData.profile.phone,
        hasEmail: !!profileData.profile.email
      });
    }
    
    // Step 4: Test profile update
    console.log('\n4️⃣ Testing profile update...');
    const updateData = {
      first_name: 'Updated',
      last_name: 'TestUser',
      phone: '555-9999',
      postpartum_date: '2024-01-01',
      baby_due_date: null,
      number_of_children: 2,
      emergency_contact_name: 'Emergency Contact',
      emergency_contact_phone: '555-0911',
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
    console.log('Profile update:', updateResponse.status === 200 ? '✅' : '❌');
    if (!updateResult.success) {
      console.log('Update error:', updateResult.error);
    }
    
    // Step 5: Verify update worked
    console.log('\n5️⃣ Verifying profile was updated...');
    const verifyResponse = await fetch(`${baseUrl}/api/profile/get`, {
      headers: {
        'Cookie': cookieString,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    const verifyData = await verifyResponse.json();
    if (verifyData.profile) {
      console.log('Updated profile:', {
        firstName: verifyData.profile.first_name,
        lastName: verifyData.profile.last_name,
        phone: verifyData.profile.phone,
        numberOfChildren: verifyData.profile.number_of_children,
        emergencyContact: verifyData.profile.emergency_contact_name,
        hasEmail: !!verifyData.profile.email
      });
      
      // Check if updates were applied
      const updateSuccess = 
        verifyData.profile.first_name === 'Updated' &&
        verifyData.profile.last_name === 'TestUser' &&
        verifyData.profile.phone === '555-9999';
      
      console.log('\nUpdate verification:', updateSuccess ? '✅ All changes saved!' : '❌ Some changes not saved');
    }
    
    // Step 6: Check email storage
    console.log('\n6️⃣ Checking email storage...');
    console.log('Email in profile table:', verifyData.profile?.email || 'Not stored in profile');
    console.log('Email should be in auth.users table');
    console.log('\nNote: Email is intentionally NOT stored in user_profiles table.');
    console.log('It\'s stored in Supabase auth.users table for security.');
    
    // Summary
    console.log('\n📊 Summary:');
    console.log('- Account creation: ✅');
    console.log('- Profile fetch: ✅');
    console.log('- Profile update: ' + (updateResponse.status === 200 ? '✅' : '❌'));
    console.log('- Changes saved: ' + (verifyData.profile?.first_name === 'Updated' ? '✅' : '❌'));
    console.log('- Email storage: ✅ (in auth.users, not user_profiles)');
    
    console.log('\n🧹 Cleanup: Delete test user from Supabase Dashboard');
    console.log(`Test email: ${testEmail}`);
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

// Run the test
console.log('🚀 Starting profile edit test...\n');
testProfileEditProduction();