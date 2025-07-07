-- Create get_user_course_stats function
CREATE OR REPLACE FUNCTION get_user_course_stats(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  v_stats jsonb;
BEGIN
  SELECT jsonb_build_object(
    'weeksStarted', COUNT(DISTINCT week_number),
    'weeksCompleted', COUNT(DISTINCT CASE WHEN all_lessons_completed THEN week_number END),
    'lessonsCompleted', (SELECT COUNT(*) FROM user_lesson_progress WHERE user_id = p_user_id AND status = 'completed'),
    'totalLessons', (SELECT COUNT(*) FROM course_lessons cl JOIN course_enrollments ce ON ce.course_id = cl.course_id::text WHERE ce.user_id = p_user_id),
    'completionPercentage', ((SELECT COUNT(*) FROM user_lesson_progress WHERE user_id = p_user_id AND status = 'completed') * 100.0 / GREATEST((SELECT COUNT(*) FROM course_lessons cl JOIN course_enrollments ce ON ce.course_id = cl.course_id::text WHERE ce.user_id = p_user_id), 1)),
    'totalTimeSpentMinutes', (SELECT SUM(time_spent_minutes) FROM user_lesson_progress WHERE user_id = p_user_id),
    'lastActivity', (SELECT MAX(last_accessed) FROM user_lesson_progress WHERE user_id = p_user_id),
    'courseCompleted', (SELECT ((SELECT COUNT(*) FROM user_lesson_progress WHERE user_id = p_user_id AND status = 'completed') = (SELECT COUNT(*) FROM course_lessons cl JOIN course_enrollments ce ON ce.course_id = cl.course_id::text WHERE ce.user_id = p_user_id)))
  )
  INTO v_stats
  FROM user_week_submissions
  WHERE user_id = p_user_id;

  RETURN v_stats;
END;
$$;

-- Create get_user_workbook_status function
CREATE OR REPLACE FUNCTION get_user_workbook_status(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN (
    SELECT jsonb_build_object(
      'courses', jsonb_agg(course_workbooks)
    )
    FROM (
      SELECT
        ce.course_id,
        c.title as course_name,
        (
          SELECT jsonb_agg(workbook_status)
          FROM (
            SELECT
              w.week_number,
              (SELECT COUNT(*) FROM workbook_questions WHERE course_id = ce.course_id AND week_number = w.week_number) as total_questions,
              COUNT(uwr.id) as answered_questions,
              EXISTS(SELECT 1 FROM user_workbook_responses WHERE user_id = p_user_id AND course_id = ce.course_id AND week_number = w.week_number AND is_draft = true) as is_draft,
              EXISTS(SELECT 1 FROM user_week_submissions WHERE user_id = p_user_id AND course_id = ce.course_id AND week_number = w.week_number) as is_submitted,
              MAX(uwr.last_modified) as last_updated,
              COALESCE(uws.completion_percentage, 0) as completion_percentage
            FROM (SELECT generate_series(1, 6) as week_number) w
            LEFT JOIN user_workbook_responses uwr ON uwr.user_id = p_user_id AND uwr.course_id = ce.course_id AND uwr.week_number = w.week_number
            LEFT JOIN user_week_submissions uws ON uws.user_id = p_user_id AND uws.course_id = ce.course_id AND uws.week_number = w.week_number
            GROUP BY w.week_number, uws.completion_percentage
            ORDER BY w.week_number
          ) as workbook_status
        ) as workbooks
      FROM course_enrollments ce
      JOIN courses c ON c.id::text = ce.course_id
      WHERE ce.user_id = p_user_id AND ce.status = 'active'
      GROUP BY ce.course_id, c.title
    ) as course_workbooks
  );
END;
$$;

-- Create get_all_courses_with_user_progress function
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