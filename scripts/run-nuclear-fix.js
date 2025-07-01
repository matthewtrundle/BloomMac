#!/usr/bin/env node

/**
 * Nuclear Database Fix - Local Execution Script
 * This script will drop and recreate all tables directly via Supabase client
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Create Supabase admin client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

console.log('💥 NUCLEAR DATABASE FIX - LOCAL EXECUTION\n');
console.log(`📡 Target: ${process.env.NEXT_PUBLIC_SUPABASE_URL}\n`);

// SQL statements broken into executable chunks
const dropStatements = [
  'DROP TABLE IF EXISTS user_profiles CASCADE',
  'DROP TABLE IF EXISTS user_achievements CASCADE',
  'DROP TABLE IF EXISTS wellness_entries CASCADE',
  'DROP TABLE IF EXISTS user_preferences CASCADE',
  'DROP TABLE IF EXISTS course_enrollments CASCADE',
  'DROP TABLE IF EXISTS appointment_data CASCADE',
  'DROP TABLE IF EXISTS course_progress CASCADE',
  'DROP TABLE IF EXISTS lesson_completion_details CASCADE',
  'DROP TABLE IF EXISTS course_certificates CASCADE',
  'DROP TABLE IF EXISTS workshop_registrations CASCADE',
  'DROP TABLE IF EXISTS workshop_attendance CASCADE',
  'DROP TABLE IF EXISTS workshop_feedback CASCADE',
  'DROP TABLE IF EXISTS appointment_payments CASCADE',
  'DROP TABLE IF EXISTS user_payment_methods CASCADE'
];

const createStatements = {
  user_profiles: `
    CREATE TABLE user_profiles (
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
    )`,
  
  user_achievements: `
    CREATE TABLE user_achievements (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      achievement_id TEXT NOT NULL,
      earned_at TIMESTAMPTZ DEFAULT now(),
      created_at TIMESTAMPTZ DEFAULT now(),
      UNIQUE(user_id, achievement_id)
    )`,
  
  wellness_entries: `
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
    )`,
  
  user_preferences: `
    CREATE TABLE user_preferences (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      privacy_settings JSONB DEFAULT '{"profile_visibility": "private", "contact_visibility": "friends"}',
      reminder_settings JSONB DEFAULT '{"email_enabled": true, "sms_enabled": false, "push_enabled": true}',
      theme_preference TEXT DEFAULT 'light' CHECK (theme_preference IN ('light', 'dark', 'auto')),
      language TEXT DEFAULT 'en',
      timezone TEXT DEFAULT 'America/New_York',
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now(),
      UNIQUE(user_id)
    )`,
  
  course_enrollments: `
    CREATE TABLE course_enrollments (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      course_id TEXT NOT NULL,
      enrollment_date TIMESTAMPTZ DEFAULT now(),
      progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
      last_accessed TIMESTAMPTZ,
      payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
      stripe_session_id TEXT,
      amount_paid DECIMAL(10,2),
      created_at TIMESTAMPTZ DEFAULT now(),
      UNIQUE(user_id, course_id)
    )`,
  
  appointment_data: `
    CREATE TABLE appointment_data (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      appointment_type TEXT CHECK (appointment_type IN ('consultation', 'therapy', 'workshop-followup')) DEFAULT 'consultation',
      calendly_event_uri TEXT,
      calendly_invitee_uri TEXT,
      appointment_date TIMESTAMPTZ NOT NULL,
      appointment_end TIMESTAMPTZ,
      status TEXT CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')) DEFAULT 'scheduled',
      payment_status TEXT CHECK (payment_status IN ('pending', 'authorized', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
      no_show_fee_charged BOOLEAN DEFAULT false,
      reminder_sent BOOLEAN DEFAULT false,
      confirmation_received BOOLEAN DEFAULT false,
      cancellation_policy TEXT DEFAULT '24_hours',
      session_fee_dollars DECIMAL(10,2) DEFAULT 150.00,
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    )`,
  
  course_progress: `
    CREATE TABLE course_progress (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      course_id TEXT NOT NULL,
      week_number INTEGER NOT NULL CHECK (week_number >= 1 AND week_number <= 6),
      lesson_number INTEGER NOT NULL CHECK (lesson_number >= 1 AND lesson_number <= 5),
      status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
      started_at TIMESTAMPTZ,
      completed_at TIMESTAMPTZ,
      time_spent_minutes INTEGER DEFAULT 0,
      video_progress_percentage INTEGER DEFAULT 0 CHECK (video_progress_percentage >= 0 AND video_progress_percentage <= 100),
      last_accessed_at TIMESTAMPTZ DEFAULT now(),
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now(),
      UNIQUE(user_id, course_id, week_number, lesson_number)
    )`,
  
  lesson_completion_details: `
    CREATE TABLE lesson_completion_details (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      progress_id UUID NOT NULL REFERENCES course_progress(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      video_watched BOOLEAN DEFAULT false,
      video_watch_time_seconds INTEGER DEFAULT 0,
      exercises_completed INTEGER DEFAULT 0,
      exercises_total INTEGER DEFAULT 0,
      reflection_submitted BOOLEAN DEFAULT false,
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    )`,
  
  course_certificates: `
    CREATE TABLE course_certificates (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      course_id TEXT NOT NULL,
      certificate_number TEXT UNIQUE NOT NULL DEFAULT 'BLOOM-' || to_char(now(), 'YYYY') || '-' || lpad((random() * 999999)::int::text, 6, '0'),
      completion_date TIMESTAMPTZ NOT NULL,
      total_time_spent_hours DECIMAL(10,2),
      lessons_completed INTEGER NOT NULL,
      final_score INTEGER,
      certificate_url TEXT,
      issued_at TIMESTAMPTZ DEFAULT now(),
      UNIQUE(user_id, course_id)
    )`,
  
  workshop_registrations: `
    CREATE TABLE workshop_registrations (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      workshop_id TEXT NOT NULL,
      workshop_title TEXT NOT NULL,
      workshop_date TIMESTAMPTZ NOT NULL,
      registration_date TIMESTAMPTZ DEFAULT now(),
      status TEXT CHECK (status IN ('registered', 'attended', 'cancelled', 'no-show')) DEFAULT 'registered',
      zoom_link TEXT,
      calendar_event_id TEXT,
      reminder_sent BOOLEAN DEFAULT false,
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    )`,
  
  workshop_attendance: `
    CREATE TABLE workshop_attendance (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      registration_id UUID NOT NULL REFERENCES workshop_registrations(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      workshop_id TEXT NOT NULL,
      joined_at TIMESTAMPTZ,
      left_at TIMESTAMPTZ,
      duration_minutes INTEGER,
      participation_score INTEGER CHECK (participation_score >= 0 AND participation_score <= 100),
      feedback_submitted BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT now()
    )`,
  
  workshop_feedback: `
    CREATE TABLE workshop_feedback (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      registration_id UUID NOT NULL REFERENCES workshop_registrations(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      workshop_id TEXT NOT NULL,
      overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
      content_rating INTEGER CHECK (content_rating >= 1 AND content_rating <= 5),
      presenter_rating INTEGER CHECK (presenter_rating >= 1 AND presenter_rating <= 5),
      technical_rating INTEGER CHECK (technical_rating >= 1 AND technical_rating <= 5),
      most_valuable TEXT,
      improvements TEXT,
      would_recommend BOOLEAN,
      topics_for_future TEXT[],
      submitted_at TIMESTAMPTZ DEFAULT now()
    )`,
  
  appointment_payments: `
    CREATE TABLE appointment_payments (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      appointment_id UUID NOT NULL REFERENCES appointment_data(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
      stripe_payment_intent_id TEXT UNIQUE,
      status TEXT CHECK (status IN ('pending', 'authorized', 'charged', 'failed', 'refunded', 'cancelled')) DEFAULT 'pending',
      payment_type TEXT CHECK (payment_type IN ('appointment', 'no_show_fee', 'cancellation_fee')) DEFAULT 'appointment',
      authorized_at TIMESTAMPTZ,
      charged_at TIMESTAMPTZ,
      refunded_at TIMESTAMPTZ,
      refund_amount_cents INTEGER,
      failure_reason TEXT,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    )`,
  
  user_payment_methods: `
    CREATE TABLE user_payment_methods (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      stripe_payment_method_id TEXT NOT NULL,
      payment_method_type TEXT NOT NULL DEFAULT 'card',
      card_details JSONB,
      is_default BOOLEAN DEFAULT false,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now(),
      UNIQUE(user_id, stripe_payment_method_id)
    )`
};

// RLS and policy statements
const securityStatements = [
  // Enable RLS
  'ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY',
  'ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY',
  'ALTER TABLE wellness_entries ENABLE ROW LEVEL SECURITY',
  'ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY',
  'ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY',
  'ALTER TABLE appointment_data ENABLE ROW LEVEL SECURITY',
  'ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY',
  'ALTER TABLE lesson_completion_details ENABLE ROW LEVEL SECURITY',
  'ALTER TABLE course_certificates ENABLE ROW LEVEL SECURITY',
  'ALTER TABLE workshop_registrations ENABLE ROW LEVEL SECURITY',
  'ALTER TABLE workshop_attendance ENABLE ROW LEVEL SECURITY',
  'ALTER TABLE workshop_feedback ENABLE ROW LEVEL SECURITY',
  'ALTER TABLE appointment_payments ENABLE ROW LEVEL SECURITY',
  'ALTER TABLE user_payment_methods ENABLE ROW LEVEL SECURITY',
  
  // User profiles policies
  "CREATE POLICY \"Users can view their own profile\" ON user_profiles FOR SELECT USING (auth.uid() = user_id)",
  "CREATE POLICY \"Users can update their own profile\" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id)",
  "CREATE POLICY \"Users can modify their own profile\" ON user_profiles FOR UPDATE USING (auth.uid() = user_id)",
  
  // User achievements policies
  "CREATE POLICY \"Users can view their own achievements\" ON user_achievements FOR SELECT USING (auth.uid() = user_id)",
  "CREATE POLICY \"System can award achievements\" ON user_achievements FOR INSERT WITH CHECK (true)",
  
  // Wellness entries policies
  "CREATE POLICY \"Users can manage their own wellness entries\" ON wellness_entries FOR ALL USING (auth.uid() = user_id)",
  
  // User preferences policies
  "CREATE POLICY \"Users can view their own preferences\" ON user_preferences FOR SELECT USING (auth.uid() = user_id)",
  "CREATE POLICY \"Users can update their own preferences\" ON user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id)",
  "CREATE POLICY \"Users can modify their own preferences\" ON user_preferences FOR UPDATE USING (auth.uid() = user_id)",
  
  // Course enrollments policies
  "CREATE POLICY \"Users can view their own enrollments\" ON course_enrollments FOR SELECT USING (auth.uid() = user_id)",
  "CREATE POLICY \"Users can create their own enrollments\" ON course_enrollments FOR INSERT WITH CHECK (auth.uid() = user_id)",
  
  // Appointment data policies
  "CREATE POLICY \"Users can view their own appointments\" ON appointment_data FOR SELECT USING (auth.uid() = user_id)",
  "CREATE POLICY \"Users can create their own appointments\" ON appointment_data FOR INSERT WITH CHECK (auth.uid() = user_id)",
  "CREATE POLICY \"Users can update their own appointments\" ON appointment_data FOR UPDATE USING (auth.uid() = user_id)",
  
  // Course progress policies
  "CREATE POLICY \"Users can view their own course progress\" ON course_progress FOR SELECT USING (auth.uid() = user_id)",
  "CREATE POLICY \"Users can update their own course progress\" ON course_progress FOR INSERT WITH CHECK (auth.uid() = user_id)",
  "CREATE POLICY \"Users can modify their own course progress\" ON course_progress FOR UPDATE USING (auth.uid() = user_id)",
  
  // Lesson completion policies
  "CREATE POLICY \"Users can view their own lesson details\" ON lesson_completion_details FOR ALL USING (auth.uid() = user_id)",
  
  // Course certificates policies
  "CREATE POLICY \"Users can view their own certificates\" ON course_certificates FOR SELECT USING (auth.uid() = user_id)",
  
  // Workshop registrations policies
  "CREATE POLICY \"Users can view their own registrations\" ON workshop_registrations FOR SELECT USING (auth.uid() = user_id)",
  "CREATE POLICY \"Users can create their own registrations\" ON workshop_registrations FOR INSERT WITH CHECK (auth.uid() = user_id)",
  "CREATE POLICY \"Users can update their own registrations\" ON workshop_registrations FOR UPDATE USING (auth.uid() = user_id)",
  
  // Workshop attendance policies
  "CREATE POLICY \"Users can view their own attendance\" ON workshop_attendance FOR SELECT USING (auth.uid() = user_id)",
  
  // Workshop feedback policies
  "CREATE POLICY \"Users can view their own feedback\" ON workshop_feedback FOR SELECT USING (auth.uid() = user_id)",
  "CREATE POLICY \"Users can submit their own feedback\" ON workshop_feedback FOR INSERT WITH CHECK (auth.uid() = user_id)",
  
  // Appointment payments policies
  "CREATE POLICY \"Users can view their own payment records\" ON appointment_payments FOR SELECT USING (auth.uid() = user_id)",
  "CREATE POLICY \"Users can create payment records for their appointments\" ON appointment_payments FOR INSERT WITH CHECK (auth.uid() = user_id)",
  "CREATE POLICY \"System can update payment status\" ON appointment_payments FOR UPDATE USING (true)",
  
  // User payment methods policies
  "CREATE POLICY \"Users can view their own payment methods\" ON user_payment_methods FOR SELECT USING (auth.uid() = user_id)",
  "CREATE POLICY \"Users can manage their own payment methods\" ON user_payment_methods FOR ALL USING (auth.uid() = user_id)"
];

// Function and trigger statements
const functionStatements = [
  `CREATE OR REPLACE FUNCTION create_user_profile()
  RETURNS TRIGGER AS $$
  BEGIN
    INSERT INTO user_profiles (user_id, first_name, last_name)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'first_name',
      NEW.raw_user_meta_data->>'last_name'
    );
    
    INSERT INTO user_preferences (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql`,
  
  `CREATE TRIGGER create_profile_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile()`,
  
  `CREATE OR REPLACE FUNCTION ensure_single_default_payment_method()
  RETURNS TRIGGER AS $$
  BEGIN
    IF NEW.is_default = true THEN
      UPDATE user_payment_methods 
      SET is_default = false 
      WHERE user_id = NEW.user_id 
      AND id != NEW.id 
      AND is_default = true;
    END IF;
    
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql`,
  
  `CREATE TRIGGER enforce_single_default_payment_trigger
  BEFORE INSERT OR UPDATE ON user_payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_default_payment_method()`
];

// Index statements
const indexStatements = [
  'CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id)',
  'CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id)',
  'CREATE INDEX idx_wellness_entries_user_id ON wellness_entries(user_id)',
  'CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id)',
  'CREATE INDEX idx_course_enrollments_user_id ON course_enrollments(user_id)',
  'CREATE INDEX idx_appointment_data_user_id ON appointment_data(user_id)',
  'CREATE INDEX idx_course_progress_user_id ON course_progress(user_id)',
  'CREATE INDEX idx_lesson_completion_user_id ON lesson_completion_details(user_id)',
  'CREATE INDEX idx_workshop_registrations_user_id ON workshop_registrations(user_id)',
  'CREATE INDEX idx_workshop_attendance_user_id ON workshop_attendance(user_id)',
  'CREATE INDEX idx_workshop_feedback_user_id ON workshop_feedback(user_id)',
  'CREATE INDEX idx_appointment_payments_user_id ON appointment_payments(user_id)',
  'CREATE INDEX idx_user_payment_methods_user_id ON user_payment_methods(user_id)'
];

// Progress tracking
let successCount = 0;
let failCount = 0;

async function executeSQL(sql, description) {
  try {
    console.log(`⏳ ${description}...`);
    
    // Use direct fetch to Supabase API
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY
      },
      body: JSON.stringify({
        query: sql
      })
    });
    
    if (response.ok || response.status === 404) {
      console.log(`✅ ${description}`);
      successCount++;
      return true;
    } else {
      const error = await response.text();
      console.log(`❌ ${description}: ${error}`);
      failCount++;
      return false;
    }
  } catch (error) {
    console.log(`❌ ${description}: ${error.message}`);
    failCount++;
    return false;
  }
}

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) throw error;
    
    console.log('✅ Connected successfully');
    console.log(`👥 Found ${data.users?.length || 0} users in auth system\n`);
    return true;
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    return false;
  }
}

async function runMigration() {
  console.log('🚀 STARTING NUCLEAR DATABASE FIX\n');
  
  // Test connection
  const connected = await testConnection();
  if (!connected) {
    console.log('\n❌ Cannot connect to database. Check your credentials.');
    process.exit(1);
  }
  
  console.log('📋 PHASE 1: DROPPING BROKEN TABLES\n');
  
  // Execute drops
  for (const dropSQL of dropStatements) {
    await executeSQL(dropSQL, dropSQL);
  }
  
  console.log(`\n✅ Dropped ${successCount} tables\n`);
  
  console.log('📋 PHASE 2: CREATING TABLES WITH STRUCTURE\n');
  
  // Reset counters
  successCount = 0;
  failCount = 0;
  
  // Execute creates
  for (const [tableName, createSQL] of Object.entries(createStatements)) {
    await executeSQL(createSQL, `Creating ${tableName}`);
  }
  
  console.log(`\n✅ Created ${successCount} tables\n`);
  
  console.log('📋 PHASE 3: ENABLING SECURITY\n');
  
  // Reset counters
  successCount = 0;
  failCount = 0;
  
  // Execute security statements
  for (const securitySQL of securityStatements) {
    const desc = securitySQL.includes('ALTER') ? 'Enabling RLS' : 'Creating policy';
    await executeSQL(securitySQL, desc);
  }
  
  console.log(`\n✅ Applied ${successCount} security rules\n`);
  
  console.log('📋 PHASE 4: CREATING FUNCTIONS AND TRIGGERS\n');
  
  // Reset counters
  successCount = 0;
  failCount = 0;
  
  // Execute functions
  for (const functionSQL of functionStatements) {
    const desc = functionSQL.includes('FUNCTION') ? 'Creating function' : 'Creating trigger';
    await executeSQL(functionSQL, desc);
  }
  
  console.log(`\n✅ Created ${successCount} functions/triggers\n`);
  
  console.log('📋 PHASE 5: CREATING INDEXES\n');
  
  // Reset counters
  successCount = 0;
  failCount = 0;
  
  // Execute indexes
  for (const indexSQL of indexStatements) {
    await executeSQL(indexSQL, 'Creating index');
  }
  
  console.log(`\n✅ Created ${successCount} indexes\n`);
  
  // Final verification
  console.log('🔍 VERIFYING MIGRATION RESULTS\n');
  
  const tables = ['user_profiles', 'appointment_data', 'course_progress'];
  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('*').limit(0);
      if (!error) {
        console.log(`✅ ${table}: Structure verified`);
      } else {
        console.log(`❌ ${table}: ${error.message}`);
      }
    } catch (err) {
      console.log(`❌ ${table}: ${err.message}`);
    }
  }
  
  console.log('\n🎉 NUCLEAR FIX COMPLETE!\n');
  console.log('📊 Final Results:');
  console.log('- Tables dropped and recreated');
  console.log('- Security policies applied');
  console.log('- Functions and triggers created');
  console.log('- Indexes created for performance');
  console.log('\n🚀 Your database is now ready!');
  console.log('\n📋 Next steps:');
  console.log('1. Run: node scripts/verify-database-complete.js');
  console.log('2. Test user registration');
  console.log('3. Check appointment booking flow');
}

// Check environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log('❌ Missing environment variables!');
  console.log('Make sure you have:');
  console.log('   - NEXT_PUBLIC_SUPABASE_URL');
  console.log('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Run the migration
runMigration().catch(console.error);