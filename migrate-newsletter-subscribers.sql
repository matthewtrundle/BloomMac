-- This script migrates data from the newsletter_subscribers table to the subscribers table,
-- and then drops the newsletter_subscribers table.

INSERT INTO subscribers (email, first_name, last_name, status, source, created_at, updated_at)
SELECT email, first_name, last_name, status, source, subscribed_at, updated_at
FROM newsletter_subscribers
ON CONFLICT (email) DO NOTHING;

DROP TABLE IF EXISTS newsletter_subscribers;
