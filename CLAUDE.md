# CLAUDE.md - Critical Project Context for AI Assistants

## 🛑 STOP: DATABASE AWARENESS - CRITICAL

### CURRENT DATABASE TABLES (Last Updated: Jan 2025):
The following tables exist in the production database:

| Table Name | Purpose | Key Info |
|------------|---------|----------|
| **email_templates** | Email template storage | 6 rows |
| **email_templates_custom** | Custom email templates | 10 rows |
| **email_sequences** | Email automation sequences | 5 rows |
| **sequence_emails** | Individual emails in sequences | 15 rows |
| **sequence_enrollments** | User enrollments in sequences | 37 rows |
| **subscribers** | Newsletter/email subscribers | 46 rows |
| **user_profiles** | All user profiles (including admins) | 6 rows |
| **contact_submissions** | Contact form submissions | 24 rows |
| **courses** | Course definitions | 3 rows |
| **course_modules** | Course week/module structure | 12 rows |
| **course_lessons** | Individual lessons | 49 rows |
| **email_automation_logs** | Email send history | 96 rows |
| **analytics_events** | Site analytics | 4,409 rows |

### STRICT RULES - NO EXCEPTIONS:
1. **NEVER** assume a column exists - ALWAYS verify first
2. **NEVER** create mock/fake data - USE REAL DATA from database
3. **NEVER** guess table names - USE THE LIST ABOVE
4. **NEVER** make up API responses - QUERY THE DATABASE
5. **ALWAYS** query before assuming structure

