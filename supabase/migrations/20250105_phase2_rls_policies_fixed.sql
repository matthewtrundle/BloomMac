-- Phase 2: Comprehensive RLS Policies (FIXED)
-- This migration implements Row Level Security across all tables

-- Enable RLS on all tables that exist
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_workbook_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create career_applications table if it doesn't exist
CREATE TABLE IF NOT EXISTS career_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  position VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  resume TEXT,
  cover_letter TEXT,
  portfolio_url VARCHAR(500),
  linkedin_url VARCHAR(500),
  years_experience INTEGER,
  availability VARCHAR(255),
  salary_expectation VARCHAR(255),
  references TEXT,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE career_applications ENABLE ROW LEVEL SECURITY;

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

-- Service role can create contact submissions
CREATE POLICY "Service role can create contacts" 
ON contact_submissions FOR INSERT 
TO service_role
WITH CHECK (true);

-- Career Applications Policies
-- Admins can view all career applications
CREATE POLICY "Admins can view career applications" 
ON career_applications FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() AND is_active = true
  )
);

-- Service role can create career applications
CREATE POLICY "Service role can create applications" 
ON career_applications FOR INSERT 
TO service_role
WITH CHECK (true);

-- Admin Activity Log Policies
-- Only admins can view logs
CREATE POLICY "Admins can view activity logs" 
ON admin_activity_log FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() AND is_active = true
  )
);

-- Service role can insert logs
CREATE POLICY "Service role can insert logs" 
ON admin_activity_log FOR INSERT 
TO service_role
WITH CHECK (true);

-- Analytics Events Policies
-- Service role can insert analytics
CREATE POLICY "Service role can insert analytics" 
ON analytics_events FOR INSERT 
TO service_role
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
-- Service role can manage subscribers
CREATE POLICY "Service role can manage subscribers" 
ON newsletter_subscribers FOR ALL 
TO service_role
WITH CHECK (true);

-- Admins can view all subscribers
CREATE POLICY "Admins can view subscribers" 
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
CREATE POLICY "Public can view active courses" 
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
USING (auth.uid() = user_id);

-- Service role can create enrollments
CREATE POLICY "Service role can create enrollments" 
ON course_enrollments FOR INSERT 
TO service_role
WITH CHECK (true);

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

-- User Workbook Responses Policies
-- Users can manage their own workbook responses
CREATE POLICY "Users can manage own workbook responses" 
ON user_workbook_responses FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Admins can view all workbook responses
CREATE POLICY "Admins can view all workbook responses" 
ON user_workbook_responses FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() AND is_active = true
  )
);

-- Posts Policies
-- Everyone can view published posts
CREATE POLICY "Public can view published posts" 
ON posts FOR SELECT 
USING (published = true);

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

-- RPC Functions for Anonymous Actions
-- Contact form submission
CREATE OR REPLACE FUNCTION submit_contact_form(
  p_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_message TEXT,
  p_reason TEXT
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_id uuid;
BEGIN
  INSERT INTO contact_submissions (name, email, phone, message, reason)
  VALUES (p_name, p_email, p_phone, p_message, p_reason)
  RETURNING id INTO v_id;
  
  RETURN v_id;
END;
$$;

-- Career application submission
CREATE OR REPLACE FUNCTION submit_career_application(
  p_position TEXT,
  p_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_resume TEXT,
  p_cover_letter TEXT,
  p_portfolio_url TEXT,
  p_linkedin_url TEXT,
  p_years_experience INTEGER,
  p_availability TEXT,
  p_salary_expectation TEXT,
  p_references TEXT
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_id uuid;
BEGIN
  INSERT INTO career_applications (
    position, name, email, phone, resume, cover_letter,
    portfolio_url, linkedin_url, years_experience,
    availability, salary_expectation, references
  )
  VALUES (
    p_position, p_name, p_email, p_phone, p_resume, p_cover_letter,
    p_portfolio_url, p_linkedin_url, p_years_experience,
    p_availability, p_salary_expectation, p_references
  )
  RETURNING id INTO v_id;
  
  RETURN v_id;
END;
$$;

-- Newsletter subscription
CREATE OR REPLACE FUNCTION subscribe_to_newsletter(
  p_email TEXT,
  p_first_name TEXT DEFAULT NULL,
  p_last_name TEXT DEFAULT NULL,
  p_source TEXT DEFAULT 'website'
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO newsletter_subscribers (email, first_name, last_name, source, status)
  VALUES (p_email, p_first_name, p_last_name, p_source, 'active')
  ON CONFLICT (email) 
  DO UPDATE SET 
    status = 'active',
    updated_at = NOW();
  
  RETURN true;
END;
$$;

-- Grant execute permissions on RPC functions
GRANT EXECUTE ON FUNCTION submit_contact_form TO anon;
GRANT EXECUTE ON FUNCTION submit_career_application TO anon;
GRANT EXECUTE ON FUNCTION subscribe_to_newsletter TO anon;