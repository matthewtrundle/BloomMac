#!/usr/bin/env node

/**
 * Run SQL on Remote Supabase Database
 * This creates temporary migration files and uses Supabase CLI
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function runRemoteSQL(sqlFile) {
  try {
    console.log('🚀 Supabase Remote SQL Executor');
    console.log('================================\n');

    // Check if SQL file exists
    if (!fs.existsSync(sqlFile)) {
      throw new Error(`SQL file not found: ${sqlFile}`);
    }

    // Read SQL content
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    // Generate timestamp for migration
    const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
    const migrationName = `${timestamp}_temp_migration.sql`;
    const migrationPath = path.join('supabase', 'migrations', migrationName);
    
    console.log(`📄 Creating temporary migration: ${migrationName}`);
    
    // Write to migrations folder
    fs.writeFileSync(migrationPath, sqlContent);
    
    console.log('🔄 Pushing migration to remote database...\n');
    
    try {
      // Run migration using Supabase CLI
      const { stdout, stderr } = await execAsync('supabase db push --include-all');
      
      console.log('📊 Output:');
      console.log(stdout);
      
      if (stderr) {
        console.error('⚠️  Warnings/Errors:');
        console.error(stderr);
      }
      
      console.log('\n✅ Migration completed!');
      
      // Clean up temporary migration
      console.log('\n🧹 Cleaning up temporary migration...');
      fs.unlinkSync(migrationPath);
      
    } catch (error) {
      console.error('❌ Migration failed:', error.message);
      
      // Clean up on error too
      if (fs.existsSync(migrationPath)) {
        fs.unlinkSync(migrationPath);
      }
      
      console.log('\n💡 Alternative approaches:');
      console.log('1. Run directly in Supabase Dashboard:');
      console.log('   https://supabase.com/dashboard/project/utetcmirepwdxbtrcczv/sql/new');
      console.log('\n2. Use the permanent migration:');
      console.log('   supabase db push --include-all');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Parse command line arguments
const sqlFile = process.argv[2];

if (!sqlFile) {
  console.log('Usage: node scripts/run-remote-sql.js <sql-file>');
  console.log('Example: node scripts/run-remote-sql.js FIX_DASHBOARD_FINAL_V3_DROP_FIRST.sql');
  process.exit(1);
}

runRemoteSQL(sqlFile);