# 💥 NUCLEAR DATABASE FIX - COPY PASTE SOLUTION

## The Problem
Your tables exist but have NO columns (ghost tables). We need to DROP them and recreate properly.

## The Solution
Copy and paste these 2 blocks into Supabase SQL Editor.

---

## STEP 1: DROP ALL BROKEN TABLES

Copy this entire block and paste into Supabase SQL Editor, then click **"Run"**:

```sql
-- Nuclear Fix Step 1: Drop all broken tables
-- This removes the empty shell tables that have no columns

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

-- Success message
SELECT 'All broken tables dropped successfully!' as result;
```

---

## STEP 2: CREATE ALL TABLES PROPERLY

After Step 1 succeeds, copy this entire block and paste into a NEW SQL query:

```sql
-- Nuclear Fix Step 2: Create all tables with proper structure
-- This creates the complete table structure with columns, security, and policies

-- Create user profiles table
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

-- Create user achievements table
CREATE TABLE user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Create wellness entries table
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

-- Create user preferences table
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

-- Create course enrollments table
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

-- Create appointment data table
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

-- Create course progress table
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

-- Create lesson completion details table
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

-- Create course certificates table
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

-- Create workshop registrations table
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

-- Create workshop attendance table
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

-- Create workshop feedback table
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

-- Create appointment payments table
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

-- Create user payment methods table
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

-- Create indexes for performance
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

-- Enable Row Level Security
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

-- Create RLS Policies
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

-- Create trigger function for auto profile creation
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

-- Create trigger for auto profile creation
CREATE TRIGGER create_profile_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();

-- Create function to ensure only one default payment method per user
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

-- Create trigger for default payment method enforcement
CREATE TRIGGER enforce_single_default_payment_trigger
  BEFORE INSERT OR UPDATE ON user_payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_default_payment_method();

-- Success message
SELECT 'NUCLEAR FIX COMPLETE! All tables created with proper structure!' as result;
```

---

## STEP 3: VERIFY SUCCESS

After both steps complete, run this command:

```bash
node scripts/verify-database-complete.js
```

You should see the health score jump from 17% to 95%+ 🎉

---

## What This Does:

1. **Step 1**: Completely removes all the broken empty shell tables
2. **Step 2**: Creates all tables from scratch with:
   - ✅ All proper columns
   - ✅ All security policies (RLS)
   - ✅ All indexes for performance
   - ✅ All triggers and functions
   - ✅ All foreign key relationships

After this, your database will be **completely functional** - no more ghost tables! 🚀