-- Add Stripe customer ID to user_profiles table
-- This is needed for payment processing and no-show fees

ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_stripe_customer_id 
ON user_profiles(stripe_customer_id) 
WHERE stripe_customer_id IS NOT NULL;

-- Success message
SELECT 'Stripe customer ID column added successfully!' as result;