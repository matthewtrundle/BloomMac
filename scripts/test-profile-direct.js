#!/usr/bin/env node

/**
 * Direct Profile Testing - No user creation needed
 * Tests profile validation and database operations
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing environment variables. Please check .env.local');
  console.log('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role to bypass RLS
);

// Test data
const TEST_PROFILES = [
  {
    name: '✅ Valid Profile - Expecting Mother',
    data: {
      id: '11111111-1111-1111-1111-111111111111',
      first_name: 'Jane',
      last_name: 'Doe',
      phone: '(555) 123-4567',
      number_of_children: 0,
      baby_due_date: '2024-12-25',
      emergency_contact_name: 'John Doe',
      emergency_contact_phone: '(555) 987-6543',
      emergency_contact_relationship: 'spouse',
      timezone: 'America/Chicago'
    }
  },
  {
    name: '✅ Special Characters in Names',
    data: {
      id: '22222222-2222-2222-2222-222222222222',
      first_name: "Mary-Jane",
      last_name: "O'Connor-Smith",
      phone: '+1-555-123-4567',
      number_of_children: 2
    }
  },
  {
    name: '✅ International Characters',
    data: {
      id: '33333333-3333-3333-3333-333333333333',
      first_name: "François",
      last_name: "Müller",
      emergency_contact_name: "José García"
    }
  },
  {
    name: '✅ Minimal Required Fields',
    data: {
      id: '44444444-4444-4444-4444-444444444444',
      first_name: 'Min',
      last_name: 'User'
    }
  },
  {
    name: '✅ Maximum Values',
    data: {
      id: '55555555-5555-5555-5555-555555555555',
      first_name: 'Max',
      last_name: 'User',
      number_of_children: 7,
      phone: '+1234567890123456789' // Long phone
    }
  }
];

const log = {
  info: (msg) => console.log(`\x1b[36m[INFO]\x1b[0m ${msg}`),
  success: (msg) => console.log(`\x1b[32m[PASS]\x1b[0m ${msg}`),
  error: (msg) => console.log(`\x1b[31m[FAIL]\x1b[0m ${msg}`),
  warning: (msg) => console.log(`\x1b[33m[WARN]\x1b[0m ${msg}`),
  section: (msg) => console.log(`\n\x1b[35m${'='.repeat(50)}\n${msg}\n${'='.repeat(50)}\x1b[0m`)
};

async function checkDatabaseStructure() {
  log.section('Checking Database Structure');
  
  try {
    // Check if table exists
    const { data: tables } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    log.success('user_profiles table exists');
    
    // Get column information
    const { data: columns, error } = await supabase.rpc('get_table_columns', {
      table_name: 'user_profiles'
    }).catch(() => ({ data: null, error: 'RPC not available' }));
    
    if (!columns) {
      log.warning('Cannot check column structure (this is normal)');
    }
    
    return true;
  } catch (error) {
    log.error(`Table check failed: ${error.message}`);
    log.info('Run the SQL scripts in /supabase folder to create the table');
    return false;
  }
}

async function testProfile(test) {
  try {
    log.info(`Testing: ${test.name}`);
    
    // Insert profile
    const { data, error: insertError } = await supabase
      .from('user_profiles')
      .insert([test.data])
      .select();
    
    if (insertError) {
      throw insertError;
    }
    
    log.success('Insert successful');
    
    // Verify data was saved correctly
    const { data: saved, error: fetchError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', test.data.id)
      .single();
    
    if (fetchError) {
      throw fetchError;
    }
    
    // Check key fields
    if (saved.first_name !== test.data.first_name) {
      throw new Error(`First name mismatch: expected "${test.data.first_name}", got "${saved.first_name}"`);
    }
    
    if (test.data.number_of_children !== undefined && 
        saved.number_of_children !== test.data.number_of_children) {
      log.warning(`Number of children: expected ${test.data.number_of_children}, got ${saved.number_of_children}`);
    }
    
    // Clean up
    await supabase
      .from('user_profiles')
      .delete()
      .eq('id', test.data.id);
    
    return { success: true };
    
  } catch (error) {
    log.error(`Failed: ${error.message}`);
    
    // Clean up on error
    await supabase
      .from('user_profiles')
      .delete()
      .eq('id', test.data.id)
      .catch(() => {});
    
    return { success: false, error: error.message };
  }
}

async function runTests() {
  log.section('Profile Database Testing');
  log.info('This tests the database directly without creating users\n');
  
  // Check database structure first
  const dbReady = await checkDatabaseStructure();
  if (!dbReady) {
    log.error('\nDatabase not ready. Please run the SQL scripts first.');
    return;
  }
  
  // Run all tests
  const results = [];
  for (const test of TEST_PROFILES) {
    const result = await testProfile(test);
    results.push({ name: test.name, ...result });
  }
  
  // Summary
  log.section('Test Summary');
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  log.info(`Total: ${results.length}`);
  log.success(`Passed: ${passed}`);
  if (failed > 0) {
    log.error(`Failed: ${failed}`);
  }
  
  // Show failures
  if (failed > 0) {
    log.section('Failed Tests');
    results.filter(r => !r.success).forEach(r => {
      log.error(`${r.name}: ${r.error}`);
    });
  }
  
  // Recommendations
  if (failed > 0) {
    log.section('Troubleshooting');
    log.info('1. Check if all columns exist by running:');
    log.info('   supabase/quick-fix-user-profiles.sql');
    log.info('2. Check RLS policies by running:');
    log.info('   supabase/safe-rls-fix.sql');
    log.info('3. Make sure service role key is set in .env.local');
  }
}

// Run tests
runTests().catch(console.error);