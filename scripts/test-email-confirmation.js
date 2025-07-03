#!/usr/bin/env node
/**
 * Test email confirmation settings and create a test user
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testEmailConfirmation() {
  console.log('🔍 Testing Email Confirmation Settings\n');
  
  const testEmail = `test-confirm-${Date.now()}@bloom.com`;
  const testPassword = 'TestBloom123!';
  
  try {
    // Option 1: Create user with email auto-confirmed (for testing)
    console.log('1️⃣ Creating test user with auto-confirmed email...');
    
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: 'Test User'
      }
    });

    if (userError) {
      console.error('❌ Failed to create user:', userError.message);
      return;
    }

    console.log('✅ User created with auto-confirmed email');
    console.log('   User ID:', userData.user.id);
    console.log('   Email:', userData.user.email);
    console.log('   Email confirmed:', userData.user.email_confirmed_at ? 'Yes' : 'No');
    
    // Try to sign in immediately
    console.log('\n2️⃣ Testing immediate sign in...');
    
    const { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });

    if (signInError) {
      console.error('❌ Sign in failed:', signInError.message);
    } else {
      console.log('✅ Sign in successful!');
      console.log('   Session created:', !!signInData.session);
      console.log('   Access token exists:', !!signInData.session?.access_token);
    }

    // Create profile
    console.log('\n3️⃣ Creating user profile...');
    
    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .insert({
        id: userData.user.id,
        email: testEmail,
        first_name: 'Test',
        last_name: 'User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (profileError) {
      console.error('❌ Profile creation failed:', profileError.message);
    } else {
      console.log('✅ Profile created successfully');
    }

    console.log('\n✅ Test completed!');
    console.log('\n📝 You can now login with:');
    console.log('   Email:', testEmail);
    console.log('   Password:', testPassword);
    console.log('   No email confirmation needed!');

    // Clean up
    console.log('\n4️⃣ Cleaning up test user...');
    await supabaseAdmin.from('user_profiles').delete().eq('id', userData.user.id);
    await supabaseAdmin.auth.admin.deleteUser(userData.user.id);
    console.log('✅ Test user cleaned up');

  } catch (error) {
    console.error('\n❌ Unexpected error:', error.message);
  }
}

async function createPermanentTestUser() {
  console.log('\n🔧 Creating permanent test user...\n');
  
  const email = 'test@bloom.com';
  const password = 'TestBloom123!';
  
  try {
    // Delete existing user if any
    const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
      console.log('Removing existing test user...');
      await supabaseAdmin.from('user_profiles').delete().eq('id', existingUser.id);
      await supabaseAdmin.auth.admin.deleteUser(existingUser.id);
    }

    // Create new user with confirmed email
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: 'Test User'
      }
    });

    if (userError) {
      console.error('❌ Failed to create user:', userError.message);
      return;
    }

    console.log('✅ Permanent test user created');
    console.log('   Email:', email);
    console.log('   Password:', password);
    console.log('   User ID:', userData.user.id);
    
    // Create profile
    await supabaseAdmin
      .from('user_profiles')
      .insert({
        id: userData.user.id,
        email,
        first_name: 'Test',
        last_name: 'User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    console.log('✅ Profile created');
    console.log('\n🎉 You can now login without email confirmation!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

// Run tests
console.log('Choose an option:');
console.log('1. Test email confirmation flow');
console.log('2. Create permanent test user (test@bloom.com)');
console.log('\nRun with: node scripts/test-email-confirmation.js [1|2]');

const option = process.argv[2];

if (option === '1') {
  testEmailConfirmation();
} else if (option === '2') {
  createPermanentTestUser();
} else {
  console.log('\nNo option selected. Showing both options.');
}