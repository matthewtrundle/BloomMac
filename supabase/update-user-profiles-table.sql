-- Add any missing columns to user_profiles table
-- This is safe to run multiple times

-- Add columns if they don't exist
DO $$ 
BEGIN
    -- Add postpartum_date if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_profiles' 
                   AND column_name = 'postpartum_date') THEN
        ALTER TABLE public.user_profiles ADD COLUMN postpartum_date DATE;
    END IF;

    -- Add baby_due_date if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_profiles' 
                   AND column_name = 'baby_due_date') THEN
        ALTER TABLE public.user_profiles ADD COLUMN baby_due_date DATE;
    END IF;

    -- Add number_of_children if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_profiles' 
                   AND column_name = 'number_of_children') THEN
        ALTER TABLE public.user_profiles ADD COLUMN number_of_children INTEGER DEFAULT 1;
    END IF;

    -- Add emergency contact fields if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_profiles' 
                   AND column_name = 'emergency_contact_name') THEN
        ALTER TABLE public.user_profiles ADD COLUMN emergency_contact_name TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_profiles' 
                   AND column_name = 'emergency_contact_phone') THEN
        ALTER TABLE public.user_profiles ADD COLUMN emergency_contact_phone TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_profiles' 
                   AND column_name = 'emergency_contact_relationship') THEN
        ALTER TABLE public.user_profiles ADD COLUMN emergency_contact_relationship TEXT;
    END IF;

    -- Add timezone if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_profiles' 
                   AND column_name = 'timezone') THEN
        ALTER TABLE public.user_profiles ADD COLUMN timezone TEXT DEFAULT 'America/Chicago';
    END IF;
END $$;