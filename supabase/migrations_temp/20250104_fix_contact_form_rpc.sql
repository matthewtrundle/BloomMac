-- Drop existing function if it exists with wrong signature
DROP FUNCTION IF EXISTS submit_contact_form CASCADE;

-- Create a simpler RPC function for anonymous contact form submissions
CREATE OR REPLACE FUNCTION submit_contact_form(
  contact_data jsonb
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_submission_id UUID;
  v_name TEXT;
  v_email TEXT;
  v_phone TEXT;
  v_service TEXT;
  v_message TEXT;
  v_page TEXT;
  v_user_agent TEXT;
  v_ip_address TEXT;
BEGIN
  -- Extract values from JSON
  v_name := contact_data->>'p_name';
  v_email := contact_data->>'p_email';
  v_phone := contact_data->>'p_phone';
  v_service := COALESCE(contact_data->>'p_service', 'general');
  v_message := contact_data->>'p_message';
  v_page := COALESCE(contact_data->>'p_page', '/contact');
  v_user_agent := COALESCE(contact_data->>'p_user_agent', '');
  v_ip_address := COALESCE(contact_data->>'p_ip_address', '');
  
  -- Validate required fields
  IF v_name IS NULL OR v_email IS NULL OR v_message IS NULL THEN
    RAISE EXCEPTION 'Name, email, and message are required';
  END IF;
  
  -- Insert contact submission
  INSERT INTO contact_submissions (
    name,
    email,
    phone,
    service,
    message,
    status,
    source,
    metadata
  ) VALUES (
    v_name,
    v_email,
    v_phone,
    v_service,
    v_message,
    'new',
    'website',
    jsonb_build_object(
      'page', v_page,
      'user_agent', v_user_agent,
      'ip_address', v_ip_address,
      'submitted_at', NOW()
    )
  )
  RETURNING id INTO v_submission_id;
  
  -- Track analytics event
  INSERT INTO analytics_events (
    type,
    page,
    session_id,
    data
  ) VALUES (
    'contact_form_submission',
    v_page,
    gen_random_uuid(),
    jsonb_build_object(
      'service', v_service,
      'has_phone', v_phone IS NOT NULL
    )
  );
  
  -- Return submission details
  RETURN jsonb_build_object(
    'id', v_submission_id,
    'success', true
  );
  
EXCEPTION
  WHEN OTHERS THEN
    -- Log error and re-raise
    RAISE EXCEPTION 'Contact form submission failed: %', SQLERRM;
END;
$$;

-- Grant execute permission to anonymous users
GRANT EXECUTE ON FUNCTION submit_contact_form(jsonb) TO anon;

-- Also create a policy to allow the function to insert
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for the function to insert (using SECURITY DEFINER)
CREATE POLICY "Allow contact form submissions via RPC" 
ON contact_submissions 
FOR INSERT 
TO anon 
WITH CHECK (false); -- Direct inserts not allowed, only via function