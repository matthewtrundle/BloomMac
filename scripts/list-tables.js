#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function listTables() {
  console.log('=== LISTING DATABASE TABLES ===\n');

  // Try to query a known table to test connection
  const { data: test, error: testError } = await supabase
    .from('admin_users')
    .select('count', { count: 'exact', head: true });

  if (testError) {
    console.log('Connection test error:', testError.message);
  } else {
    console.log('✓ Successfully connected to database');
  }

  // List of tables to check
  const tablesToCheck = [
    'admin_users',
    'user_profiles',
    'subscribers',
    'email_templates',
    'email_queue',
    'email_sends',
    'email_logs',
    'email_analytics',
    'newsletter_subscribers',
    'contact_submissions',
    'analytics_events'
  ];

  console.log('\nChecking tables:');
  for (const table of tablesToCheck) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.log(`  ❌ ${table}: Does not exist or no access`);
    } else {
      console.log(`  ✓ ${table}: Exists (${count} rows)`);
    }
  }
}

listTables().catch(console.error);