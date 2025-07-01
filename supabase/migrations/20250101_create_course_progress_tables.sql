-- Create course progress tracking table
CREATE TABLE IF NOT EXISTS course_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  week_number INTEGER NOT NULL CHECK (week_number >= 1 AND week_number <= 6),
  lesson_number INTEGER NOT NULL CHECK (lesson_number >= 1 AND lesson_number <= 5),
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  time_spent_minutes INTEGER DEFAULT 0,
  video_progress_percentage INTEGER DEFAULT 0 CHECK (video_progress_percentage >= 0 AND video_progress_percentage <= 100),
  last_accessed_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, course_id, week_number, lesson_number)
);

-- Create lesson completion details table
CREATE TABLE IF NOT EXISTS lesson_completion_details (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  progress_id UUID NOT NULL REFERENCES course_progress(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_watched BOOLEAN DEFAULT false,
  video_watch_time_seconds INTEGER DEFAULT 0,
  exercises_completed INTEGER DEFAULT 0,
  exercises_total INTEGER DEFAULT 0,
  reflection_submitted BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create course milestones table
CREATE TABLE IF NOT EXISTS course_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  milestone_type TEXT CHECK (milestone_type IN ('week_complete', 'course_complete', 'all_exercises', 'perfect_week')),
  milestone_data JSONB,
  achieved_at TIMESTAMPTZ DEFAULT now(),
  achievement_id TEXT,
  UNIQUE(user_id, course_id, milestone_type, milestone_data)
);

-- Create course activity log for detailed tracking
CREATE TABLE IF NOT EXISTS course_activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  week_number INTEGER,
  lesson_number INTEGER,
  activity_type TEXT CHECK (activity_type IN ('lesson_start', 'lesson_complete', 'video_play', 'video_pause', 'video_complete', 'exercise_complete', 'reflection_submit', 'resource_download')),
  activity_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create course certificates table
CREATE TABLE IF NOT EXISTS course_certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  certificate_number TEXT UNIQUE NOT NULL DEFAULT 'BLOOM-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('certificate_number_seq')::text, 6, '0'),
  completion_date TIMESTAMPTZ NOT NULL,
  total_time_spent_hours DECIMAL(10,2),
  lessons_completed INTEGER NOT NULL,
  final_score INTEGER,
  certificate_url TEXT,
  issued_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Create sequence for certificate numbers
CREATE SEQUENCE IF NOT EXISTS certificate_number_seq START 1000;

-- Create user course stats view for dashboard
CREATE OR REPLACE VIEW user_course_stats AS
SELECT 
  user_id,
  course_id,
  COUNT(DISTINCT week_number) as weeks_started,
  COUNT(DISTINCT CASE WHEN status = 'completed' THEN week_number END) as weeks_completed,
  COUNT(*) FILTER (WHERE status = 'completed') as lessons_completed,
  COUNT(*) as total_lessons,
  ROUND(COUNT(*) FILTER (WHERE status = 'completed')::numeric / COUNT(*)::numeric * 100, 2) as completion_percentage,
  SUM(time_spent_minutes) as total_time_spent_minutes,
  MAX(last_accessed_at) as last_activity,
  MIN(started_at) as course_started_at,
  MAX(completed_at) as latest_completion,
  COUNT(DISTINCT week_number) FILTER (WHERE status = 'completed') = 6 as course_completed
FROM course_progress
GROUP BY user_id, course_id;

-- Create indexes for performance
CREATE INDEX idx_course_progress_user_id ON course_progress(user_id);
CREATE INDEX idx_course_progress_course_id ON course_progress(course_id);
CREATE INDEX idx_course_progress_status ON course_progress(status);
CREATE INDEX idx_lesson_completion_user_id ON lesson_completion_details(user_id);
CREATE INDEX idx_course_milestones_user_id ON course_milestones(user_id);
CREATE INDEX idx_course_activity_log_user_id ON course_activity_log(user_id);
CREATE INDEX idx_course_activity_log_created_at ON course_activity_log(created_at);

-- Enable RLS
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_completion_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_certificates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own course progress" ON course_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own course progress" ON course_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own course progress" ON course_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own lesson details" ON lesson_completion_details
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own milestones" ON course_milestones
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can log their own activities" ON course_activity_log
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own activity log" ON course_activity_log
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own certificates" ON course_certificates
  FOR SELECT USING (auth.uid() = user_id);

-- Function to update course progress
CREATE OR REPLACE FUNCTION update_course_progress(
  p_user_id UUID,
  p_course_id TEXT,
  p_week_number INTEGER,
  p_lesson_number INTEGER,
  p_status TEXT,
  p_video_progress INTEGER DEFAULT NULL,
  p_time_spent INTEGER DEFAULT 0
)
RETURNS course_progress AS $$
DECLARE
  v_progress course_progress;
BEGIN
  INSERT INTO course_progress (
    user_id, course_id, week_number, lesson_number, 
    status, video_progress_percentage, time_spent_minutes,
    started_at, completed_at, last_accessed_at
  ) VALUES (
    p_user_id, p_course_id, p_week_number, p_lesson_number,
    p_status, COALESCE(p_video_progress, 0), p_time_spent,
    CASE WHEN p_status != 'not_started' THEN COALESCE(now(), now()) END,
    CASE WHEN p_status = 'completed' THEN now() END,
    now()
  )
  ON CONFLICT (user_id, course_id, week_number, lesson_number)
  DO UPDATE SET
    status = p_status,
    video_progress_percentage = GREATEST(course_progress.video_progress_percentage, COALESCE(p_video_progress, course_progress.video_progress_percentage)),
    time_spent_minutes = course_progress.time_spent_minutes + p_time_spent,
    started_at = COALESCE(course_progress.started_at, CASE WHEN p_status != 'not_started' THEN now() END),
    completed_at = CASE WHEN p_status = 'completed' THEN now() ELSE course_progress.completed_at END,
    last_accessed_at = now(),
    updated_at = now()
  RETURNING * INTO v_progress;
  
  -- Check for milestones
  PERFORM check_course_milestones(p_user_id, p_course_id);
  
  RETURN v_progress;
END;
$$ LANGUAGE plpgsql;

-- Function to check and award course milestones
CREATE OR REPLACE FUNCTION check_course_milestones(
  p_user_id UUID,
  p_course_id TEXT
)
RETURNS VOID AS $$
DECLARE
  v_week_complete_count INTEGER;
  v_total_completed INTEGER;
  v_perfect_week_count INTEGER;
BEGIN
  -- Check for week completion milestones
  SELECT COUNT(DISTINCT week_number) INTO v_week_complete_count
  FROM course_progress
  WHERE user_id = p_user_id 
  AND course_id = p_course_id
  AND status = 'completed'
  AND week_number IN (
    SELECT week_number 
    FROM course_progress 
    WHERE user_id = p_user_id AND course_id = p_course_id
    GROUP BY week_number
    HAVING COUNT(*) = COUNT(*) FILTER (WHERE status = 'completed')
  );
  
  -- Award first week complete achievement
  IF v_week_complete_count >= 1 THEN
    INSERT INTO user_achievements (user_id, achievement_id, earned_at)
    VALUES (p_user_id, 'first_week_complete', now())
    ON CONFLICT DO NOTHING;
    
    INSERT INTO course_milestones (user_id, course_id, milestone_type, milestone_data, achievement_id)
    VALUES (p_user_id, p_course_id, 'week_complete', jsonb_build_object('weeks_completed', 1), 'first_week_complete')
    ON CONFLICT DO NOTHING;
  END IF;
  
  -- Check for course completion
  IF v_week_complete_count = 6 THEN
    INSERT INTO user_achievements (user_id, achievement_id, earned_at)
    VALUES (p_user_id, 'course_complete', now())
    ON CONFLICT DO NOTHING;
    
    INSERT INTO course_milestones (user_id, course_id, milestone_type, milestone_data, achievement_id)
    VALUES (p_user_id, p_course_id, 'course_complete', jsonb_build_object('completion_date', now()), 'course_complete')
    ON CONFLICT DO NOTHING;
    
    -- Generate certificate
    INSERT INTO course_certificates (
      user_id, course_id, completion_date, 
      lessons_completed, total_time_spent_hours
    )
    SELECT 
      p_user_id, p_course_id, now(),
      COUNT(*) FILTER (WHERE status = 'completed'),
      SUM(time_spent_minutes) / 60.0
    FROM course_progress
    WHERE user_id = p_user_id AND course_id = p_course_id
    ON CONFLICT DO NOTHING;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to log course activity
CREATE OR REPLACE FUNCTION log_course_activity(
  p_user_id UUID,
  p_course_id TEXT,
  p_week_number INTEGER,
  p_lesson_number INTEGER,
  p_activity_type TEXT,
  p_activity_data JSONB DEFAULT '{}'::jsonb
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO course_activity_log (
    user_id, course_id, week_number, lesson_number,
    activity_type, activity_data
  ) VALUES (
    p_user_id, p_course_id, p_week_number, p_lesson_number,
    p_activity_type, p_activity_data
  );
END;
$$ LANGUAGE plpgsql;