-- Fix subscriber status constraint to allow 'inactive' status
-- This fixes the UPDATE test failure

-- Drop existing constraint if it exists
ALTER TABLE subscribers DROP CONSTRAINT IF EXISTS subscribers_status_check;

-- Add new constraint that allows all statuses used by the system
ALTER TABLE subscribers 
ADD CONSTRAINT subscribers_status_check 
CHECK (status IN ('active', 'inactive', 'unsubscribed', 'invalid_email', 'pending'));

-- Update any existing 'inactive' records to 'unsubscribed' if needed
UPDATE subscribers 
SET status = 'unsubscribed' 
WHERE status = 'inactive';

-- Verify the constraint
SELECT 
    conname as constraint_name,
    consrc as constraint_definition
FROM pg_constraint 
WHERE conname = 'subscribers_status_check';