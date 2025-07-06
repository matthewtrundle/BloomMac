-- Create workshop registration table
CREATE TABLE IF NOT EXISTS workshop_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workshop_id TEXT NOT NULL,
  workshop_title TEXT NOT NULL,
  workshop_date TIMESTAMPTZ NOT NULL,
  registration_date TIMESTAMPTZ DEFAULT now(),
  status TEXT CHECK (status IN ('registered', 'attended', 'cancelled', 'no-show')) DEFAULT 'registered',
  zoom_link TEXT,
  calendar_event_id TEXT,
  reminder_sent BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create workshop attendance tracking
CREATE TABLE IF NOT EXISTS workshop_attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_id UUID NOT NULL REFERENCES workshop_registrations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workshop_id TEXT NOT NULL,
  joined_at TIMESTAMPTZ,
  left_at TIMESTAMPTZ,
  duration_minutes INTEGER,
  participation_score INTEGER CHECK (participation_score >= 0 AND participation_score <= 100),
  feedback_submitted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create workshop feedback table
CREATE TABLE IF NOT EXISTS workshop_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_id UUID NOT NULL REFERENCES workshop_registrations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workshop_id TEXT NOT NULL,
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
  content_rating INTEGER CHECK (content_rating >= 1 AND content_rating <= 5),
  presenter_rating INTEGER CHECK (presenter_rating >= 1 AND presenter_rating <= 5),
  technical_rating INTEGER CHECK (technical_rating >= 1 AND technical_rating <= 5),
  most_valuable TEXT,
  improvements TEXT,
  would_recommend BOOLEAN,
  topics_for_future TEXT[],
  submitted_at TIMESTAMPTZ DEFAULT now()
);

-- Create workshop resources table
CREATE TABLE IF NOT EXISTS workshop_resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workshop_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT CHECK (resource_type IN ('slides', 'worksheet', 'recording', 'article', 'tool')),
  resource_url TEXT,
  file_path TEXT,
  is_downloadable BOOLEAN DEFAULT true,
  access_level TEXT CHECK (access_level IN ('public', 'registered', 'attended')) DEFAULT 'registered',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create workshop series tracking
CREATE TABLE IF NOT EXISTS workshop_series (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  series_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  total_sessions INTEGER NOT NULL,
  category TEXT CHECK (category IN ('postpartum', 'pregnancy', 'parenting', 'self-care', 'relationships')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create user workshop series progress
CREATE TABLE IF NOT EXISTS user_workshop_series_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  series_id TEXT NOT NULL REFERENCES workshop_series(series_id),
  sessions_attended INTEGER DEFAULT 0,
  sessions_registered INTEGER DEFAULT 0,
  completion_percentage INTEGER DEFAULT 0,
  last_attended TIMESTAMPTZ,
  series_completed BOOLEAN DEFAULT false,
  certificate_issued BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, series_id)
);

-- Create indexes for performance
CREATE INDEX idx_workshop_registrations_user_id ON workshop_registrations(user_id);
CREATE INDEX idx_workshop_registrations_workshop_id ON workshop_registrations(workshop_id);
CREATE INDEX idx_workshop_registrations_date ON workshop_registrations(workshop_date);
CREATE INDEX idx_workshop_attendance_user_id ON workshop_attendance(user_id);
CREATE INDEX idx_workshop_feedback_user_id ON workshop_feedback(user_id);
CREATE INDEX idx_workshop_resources_workshop_id ON workshop_resources(workshop_id);
CREATE INDEX idx_user_workshop_series_progress_user_id ON user_workshop_series_progress(user_id);

-- Enable RLS
ALTER TABLE workshop_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_workshop_series_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workshop_registrations
CREATE POLICY "Users can view their own registrations" ON workshop_registrations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own registrations" ON workshop_registrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own registrations" ON workshop_registrations
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for workshop_attendance
CREATE POLICY "Users can view their own attendance" ON workshop_attendance
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for workshop_feedback
CREATE POLICY "Users can view their own feedback" ON workshop_feedback
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can submit their own feedback" ON workshop_feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for workshop_resources
CREATE POLICY "Public resources are viewable by all" ON workshop_resources
  FOR SELECT USING (access_level = 'public');

