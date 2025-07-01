#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkCurrentSchema() {
  console.log('🔍 Checking current database schema...\n');
  
  // Check subscribers table columns
  const { data: subscribersCols, error: subColsError } = await supabase
    .rpc('get_table_columns', { table_name: 'subscribers' });
    
  if (subColsError) {
    console.log('   Using alternative method to check subscribers columns...');
    const { data: sample, error: sampleError } = await supabase
      .from('subscribers')
      .select('*')
      .limit(1);
      
    if (!sampleError && sample.length > 0) {
      const cols = Object.keys(sample[0]);
      console.log('   Subscribers table columns:', cols.join(', '));
      console.log(`   ✅ Has 'source' column: ${cols.includes('source')}`);
    }
  } else {
    console.log('   Subscribers table columns:', subscribersCols.map(c => c.column_name).join(', '));
  }
  
  // Check email_automation_logs table columns
  const { data: logsCols, error: logsColsError } = await supabase
    .rpc('get_table_columns', { table_name: 'email_automation_logs' });
    
  if (logsColsError) {
    console.log('   Using alternative method to check email_automation_logs columns...');
    const { data: sample, error: sampleError } = await supabase
      .from('email_automation_logs')
      .select('*')
      .limit(1);
      
    if (!sampleError) {
      if (sample.length > 0) {
        const cols = Object.keys(sample[0]);
        console.log('   Email automation logs columns:', cols.join(', '));
        console.log(`   ✅ Has 'created_at' column: ${cols.includes('created_at')}`);
      } else {
        console.log('   Email automation logs table exists but is empty');
      }
    }
  } else {
    console.log('   Email automation logs columns:', logsCols.map(c => c.column_name).join(', '));
  }
  
  // Check if email_automation_triggers table exists
  const { data: triggersExists, error: triggersError } = await supabase
    .from('email_automation_triggers')
    .select('count')
    .limit(1);
    
  if (triggersError) {
    console.log(`   ❌ email_automation_triggers table: ${triggersError.message}`);
  } else {
    console.log('   ✅ email_automation_triggers table exists');
  }
}

async function applySchemaFixes() {
  console.log('\n📝 Applying schema fixes...\n');
  
  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, '..', 'supabase', 'fix-email-automation-schema.sql');
    const sqlContent = await fs.readFile(sqlPath, 'utf8');
    
    console.log('   Reading fix-email-automation-schema.sql...');
    
    // Note: Supabase doesn't support running raw SQL through the client
    // We'll need to run this in the Supabase SQL Editor
    console.log('\n⚠️  Important: The schema fixes need to be applied manually');
    console.log('   Please follow these steps:\n');
    console.log('   1. Go to your Supabase dashboard');
    console.log('   2. Navigate to the SQL Editor');
    console.log('   3. Copy and paste the contents of:');
    console.log(`      ${sqlPath}`);
    console.log('   4. Execute the SQL\n');
    
    console.log('   Alternatively, you can use the Supabase CLI:');
    console.log('   supabase db push < supabase/fix-email-automation-schema.sql\n');
    
  } catch (error) {
    console.error('   ❌ Error:', error.message);
  }
}

async function verifyFixes() {
  console.log('🔍 Verifying schema after fixes...\n');
  
  const issues = [];
  
  // Test 1: Check source column in subscribers
  try {
    const { data, error } = await supabase
      .from('subscribers')
      .select('id, email, source')
      .limit(1);
      
    if (error) {
      issues.push(`subscribers.source column: ${error.message}`);
    } else {
      console.log('   ✅ subscribers.source column is accessible');
    }
  } catch (err) {
    issues.push(`subscribers.source column: ${err.message}`);
  }
  
  // Test 2: Check created_at column in email_automation_logs
  try {
    const { data, error } = await supabase
      .from('email_automation_logs')
      .select('id, created_at')
      .limit(1);
      
    if (error) {
      issues.push(`email_automation_logs.created_at column: ${error.message}`);
    } else {
      console.log('   ✅ email_automation_logs.created_at column is accessible');
    }
  } catch (err) {
    issues.push(`email_automation_logs.created_at column: ${err.message}`);
  }
  
  // Test 3: Check email_automation_triggers table
  try {
    const { data, error } = await supabase
      .from('email_automation_triggers')
      .select('id, trigger_type, created_at')
      .limit(1);
      
    if (error) {
      issues.push(`email_automation_triggers table: ${error.message}`);
    } else {
      console.log('   ✅ email_automation_triggers table is accessible');
    }
  } catch (err) {
    issues.push(`email_automation_triggers table: ${err.message}`);
  }
  
  if (issues.length > 0) {
    console.log('\n❌ Issues found:');
    issues.forEach(issue => console.log(`   • ${issue}`));
    return false;
  } else {
    console.log('\n✅ All schema fixes verified successfully!');
    return true;
  }
}

async function main() {
  console.log('🛠️  Email Automation Schema Fix Tool\n');
  
  // Check environment
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing required environment variables!');
    console.error('   Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
    process.exit(1);
  }
  
  // Step 1: Check current schema
  await checkCurrentSchema();
  
  // Step 2: Show how to apply fixes
  await applySchemaFixes();
  
  // Step 3: Ask user to confirm when fixes are applied
  console.log('📋 After applying the fixes, run this script again with --verify flag');
  console.log('   node scripts/fix-email-automation-schema.js --verify\n');
  
  // If --verify flag is passed, verify the fixes
  if (process.argv.includes('--verify')) {
    console.log('\n' + '='.repeat(50) + '\n');
    await verifyFixes();
  }
}

// Add RPC function creator (to be run in Supabase SQL Editor if needed)
const rpcFunction = `
-- Create a function to get table columns (if it doesn't exist)
CREATE OR REPLACE FUNCTION get_table_columns(table_name text)
RETURNS TABLE(column_name text, data_type text, is_nullable text) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.column_name::text,
        c.data_type::text,
        c.is_nullable::text
    FROM information_schema.columns c
    WHERE c.table_name = $1
    AND c.table_schema = 'public'
    ORDER BY c.ordinal_position;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`;

main().catch(console.error);