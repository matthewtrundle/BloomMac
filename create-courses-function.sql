-- Create get_courses_with_details function that the API was expecting
CREATE OR REPLACE FUNCTION get_courses_with_details()
RETURNS TABLE (
    id UUID,
    slug TEXT,
    title TEXT,
    subtitle TEXT,
    description TEXT,
    long_description TEXT,
    price NUMERIC,
    original_price NUMERIC,
    duration TEXT,
    total_modules INTEGER,
    total_lessons INTEGER,
    total_duration_minutes INTEGER,
    image_url TEXT,
    instructor_name TEXT,
    instructor_credentials TEXT,
    features JSONB,
    learning_outcomes JSONB,
    bonus_materials JSONB,
    is_active BOOLEAN,
    is_featured BOOLEAN,
    sort_order INTEGER,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    module_count BIGINT,
    enrollment_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.*,
        (SELECT COUNT(*) FROM course_modules cm WHERE cm.course_id = c.id) as module_count,
        (SELECT COUNT(*) FROM course_enrollments ce WHERE ce.course_id = c.id) as enrollment_count
    FROM courses c
    ORDER BY c.sort_order ASC, c.created_at DESC;
END;
$$ LANGUAGE plpgsql;