-- Create RPC function for anonymous contact form submissions
CREATE OR REPLACE FUNCTION submit_contact_form(
  p_name TEXT,
  p_email TEXT,
  p_phone TEXT DEFAULT NULL,
  p_service TEXT DEFAULT 'general',
  p_message TEXT,
  p_page TEXT DEFAULT '/contact',
  p_user_agent TEXT DEFAULT '',
  p_ip_address TEXT DEFAULT ''
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_submission_id UUID;
  v_subscriber_id UUID;
BEGIN
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
    p_name,
    p_email,
    p_phone,
    p_service,
    p_message,
    'new',
    'website',
    jsonb_build_object(
      'page', p_page,
      'user_agent', p_user_agent,
      'ip_address', p_ip_address,
      'submitted_at', NOW()
    )
  )
  RETURNING id INTO v_submission_id;

  -- Add or update subscriber for email automation
  INSERT INTO subscribers (
    email,
    first_name,
    last_name,
    status,
    source,
    metadata
  ) VALUES (
    p_email,
    split_part(p_name, ' ', 1),
    CASE 
      WHEN array_length(string_to_array(p_name, ' '), 1) > 1 
      THEN array_to_string(string_to_array(p_name, ' ')[2:], ' ')
      ELSE ''
    END,
    'active',
    'contact_form',
    jsonb_build_object(
      'last_contact_date', NOW(),
      'service_interest', p_service,
      'contact_message', LEFT(p_message, 100) || '...'
    )
  )
  ON CONFLICT (email) DO UPDATE
  SET 
    metadata = jsonb_set(
      COALESCE(subscribers.metadata, '{}'::jsonb),
      '{last_contact_date}',
      to_jsonb(NOW())
    ),
    updated_at = NOW()
  RETURNING id INTO v_subscriber_id;

  -- Create email automation trigger
  INSERT INTO email_automation_triggers (
    subscriber_id,
    trigger_type,
    trigger_data,
    triggered_at
  ) VALUES (
    v_subscriber_id,
    'contact_form',
    jsonb_build_object(
      'service_interest', p_service,
      'contact_message', p_message,
      'phone', p_phone,
      'source_page', p_page
    ),
    NOW()
  );

  -- Track analytics event
  INSERT INTO analytics_events (
    type,
    page,
    session_id,
    data
  ) VALUES (
    'contact_form_submission',
    p_page,
    gen_random_uuid(),
    jsonb_build_object(
      'service', p_service,
      'has_phone', p_phone IS NOT NULL
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
GRANT EXECUTE ON FUNCTION submit_contact_form TO anon;

-- Create secure function for admin contact management
CREATE OR REPLACE FUNCTION get_contact_submissions(
  p_status TEXT DEFAULT NULL,
  p_limit INT DEFAULT 50,
  p_offset INT DEFAULT 0
) RETURNS TABLE (
  id UUID,
  name TEXT,
  email TEXT,
  phone TEXT,
  service TEXT,
  message TEXT,
  status TEXT,
  source TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is admin
  IF NOT check_user_role_unified(auth.uid()::TEXT, 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  RETURN QUERY
  SELECT 
    cs.id,
    cs.name,
    cs.email,
    cs.phone,
    cs.service,
    cs.message,
    cs.status,
    cs.source,
    cs.metadata,
    cs.created_at,
    cs.updated_at
  FROM contact_submissions cs
  WHERE (p_status IS NULL OR cs.status = p_status)
  ORDER BY cs.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- Grant execute permission to authenticated users (admins will be checked inside)
GRANT EXECUTE ON FUNCTION get_contact_submissions TO authenticated;

-- Create function to update contact status
CREATE OR REPLACE FUNCTION update_contact_status(
  p_contact_id UUID,
  p_new_status TEXT,
  p_notes TEXT DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is admin
  IF NOT check_user_role_unified(auth.uid()::TEXT, 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  -- Update contact submission
  UPDATE contact_submissions
  SET 
    status = p_new_status,
    updated_at = NOW(),
    metadata = CASE 
      WHEN p_notes IS NOT NULL 
      THEN jsonb_set(
        COALESCE(metadata, '{}'::jsonb),
        '{admin_notes}',
        to_jsonb(p_notes)
      )
      ELSE metadata
    END
  WHERE id = p_contact_id;

  -- Log admin action
  INSERT INTO admin_activity_log (
    user_id,
    action,
    entity_type,
    entity_id,
    details
  ) VALUES (
    auth.uid(),
    'update_contact_status',
    'contact_submission',
    p_contact_id,
    jsonb_build_object(
      'new_status', p_new_status,
      'notes', p_notes
    )
  );

  RETURN TRUE;
END;
$$;

-- Grant execute permission to authenticated users (admins will be checked inside)
GRANT EXECUTE ON FUNCTION update_contact_status TO authenticated;