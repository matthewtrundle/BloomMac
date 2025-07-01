# Comprehensive Backend Testing Plan - Supabase Migration

## Overview
This testing plan ensures all backend functionality is connected to Supabase and the old SQL database is no longer in use.

## 1. Database Connection Verification

### Test 1.1: Verify Supabase Connection
```bash
node scripts/test-supabase-connection.js
```
**Expected Result:**
- ✅ Successfully connects to Supabase
- ✅ Can perform basic CRUD operations
- ✅ No references to old SQL database

### Test 1.2: Check for Legacy Database References
```bash
# Search for old database connection strings
grep -r "mysql\|postgres\|mongodb" --include="*.ts" --include="*.js" --exclude-dir=node_modules
```
**Expected Result:**
- No active database connections except Supabase

## 2. Contact Form Testing

### Test 2.1: Submit Contact Form
**Manual Test:**
1. Go to https://bloompsychologynorthaustin.com/contact
2. Fill out form with test data:
   - Name: Test User
   - Email: test@example.com
   - Phone: 555-0123
   - Service: General Inquiry
   - Message: Test submission

**Verify:**
- ✅ Form submits successfully
- ✅ Data appears in Supabase `contact_submissions` table
- ✅ Email automation trigger created
- ✅ Rate limiting works (try 4 submissions within an hour)

### Test 2.2: Contact Form API
```bash
curl -X POST https://bloompsychologynorthaustin.com/api/contact/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API Test",
    "email": "apitest@example.com",
    "phone": "555-0124",
    "service": "consultation",
    "message": "Testing API submission"
  }'
```

## 3. Newsletter Signup Testing

### Test 3.1: Newsletter Subscription
**Manual Test:**
1. Find newsletter signup form on site
2. Enter test email: newsletter-test@example.com
3. Submit form

**Verify:**
- ✅ Subscriber added to Supabase `subscribers` table
- ✅ Welcome email sequence triggered
- ✅ No duplicate subscriptions allowed
- ✅ Rate limiting active (5 per hour)

### Test 3.2: Newsletter API
```bash
curl -X POST https://bloompsychologynorthaustin.com/api/newsletter-signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "api-newsletter@example.com",
    "firstName": "Test",
    "lastName": "Subscriber"
  }'
```

## 4. Career Application Testing

### Test 4.1: Submit Career Application
**Manual Test:**
1. Go to https://bloompsychologynorthaustin.com/careers
2. Select a position
3. Fill out application form
4. Upload test resume (PDF)

**Verify:**
- ✅ Application saved to Supabase `career_applications` table
- ✅ Resume uploaded to Supabase Storage
- ✅ Admin notification sent
- ✅ Rate limiting (2 per hour)

## 5. Email System Testing

### Test 5.1: Email Automation Cron Job
```bash
# Check if cron job is processing emails
node scripts/test-email-system.js
```

**Verify:**
- ✅ All environment variables configured
- ✅ Email sequences active
- ✅ No invalid email addresses
- ✅ Automation triggers processing

### Test 5.2: Manual Email Processing
```bash
# Manually trigger email automation
curl -X POST https://bloompsychologynorthaustin.com/api/process-email-automation \
  -H "Authorization: Bearer VERCEL_CRON_SECRET"
```

## 6. Course Purchase Flow (When Enabled)

### Test 6.1: Course Purchase
**Note:** Currently disabled, but when enabled:

1. Go to /courses
2. Select a course
3. Complete Stripe checkout
4. Verify:
   - ✅ Payment processed via Stripe
   - ✅ User created in Supabase Auth
   - ✅ Course access granted
   - ✅ Welcome email sent (no duplicates)
   - ✅ Can access course content

## 7. Admin System Testing

### Test 7.1: Admin Login
1. Go to /admin/login
2. Login with admin credentials
3. Verify:
   - ✅ JWT authentication works
   - ✅ Can access admin dashboard
   - ✅ Session persists correctly

### Test 7.2: Admin Functions
Test each admin section:
- ✅ View contact submissions
- ✅ Manage newsletter subscribers
- ✅ Review career applications
- ✅ All data from Supabase, not old DB

## 8. Data Migration Verification

### Test 8.1: Verify All Tables Exist
```bash
node scripts/verify-database-complete.js
```

**Critical Tables to Verify:**
- subscribers
- contact_submissions
- career_applications
- email_logs
- email_automation_triggers
- analytics_events
- admin_users
- user_profiles

### Test 8.2: Check Row Level Security
```sql
-- Run in Supabase SQL Editor
SELECT tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename;
```

## 9. Performance Testing

### Test 9.1: API Response Times
```bash
# Test contact form endpoint
time curl -X POST https://bloompsychologynorthaustin.com/api/contact/submit \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","message":"Test"}'
```

**Expected:** < 500ms response time

### Test 9.2: Database Query Performance
Monitor Supabase dashboard for:
- Query execution times
- Database size
- Connection pool usage

## 10. Security Testing

### Test 10.1: Rate Limiting
```bash
# Test rate limiting is working
for i in {1..5}; do
  curl -X POST https://bloompsychologynorthaustin.com/api/newsletter-signup \
    -H "Content-Type: application/json" \
    -d '{"email":"ratelimit@test.com"}'
  sleep 1
done
```

**Expected:** 429 error after limit reached

### Test 10.2: Authentication
- ✅ No hardcoded credentials
- ✅ JWT secrets properly configured
- ✅ Service role key not exposed
- ✅ RLS policies enforced

## Test Execution Checklist

- [ ] Database connections verified
- [ ] Contact form submissions working
- [ ] Newsletter signups functioning
- [ ] Career applications processing
- [ ] Email automation running
- [ ] Admin system operational
- [ ] Rate limiting active
- [ ] No references to old database
- [ ] All data in Supabase
- [ ] Performance acceptable
- [ ] Security measures in place

## Rollback Plan

If issues found:
1. Check error logs in Vercel/Supabase dashboards
2. Verify environment variables
3. Run database migration scripts if needed
4. Contact support if critical issues

## Success Criteria

✅ All tests pass
✅ No errors in production logs
✅ Users can complete all flows
✅ Admin can manage data
✅ Email delivery working
✅ No performance degradation
✅ Security measures active