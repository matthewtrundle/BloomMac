-- Create initial admin user for Bloom Psychology
-- This should be run after creating the admin tables

-- First, we need to create a user in auth.users
-- Note: In production, you should create the user through Supabase Auth UI or API
-- This is just for initial setup

-- Create a function to setup admin user
CREATE OR REPLACE FUNCTION setup_initial_admin(
  admin_email TEXT,
  admin_id UUID DEFAULT gen_random_uuid()
) RETURNS TABLE (
  message TEXT,
  user_id UUID,
  instructions TEXT
) AS $$
DECLARE
  existing_user_id UUID;
BEGIN
  -- Check if user already exists
  SELECT id INTO existing_user_id FROM auth.users WHERE email = admin_email;
  
  IF existing_user_id IS NOT NULL THEN
    -- User exists, just add admin role
    INSERT INTO admin_users (id, role, permissions, is_active)
    VALUES (
      existing_user_id, 
      'super_admin',
      '{"all": true}'::jsonb,
      true
    )
    ON CONFLICT (id) DO UPDATE
    SET role = 'super_admin',
        permissions = '{"all": true}'::jsonb,
        is_active = true;
    
    RETURN QUERY
    SELECT 
      'Admin role added to existing user'::TEXT as message,
      existing_user_id as user_id,
      'User already exists. Admin privileges have been granted.'::TEXT as instructions;
  ELSE
    -- Return instructions for creating new user
    RETURN QUERY
    SELECT 
      'New admin user needs to be created'::TEXT as message,
      admin_id as user_id,
      E'To create a new admin user:\n' ||
      E'1. Go to Supabase Dashboard > Authentication > Users\n' ||
      E'2. Click "Invite User"\n' ||
      E'3. Enter email: ' || admin_email || E'\n' ||
      E'4. After user accepts invite and sets password, run:\n' ||
      E'   SELECT finalize_admin_setup(''' || admin_email || ''');'::TEXT as instructions;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to finalize admin setup after user creation
CREATE OR REPLACE FUNCTION finalize_admin_setup(admin_email TEXT)
RETURNS TABLE (
  success BOOLEAN,
  message TEXT
) AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Get user ID
  SELECT id INTO user_id FROM auth.users WHERE email = admin_email;
  
  IF user_id IS NULL THEN
    RETURN QUERY
    SELECT false, 'User not found. Please create the user first.'::TEXT;
  ELSE
    -- Add admin role
    INSERT INTO admin_users (id, role, permissions, is_active)
    VALUES (
      user_id, 
      'super_admin',
      '{"all": true}'::jsonb,
      true
    )
    ON CONFLICT (id) DO UPDATE
    SET role = 'super_admin',
        permissions = '{"all": true}'::jsonb,
        is_active = true;
    
    RETURN QUERY
    SELECT true, 'Admin setup completed successfully!'::TEXT;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create default email templates
INSERT INTO email_templates (name, subject, body, category, variables) VALUES
(
  'contact_form_auto_response',
  'Thank you for contacting Bloom Psychology',
  E'Dear {{name}},\n\nThank you for reaching out to Bloom Psychology. We have received your message and will respond within 24-48 hours.\n\nYour message:\n{{message}}\n\nBest regards,\nThe Bloom Psychology Team',
  'contact_response',
  '["name", "message"]'::jsonb
),
(
  'application_received',
  'Application Received - {{position}}',
  E'Dear {{first_name}},\n\nThank you for applying for the {{position}} position at Bloom Psychology. We have received your application and will review it carefully.\n\nWe will contact you within 5-7 business days regarding next steps.\n\nBest regards,\nBloom Psychology Hiring Team',
  'application_response',
  '["first_name", "position"]'::jsonb
)
ON CONFLICT (name) DO NOTHING;

-- Instructions for setup
DO $$
BEGIN
  RAISE NOTICE E'\n\n=== ADMIN SETUP INSTRUCTIONS ===\n';
  RAISE NOTICE E'To set up your initial admin user:\n';
  RAISE NOTICE E'1. Run: SELECT * FROM setup_initial_admin(''your-admin@email.com'');\n';
  RAISE NOTICE E'2. Follow the instructions provided\n';
  RAISE NOTICE E'3. After creating the user, run: SELECT * FROM finalize_admin_setup(''your-admin@email.com'');\n';
  RAISE NOTICE E'\nReplace ''your-admin@email.com'' with your actual admin email address.\n';
  RAISE NOTICE E'================================\n';
END $$;