-- Bloom Psychology Complete Database Schema Migration
-- Run this migration to set up all required tables and relationships

-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  postpartum_date DATE,
  number_of_children INTEGER DEFAULT 0,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Update course_enrollments table (add missing columns)
ALTER TABLE course_enrollments 
ADD COLUMN IF NOT EXISTS enrollment_method TEXT DEFAULT 'paid' CHECK (enrollment_method IN ('free', 'paid', 'gifted')),
ADD COLUMN IF NOT EXISTS amount_paid DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS stripe_payment_id TEXT,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- 3. Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  lesson_number INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id, lesson_number)
);

-- 4. Create workbook_questions table
CREATE TABLE IF NOT EXISTS workbook_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id TEXT NOT NULL,
  week_number INTEGER NOT NULL,
  question_number INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT DEFAULT 'text' CHECK (question_type IN ('text', 'textarea', 'radio', 'checkbox')),
  options JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, week_number, question_number)
);

-- 5. Create workbook_responses table
CREATE TABLE IF NOT EXISTS workbook_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  week_number INTEGER NOT NULL,
  question_id UUID REFERENCES workbook_questions(id) ON DELETE CASCADE,
  response TEXT,
  is_draft BOOLEAN DEFAULT TRUE,
  is_submitted BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- 6. Update appointments table (add missing columns)
ALTER TABLE appointments
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
ADD COLUMN IF NOT EXISTS confirmation_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS confirmation_received BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE;

-- 7. Update user_achievements table (add missing columns)
ALTER TABLE user_achievements
ADD COLUMN IF NOT EXISTS type TEXT,
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS icon TEXT,
ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;

-- 8. Create course_activity_logs table
CREATE TABLE IF NOT EXISTS course_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('lesson_view', 'lesson_complete', 'workbook_start', 'workbook_submit')),
  lesson_number INTEGER,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE workbook_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workbook_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_activity_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Course enrollments policies
CREATE POLICY "Users can view own enrollments" ON course_enrollments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own enrollments" ON course_enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User progress policies
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own progress" ON user_progress
  FOR ALL USING (auth.uid() = user_id);

-- Workbook questions policies (public read)
CREATE POLICY "Anyone can read questions" ON workbook_questions
  FOR SELECT USING (true);

-- Workbook responses policies
CREATE POLICY "Users can manage own responses" ON workbook_responses
  FOR ALL USING (auth.uid() = user_id);

-- Appointments policies
CREATE POLICY "Users can manage own appointments" ON appointments
  FOR ALL USING (auth.uid() = user_id);

-- User achievements policies
CREATE POLICY "Users can view own achievements" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

-- Course activity logs policies
CREATE POLICY "Users can view own activity" ON course_activity_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity" ON course_activity_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON course_enrollments(status);
CREATE INDEX IF NOT EXISTS idx_progress_user_course ON user_progress(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_progress_completed ON user_progress(completed);
CREATE INDEX IF NOT EXISTS idx_workbook_responses_user ON workbook_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_workbook_responses_course_week ON workbook_responses(course_id, week_number);
CREATE INDEX IF NOT EXISTS idx_appointments_user ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON course_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_course ON course_activity_logs(course_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON course_activity_logs(created_at);

-- Create update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_progress_updated_at ON user_progress;
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_workbook_responses_updated_at ON workbook_responses;
CREATE TRIGGER update_workbook_responses_updated_at BEFORE UPDATE ON workbook_responses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();