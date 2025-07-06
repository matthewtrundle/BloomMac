#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkProfileRelationships() {
  console.log('=== ANALYZING PROFILE TABLE RELATIONSHIPS ===\n');
  
  // Check user_profiles data
  console.log('1. USER_PROFILES TABLE:');
  const { data: userProfiles } = await supabase
    .from('user_profiles')
    .select('id, first_name, last_name, created_at')
    .limit(5);
  
  console.log('Sample records:');
  console.table(userProfiles);
  
  // Check profiles data
  console.log('\n2. PROFILES TABLE:');
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, email, first_name, last_name, created_at')
    .limit(5);
    
  console.log('Sample records:');
  console.table(profiles);
  
  // Check if IDs match auth.users
  console.log('\n3. CHECKING ID RELATIONSHIPS:');
  
  if (userProfiles && userProfiles.length > 0) {
    const userId = userProfiles[0].id;
    console.log(`\nChecking if user_profiles.id ${userId} exists in auth.users...`);
    
    // Try to get auth user
    const { data: authUser, error } = await supabase.auth.admin.getUserById(userId);
    if (authUser) {
      console.log(`✓ Found in auth.users with email: ${authUser.email}`);
    } else {
      console.log(`✗ Not found in auth.users`);
    }
  }
  
  if (profiles && profiles.length > 0) {
    const profileId = profiles[0].id;
    console.log(`\nChecking if profiles.id ${profileId} exists in auth.users...`);
    
    // Try to get auth user
    const { data: authUser, error } = await supabase.auth.admin.getUserById(profileId);
    if (authUser) {
      console.log(`✓ Found in auth.users with email: ${authUser.email}`);
    } else {
      console.log(`✗ Not found in auth.users`);
    }
  }
  
  // Check for duplicate users between tables
  console.log('\n4. CHECKING FOR DUPLICATE USERS:');
  
  const { data: allUserProfiles } = await supabase
    .from('user_profiles')
    .select('id');
    
  const { data: allProfiles } = await supabase
    .from('profiles')
    .select('id');
    
  const userProfileIds = new Set(allUserProfiles?.map(u => u.id) || []);
  const profileIds = new Set(allProfiles?.map(p => p.id) || []);
  
  const overlapping = [...userProfileIds].filter(id => profileIds.has(id));
  
  console.log(`Total in user_profiles: ${userProfileIds.size}`);
  console.log(`Total in profiles: ${profileIds.size}`);
  console.log(`Overlapping IDs: ${overlapping.length}`);
  
  if (overlapping.length > 0) {
    console.log('Overlapping user IDs:', overlapping);
  }
}

checkProfileRelationships();