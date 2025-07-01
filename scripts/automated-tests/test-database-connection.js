#!/usr/bin/env node

/**
 * Test 1: Database Connection Verification
 * Ensures Supabase is properly connected and no legacy DB references exist
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
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

async function testSupabaseConnection() {
  console.log('\n🔌 Testing Supabase Connection...\n');
  
  // Test 1.1: Basic connection
  try {
    const { data, error } = await supabase
      .from('subscribers')
      .select('count')
      .limit(1);
    
    logTest('Supabase connection established', !error, error?.message);
  } catch (err) {
    logTest('Supabase connection established', false, err.message);
  }
  
  // Test 1.2: CRUD operations
  try {
    // Create test record
    const testData = {
      email: `test-${Date.now()}@automated-test.com`,
      first_name: 'Automated',
      last_name: 'Test',
      status: 'active',
      source: 'automated_test'
    };
    
    const { data: created, error: createError } = await supabase
      .from('subscribers')
      .insert(testData)
      .select()
      .single();
    
    logTest('CREATE operation works', !createError, createError?.message);
    
    if (created) {
      // Read
      const { data: read, error: readError } = await supabase
        .from('subscribers')
        .select('*')
        .eq('id', created.id)
        .single();
      
      logTest('READ operation works', !readError && read?.email === testData.email);
      
      // Update
      const { error: updateError } = await supabase
        .from('subscribers')
        .update({ status: 'inactive' })
        .eq('id', created.id);
      
      logTest('UPDATE operation works', !updateError, updateError?.message);
      
      // Delete
      const { error: deleteError } = await supabase
        .from('subscribers')
        .delete()
        .eq('id', created.id);
      
      logTest('DELETE operation works', !deleteError, deleteError?.message);
    }
  } catch (err) {
    logTest('CRUD operations', false, err.message);
  }
  
  // Test 1.3: Check for legacy database references
  console.log('\n🔍 Checking for legacy database references...\n');
  
  const legacyPatterns = [
    'mysql',
    'mongodb',
    'postgres(?!.*supabase)',
    'sequelize',
    'mongoose',
    'typeorm'
  ];
  
  const excludeDirs = [
    'node_modules',
    '.next',
    'out',
    '.git',
    'test-results'
  ];
  
  let legacyReferences = [];
  
  const files = glob.sync('**/*.{js,ts,tsx}', {
    ignore: excludeDirs.map(d => `${d}/**`)
  });
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      legacyPatterns.forEach(pattern => {
        const regex = new RegExp(pattern, 'i');
        if (regex.test(line) && !line.includes('//') && !line.includes('*')) {
          legacyReferences.push({
            file,
            line: index + 1,
            content: line.trim(),
            pattern
          });
        }
      });
    });
  });
  
  logTest('No legacy database references found', legacyReferences.length === 0);
  
  if (legacyReferences.length > 0) {
    console.log('\n⚠️  Legacy database references found:');
    legacyReferences.slice(0, 5).forEach(ref => {
      console.log(`   ${ref.file}:${ref.line} - ${ref.pattern}`);
    });
    if (legacyReferences.length > 5) {
      console.log(`   ... and ${legacyReferences.length - 5} more`);
    }
  }
  
  // Test 1.4: Verify all required tables exist
  console.log('\n📊 Verifying required tables...\n');
  
  const requiredTables = [
    'subscribers',
    'contact_submissions',
    'career_applications',
    'email_logs',
    'email_automation_triggers',
    'analytics_events',
    'admin_users',
    'user_profiles',
    'appointments',
    'payment_methods'
  ];
  
  for (const table of requiredTables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('count')
        .limit(1);
      
      logTest(`Table '${table}' exists`, !error, error?.message);
    } catch (err) {
      logTest(`Table '${table}' exists`, false, err.message);
    }
  }
  
  // Summary
  console.log('\n📊 Database Connection Test Summary:');
  console.log(`   ✅ Passed: ${testsPassed}`);
  console.log(`   ❌ Failed: ${testsFailed}`);
  
  process.exit(testsFailed > 0 ? 1 : 0);
}

// Run tests
testSupabaseConnection().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});