#!/usr/bin/env node
/**
 * Fixes the test user profile
 * Run with: node scripts/fix-test-user-profile.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixTestUserProfile() {
  console.log('🔧 Fixing test user profile...\n');

  try {
    // Step 1: Find the test user
    console.log('1️⃣ Finding test@bloom.com...');
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const testUser = users.find(u => u.email === 'test@bloom.com');
    
    if (!testUser) {
      console.log('❌ Test user not found');
      return;
    }
    
    const userId = testUser.id;
    console.log('✅ Found user ID:', userId);
    
    // Step 2: Delete any existing profile (to avoid duplicates)
    console.log('\n2️⃣ Removing any existing profile...');
    await supabase
      .from('user_profiles')
      .delete()
      .eq('id', userId);
    
    // Step 3: Create proper profile (without onboarding_completed field)
    console.log('\n3️⃣ Creating new profile...');
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        first_name: 'Sarah',
        last_name: 'Johnson',
        phone: '(555) 123-4567',
        postpartum_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 45 days ago, date only
        number_of_children: 2,
        emergency_contact_name: 'John Johnson',
        emergency_contact_phone: '(555) 987-6543',
        emergency_contact_relationship: 'spouse',
        timezone: 'America/New_York',
        enrollment_status: 'active', // Use enrollment_status instead
        hipaa_consent: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
    if (profileError) {
      console.error('❌ Failed to create profile:', profileError);
      return;
    }
    
    console.log('✅ Profile created successfully');
    
    // Step 4: Verify the profile
    console.log('\n4️⃣ Verifying profile...');
    const { data: profile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (profile) {
      console.log('✅ Profile verified:');
      console.log('   Name:', profile.first_name, profile.last_name);
      console.log('   Phone:', profile.phone);
      console.log('   Enrollment status:', profile.enrollment_status);
      console.log('   Days postpartum:', Math.floor((Date.now() - new Date(profile.postpartum_date)) / (1000 * 60 * 60 * 24)));
    } else {
      console.log('❌ Could not verify profile');
      if (fetchError) console.error('   Error:', fetchError.message);
    }
    
    // Step 5: Test login again
    console.log('\n5️⃣ Testing login...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'test@bloom.com',
      password: 'TestBloom123!'
    });
    
    if (authError) {
      console.error('❌ Login failed:', authError.message);
    } else {
      console.log('✅ Login successful!');
      
      // Try to fetch profile through auth
      const { data: profileCheck } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();
        
      if (profileCheck) {
        console.log('✅ Profile accessible after login');
      } else {
        console.log('❌ Profile not accessible after login');
      }
      
      // Sign out
      await supabase.auth.signOut();
    }
    
    console.log('\n✨ Fix complete! Test user should now work properly.');
    console.log('\n📝 Login credentials:');
    console.log('   Email: test@bloom.com');
    console.log('   Password: TestBloom123!');
    
  } catch (error) {
    console.error('\n❌ Unexpected error:', error.message);
    console.error(error);
  }
}

// Run the fix
fixTestUserProfile();