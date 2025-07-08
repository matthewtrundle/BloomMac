-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_role CHECK (role IN ('admin', 'super_admin', 'editor'))
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin_users
CREATE POLICY "Admin users can view all admin users" 
ON admin_users FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() 
    AND is_active = true
  )
);

CREATE POLICY "Super admins can manage admin users" 
ON admin_users FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() 
    AND role = 'super_admin' 
    AND is_active = true
  )
);

-- Insert Matthew as super admin
INSERT INTO admin_users (id, email, role, is_active)
VALUES (
  '2a6835a5-6041-463f-b6bb-f6c5d38bea59',
  'matthewtrundle@gmail.com',
  'super_admin',
  true
) ON CONFLICT (id) DO UPDATE SET
  role = 'super_admin',
  is_active = true,
  updated_at = NOW();

-- Also add the other admin users from user_profiles
INSERT INTO admin_users (id, email, role, is_active)
SELECT 
  up.id,
  u.email,
  'admin',
  true
FROM user_profiles up
JOIN auth.users u ON u.id = up.id
WHERE up.role = 'admin'
  AND up.id != '2a6835a5-6041-463f-b6bb-f6c5d38bea59'
ON CONFLICT (id) DO NOTHING;

-- Verify
SELECT * FROM admin_users ORDER BY created_at;