# CLAUDE.md - Critical Project Context for AI Assistants

## 🛑 STOP: MANDATORY DATABASE CHECKS BEFORE ANY CHANGES

### STRICT RULES - NO EXCEPTIONS:
1. **NEVER** assume a column exists - CHECK FIRST
2. **NEVER** create mock/fake data - USE REAL DATA
3. **NEVER** guess table names - VERIFY FIRST
4. **NEVER** make up API responses - QUERY THE DATABASE
5. **ALWAYS** run `node scripts/check-database.js` before modifying any database-related code

### Common Mistakes That Keep Happening:
- Assuming `subscribed` column exists (IT DOESN'T - use `status`)
- Creating fake email analytics data
- Making up template structures
- Assuming table relationships without checking

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
supabase.from('admin_users').select('count', { count: 'exact', head: true })
  .then(({count, error}) => console.log('admin_users:', error ? 'Does not exist' : count + ' rows'));

supabase.from('user_profiles').select('count', { count: 'exact', head: true })
  .then(({count, error}) => console.log('user_profiles:', error ? 'Does not exist' : count + ' rows'));
"
```

## 🔴 CRITICAL AUTHENTICATION CONTEXT

### Current Authentication System (AS OF Jan 2025)

**THE APP USES TWO DIFFERENT USER TABLES:**

1. **`admin_users`** - For admin panel authentication
   - Used by: `/admin/*` routes, admin API endpoints
   - Auth method: Supabase Auth + JWT tokens in cookies
   - Key fields: id (references auth.users), email, role, is_active
   - **HAS EMAIL COLUMN**

2. **`user_profiles`** - For regular users (patients/clients)
   - Used by: User dashboard, profile pages
   - Auth method: Supabase Auth only
   - Key fields: id, first_name, last_name, role
   - **NO EMAIL COLUMN! Email is in auth.users table**
   - Must JOIN with auth.users to get email

**DO NOT ASSUME THESE ARE UNIFIED!** Check which table each route actually uses.

### How Admin Login Works

1. User submits email/password to `/api/admin/auth/login`
2. Authenticates with Supabase Auth (auth.users table)
3. Checks if user exists in `admin_users` table
4. Creates JWT token AND Supabase session
5. Sets 3 cookies: adminToken, sb-access-token, sb-refresh-token

### Common Pitfalls to Avoid

1. **DON'T** assume all users are in `user_profiles`
2. **DON'T** delete `admin_users` table without migration
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
| `admin_users` | Admin authentication | Links to auth.users, has role field |
| `user_profiles` | User profiles | Regular users, patients |
| `subscribers` | Newsletter signups | Active newsletter list |
| `analytics_events` | Site analytics | Page views, conversions |
| `email_queue` | Email sending | Original email system |
| `contact_submissions` | Contact form data | User inquiries |

### Duplicate/Confusing Tables

- `email_queue` vs `email_sends` vs `email_logs` - Multiple email systems!
- `subscribers` vs `newsletter_subscribers` - Use `subscribers`
- `admin_users` vs `user_profiles` with role - NOT unified yet!

## 🛠️ Development Commands

### Before Making ANY Database Changes

```bash
# 1. Check what tables exist
node scripts/check_database_state.js

# 2. Check which auth system a route uses
grep -r "admin_users\|user_profiles" app/api/

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

#### `admin_users` table:
- `id` (uuid) 
- `email` (varchar)
- `role` (varchar)
- `is_active` (boolean)
- **HAS EMAIL COLUMN**

#### `user_profiles` table:
- `id` (uuid)
- `first_name` (text)
- `last_name` (text)
- **NO EMAIL COLUMN - email is in auth.users**

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
- Next Phase: Database consolidation (careful!)

---

**Remember**: This is a production app with real users. Always verify before making changes!

## 💡 Why This File Exists

This file is automatically provided to Claude at the start of every conversation. It contains critical context that prevents repeated mistakes and ensures consistency across sessions. 

**If you see Claude making assumptions about the database, remind them to check CLAUDE.md and run the database scripts!**