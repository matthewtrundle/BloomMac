#!/usr/bin/env node

/**
 * Test 8: Data Migration Verification
 * Ensures all required tables exist and have proper structure
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

let testsPassed = 0;
let testsFailed = 0;

function logTest(testName, passed, error = null) {
  if (passed) {
    console.log(`✅ ${testName}`);
    testsPassed++;
  } else {
    console.log(`❌ ${testName}`);
    if (error) console.log(`   Error: ${error}`);
    testsFailed++;
  }
}

async function testDataMigration() {
  console.log('\n🗄️ Testing Data Migration & Table Structure...\n');
  
  // Test 8.1: Core tables
  console.log('Verifying core tables...\n');
  
  const coreTables = {
    'subscribers': ['id', 'email', 'first_name', 'last_name', 'status', 'source'],
    'contact_submissions': ['id', 'name', 'email', 'phone', 'service', 'message', 'status'],
    'career_applications': ['id', 'first_name', 'last_name', 'email', 'position', 'status'],
    'email_logs': ['id', 'recipient', 'type', 'status', 'created_at'],
    'analytics_events': ['id', 'event_type', 'event_data', 'created_at']
  };
  
  for (const [table, requiredColumns] of Object.entries(coreTables)) {
    try {
      // Get table structure
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        logTest(`Table '${table}' exists`, false, error.message);
        continue;
      }
      
      logTest(`Table '${table}' exists`, true);
      
      // Check columns if we have data
      if (data && data.length > 0) {
        const sampleRow = data[0];
        const existingColumns = Object.keys(sampleRow);
        
        for (const column of requiredColumns) {
          logTest(`  └─ Column '${column}' in ${table}`, existingColumns.includes(column));
        }
      } else {
        // Table exists but is empty - check structure differently
        console.log(`   ℹ️  Table '${table}' is empty, skipping column verification`);
      }
      
    } catch (err) {
      logTest(`Table '${table}' check`, false, err.message);
    }
  }
  
  // Test 8.2: Email automation tables
  console.log('\n\nVerifying email automation tables...\n');
  
  const emailTables = [
    'email_sequences',
    'sequence_emails',
    'email_automation_logs',
    'email_automation_triggers',
    'email_templates'
  ];
  
  for (const table of emailTables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('count')
        .limit(1);
      
      logTest(`Email table '${table}' exists`, !error, error?.message);
    } catch (err) {
      logTest(`Email table '${table}' check`, false, err.message);
    }
  }
  
  // Test 8.3: User platform tables
  console.log('\n\nVerifying user platform tables...\n');
  
  const userTables = [
    'user_profiles',
    'appointments',
    'appointment_types',
    'payment_methods',
    'user_notifications',
    'user_achievements'
  ];
  
  for (const table of userTables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('count')
        .limit(1);
      
      logTest(`User table '${table}' exists`, !error, error?.message);
    } catch (err) {
      logTest(`User table '${table}' check`, false, err.message);
    }
  }
  
  // Test 8.4: Row Level Security (RLS)
  console.log('\n\nChecking Row Level Security...\n');
  
  try {
    // Query RLS policies
    const { data: policies, error } = await supabase
      .rpc('get_policies', { schema_name: 'public' })
      .select('*');
    
    if (!error && policies) {
      const tablesWithRLS = [...new Set(policies.map(p => p.tablename))];
      console.log(`   Found RLS policies on ${tablesWithRLS.length} tables`);
      
      // Check critical tables have RLS
      const criticalTables = ['user_profiles', 'appointments', 'payment_methods'];
      for (const table of criticalTables) {
        logTest(`RLS enabled on '${table}'`, tablesWithRLS.includes(table));
      }
    } else {
      // Try alternative method
      const criticalTables = ['user_profiles', 'appointments'];
      console.log('   ℹ️  Cannot query policies directly, checking table access...');
      
      for (const table of criticalTables) {
        // Try to query without auth - should fail if RLS is enabled
        const publicSupabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );
        
        const { data, error } = await publicSupabase
          .from(table)
          .select('id')
          .limit(1);
        
        // If RLS is enabled, anonymous access should be restricted
        logTest(`RLS appears active on '${table}'`, 
          !data || data.length === 0 || !!error);
      }
    }
  } catch (err) {
    console.log('   ⚠️  Cannot verify RLS policies:', err.message);
  }
  
  // Test 8.5: Indexes for performance
  console.log('\n\nChecking database indexes...\n');
  
  const criticalIndexes = [
    { table: 'subscribers', column: 'email' },
    { table: 'contact_submissions', column: 'email' },
    { table: 'appointments', column: 'user_id' },
    { table: 'email_logs', column: 'recipient' }
  ];
  
  console.log('   ℹ️  Index verification requires database admin access');
  console.log('   📝 Recommended indexes for performance:');
  criticalIndexes.forEach(idx => {
    console.log(`      - ${idx.table}.${idx.column}`);
  });
  
  // Test 8.6: Check for orphaned data
  console.log('\n\nChecking data integrity...\n');
  
  try {
    // Check for email logs without valid subscribers
    const { data: orphanedLogs, error: orphanError } = await supabase
      .from('email_logs')
      .select('id, recipient')
      .limit(10);
    
    if (!orphanError && orphanedLogs) {
      // For each log, check if subscriber exists
      let orphanCount = 0;
      for (const log of orphanedLogs) {
        const { data: subscriber } = await supabase
          .from('subscribers')
          .select('id')
          .eq('email', log.recipient)
          .single();
        
        if (!subscriber) orphanCount++;
      }
      
      logTest('No orphaned email logs found', orphanCount === 0);
      if (orphanCount > 0) {
        console.log(`   ⚠️  Found ${orphanCount} email logs without subscribers`);
      }
    }
  } catch (err) {
    console.log('   ℹ️  Skipping orphan check:', err.message);
  }
  
  // Test 8.7: Check table counts
  console.log('\n\nGathering table statistics...\n');
  
  const tableStats = {};
  const tablesToCount = [
    'subscribers',
    'contact_submissions',
    'career_applications',
    'email_logs',
    'appointments',
    'user_profiles'
  ];
  
  for (const table of tablesToCount) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (!error) {
        tableStats[table] = count || 0;
        console.log(`   📊 ${table}: ${count || 0} records`);
      }
    } catch (err) {
      tableStats[table] = 'error';
    }
  }
  
  // Test 8.8: Verify no old database references
  console.log('\n\nVerifying no legacy database connections...\n');
  
  const fs = require('fs');
  const path = require('path');
  const glob = require('glob');
  
  const legacyPatterns = [
    /mysql\.createConnection/i,
    /mongodb\.connect/i,
    /new Sequelize/i,
    /typeorm\.createConnection/i
  ];
  
  const files = glob.sync('**/*.{js,ts}', {
    ignore: ['node_modules/**', '.next/**', 'scripts/automated-tests/**']
  });
  
  let legacyFound = false;
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    for (const pattern of legacyPatterns) {
      if (pattern.test(content)) {
        console.log(`   ⚠️  Legacy pattern found in ${file}`);
        legacyFound = true;
        break;
      }
    }
  });
  
  logTest('No legacy database connections found', !legacyFound);
  
  // Summary
  console.log('\n📊 Data Migration Test Summary:');
  console.log(`   ✅ Passed: ${testsPassed}`);
  console.log(`   ❌ Failed: ${testsFailed}`);
  console.log('\n📈 Database Statistics:');
  Object.entries(tableStats).forEach(([table, count]) => {
    console.log(`   - ${table}: ${count} records`);
  });
  
  process.exit(testsFailed > 0 ? 1 : 0);
}

// Run tests
testDataMigration().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});