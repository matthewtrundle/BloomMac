-- Option 1: Reset password for admin@bloompsychologynorthaustin.com
UPDATE auth.users
SET encrypted_password = crypt('NewAdminPassword123!', gen_salt('bf'))
WHERE email = 'admin@bloompsychologynorthaustin.com';

-- Option 2: Make your personal account an admin
-- Replace with your actual email
INSERT INTO public.admin_users (id, email, name, role, is_active)
SELECT 
    id, 
    email, 
    split_part(email, '@', 1), -- Uses part before @ as name
    'admin', 
    true
FROM auth.users
WHERE email = 'mattrundle1@gmail.com'  -- CHANGE THIS TO YOUR EMAIL
ON CONFLICT (id) DO UPDATE
SET is_active = true,
    role = 'admin',
    updated_at = now();