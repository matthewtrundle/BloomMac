#!/usr/bin/env node
/**
 * Tests login functionality for test@bloom.com user
 * Run with: node scripts/test-user-login.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const testCredentials = {
  email: 'test@bloom.com',
  password: 'TestBloom123!'
};

async function testLogin() {
  console.log('🔍 Testing login for test@bloom.com...\n');

  try {
    // Step 1: Attempt to sign in
    console.log('1️⃣ Attempting to sign in...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: testCredentials.email,
      password: testCredentials.password
    });

    if (authError) {
      console.error('❌ Login failed:', authError.message);
      console.error('   Error details:', authError);
      
      // Try to get more info about the user
      console.log('\n2️⃣ Checking if user exists (using service role)...');
      const adminSupabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
      
      const { data: { users } } = await adminSupabase.auth.admin.listUsers();
      const testUser = users.find(u => u.email === testCredentials.email);
      
      if (testUser) {
        console.log('✅ User exists in auth system');
        console.log('   User ID:', testUser.id);
        console.log('   Email confirmed:', testUser.email_confirmed_at ? 'Yes' : 'No');
        console.log('   Created:', new Date(testUser.created_at).toLocaleString());
        console.log('   Last sign in:', testUser.last_sign_in_at ? new Date(testUser.last_sign_in_at).toLocaleString() : 'Never');
        
        // Check user profile
        console.log('\n3️⃣ Checking user profile...');
        const { data: profile, error: profileError } = await adminSupabase
          .from('user_profiles')
          .select('*')
          .eq('id', testUser.id)
          .single();
          
        if (profile) {
          console.log('✅ User profile exists');
          console.log('   Name:', profile.first_name, profile.last_name);
          console.log('   Onboarding completed:', profile.onboarding_completed ? 'Yes' : 'No');
        } else {
          console.log('❌ No user profile found');
          if (profileError) console.error('   Error:', profileError.message);
        }
      } else {
        console.log('❌ User does not exist in auth system');
        console.log('   You may need to run: node scripts/create-test-user.js');
      }
      
      return;
    }

    // Login successful
    console.log('✅ Login successful!');
    console.log('   User ID:', authData.user.id);
    console.log('   Email:', authData.user.email);
    console.log('   Session:', authData.session ? 'Active' : 'None');
    
    // Step 2: Check user profile
    console.log('\n2️⃣ Fetching user profile...');
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();
      
    if (profile) {
      console.log('✅ Profile found:');
      console.log('   Name:', profile.first_name, profile.last_name);
      console.log('   Phone:', profile.phone);
      console.log('   Days postpartum:', Math.floor((Date.now() - new Date(profile.postpartum_date)) / (1000 * 60 * 60 * 24)));
      console.log('   Number of children:', profile.number_of_children);
      console.log('   Onboarding completed:', profile.onboarding_completed ? 'Yes' : 'No');
    } else {
      console.log('❌ No profile found');
      if (profileError) console.error('   Error:', profileError.message);
    }
    
    // Step 3: Check course enrollment
    console.log('\n3️⃣ Checking course enrollment...');
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('course_enrollments')
      .select('*')
      .eq('user_id', authData.user.id)
      .single();
      
    if (enrollment) {
      console.log('✅ Enrolled in course:');
      console.log('   Course ID:', enrollment.course_id);
      console.log('   Progress:', enrollment.progress_percentage + '%');
      console.log('   Last accessed:', enrollment.last_accessed ? new Date(enrollment.last_accessed).toLocaleString() : 'Never');
    } else {
      console.log('❌ No course enrollment found');
      if (enrollmentError) console.error('   Error:', enrollmentError.message);
    }
    
    // Step 4: Sign out
    console.log('\n4️⃣ Signing out...');
    await supabase.auth.signOut();
    console.log('✅ Signed out successfully');
    
    console.log('\n✨ Test completed successfully!');
    console.log('   The user can log in normally.');
    
  } catch (error) {
    console.error('\n❌ Unexpected error:', error.message);
    console.error(error);
  }
}

// Run the test
testLogin();