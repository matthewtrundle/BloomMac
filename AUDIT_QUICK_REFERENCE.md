# BLOOM PLATFORM AUDIT - QUICK REFERENCE GUIDE
**For cross-context window reference**

## 🚨 CRITICAL ISSUES (Fix Immediately)

### 1. Hardcoded Admin Credentials
```
File: /lib/auth.ts:83-84
Email: jana@bloompsychologynorthaustin.com
Password: bloom-admin-2024
Fix: Move to environment variables NOW
```

### 2. Service Role Key Exposure
```
Pattern: supabaseAdmin with SUPABASE_SERVICE_ROLE_KEY
Files: 15+ API routes
Risk: Bypasses all security
Fix: Use user-context Supabase clients
```

### 3. Weak JWT Secret
```
File: /lib/auth.ts:11
Default: 'your-secret-key-change-this-in-production'
Fix: Generate cryptographically secure secret
```

## 📊 DATABASE ISSUES

### Missing Tables (Referenced but don't exist)
- `appointment_data` - Provider dashboard
- `blog_images` - Blog editor  
- `payment_intents` - Checkout flow
- `user_achievements` - Dashboard

### Conflicting Schemas
- `contact_submissions` - 3 different definitions
- `email_templates` - Multiple schemas
- `user_profiles` - Conflicting columns

### Key Relationships Missing
```sql
appointment_data.user_id → user_profiles.id (table missing)
blog_posts.author_id → user_profiles.id (no FK)
career_applications.user_id → user_profiles.id (no FK)
```

## 🔄 CONFLICTING SYSTEMS

### Three Authentication Systems
1. **Supabase Auth** - Regular users
2. **Custom JWT** - Admin panel
3. **Role Checks** - Provider dashboard

### Three Email Systems
1. **Resend API** - Transactional
2. **Email Automation** - Sequences
3. **Direct SMTP** - Legacy

### Three Course Systems
1. **Database** - Proper schema
2. **Static Files** - Markdown
3. **Components** - Hardcoded

### Three Dashboards
1. **User** - `/dashboard`
2. **Provider** - `/provider/dashboard`
3. **Admin** - `/admin`

## 📝 FORMS WITH ISSUES

| Form | Issue | Priority |
|------|-------|----------|
| Profile Edit | Uses service role - ANY user can edit ANY profile | CRITICAL |
| Contact Form | Creates 3+ records, can fail partially | HIGH |
| Career Application | Table might not exist | HIGH |
| Admin Login | Hardcoded credentials | CRITICAL |
| Resource Download | No backend implementation | MEDIUM |

## 🛠️ FIX PRIORITY ORDER

### Week 1 - Security
1. Remove hardcoded credentials
2. Rotate all secrets
3. Remove service role from APIs
4. Consolidate to Supabase auth

### Week 2-3 - Database
1. Create canonical schema
2. Add missing tables
3. Fix foreign keys
4. Add cascade deletes

### Week 4-6 - Systems
1. Unify email system
2. Consolidate course content
3. Merge dashboards

### Week 7-12 - Enhancement
1. Add input validation
2. Implement rate limiting
3. Add audit logging
4. HIPAA compliance

## 📁 KEY FILE LOCATIONS

### Security Issues
```
/lib/auth.ts - Hardcoded credentials
/app/api/profile/update/route.ts - Service role abuse
/app/api/contact/submit/route.ts - Service role abuse
/middleware.ts - Incomplete protection
```

### Database Schemas
```
/supabase/schema.sql - Original
/supabase/complete-user-course-schema.sql - Comprehensive
/supabase/migrations/*.sql - Incremental updates
```

### Problem Areas
```
/app/provider/* - Uses non-existent tables
/components/admin/* - Weak authentication
/app/api/admin/* - Service role everywhere
```

## 🔢 BY THE NUMBERS

- **Total Tables**: 44+
- **Security Issues**: 12 critical, 18 high
- **Forms**: 14 total, 6 broken/insecure
- **API Endpoints**: 35+, 15 use service role
- **Dev Hours Needed**: 440-560
- **Timeline**: 12 weeks

## 🎯 SUCCESS CRITERIA

### Security
- [ ] No hardcoded credentials
- [ ] No service role in client routes
- [ ] Single auth system
- [ ] All endpoints protected

### Database
- [ ] All forms have matching tables
- [ ] Foreign keys enforced
- [ ] No orphaned records
- [ ] Consistent schemas

### Systems
- [ ] One email system
- [ ] One course system
- [ ] One dashboard
- [ ] Unified role management

## 🚀 QUICK WINS (Do Today)

1. **Change admin password** in production
2. **Rotate JWT secret** 
3. **Disable test endpoints**
4. **Add rate limiting** to login
5. **Backup database** before changes

## 📞 WHEN TO ESCALATE

Escalate immediately if you find:
- Unauthorized access in logs
- Data inconsistencies
- Security breaches
- Production failures
- HIPAA violations

## 🔗 RELATED DOCUMENTS

- `COMPREHENSIVE_PLATFORM_AUDIT_2025.md` - Full audit details
- `BLOOM-DATABASE-SCHEMA.md` - Database documentation
- `SECURITY_FIXES_REQUIRED.md` - Security checklist
- `MIGRATION_PLAN_*.sql` - Migration scripts

---

**Remember**: Fix security issues FIRST, then data integrity, then optimization.