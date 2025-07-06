-- Profiles Table Cleanup Migration
-- Run this script in Supabase SQL Editor
-- 
-- IMPORTANT: Review each step before running!

-- Step 1: Check current state
SELECT 
  'user_profiles' as table_name,
  COUNT(*) as record_count
FROM user_profiles
UNION ALL
SELECT 
  'profiles' as table_name,
  COUNT(*) as record_count
FROM profiles;

-- Step 2: Show any profiles not in user_profiles
SELECT p.*
FROM profiles p
LEFT JOIN user_profiles up ON p.id = up.id
WHERE up.id IS NULL;

-- Step 3: Create backup table (run this first!)
CREATE TABLE profiles_backup_2025_01_06 AS 
SELECT * FROM profiles;

-- Step 4: Migrate any missing profiles to user_profiles
-- Only run if Step 2 shows results!
INSERT INTO user_profiles (
  id,
  first_name,
  last_name,
  phone,
  postpartum_date,
  number_of_children,
  emergency_contact_name,
  emergency_contact_phone,
  status,
  created_at,
  updated_at
)
SELECT 
  p.id,
  COALESCE(p.first_name, ''),
  COALESCE(p.last_name, ''),
  p.phone,
  p.postpartum_date,
  COALESCE(p.number_of_children, 0),
  p.emergency_contact_name,
  p.emergency_contact_phone,
  'active',
  p.created_at,
  p.updated_at
FROM profiles p
LEFT JOIN user_profiles up ON p.id = up.id
WHERE up.id IS NULL;

-- Step 5: Verify migration
SELECT 
  'After migration - user_profiles' as status,
  COUNT(*) as record_count
FROM user_profiles;

-- Step 6: Drop the profiles table (only after verification!)
-- UNCOMMENT TO RUN:
-- DROP TABLE profiles;

-- Step 7: Verify profiles table is gone
-- This should return an error after dropping
-- SELECT COUNT(*) FROM profiles;