# CLAUDE.md - Critical Project Context for AI Assistants

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

## 📋 Pre-Flight Checklist

Before modifying ANYTHING:

- [ ] Query actual database schema
- [ ] Check which tables have data
- [ ] Verify which auth system is used
- [ ] Test admin login flow
- [ ] Check for table dependencies
- [ ] Review frontend code for API calls
- [ ] Create rollback plan

## 🔄 Current Migration Status (Jan 2025)

- Phase 1 Security: COMPLETE but needs auth fix
- Auth System: Hybrid (admin_users + user_profiles)
- Service Role: Removed from app code
- Next Phase: Database consolidation (careful!)

---

**Remember**: This is a production app with real users. Always verify before making changes!