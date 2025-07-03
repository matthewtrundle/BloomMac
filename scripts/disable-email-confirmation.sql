-- WARNING: Only use this for development/testing
-- This disables email confirmation requirement

-- Update auth config to not require email confirmation
UPDATE auth.config 
SET value = 'false' 
WHERE key = 'email_confirm_required';

-- If the above doesn't exist, you can also try:
-- This marks all existing unconfirmed users as confirmed
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email_confirmed_at IS NULL;

-- To re-enable email confirmation later:
-- UPDATE auth.config SET value = 'true' WHERE key = 'email_confirm_required';