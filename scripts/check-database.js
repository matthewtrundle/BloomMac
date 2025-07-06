#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkDatabase() {
  console.log('=== DATABASE SCHEMA CHECK ===\n');

  // Check what tables exist
  const { data: tables } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .order('table_name');

  console.log('TABLES IN DATABASE:');
  tables?.forEach(t => console.log(`  - ${t.table_name}`));

  // Check specific tables we commonly use
  const importantTables = [
    'subscribers',
    'email_templates',
    'email_queue',
    'admin_users',
    'user_profiles',
    'email_analytics',
    'email_logs'
  ];

  for (const tableName of importantTables) {
    console.log(`\n=== TABLE: ${tableName} ===`);
    
    // Get column information
    const { data: columns } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_schema', 'public')
      .eq('table_name', tableName)
      .order('ordinal_position');

    if (columns && columns.length > 0) {
      console.log('Columns:');
      columns.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : ''}`);
      });

      // Get sample data
      const { data: sample, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(2);

      if (sample && sample.length > 0) {
        console.log('\nSample data:');
        console.log(JSON.stringify(sample[0], null, 2));
      }
    } else {
      console.log('  ❌ Table does not exist');
    }
  }
}

// Run the check
checkDatabase().catch(console.error);