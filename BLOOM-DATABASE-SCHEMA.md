# Bloom Course Database Schema Documentation

## Overview
This document provides a complete reference for the Bloom Psychology course database schema.

## Table Structure

### 1. `courses`
Main course catalog table.

**Columns:**
- `id` (UUID, PK) - Auto-generated with `uuid_generate_v4()`
- `slug` (VARCHAR(255), UNIQUE, NOT NULL) - URL-friendly identifier
- `title` (VARCHAR(255), NOT NULL) - Course title
- `subtitle` (VARCHAR(255)) - Course subtitle
- `description` (TEXT) - Short description
- `long_description` (TEXT) - Detailed description
- `price` (NUMERIC, NOT NULL, DEFAULT: 0) - Course price
- `original_price` (NUMERIC) - Original price (for discounts)
- `duration` (VARCHAR(50)) - e.g., "6 weeks"
- `total_modules` (INTEGER, DEFAULT: 0) - Number of modules/weeks
- `total_lessons` (INTEGER, DEFAULT: 0) - Total lesson count
- `total_duration_minutes` (INTEGER, DEFAULT: 0) - Total video duration
- `image_url` (VARCHAR(500)) - Course thumbnail
- `instructor_name` (VARCHAR(255), DEFAULT: 'Dr. Jana Rundle')
- `instructor_credentials` (VARCHAR(255), DEFAULT: 'Licensed Therapist, Perinatal Mental Health Specialist')
- `features` (JSONB, DEFAULT: '[]') - Array of feature strings
- `learning_outcomes` (JSONB, DEFAULT: '[]') - Array of outcomes
- `bonus_materials` (JSONB, DEFAULT: '[]') - Array of bonus items
- `is_active` (BOOLEAN, DEFAULT: true) - Whether course is available
- `is_featured` (BOOLEAN, DEFAULT: false) - Featured course flag
- `sort_order` (INTEGER, DEFAULT: 0) - Display order
- `created_at` (TIMESTAMPTZ, DEFAULT: now())
- `updated_at` (TIMESTAMPTZ, DEFAULT: now())

### 2. `course_modules`
Weekly modules/sections within a course.

**Columns:**
- `id` (UUID, PK) - Auto-generated with `gen_random_uuid()`
- `course_id` (UUID, FK → courses.id) - Parent course
- `week_number` (INTEGER, NOT NULL) - Week number (1-6)
- `title` (TEXT, NOT NULL) - Module title
- `description` (TEXT) - Module description
- `objectives` (JSONB, DEFAULT: '[]') - Learning objectives
- `order_index` (INTEGER, DEFAULT: 0) - Sort order
- `is_published` (BOOLEAN, DEFAULT: false) - Published status
- `created_at` (TIMESTAMPTZ, DEFAULT: now())
- `updated_at` (TIMESTAMPTZ, DEFAULT: now())

**Constraints:**
- UNIQUE: `(course_id, week_number)`

### 3. `course_lessons`
Individual lessons within modules.

**Columns:**
- `id` (UUID, PK) - Auto-generated with `gen_random_uuid()`
- `module_id` (UUID, FK → course_modules.id) - Parent module
- `lesson_number` (INTEGER, NOT NULL) - Lesson number within module
- `title` (TEXT, NOT NULL) - Lesson title
- `description` (TEXT) - Lesson description
- `video_url` (TEXT) - Vimeo/video URL
- `video_duration_minutes` (INTEGER) - Video length
- `video_thumbnail_url` (TEXT) - Video thumbnail
- `slides_html` (TEXT) - HTML presentation content
- `transcript` (TEXT) - Video transcript
- `script_notes` (TEXT) - Speaker notes
- `resources` (JSONB, DEFAULT: '[]') - Downloadable resources
- `order_index` (INTEGER, DEFAULT: 0) - Sort order
- `is_preview` (BOOLEAN, DEFAULT: false) - Free preview flag
- `is_published` (BOOLEAN, DEFAULT: false) - Published status
- `created_at` (TIMESTAMPTZ, DEFAULT: now())
- `updated_at` (TIMESTAMPTZ, DEFAULT: now())
- `video_script_formatted` (TEXT) - Formatted script
- `script_version` (INTEGER, DEFAULT: 1) - Script version number
- `script_duration_estimate` (INTEGER) - Estimated speaking time
- `script_last_edited_by` (TEXT) - Last editor
- `script_last_edited_at` (TIMESTAMPTZ) - Last edit time
- `script_status` (TEXT, DEFAULT: 'draft') - Script status
- `talking_points` (JSONB, DEFAULT: '[]') - Key talking points
- `script_notes_backup` (TEXT) - Backup of notes

