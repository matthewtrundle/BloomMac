#!/usr/bin/env node

/**
 * Execute SQL File in Supabase
 * This script executes SQL files against your Supabase database
 * Usage: node scripts/execute-sql-file.js path/to/file.sql
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function executeSQLFile(filePath) {
  try {
    // Read SQL file
    const sqlContent = fs.readFileSync(filePath, 'utf8');
    
    console.log(`\n📄 Executing SQL file: ${path.basename(filePath)}`);
    console.log('=' * 60);
    
    // Split SQL into individual statements (basic parsing)
    const statements = sqlContent
      .split(/;\s*$/m)
      .filter(stmt => stmt.trim().length > 0)
      .map(stmt => stmt.trim() + ';');
    
    console.log(`📊 Found ${statements.length} SQL statements to execute\n`);
    
    let successCount = 0;
    let errorCount = 0;
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      const preview = statement.substring(0, 60).replace(/\n/g, ' ');
      
      console.log(`\n[${i + 1}/${statements.length}] Executing: ${preview}...`);
      
      try {
        // Use raw SQL execution via RPC
        const { data, error } = await supabase.rpc('exec_sql', {
          sql_query: statement
        });
        
        if (error) {
          console.error(`   ❌ Error: ${error.message}`);
          errorCount++;
          
          // If function doesn't exist, try direct approach
          if (error.message.includes('function public.exec_sql')) {
            console.log('   ℹ️  exec_sql function not found, creating it...');
            
            // Create the exec_sql function
            const createFunc = `
              CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
              RETURNS json
              LANGUAGE plpgsql
              SECURITY DEFINER
              AS $$
              DECLARE
                result json;
              BEGIN
                EXECUTE sql_query;
                RETURN json_build_object('success', true);
              EXCEPTION
                WHEN OTHERS THEN
                  RETURN json_build_object('success', false, 'error', SQLERRM);
              END;
              $$;
            `;
            
            console.log('\n⚠️  Cannot execute SQL directly via JS client.');
            console.log('   Please run the following in Supabase SQL Editor first:\n');
            console.log(createFunc);
            console.log('\n   Then run this script again.');
            return;
          }
        } else {
          console.log(`   ✅ Success`);
          successCount++;
        }
      } catch (err) {
        console.error(`   ❌ Error: ${err.message}`);
        errorCount++;
      }
    }
    
    // Summary
    console.log('\n' + '=' * 60);
    console.log(`\n📊 EXECUTION SUMMARY:`);
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log(`   📝 Total: ${statements.length}`);
    
    if (errorCount > 0) {
      console.log('\n⚠️  Some statements failed. Check the errors above.');
      console.log('   You may need to run the SQL directly in Supabase SQL Editor.');
    } else {
      console.log('\n✨ All statements executed successfully!');
    }
    
  } catch (error) {
    console.error('Failed to read or parse SQL file:', error);
    process.exit(1);
  }
}

// Alternative approach - generate a direct link
function generateSupabaseLink(filePath) {
  const projectRef = 'utetcmirepwdxbtrcczv';
  console.log('\n🔗 Alternative: Open this link to run in Supabase SQL Editor:');
  console.log(`   https://supabase.com/dashboard/project/${projectRef}/sql/new`);
  console.log('\n📋 Then copy and paste the contents of:');
  console.log(`   ${path.resolve(filePath)}`);
}

// Main execution
const sqlFile = process.argv[2];

if (!sqlFile) {
  console.log('Usage: node scripts/execute-sql-file.js <path-to-sql-file>');
  console.log('Example: node scripts/execute-sql-file.js FIX_DASHBOARD_FINAL_V3_DROP_FIRST.sql');
  process.exit(1);
}

if (!fs.existsSync(sqlFile)) {
  console.error(`Error: SQL file not found: ${sqlFile}`);
  process.exit(1);
}

console.log('🚀 Supabase SQL Executor');
console.log('========================\n');

executeSQLFile(sqlFile).then(() => {
  generateSupabaseLink(sqlFile);
});