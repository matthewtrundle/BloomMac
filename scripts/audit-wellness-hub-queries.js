const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Collect all database queries found in wellness hub APIs
const apiQueries = {
  '/api/dashboard': {
    rpcs: ['get_user_dashboard_data']
  },
  '/api/profile/get': {
    tables: ['user_profiles', 'user_achievements'],
    operations: [
      { table: 'user_profiles', operation: 'select', columns: '*' },
      { table: 'user_achievements', operation: 'select', columns: 'points' }
    ]
  },
  '/api/courses/all-progress': {
    rpcs: ['get_all_courses_with_user_progress']
  },
  '/api/achievements/get': {
    tables: ['user_achievements'],
    operations: [
      { table: 'user_achievements', operation: 'select', columns: '*' }
    ]
  },
  '/api/recent-activity': {
    tables: ['admin_activity_log', 'contact_submissions', 'subscribers', 'analytics_events'],
    operations: [
      { table: 'admin_activity_log', operation: 'select', columns: '*' },
      { table: 'contact_submissions', operation: 'select', columns: 'id, name, email, created_at, status' },
      { table: 'subscribers', operation: 'select', columns: 'id, email, first_name, last_name, status, created_at' },
      { table: 'analytics_events', operation: 'select', columns: 'id, type, page, created_at' }
    ]
  },
  '/api/course/stats': {
    rpcs: ['get_user_course_stats']
  },
  '/api/user/settings/privacy': {
    tables: ['user_preferences', 'user_activity_log'],
    operations: [
      { table: 'user_preferences', operation: 'select', columns: 'privacy_settings' },
      { table: 'user_preferences', operation: 'upsert', columns: 'user_id, privacy_settings, updated_at' },
      { table: 'user_activity_log', operation: 'insert', columns: 'user_id, action, ip_address, metadata, created_at' }
    ]
  },
  '/api/user/newsletter-preferences': {
    tables: ['subscribers'],
    operations: [
      { table: 'subscribers', operation: 'select', columns: '*' }
    ]
  }
};