**Constraints:**
- UNIQUE: `(module_id, lesson_number)`
- CHECK: `script_status IN ('draft', 'reviewed', 'final', 'archived')`

### 4. `course_enrollments`
User enrollments in courses.

**Columns:**
- `id` (UUID, PK) - Auto-generated with `uuid_generate_v4()`
- `user_id` (UUID, FK → user_profiles.id) - Enrolled user
- `course_id` (UUID, FK → courses.id) - Enrolled course
- `enrollment_date` (TIMESTAMPTZ, DEFAULT: now()) - When enrolled
- `enrollment_method` (VARCHAR(30), DEFAULT: 'online') - How enrolled
- `payment_status` (VARCHAR(20), DEFAULT: 'pending') - Payment status
- `payment_amount` (NUMERIC) - Amount paid
- `payment_date` (TIMESTAMPTZ) - When paid
- `stripe_payment_intent_id` (VARCHAR(255)) - Stripe payment ID
- `access_expires_at` (TIMESTAMPTZ) - Access expiration
- `completion_status` (VARCHAR(20), DEFAULT: 'not_started') - Progress status
- `progress_percentage` (INTEGER, DEFAULT: 0) - Progress 0-100
- `completion_date` (TIMESTAMPTZ) - When completed
- `certificate_issued_date` (TIMESTAMPTZ) - Certificate date
- `last_accessed` (TIMESTAMPTZ) - Last activity
- `total_time_spent_minutes` (INTEGER, DEFAULT: 0) - Time spent
- `lessons_completed` (INTEGER, DEFAULT: 0) - Lessons done
- `created_at` (TIMESTAMPTZ, DEFAULT: now())
- `updated_at` (TIMESTAMPTZ, DEFAULT: now())

**Constraints:**
- UNIQUE: `(user_id, course_id)`
- CHECK: `enrollment_method IN ('online', 'phone', 'admin', 'gift')`
- CHECK: `payment_status IN ('pending', 'paid', 'refunded', 'failed', 'free')`
- CHECK: `completion_status IN ('not_started', 'in_progress', 'completed', 'dropped')`
- CHECK: `progress_percentage BETWEEN 0 AND 100`

### 5. `user_course_access`
Simple email-based course access (used by Stripe webhooks).

**Columns:**
- `id` (UUID, PK) - Auto-generated with `gen_random_uuid()`
- `customer_email` (TEXT, NOT NULL) - Customer email
- `course_id` (TEXT, NOT NULL) - Course slug
- `stripe_customer_id` (TEXT) - Stripe customer ID
- `stripe_session_id` (TEXT) - Stripe session ID
- `payment_status` (TEXT, DEFAULT: 'pending') - Payment status
- `access_granted_at` (TIMESTAMPTZ) - When access granted
- `last_accessed_at` (TIMESTAMPTZ) - Last access time
- `progress_data` (JSONB, DEFAULT: '{}') - Progress tracking
- `created_at` (TIMESTAMPTZ, DEFAULT: now())
- `updated_at` (TIMESTAMPTZ, DEFAULT: now())

**Constraints:**
- UNIQUE: `(customer_email, course_id)`

### 6. `user_profiles`
User profile information linked to auth.users.