### Common Mistakes That Keep Happening:
- Assuming `subscribed` column exists (IT DOESN'T - use `status`)
- Creating fake email analytics data
- Making up template structures
- Assuming table relationships without checking

## 🚫 HALLUCINATION PREVENTION

### Red Flags That Should Trigger Re-verification:
- "I'll create some example..." → NO! Query real data
- "Typically, this would..." → NO! Check actual implementation
- "It should have..." → NO! Verify what it actually has
- "Let me generate..." → NO! Use real data from database

### Common AI Hallucination Patterns:
1. **Inventing Columns** - ALWAYS verify exact column names
2. **Creating Fake Data** - ALWAYS use real data from database
3. **Assuming Standard Patterns** - ALWAYS check actual structure

## 🧠 CONTEXT PRESERVATION RULES

### Memory Limitations:
- **AI WILL FORGET** - After ~10 messages, earlier context may be lost
- **SOLUTION**: Always re-verify assumptions with database checks
- **NEVER** rely on information from earlier in conversation without re-checking

### Every 5 Operations:
1. Re-run `node scripts/check-database.js`
2. Re-validate assumptions
3. Update this file with any discoveries

## 🚨 CRITICAL: Direct Database Access

### How to Query the Supabase Database Directly

**DO NOT MAKE ASSUMPTIONS ABOUT DATABASE SCHEMA!** Always query the actual database before creating migrations or modifying code.

```javascript
// Create this file to query the database
// scripts/query_database.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function queryDatabase() {
  // Example: Check what tables exist
  const { data: tables } = await supabase.rpc('query', {
    query: `
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename
    `
  }).single();
  
  console.log('Tables:', JSON.parse(tables));
  
  // Example: Check table structure
  const { data: columns } = await supabase.rpc('query', {
    query: `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'user_profiles'
    `
  }).single();
  
  console.log('Columns:', JSON.parse(columns));
}

// First create the query function if it doesn't exist
async function setupQueryFunction() {
  await supabase.rpc('query', {
    query: `
      CREATE OR REPLACE FUNCTION query(query text)
      RETURNS json
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      DECLARE
        result json;
      BEGIN
        EXECUTE 'SELECT json_agg(row_to_json(t)) FROM (' || query || ') t' INTO result;
        RETURN result;
      END;
      $$;
    `
  });
}

setupQueryFunction().then(queryDatabase);
```

### Quick Database Checks

```bash
# Run these commands to check database state
node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Check if a table exists
supabase.from('user_profiles').select('count', { count: 'exact', head: true })
  .then(({count, error}) => console.log('user_profiles:', error ? 'Does not exist' : count + ' rows'));

supabase.from('admin_activity_log').select('count', { count: 'exact', head: true })
  .then(({count, error}) => console.log('admin_activity_log:', error ? 'Does not exist' : count + ' rows'));
"
```

## 📧 EMAIL AUTOMATION SYSTEM ARCHITECTURE

### CURRENT WORKING STATUS (Jan 2025)

**PRODUCTION EMAIL SEQUENCES:**

| Trigger | Status | Emails | Entry Point | Implementation |
|---------|--------|--------|-------------|----------------|
| `newsletter_signup` | ✅ WORKING | 5 emails (30 days) | Profile settings, newsletter page | enrollmentManager ✅ |
| `contact_form` | ✅ WORKING | 0 emails configured | Contact form submissions | enrollmentManager ✅ |
| `resource_download` | 🗃️ ARCHIVED | N/A | Resource pages are free content | DECISION: No gated downloads |
| `new_mom_program` | 🚫 DISABLED BY DESIGN | N/A | Calendly bookings | DECISION: No email sequence |

### 🏗️ ARCHITECTURE DECISIONS (DO NOT CHANGE)

#### Resource Pages Decision (Jan 2025):
- **DECISION**: All resource pages (grounding-techniques, new-mom-guide, etc.) are FREE, clickable web content
- **REASON**: No gated downloads, no email signup required - content is openly accessible
- **ACTION**: Archived resource_download trigger - not needed
- **FILES**: `/app/resources/*/page.tsx` - all display content directly on page

#### New Mom Program Decision (Jan 2025):
- **DECISION**: No email automation for new mom program bookings
- **REASON**: Bookings handled via Calendly (external), clients receive personalized 1:1 support
- **ACTION**: Keep `new_mom_program` sequence disabled/empty
- **FILES**: `/new-mom-program/`, `/book-new-mom-program/` - lead to Calendly booking

### 🔧 EMAIL ENROLLMENT MANAGER SYSTEM

#### How It Works:
1. **Trigger Event**: User action (newsletter signup, contact form, etc.)
2. **enrollmentManager.enrollSubscriber()**: Creates enrollment record
3. **Cron Job**: `/api/cron/process-email-sequences/route.ts` runs every hour
4. **Email Processor**: Checks for ready emails and sends via Resend
5. **Progress Tracking**: Updates enrollment status and position

#### Key Files:
```
/lib/email-automation/enrollment-manager.ts  - Core enrollment logic
/app/api/cron/process-email-sequences/route.ts  - Email processor
/app/api/user/newsletter-subscribe/route.ts  - Working example
/app/api/contact/submit/route.ts  - Working example
```

#### Database Tables:
```sql
email_sequences        - Sequence definitions (trigger, status, name)
sequence_emails       - Individual emails (position, subject, content, delays)
sequence_enrollments  - User enrollments (subscriber_id, current_position, status)
subscribers          - User data (email, status, source, metadata)
email_automation_logs - Sent email tracking
```

#### Adding New Automation:
1. Create sequence in `email_sequences` table
2. Add emails to `sequence_emails` table
3. Update trigger code to call `enrollmentManager.enrollSubscriber()`
4. Test with processor: `npm run db:test`

### 🧪 TESTING EMAIL SEQUENCES

```bash
# Check sequence status
node scripts/check-pending-emails.js

# Test processor manually
node scripts/test-sequence-processor.js

# Verify enrollment
npm run db:query "SELECT * FROM sequence_enrollments WHERE subscriber_id = 'USER_ID'"
```

### 💡 ENROLLMENT MANAGER API

```javascript
await enrollmentManager.enrollSubscriber({
  subscriberId: 'uuid',
  trigger: 'newsletter_signup', // Must match email_sequences.trigger
  source: 'profile_settings',   // For tracking/analytics
  metadata: {                   // Optional extra data
    reactivated: true,
    service: 'anxiety_support'
  }
});
```

## 🔴 CRITICAL AUTHENTICATION CONTEXT

### Current Authentication System (AS OF Jan 2025)

**THE APP USES ONE USER TABLE WITH ROLE-BASED ACCESS:**

1. **`user_profiles`** - For ALL users (admin and regular)
   - Used by: All routes - both `/admin/*` and user dashboards
   - Auth method: Supabase Auth + JWT tokens for admin routes
   - Key fields: id, first_name, last_name, role
   - **NO EMAIL COLUMN! Email is in auth.users table**
   - Must JOIN with auth.users to get email
   - Role values: 'admin', 'student', 'provider'

**THERE IS NO `admin_users` TABLE!** Admin access is controlled by `role = 'admin'` in user_profiles.

### How Admin Login Works

1. User submits email/password to `/api/admin/auth/login`
2. Authenticates with Supabase Auth (auth.users table)
3. Checks if user has `role = 'admin'` in `user_profiles` table
4. Creates JWT token AND Supabase session
5. Sets 3 cookies: adminToken, sb-access-token, sb-refresh-token

### Common Pitfalls to Avoid

1. **DON'T** assume all users are in `user_profiles`
2. **DON'T** assume `admin_users` table exists (it doesn't!)
3. **DON'T** change auth flow without testing admin login
4. **DON'T** assume frontend uses only Supabase Auth (it uses JWT too)

