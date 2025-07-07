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
