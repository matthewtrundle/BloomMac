# API Database Inconsistency Report

Generated: 2025-07-09

## Executive Summary

This report provides a comprehensive analysis of all API endpoints in the Bloom Psychology application, documenting database queries and identifying potential inconsistencies between API expectations and actual database state.

## Key Findings

### 1. Tables Referenced in APIs

#### ✅ Confirmed Existing Tables:
- `user_profiles` (6 rows)
- `email_templates` (1 row)
- `email_templates_custom` (0 rows)
- `email_sequences` (5 rows)
- `sequence_emails` (8 rows)
- `sequence_enrollments` (35 rows)
- `subscribers` (46 rows)
- `contact_submissions` (24 rows)
- `courses` (3 rows)
- `course_modules` (12 rows)
- `course_lessons` (49 rows)
- `email_automation_logs` (85 rows)
- `analytics_events` (4482 rows)
- `admin_activity_log`

#### ⚠️ Tables That Exist But Should Be Removed (HIPAA Cleanup):
- `appointments` (null rows - empty)
- `appointment_data` (null rows - empty)
- `clinical_notes` (null rows - empty)
- `provider_profiles` (null rows - empty)
- `user_workbook_responses` (null rows - empty)
- `user_week_submissions` (null rows - empty)

#### ❌ Tables Referenced in APIs But May Not Exist:
- `career_applications` (used in /app/api/admin/careers/route.ts)
- `admin_users` (referenced in auth checks but doesn't exist - using user_profiles with role='admin')
- `email_logs` (used in /app/api/email-analytics/route.ts)
- `email_analytics` (used in /app/api/email-analytics/route.ts)
- `cron_logs` (used in /app/api/cron/process-email-sequences/route.ts)
- `system_settings` (used in /app/api/admin/settings/route.ts)
- `user_achievements` (used in /app/api/achievements/get/route.ts)
- `course_enrollments` (referenced but working in verify script)

### 2. RPC Functions Called

The following RPC functions are called by APIs and need to exist in the database:

1. `get_all_courses_with_user_progress` - Used in courses/all-progress
2. `get_analytics_dashboard` - Used in admin/analytics
3. `get_email_analytics` - Used in email-analytics
4. `get_table_columns` - Used in test endpoints
5. `get_user_course_stats` - Used in course/stats
6. `get_user_dashboard_data` - Used in dashboard
7. `increment` - Used for email tracking counters
8. `submit_contact_form` - Used in contact form submission

### 3. Critical Issues Found

#### Issue 1: Email Analytics Tables
- **Problem**: `/app/api/email-analytics/route.ts` references `email_logs` and `email_analytics` tables
- **Impact**: Email tracking features may fail
- **Solution**: Either create these tables or update API to use `email_automation_logs`

#### Issue 2: Career Applications
- **Problem**: `/app/api/admin/careers/route.ts` expects `career_applications` table
- **Impact**: Career applications admin panel will fail
- **Solution**: Create the table or disable the feature

#### Issue 3: Admin Authentication Confusion
- **Problem**: Some code references `admin_users` table which doesn't exist
- **Impact**: Potential auth issues (though current auth uses `user_profiles` with role check)
- **Solution**: Ensure all auth code uses `user_profiles` table consistently

#### Issue 4: System Settings Storage
- **Problem**: `/app/api/admin/settings/route.ts` expects `system_settings` table
- **Impact**: Admin settings won't persist (falls back to defaults)
- **Solution**: Create the table or use a different storage method

#### Issue 5: User Achievements
- **Problem**: `/app/api/achievements/get/route.ts` expects `user_achievements` table
- **Impact**: Achievement system won't work
- **Solution**: Create the table or disable the feature

#### Issue 6: Cron Logging
- **Problem**: Email sequence processor tries to log to `cron_logs` table
- **Impact**: Cron job monitoring won't work (but jobs still run)
- **Solution**: Create the table or remove logging

### 4. Potential Column Issues

#### `/app/api/auth/register/route.ts` (Line 152):
- Queries `user_profiles` table with `.eq('email', email)`
- **Issue**: According to CLAUDE.md, `user_profiles` has NO email column (email is in auth.users)
- **Impact**: Email availability check will always fail

### 5. Database State vs. API Expectations

| Feature | Expected Tables | Actual State | Status |
|---------|----------------|--------------|---------|
| Email Automation | email_sequences, sequence_emails, sequence_enrollments | All exist | ✅ Working |
| Contact Forms | contact_submissions, subscribers | All exist | ✅ Working |
| Courses | courses, course_modules, course_lessons | All exist | ✅ Working |
| User Profiles | user_profiles | Exists | ✅ Working |
| Admin Activity | admin_activity_log | Exists | ✅ Working |
| Email Analytics | email_logs, email_analytics | Missing | ❌ Broken |
| Career Applications | career_applications | Missing | ❌ Broken |
| System Settings | system_settings | Missing | ❌ Broken |
| Achievements | user_achievements | Missing | ❌ Broken |

## Recommendations

### Immediate Actions Required:

1. **Fix Email Analytics**:
   - Either create `email_logs` and `email_analytics` tables
   - OR update `/app/api/email-analytics/route.ts` to use existing `email_automation_logs`

2. **Fix Auth Register Check**:
   - Remove email check from `user_profiles` in `/app/api/auth/register/route.ts`
   - Use proper auth.users table check instead

3. **Create Missing Tables** (if features are needed):
   ```sql
   -- Career applications
   CREATE TABLE career_applications (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     first_name VARCHAR,
     last_name VARCHAR,
     email VARCHAR,
     phone VARCHAR,
     position VARCHAR,
     status VARCHAR DEFAULT 'new',
     reviewed_by UUID,
     reviewed_at TIMESTAMP,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- System settings
   CREATE TABLE system_settings (
     key VARCHAR PRIMARY KEY,
     value JSONB,
     updated_by VARCHAR,
     updated_at TIMESTAMP DEFAULT NOW()
   );

   -- User achievements
   CREATE TABLE user_achievements (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES auth.users(id),
     name VARCHAR,
     description TEXT,
     icon VARCHAR,
     points INTEGER DEFAULT 0,
     earned_at TIMESTAMP DEFAULT NOW()
   );

   -- Cron logs
   CREATE TABLE cron_logs (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     job_name VARCHAR,
     status VARCHAR,
     duration_ms INTEGER,
     error_message TEXT,
     details JSONB,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

4. **Remove HIPAA-Related Tables**:
   - Drop empty tables: appointments, appointment_data, clinical_notes, provider_profiles, user_workbook_responses, user_week_submissions

5. **Update CLAUDE.md**:
   - Add newly discovered tables to the documentation
   - Update row counts
   - Document which features are currently broken

### Long-term Improvements:

1. **Database Migration System**: Implement proper migration tracking to prevent schema drift
2. **API Testing**: Add integration tests that verify table/column existence
3. **Schema Validation**: Run regular checks comparing API expectations vs actual schema
4. **Feature Flags**: Disable features when their required tables don't exist

## Conclusion

The application has several database inconsistencies that need attention. The core features (email automation, contact forms, courses) are working correctly, but several admin features and analytics functions are broken due to missing tables. The most critical issue is the email column check in the registration API that will always fail.