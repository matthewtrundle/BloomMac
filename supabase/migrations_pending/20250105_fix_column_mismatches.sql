-- Fix column mismatches between test expectations and actual schema

-- Add missing columns to user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS website text,
ADD COLUMN IF NOT EXISTS location text;

-- Add missing columns to user_preferences
ALTER TABLE public.user_preferences
ADD COLUMN IF NOT EXISTS theme_preference text DEFAULT 'light',
ADD COLUMN IF NOT EXISTS language_preference text DEFAULT 'en',
ADD COLUMN IF NOT EXISTS timezone text DEFAULT 'UTC';

-- Add missing columns to wellness_entries
ALTER TABLE public.wellness_entries
ADD COLUMN IF NOT EXISTS mood_rating integer CHECK (mood_rating >= 1 AND mood_rating <= 10),
ADD COLUMN IF NOT EXISTS sleep_hours decimal(3,1),
ADD COLUMN IF NOT EXISTS exercise_minutes integer;

-- Add missing columns to course_enrollments
ALTER TABLE public.course_enrollments
ADD COLUMN IF NOT EXISTS enrollment_method text DEFAULT 'purchased',
ADD COLUMN IF NOT EXISTS enrollment_source text,
ADD COLUMN IF NOT EXISTS progress_percentage integer DEFAULT 0;

-- Add missing columns to admin_users
ALTER TABLE public.admin_users
ADD COLUMN IF NOT EXISTS password_hash text,
ADD COLUMN IF NOT EXISTS permissions jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Fix table that might be missing
CREATE TABLE IF NOT EXISTS public.course_modules (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    course_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    order_index integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id),
    FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE
);

-- Enable RLS on course_modules if it was just created
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;

-- Create policy for course_modules
CREATE POLICY IF NOT EXISTS "Users can view modules of enrolled courses" ON public.course_modules
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.course_enrollments
            WHERE course_enrollments.course_id = course_modules.course_id
            AND course_enrollments.user_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM public.courses
            WHERE courses.id = course_modules.course_id
            AND courses.is_free = true
        )
    );