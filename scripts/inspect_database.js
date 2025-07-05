const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function inspectDatabase() {
  console.log('🔍 Database Inspection Report\n');
  
  try {
    // 1. List all tables
    console.log('📊 TABLES:');
    const { data: tables } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name');
    
    if (tables) {
      for (const table of tables) {
        // Get row count for each table
        const { count } = await supabase
          .from(table.table_name)
          .select('*', { count: 'exact', head: true });
        
        console.log(`  - ${table.table_name}: ${count || 0} rows`);
      }
    }
    
    // 2. List all functions
    console.log('\n⚙️ FUNCTIONS:');
    const { data: functions } = await supabase
      .from('information_schema.routines')
      .select('routine_name, routine_type')
      .eq('routine_schema', 'public')
      .eq('routine_type', 'FUNCTION')
      .order('routine_name');
    
    if (functions) {
      functions.forEach(fn => {
        console.log(`  - ${fn.routine_name}()`);
      });
    }
    
    // 3. Check RLS policies
    console.log('\n🔒 RLS POLICIES:');
    const { data: policies } = await supabase
      .from('pg_policies')
      .select('tablename, policyname, cmd')
      .order('tablename');
    
    if (policies) {
      const tableGroups = {};
      policies.forEach(policy => {
        if (!tableGroups[policy.tablename]) {
          tableGroups[policy.tablename] = [];
        }
        tableGroups[policy.tablename].push(`${policy.policyname} (${policy.cmd})`);
      });
      
      Object.entries(tableGroups).forEach(([table, pols]) => {
        console.log(`  ${table}:`);
        pols.forEach(pol => console.log(`    - ${pol}`));
      });
    }
    
    // 4. Check for service role usage
    console.log('\n⚠️  SECURITY AUDIT:');
    console.log('  Checking which tables have RLS enabled...');
    
    const rlsTables = new Set();
    if (policies) {
      policies.forEach(p => rlsTables.add(p.tablename));
    }
    
    if (tables) {
      const unprotectedTables = tables
        .filter(t => !rlsTables.has(t.table_name))
        .map(t => t.table_name);
      
      if (unprotectedTables.length > 0) {
        console.log('  ❌ Tables without RLS policies:');
        unprotectedTables.forEach(t => console.log(`    - ${t}`));
      } else {
        console.log('  ✅ All tables have RLS policies');
      }
    }
    
    // 5. Database size
    console.log('\n💾 DATABASE INFO:');
    const { data: dbSize } = await supabase
      .from('pg_database')
      .select('datname, pg_size_pretty(pg_database_size(datname))')
      .single();
    
    if (dbSize) {
      console.log(`  Database size: ${dbSize.pg_size_pretty}`);
    }
    
  } catch (error) {
    console.error('Error inspecting database:', error);
  }
}

// Export schema to file
async function exportSchema() {
  console.log('\n📄 Exporting schema...');
  
  const schema = {
    tables: {},
    functions: [],
    policies: {}
  };
  
  // Get table schemas
  const { data: columns } = await supabase
    .from('information_schema.columns')
    .select('table_name, column_name, data_type, is_nullable, column_default')
    .eq('table_schema', 'public')
    .order('table_name, ordinal_position');
  
  if (columns) {
    columns.forEach(col => {
      if (!schema.tables[col.table_name]) {
        schema.tables[col.table_name] = [];
      }
      schema.tables[col.table_name].push({
        name: col.column_name,
        type: col.data_type,
        nullable: col.is_nullable === 'YES',
        default: col.column_default
      });
    });
  }
  
  // Save to file
  const fs = require('fs');
  fs.writeFileSync(
    'database_schema.json',
    JSON.stringify(schema, null, 2)
  );
  
  console.log('  ✅ Schema exported to database_schema.json');
}

// Run inspection
inspectDatabase().then(() => exportSchema());