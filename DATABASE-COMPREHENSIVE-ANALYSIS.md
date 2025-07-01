# Comprehensive Database Schema Analysis for Bloom Psychology

## Executive Summary

This report provides a complete analysis of the Bloom Psychology database schema, identifying existing tables, data flow requirements, missing components, and data integrity issues.

## 1. EXISTING SUPABASE TABLES

### A. User Platform Tables (Created 2025-01-01)
- **user_profiles** - Core user profile data
- **user_achievements** - Gamification/achievement tracking
- **wellness_entries** - Daily wellness tracking
- **user_preferences** - User settings and preferences
- **course_enrollments** - Course enrollment records
- **appointment_data** - Appointment scheduling data

### B. Payment Tables (Created 2025-01-01)
- **appointment_payments** - Payment records for appointments
- **user_payment_methods** - Stored payment methods
- **user_payment_summary** (VIEW) - Payment analytics

### C. Course Progress Tables (Created 2025-01-01)
- **course_progress** - Lesson-by-lesson progress tracking
- **lesson_completion_details** - Detailed completion metrics
- **course_milestones** - Achievement milestones
- **course_activity_log** - Detailed activity tracking
- **course_certificates** - Certificate generation
- **user_course_stats** (VIEW) - Course analytics

### D. Workshop Tables (Created 2025-01-01)
- **workshop_registrations** - Workshop sign-ups
- **workshop_attendance** - Attendance tracking
- **workshop_feedback** - Feedback collection
- **workshop_resources** - Workshop materials
- **workshop_series** - Multi-session workshop tracking
- **user_workshop_series_progress** - Series progress

### E. Admin/Core Tables (Original Schema)
- **admin_users** - Admin authentication
- **admin_sessions** - Admin session management
- **admin_activity_log** - Admin audit trail
- **blog_posts** - Blog content management
- **subscribers** - Newsletter subscribers
- **analytics_events** - Site analytics
- **contact_submissions** - Contact form data
- **career_applications** - Job applications
- **chat_conversations** - Chat support data
- **email_queue** - Email sending queue

### F. Course Content Tables (Created 2025-01-10)
- **courses** - Main course catalog
- **course_modules** - Course weeks/sections
- **course_lessons** - Individual lessons with HTML slides
- **course_resources** - Downloadable materials
- **course_content_versions** - Content version history
- **course_overview** (VIEW) - Course management view

### G. Email Automation Tables
- **email_sequences** - Automated email campaigns
- **sequence_emails** - Individual emails in sequences
- **email_automation_logs** - Email tracking
- **email_templates** - Reusable email templates

## 2. DATA FLOW ANALYSIS

### A. User Registration and Onboarding
**Current Flow:**
1. User signs up via Supabase Auth → auth.users table
2. Trigger creates user_profiles and user_preferences automatically
3. User completes onboarding → Updates user_profiles
4. Achievement system tracks milestones

**Missing Components:**
- Email verification tracking table
- Onboarding completion status table
- Welcome email trigger integration

### B. Course Enrollment and Payment
**Current Flow:**
1. User selects course → Creates checkout session
2. Stripe payment → Updates course_enrollments
3. Access granted based on payment_status = 'paid'
4. Progress tracked in course_progress table

**Missing Components:**
- **stripe_webhook_events** table for webhook processing
- **payment_intents** table for payment tracking
- **refund_requests** table for refund management
- Course coupon/discount codes table

### C. Course Content Delivery and Progress
**Current Flow:**
1. Enrolled users access course_lessons
2. Progress updates via update_course_progress() function
3. Milestones checked automatically
4. Certificates generated on completion

**Strengths:**
- Comprehensive progress tracking
- Automatic milestone detection
- Certificate generation system

### D. Workshop Registration and Attendance
**Current Flow:**
1. User registers for workshop → workshop_registrations
2. Attendance tracked → workshop_attendance
3. Series progress updated automatically
4. Feedback collected post-workshop

**Missing Components:**
- Zoom integration webhook table
- Workshop waitlist management
- Workshop payment integration

### E. Appointment Booking and Payment
**Current Flow:**
1. User books via Calendly → appointment_data
2. Payment authorization → appointment_payments
3. No-show detection and fee processing

**Missing Components:**
- **calendly_webhook_events** table
- Appointment reminder logs
- Therapist availability table

### F. Admin Content Management
**Current Flow:**
1. Admins authenticate → admin_users/admin_sessions
2. Content managed through various tables
3. All actions logged in admin_activity_log

**Missing Components:**
- Admin role permissions table
- Content approval workflow tables

## 3. MISSING TABLES AND COLUMNS

### Critical Missing Tables:

