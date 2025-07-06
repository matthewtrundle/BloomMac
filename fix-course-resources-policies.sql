-- Fix course_resources policies without access_level column

-- First check what columns the table actually has
\d course_resources

-- Drop the problematic policies
DROP POLICY IF EXISTS "Public resources are visible to all" ON course_resources;
DROP POLICY IF EXISTS "Enrolled users access course resources" ON course_resources;

-- Create simpler policies that work with existing structure
CREATE POLICY "Enrolled users access course resources" ON course_resources
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM course_enrollments ce
            JOIN courses c ON c.slug = ce.course_id
            WHERE c.id = course_resources.course_id
            AND ce.user_id = auth.uid()
            AND ce.payment_status = 'paid'
        )
    );

-- If the table has an is_public or similar column, we can add a public policy
-- Otherwise, only enrolled users and admins can see resources