-- Bloom Psychology Complete Database Schema Migration (SAFE VERSION)
-- This version can be run multiple times safely and handles existing tables/columns

-- First, let's check what tables exist
DO $$
BEGIN
    -- Create a temporary table to track our progress
    CREATE TEMP TABLE IF NOT EXISTS migration_log (
        step TEXT,
        status TEXT,
        executed_at TIMESTAMP DEFAULT NOW()
    );
END $$;

-- 1. Create or update profiles table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
        CREATE TABLE profiles (
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
        INSERT INTO migration_log (step, status) VALUES ('Create profiles table', 'SUCCESS');
    ELSE
        -- Add missing columns to existing table
        ALTER TABLE profiles 
        ADD COLUMN IF NOT EXISTS phone TEXT,
        ADD COLUMN IF NOT EXISTS postpartum_date DATE,
        ADD COLUMN IF NOT EXISTS number_of_children INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT,
        ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT,
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        INSERT INTO migration_log (step, status) VALUES ('Update profiles table', 'SUCCESS');
    END IF;
END $$;

-- 2. Create or update course_enrollments table
DO $$
BEGIN
    -- Add each column separately to avoid errors
    ALTER TABLE course_enrollments ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid();
    ALTER TABLE course_enrollments ADD COLUMN IF NOT EXISTS user_id UUID;
    ALTER TABLE course_enrollments ADD COLUMN IF NOT EXISTS course_id TEXT;
    ALTER TABLE course_enrollments ADD COLUMN IF NOT EXISTS enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    ALTER TABLE course_enrollments ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
    ALTER TABLE course_enrollments ADD COLUMN IF NOT EXISTS enrollment_method TEXT DEFAULT 'paid';
    ALTER TABLE course_enrollments ADD COLUMN IF NOT EXISTS amount_paid DECIMAL(10,2) DEFAULT 0;
    ALTER TABLE course_enrollments ADD COLUMN IF NOT EXISTS stripe_payment_id TEXT;
    ALTER TABLE course_enrollments ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;
    ALTER TABLE course_enrollments ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    
    -- Add constraints only if they don't exist
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_enrollments_pkey') THEN
        ALTER TABLE course_enrollments ADD PRIMARY KEY (id);
    END IF;
    
    -- Add foreign key if not exists
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_enrollments_user_id_fkey') THEN
        ALTER TABLE course_enrollments ADD CONSTRAINT course_enrollments_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
    
    -- Add check constraints
    ALTER TABLE course_enrollments DROP CONSTRAINT IF EXISTS course_enrollments_status_check;
    ALTER TABLE course_enrollments ADD CONSTRAINT course_enrollments_status_check 
        CHECK (status IN ('active', 'completed', 'cancelled'));
    
    ALTER TABLE course_enrollments DROP CONSTRAINT IF EXISTS course_enrollments_enrollment_method_check;
    ALTER TABLE course_enrollments ADD CONSTRAINT course_enrollments_enrollment_method_check 
        CHECK (enrollment_method IN ('free', 'paid', 'gifted'));
    
    INSERT INTO migration_log (step, status) VALUES ('Update course_enrollments table', 'SUCCESS');
END $$;

-- 3. Create user_progress table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_progress') THEN
        CREATE TABLE user_progress (
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
        INSERT INTO migration_log (step, status) VALUES ('Create user_progress table', 'SUCCESS');
    END IF;
END $$;

-- 4. Create workbook_questions table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'workbook_questions') THEN
        CREATE TABLE workbook_questions (
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
        INSERT INTO migration_log (step, status) VALUES ('Create workbook_questions table', 'SUCCESS');
    END IF;
END $$;

-- 5. Create workbook_responses table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'workbook_responses') THEN
        CREATE TABLE workbook_responses (
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
        INSERT INTO migration_log (step, status) VALUES ('Create workbook_responses table', 'SUCCESS');
    END IF;
END $$;

-- 6. Update appointments table
DO $$
BEGIN
    ALTER TABLE appointments 
    ADD COLUMN IF NOT EXISTS notes TEXT,
    ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
    ADD COLUMN IF NOT EXISTS confirmation_sent BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS confirmation_received BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE;
    
    -- Add check constraint
    ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_payment_status_check;
    ALTER TABLE appointments ADD CONSTRAINT appointments_payment_status_check 
        CHECK (payment_status IN ('pending', 'paid', 'refunded'));
    
    INSERT INTO migration_log (step, status) VALUES ('Update appointments table', 'SUCCESS');
END $$;

-- 7. Update user_achievements table
DO $$
BEGIN
    ALTER TABLE user_achievements 
    ADD COLUMN IF NOT EXISTS type TEXT,
    ADD COLUMN IF NOT EXISTS name TEXT,
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS icon TEXT,
    ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;
    
    INSERT INTO migration_log (step, status) VALUES ('Update user_achievements table', 'SUCCESS');
END $$;

-- 8. Create course_activity_logs table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'course_activity_logs') THEN
        CREATE TABLE course_activity_logs (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            course_id TEXT NOT NULL,
            activity_type TEXT NOT NULL CHECK (activity_type IN ('lesson_view', 'lesson_complete', 'workbook_start', 'workbook_submit')),
            lesson_number INTEGER,
            metadata JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        INSERT INTO migration_log (step, status) VALUES ('Create course_activity_logs table', 'SUCCESS');
    END IF;
END $$;

-- Enable RLS on all tables (safe to run multiple times)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE workbook_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workbook_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_activity_logs ENABLE ROW LEVEL SECURITY;

-- Drop and recreate all policies to ensure they're correct
-- Profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Course enrollments policies
DROP POLICY IF EXISTS "Users can view own enrollments" ON course_enrollments;
CREATE POLICY "Users can view own enrollments" ON course_enrollments
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own enrollments" ON course_enrollments;
CREATE POLICY "Users can insert own enrollments" ON course_enrollments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User progress policies
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
CREATE POLICY "Users can view own progress" ON user_progress
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own progress" ON user_progress;
CREATE POLICY "Users can manage own progress" ON user_progress
    FOR ALL USING (auth.uid() = user_id);

-- Workbook questions policies
DROP POLICY IF EXISTS "Anyone can read questions" ON workbook_questions;
CREATE POLICY "Anyone can read questions" ON workbook_questions
    FOR SELECT USING (true);

-- Workbook responses policies
DROP POLICY IF EXISTS "Users can manage own responses" ON workbook_responses;
CREATE POLICY "Users can manage own responses" ON workbook_responses
    FOR ALL USING (auth.uid() = user_id);

-- Appointments policies
DROP POLICY IF EXISTS "Users can manage own appointments" ON appointments;
CREATE POLICY "Users can manage own appointments" ON appointments
    FOR ALL USING (auth.uid() = user_id);

-- User achievements policies
DROP POLICY IF EXISTS "Users can view own achievements" ON user_achievements;
CREATE POLICY "Users can view own achievements" ON user_achievements
    FOR SELECT USING (auth.uid() = user_id);

-- Course activity logs policies
DROP POLICY IF EXISTS "Users can view own activity" ON course_activity_logs;
CREATE POLICY "Users can view own activity" ON course_activity_logs
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own activity" ON course_activity_logs;
CREATE POLICY "Users can insert own activity" ON course_activity_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes (IF NOT EXISTS handles duplicates)
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

-- Create or replace functions
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

-- Show migration results
SELECT * FROM migration_log ORDER BY executed_at;