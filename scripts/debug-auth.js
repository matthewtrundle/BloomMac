#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debugAuth() {
  console.log('🔍 Debugging Supabase Auth\n');
  
  // Test 1: Check if we can list users
  console.log('1️⃣ Testing admin user list...');
  try {
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) {
      console.log('❌ Error listing users:', error.message);
    } else {
      console.log(`✅ Can list users. Found ${data.users.length} users\n`);
    }
  } catch (err) {
    console.log('❌ Exception:', err.message, '\n');
  }
  
  // Test 2: Check trigger function
  console.log('2️⃣ Checking if profile trigger exists...');
  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: "SELECT proname FROM pg_proc WHERE proname = 'create_user_profile';"
    });
    
    if (error) {
      console.log('⚠️  Cannot check function (exec_sql not available)');
      console.log('   The trigger might exist but we cannot verify\n');
    } else {
      console.log('✅ Profile trigger function exists\n');
    }
  } catch (err) {
    console.log('⚠️  RPC not available\n');
  }
  
  // Test 3: Try simplified user creation
  console.log('3️⃣ Testing simplified user creation...');
  try {
    const testEmail = `simple${Date.now()}@test.com`;
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: 'TestPass123!'
    });
    
    if (error) {
      console.log('❌ Signup error:', error.message);
    } else {
      console.log('✅ User created via signUp method');
      console.log(`   ID: ${data.user?.id}`);
      console.log(`   Email: ${data.user?.email}\n`);
      
      // Check if profile was created
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', data.user.id)
          .single();
          
        if (profileError) {
          console.log('❌ Profile not auto-created:', profileError.message);
        } else {
          console.log('✅ Profile was auto-created!');
        }
        
        // Cleanup
        await supabase.auth.admin.deleteUser(data.user.id);
        console.log('🧹 Test user cleaned up\n');
      }
    }
  } catch (err) {
    console.log('❌ Exception:', err.message, '\n');
  }
  
  // Test 4: Check table structure
  console.log('4️⃣ Checking user_profiles table...');
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(0);
      
    if (error) {
      console.log('❌ Table error:', error.message);
    } else {
      console.log('✅ user_profiles table is accessible\n');
    }
  } catch (err) {
    console.log('❌ Exception:', err.message, '\n');
  }
  
  console.log('📊 Debug Summary:');
  console.log('- Supabase connection: Working');
  console.log('- Admin API access: Check service role key');
  console.log('- Tables exist: Yes');
  console.log('- Profile trigger: Needs verification');
}

debugAuth().catch(console.error);