## 📊 Database Schema Quick Reference

### Key Tables and Their Purpose

```sql
-- Run this query to see current state
SELECT 
  t.tablename,
  obj_description(c.oid, 'pg_class') as description,
  (SELECT COUNT(*) FROM t.tablename) as row_count
FROM pg_tables t
JOIN pg_class c ON c.relname = t.tablename
WHERE t.schemaname = 'public'
ORDER BY t.tablename;
```

| Table | Purpose | Key Facts |
|-------|---------|-----------|
| `user_profiles` | ALL user profiles | Has role field: 'admin', 'student', 'provider' |
| `subscribers` | Newsletter signups | Active newsletter list |
| `analytics_events` | Site analytics | Page views, conversions |
| `email_queue` | Email sending | Original email system |
| `contact_submissions` | Contact form data | User inquiries |
| `admin_activity_log` | Admin action tracking | Audit trail for admin panel |
| `admin_sessions` | Admin session tracking | Currently unused (0 rows) |

### Duplicate/Confusing Tables

- `email_queue` vs `email_sends` vs `email_logs` - Multiple email systems!
- `subscribers` vs `newsletter_subscribers` - Use `subscribers`
- NO `admin_users` table - admins are in `user_profiles` with `role = 'admin'`

## 🛠️ Development Commands

### Before Making ANY Database Changes

```bash
# 1. Check what tables exist
node scripts/check_database_state.js

# 2. Check which auth system a route uses
grep -r "user_profiles.*role" app/api/

# 3. Test admin login before deploying
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}'
```

### Safe Migration Process

1. **ALWAYS** check existing schema first
2. **NEVER** drop tables without checking dependencies
3. **TEST** auth flows before deploying
4. **KEEP** backup routes during transition
5. **LOG** all breaking changes

## 🚨 Environment Variables

```env
# Database Access
NEXT_PUBLIC_SUPABASE_URL=https://utetcmirepwdxbtrcczv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # For migrations only!

# Authentication
JWT_SECRET=<32+ character secret>  # Still used for admin panel!

# Email
RESEND_API_KEY=re_...

# DEPRECATED - DO NOT USE
ADMIN_PASSWORD=  # Removed
ADMIN_API_KEY=   # Removed
```

## 📋 MANDATORY Pre-Flight Checklist

### Before ANY Database Work:
```bash
node scripts/check-database.js
```
This shows actual tables, columns, and sample data. NO EXCEPTIONS.

### Before Deploying Changes:
```bash
node scripts/validate-schema.js
```
This validates schema matches expectations and catches common errors.

### When Creating New Features:
1. **Query the actual database first** - No assumptions
2. **Never use mock data** - Always use real data from database
3. **Always check column names** - Don't guess, verify
4. **Verify relationships** - Check foreign keys and joins

### For Context Preservation:
1. **Keep CLAUDE.md updated** with any schema changes
2. **Document new tables/columns immediately** in the schema section below
3. **Add validation rules** to validate-schema.js for new tables
4. **Never trust memory** - Always verify with database

### Original Checklist:
- [ ] Query actual database schema
- [ ] Check which tables have data
- [ ] Verify which auth system is used
- [ ] Test admin login flow
- [ ] Check for table dependencies
- [ ] Review frontend code for API calls
- [ ] Create rollback plan

## 📊 VERIFIED DATABASE SCHEMA (Last checked: Jan 2025)

### Key Tables and Their ACTUAL Columns:

