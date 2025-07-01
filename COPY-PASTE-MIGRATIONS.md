# 🚀 COPY-PASTE DATABASE MIGRATIONS

## Step 1: Go to Supabase SQL Editor
1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your Bloom project
3. Click **"SQL Editor"** in the sidebar
4. Click **"New Query"**

---

## Step 2: Copy and Paste Each Migration

### 🔧 MIGRATION 1: User Platform Tables

Copy this entire block and paste into Supabase SQL Editor, then click **"Run"**:

```sql
-- User Platform Tables Migration
-- Creates user profiles, achievements, wellness entries, preferences

-- Create user profiles table
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

-- Create user achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Create wellness entries table
CREATE TABLE IF NOT EXISTS wellness_entries (
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
CREATE TABLE IF NOT EXISTS user_preferences (
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
CREATE TABLE IF NOT EXISTS course_enrollments (
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

-- Update appointment_data table structure
ALTER TABLE appointment_data 
ADD COLUMN IF NOT EXISTS appointment_type TEXT CHECK (appointment_type IN ('consultation', 'therapy', 'workshop-followup')) DEFAULT 'consultation',
ADD COLUMN IF NOT EXISTS calendly_event_uri TEXT,
ADD COLUMN IF NOT EXISTS calendly_invitee_uri TEXT,
ADD COLUMN IF NOT EXISTS appointment_end TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')) DEFAULT 'scheduled',
ADD COLUMN IF NOT EXISTS payment_status TEXT CHECK (payment_status IN ('pending', 'authorized', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS no_show_fee_charged BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS confirmation_received BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS cancellation_policy TEXT DEFAULT '24_hours',
ADD COLUMN IF NOT EXISTS session_fee_dollars DECIMAL(10,2) DEFAULT 150.00,
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_wellness_entries_user_id ON wellness_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user_id ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointment_data_user_id ON appointment_data(user_id);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_data ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile data" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own achievements" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can award achievements" ON user_achievements
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can manage their own wellness entries" ON wellness_entries
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can modify their own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own enrollments" ON course_enrollments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own enrollments" ON course_enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own appointments" ON appointment_data
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own appointments" ON appointment_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointments" ON appointment_data
  FOR UPDATE USING (auth.uid() = user_id);

-- Create trigger for auto profile creation
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

-- Success message
SELECT 'Migration 1 completed successfully!' as result;
```

---

### 🔧 MIGRATION 2: Course Progress Tables

After Migration 1 succeeds, copy this into a new SQL query:

```sql
-- Course Progress Tables Migration
-- Adds columns to existing course progress tables and creates new ones

-- Add columns to course_progress table
ALTER TABLE course_progress 
ADD COLUMN IF NOT EXISTS week_number INTEGER CHECK (week_number >= 1 AND week_number <= 6),
ADD COLUMN IF NOT EXISTS lesson_number INTEGER CHECK (lesson_number >= 1 AND lesson_number <= 5),
ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS time_spent_minutes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS video_progress_percentage INTEGER DEFAULT 0 CHECK (video_progress_percentage >= 0 AND video_progress_percentage <= 100),
ADD COLUMN IF NOT EXISTS last_accessed_at TIMESTAMPTZ DEFAULT now(),
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Add columns to lesson_completion_details table
ALTER TABLE lesson_completion_details
ADD COLUMN IF NOT EXISTS progress_id UUID REFERENCES course_progress(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS video_watched BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS video_watch_time_seconds INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS exercises_completed INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS exercises_total INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS reflection_submitted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Add columns to course_certificates table
ALTER TABLE course_certificates
ADD COLUMN IF NOT EXISTS certificate_number TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS completion_date TIMESTAMPTZ NOT NULL DEFAULT now(),
ADD COLUMN IF NOT EXISTS total_time_spent_hours DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS lessons_completed INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS final_score INTEGER,
ADD COLUMN IF NOT EXISTS certificate_url TEXT,
ADD COLUMN IF NOT EXISTS issued_at TIMESTAMPTZ DEFAULT now();

-- Enable RLS on course tables
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_completion_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_certificates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for course progress
CREATE POLICY "Users can view their own course progress" ON course_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own course progress" ON course_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can modify their own course progress" ON course_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for lesson completion details
CREATE POLICY "Users can view their own lesson details" ON lesson_completion_details
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for certificates
CREATE POLICY "Users can view their own certificates" ON course_certificates
  FOR SELECT USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_course_progress_course_id ON course_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_status ON course_progress(status);
CREATE INDEX IF NOT EXISTS idx_lesson_completion_user_id ON lesson_completion_details(user_id);

-- Success message
SELECT 'Migration 2 completed successfully!' as result;
```

---

### 🔧 MIGRATION 3: Workshop Tables

Copy this after Migration 2 succeeds:

