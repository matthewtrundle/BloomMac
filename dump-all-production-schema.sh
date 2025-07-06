#!/bin/bash

# Get all table structures from production database
echo "Fetching complete production schema..."

psql "postgresql://postgres.utetcmirepwdxbtrcczv:F13aUlrMdMFDpSkg@aws-0-us-east-2.pooler.supabase.com:5432/postgres" << 'EOF' > production-schema-complete.txt
-- List all tables
\echo '=== ALL TABLES IN PUBLIC SCHEMA ==='
\dt public.*

-- Get structure of each table
\echo ''
\echo '=== DETAILED TABLE STRUCTURES ==='

-- User tables
\echo '--- USER TABLES ---'
\d user_notifications
\d user_preferences
\d user_achievements
\d user_profiles
\d user_payment_methods
\d user_activity_log
\d user_consents
\d user_course_access
\d user_lesson_progress
\d user_progress
\d user_week_submissions
\d user_workbook_responses

-- Wellness/Health tables
\echo '--- WELLNESS TABLES ---'
\d wellness_entries

-- Appointment tables
\echo '--- APPOINTMENT TABLES ---'
\d appointment_data
\d appointment_payments
\d appointment_types
\d appointments

-- Course tables
\echo '--- COURSE TABLES ---'
\d courses
\d course_enrollments
\d course_modules
\d course_lessons
\d course_progress
\d course_activity_logs
\d course_certificates
\d course_discount_codes
\d course_purchases
\d course_resources

-- Email/Communication tables
\echo '--- EMAIL TABLES ---'
\d email_automation_triggers
\d email_sequences
\d sequence_emails
\d email_automation_logs
\d email_templates
\d email_queue
\d subscribers

-- Financial tables
\echo '--- FINANCIAL TABLES ---'
\d stripe_webhook_events
\d payment_methods

-- Admin tables
\echo '--- ADMIN TABLES ---'
\d admin_users
\d admin_sessions
\d admin_activity_log

-- Other tables
\echo '--- OTHER TABLES ---'
\d analytics_events
\d blog_posts
\d contact_submissions
\d career_applications
EOF

echo "Schema saved to production-schema-complete.txt"