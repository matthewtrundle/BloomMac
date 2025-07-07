#!/usr/bin/env node

/**
 * Direct SQL Executor for Supabase
 * Executes SQL without using migrations - direct to database
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// ANSI color codes for better output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

async function executeSQLDirect(sqlFilePath) {
  log('\n🚀 Direct SQL Executor for Supabase', 'bright');
  log('='.repeat(50), 'cyan');
  
  // Check file exists
  if (!fs.existsSync(sqlFilePath)) {
    log(`\n❌ Error: SQL file not found: ${sqlFilePath}`, 'red');
    process.exit(1);
  }
  
  // Read SQL content
  const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
  log(`\n📄 SQL File: ${path.basename(sqlFilePath)}`, 'yellow');
  log(`📏 Size: ${(sqlContent.length / 1024).toFixed(2)} KB`, 'yellow');
  
  // Since we can't execute arbitrary SQL through the JS client,
  // we'll provide clear instructions and a helper
  
  log('\n📋 Instructions:', 'bright');
  log('1. Copy the SQL content below', 'green');
  log('2. Open Supabase SQL Editor:', 'green');
  log('   https://supabase.com/dashboard/project/utetcmirepwdxbtrcczv/sql/new', 'blue');
  log('3. Paste and click "Run"', 'green');
  
  // Create a clipboard-friendly version
  const clipboardFile = path.join(path.dirname(sqlFilePath), `CLIPBOARD_${path.basename(sqlFilePath)}`);
  fs.writeFileSync(clipboardFile, sqlContent);
  
  log(`\n📎 Clipboard-ready file created:`, 'cyan');
  log(`   ${clipboardFile}`, 'blue');
  
  // Try to copy to clipboard if possible
  try {
    const { exec } = require('child_process');
    exec(`pbcopy < "${clipboardFile}"`, (error) => {
      if (!error) {
        log('\n✅ SQL copied to clipboard! Just paste in Supabase.', 'green');
      }
    });
  } catch (e) {
    // Clipboard copy failed, that's ok
  }
  
  // Show first few lines of SQL
  log('\n📜 SQL Preview:', 'bright');
  log('-'.repeat(50), 'cyan');
  const lines = sqlContent.split('\n').slice(0, 10);
  lines.forEach(line => console.log(line));
  if (sqlContent.split('\n').length > 10) {
    log('... (truncated)', 'yellow');
  }
  log('-'.repeat(50), 'cyan');
  
  // Test database connection
  log('\n🔍 Testing database connection...', 'yellow');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  const { data, error } = await supabase
    .from('user_profiles')
    .select('count(*)', { count: 'exact', head: true });
  
  if (error) {
    log('❌ Database connection failed:', 'red');
    log(`   ${error.message}`, 'red');
  } else {
    log('✅ Database connection successful!', 'green');
  }
  
  // Provide verification script
  log('\n🧪 After running the SQL, verify with:', 'bright');
  log('   node scripts/verify-dashboard-fix.js', 'blue');
  
  log('\n💡 Pro tip: Use CMD+V (Mac) or Ctrl+V (Windows) to paste', 'cyan');
}

// Main execution
const sqlFile = process.argv[2];

if (!sqlFile) {
  log('Usage: node scripts/direct-sql-executor.js <sql-file>', 'yellow');
  log('Example: node scripts/direct-sql-executor.js FIX_DASHBOARD_FINAL_V3_DROP_FIRST.sql', 'green');
  process.exit(1);
}

executeSQLDirect(sqlFile).catch(error => {
  log(`\n❌ Error: ${error.message}`, 'red');
  process.exit(1);
});