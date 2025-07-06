-- =====================================================
-- ACTIVATE ADMIN USERS
-- This creates admin records for existing auth users
-- =====================================================

-- 1. First, let's disable RLS on admin_activity_log (it's currently enabled)
ALTER TABLE public.admin_activity_log DISABLE ROW LEVEL SECURITY;

-- 2. Create admin record for the user that already has admin metadata
INSERT INTO public.admin_users (id, email, name, role, is_active)
SELECT 
    id, 
    email, 
    'Admin', 
    'admin', 
    true
FROM auth.users
WHERE email = 'admin@bloompsychologynorthaustin.com'
ON CONFLICT (id) DO UPDATE
SET is_active = true,
    role = 'admin',
    updated_at = now();

-- 3. Optionally, make yourself an admin (uncomment and change email)
-- INSERT INTO public.admin_users (id, email, name, role, is_active)
-- SELECT 
--     id, 
--     email, 
--     'Your Name', 
--     'admin', 
--     true
-- FROM auth.users
-- WHERE email = 'your-email@example.com'  -- Change this to your email
-- ON CONFLICT (id) DO UPDATE
-- SET is_active = true,
--     role = 'admin',
--     updated_at = now();

-- 4. Verify admin users were created
SELECT 
    au.email,
    au.name,
    au.role,
    au.is_active,
    au.last_login,
    u.created_at as user_created,
    CASE 
        WHEN u.email_confirmed_at IS NOT NULL THEN 'Confirmed'
        ELSE 'Unconfirmed'
    END as email_status
FROM public.admin_users au
JOIN auth.users u ON au.id = u.id
ORDER BY au.created_at;

-- 5. Grant necessary permissions (just to be sure)
GRANT ALL ON public.admin_users TO authenticated;
GRANT ALL ON public.admin_activity_log TO authenticated;

-- 6. Show summary
DO $$
DECLARE
    v_count integer;
BEGIN
    SELECT COUNT(*) INTO v_count FROM public.admin_users WHERE is_active = true;
    
    RAISE NOTICE '';
    RAISE NOTICE '✅ Admin setup complete!';
    RAISE NOTICE 'Active admins: %', v_count;
    RAISE NOTICE '';
    RAISE NOTICE 'You can now log in at:';
    RAISE NOTICE 'https://bloompsychologynorthaustin.com/admin/login';
    RAISE NOTICE '';
    RAISE NOTICE 'Use the email and password from your auth.users account.';
END $$;