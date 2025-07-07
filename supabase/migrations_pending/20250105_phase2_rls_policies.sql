-- Phase 2: Comprehensive RLS Policies
-- This migration implements Row Level Security across all tables

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_workbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE workbook_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
-- Users can view and update their own profile
CREATE POLICY "Users can view own profile" 
ON user_profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON user_profiles FOR UPDATE 
USING (auth.uid() = id);

-- Users can create their own profile (for registration)
CREATE POLICY "Users can create own profile" 
ON user_profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" 
ON user_profiles FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() AND is_active = true
  )
);

-- Contact Submissions Policies
-- Anonymous users can create contact submissions via RPC function only
-- No direct insert policy needed since we use RPC

-- Admins can view all contact submissions
CREATE POLICY "Admins can view contact submissions" 
ON contact_submissions FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() AND is_active = true
  )
);

-- Career Applications Policies
-- Anonymous users can create applications
CREATE POLICY "Anyone can submit career application" 
ON career_applications FOR INSERT 
TO anon
WITH CHECK (true);

-- Admins can view and manage all applications
CREATE POLICY "Admins can manage career applications" 
ON career_applications FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() AND is_active = true
  )
);

-- Admin Activity Log Policies
-- Only admins can view activity logs
CREATE POLICY "Admins can view activity logs" 
ON admin_activity_log FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() AND is_active = true
  )
);

-- System can insert activity logs (via service role)
-- No INSERT policy needed for authenticated users

-- Analytics Events Policies
-- Anonymous users can create events
CREATE POLICY "Anyone can create analytics events" 
ON analytics_events FOR INSERT 
TO anon
WITH CHECK (true);

-- Admins can view all analytics
CREATE POLICY "Admins can view analytics" 
ON analytics_events FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() AND is_active = true
  )
);

-- Newsletter Subscribers Policies
-- Anonymous users can subscribe
CREATE POLICY "Anyone can subscribe to newsletter" 
ON newsletter_subscribers FOR INSERT 
TO anon
WITH CHECK (true);

-- Users can manage their own subscription
CREATE POLICY "Users can manage own subscription" 
ON newsletter_subscribers FOR ALL 
TO authenticated
USING (
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Admins can view all subscribers
CREATE POLICY "Admins can view all subscribers" 
ON newsletter_subscribers FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() AND is_active = true
  )
);

-- Courses Policies
-- Everyone can view active courses
CREATE POLICY "Everyone can view active courses" 
ON courses FOR SELECT 
USING (is_active = true);

-- Admins can manage all courses
CREATE POLICY "Admins can manage courses" 
ON courses FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() AND is_active = true
  )
);

-- Course Enrollments Policies
-- Users can view their own enrollments
CREATE POLICY "Users can view own enrollments" 
ON course_enrollments FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Users can enroll themselves
CREATE POLICY "Users can enroll in courses" 
ON course_enrollments FOR INSERT 
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Admins can view all enrollments
CREATE POLICY "Admins can view all enrollments" 
ON course_enrollments FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() AND is_active = true
  )
);

-- Workbook Templates Policies
-- Everyone can view active templates
CREATE POLICY "Everyone can view active workbook templates" 
ON workbook_templates FOR SELECT 
USING (is_active = true);

-- User Workbooks Policies
-- Users can manage their own workbooks
CREATE POLICY "Users can manage own workbooks" 
ON user_workbooks FOR ALL 
TO authenticated
USING (user_id = auth.uid());

-- Posts (Blog) Policies
-- Everyone can view published posts
CREATE POLICY "Everyone can view published posts" 
ON posts FOR SELECT 
USING (status = 'published');

-- Admins can manage all posts
CREATE POLICY "Admins can manage posts" 
ON posts FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() AND is_active = true
  )
);

-- Create helper function to check admin status
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() 
    AND is_active = true
  );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;