```sql
-- 1. Stripe Webhook Events
CREATE TABLE stripe_webhook_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stripe_event_id TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    event_data JSONB NOT NULL,
    processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Calendly Webhook Events
CREATE TABLE calendly_webhook_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_uuid TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    event_data JSONB NOT NULL,
    processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. User Notifications
CREATE TABLE user_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT,
    data JSONB DEFAULT '{}',
    read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Email Campaign Tracking
CREATE TABLE email_campaign_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID,
    email_id UUID REFERENCES email_queue(id),
    recipient_email TEXT NOT NULL,
    sent_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    unsubscribed_at TIMESTAMPTZ,
    bounced_at TIMESTAMPTZ,
    bounce_type TEXT,
    click_data JSONB DEFAULT '[]'
);

-- 5. Course Discount Codes
CREATE TABLE course_discount_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10,2) NOT NULL,
    course_id UUID REFERENCES courses(id),
    max_uses INTEGER,
    uses_count INTEGER DEFAULT 0,
    valid_from TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Therapist Profiles
CREATE TABLE therapist_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    calendly_user_uri TEXT,
    specialties TEXT[],
    bio TEXT,
    hourly_rate DECIMAL(10,2),
    is_accepting_clients BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Missing Columns in Existing Tables:

```sql
-- Add to user_profiles
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS 
    email_verified BOOLEAN DEFAULT false,
    email_verified_at TIMESTAMPTZ,
    onboarding_completed BOOLEAN DEFAULT false,
    onboarding_completed_at TIMESTAMPTZ,
    referral_source TEXT,
    marketing_consent BOOLEAN DEFAULT true;

-- Add to course_enrollments
ALTER TABLE course_enrollments ADD COLUMN IF NOT EXISTS
    discount_code_used TEXT,
    discount_amount DECIMAL(10,2),
    affiliate_id TEXT,
    access_revoked_at TIMESTAMPTZ;

-- Add to appointment_data
ALTER TABLE appointment_data ADD COLUMN IF NOT EXISTS
    therapist_id UUID REFERENCES therapist_profiles(id),
    zoom_meeting_url TEXT,
    session_notes_id UUID;
```

## 4. DATA INTEGRITY ISSUES

### A. Foreign Key Relationships
**Issues Found:**
1. No explicit link between auth.users and course_users table
2. Missing therapist assignment in appointments
3. No link between blog_posts and admin_users (author)

**Recommendations:**
```sql
-- Add author relationship to blog posts
ALTER TABLE blog_posts ADD COLUMN author_id UUID REFERENCES admin_users(id);

-- Ensure all user-related tables reference auth.users
ALTER TABLE course_users ADD COLUMN auth_user_id UUID REFERENCES auth.users(id);
```

### B. Missing Indexes
**Critical indexes needed:**
```sql
-- Payment performance
CREATE INDEX idx_appointment_payments_created_at ON appointment_payments(created_at DESC);
CREATE INDEX idx_stripe_webhook_events_type ON stripe_webhook_events(event_type);
CREATE INDEX idx_stripe_webhook_events_processed ON stripe_webhook_events(processed);

-- User activity
CREATE INDEX idx_user_notifications_user_read ON user_notifications(user_id, read);
CREATE INDEX idx_course_progress_completed ON course_progress(user_id, status) WHERE status = 'completed';
```

### C. Orphaned Data Possibilities
**Potential Issues:**
1. Deleted courses leaving orphaned enrollments
2. Removed workshops with existing registrations
3. Deleted blog posts referenced in analytics

**Solutions:**
- Implement soft deletes for critical entities
- Add archived flags instead of deletions
- Create cleanup procedures for orphaned data

## 5. REVIEW OF EXISTING ADMIN TABLES

### admin_users
- **Purpose**: Admin authentication and profile
- **Status**: Well-structured
- **Recommendations**: Add last_password_change, two_factor_enabled

### blog_posts
- **Purpose**: Blog content management
- **Status**: Good structure
- **Recommendations**: Add version history, SEO scores, view counts

### subscribers
- **Purpose**: Newsletter management
- **Status**: Comprehensive
- **Recommendations**: Add engagement scores, segment membership

### email_queue
- **Purpose**: Transactional email management
- **Status**: Basic but functional
- **Recommendations**: Add retry_count, priority levels

### analytics_events
- **Purpose**: User behavior tracking
- **Status**: Generic structure
- **Recommendations**: Add event categories, user journey tracking

## 6. RECOMMENDATIONS

### Immediate Actions:
1. Create missing webhook tables for Stripe and Calendly
2. Add user notification system
3. Implement email campaign tracking
4. Add missing indexes for performance

### Medium-term Improvements:
1. Implement soft deletes across all tables
2. Add comprehensive audit logging
3. Create data archival procedures
4. Implement role-based access control

### Long-term Enhancements:
1. Add data warehouse tables for analytics
2. Implement event sourcing for critical flows
3. Add multi-tenancy support for scaling
4. Create materialized views for reporting

## 7. SECURITY CONSIDERATIONS

### Current Strengths:
- RLS enabled on all user tables
- Proper authentication checks
- Audit logging for admin actions

### Areas for Improvement:
1. Add encryption for sensitive data (SSNs, health info)
2. Implement data retention policies
3. Add GDPR compliance tables
4. Create security event logging

## CONCLUSION

The Bloom Psychology database has a solid foundation with comprehensive user journey tracking, course management, and payment processing. The main gaps are in webhook processing, notification systems, and marketing analytics. Implementing the recommended missing tables and indexes will create a robust, scalable system capable of supporting all business requirements.