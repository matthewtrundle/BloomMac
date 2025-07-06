const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Production database
const prodUrl = 'https://utetcmirepwdxbtrcczv.supabase.co';
const prodServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // You'll need to provide this

// Local database  
const localUrl = 'http://localhost:54321';
const localServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const prodSupabase = createClient(prodUrl, prodServiceKey);
const localSupabase = createClient(localUrl, localServiceKey);

async function compareSchemas() {
  console.log('🔍 Comparing Production vs Local Schemas\n');

  // Get all tables from production
  const { data: prodTables } = await prodSupabase.rpc('get_all_tables', {
    schema_name: 'public'
  });

  // Get all tables from local
  const { data: localTables } = await localSupabase.from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .eq('table_type', 'BASE TABLE');

  const localTableNames = new Set(localTables?.map(t => t.table_name) || []);
  const prodTableNames = new Set(prodTables?.map(t => t.table_name) || []);

  console.log(`📊 Production tables: ${prodTableNames.size}`);
  console.log(`📊 Local tables: ${localTableNames.size}\n`);

  // Find missing tables
  const missingTables = [];
  for (const table of prodTableNames) {
    if (!localTableNames.has(table)) {
      missingTables.push(table);
    }
  }

  if (missingTables.length > 0) {
    console.log(`❌ Missing ${missingTables.length} tables in local:\n`);
    missingTables.forEach(table => console.log(`   - ${table}`));
  } else {
    console.log('✅ All production tables exist locally!');
  }

  return missingTables;
}

// Note: This requires production service role key
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log('❌ Please set SUPABASE_SERVICE_ROLE_KEY environment variable');
  console.log('   This is your production service role key from Supabase dashboard');
  process.exit(1);
}

compareSchemas().catch(console.error);