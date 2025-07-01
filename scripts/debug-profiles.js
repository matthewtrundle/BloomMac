#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debugProfiles() {
  console.log('🔍 Debugging user_profiles table...\n');

  try {
    // Check if table exists and its structure
    console.log('1. Checking table structure...');
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);

    if (error && error.code === '42P01') {
      console.log('❌ user_profiles table does not exist!');
      console.log('Run the SQL from scripts/fix-user-profiles.sql');
      return;
    }

    console.log('✅ user_profiles table exists');

    // Check for any existing profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*');

    if (profilesError) {
      console.error('❌ Error querying profiles:', profilesError);
      return;
    }

    console.log(`📊 Found ${profiles.length} existing profiles`);
    
    if (profiles.length > 0) {
      console.log('Sample profiles:');
      profiles.slice(0, 3).forEach(profile => {
        console.log(`  ${profile.email} (${profile.first_name} ${profile.last_name})`);
      });
    }

    // Test creating a profile
    console.log('\n2. Testing profile creation...');
    const testUserId = 'test-' + Date.now();
    const testEmail = `profile-test-${Date.now()}@test.com`;

    const { data: insertData, error: insertError } = await supabase
      .from('user_profiles')
      .insert({
        id: testUserId,
        email: testEmail,
        first_name: 'Test',
        last_name: 'User',
        status: 'active'
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Profile creation failed:', insertError);
    } else {
      console.log('✅ Profile creation successful');
      
      // Clean up test profile
      await supabase
        .from('user_profiles')
        .delete()
        .eq('id', testUserId);
      console.log('🧹 Test profile cleaned up');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

debugProfiles().catch(console.error);