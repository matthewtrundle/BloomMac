-- User Platform Database Schema
-- This creates the additional tables needed for the user dashboard and engagement features

-- Star/Achievement system
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  achievement_type VARCHAR(50) NOT NULL,
  achievement_key VARCHAR(100) NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  is_private BOOLEAN DEFAULT true,
  UNIQUE(user_id, achievement_key)
);

-- Create index for faster queries
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_type ON user_achievements(achievement_type);

-- Wellness tracking (optional)
CREATE TABLE IF NOT EXISTS wellness_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  entry_type VARCHAR(50), -- 'mood', 'gratitude', 'need_support'
  entry_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_wellness_entries_user_id ON wellness_entries(user_id);
CREATE INDEX idx_wellness_entries_created_at ON wellness_entries(created_at);

-- Appointment integration
CREATE TABLE IF NOT EXISTS appointment_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  calendly_event_id VARCHAR(255),
  pre_appointment_data JSONB,
  post_appointment_notes TEXT,
  appointment_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_appointment_data_user_id ON appointment_data(user_id);
CREATE INDEX idx_appointment_data_date ON appointment_data(appointment_date);

-- User preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,
  notification_settings JSONB DEFAULT '{"email": false, "browser": false}',
  display_preferences JSONB DEFAULT '{"theme": "light", "reduced_motion": false}',
  content_preferences JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add welcome achievement for all existing users
INSERT INTO user_achievements (user_id, achievement_type, achievement_key, metadata)
SELECT id, 'journey', 'welcome_star', '{"title": "Welcome Star", "description": "Welcome to your wellness journey"}'::jsonb
FROM user_profiles
WHERE NOT EXISTS (
  SELECT 1 FROM user_achievements 
  WHERE user_achievements.user_id = user_profiles.id 
  AND achievement_key = 'welcome_star'
);

-- Add RLS policies
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Users can only see their own achievements
CREATE POLICY user_achievements_select_policy ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY user_achievements_insert_policy ON user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY user_achievements_update_policy ON user_achievements
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY user_achievements_delete_policy ON user_achievements
  FOR DELETE USING (auth.uid() = user_id);

-- Users can only see their own wellness entries
CREATE POLICY wellness_entries_select_policy ON wellness_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY wellness_entries_insert_policy ON wellness_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY wellness_entries_update_policy ON wellness_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY wellness_entries_delete_policy ON wellness_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Users can only see their own appointment data
CREATE POLICY appointment_data_select_policy ON appointment_data
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY appointment_data_insert_policy ON appointment_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY appointment_data_update_policy ON appointment_data
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY appointment_data_delete_policy ON appointment_data
  FOR DELETE USING (auth.uid() = user_id);

-- Users can only see and update their own preferences
CREATE POLICY user_preferences_select_policy ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY user_preferences_insert_policy ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY user_preferences_update_policy ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY user_preferences_delete_policy ON user_preferences
  FOR DELETE USING (auth.uid() = user_id);