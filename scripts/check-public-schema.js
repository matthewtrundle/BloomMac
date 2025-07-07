#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSchema() {
  console.log('=== CHECKING PUBLIC SCHEMA TABLES ===\n');

  // Check course_progress in public schema
  console.log('1. Checking public.course_progress...');
  const { data: cp, error: cpError } = await supabase
    .from('course_progress')
    .select('*')
    .limit(1);
  
  if (cpError) {
    console.log('   ❌ Not found in public schema');
  } else {
    console.log('   ✅ Found in public schema');
    console.log('   Sample:', cp);
  }

  // Check courses table
  console.log('\n2. Checking public.courses...');
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('id, slug, title')
    .limit(2);
  
  if (coursesError) {
    console.log('   ❌ Not found in public schema');
  } else {
    console.log('   ✅ Found in public schema');
    console.log('   Courses:', courses);
  }

  // Check what tables exist in public schema
  console.log('\n3. Listing all tables in public schema...');
  const { data: tables, error: tablesError } = await supabase.rpc('get_tables_list');
  
  if (tablesError) {
    console.log('   Will query information_schema directly...');
    
    // Try a different approach - check known tables
    const knownTables = [
      'user_profiles',
      'course_progress', 
      'courses',
      'course_enrollments',
      'user_achievements',
      'subscribers'
    ];
    
    for (const table of knownTables) {
      const { error } = await supabase.from(table).select('id').limit(1);
      console.log(`   ${table}: ${error ? '❌ Not found' : '✅ Exists'}`);
    }
  }
}

checkSchema().catch(console.error);