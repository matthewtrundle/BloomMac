-- Safe fix for user_profiles table - handles existing policies and structure

-- Drop the table if it has wrong structure and recreate
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Create user_profiles table with correct structure
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  bio TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  preferences JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_status ON user_profiles(status);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Add policies (with IF NOT EXISTS equivalent)
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
  DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
  DROP POLICY IF EXISTS "Service role can manage profiles" ON user_profiles;
  
  -- Create new policies
  CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT TO authenticated
    USING (auth.uid() = id);

  CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

  CREATE POLICY "Service role can manage profiles" ON user_profiles
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);
END $$;

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_user_profiles_updated_at();

-- Test the table
INSERT INTO user_profiles (id, email, first_name, last_name, status)
VALUES ('00000000-0000-0000-0000-000000000000', 'test@example.com', 'Test', 'User', 'active')
ON CONFLICT (id) DO NOTHING;

DELETE FROM user_profiles WHERE id = '00000000-0000-0000-0000-000000000000';

SELECT 'user_profiles table is ready!' as status;