async function auditDatabase() {
  console.log('=== WELLNESS HUB DATABASE AUDIT ===\n');
  console.log('Auditing database queries used in wellness hub APIs...\n');

  const auditResults = {
    tables: {},
    rpcs: {},
    issues: []
  };

  // First, get all tables that exist
  console.log('📊 Checking existing tables...\n');
  const allTables = new Set();
  Object.values(apiQueries).forEach(api => {
    if (api.tables) {
      api.tables.forEach(table => allTables.add(table));
    }
  });

  for (const table of allTables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (!error) {
        console.log(`✅ ${table}: EXISTS (${count} rows)`);
        
        // Get column information
        const { data: sample } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (sample && sample.length > 0) {
          const columns = Object.keys(sample[0]);
          console.log(`   Columns: ${columns.join(', ')}`);
          auditResults.tables[table] = {
            exists: true,
            rowCount: count,
            columns: columns
          };
        } else {
          auditResults.tables[table] = {
            exists: true,
            rowCount: count,
            columns: []
          };
        }
      } else {
        console.log(`❌ ${table}: DOES NOT EXIST`);
        auditResults.tables[table] = { exists: false };
        auditResults.issues.push(`Table '${table}' does not exist`);
      }
    } catch (error) {
      console.log(`❌ ${table}: ERROR - ${error.message}`);
      auditResults.tables[table] = { exists: false, error: error.message };
      auditResults.issues.push(`Error checking table '${table}': ${error.message}`);
    }
    console.log('');
  }

  // Check RPC functions
  console.log('\n📊 Checking RPC functions...\n');
  const allRpcs = new Set();
  Object.values(apiQueries).forEach(api => {
    if (api.rpcs) {
      api.rpcs.forEach(rpc => allRpcs.add(rpc));
    }
  });

  for (const rpcName of allRpcs) {
    try {
      // Try to check if function exists - this is tricky with Supabase
      // We'll try to call it with dummy parameters
      const { error } = await supabase.rpc(rpcName, { p_user_id: '00000000-0000-0000-0000-000000000000' });
      
      if (error && error.message.includes('does not exist')) {
        console.log(`❌ RPC ${rpcName}: DOES NOT EXIST`);
        auditResults.rpcs[rpcName] = { exists: false };
        auditResults.issues.push(`RPC function '${rpcName}' does not exist`);
      } else {
        console.log(`✅ RPC ${rpcName}: EXISTS`);
        auditResults.rpcs[rpcName] = { exists: true };
      }
    } catch (error) {
      console.log(`⚠️  RPC ${rpcName}: Cannot verify (${error.message})`);
      auditResults.rpcs[rpcName] = { exists: 'unknown', error: error.message };
    }
  }

  // Detailed API analysis
  console.log('\n\n=== DETAILED API ANALYSIS ===\n');
  
  for (const [apiPath, queries] of Object.entries(apiQueries)) {
    console.log(`\n📁 ${apiPath}`);
    console.log('─'.repeat(50));
    
    if (queries.tables) {
      console.log('Tables used:');
      queries.tables.forEach(table => {
        const tableInfo = auditResults.tables[table];
        if (tableInfo.exists) {
          console.log(`  ✅ ${table} (${tableInfo.rowCount} rows)`);
        } else {
          console.log(`  ❌ ${table} - MISSING!`);
        }
      });
    }
    
    if (queries.rpcs) {
      console.log('RPC functions:');
      queries.rpcs.forEach(rpc => {
        const rpcInfo = auditResults.rpcs[rpc];
        if (rpcInfo.exists === true) {
          console.log(`  ✅ ${rpc}`);
        } else if (rpcInfo.exists === false) {
          console.log(`  ❌ ${rpc} - MISSING!`);
        } else {
          console.log(`  ⚠️  ${rpc} - Cannot verify`);
        }
      });
    }
    
    if (queries.operations) {
      console.log('Operations:');
      queries.operations.forEach(op => {
        const tableInfo = auditResults.tables[op.table];
        if (tableInfo.exists) {
          console.log(`  ✅ ${op.operation.toUpperCase()} on ${op.table} (${op.columns})`);
          
          // Check if columns exist
          if (op.columns !== '*' && tableInfo.columns) {
            const requestedColumns = op.columns.split(',').map(c => c.trim());
            const missingColumns = requestedColumns.filter(col => !tableInfo.columns.includes(col));
            if (missingColumns.length > 0) {
              console.log(`     ⚠️  Missing columns: ${missingColumns.join(', ')}`);
              auditResults.issues.push(`Table '${op.table}' is missing columns: ${missingColumns.join(', ')}`);
            }
          }
        } else {
          console.log(`  ❌ ${op.operation.toUpperCase()} on ${op.table} - TABLE MISSING!`);
        }
      });
    }
  }

  // Summary
  console.log('\n\n=== AUDIT SUMMARY ===\n');
  
  const tableCount = Object.keys(auditResults.tables).length;
  const existingTables = Object.values(auditResults.tables).filter(t => t.exists).length;
  const rpcCount = Object.keys(auditResults.rpcs).length;
  const existingRpcs = Object.values(auditResults.rpcs).filter(r => r.exists === true).length;
  
  console.log(`Tables: ${existingTables}/${tableCount} exist`);
  console.log(`RPC functions: ${existingRpcs}/${rpcCount} confirmed`);
  console.log(`Total issues found: ${auditResults.issues.length}`);
  
  if (auditResults.issues.length > 0) {
    console.log('\n🚨 ISSUES FOUND:');
    auditResults.issues.forEach((issue, i) => {
      console.log(`${i + 1}. ${issue}`);
    });
  }
  
  // Recommendations
  console.log('\n\n💡 RECOMMENDATIONS:\n');
  
  if (auditResults.tables.user_activity_log && !auditResults.tables.user_activity_log.exists) {
    console.log('1. Create user_activity_log table for privacy settings tracking');
  }
  
  const missingRpcs = Object.entries(auditResults.rpcs)
    .filter(([name, info]) => info.exists === false)
    .map(([name]) => name);
  
  if (missingRpcs.length > 0) {
    console.log(`2. Create missing RPC functions: ${missingRpcs.join(', ')}`);
    console.log('   These are likely database functions that aggregate data for performance');
  }
  
  if (existingTables === tableCount && existingRpcs === rpcCount) {
    console.log('✅ All database dependencies are satisfied!');
  }

  // Save audit results
  const fs = require('fs');
  fs.writeFileSync(
    'wellness-hub-audit-results.json',
    JSON.stringify(auditResults, null, 2)
  );
  console.log('\n📄 Full audit results saved to: wellness-hub-audit-results.json');
}

auditDatabase().catch(console.error);