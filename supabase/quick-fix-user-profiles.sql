-- Quick fix for missing columns in user_profiles table
-- Run this in Supabase SQL Editor

-- Add baby_due_date column
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS baby_due_date DATE;

-- Add postpartum_date column
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS postpartum_date DATE;

-- Add other potentially missing columns
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS number_of_children INTEGER DEFAULT 1;

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT;

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT;

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS emergency_contact_relationship TEXT;

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'America/Chicago';

-- Verify all columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
ORDER BY ordinal_position;