**Columns:**
- `id` (UUID, PK, FK → auth.users.id) - User ID (NOT auto-generated)
- `first_name` (VARCHAR(100), NOT NULL) - First name
- `last_name` (VARCHAR(100), NOT NULL) - Last name
- `phone` (VARCHAR(20)) - Phone number
- `role` (VARCHAR(20), DEFAULT: 'student') - User role
- `enrollment_status` (VARCHAR(20), DEFAULT: 'pending') - Enrollment status
- `postpartum_date` (DATE) - Postpartum date
- `baby_due_date` (DATE) - Baby due date
- `number_of_children` (INTEGER) - Number of children
- `emergency_contact_name` (VARCHAR(200)) - Emergency contact name
- `emergency_contact_phone` (VARCHAR(20)) - Emergency contact phone
- `emergency_contact_relationship` (VARCHAR(100)) - Emergency contact relationship
- `hipaa_consent` (BOOLEAN, DEFAULT: false) - HIPAA consent
- `hipaa_consent_date` (TIMESTAMPTZ) - HIPAA consent date
- `marketing_consent` (BOOLEAN, DEFAULT: false) - Marketing consent
- `terms_accepted` (BOOLEAN, DEFAULT: false) - Terms accepted
- `terms_accepted_date` (TIMESTAMPTZ) - Terms acceptance date
- `email_verified` (BOOLEAN, DEFAULT: false) - Email verified
- `account_status` (VARCHAR(20), DEFAULT: 'active') - Account status
- `last_login` (TIMESTAMPTZ) - Last login time
- `timezone` (VARCHAR(50), DEFAULT: 'America/Chicago') - User timezone
- `notification_preferences` (JSONB, DEFAULT: '{"sms": false, "push": true, "email": true}') - Notification preferences
- `accessibility_preferences` (JSONB, DEFAULT: '{"dark_mode": false, "large_text": false, "audio_enabled": false}') - Accessibility preferences
- `created_at` (TIMESTAMPTZ, DEFAULT: now())
- `updated_at` (TIMESTAMPTZ, DEFAULT: now())

**Constraints:**
- CHECK: `role IN ('student', 'instructor', 'admin')`
- CHECK: `enrollment_status IN ('pending', 'active', 'completed', 'suspended')`
- CHECK: `account_status IN ('active', 'suspended', 'deleted')`

**Important Note:** This table does NOT have an email column. Email is stored in `auth.users` table.

### 7. `course_purchases`
Stripe purchase records.

**Columns:**
- `id` (UUID, PK) - Auto-generated with `gen_random_uuid()`
- `stripe_session_id` (TEXT, UNIQUE, NOT NULL) - Stripe session
- `customer_email` (TEXT, NOT NULL) - Customer email
- `course_id` (TEXT, NOT NULL) - Course slug
- `amount_paid` (INTEGER, NOT NULL) - Amount in cents
- `currency` (TEXT, DEFAULT: 'usd') - Currency code
- `payment_status` (TEXT, DEFAULT: 'pending') - Payment status
- `stripe_payment_intent` (TEXT) - Payment intent ID
- `metadata` (JSONB, DEFAULT: '{}') - Additional data
- `created_at` (TIMESTAMPTZ, DEFAULT: now())
- `updated_at` (TIMESTAMPTZ, DEFAULT: now())

### 7. `course_resources`
Downloadable resources for courses/lessons.

**Columns:**
- `id` (UUID, PK) - Auto-generated with `gen_random_uuid()`
- `course_id` (UUID, FK → courses.id) - Parent course
- `module_id` (UUID, FK → course_modules.id) - Parent module (optional)
- `lesson_id` (UUID, FK → course_lessons.id) - Parent lesson (optional)
- `title` (TEXT, NOT NULL) - Resource title
- `description` (TEXT) - Resource description
- `file_url` (TEXT) - Download URL
- `file_type` (VARCHAR(50)) - File type/extension
- `file_size_bytes` (INTEGER) - File size
- `download_count` (INTEGER, DEFAULT: 0) - Download counter
- `order_index` (INTEGER, DEFAULT: 0) - Sort order
- `is_active` (BOOLEAN, DEFAULT: true) - Active status
- `created_at` (TIMESTAMPTZ, DEFAULT: now())

## Important Notes

### Authentication & Access
1. The system uses TWO access methods:
   - `user_course_access` - Email-based, used by Stripe webhooks
   - `course_enrollments` - User ID-based, for authenticated users

2. Always check BOTH tables when verifying course access.

### Valid Enum Values

**enrollment_method:**
- `'online'` (default)
- `'phone'`
- `'admin'`
- `'gift'`

**payment_status:**
- `'pending'` (default)
- `'paid'`
- `'refunded'`
- `'failed'`
- `'free'`

**completion_status:**
- `'not_started'` (default)
- `'in_progress'`
- `'completed'`
- `'dropped'`

**script_status:**
- `'draft'` (default)
- `'reviewed'`
- `'final'`
- `'archived'`