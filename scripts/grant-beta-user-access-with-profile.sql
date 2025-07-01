-- Grant beta user access to Postpartum Wellness Foundations course
-- This script handles the user_profiles foreign key constraint

DO $$
DECLARE
    v_auth_user_id UUID;
    v_profile_user_id UUID;
    v_course_id UUID;
BEGIN
    -- Get auth user ID for beta1@bloomtest.com
    SELECT id INTO v_auth_user_id 
    FROM auth.users 
    WHERE email = 'beta1@bloomtest.com';
    
    -- Get course ID
    SELECT id INTO v_course_id
    FROM courses
    WHERE slug = 'postpartum-wellness-foundations';
    
    IF v_auth_user_id IS NULL THEN
        RAISE NOTICE 'User beta1@bloomtest.com not found in auth.users';
        RAISE NOTICE 'Please create the user in Supabase Auth first';
        RETURN;
    END IF;
    
    IF v_course_id IS NULL THEN
        RAISE NOTICE 'Course postpartum-wellness-foundations not found';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Found auth user ID: %', v_auth_user_id;
    RAISE NOTICE 'Found course ID: %', v_course_id;
    
    -- Check if user_profiles record exists
    SELECT id INTO v_profile_user_id
    FROM user_profiles
    WHERE id = v_auth_user_id;
    
    -- Create user_profiles record if it doesn't exist
    IF v_profile_user_id IS NULL THEN
        INSERT INTO user_profiles (
            id,
            email,
            first_name,
            last_name,
            created_at,
            updated_at
        ) VALUES (
            v_auth_user_id,
            'beta1@bloomtest.com',
            'Beta',
            'Tester',
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created user_profiles record';
    ELSE
        RAISE NOTICE 'User profile already exists';
    END IF;
    
    -- Insert into user_course_access (email-based)
    INSERT INTO user_course_access (
        customer_email,
        course_id,
        payment_status,
        access_granted_at
    ) VALUES (
        'beta1@bloomtest.com',
        'postpartum-wellness-foundations',
        'free',
        NOW()
    )
    ON CONFLICT (customer_email, course_id) 
    DO UPDATE SET
        payment_status = 'free',
        access_granted_at = NOW(),
        updated_at = NOW();
    
    RAISE NOTICE 'Added to user_course_access table';
    
    -- Insert into course_enrollments (user ID-based)
    INSERT INTO course_enrollments (
        user_id,
        course_id,
        enrollment_date,
        enrollment_method,
        payment_status,
        payment_amount,
        payment_date,
        completion_status,
        progress_percentage
    ) VALUES (
        v_auth_user_id,  -- This now references user_profiles.id
        v_course_id,
        NOW(),
        'admin',
        'free',
        0,
        NOW(),
        'not_started',
        0
    )
    ON CONFLICT (user_id, course_id)
    DO UPDATE SET
        enrollment_method = 'admin',
        payment_status = 'free',
        updated_at = NOW();
    
    RAISE NOTICE 'Added to course_enrollments table';
    
END $$;

-- Verify the access was granted
SELECT 
    'user_course_access' as table_name,
    customer_email,
    course_id,
    payment_status,
    access_granted_at
FROM user_course_access
WHERE customer_email = 'beta1@bloomtest.com';

SELECT 
    'course_enrollments' as table_name,
    ce.user_id,
    up.email,
    c.slug as course_slug,
    ce.enrollment_method,
    ce.payment_status,
    ce.completion_status
FROM course_enrollments ce
JOIN user_profiles up ON up.id = ce.user_id
JOIN courses c ON c.id = ce.course_id
WHERE up.email = 'beta1@bloomtest.com';