```sql
-- Workshop Tables Migration
-- Adds columns to existing workshop tables

-- Add columns to workshop_registrations table
ALTER TABLE workshop_registrations
ADD COLUMN IF NOT EXISTS workshop_id TEXT NOT NULL DEFAULT 'workshop-1',
ADD COLUMN IF NOT EXISTS workshop_title TEXT NOT NULL DEFAULT 'Workshop',
ADD COLUMN IF NOT EXISTS workshop_date TIMESTAMPTZ NOT NULL DEFAULT now(),
ADD COLUMN IF NOT EXISTS registration_date TIMESTAMPTZ DEFAULT now(),
ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('registered', 'attended', 'cancelled', 'no-show')) DEFAULT 'registered',
ADD COLUMN IF NOT EXISTS zoom_link TEXT,
ADD COLUMN IF NOT EXISTS calendar_event_id TEXT,
ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Add columns to workshop_attendance table
ALTER TABLE workshop_attendance
ADD COLUMN IF NOT EXISTS registration_id UUID REFERENCES workshop_registrations(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS workshop_id TEXT NOT NULL DEFAULT 'workshop-1',
ADD COLUMN IF NOT EXISTS joined_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS left_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS duration_minutes INTEGER,
ADD COLUMN IF NOT EXISTS participation_score INTEGER CHECK (participation_score >= 0 AND participation_score <= 100),
ADD COLUMN IF NOT EXISTS feedback_submitted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

-- Add columns to workshop_feedback table  
ALTER TABLE workshop_feedback
ADD COLUMN IF NOT EXISTS registration_id UUID REFERENCES workshop_registrations(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS workshop_id TEXT NOT NULL DEFAULT 'workshop-1',
ADD COLUMN IF NOT EXISTS overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
ADD COLUMN IF NOT EXISTS content_rating INTEGER CHECK (content_rating >= 1 AND content_rating <= 5),
ADD COLUMN IF NOT EXISTS presenter_rating INTEGER CHECK (presenter_rating >= 1 AND presenter_rating <= 5),
ADD COLUMN IF NOT EXISTS technical_rating INTEGER CHECK (technical_rating >= 1 AND technical_rating <= 5),
ADD COLUMN IF NOT EXISTS most_valuable TEXT,
ADD COLUMN IF NOT EXISTS improvements TEXT,
ADD COLUMN IF NOT EXISTS would_recommend BOOLEAN,
ADD COLUMN IF NOT EXISTS topics_for_future TEXT[],
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ DEFAULT now();

-- Enable RLS
ALTER TABLE workshop_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_feedback ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own registrations" ON workshop_registrations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own registrations" ON workshop_registrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own registrations" ON workshop_registrations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own attendance" ON workshop_attendance
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own feedback" ON workshop_feedback
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can submit their own feedback" ON workshop_feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_workshop_registrations_user_id ON workshop_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_workshop_registrations_workshop_id ON workshop_registrations(workshop_id);
CREATE INDEX IF NOT EXISTS idx_workshop_attendance_user_id ON workshop_attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_workshop_feedback_user_id ON workshop_feedback(user_id);

-- Success message
SELECT 'Migration 3 completed successfully!' as result;
```

---

### 🔧 MIGRATION 4: Payment Tables

Copy this after Migration 3 succeeds:

```sql
-- Payment Tables Migration
-- Adds columns to existing payment tables

-- Add columns to appointment_payments table
ALTER TABLE appointment_payments
ADD COLUMN IF NOT EXISTS appointment_id UUID REFERENCES appointment_data(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS amount_cents INTEGER NOT NULL DEFAULT 15000 CHECK (amount_cents > 0),
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('pending', 'authorized', 'charged', 'failed', 'refunded', 'cancelled')) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_type TEXT CHECK (payment_type IN ('appointment', 'no_show_fee', 'cancellation_fee')) DEFAULT 'appointment',
ADD COLUMN IF NOT EXISTS authorized_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS charged_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS refund_amount_cents INTEGER,
ADD COLUMN IF NOT EXISTS failure_reason TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Add columns to user_payment_methods table
ALTER TABLE user_payment_methods
ADD COLUMN IF NOT EXISTS stripe_payment_method_id TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS payment_method_type TEXT NOT NULL DEFAULT 'card',
ADD COLUMN IF NOT EXISTS card_details JSONB,
ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Enable RLS
ALTER TABLE appointment_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_payment_methods ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for appointment_payments
CREATE POLICY "Users can view their own payment records" ON appointment_payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create payment records for their appointments" ON appointment_payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update payment status" ON appointment_payments
  FOR UPDATE USING (true);

-- Create RLS policies for user_payment_methods
CREATE POLICY "Users can view their own payment methods" ON user_payment_methods
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own payment methods" ON user_payment_methods
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_appointment_payments_user_id ON appointment_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointment_payments_appointment_id ON appointment_payments(appointment_id);
CREATE INDEX IF NOT EXISTS idx_appointment_payments_status ON appointment_payments(status);
CREATE INDEX IF NOT EXISTS idx_user_payment_methods_user_id ON user_payment_methods(user_id);

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
SELECT 'Migration 4 completed successfully! Database is now ready!' as result;
```

---

## Step 3: Verify Success

After running all 4 migrations, run this command to verify:

```bash
node scripts/verify-database-complete.js
```

You should see the health score jump from 17% to 90%+ 🎉

---

## 🎯 What Each Migration Does:

1. **Migration 1**: Creates user profiles, achievements, wellness tracking, course enrollments, and fixes appointment_data table
2. **Migration 2**: Adds all missing columns to course progress tables  
3. **Migration 3**: Adds all missing columns to workshop tables
4. **Migration 4**: Adds all missing columns to payment tables + creates payment functions

After this, your database will be fully functional! 🚀