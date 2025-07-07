#!/usr/bin/env node

/**
 * Test Database Functions
 * Checks current state and executes SQL commands
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testDatabase() {
  console.log('=== TESTING DATABASE STATE ===\n');

  // Test 1: Check if course_progress table exists
  console.log('1. Checking course_progress table...');
  const { data: cpData, error: cpError } = await supabase
    .from('course_progress')
    .select('*')
    .limit(1);
  
  if (cpError) {
    console.log('   ❌ Error:', cpError.message);
  } else {
    console.log('   ✅ Table exists, sample data:', cpData);
  }

  // Test 2: Check if courses table exists
  console.log('\n2. Checking courses table...');
  const { data: coursesData, error: coursesError } = await supabase
    .from('courses')
    .select('id, slug, title')
    .limit(3);
  
  if (coursesError) {
    console.log('   ❌ Error:', coursesError.message);
  } else {
    console.log('   ✅ Table exists, courses:', coursesData);
  }

  // Test 3: Check if user_profiles table exists
  console.log('\n3. Checking user_profiles table...');
  const { data: upData, error: upError } = await supabase
    .from('user_profiles')
    .select('id')
    .limit(1);
  
  if (upError) {
    console.log('   ❌ Error:', upError.message);
  } else {
    console.log('   ✅ Table exists');
  }

  // Test 4: Check if user_achievements table exists
  console.log('\n4. Checking user_achievements table...');
  const { data: uaData, error: uaError } = await supabase
    .from('user_achievements')
    .select('*')
    .limit(1);
  
  if (uaError) {
    console.log('   ❌ Error:', uaError.message);
  } else {
    console.log('   ✅ Table exists');
  }

  // Test 5: Check existing functions
  console.log('\n5. Checking existing functions...');
  const { data: funcData, error: funcError } = await supabase.rpc('get_user_dashboard_data', {
    p_user_id: '00000000-0000-0000-0000-000000000000'
  });

  if (funcError) {
    console.log('   ❌ get_user_dashboard_data error:', funcError.message);
  } else {
    console.log('   ✅ get_user_dashboard_data exists');
  }

  // Test other functions
  const functions = [
    'get_user_course_stats',
    'get_all_courses_with_user_progress',
    'get_user_workbook_status'
  ];

  for (const func of functions) {
    const { error } = await supabase.rpc(func, {
      p_user_id: '00000000-0000-0000-0000-000000000000'
    });
    
    if (error) {
      console.log(`   ❌ ${func} error:`, error.message);
    } else {
      console.log(`   ✅ ${func} exists`);
    }
  }

  console.log('\n=== RECOMMENDATION ===');
  console.log('Based on the results above, you should:');
  console.log('1. Run FIX_DASHBOARD_FINAL_V2.sql in Supabase SQL Editor');
  console.log('2. This will create/update the missing functions');
  console.log('3. Clear browser data and test the dashboard');
}

testDatabase().catch(console.error);