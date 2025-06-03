# 🔍 Comprehensive System Audit for Bloom Psychology

## 1. 🗄️ DATABASE AUDIT

### After Migration - Run These Checks:

```sql
-- Check all tables exist with correct structure
SELECT table_name, 
       (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t 
WHERE table_schema = 'public' 
AND table_name IN (
    'user_profiles', 'user_consents', 'course_enrollments', 
    'user_lesson_progress', 'user_workbook_responses', 'courses'
)
ORDER BY table_name;

-- Check foreign key relationships are working
SELECT 
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name IN ('course_enrollments', 'user_profiles', 'user_lesson_progress');

-- Check RLS policies are active
SELECT tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('user_profiles', 'course_enrollments', 'user_lesson_progress')
ORDER BY tablename;

-- Verify sample data exists
SELECT slug, title, is_active FROM courses;
```

## 2. 🔐 ENVIRONMENT VARIABLES AUDIT

### Check Your .env.local File:

```bash
# Required Supabase Variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Required for Registration Email
NEXT_PUBLIC_SITE_URL=https://bloompsychologynorthaustin.com

# Optional but Recommended
SUPABASE_JWT_SECRET=your_jwt_secret
```

**❌ Missing any of these? Registration will fail!**

## 3. 🔌 API ENDPOINTS AUDIT

### Test These Endpoints Work:

1. **Registration Flow:**
   - `POST /api/course/register` ✅ Created
   - `POST /api/course/resend-verification` ✅ Created  

2. **Course Authentication:**
   - `POST /api/course-login` ✅ Exists (check if it needs updating)

3. **Admin System:**
   - `POST /api/admin/simple-login` ✅ Exists

### Check for Missing Endpoints:
- `GET /api/course/profile` (user profile management)
- `POST /api/course/progress` (save lesson progress)  
- `POST /api/course/workbook` (save workbook responses)

## 4. 📁 FILE STRUCTURE AUDIT

### Frontend Pages - Check These Exist:
- ✅ `/app/course/register/page.tsx`
- ✅ `/app/course/verify-email/page.tsx`  
- ✅ `/app/course/email-verified/page.tsx`
- ✅ `/app/my-courses/page.tsx`
- ✅ `/app/learn/[courseId]/page.tsx`

### Missing Pages That Might Be Needed:
- `/app/course/profile/page.tsx` (user profile management)
- `/app/course/dashboard/page.tsx` (course dashboard)
- `/app/course/forgot-password/page.tsx` (password reset)

## 5. 🔧 DEPENDENCIES AUDIT

### Check package.json for Required Packages:

```bash
# Run this to check if packages are installed
npm list | grep -E "(uuid|supabase|framer-motion)"
```

**Required for user system:**
- ✅ `uuid` (for ID generation)
- ✅ `@supabase/supabase-js` (database)
- ✅ `framer-motion` (animations)

## 6. 🛡️ SECURITY AUDIT

### Supabase Settings to Check:

1. **Auth Settings:**
   - Email confirmation required: ✅ YES
   - Auto-confirm users: ❌ NO (security risk)
   - Password policy: Strong (8+ chars)

2. **RLS (Row Level Security):**
   - All user tables have RLS enabled
   - Service role has full access
   - Users can only access their own data

3. **API Security:**
   - Using service role key for server operations
   - Using anon key for client operations
   - No secrets in client-side code

## 7. 🧪 TESTING CHECKLIST

### Manual Test Flow:
1. **Registration:**
   - [ ] Fill out registration form
   - [ ] Receive verification email
   - [ ] Click verification link
   - [ ] Redirected to success page

2. **Login:**
   - [ ] Go to `/my-courses`
   - [ ] Enter email/password
   - [ ] Successfully access course

3. **Course Progress:**
   - [ ] Mark lessons complete
   - [ ] Save workbook responses
   - [ ] Progress persists on reload

## 8. 🚨 COMMON GOTCHAS TO CHECK

### Database Issues:
- [ ] All foreign keys reference existing tables
- [ ] No circular dependencies in table creation
- [ ] Indexes exist on frequently queried columns

### Auth Issues:
- [ ] JWT secret matches between Supabase and app
- [ ] Email templates are configured in Supabase
- [ ] Redirect URLs are whitelisted in Supabase

### CORS Issues:
- [ ] Supabase allows your domain
- [ ] API routes return proper headers
- [ ] No mixed HTTP/HTTPS issues

## 9. 🩺 HEALTH CHECKS

### Run These Commands:

```bash
# Check build works
npm run build

# Check TypeScript compilation
npx tsc --noEmit

# Check for unused dependencies
npm audit

# Check for security vulnerabilities
npm audit --audit-level high
```

## 10. 📊 MONITORING SETUP

### Supabase Dashboard Checks:
- [ ] Monitor API usage
- [ ] Check error logs in Functions
- [ ] Monitor authentication events
- [ ] Check database performance metrics

---

## 🎯 PRIORITY ORDER:

1. **CRITICAL:** Database migration + environment variables
2. **HIGH:** Registration flow testing  
3. **MEDIUM:** Additional API endpoints
4. **LOW:** Monitoring and optimization

**Run the database audit first, then work through this checklist systematically! 🚀**