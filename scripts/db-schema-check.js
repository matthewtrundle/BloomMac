#!/usr/bin/env node

/**
 * Database Schema Check Tool
 * Checks what tables and columns exist in the database
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSchema() {
  console.log('=== DATABASE SCHEMA CHECK ===\n');

  try {
    // First, let's try to query user_preferences directly
    console.log('Checking user_preferences table...');
    const { data: prefData, error: prefError } = await supabase
      .from('user_preferences')
      .select('*')
      .limit(1);

    if (prefError) {
      console.log('❌ user_preferences table error:', prefError.message);
      console.log('   Code:', prefError.code);
      console.log('   Details:', prefError.details);
    } else {
      console.log('✅ user_preferences table exists');
      if (prefData && prefData.length > 0) {
        console.log('   Columns found:', Object.keys(prefData[0]));
      } else {
        console.log('   Table is empty, cannot determine columns');
      }
    }

    console.log('\n---\n');

    // Check other related tables
    const tablesToCheck = [
      'user_profiles',
      'users',
      'profiles',
      'preferences',
      'settings',
      'user_settings'
    ];

    for (const table of tablesToCheck) {
      console.log(`Checking ${table} table...`);
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact' })
        .limit(1);

      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: exists (${count} rows)`);
        if (data && data.length > 0) {
          console.log(`   Columns: ${Object.keys(data[0]).join(', ')}`);
        }
      }
      console.log('');
    }

  } catch (error) {
    console.error('Error checking schema:', error);
  }
}

checkSchema();