#!/usr/bin/env node
/**
 * Comprehensive test of signup -> onboarding flow
 * This will identify exactly where the auth flow breaks
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

// Test user credentials
const testEmail = `test-${Date.now()}@bloom.com`;
const testPassword = 'TestBloom123!';

console.log('🔍 Debugging Signup -> Onboarding Flow\n');
console.log('Test Email:', testEmail);
console.log('Test Password:', testPassword);
console.log('='.repeat(50));

// Initialize Supabase clients
const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debugSignupFlow() {
  console.log('\n1️⃣ Testing user signup...');
  
  try {
    // Step 1: Sign up new user
    const { data: signupData, error: signupError } = await supabaseClient.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Test User'
        }
      }
    });

    if (signupError) {
      console.error('❌ Signup failed:', signupError.message);
      return;
    }

    console.log('✅ Signup successful');
    console.log('   User ID:', signupData.user?.id);
    console.log('   Email confirmed:', signupData.user?.email_confirmed_at ? 'Yes' : 'No');
    console.log('   Session exists:', !!signupData.session);

    if (!signupData.user) {
      console.error('❌ No user data returned from signup');
      return;
    }

    const userId = signupData.user.id;

    // Step 2: Verify session immediately after signup
    console.log('\n2️⃣ Checking session immediately after signup...');
    const { data: { session: immediateSession }, error: sessionError } = await supabaseClient.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Session check error:', sessionError.message);
    }
    
    console.log('   Immediate session exists:', !!immediateSession);
    if (immediateSession) {
      console.log('   Session user ID:', immediateSession.user.id);
      console.log('   Session expires at:', new Date(immediateSession.expires_at * 1000).toISOString());
    }

    // Step 3: Wait a moment and check again (simulate page navigation)
    console.log('\n3️⃣ Waiting 2 seconds and checking session again...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const { data: { session: delayedSession } } = await supabaseClient.auth.getSession();
    console.log('   Delayed session exists:', !!delayedSession);
    
    if (!delayedSession && immediateSession) {
      console.log('⚠️  Session lost after delay - this could cause "something went wrong"');
    }

    // Step 4: Try to manually create user profile (what onboarding does)
    console.log('\n4️⃣ Testing profile creation (onboarding step)...');
    
    // Check if profile already exists
    const { data: existingProfile } = await supabaseClient
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (existingProfile) {
      console.log('   Profile already exists');
    } else {
      console.log('   Creating new profile...');
      
      const { error: profileError } = await supabaseClient
        .from('user_profiles')
        .insert({
          id: userId,
          email: testEmail,
          first_name: 'Test',
          last_name: 'User',
          phone: '555-123-4567',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('❌ Profile creation failed:', profileError.message);
        
        // Check if it's a session/RLS issue
        if (profileError.message.includes('JWT') || profileError.message.includes('session')) {
          console.log('🔍 This appears to be a session/authentication issue');
          
          // Try with admin client
          console.log('   Trying with admin client...');
          const { error: adminProfileError } = await supabaseAdmin
            .from('user_profiles')
            .insert({
              id: userId,
              email: testEmail,
              first_name: 'Test',
              last_name: 'User',
              phone: '555-123-4567',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
            
          if (adminProfileError) {
            console.error('❌ Admin profile creation also failed:', adminProfileError.message);
          } else {
            console.log('✅ Admin profile creation successful - RLS issue confirmed');
          }
        }
      } else {
        console.log('✅ Profile creation successful');
      }
    }

    // Step 5: Test RLS policies
    console.log('\n5️⃣ Testing RLS policies...');
    
    const { data: profileData, error: profileSelectError } = await supabaseClient
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileSelectError) {
      console.error('❌ Cannot read profile:', profileSelectError.message);
      console.log('🔍 This confirms RLS/session issues');
    } else {
      console.log('✅ Can read profile successfully');
    }

    // Step 6: Test authentication state persistence
    console.log('\n6️⃣ Testing auth state persistence...');
    
    // Simulate what happens in React components
    const { data: { user: currentUser } } = await supabaseClient.auth.getUser();
    
    if (currentUser) {
      console.log('✅ User context available');
      console.log('   User ID:', currentUser.id);
      console.log('   Email verified:', currentUser.email_confirmed_at ? 'Yes' : 'No');
    } else {
      console.log('❌ User context missing - this causes "something went wrong"');
    }

    // Step 7: Clean up test user
    console.log('\n7️⃣ Cleaning up test user...');
    
    // Delete profile
    await supabaseAdmin
      .from('user_profiles')
      .delete()
      .eq('id', userId);
    
    // Delete auth user
    await supabaseAdmin.auth.admin.deleteUser(userId);
    
    console.log('✅ Test user cleaned up');

  } catch (error) {
    console.error('\n❌ Unexpected error:', error.message);
    console.error(error);
  }
}

async function checkEnvironmentVariables() {
  console.log('\n🔧 Environment Check:');
  console.log('   NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing');
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
  console.log('   SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');
}

async function checkSupabaseConnection() {
  console.log('\n🔌 Testing Supabase connection...');
  
  try {
    const { data, error } = await supabaseClient
      .from('user_profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
    } else {
      console.log('✅ Connection successful');
    }
  } catch (error) {
    console.error('❌ Connection error:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  await checkEnvironmentVariables();
  await checkSupabaseConnection();
  await debugSignupFlow();
  
  console.log('\n' + '='.repeat(50));
  console.log('🎯 DIAGNOSIS COMPLETE');
  console.log('\nIf you see "Session lost" or "Cannot read profile" above,');
  console.log('that explains the "something went wrong" error.');
  console.log('\nCommon causes:');
  console.log('• Email confirmation required but not configured');
  console.log('• RLS policies blocking authenticated users');
  console.log('• Session not persisting between signup and onboarding');
  console.log('• Auth context not updating properly');
}

runAllTests();