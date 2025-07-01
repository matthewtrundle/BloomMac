-- Grant beta user access to Postpartum Wellness Foundations course
-- Using correct schema based on BLOOM-DATABASE-SCHEMA.md

-- First, check if user exists
DO $$
DECLARE
    v_user_id UUID;
    v_course_id UUID;
BEGIN
    -- Get user ID for beta1@bloomtest.com
    SELECT id INTO v_user_id 
    FROM auth.users 
    WHERE email = 'beta1@bloomtest.com';
    
    -- Get course ID
    SELECT id INTO v_course_id
    FROM courses
    WHERE slug = 'postpartum-wellness-foundations';
    
    IF v_user_id IS NULL THEN
        RAISE NOTICE 'User beta1@bloomtest.com not found in auth.users';
        RAISE NOTICE 'Please create the user in Supabase Auth first';
    ELSE
        RAISE NOTICE 'Found user ID: %', v_user_id;
        
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
        IF v_course_id IS NOT NULL THEN
            INSERT INTO course_enrollments (
                user_id,
                course_id,
                enrollment_date,
                enrollment_method,  -- Using 'admin' (NOT 'admin_granted')
                payment_status,
                payment_amount,
                payment_date,
                completion_status,  -- Using 'completion_status' (NOT 'status')
                progress_percentage
            ) VALUES (
                v_user_id,
                v_course_id,
                NOW(),
                'admin',           -- Valid enum value from CHECK constraint
                'free',
                0,
                NOW(),
                'not_started',     -- Valid enum value
                0
            )
            ON CONFLICT (user_id, course_id)
            DO UPDATE SET
                enrollment_method = 'admin',
                payment_status = 'free',
                updated_at = NOW();
            
            RAISE NOTICE 'Added to course_enrollments table';
        ELSE
            RAISE NOTICE 'Course not found in courses table';
        END IF;
    END IF;
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
    u.email,
    c.slug as course_slug,
    ce.enrollment_method,
    ce.payment_status,
    ce.completion_status
FROM course_enrollments ce
JOIN auth.users u ON u.id = ce.user_id
JOIN courses c ON c.id = ce.course_id
WHERE u.email = 'beta1@bloomtest.com';