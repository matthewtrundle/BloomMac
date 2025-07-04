#!/usr/bin/env node

/**
 * Database Helper Script
 * Run with: node scripts/db_helper.js [command]
 * 
 * Commands:
 *   tables     - List all tables with row counts
 *   schema     - Show schema for a specific table
 *   query      - Run a custom SQL query
 *   check-auth - Check authentication setup
 *   audit      - Full database audit
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  }
);

// Command line arguments
const command = process.argv[2];
const args = process.argv.slice(3);

// Helper function to setup query function
async function ensureQueryFunction() {
  const { error } = await supabase.rpc('query', {
    query: `
      CREATE OR REPLACE FUNCTION query(query text)
      RETURNS json
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public, pg_temp
      AS $$
      DECLARE
        result json;
      BEGIN
        EXECUTE 'SELECT json_agg(row_to_json(t)) FROM (' || query || ') t' INTO result;
        RETURN result;
      END;
      $$;
    `
  });
  
  if (error && !error.message.includes('already exists')) {
    console.error('Error creating query function:', error);
  }
}

// Command: List all tables
async function listTables() {
  console.log('📊 DATABASE TABLES:\n');
  
  const tables = [
    'admin_users', 'user_profiles', 'subscribers', 'newsletter_subscribers',
    'analytics_events', 'contact_submissions', 'career_applications',
    'email_queue', 'email_sends', 'email_logs', 'email_templates',
    'admin_activity_log', 'conversion_events', 'chatbot_interactions',
    'newsletter_sends'
  ];
  
  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.log(`❌ ${table.padEnd(25)} - Does not exist or error`);
    } else {
      console.log(`✅ ${table.padEnd(25)} - ${count} rows`);
    }
  }
}

// Command: Show table schema
async function showSchema(tableName) {
  if (!tableName) {
    console.error('Usage: node db_helper.js schema <table_name>');
    return;
  }
  
  console.log(`\n📋 SCHEMA FOR TABLE: ${tableName}\n`);
  
  await ensureQueryFunction();
  
  const { data, error } = await supabase.rpc('query', {
    query: `
      SELECT 
        ordinal_position as "#",
        column_name as "Column",
        data_type as "Type",
        is_nullable as "Nullable",
        column_default as "Default"
      FROM information_schema.columns
      WHERE table_schema = 'public' 
        AND table_name = '${tableName}'
      ORDER BY ordinal_position
    `
  }).single();
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  if (data) {
    console.table(JSON.parse(data));
  } else {
    console.log('Table not found');
  }
}

// Command: Run custom query
async function runQuery(query) {
  if (!query) {
    console.error('Usage: node db_helper.js query "SELECT * FROM table"');
    return;
  }
  
  console.log('\n🔍 QUERY RESULT:\n');
  
  await ensureQueryFunction();
  
  const { data, error } = await supabase.rpc('query', {
    query: query
  }).single();
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  if (data) {
    const result = JSON.parse(data);
    if (Array.isArray(result) && result.length > 0) {
      console.table(result);
    } else {
      console.log('No results');
    }
  }
}

// Command: Check authentication setup
async function checkAuth() {
  console.log('\n🔐 AUTHENTICATION SETUP CHECK:\n');
  
  // Check admin_users
  const { data: adminUsers, count: adminCount } = await supabase
    .from('admin_users')
    .select('id, email, role, is_active', { count: 'exact' });
  
  console.log(`Admin Users (admin_users table): ${adminCount || 0}`);
  if (adminUsers && adminUsers.length > 0) {
    console.table(adminUsers);
  }
  
  // Check user_profiles
  const { data: userProfiles, count: userCount } = await supabase
    .from('user_profiles')
    .select('id, email, role', { count: 'exact' });
  
  console.log(`\nUser Profiles (user_profiles table): ${userCount || 0}`);
  if (userProfiles && userProfiles.length > 0) {
    console.table(userProfiles);
  }
  
  // Check for conflicts
  console.log('\n⚠️  POTENTIAL ISSUES:');
  
  if (adminCount > 0 && userCount > 0) {
    console.log('- Both admin_users and user_profiles have data');
    console.log('- Ensure authentication routes check the correct table');
  }
  
  // Check if tables have role column
  await ensureQueryFunction();
  
  const { data: roleCheck } = await supabase.rpc('query', {
    query: `
      SELECT 
        table_name,
        column_name
      FROM information_schema.columns
      WHERE table_schema = 'public' 
        AND column_name = 'role'
        AND table_name IN ('admin_users', 'user_profiles')
    `
  }).single();
  
  if (roleCheck) {
    console.log('\nRole columns found in:');
    console.table(JSON.parse(roleCheck));
  }
}

// Command: Full audit
async function auditDatabase() {
  console.log('\n🔍 FULL DATABASE AUDIT\n');
  
  await listTables();
  
  console.log('\n\n📊 DUPLICATE TABLE CHECK:\n');
  
  const duplicateGroups = [
    {
      name: 'Email Tables',
      tables: ['email_queue', 'email_sends', 'email_logs', 'email_templates']
    },
    {
      name: 'User Tables',
      tables: ['admin_users', 'user_profiles', 'profiles']
    },
    {
      name: 'Subscriber Tables',
      tables: ['subscribers', 'newsletter_subscribers']
    }
  ];
  
  for (const group of duplicateGroups) {
    console.log(`\n${group.name}:`);
    for (const table of group.tables) {
      const { count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (count !== null) {
        console.log(`  - ${table}: ${count} rows`);
      }
    }
  }
  
  console.log('\n\n🔒 RLS STATUS:\n');
  
  await ensureQueryFunction();
  
  const { data: rlsData } = await supabase.rpc('query', {
    query: `
      SELECT 
        schemaname,
        tablename,
        rowsecurity
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename
    `
  }).single();
  
  if (rlsData) {
    const tables = JSON.parse(rlsData);
    const rlsEnabled = tables.filter(t => t.rowsecurity).length;
    const rlsDisabled = tables.filter(t => !t.rowsecurity).length;
    
    console.log(`RLS Enabled: ${rlsEnabled} tables`);
    console.log(`RLS Disabled: ${rlsDisabled} tables`);
    
    if (rlsDisabled > 0) {
      console.log('\nTables without RLS:');
      tables.filter(t => !t.rowsecurity).forEach(t => {
        console.log(`  - ${t.tablename}`);
      });
    }
  }
}

// Main execution
async function main() {
  console.log('🔧 Bloom Database Helper\n');
  
  switch (command) {
    case 'tables':
      await listTables();
      break;
      
    case 'schema':
      await showSchema(args[0]);
      break;
      
    case 'query':
      await runQuery(args.join(' '));
      break;
      
    case 'check-auth':
      await checkAuth();
      break;
      
    case 'audit':
      await auditDatabase();
      break;
      
    default:
      console.log('Usage: node scripts/db_helper.js [command] [args]');
      console.log('\nCommands:');
      console.log('  tables              - List all tables with row counts');
      console.log('  schema <table>      - Show schema for a table');
      console.log('  query "<sql>"       - Run a custom SQL query');
      console.log('  check-auth          - Check authentication setup');
      console.log('  audit               - Full database audit');
      console.log('\nExamples:');
      console.log('  node scripts/db_helper.js tables');
      console.log('  node scripts/db_helper.js schema user_profiles');
      console.log('  node scripts/db_helper.js query "SELECT * FROM admin_users"');
      console.log('  node scripts/db_helper.js check-auth');
  }
  
  process.exit(0);
}

// Run the script
main().catch(console.error);