#### `subscribers` table:
- `id` (uuid)
- `email` (varchar)
- `status` (varchar) - VALUES: 'active', 'unsubscribed', 'pending'
- `source` (varchar) - signup source
- `created_at` (timestamp)
- `updated_at` (timestamp)
- **NO `subscribed` COLUMN - USE `status`**

#### `email_templates` table:
- `id` (uuid)
- `name` (varchar)
- `subject` (varchar)
- `content` (text)
- `category` (varchar)
- `variables` (jsonb)


#### `user_profiles` table:
- `id` (uuid)
- `first_name` (text)
- `last_name` (text)
- **NO EMAIL COLUMN - email is in auth.users**

#### `user_preferences` table:
- `id` (uuid)
- `user_id` (uuid) - references auth.users
- `privacy_settings` (jsonb) - contains contact_visibility, profile_visibility
- `security_settings` (jsonb)
- `notification_preferences` (jsonb)
- `communication_preferences` (jsonb)
- `reminder_settings` (jsonb)
- `quiet_hours` (jsonb)
- `theme_preference` (varchar)
- `language` (varchar)
- `timezone` (varchar)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## 🔧 How to Update Schema Documentation

When you discover schema changes:

1. **Run the check script first**:
   ```bash
   node scripts/check-database.js > schema-update.txt
   ```

2. **Update this file** with the new schema in the section above

3. **Update validate-schema.js** to include new validation rules

4. **Commit immediately** with message like:
   ```bash
   git add CLAUDE.md scripts/validate-schema.js
   git commit -m "docs: Update schema documentation with [table_name] changes"
   ```

## 🔄 Current Migration Status (Jan 2025)

- Phase 1 Security: COMPLETE but needs auth fix
- Auth System: Hybrid (admin_users + user_profiles)
- Service Role: Removed from app code
- Profiles Table: Fixed signup error (removed email field insertion)
- Profile Edit: Switched to /api/profile/save endpoint (better validation)
- Next Phase: Database consolidation - remove duplicate profiles table

### Recent Profile System Fixes (Jan 6, 2025)
- **Fixed**: Signup API no longer tries to insert email into user_profiles
- **Updated**: Edit profile page now uses /api/profile/save endpoint
- **Created**: Migration scripts in scripts/migrate-profiles-cleanup.js and scripts/sql/cleanup-profiles-table.sql
- **Decision**: Use only user_profiles table, remove profiles table after migration
- **Fixed**: Added session verification in onboarding flow to prevent 401 errors
- **Issue**: If Supabase email confirmation is enabled, users won't get session until email confirmed

### Authentication Flow Issues & Solutions
- **Problem**: Users getting 401 errors after signup when accessing wellness hub
- **Cause**: Email confirmation enabled in Supabase prevents immediate session creation
- **Solution 1**: Disable email confirmation in Supabase Dashboard (for development)
- **Solution 2**: Handle email confirmation flow properly (for production):
  - Check `requiresEmailConfirmation` flag from signup response
  - Redirect to "check email" page instead of dashboard
  - Only allow dashboard access after email confirmation

---

**Remember**: This is a production app with real users. Always verify before making changes!

## 💡 Quick Decision Tree

```
Need to know if column exists?
  → Run: node scripts/check-database.js
  
Creating new feature?
  → Check "Verified Schema" section first
  → Run: node scripts/validate-schema.js
  
Modifying authentication?
  → Read "Critical Authentication Context"
  → Test with provided curl commands
  
About to use mock data?
  → STOP! Query real data instead
  
Uncertain about anything?
  → Re-run database checks
  → Ask user to confirm before proceeding
```

## 📋 Command Cheat Sheet

| Task | Command | When to Use |
|------|---------|-------------|
| Check all tables | `npm run db:check` | Before ANY database work |
| Validate schema | `npm run db:validate` | Before deploying |
| Query database | `npm run db:query "SELECT * FROM table"` | Test queries before using |
| Test queries | `npm run db:test` | Verify queries work |
| Build-test loop | `npm run db:build-test` | Test code matches database |
| Check specific table | `npm run db:check \| grep -A 20 "table_name"` | When working with specific table |
| Save schema snapshot | `npm run db:check > schema-$(date +%Y%m%d).txt` | Before major changes |

## 🔄 MANDATORY WORKFLOW - DO THIS AUTOMATICALLY!

