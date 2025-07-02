-- Safe RLS fix - Only allows users to manage their own profiles
-- This is SAFE to run and maintains security

-- First, check current policies
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can upsert own profile" ON public.user_profiles;

-- Create a single comprehensive policy
CREATE POLICY "Enable access to own profile only" 
ON public.user_profiles
FOR ALL 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Verify RLS is still enabled (for security)
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname = 'user_profiles';

-- The above should show 't' for relrowsecurity, meaning RLS is ON