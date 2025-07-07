#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debugUserPreferences() {
  console.log('=== USER PREFERENCES DEBUG ===\n');
  
  const testUserId = '2a6835a5-6041-463f-b6bb-f6c5d38bea59';
  
  // 1. Check if user exists in auth.users
  console.log('1. Checking if user exists in auth.users...');
  const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(testUserId);
  
  if (authError) {
    console.log('   ❌ Error:', authError.message);
  } else {
    console.log('   ✅ User found:', authUser.email);
  }
  
  // 2. Check existing preferences
  console.log('\n2. Checking existing preferences...');
  const { data: prefs, error: prefsError } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', testUserId);
  
  if (prefsError) {
    console.log('   ❌ Error:', prefsError);
  } else {
    console.log('   Preferences found:', prefs.length);
    if (prefs.length > 0) {
      console.log('   Data:', JSON.stringify(prefs[0], null, 2));
    }
  }
  
  // 3. Test insert
  console.log('\n3. Testing insert operation...');
  const testData = {
    user_id: testUserId,
    privacy_settings: { analytics_enabled: true },
    notification_preferences: { 
      appointment_reminders: { email: true, sms: false }
    },
    updated_at: new Date().toISOString()
  };
  
  const { data: insertData, error: insertError } = await supabase
    .from('user_preferences')
    .upsert(testData, { onConflict: 'user_id' })
    .select();
  
  if (insertError) {
    console.log('   ❌ Insert error:', insertError);
  } else {
    console.log('   ✅ Insert successful');
  }
  
  // 4. Check RLS policies
  console.log('\n4. Checking RLS policies...');
  const { data: policies } = await supabase
    .from('pg_policies')
    .select('*')
    .eq('tablename', 'user_preferences');
    
  console.log('   Found', policies?.length || 0, 'policies');
  policies?.forEach(p => {
    console.log(`   - ${p.policyname}: ${p.cmd} (${p.roles})`);
  });
}

debugUserPreferences().catch(console.error);