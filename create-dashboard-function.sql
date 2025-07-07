-- This function consolidates all data fetching for the user dashboard into a single, efficient query.
CREATE OR REPLACE FUNCTION get_user_dashboard_data(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  v_profile jsonb;
  v_achievements jsonb;
  v_course_workbooks jsonb;
  v_course_stats jsonb;
  v_all_courses jsonb;
  v_upcoming_appointments jsonb;
BEGIN
  -- 1. Get Profile with total stars
  SELECT to_jsonb(p) INTO v_profile FROM (
    SELECT *, (SELECT SUM(points) FROM user_achievements WHERE user_id = p_user_id) as total_stars
    FROM user_profiles WHERE id = p_user_id
  ) p;

  -- 2. Get Achievements
  SELECT jsonb_agg(a ORDER BY a.earned_at DESC) INTO v_achievements FROM (
    SELECT
      ua.id,
      ua.earned_at,
      ach.id as achievement_id,
      ach.name,
      ach.description,
      ach.icon,
      ach.points
    FROM user_achievements ua
    JOIN achievements ach ON ua.achievement_id = ach.id
    WHERE ua.user_id = p_user_id
  ) a;

  -- 3. Get All Courses with Progress
  SELECT jsonb_agg(c ORDER BY c.sort_order) INTO v_all_courses FROM (
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
          (COUNT(CASE WHEN status = 'completed' THEN 1 END) * 100.0 / GREATEST(COUNT(*), 1)) as progress,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as lessons_completed,
          MAX(last_accessed) as last_activity
        FROM user_lesson_progress
        WHERE user_id = p_user_id
        GROUP BY course_id, user_id
      ) up ON up.course_id = c.id::text
      LEFT JOIN course_enrollments ce ON ce.course_id = c.id::text AND ce.user_id = p_user_id
  ) c;

  -- 4. Get Upcoming Appointments
  SELECT jsonb_agg(a ORDER BY a.appointment_date ASC) INTO v_upcoming_appointments FROM (
    SELECT
      id,
      appointment_date,
      appointment_type,
      status,
      payment_status,
      confirmation_received
    FROM appointments
    WHERE user_id = p_user_id
    AND appointment_date >= now()
    LIMIT 5
  ) a;

  -- 5. Get Workbook Status
  SELECT jsonb_agg(cw ORDER BY cw.course_name) INTO v_course_workbooks FROM (
      SELECT
        ce.course_id,
        c.title as course_name,
        (
          SELECT jsonb_agg(workbook_status ORDER BY week_number)
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
          ) as workbook_status
        ) as workbooks
      FROM course_enrollments ce
      JOIN courses c ON c.id::text = ce.course_id
      WHERE ce.user_id = p_user_id AND ce.status = 'active'
      GROUP BY ce.course_id, c.title
  ) cw;

  -- 6. Get Overall Course Stats
  SELECT jsonb_build_object(
    'weeksStarted', COUNT(DISTINCT week_number),
    'weeksCompleted', COUNT(DISTINCT CASE WHEN all_lessons_completed THEN 1 END),
    'lessonsCompleted', (SELECT COUNT(*) FROM user_lesson_progress WHERE user_id = p_user_id AND status = 'completed'),
    'totalLessons', (SELECT COUNT(*) FROM course_lessons cl JOIN course_enrollments ce ON ce.course_id = cl.course_id::text WHERE ce.user_id = p_user_id),
    'completionPercentage', ((SELECT COUNT(*) FROM user_lesson_progress WHERE user_id = p_user_id AND status = 'completed') * 100.0 / GREATEST((SELECT COUNT(*) FROM course_lessons cl JOIN course_enrollments ce ON ce.course_id = cl.course_id::text WHERE ce.user_id = p_user_id), 1)),
    'totalTimeSpentMinutes', (SELECT SUM(time_spent_minutes) FROM user_lesson_progress WHERE user_id = p_user_id),
    'lastActivity', (SELECT MAX(last_accessed) FROM user_lesson_progress WHERE user_id = p_user_id),
    'courseCompleted', (SELECT ((SELECT COUNT(*) FROM user_lesson_progress WHERE user_id = p_user_id AND status = 'completed') = (SELECT COUNT(*) FROM course_lessons cl JOIN course_enrollments ce ON ce.course_id = cl.course_id::text WHERE ce.user_id = p_user_id)))
  )
  INTO v_course_stats
  FROM user_week_submissions
  WHERE user_id = p_user_id;

  RETURN jsonb_build_object(
    'profile', COALESCE(v_profile, '{}'::jsonb),
    'achievements', COALESCE(v_achievements, '[]'::jsonb),
    'courseWorkbooks', COALESCE(v_course_workbooks, '[]'::jsonb),
    'courseStats', COALESCE(v_course_stats, '{}'::jsonb),
    'allCourses', COALESCE(v_all_courses, '[]'::jsonb),
    'upcomingAppointments', COALESCE(v_upcoming_appointments, '[]'::jsonb)
  );
END;
$$;
