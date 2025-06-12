-- Add enhanced script management fields to course_lessons table

-- Add new columns for better script management
ALTER TABLE course_lessons ADD COLUMN IF NOT EXISTS video_script_formatted TEXT;
ALTER TABLE course_lessons ADD COLUMN IF NOT EXISTS script_version INTEGER DEFAULT 1;
ALTER TABLE course_lessons ADD COLUMN IF NOT EXISTS script_duration_estimate INTEGER; -- in seconds
ALTER TABLE course_lessons ADD COLUMN IF NOT EXISTS script_last_edited_by TEXT;
ALTER TABLE course_lessons ADD COLUMN IF NOT EXISTS script_last_edited_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE course_lessons ADD COLUMN IF NOT EXISTS script_status TEXT DEFAULT 'draft' CHECK (script_status IN ('draft', 'reviewed', 'final', 'archived'));
ALTER TABLE course_lessons ADD COLUMN IF NOT EXISTS talking_points JSONB DEFAULT '[]';
ALTER TABLE course_lessons ADD COLUMN IF NOT EXISTS script_notes_backup TEXT; -- For version control

-- Add comments
COMMENT ON COLUMN course_lessons.video_script_formatted IS 'Rich text formatted version of the script for better readability';
COMMENT ON COLUMN course_lessons.script_version IS 'Version number for tracking script revisions';
COMMENT ON COLUMN course_lessons.script_duration_estimate IS 'Estimated speaking duration in seconds';
COMMENT ON COLUMN course_lessons.script_last_edited_by IS 'Email or name of last editor';
COMMENT ON COLUMN course_lessons.script_last_edited_at IS 'Timestamp of last script edit';
COMMENT ON COLUMN course_lessons.script_status IS 'Current status of the script: draft, reviewed, final, or archived';
COMMENT ON COLUMN course_lessons.talking_points IS 'Key bullet points extracted from script for quick reference';
COMMENT ON COLUMN course_lessons.script_notes_backup IS 'Backup of previous script version';

-- Create a script revision history table
CREATE TABLE IF NOT EXISTS course_script_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    script_content TEXT,
    edited_by TEXT,
    edit_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(lesson_id, version_number)
);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_script_revisions_lesson_id ON course_script_revisions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_script_status ON course_lessons(script_status);

-- Enable RLS
ALTER TABLE course_script_revisions ENABLE ROW LEVEL SECURITY;

-- Add policy for admins
CREATE POLICY "Admins can manage script revisions" ON course_script_revisions FOR ALL USING (true);

COMMENT ON TABLE course_script_revisions IS 'Tracks version history of lesson video scripts';