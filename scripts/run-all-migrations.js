#!/usr/bin/env node

/**
 * Migration Runner - Executes all SQL migrations automatically
 * This script will run all 4 migration files in the correct order
 * 
 * Usage: node scripts/run-all-migrations.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Create Supabase client with admin privileges
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🚀 Starting Database Migration Process...\n');
console.log(`📡 Connected to: ${process.env.NEXT_PUBLIC_SUPABASE_URL}\n`);

// Migration files in execution order
const migrations = [
  {
    name: 'User Platform Tables',
    file: '20250101_create_user_platform_tables.sql',
    description: 'Creates user profiles, achievements, wellness entries, preferences'
  },
  {
    name: 'Workshop Tables', 
    file: '20250101_create_workshop_tables.sql',
    description: 'Creates workshop registration, attendance, and feedback system'
  },
  {
    name: 'Course Progress Tables',
    file: '20250101_create_course_progress_tables.sql', 
    description: 'Creates course progress tracking and certificate system'
  },
  {
    name: 'Payment Tables',
    file: '20250101_create_payment_tables.sql',
    description: 'Creates appointment payments and user payment methods'
  }
];

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.log('❌ Connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Database connection successful');
    console.log(`👥 Found ${data.users?.length || 0} users in auth system\n`);
    return true;
  } catch (err) {
    console.log('❌ Connection error:', err.message);
    return false;
  }
}

async function readMigrationFile(filename) {
  try {
    const filePath = path.join(__dirname, '..', 'supabase', 'migrations', filename);
    console.log(`📖 Reading migration file: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`Migration file not found: ${filename}`);
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    console.log(`📊 File size: ${Math.round(content.length / 1024)}KB`);
    return content;
  } catch (error) {
    console.log(`❌ Error reading file ${filename}:`, error.message);
    return null;
  }
}

async function executeMigration(migrationName, sqlContent) {
  try {
    console.log(`\n🔧 Executing: ${migrationName}`);
    console.log('⏳ Running SQL migration...');
    
    // Use the rpc function to execute raw SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: sqlContent
    });
    
    if (error) {
      console.log(`❌ Migration failed: ${error.message}`);
      return false;
    }
    
    console.log(`✅ Migration completed successfully: ${migrationName}`);
    return true;
  } catch (err) {
    console.log(`❌ Execution error: ${err.message}`);
    return false;
  }
}

async function verifyMigrationResults() {
  console.log('\n🔍 Verifying migration results...');
  
  // Test a few key tables to ensure they have proper structure
  const testTables = ['user_profiles', 'appointment_data', 'course_progress'];
  
  for (const tableName of testTables) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ Table ${tableName}: ${error.message}`);
      } else {
        console.log(`✅ Table ${tableName}: Ready (structure created)`);
      }
    } catch (err) {
      console.log(`❌ Table ${tableName}: ${err.message}`);
    }
  }
}

async function runAllMigrations() {
  console.log('🎯 BLOOM PSYCHOLOGY - DATABASE MIGRATION RUNNER\n');
  
  // Test connection first
  const connected = await testConnection();
  if (!connected) {
    console.log('\n❌ Cannot connect to database. Check your environment variables.');
    process.exit(1);
  }
  
  let successCount = 0;
  
  // Run each migration in sequence
  for (let i = 0; i < migrations.length; i++) {
    const migration = migrations[i];
    
    console.log(`\n📋 MIGRATION ${i + 1}/${migrations.length}`);
    console.log(`🏷️  Name: ${migration.name}`);
    console.log(`📄 File: ${migration.file}`);
    console.log(`📝 Description: ${migration.description}`);
    
    // Read the migration file
    const sqlContent = await readMigrationFile(migration.file);
    if (!sqlContent) {
      console.log(`❌ Skipping ${migration.name} - could not read file`);
      continue;
    }
    
    // Execute the migration
    const success = await executeMigration(migration.name, sqlContent);
    if (success) {
      successCount++;
      console.log(`🎉 Migration ${i + 1} completed successfully!`);
    } else {
      console.log(`💥 Migration ${i + 1} failed - continuing with next migration...`);
    }
    
    // Small delay between migrations
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Final results
  console.log(`\n\n📊 MIGRATION RESULTS`);
  console.log(`✅ Successful: ${successCount}/${migrations.length}`);
  console.log(`❌ Failed: ${migrations.length - successCount}/${migrations.length}`);
  
  if (successCount === migrations.length) {
    console.log('\n🎉 ALL MIGRATIONS COMPLETED SUCCESSFULLY!');
    console.log('🚀 Your database is now ready for the Bloom platform!');
  } else {
    console.log('\n⚠️  Some migrations failed. Check the errors above.');
  }
  
  // Verify results
  await verifyMigrationResults();
  
  console.log('\n✨ Migration process complete!');
  console.log('\n🔥 Next steps:');
  console.log('   1. Run: node scripts/verify-database-complete.js');
  console.log('   2. Test user registration and course access');
  console.log('   3. Test appointment booking flow');
}

// Check environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log('❌ Missing environment variables!');
  console.log('Make sure you have:');
  console.log('   - NEXT_PUBLIC_SUPABASE_URL');
  console.log('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Run all migrations
runAllMigrations().catch(console.error);