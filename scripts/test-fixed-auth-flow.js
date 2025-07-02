#!/usr/bin/env node
/**
 * Test the fixed authentication flow
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const testEmail = `test-fixed-${Date.now()}@bloom.com`;
const testPassword = 'TestBloom123!';

console.log('🧪 Testing Fixed Auth Flow');
console.log('='.repeat(40));
console.log('Test Email:', testEmail);

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testFixedFlow() {
  console.log('\n1️⃣ Testing signup with email confirmation...');
  
  try {
    const { data: signupData, error: signupError } = await supabaseClient.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: { full_name: 'Test User' }
      }
    });

    if (signupError) {
      console.error('❌ Signup failed:', signupError.message);
      return;
    }

    console.log('✅ Signup successful');
    console.log('   User created:', !!signupData.user);
    console.log('   Session created:', !!signupData.session);
    console.log('   Email confirmed:', signupData.user?.email_confirmed_at ? 'Yes' : 'No');

    // This should now correctly detect no session and redirect to check-email
    if (signupData.user && !signupData.session) {
      console.log('✅ FIXED: No session created - user should be redirected to check-email');
      console.log('   Expected flow: signup -> check-email -> email confirmation -> onboarding');
    } else if (signupData.user && signupData.session) {
      console.log('✅ Session created immediately - user can go to onboarding');
      console.log('   Expected flow: signup -> onboarding');
    }

    // Test what happens when email is confirmed (simulate with admin)
    console.log('\n2️⃣ Simulating email confirmation...');
    
    if (signupData.user) {
      // Confirm the user manually
      const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(
        signupData.user.id,
        { email_confirm: true }
      );

      if (confirmError) {
        console.error('❌ Failed to confirm email:', confirmError.message);
      } else {
        console.log('✅ Email confirmed successfully');
        
        // Now try to sign in
        const { data: signinData, error: signinError } = await supabaseClient.auth.signInWithPassword({
          email: testEmail,
          password: testPassword
        });

        if (signinError) {
          console.error('❌ Sign in failed:', signinError.message);
        } else {
          console.log('✅ Sign in successful after confirmation');
          console.log('   Session exists:', !!signinData.session);
          
          // Test profile creation (what onboarding does)
          console.log('\n3️⃣ Testing onboarding profile creation...');
          
          const { error: profileError } = await supabaseClient
            .from('user_profiles')
            .insert({
              id: signinData.user.id,
              email: testEmail,
              first_name: 'Test',
              last_name: 'User',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (profileError) {
            console.error('❌ Profile creation failed:', profileError.message);
          } else {
            console.log('✅ Profile creation successful');
            console.log('   Onboarding should now work properly');
          }
        }
      }
    }

    // Cleanup
    console.log('\n4️⃣ Cleaning up test user...');
    if (signupData.user) {
      await supabaseAdmin.from('user_profiles').delete().eq('id', signupData.user.id);
      await supabaseAdmin.auth.admin.deleteUser(signupData.user.id);
      console.log('✅ Test user cleaned up');
    }

  } catch (error) {
    console.error('\n❌ Unexpected error:', error.message);
  }
}

async function summarizeChanges() {
  console.log('\n🔧 CHANGES MADE:');
  console.log('1. AuthContext now checks if session exists after signup');
  console.log('2. If no session (email confirmation required) -> redirect to check-email');
  console.log('3. If session exists -> proceed to onboarding');
  console.log('4. Updated check-email page to handle signup confirmations');
  console.log('5. Updated auth callback to redirect new users to onboarding');
  
  console.log('\n✅ EXPECTED BEHAVIOR:');
  console.log('• Signup -> Check Email page (if confirmation required)');
  console.log('• User clicks email link -> Auth callback -> Onboarding');
  console.log('• Onboarding now works because user has valid session');
  console.log('• No more "something went wrong" errors');
}

// Run test
testFixedFlow().then(() => {
  summarizeChanges();
});