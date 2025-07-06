-- Fix for user_notifications policy without expires_at column
-- First, check if the policy exists and drop it if needed
DROP POLICY IF EXISTS "System deletes old notifications" ON user_notifications;

-- Create a simpler version without expires_at reference
CREATE POLICY "System deletes old notifications" ON user_notifications
    FOR DELETE USING (
        auth.jwt()->>'role' = 'service_role'
        OR (auth.uid() = user_id AND read = true)
    );