# Production Testing Guide

## 🎯 What We're Testing

Based on the refactoring work completed, we need to verify:

1. **Email Automation** - Newsletter & contact form triggers work
2. **Unified User Model** - No more separate admin_users table
3. **Provider Dashboard** - New features are accessible
4. **Database Functions** - Performance optimizations work
5. **Authentication Flow** - Login/signup works correctly

## 🚀 Quick Start Testing

### 1. Test Local Environment First

```bash
# Setup test data
npm run test:setup

# Run critical flow tests
npm run test:e2e -- tests/e2e/production-critical-flows.spec.ts --project=chromium

# Run with UI to see what's happening
npm run test:e2e:ui -- tests/e2e/production-critical-flows.spec.ts
```

### 2. Manual Testing Checklist

#### ✅ Email Automation
1. Go to homepage
2. Sign up for newsletter with test email
3. Check database: `SELECT * FROM sequence_enrollments ORDER BY created_at DESC LIMIT 5;`
4. Verify enrollment created with `newsletter_signup` trigger

#### ✅ Contact Form
1. Go to /contact
2. Submit contact form
3. Check database for new enrollment with `contact_form` trigger

#### ✅ User Authentication
1. Sign up new user at /auth/signup
2. Verify redirected to dashboard
3. Check user_profiles table has entry (NO email column)
4. Verify role is set correctly

#### ✅ Provider Features
1. Login as provider: testprovider@example.com / password
2. Go to /provider/dashboard
3. Check /provider/profile works
4. Try editing profile at /provider/profile/edit

## 🔍 Database Verification

Run these queries to verify the refactoring:

```sql
-- Check unified user model
SELECT COUNT(*) FROM user_profiles WHERE role IS NOT NULL;

-- Verify no admin_users table
SELECT tablename FROM pg_tables WHERE tablename = 'admin_users';

-- Check email sequences
SELECT name, trigger, status FROM email_sequences WHERE status = 'active';

-- Check recent enrollments
SELECT 
  s.email,
  es.name as sequence_name,
  se.status,
  se.created_at
FROM sequence_enrollments se
JOIN subscribers s ON se.subscriber_id = s.id
JOIN email_sequences es ON se.sequence_id = es.id
ORDER BY se.created_at DESC
LIMIT 10;
```

## 🚨 Common Issues & Solutions

### Issue: Tests timeout on login
**Solution**: Check if auth redirect is working. May need to wait for navigation:
```javascript
await page.waitForURL('/dashboard', { timeout: 10000 });
```

### Issue: Email automation not triggering
**Solution**: Check if cron job is running:
```bash
# Manually trigger email processor
curl -X POST http://localhost:3003/api/cron/process-email-sequences \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Issue: Provider dashboard empty
**Solution**: Create test data:
```sql
-- Add test appointments, clients, etc.
INSERT INTO appointments (provider_id, client_id, ...)
VALUES ('provider-uuid', 'client-uuid', ...);
```

## 📊 Production Smoke Tests

These can run against live site without creating data:

```bash
# Run read-only smoke tests
npm run test:e2e -- tests/e2e/production-critical-flows.spec.ts \
  --grep "Production Smoke Tests" \
  --project=chromium
```

## 🎬 Next Steps

1. **Fix any failing tests** - Update selectors to match your actual UI
2. **Add more test cases** - Based on your specific features
3. **Set up CI/CD** - Run tests automatically on deploy
4. **Monitor production** - Set up error tracking

## 💡 Tips for Testing

- Use `data-testid` attributes for reliable selectors
- Run tests in headed mode first to see what's happening
- Check browser console for errors
- Use Playwright's trace viewer for debugging
- Keep test data separate from production

Remember: These tests verify the DATABASE and API work you've done, not just UI!