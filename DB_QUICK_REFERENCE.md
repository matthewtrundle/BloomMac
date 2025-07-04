# 🗄️ Database Quick Reference Card

## 🚀 Quick Commands

```bash
# Check what's in the database RIGHT NOW
node scripts/db_helper.js tables

# Check authentication setup
node scripts/db_helper.js check-auth  

# Show table structure
node scripts/db_helper.js schema admin_users
node scripts/db_helper.js schema user_profiles

# Run custom query
node scripts/db_helper.js query "SELECT * FROM admin_users"

# Full database audit
node scripts/db_helper.js audit
```

## 🔴 CRITICAL FACTS (as of Jan 2025)

### Authentication Tables
- **`admin_users`**: 2 rows (ACTIVE - used for admin login)
- **`user_profiles`**: 0 rows (NOT USED YET)
- **DO NOT DELETE `admin_users`!** Admin login will break!

### Email Tables (Duplicates!)
- **`email_queue`**: Original email system
- **`email_sends`**: New table we created
- **`email_logs`**: Another email tracking
- **Unclear which one the app actually uses!**

### Subscriber Tables
- **`subscribers`**: 19 rows (ACTIVE)
- **`newsletter_subscribers`**: 0 rows (duplicate, unused)

## 🛑 Before ANY Database Changes

1. **Run this first:**
   ```bash
   node scripts/db_helper.js check-auth
   ```

2. **Check which table a route uses:**
   ```bash
   grep -n "admin_users\|user_profiles" app/api/admin/auth/login/route.ts
   ```

3. **Test admin login:**
   ```bash
   curl -X POST http://localhost:3000/api/admin/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"beta1@bloomtest.com","password":"[ask-client]"}'
   ```

## 📊 Current Database State

```
AUTHENTICATION:
├── admin_users (2 rows) ← Admin panel uses this
│   ├── beta1@bloomtest.com (super_admin)
│   └── admin@bloompsychologynorthaustin.com (super_admin)
└── user_profiles (0 rows) ← Future unified system

EMAIL SYSTEMS:
├── email_queue (0 rows)
├── email_sends (0 rows) ← We created this
├── email_logs (1 row)
└── email_templates (3 rows)

SUBSCRIBERS:
├── subscribers (19 rows) ← Active list
└── newsletter_subscribers (0 rows) ← Duplicate

ANALYTICS:
├── analytics_events (3,875 rows) ← Main analytics
├── click_heatmap (51 rows)
└── conversion_events (0 rows) ← We created this
```

## ⚠️ Known Issues

1. **Admin login uses `admin_users`, not `user_profiles`**
2. **Multiple email tracking systems exist**
3. **JWT tokens still used for admin middleware**
4. **Several empty tables we created routes for**

## 🔧 Safe Operations

✅ **SAFE TO DO:**
- Add columns to existing tables
- Create new tables
- Add indexes
- Create views
- Add RLS policies

❌ **NEVER DO WITHOUT CHECKING:**
- Drop tables
- Rename columns
- Change column types
- Delete data
- Modify auth flow

## 🚨 Emergency Contacts

If you break authentication:
1. Check `admin_users` table still exists
2. Verify JWT_SECRET env var is set
3. Check middleware.ts hasn't changed
4. Rollback deployment if needed

---
**Remember**: Always query the actual database before making changes!