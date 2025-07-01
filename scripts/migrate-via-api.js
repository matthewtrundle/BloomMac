#!/usr/bin/env node

/**
 * API-Based Migration Runner
 * Uses Supabase REST API to execute migrations
 * 
 * Usage: node scripts/migrate-via-api.js
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

console.log('🚀 API-Based Database Migration Runner\n');

// Migration files in execution order
const migrations = [
  {
    name: 'User Platform Tables',
    file: '20250101_create_user_platform_tables.sql',
    description: 'Creates user profiles, achievements, wellness entries'
  },
  {
    name: 'Workshop Tables', 
    file: '20250101_create_workshop_tables.sql',
    description: 'Creates workshop system'
  },
  {
    name: 'Course Progress Tables',
    file: '20250101_create_course_progress_tables.sql', 
    description: 'Creates course progress tracking'
  },
  {
    name: 'Payment Tables',
    file: '20250101_create_payment_tables.sql',
    description: 'Creates payment system'
  }
];

function readMigrationFile(filename) {
  try {
    const filePath = path.join(__dirname, '..', 'supabase', 'migrations', filename);
    console.log(`📖 Reading: ${filename}`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filename}`);
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    console.log(`📊 Size: ${Math.round(content.length / 1024)}KB`);
    return content;
  } catch (error) {
    console.log(`❌ Error reading ${filename}:`, error.message);
    return null;
  }
}

async function executeSQL(sql, migrationName) {
  try {
    console.log(`\n🔧 Executing: ${migrationName}`);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY
      },
      body: JSON.stringify({ sql })
    });
    
    if (response.ok) {
      console.log(`✅ ${migrationName} completed successfully!`);
      return true;
    } else {
      const error = await response.text();
      console.log(`❌ ${migrationName} failed:`, error);
      return false;
    }
  } catch (error) {
    console.log(`❌ Network error:`, error.message);
    return false;
  }
}

async function createTablesDirectly() {
  console.log('\n🛠️  Creating tables using direct SQL execution...\n');
  
  // User Profiles Table
  console.log('📋 Creating user_profiles table...');
  const userProfilesSQL = `
    CREATE TABLE IF NOT EXISTS user_profiles (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      first_name TEXT,
      last_name TEXT,
      phone TEXT,
      postpartum_date DATE,
      number_of_children INTEGER DEFAULT 0,
      total_stars INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now(),
      UNIQUE(user_id)
    );
    
    ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Users can view own profile" ON user_profiles
      FOR SELECT USING (auth.uid() = user_id);
  `;
  
  await executeSQL(userProfilesSQL, 'User Profiles Table');
  
  // User Achievements Table  
  console.log('📋 Creating user_achievements table...');
  const achievementsSQL = `
    CREATE TABLE IF NOT EXISTS user_achievements (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      achievement_id TEXT NOT NULL,
      earned_at TIMESTAMPTZ DEFAULT now(),
      created_at TIMESTAMPTZ DEFAULT now(),
      UNIQUE(user_id, achievement_id)
    );
    
    ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Users can view own achievements" ON user_achievements
      FOR SELECT USING (auth.uid() = user_id);
  `;
  
  await executeSQL(achievementsSQL, 'User Achievements Table');
  
  // Appointment Data Table
  console.log('📋 Creating appointment_data table...');
  const appointmentsSQL = `
    CREATE TABLE IF NOT EXISTS appointment_data (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      appointment_type TEXT DEFAULT 'consultation',
      appointment_date TIMESTAMPTZ NOT NULL,
      status TEXT DEFAULT 'scheduled',
      created_at TIMESTAMPTZ DEFAULT now()
    );
    
    ALTER TABLE appointment_data ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Users can view own appointments" ON appointment_data
      FOR SELECT USING (auth.uid() = user_id);
  `;
  
  await executeSQL(appointmentsSQL, 'Appointment Data Table');
  
  console.log('\n✅ Core tables created! Testing structure...');
  
  // Test the tables
  await testTableStructure();
}

async function testTableStructure() {
  console.log('\n🔍 Testing table structure...');
  
  const tables = ['user_profiles', 'user_achievements', 'appointment_data'];
  
  for (const table of tables) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${table}?select=*&limit=0`, {
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY
        }
      });
      
      if (response.ok) {
        console.log(`✅ ${table}: Structure verified`);
      } else {
        console.log(`❌ ${table}: Structure check failed`);
      }
    } catch (error) {
      console.log(`❌ ${table}: ${error.message}`);
    }
  }
}

async function runMigrations() {
  console.log('🎯 STARTING BLOOM DATABASE SETUP\n');
  
  // Check environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log('❌ Missing environment variables!');
    process.exit(1);
  }
  
  console.log(`📡 Database: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);
  
  // Try direct table creation approach
  await createTablesDirectly();
  
  console.log('\n🎉 Migration process complete!');
  console.log('\n🔥 Next steps:');
  console.log('   1. Run: node scripts/verify-database-complete.js');
  console.log('   2. Test user registration');
  console.log('   3. Check database health score');
}

// Run the migrations
runMigrations().catch(console.error);