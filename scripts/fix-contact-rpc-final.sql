-- ============================================
-- FIX CONTACT FORM RPC - FINAL VERSION
-- Handle the name column properly
-- ============================================

-- Drop and recreate with proper column handling
DROP FUNCTION IF EXISTS public.submit_contact_form(JSONB);

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
    
    -- Split name into first and last
    v_first_name := split_part(v_name, ' ', 1);
    v_last_name := CASE 
        WHEN array_length(string_to_array(v_name, ' '), 1) > 1 
        THEN trim(substring(v_name from position(' ' in v_name) + 1))
        ELSE ''
    END;
    
    -- Check which columns exist and insert accordingly
    -- This handles both old schema (name column) and new schema (first_name, last_name)
    INSERT INTO contact_submissions (
        name,  -- Include this if it exists
        first_name,
        last_name,
        email,
        phone,
        service,
        message,
        page,
        user_agent,
        ip_address,
        created_at
    ) VALUES (
        v_name,  -- Full name for backward compatibility
        v_first_name,
        v_last_name,
        contact_data->>'p_email',
        contact_data->>'p_phone',
        contact_data->>'p_service',
        contact_data->>'p_message',
        contact_data->>'p_page',
        contact_data->>'p_user_agent',
        contact_data->>'p_ip_address',
        NOW()
    ) RETURNING id INTO v_id;
    
    -- Return success response
    RETURN jsonb_build_object('id', v_id, 'success', true);
EXCEPTION
    WHEN OTHERS THEN
        -- If name column doesn't exist, try without it
        IF SQLERRM LIKE '%column "name"%' THEN
            INSERT INTO contact_submissions (
                first_name,
                last_name,
                email,
                phone,
                service,
                message,
                page,
                user_agent,
                ip_address,
                created_at
            ) VALUES (
                v_first_name,
                v_last_name,
                contact_data->>'p_email',
                contact_data->>'p_phone',
                contact_data->>'p_service',
                contact_data->>'p_message',
                contact_data->>'p_page',
                contact_data->>'p_user_agent',
                contact_data->>'p_ip_address',
                NOW()
            ) RETURNING id INTO v_id;
            
            RETURN jsonb_build_object('id', v_id, 'success', true);
        ELSE
            -- Re-raise other errors
            RAISE;
        END IF;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.submit_contact_form(JSONB) TO anon;

-- Check what columns actually exist in contact_submissions
SELECT column_name, is_nullable, data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'contact_submissions'
ORDER BY ordinal_position;