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
