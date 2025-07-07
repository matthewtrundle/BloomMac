CREATE OR REPLACE FUNCTION get_courses_with_details()
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN (
    SELECT jsonb_build_object(
      'courses', jsonb_agg(courses_with_details),
      'courseWeeks', (
        SELECT jsonb_object_agg(course_id, modules)
        FROM (
          SELECT 
            m.course_id, 
            jsonb_agg(jsonb_build_object(
              'id', m.id,
              'week_number', m.week_number,
              'title', m.title,
              'lesson_count', (SELECT COUNT(*) FROM course_lessons WHERE module_id = m.id)
            ) ORDER BY m.week_number) as modules
          FROM course_modules m
          GROUP BY m.course_id
        ) as course_modules_agg
      )
    )
    FROM (
      SELECT
        c.*,
        (SELECT COUNT(*) FROM course_modules WHERE course_id = c.id) as total_modules,
        (SELECT COUNT(*) FROM course_lessons WHERE course_id = c.id) as total_lessons
      FROM courses c
      ORDER BY c.created_at DESC
    ) as courses_with_details
  );
END;
$$;
