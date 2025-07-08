-- Create or replace the submit_contact_form RPC function
CREATE OR REPLACE FUNCTION submit_contact_form(contact_data jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_submission_id uuid;
    v_name text;
    v_email text;
    v_phone text;
    v_service text;
    v_message text;
    v_page text;
    v_user_agent text;
    v_ip_address text;
BEGIN
    -- Extract values from JSONB
    v_name := contact_data->>'p_name';
    v_email := contact_data->>'p_email';
    v_phone := contact_data->>'p_phone';
    v_service := COALESCE(contact_data->>'p_service', 'general');
    v_message := contact_data->>'p_message';
    v_page := COALESCE(contact_data->>'p_page', '/contact');
    v_user_agent := contact_data->>'p_user_agent';
    v_ip_address := contact_data->>'p_ip_address';

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
        metadata,
        created_at,
        updated_at
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
            'submitted_at', now()
        ),
        now(),
        now()
    )
    RETURNING id INTO v_submission_id;

    -- Track analytics event (if analytics_events table exists)
    BEGIN
        INSERT INTO analytics_events (
            event_type,
            category,
            page_path,
            metadata,
            created_at
        ) VALUES (
            'form_submission',
            'contact',
            v_page,
            jsonb_build_object(
                'submission_id', v_submission_id,
                'service', v_service,
                'email', v_email
            ),
            now()
        );
    EXCEPTION WHEN OTHERS THEN
        -- Ignore if analytics_events table doesn't exist
        NULL;
    END;

    -- Return success response
    RETURN jsonb_build_object(
        'id', v_submission_id,
        'success', true
    );
END;
$$;

-- Grant execute permission to anon role (for public access)
GRANT EXECUTE ON FUNCTION submit_contact_form(jsonb) TO anon;

-- Add comment
COMMENT ON FUNCTION submit_contact_form(jsonb) IS 'Handles contact form submissions from the website';