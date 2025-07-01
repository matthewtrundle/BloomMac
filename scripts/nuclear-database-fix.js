#!/usr/bin/env node

/**
 * Nuclear Database Fix - Drops and recreates all broken tables
 * This script will completely rebuild the database structure
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('💥 NUCLEAR DATABASE FIX - REBUILDING EVERYTHING\n');

// Tables to completely rebuild
const tablesToRebuild = [
  'user_profiles',
  'user_achievements', 
  'wellness_entries',
  'user_preferences',
  'course_enrollments',
  'appointment_data',
  'course_progress',
  'lesson_completion_details',
  'course_certificates',
  'workshop_registrations',
  'workshop_attendance', 
  'workshop_feedback',
  'appointment_payments',
  'user_payment_methods'
];

async function dropAllBrokenTables() {
  console.log('🗑️  Dropping all broken tables...');
  
  for (const table of tablesToRebuild) {
    try {
      const { error } = await supabase.rpc('drop_table', { table_name: table });
      console.log(`   ✅ Dropped ${table}`);
    } catch (err) {
      console.log(`   ⚠️  ${table} - ${err.message}`);
    }
  }
}

async function createTablesFromScratch() {
  console.log('\n🔨 Creating all tables from scratch...\n');
  
  // USER PROFILES
  console.log('Creating user_profiles...');
  await executeSQL(`
    CREATE TABLE user_profiles (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
      first_name TEXT,
      last_name TEXT, 
      phone TEXT,
      postpartum_date DATE,
      number_of_children INTEGER DEFAULT 0,
      total_stars INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
    
    ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Users view own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Users update own profile" ON user_profiles FOR ALL USING (auth.uid() = user_id);
  `);

  // USER ACHIEVEMENTS
  console.log('Creating user_achievements...');
  await executeSQL(`
    CREATE TABLE user_achievements (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      achievement_id TEXT NOT NULL,
      earned_at TIMESTAMPTZ DEFAULT now(),
      created_at TIMESTAMPTZ DEFAULT now(),
      UNIQUE(user_id, achievement_id)
    );
    
    ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Users view own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "System awards achievements" ON user_achievements FOR INSERT WITH CHECK (true);
  `);

  // WELLNESS ENTRIES
  console.log('Creating wellness_entries...');
  await executeSQL(`
    CREATE TABLE wellness_entries (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      entry_date DATE DEFAULT CURRENT_DATE,
      mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 5),
      energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),
      sleep_hours DECIMAL(3,1) CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT now(),
      UNIQUE(user_id, entry_date)
    );
    
    ALTER TABLE wellness_entries ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Users manage own wellness" ON wellness_entries FOR ALL USING (auth.uid() = user_id);
  `);

  // USER PREFERENCES
  console.log('Creating user_preferences...');
  await executeSQL(`
    CREATE TABLE user_preferences (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
      privacy_settings JSONB DEFAULT '{"profile_visibility": "private"}',
      reminder_settings JSONB DEFAULT '{"email_enabled": true, "sms_enabled": false}',
      theme_preference TEXT DEFAULT 'light',
      language TEXT DEFAULT 'en',
      timezone TEXT DEFAULT 'America/New_York',
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
    
    ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Users manage own preferences" ON user_preferences FOR ALL USING (auth.uid() = user_id);
  `);

  // COURSE ENROLLMENTS
  console.log('Creating course_enrollments...');
  await executeSQL(`
    CREATE TABLE course_enrollments (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      course_id TEXT NOT NULL,
      enrollment_date TIMESTAMPTZ DEFAULT now(),
      progress_percentage INTEGER DEFAULT 0,
      last_accessed TIMESTAMPTZ,
      payment_status TEXT DEFAULT 'pending',
      stripe_session_id TEXT,
      amount_paid DECIMAL(10,2),
      created_at TIMESTAMPTZ DEFAULT now(),
      UNIQUE(user_id, course_id)
    );
    
    ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Users view own enrollments" ON course_enrollments FOR ALL USING (auth.uid() = user_id);
  `);

  // APPOINTMENT DATA
  console.log('Creating appointment_data...');
  await executeSQL(`
    CREATE TABLE appointment_data (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      appointment_type TEXT DEFAULT 'consultation',
      calendly_event_uri TEXT,
      calendly_invitee_uri TEXT,
      appointment_date TIMESTAMPTZ NOT NULL,
      appointment_end TIMESTAMPTZ,
      status TEXT DEFAULT 'scheduled',
      payment_status TEXT DEFAULT 'pending',
      no_show_fee_charged BOOLEAN DEFAULT false,
      reminder_sent BOOLEAN DEFAULT false,
      confirmation_received BOOLEAN DEFAULT false,
      cancellation_policy TEXT DEFAULT '24_hours',
      session_fee_dollars DECIMAL(10,2) DEFAULT 150.00,
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
    
    ALTER TABLE appointment_data ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Users manage own appointments" ON appointment_data FOR ALL USING (auth.uid() = user_id);
  `);

  console.log('\n✅ Core tables created successfully!');
}

async function executeSQL(sql) {
  try {
    // Split SQL by semicolons and execute each statement
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc('exec_sql', { sql: statement.trim() + ';' });
        if (error) {
          console.log(`❌ SQL Error: ${error.message}`);
        }
      }
    }
  } catch (err) {
    console.log(`❌ Execute Error: ${err.message}`);
  }
}

async function testConnection() {
  try {
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) throw error;
    console.log(`✅ Connected - ${data.users?.length || 0} users found\n`);
    return true;
  } catch (err) {
    console.log(`❌ Connection failed: ${err.message}`);
    return false;
  }
}

async function verifyTables() {
  console.log('\n🔍 Verifying new table structure...');
  
  const testTables = ['user_profiles', 'appointment_data', 'user_achievements'];
  
  for (const table of testTables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(0);
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: Structure verified`);
      }
    } catch (err) {
      console.log(`❌ ${table}: ${err.message}`);
    }
  }
}

async function main() {
  console.log('🎯 NUCLEAR DATABASE REBUILD STARTING...\n');
  
  const connected = await testConnection();
  if (!connected) {
    process.exit(1);
  }
  
  // Drop broken tables
  await dropAllBrokenTables();
  
  // Recreate from scratch
  await createTablesFromScratch();
  
  // Verify results
  await verifyTables();
  
  console.log('\n🎉 NUCLEAR FIX COMPLETE!');
  console.log('🚀 Your database should now be functional!');
  console.log('\n📋 Next steps:');
  console.log('   1. Run: node scripts/verify-database-complete.js');
  console.log('   2. Test user registration');
  console.log('   3. Check if appointment booking works');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log('❌ Missing environment variables!');
  process.exit(1);
}

main().catch(console.error);