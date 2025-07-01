-- Fix Auth Trigger for Auto Profile Creation
-- This ensures user profiles and preferences are created automatically on signup

-- First, drop existing trigger if it exists
DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;
DROP FUNCTION IF EXISTS create_user_profile();

-- Create improved trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create user profile
  INSERT INTO public.user_profiles (user_id, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  
  -- Create user preferences with defaults
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  
  -- Create welcome achievement
  INSERT INTO public.user_achievements (user_id, achievement_id)
  VALUES (NEW.id, 'welcome_star');
  
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log error but don't fail user creation
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, service_role;

-- Test the trigger by checking existing users
DO $$
DECLARE
  v_user_count INTEGER;
  v_profile_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_user_count FROM auth.users;
  SELECT COUNT(*) INTO v_profile_count FROM public.user_profiles;
  
  RAISE NOTICE 'Users in auth.users: %', v_user_count;
  RAISE NOTICE 'Profiles in user_profiles: %', v_profile_count;
  
  -- Create profiles for any users missing them
  INSERT INTO public.user_profiles (user_id, first_name, last_name)
  SELECT 
    u.id,
    COALESCE(u.raw_user_meta_data->>'first_name', ''),
    COALESCE(u.raw_user_meta_data->>'last_name', '')
  FROM auth.users u
  LEFT JOIN public.user_profiles p ON u.id = p.user_id
  WHERE p.user_id IS NULL;
  
  -- Create preferences for any users missing them
  INSERT INTO public.user_preferences (user_id)
  SELECT u.id
  FROM auth.users u
  LEFT JOIN public.user_preferences p ON u.id = p.user_id
  WHERE p.user_id IS NULL;
  
  GET DIAGNOSTICS v_profile_count = ROW_COUNT;
  IF v_profile_count > 0 THEN
    RAISE NOTICE 'Created % missing profiles', v_profile_count;
  END IF;
END $$;

-- Create a function to manually create profile (backup method)
CREATE OR REPLACE FUNCTION public.ensure_user_profile(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Create profile if it doesn't exist
  INSERT INTO public.user_profiles (user_id)
  VALUES (p_user_id)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Create preferences if they don't exist
  INSERT INTO public.user_preferences (user_id)
  VALUES (p_user_id)
  ON CONFLICT (user_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.ensure_user_profile(UUID) TO authenticated;

-- Success message
SELECT 'Auth trigger fixed! New users will have profiles created automatically.' as result;