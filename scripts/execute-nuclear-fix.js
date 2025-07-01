#!/usr/bin/env node

/**
 * Execute Nuclear Fix - Direct SQL execution via Supabase
 * This script runs the complete database rebuild locally
 */

const https = require('https');
require('dotenv').config();

console.log('💥 NUCLEAR DATABASE FIX - LOCAL EXECUTION\n');
console.log(`📡 Target: ${process.env.NEXT_PUBLIC_SUPABASE_URL}\n`);

// Extract project ref from URL
const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)[1];
console.log(`🔑 Project Reference: ${projectRef}\n`);

// All SQL in one block for nuclear fix
const nuclearFixSQL = `
-- PHASE 1: DROP ALL BROKEN TABLES
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS wellness_entries CASCADE;
DROP TABLE IF EXISTS user_preferences CASCADE;
DROP TABLE IF EXISTS course_enrollments CASCADE;
DROP TABLE IF EXISTS appointment_data CASCADE;
DROP TABLE IF EXISTS course_progress CASCADE;
DROP TABLE IF EXISTS lesson_completion_details CASCADE;
DROP TABLE IF EXISTS course_certificates CASCADE;
DROP TABLE IF EXISTS workshop_registrations CASCADE;
DROP TABLE IF EXISTS workshop_attendance CASCADE;
DROP TABLE IF EXISTS workshop_feedback CASCADE;
DROP TABLE IF EXISTS appointment_payments CASCADE;
DROP TABLE IF EXISTS user_payment_methods CASCADE;

-- PHASE 2: CREATE ALL TABLES WITH PROPER STRUCTURE
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
);

CREATE TABLE user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

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
);

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
);

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
);

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
);

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
);

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
);

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
);

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
);

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
);

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
);

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
);

-- PHASE 3: CREATE INDEXES
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_wellness_entries_user_id ON wellness_entries(user_id);
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_course_enrollments_user_id ON course_enrollments(user_id);
CREATE INDEX idx_appointment_data_user_id ON appointment_data(user_id);
CREATE INDEX idx_course_progress_user_id ON course_progress(user_id);
CREATE INDEX idx_lesson_completion_user_id ON lesson_completion_details(user_id);
CREATE INDEX idx_workshop_registrations_user_id ON workshop_registrations(user_id);
CREATE INDEX idx_workshop_attendance_user_id ON workshop_attendance(user_id);
CREATE INDEX idx_workshop_feedback_user_id ON workshop_feedback(user_id);
CREATE INDEX idx_appointment_payments_user_id ON appointment_payments(user_id);
CREATE INDEX idx_user_payment_methods_user_id ON user_payment_methods(user_id);

-- PHASE 4: ENABLE RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_completion_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_payment_methods ENABLE ROW LEVEL SECURITY;

-- PHASE 5: CREATE RLS POLICIES
CREATE POLICY "Users can view their own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can modify their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can award achievements" ON user_achievements FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can manage their own wellness entries" ON wellness_entries FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own preferences" ON user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own preferences" ON user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can modify their own preferences" ON user_preferences FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own enrollments" ON course_enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own enrollments" ON course_enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own appointments" ON appointment_data FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own appointments" ON appointment_data FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own appointments" ON appointment_data FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own course progress" ON course_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own course progress" ON course_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can modify their own course progress" ON course_progress FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own lesson details" ON lesson_completion_details FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own certificates" ON course_certificates FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own registrations" ON workshop_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own registrations" ON workshop_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own registrations" ON workshop_registrations FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own attendance" ON workshop_attendance FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own feedback" ON workshop_feedback FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can submit their own feedback" ON workshop_feedback FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own payment records" ON appointment_payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create payment records for their appointments" ON appointment_payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "System can update payment status" ON appointment_payments FOR UPDATE USING (true);

CREATE POLICY "Users can view their own payment methods" ON user_payment_methods FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own payment methods" ON user_payment_methods FOR ALL USING (auth.uid() = user_id);

-- PHASE 6: CREATE FUNCTIONS AND TRIGGERS
CREATE OR REPLACE FUNCTION create_user_profile()
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_profile_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();

CREATE OR REPLACE FUNCTION ensure_single_default_payment_method()
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_single_default_payment_trigger
  BEFORE INSERT OR UPDATE ON user_payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_default_payment_method();
`;

// Function to execute SQL via Supabase's query endpoint
function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query: sql });
    
    const options = {
      hostname: `${projectRef}.supabase.co`,
      port: 443,
      path: '/rest/v1/rpc',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY
      }
    };
    
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve({ success: true, data: responseData });
        } else {
          resolve({ success: false, error: responseData, status: res.statusCode });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.write(data);
    req.end();
  });
}

async function runNuclearFix() {
  console.log('🎯 EXECUTING NUCLEAR FIX...\n');
  console.log('⚠️  WARNING: This will drop and recreate all tables!\n');
  console.log('Press Ctrl+C now to cancel, or wait 5 seconds to continue...\n');
  
  // Give user time to cancel
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  console.log('🚀 Starting database rebuild...\n');
  
  try {
    // Split SQL into chunks if needed
    console.log('📋 Executing complete database rebuild...');
    console.log('This includes:');
    console.log('- Dropping 14 broken tables');
    console.log('- Creating 14 tables with proper structure');
    console.log('- Creating 13 indexes');
    console.log('- Enabling RLS on all tables');
    console.log('- Creating 30 security policies');
    console.log('- Creating 2 functions and 2 triggers\n');
    
    const result = await executeSQL(nuclearFixSQL);
    
    if (result.success) {
      console.log('✅ ✅ ✅ NUCLEAR FIX COMPLETED SUCCESSFULLY! ✅ ✅ ✅\n');
      console.log('📊 What was done:');
      console.log('- All broken tables dropped');
      console.log('- All tables recreated with proper columns');
      console.log('- Security policies applied');
      console.log('- Functions and triggers created');
      console.log('- Indexes created for performance\n');
      
      console.log('🎉 Your database is now fully functional!\n');
      console.log('📋 Next steps:');
      console.log('1. Run: node scripts/verify-database-complete.js');
      console.log('2. Test user registration at /auth/signup');
      console.log('3. Check dashboard at /dashboard');
    } else {
      console.log('❌ Nuclear fix encountered an issue:\n');
      console.log(`Status: ${result.status}`);
      console.log(`Error: ${result.error}\n`);
      
      if (result.error.includes('function public.rpc() does not exist')) {
        console.log('⚠️  Your Supabase instance doesn\'t support direct SQL execution via API.');
        console.log('📋 Please use the copy-paste method instead:');
        console.log('   1. Open NUCLEAR-FIX-COPY-PASTE.md');
        console.log('   2. Copy the SQL blocks');
        console.log('   3. Run them in Supabase SQL Editor');
      }
    }
  } catch (error) {
    console.log('❌ Execution failed:', error.message);
    console.log('\n📋 Please use the manual copy-paste method:');
    console.log('   1. Open NUCLEAR-FIX-COPY-PASTE.md');
    console.log('   2. Copy the SQL blocks');
    console.log('   3. Run them in Supabase SQL Editor');
  }
}

// Check environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log('❌ Missing environment variables!');
  console.log('Make sure you have:');
  console.log('   - NEXT_PUBLIC_SUPABASE_URL');
  console.log('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Run the nuclear fix
runNuclearFix().catch(console.error);