### Example 1: User asks "Add a feature to show active subscribers"
**YOU MUST DO THIS SEQUENCE:**
```bash
# 1. First, check what columns exist
npm run db:query "SELECT column_name FROM information_schema.columns WHERE table_name = 'subscribers'"

# 2. Test the actual query
npm run db:query "SELECT * FROM subscribers WHERE status = 'active' LIMIT 5"

# 3. Only THEN write the code
```

### Example 2: User asks "Why is the email template not loading?"
**YOU MUST DO THIS SEQUENCE:**
```bash
# 1. Check if table exists
npm run db:check | grep email_templates

# 2. See actual data structure
npm run db:query "SELECT * FROM email_templates LIMIT 1"

# 3. Test the failing query
npm run db:query "THE_QUERY_FROM_THE_CODE"

# 4. Fix based on REAL data, not assumptions
```

### Example 3: Creating new API endpoint
**YOU MUST DO THIS SEQUENCE:**
```bash
# 1. Test ALL queries first
npm run db:build-test

# 2. Generate types from real data
# (The command above does this)

# 3. Write code using verified queries only
```

## ⚠️ ENFORCEMENT RULES

If you write database code without showing test results first:
1. The code WILL have bugs
2. The user WILL be frustrated
3. You MUST go back and test first

**SHOW YOUR WORK** - Always include command outputs in responses!

## 📊 EMAIL AUTOMATION TROUBLESHOOTING

### Common Issues:
1. **"No emails being sent"** → Check sequence status is 'active', verify cron job running
2. **"Enrollment not created"** → Verify subscriber exists, check trigger spelling
3. **"Wrong sequence triggered"** → Check trigger field matches email_sequences.trigger exactly
4. **"Emails marked as sent but not received"** → Check Resend dashboard, verify email_automation_logs

### Quick Diagnostics:
```bash
# Check if enrollments are being created
npm run db:query "SELECT COUNT(*) FROM sequence_enrollments WHERE created_at > NOW() - INTERVAL '1 day'"

# Check if emails are being processed
npm run db:query "SELECT COUNT(*) FROM email_automation_logs WHERE created_at > NOW() - INTERVAL '1 day'"

# See active sequences
npm run db:query "SELECT name, trigger, status FROM email_sequences WHERE status = 'active'"
```

### Email Sequence Status Reference:
- **Active Sequences**: `newsletter_signup` (5 emails), `contact_form` (0 emails but working)
- **Archived**: `resource_download` (resource pages are free content)
- **Disabled**: `new_mom_program` (Calendly handles bookings, no automation needed)

## 🏗️ PRODUCTION SAFETY RULES

### Before ANY Destructive Operation:
1. **Create backup** of affected tables
2. **Test on local** database first
3. **Have rollback** script ready
4. **Notify team** of changes

### Error Handling Pattern:
```javascript
// NEVER swallow errors silently
try {
  const result = await operation();
} catch (error) {
  console.error('Operation failed:', {
    error: error.message,
    context: { /* relevant data */ }
  });
  throw error; // Re-throw after logging
}
```

## 🤖 AUTOMATIC TRIGGERS FOR TESTING

These keywords/phrases in user messages MUST trigger immediate testing:

| User Says | You MUST Run |
|-----------|--------------|
| "add [feature]" | `npm run db:check` then test queries |
| "why is [X] not working" | `npm run db:query` on the failing query |
| "show all [X]" | `npm run db:query "SELECT * FROM [table] LIMIT 5"` |
| "fix the [X] error" | Test the actual query causing error |
| "subscribers" | `npm run db:query "SELECT column_name FROM information_schema.columns WHERE table_name = 'subscribers'"` |
| "email" | `npm run db:check \| grep email` |
| "template" | `npm run db:query "SELECT * FROM email_templates LIMIT 1"` |

## 💡 Why This File Exists

This file is automatically provided to Claude at the start of every conversation. It contains critical context that prevents repeated mistakes and ensures consistency across sessions. 

**If you see Claude making assumptions about the database, remind them to check CLAUDE.md and run the database scripts!**

## 🚨 FINAL REMINDER

**YOU ARE AN AI THAT MAKES MISTAKES.** The only way to prevent these mistakes is to TEST EVERYTHING FIRST. The tools exist. USE THEM AUTOMATICALLY. Don't wait to be asked.