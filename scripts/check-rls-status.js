const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkRLSStatus() {
  console.log('Checking RLS status for all tables...\n');

  // Get all tables with their RLS status
  const { data: tables, error } = await supabase.rpc('query', {
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

  if (error) {
    console.error('Error checking tables:', error);
    return;
  }

  const tableData = JSON.parse(tables);
  
  // Get all RLS policies
  const { data: policies, error: policiesError } = await supabase.rpc('query', {
    query: `
      SELECT 
        schemaname,
        tablename,
        policyname,
        permissive,
        roles,
        cmd,
        qual,
        with_check
      FROM pg_policies
      WHERE schemaname = 'public'
      ORDER BY tablename, policyname
    `
  }).single();

  if (policiesError) {
    console.error('Error checking policies:', policiesError);
    return;
  }

  const policyData = JSON.parse(policies) || [];
  
  // Group policies by table
  const policiesByTable = {};
  policyData.forEach(policy => {
    if (!policiesByTable[policy.tablename]) {
      policiesByTable[policy.tablename] = [];
    }
    policiesByTable[policy.tablename].push(policy);
  });

  // Analyze each table
  const issues = {
    rlsDisabledWithPolicies: [],
    rlsDisabledNoPolicies: [],
    rlsEnabledNoPolicies: [],
    rlsEnabledWithPolicies: []
  };

  tableData.forEach(table => {
    const hasPolicies = policiesByTable[table.tablename] && policiesByTable[table.tablename].length > 0;
    const rlsEnabled = table.rowsecurity;

    if (!rlsEnabled && hasPolicies) {
      issues.rlsDisabledWithPolicies.push({
        table: table.tablename,
        policies: policiesByTable[table.tablename].map(p => p.policyname)
      });
    } else if (!rlsEnabled && !hasPolicies) {
      issues.rlsDisabledNoPolicies.push(table.tablename);
    } else if (rlsEnabled && !hasPolicies) {
      issues.rlsEnabledNoPolicies.push(table.tablename);
    } else if (rlsEnabled && hasPolicies) {
      issues.rlsEnabledWithPolicies.push({
        table: table.tablename,
        policies: policiesByTable[table.tablename].map(p => p.policyname)
      });
    }
  });

  // Report findings
  console.log('=== CRITICAL ISSUES ===\n');
  
  console.log('1. Tables with RLS DISABLED but HAVE POLICIES (needs immediate fix):');
  console.log('   These tables have security policies defined but RLS is not enabled!');
  issues.rlsDisabledWithPolicies.forEach(item => {
    console.log(`   - ${item.table}: ${item.policies.length} policies`);
    item.policies.forEach(policy => console.log(`     • ${policy}`));
  });

  console.log('\n2. Tables with RLS DISABLED and NO POLICIES:');
  console.log('   These tables are completely unprotected!');
  issues.rlsDisabledNoPolicies.forEach(table => {
    console.log(`   - ${table}`);
  });

  console.log('\n=== GOOD STATUS ===\n');
  
  console.log('3. Tables with RLS ENABLED and POLICIES:');
  issues.rlsEnabledWithPolicies.forEach(item => {
    console.log(`   ✓ ${item.table}: ${item.policies.length} policies`);
  });

  console.log('\n=== WARNINGS ===\n');
  
  console.log('4. Tables with RLS ENABLED but NO POLICIES:');
  console.log('   These tables will block all access!');
  issues.rlsEnabledNoPolicies.forEach(table => {
    console.log(`   - ${table}`);
  });

  // Generate fix script
  console.log('\n=== FIX SCRIPT ===\n');
  console.log('-- Enable RLS for tables with existing policies:');
  issues.rlsDisabledWithPolicies.forEach(item => {
    console.log(`ALTER TABLE public.${item.table} ENABLE ROW LEVEL SECURITY;`);
  });

  return issues;
}

// Also create the query function if it doesn't exist
async function setupQueryFunction() {
  try {
    await supabase.rpc('query', {
      query: `
        CREATE OR REPLACE FUNCTION query(query text)
        RETURNS json
        LANGUAGE plpgsql
        SECURITY DEFINER
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
  } catch (error) {
    // Function might already exist, that's ok
  }
}

setupQueryFunction().then(checkRLSStatus);