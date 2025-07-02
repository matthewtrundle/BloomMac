#!/usr/bin/env node
/**
 * Checks the test user profile status
 * Run with: node scripts/check-test-user-profile.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTestUser() {
  console.log('🔍 Checking test user profile...\n');

  try {
    // Step 1: Find the test user
    console.log('1️⃣ Finding test@bloom.com in auth system...');
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const testUser = users.find(u => u.email === 'test@bloom.com');
    
    if (!testUser) {
      console.log('❌ Test user not found in auth system');
      return;
    }
    
    console.log('✅ Found test user:');
    console.log('   User ID:', testUser.id);
    console.log('   Email:', testUser.email);
    console.log('   Created:', new Date(testUser.created_at).toLocaleString());
    
    // Step 2: Check for profiles with this ID
    console.log('\n2️⃣ Checking user_profiles table...');
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', testUser.id);
      
    if (profilesError) {
      console.error('❌ Error querying profiles:', profilesError.message);
      return;
    }
    
    console.log(`Found ${profiles.length} profile(s) for this user ID`);
    
    if (profiles.length === 0) {
      console.log('❌ No profile exists - needs to be created');
      
      // Try to create the profile
      console.log('\n3️⃣ Creating missing profile...');
      const { error: createError } = await supabase
        .from('user_profiles')
        .insert({
          id: testUser.id,
          first_name: 'Sarah',
          last_name: 'Johnson',
          phone: '(555) 123-4567',
          postpartum_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          number_of_children: 2,
          emergency_contact_name: 'John Johnson',
          emergency_contact_phone: '(555) 987-6543',
          emergency_contact_relationship: 'spouse',
          timezone: 'America/New_York',
          onboarding_completed: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
      if (createError) {
        console.error('❌ Failed to create profile:', createError.message);
      } else {
        console.log('✅ Profile created successfully!');
      }
      
    } else if (profiles.length === 1) {
      console.log('✅ Profile exists:');
      const profile = profiles[0];
      console.log('   Name:', profile.first_name, profile.last_name);
      console.log('   Phone:', profile.phone);
      console.log('   Onboarding completed:', profile.onboarding_completed ? 'Yes' : 'No');
      console.log('   Created:', new Date(profile.created_at).toLocaleString());
      
    } else {
      console.log('⚠️  Multiple profiles found! This may cause issues.');
      profiles.forEach((profile, index) => {
        console.log(`\n   Profile ${index + 1}:`);
        console.log('   Name:', profile.first_name, profile.last_name);
        console.log('   Created:', new Date(profile.created_at).toLocaleString());
      });
    }
    
    // Step 3: Check other related tables
    console.log('\n4️⃣ Checking related data...');
    
    // Course enrollment
    const { data: enrollments } = await supabase
      .from('course_enrollments')
      .select('*')
      .eq('user_id', testUser.id);
    console.log(`   Course enrollments: ${enrollments?.length || 0}`);
    
    // Workbook responses
    const { data: responses } = await supabase
      .from('user_workbook_responses')
      .select('*')
      .eq('user_id', testUser.id);
    console.log(`   Workbook responses: ${responses?.length || 0}`);
    
    // Achievements
    const { data: achievements } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', testUser.id);
    console.log(`   Achievements: ${achievements?.length || 0}`);
    
    console.log('\n✅ Check complete!');
    
  } catch (error) {
    console.error('\n❌ Unexpected error:', error.message);
    console.error(error);
  }
}

// Run the check
checkTestUser();