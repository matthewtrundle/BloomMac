-- Fix admin_users table structure
-- Remove the password column since we use Supabase auth

-- First, drop the password column
ALTER TABLE admin_users DROP COLUMN IF EXISTS password;

-- Ensure the table has the correct structure
ALTER TABLE admin_users 
  ALTER COLUMN name DROP NOT NULL;

-- Update the existing admin user to match the auth user
INSERT INTO admin_users (id, email, name, role, is_active)
VALUES (
  '6ebf06a7-e69f-450b-8f0d-1751e43c804f',
  'admin@bloompsychologynorthaustin.com',
  'Dr. Jana Rundle',
  'super_admin',
  true
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Remove mismatched entries
DELETE FROM admin_users 
WHERE email = 'jana@bloompsychologynorthaustin.com';

DELETE FROM admin_users 
WHERE email = 'admin@bloom.com';

-- Verify the result
SELECT * FROM admin_users;