CREATE POLICY "Registered users can view registered resources" ON workshop_resources
  FOR SELECT USING (
    access_level = 'registered' AND 
    EXISTS (
      SELECT 1 FROM workshop_registrations 
      WHERE workshop_registrations.workshop_id = workshop_resources.workshop_id 
      AND workshop_registrations.user_id = auth.uid()
    )
  );

CREATE POLICY "Attended users can view attended resources" ON workshop_resources
  FOR SELECT USING (
    access_level = 'attended' AND 
    EXISTS (
      SELECT 1 FROM workshop_registrations 
      WHERE workshop_registrations.workshop_id = workshop_resources.workshop_id 
      AND workshop_registrations.user_id = auth.uid()
      AND workshop_registrations.status = 'attended'
    )
  );

-- RLS Policies for workshop_series
CREATE POLICY "Everyone can view active workshop series" ON workshop_series
  FOR SELECT USING (is_active = true);

-- RLS Policies for user_workshop_series_progress
CREATE POLICY "Users can view their own series progress" ON user_workshop_series_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own series progress" ON user_workshop_series_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own series progress" ON user_workshop_series_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update workshop series progress
CREATE OR REPLACE FUNCTION update_workshop_series_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user's series progress when attendance is marked
  IF NEW.status = 'attended' AND OLD.status != 'attended' THEN
    -- Get workshop series info
    DECLARE
      v_series_id TEXT;
      v_total_sessions INTEGER;
      v_sessions_attended INTEGER;
    BEGIN
      -- Check if this workshop belongs to a series
      SELECT series_id INTO v_series_id
      FROM workshop_series
      WHERE NEW.workshop_id LIKE series_id || '%';
      
      IF v_series_id IS NOT NULL THEN
        -- Get total sessions in series
        SELECT total_sessions INTO v_total_sessions
        FROM workshop_series
        WHERE series_id = v_series_id;
        
        -- Count attended sessions
        SELECT COUNT(*) INTO v_sessions_attended
        FROM workshop_registrations
        WHERE user_id = NEW.user_id
        AND workshop_id LIKE v_series_id || '%'
        AND status = 'attended';
        
        -- Update or insert progress record
        INSERT INTO user_workshop_series_progress (
          user_id, series_id, sessions_attended, 
          completion_percentage, last_attended
        ) VALUES (
          NEW.user_id, v_series_id, v_sessions_attended,
          (v_sessions_attended * 100 / v_total_sessions),
          NEW.workshop_date
        )
        ON CONFLICT (user_id, series_id) 
        DO UPDATE SET
          sessions_attended = v_sessions_attended,
          completion_percentage = (v_sessions_attended * 100 / v_total_sessions),
          last_attended = NEW.workshop_date,
          series_completed = (v_sessions_attended >= v_total_sessions),
          updated_at = now();
      END IF;
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for workshop series progress
CREATE TRIGGER update_series_progress_on_attendance
  AFTER UPDATE ON workshop_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_workshop_series_progress();

-- Create function to check and award workshop achievements
CREATE OR REPLACE FUNCTION check_workshop_achievements()
RETURNS TRIGGER AS $$
BEGIN
  -- Award workshop attendee achievement on first workshop
  IF NEW.status = 'attended' AND OLD.status != 'attended' THEN
    -- Check if this is user's first attended workshop
    DECLARE
      v_workshop_count INTEGER;
    BEGIN
      SELECT COUNT(*) INTO v_workshop_count
      FROM workshop_registrations
      WHERE user_id = NEW.user_id
      AND status = 'attended';
      
      IF v_workshop_count = 1 THEN
        -- Award workshop attendee achievement
        INSERT INTO user_achievements (user_id, achievement_id, earned_at)
        VALUES (NEW.user_id, 'workshop_attendee', now())
        ON CONFLICT DO NOTHING;
      END IF;
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for workshop achievements
CREATE TRIGGER check_workshop_achievements_trigger
  AFTER UPDATE ON workshop_registrations
  FOR EACH ROW
  EXECUTE FUNCTION check_workshop_achievements();