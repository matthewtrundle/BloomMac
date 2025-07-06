-- Fix course_resources policies based on actual table structure

-- Drop the problematic policies
DROP POLICY IF EXISTS "Public resources are visible to all" ON course_resources;
DROP POLICY IF EXISTS "Enrolled users access course resources" ON course_resources;

-- Create policies that work with the actual columns
CREATE POLICY "Enrolled users access active resources" ON course_resources
    FOR SELECT USING (
        is_active = true
        AND EXISTS (
            SELECT 1 FROM course_enrollments ce
            JOIN courses c ON c.slug = ce.course_id
            WHERE c.id = course_resources.course_id
            AND ce.user_id = auth.uid()
            AND ce.payment_status = 'paid'
        )
    );