# Supabase Database Schema Audit Report

## Executive Summary

The Bloom Psychology database shows significant technical debt with multiple duplicate table definitions, inconsistent naming conventions, and overlapping functionality. The schema has evolved organically without proper planning, resulting in confusion and potential data integrity issues.

## Critical Issues Found

### 1. **Duplicate Table Definitions**

#### Course-Related Tables (MAJOR DUPLICATION)
- **course_enrollments** - Defined in 3 different files:
  - `schema.sql` (lines 139-169) - Part of user management system
  - `create-course-tables.sql` (lines 1-18) - Different structure
  - `complete-user-course-schema.sql` (lines 139-169) - Most comprehensive
  
- **course_progress** - Defined in 2 files:
  - `course-payment-schema.sql` (lines 35-48)
  - `create-course-tables.sql` (lines 37-50)
  - Different column structures between definitions!

- **course_users** - Only in `create-course-tables.sql`
  - Overlaps with `user_profiles` table functionality

#### Analytics Tables
- **analytics_events** - Defined in:
  - `schema.sql` (lines 57-67)
  - `create-analytics-events-table.sql` (lines 4-15)
  - Slightly different column definitions

### 2. **Inconsistent Naming Conventions**

- Snake_case vs camelCase inconsistency:
  - `click_heatmap` vs `clickHeatmap` in some references
  - `user_profiles` vs `userProfiles` in API calls

- Table prefixes inconsistency:
  - `course_*` tables (course_enrollments, course_progress)
  - `user_*` tables (user_profiles, user_sessions)
  - No prefix: `subscribers`, `blog_posts`, `admin_users`

### 3. **Missing Foreign Key Constraints**

- `blog_posts` table has no author relationship to `admin_users`
- `email_queue` has no relationship to `subscribers`
- `career_applications` not linked to any user system

### 4. **Redundant User Management Systems**

Three separate user systems exist:
1. **Supabase Auth** (`auth.users`)
2. **course_users** table (custom auth for courses)
3. **admin_users** table (separate admin auth)

This creates confusion and potential security issues.

### 5. **Missing Indexes**

Critical missing indexes:
- `blog_posts.author_name` (for filtering by author)
- `email_automation_logs.sent_at` (for time-based queries)
- `user_activity_log.user_id + action` (composite index needed)

### 6. **Row Level Security (RLS) Issues**

- Inconsistent RLS policies across tables
- Some tables have RLS enabled but no policies defined
- `admin_users` table has no RLS at all (security risk)

### 7. **Data Type Inconsistencies**

- User IDs: Sometimes `UUID`, sometimes `TEXT`
- Email fields: `VARCHAR(255)` vs `TEXT`
- Timestamps: Mix of `TIMESTAMPTZ` and `TIMESTAMP WITH TIME ZONE`

### 8. **Missing Tables for Features**

No tables found for:
- Blog image uploads (bucket exists but no metadata table)
- Session management for non-admin users
- Email template versions/history
- Payment refunds tracking

## Table Inventory

### Core Business Tables
1. **subscribers** - Newsletter subscribers
2. **blog_posts** - Blog content
3. **contact_submissions** - Contact form entries
4. **career_applications** - Job applications

### Analytics & Tracking
1. **analytics_events** - General analytics
2. **click_heatmap** - Click tracking for heatmaps
3. **admin_activity_log** - Admin action logging
4. **audit_trail** - HIPAA compliance logging

### Email System
1. **email_sequences** - Email automation sequences
2. **sequence_emails** - Individual emails in sequences
3. **email_automation_logs** - Email sending logs
4. **email_templates** - Reusable email templates
5. **email_queue** - Pending emails

### Course System (DUPLICATED)
1. **courses** - Course definitions
2. **course_modules** - Course weeks/modules
3. **course_lessons** - Individual lessons
4. **course_enrollments** - User enrollments (DUPLICATE)
5. **course_purchases** - Stripe payment records
6. **user_course_access** - Access control
7. **course_progress** - Progress tracking (DUPLICATE)
8. **course_users** - Course-specific auth (REDUNDANT)

### User Management (COMPLEX)
1. **user_profiles** - Extended user data
2. **user_consents** - HIPAA consent tracking
3. **user_sessions** - Session tracking
4. **user_activity_log** - User actions
5. **user_lesson_progress** - Lesson completion
6. **user_workbook_responses** - Course workbook data
7. **user_week_submissions** - Weekly course submissions
8. **user_notifications** - User notifications

### Support System
1. **support_tickets** - Support tickets
2. **support_ticket_messages** - Ticket conversations

### Admin System
1. **admin_users** - Admin accounts
2. **admin_sessions** - Admin login sessions

### Chat System
1. **chat_conversations** - Chat history

## Recommendations

### Immediate Actions Required

1. **Resolve Duplicate Tables**
   - Choose ONE definition for each duplicated table
   - Migrate any existing data to the chosen structure
   - Delete redundant table definitions

2. **Consolidate User Systems**
   - Use Supabase Auth as the primary authentication
   - Extend with `user_profiles` for additional data
   - Remove `course_users` table
   - Keep `admin_users` separate for security

3. **Fix Critical Missing Indexes**
   ```sql
   CREATE INDEX idx_blog_posts_author ON blog_posts(author_name);
   CREATE INDEX idx_email_logs_sent ON email_automation_logs(sent_at);
   CREATE INDEX idx_user_activity_composite ON user_activity_log(user_id, action);
   ```

4. **Standardize Naming Conventions**
   - Use snake_case consistently
   - Add proper prefixes to related tables

5. **Add Blog Image Metadata Table**
   ```sql
   CREATE TABLE blog_post_images (
     id UUID PRIMARY KEY,
     blog_post_id UUID REFERENCES blog_posts(id),
     storage_path TEXT NOT NULL,
     alt_text TEXT,
     caption TEXT,
     uploaded_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

### Long-term Improvements

1. **Create a Master Schema File**
   - Single source of truth for all tables
   - Version controlled with migrations

2. **Implement Proper Migration System**
   - Use numbered migration files
   - Track applied migrations

3. **Add Data Validation Constraints**
   - Email format validation
   - Phone number format validation
   - Enum constraints for status fields

4. **Improve RLS Policies**
   - Consistent policy naming
   - Complete coverage for all tables
   - Regular security audits

5. **Performance Optimization**
   - Partition large tables by date
   - Add covering indexes for common queries
   - Regular VACUUM and ANALYZE

## Migration Priority

1. **High Priority**: Fix duplicate course tables (blocking course functionality)
2. **High Priority**: Add missing blog image table (needed for current feature)
3. **Medium Priority**: Consolidate user authentication systems
4. **Medium Priority**: Add missing indexes
5. **Low Priority**: Naming convention standardization
6. **Low Priority**: RLS policy improvements

## Conclusion

The database schema requires significant refactoring to resolve duplication, improve consistency, and enhance performance. The most critical issue is the duplicate course-related tables which could cause data integrity problems. A systematic approach to cleaning up the schema will greatly improve maintainability and reduce bugs.