#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function listAllTables() {
  console.log('=== CHECKING ALL DATABASE TABLES ===\n');

  // Try to query common table names
  const commonTables = [
    'subscribers',
    'email_templates',
    'email_sequences',
    'email_queue',
    'email_sends',
    'email_logs',
    'email_analytics',
    'sequence_enrollments',
    'admin_users',
    'user_profiles',
    'contact_submissions',
    'analytics_events'
  ];

  const existingTables = [];

  for (const table of commonTables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (!error) {
        existingTables.push({ table, count });
        console.log(`✅ ${table}: ${count} rows`);
      }
    } catch (e) {
      // Table doesn't exist
    }
  }

  console.log('\n=== EXISTING TABLES SUMMARY ===');
  console.table(existingTables);

  // Now check structure of existing tables
  for (const { table } of existingTables) {
    console.log(`\n=== STRUCTURE OF ${table} ===`);
    const { data, error } = await supabase.from(table).select('*').limit(1);
    
    if (!error && data && data.length > 0) {
      console.log('Columns:', Object.keys(data[0]));
      console.log('Sample row:', JSON.stringify(data[0], null, 2));
    }
  }
}

listAllTables().catch(console.error);