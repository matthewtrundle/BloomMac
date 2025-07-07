-- Create test users for local development
-- First, delete any existing test users to avoid conflicts
DELETE FROM auth.users WHERE email IN ('admin@test.local', 'user@test.local', 'therapist@test.local');

-- Insert test users with properly encrypted passwords
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'admin@test.local',
  crypt('testpass123', gen_salt('bf')),
  now(),
  null,
  null,
  '{"provider":"email","providers":["email"]}',
  '{"name":"Test Admin"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
), (
  '22222222-2222-2222-2222-222222222222',
  '00000000-0000-0000-0000-000000000000',
  'user@test.local',
  crypt('testpass123', gen_salt('bf')),
  now(),
  null,
  null,
  '{"provider":"email","providers":["email"]}',
  '{"name":"Test User"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
), (
  '33333333-3333-3333-3333-333333333333',
  '00000000-0000-0000-0000-000000000000',
  'therapist@test.local',
  crypt('testpass123', gen_salt('bf')),
  now(),
  null,
  null,
  '{"provider":"email","providers":["email"]}',
  '{"name":"Test Therapist"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Insert identities for the users
INSERT INTO auth.identities (
  id,
  user_id,
  provider_id,
  provider,
  identity_data,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  'admin@test.local',
  'email',
  jsonb_build_object(
    'sub', '11111111-1111-1111-1111-111111111111',
    'email', 'admin@test.local',
    'email_verified', true,
    'phone_verified', false
  ),
  null,
  now(),
  now()
), (
  gen_random_uuid(),
  '22222222-2222-2222-2222-222222222222',
  'user@test.local',
  'email',
  jsonb_build_object(
    'sub', '22222222-2222-2222-2222-222222222222',
    'email', 'user@test.local',
    'email_verified', true,
    'phone_verified', false
  ),
  null,
  now(),
  now()
), (
  gen_random_uuid(),
  '33333333-3333-3333-3333-333333333333',
  'therapist@test.local',
  'email',
  jsonb_build_object(
    'sub', '33333333-3333-3333-3333-333333333333',
    'email', 'therapist@test.local',
    'email_verified', true,
    'phone_verified', false
  ),
  null,
  now(),
  now()
);

-- Ensure admin_users entries exist
INSERT INTO admin_users (id, email, name, role, is_active, created_at, updated_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'admin@test.local', 'Test Admin', 'super_admin', true, now(), now()),
  ('33333333-3333-3333-3333-333333333333', 'therapist@test.local', 'Test Therapist', 'admin', true, now(), now())
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;

-- Ensure user_profiles entry exists
INSERT INTO user_profiles (id, first_name, last_name, created_at, updated_at)
VALUES 
  ('22222222-2222-2222-2222-222222222222', 'Test', 'User', now(), now())
ON CONFLICT (id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name;