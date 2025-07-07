CREATE OR REPLACE FUNCTION get_all_courses_with_user_progress(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN (
    SELECT jsonb_build_object(
      'courses', jsonb_agg(courses_with_progress)
    )
    FROM (
      SELECT
        c.*,
        ce.user_id IS NOT NULL as is_enrolled,
        COALESCE(up.progress, 0) as progress,
        COALESCE(up.lessons_completed, 0) as lessons_completed,
        up.last_activity
      FROM courses c
      LEFT JOIN (
        SELECT
          course_id,
          user_id,
          (COUNT(CASE WHEN status = 'completed' THEN 1 END) * 100.0 / COUNT(*)) as progress,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as lessons_completed,
          MAX(last_accessed) as last_activity
        FROM user_lesson_progress
        WHERE user_id = p_user_id
        GROUP BY course_id, user_id
      ) up ON up.course_id = c.id::text
      LEFT JOIN course_enrollments ce ON ce.course_id = c.id::text AND ce.user_id = p_user_id
      ORDER BY c.sort_order
    ) as courses_with_progress
  );
END;
$$;
