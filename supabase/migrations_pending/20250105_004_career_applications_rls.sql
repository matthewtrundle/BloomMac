-- Enable RLS on career_applications
ALTER TABLE career_applications ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert career applications
CREATE POLICY "Allow anonymous career applications" 
ON career_applications 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- Allow authenticated users to view and manage all applications
CREATE POLICY "Allow authenticated users to manage applications" 
ON career_applications 
FOR ALL 
TO authenticated 
USING (true);

-- Enable RLS on analytics_events if not already enabled
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert analytics events
CREATE POLICY IF NOT EXISTS "Allow anonymous analytics events" 
ON analytics_events 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- Allow authenticated users to view all analytics
CREATE POLICY IF NOT EXISTS "Allow authenticated users to view analytics" 
ON analytics_events 
FOR SELECT 
TO authenticated 
USING (true);