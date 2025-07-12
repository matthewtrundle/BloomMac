const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkMissingTables() {
  console.log('🔍 Checking which "missing" tables actually exist...\n');
  
  const tablesToCheck = [
    'email_logs',
    'email_analytics',
    'career_applications',
    'system_settings',
    'user_achievements',
    'cron_logs'
  ];
  
  const results = {
    exists: [],
    missing: [],
    hasData: []
  };
  
  for (const table of tablesToCheck) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ ${table}: Does not exist`);
        results.missing.push(table);
      } else {
        console.log(`✅ ${table}: EXISTS (${count} rows)`);
        results.exists.push(table);
        if (count > 0) {
          results.hasData.push({ table, count });
        }
      }
    } catch (err) {
      console.log(`❌ ${table}: Error checking - ${err.message}`);
      results.missing.push(table);
    }
  }
  
  console.log('\n📊 Summary:');
  console.log(`- Tables that exist: ${results.exists.length}`);
  console.log(`- Tables missing: ${results.missing.length}`);
  console.log(`- Tables with data: ${results.hasData.length}`);
  
  if (results.exists.length > 0) {
    console.log('\n⚠️  WARNING: Some tables already exist!');
    console.log('Existing tables:', results.exists.join(', '));
    
    if (results.hasData.length > 0) {
      console.log('\n🚨 CRITICAL: Some tables have data!');
      results.hasData.forEach(({ table, count }) => {
        console.log(`  - ${table}: ${count} rows`);
      });
    }
  }
  
  if (results.missing.length > 0) {
    console.log('\n📝 Tables that need to be created:');
    console.log(results.missing.join(', '));
    
    console.log('\n-- SQL to create only missing tables:');
    results.missing.forEach(table => {
      console.log(`-- Check and create ${table}`);
      console.log(`CREATE TABLE IF NOT EXISTS public.${table} ( ... );`);
    });
  }
  
  // Also check for existing policies on these tables
  console.log('\n\n🔒 Checking for existing policies...');
  for (const table of results.exists) {
    try {
      // Try a query that would fail if RLS is enabled without proper policies
      const { error } = await supabase
        .from(table)
        .select('id')
        .limit(1);
      
      if (error && error.message.includes('row-level security')) {
        console.log(`🔒 ${table}: RLS is ENABLED`);
      } else {
        console.log(`⚠️  ${table}: RLS might be DISABLED`);
      }
    } catch (err) {
      console.log(`❓ ${table}: Could not check RLS status`);
    }
  }
  
  return results;
}

checkMissingTables();