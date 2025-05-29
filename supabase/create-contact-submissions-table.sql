-- Create contact_submissions table to store all contact form data
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  service VARCHAR(255),
  message TEXT NOT NULL,
  source VARCHAR(100), -- 'contact_page', 'postpartum_landing_page', etc
  page TEXT, -- Full URL where form was submitted
  status VARCHAR(50) DEFAULT 'new', -- 'new', 'read', 'replied', 'archived'
  replied_at TIMESTAMP WITH TIME ZONE,
  notes TEXT, -- Internal notes about the contact
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes for performance
  INDEX idx_contact_email (email),
  INDEX idx_contact_status (status),
  INDEX idx_contact_created (created_at DESC),
  INDEX idx_contact_source (source)
);

-- Grant permissions
GRANT ALL ON contact_submissions TO authenticated;
GRANT INSERT ON contact_submissions TO anon; -- Allow anonymous form submissions

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_contact_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_contact_submissions_updated_at
BEFORE UPDATE ON contact_submissions
FOR EACH ROW
EXECUTE FUNCTION update_contact_updated_at();

-- Check if we have any existing data
SELECT COUNT(*) as existing_contacts FROM contact_submissions;