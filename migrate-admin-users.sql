-- This script migrates users from the admin_users table to the user_profiles table.

INSERT INTO user_profiles (id, email, first_name, last_name, role, created_at, updated_at)
SELECT id, email, name, '', 'admin', created_at, updated_at
FROM admin_users
ON CONFLICT (id) DO NOTHING;
