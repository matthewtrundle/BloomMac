# Manual Profile Migration Instructions

Since the Supabase CLI is not installed, please run this migration manually:

## Steps:

1. Go to your Supabase Dashboard
2. Navigate to the SQL Editor: https://app.supabase.com/project/_/sql/new
3. Copy and paste the following SQL:

```sql
-- Fix user_profiles table to ensure all fields needed by profile edit page exist
-- This migration adds any missing fields without affecting existing data

-- Add baby_due_date field if it doesn't exist
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS baby_due_date DATE;

-- Add timezone field if it doesn't exist
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'America/Chicago';

-- Add avatar field if it doesn't exist (from another migration)
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Ensure all fields allow NULL values except the required ones (first_name, last_name)
-- This prevents "not-null constraint" errors when saving partial data
DO $$ 
BEGIN
    -- Only alter if column exists and is NOT NULL
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'phone' 
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE user_profiles ALTER COLUMN phone DROP NOT NULL;
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'postpartum_date' 
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE user_profiles ALTER COLUMN postpartum_date DROP NOT NULL;
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'number_of_children' 
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE user_profiles ALTER COLUMN number_of_children DROP NOT NULL;
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'emergency_contact_name' 
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE user_profiles ALTER COLUMN emergency_contact_name DROP NOT NULL;
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'emergency_contact_phone' 
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE user_profiles ALTER COLUMN emergency_contact_phone DROP NOT NULL;
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'emergency_contact_relationship' 
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE user_profiles ALTER COLUMN emergency_contact_relationship DROP NOT NULL;
    END IF;
END $$;

-- Set default values for numeric fields to prevent null issues
ALTER TABLE user_profiles 
ALTER COLUMN number_of_children SET DEFAULT 0;

-- Add indexes for commonly queried fields
CREATE INDEX IF NOT EXISTS idx_user_profiles_phone ON user_profiles(phone) WHERE phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_profiles_postpartum_date ON user_profiles(postpartum_date) WHERE postpartum_date IS NOT NULL;

-- Check what columns exist
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
ORDER BY ordinal_position;
```

4. Click the "Run" button
5. You should see a success message and a list of columns in the user_profiles table

## Verification

After running the migration, the output should show that `baby_due_date` and `timezone` columns exist, and that most columns (except `id`, `first_name`, and `last_name`) allow NULL values.

## Testing

Once the migration is complete:
1. Go to https://www.bloompsychologynorthaustin.com/dashboard
2. Click on "Edit Profile" 
3. Fill in some information and click "Save Changes"
4. The save should now work without errors

## Troubleshooting

If you still get errors after running the migration:
1. Check the browser console for specific error messages
2. Look at the Network tab to see the exact API response
3. The error message should indicate which field is causing issues