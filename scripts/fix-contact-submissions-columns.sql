-- ============================================
-- FIX CONTACT_SUBMISSIONS TABLE
-- Add missing columns expected by the RPC function
-- ============================================

-- Add missing columns if they don't exist
ALTER TABLE public.contact_submissions
ADD COLUMN IF NOT EXISTS page VARCHAR(500),
ADD COLUMN IF NOT EXISTS user_agent TEXT,
ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45),
ADD COLUMN IF NOT EXISTS service VARCHAR(100);

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'contact_submissions'
ORDER BY ordinal_position;