-- Seed data for local development
-- This file runs after migrations during supabase db reset

-- Create test auth users
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES 
  -- Admin user
  ('11111111-1111-1111-1111-111111111111', 'admin@test.local', crypt('testpass123', gen_salt('bf')), now(), now(), now()),
  -- Regular user
  ('22222222-2222-2222-2222-222222222222', 'user@test.local', crypt('testpass123', gen_salt('bf')), now(), now(), now()),
  -- Test therapist
  ('33333333-3333-3333-3333-333333333333', 'therapist@test.local', crypt('testpass123', gen_salt('bf')), now(), now(), now())
ON CONFLICT (id) DO NOTHING;

-- Create admin_users entries
INSERT INTO admin_users (id, email, name, role, is_active, created_at, updated_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'admin@test.local', 'Test Admin', 'super_admin', true, now(), now()),
  ('33333333-3333-3333-3333-333333333333', 'therapist@test.local', 'Test Therapist', 'admin', true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Create user_profiles entries
INSERT INTO user_profiles (id, first_name, last_name, created_at, updated_at)
VALUES 
  ('22222222-2222-2222-2222-222222222222', 'Test', 'User', now(), now())
ON CONFLICT (id) DO NOTHING;

-- Create test courses (using proper UUIDs)
INSERT INTO courses (id, title, slug, description, price, is_active, created_at, updated_at)
VALUES 
  ('c1111111-1111-1111-1111-111111111111'::uuid, 'Introduction to Mindfulness', 'intro-mindfulness', 'Learn the basics of mindfulness meditation', 49.99, true, now(), now()),
  ('c2222222-2222-2222-2222-222222222222'::uuid, 'Managing Anxiety', 'managing-anxiety', 'Practical techniques for anxiety management', 79.99, true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Create test blog posts
INSERT INTO posts (id, title, slug, excerpt, content, author_id, status, published_at, created_at, updated_at)
VALUES 
  ('b1111111-1111-1111-1111-111111111111'::uuid, 
   'Understanding Postpartum Depression', 
   'understanding-postpartum-depression',
   'A comprehensive guide to recognizing and managing postpartum depression',
   '# Understanding Postpartum Depression\n\nPostpartum depression affects many new mothers...',
   '11111111-1111-1111-1111-111111111111',
   'published',
   now() - interval '7 days',
   now() - interval '7 days',
   now() - interval '7 days'),
  ('b2222222-2222-2222-2222-222222222222'::uuid, 
   'Self-Care for Busy Moms', 
   'self-care-busy-moms',
   'Practical self-care strategies that actually work',
   '# Self-Care for Busy Moms\n\nFinding time for self-care can feel impossible...',
   '11111111-1111-1111-1111-111111111111',
   'published',
   now() - interval '3 days',
   now() - interval '3 days',
   now() - interval '3 days')
ON CONFLICT (id) DO NOTHING;

-- Create test subscribers
INSERT INTO subscribers (id, email, first_name, last_name, status, source, created_at, updated_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'newsletter1@test.local', 'Newsletter', 'Sub One', 'active', 'website', now() - interval '30 days', now()),
  ('22222222-2222-2222-2222-222222222222', 'newsletter2@test.local', 'Newsletter', 'Sub Two', 'active', 'landing_page', now() - interval '15 days', now()),
  ('33333333-3333-3333-3333-333333333333', 'newsletter3@test.local', 'Newsletter', 'Sub Three', 'unsubscribed', 'website', now() - interval '60 days', now() - interval '5 days')
ON CONFLICT (id) DO NOTHING;

-- Create test contact submissions
INSERT INTO contact_submissions (id, name, email, phone, service, message, status, source, created_at, updated_at)
VALUES 
  ('c1111111-1111-1111-1111-111111111111', 
   'Jane Doe', 
   'jane@example.com', 
   '555-1234', 
   'therapy', 
   'I am interested in learning more about your therapy services.', 
   'new', 
   'website',
   now() - interval '2 days',
   now() - interval '2 days'),
  ('c2222222-2222-2222-2222-222222222222', 
   'John Smith', 
   'john@example.com', 
   '555-5678', 
   'consultation', 
   'I would like to schedule a consultation.', 
   'contacted', 
   'website',
   now() - interval '5 days',
   now() - interval '3 days')
ON CONFLICT (id) DO NOTHING;

-- Create test appointments
INSERT INTO appointment_data (
  id, user_id, appointment_type, appointment_date, appointment_end, 
  status, therapist_id, created_at, updated_at
)
VALUES 
  ('a1111111-1111-1111-1111-111111111111', 
   '22222222-2222-2222-2222-222222222222', 
   'consultation', 
   now() + interval '3 days',
   now() + interval '3 days' + interval '50 minutes',
   'scheduled',
   '33333333-3333-3333-3333-333333333333',
   now(),
   now()),
  ('a2222222-2222-2222-2222-222222222222', 
   '22222222-2222-2222-2222-222222222222', 
   'therapy', 
   now() - interval '7 days',
   now() - interval '7 days' + interval '50 minutes',
   'completed',
   '33333333-3333-3333-3333-333333333333',
   now() - interval '14 days',
   now() - interval '7 days')
ON CONFLICT (id) DO NOTHING;

-- Create test analytics events
INSERT INTO analytics_events (type, page, session_id, user_id, data, created_at)
VALUES 
  ('page_view', '/', 'session-001', null, '{"referrer": "google.com"}', now() - interval '1 hour'),
  ('page_view', '/about', 'session-001', null, '{}', now() - interval '55 minutes'),
  ('contact_form', '/contact', 'session-002', null, '{"service": "therapy"}', now() - interval '30 minutes'),
  ('page_view', '/blog', 'session-003', '22222222-2222-2222-2222-222222222222', '{}', now() - interval '15 minutes')
ON CONFLICT DO NOTHING;

-- Output test credentials
DO $$
BEGIN
  RAISE NOTICE E'\n\n=== TEST CREDENTIALS ===\n';
  RAISE NOTICE 'Admin Login: admin@test.local / testpass123';
  RAISE NOTICE 'User Login: user@test.local / testpass123';
  RAISE NOTICE 'Therapist Login: therapist@test.local / testpass123';
  RAISE NOTICE E'\nStudio URL: http://localhost:54323';
  RAISE NOTICE E'======================\n\n';
END $$;