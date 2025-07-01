# Quick Test Reference Guide

## 🚀 Quick Start Testing Commands

### 1. Test Database Connection
```bash
node scripts/test-supabase-connection.js
```

### 2. Test Email System
```bash
node scripts/test-email-system.js
```

### 3. Test Contact Form
```bash
curl -X POST http://localhost:3000/api/contact/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Test message"
  }'
```

### 4. Check for Old Database References
```bash
grep -r "mysql\|mongodb" --include="*.ts" --include="*.js" --exclude-dir=node_modules
```

## 📱 User Flow URLs

### Public Pages
- Homepage: https://bloompsychologynorthaustin.com
- Courses: https://bloompsychologynorthaustin.com/courses
- Contact: https://bloompsychologynorthaustin.com/contact
- Book Appointment: https://bloompsychologynorthaustin.com/book

### Auth Flow
- Sign Up: https://bloompsychologynorthaustin.com/auth/signup
- Login: https://bloompsychologynorthaustin.com/auth/login
- Forgot Password: https://bloompsychologynorthaustin.com/auth/forgot-password

### User Dashboard
- Dashboard: https://bloompsychologynorthaustin.com/dashboard
- Profile: https://bloompsychologynorthaustin.com/profile
- Appointments: https://bloompsychologynorthaustin.com/appointments
- Settings: https://bloompsychologynorthaustin.com/settings

### Admin Panel
- Admin Login: https://bloompsychologynorthaustin.com/admin/login
- Admin Dashboard: https://bloompsychologynorthaustin.com/admin

## 🧪 Test Credentials

### Test User
```
Email: testuser@example.com
Password: TestPass123!
```

### Test Payment Card (Stripe)
```
Number: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

## ✅ Critical Tests Checklist

### Before Going Live:
- [ ] Contact form submits to Supabase
- [ ] Newsletter signup works with rate limiting
- [ ] Admin can login and view data
- [ ] Email automation is running
- [ ] No hardcoded credentials
- [ ] User can complete full onboarding
- [ ] Appointments can be booked
- [ ] Payments process correctly
- [ ] All pages load without errors
- [ ] Mobile experience is smooth

## 🔍 Database Verification

### Check Critical Tables:
```sql
-- Run in Supabase SQL Editor
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

### Expected Tables:
- admin_users ✓
- appointment_payments ✓
- appointment_types ✓
- appointments ✓
- career_applications ✓
- contact_submissions ✓
- email_logs ✓
- newsletters ✓
- payment_methods ✓
- subscribers ✓
- user_achievements ✓
- user_notifications ✓
- user_profiles ✓

## 🚨 Common Issues & Fixes

### "Rate limit exceeded"
- Wait 1 hour for contact form (3 attempts allowed)
- Wait 1 hour for newsletter (5 attempts allowed)

### "Email not sending"
1. Check RESEND_API_KEY in environment
2. Verify email automation cron is running
3. Check email_logs table for errors

### "Can't login"
1. Verify email is confirmed
2. Check user exists in Supabase Auth
3. Clear browser cache/cookies

### "Database error"
1. Check Supabase service is running
2. Verify environment variables set
3. Check RLS policies

## 📊 Monitoring Commands

### Check Recent Signups
```sql
SELECT email, created_at FROM auth.users 
ORDER BY created_at DESC 
LIMIT 10;
```

### Check Email Queue
```sql
SELECT * FROM email_automation_triggers 
WHERE processed_at IS NULL 
ORDER BY triggered_at;
```

### Check Recent Errors
```sql
SELECT * FROM email_logs 
WHERE status = 'failed' 
AND created_at > NOW() - INTERVAL '24 hours';
```

## 🎯 Quick Wins

1. **Test Contact Form**: Takes 30 seconds, verifies database connection
2. **Check Email System**: Run test script, confirms automation working
3. **Try User Signup**: Full flow test in 5 minutes
4. **Admin Login**: Verify admin panel access

Remember: Always test in incognito/private browsing for clean sessions!