-- ============================================
-- FIX CONTACT FORM RPC - CORRECT VERSION
-- Based on actual table schema
-- ============================================

-- Drop old version
DROP FUNCTION IF EXISTS public.submit_contact_form(JSONB);

-- Create function that matches actual table structure
CREATE OR REPLACE FUNCTION public.submit_contact_form(contact_data JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_id UUID;
    v_name TEXT;
    v_first_name TEXT;
    v_last_name TEXT;
BEGIN
    -- Extract data from JSON
    v_name := contact_data->>'p_name';
    
    -- Split name into first and last (optional fields)
    v_first_name := split_part(v_name, ' ', 1);
    v_last_name := CASE 
        WHEN array_length(string_to_array(v_name, ' '), 1) > 1 
        THEN trim(substring(v_name from position(' ' in v_name) + 1))
        ELSE NULL
    END;
    
    -- Insert into contact_submissions with correct columns
    INSERT INTO contact_submissions (
        name,           -- Required
        email,          -- Required
        first_name,     -- Optional
        last_name,      -- Optional
        phone,          -- Optional
        service,        -- Optional
        message,        -- Optional
        page,           -- Optional
        user_agent,     -- Optional
        ip_address,     -- Optional
        source,         -- Optional - set to 'contact_form'
        status,         -- Optional - set to 'new'
        created_at
    ) VALUES (
        v_name,         -- Required: full name
        contact_data->>'p_email',    -- Required: email
        v_first_name,   -- Extracted first name
        v_last_name,    -- Extracted last name
        contact_data->>'p_phone',
        contact_data->>'p_service',
        contact_data->>'p_message',
        contact_data->>'p_page',
        contact_data->>'p_user_agent',
        contact_data->>'p_ip_address',
        'contact_form', -- Source
        'new',          -- Status
        NOW()
    ) RETURNING id INTO v_id;
    
    -- Return success response
    RETURN jsonb_build_object(
        'id', v_id, 
        'success', true,
        'message', 'Contact form submitted successfully'
    );
EXCEPTION
    WHEN OTHERS THEN
        -- Return error details for debugging
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'detail', SQLSTATE
        );
END;
$$;

-- Grant execute permission to anonymous users
GRANT EXECUTE ON FUNCTION public.submit_contact_form(JSONB) TO anon;

-- Test the function
SELECT submit_contact_form(jsonb_build_object(
    'p_name', 'Test User',
    'p_email', 'test@example.com',
    'p_phone', '555-1234',
    'p_service', 'general',
    'p_message', 'This is a test',
    'p_page', '/contact',
    'p_user_agent', 'Test Script',
    'p_ip_address', '127.0.0.1'
));