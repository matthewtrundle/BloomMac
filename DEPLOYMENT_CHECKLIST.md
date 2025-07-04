# 📋 Deployment Checklist - Phase 1 Security Fixes

## ✅ Completed Steps

1. ✅ Applied initial migration (`20250104_phase1_ONLY_MISSING_ITEMS.sql`)
2. ✅ Created auth mismatch fix (`20250104_fix_auth_mismatch.sql`)
3. ✅ Updated `checkUserRole` function in `lib/supabase-server.ts`

## 🔄 Next Steps

### 1. Apply Auth Fix Migration
Run in Supabase SQL Editor:
```sql
-- File: 20250104_fix_auth_mismatch.sql
```

### 2. Test Authentication
```bash
# Test admin login still works
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your-admin@email.com","password":"your-password"}'
```

### 3. Update Environment Variables
```env
# Required for production
NEXT_PUBLIC_SUPABASE_URL=         # ✅ Already set
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # ✅ Already set  
JWT_SECRET=                       # ✅ Already set
SUPABASE_SERVICE_ROLE_KEY=        # ✅ Already set (only for migrations)

# Email Service
RESEND_API_KEY=                   # ✅ Already set

# Remove these (no longer needed)
ADMIN_PASSWORD=                   # ❌ DELETE
ADMIN_API_KEY=                    # ❌ DELETE
NEXT_PUBLIC_ADMIN_API_KEY=        # ❌ DELETE
```

### 4. Deploy Strategy

#### Option A: Safe Gradual Deployment (RECOMMENDED)
1. Deploy new secure routes WITH `-secure` suffix
2. Keep old routes running
3. Test new routes thoroughly
4. Gradually switch frontend to new routes
5. Remove old routes after confirmation

#### Option B: Full Deployment (RISKY)
1. Replace all routes at once
2. Requires extensive testing
3. Higher risk of breaking production

### 5. Frontend Updates Needed

The frontend will need updates to handle new error responses:

```typescript
// Old error handling
if (res.status === 403) {
  // Handle forbidden
}

// New error handling  
if (res.status === 401) {
  // Not authenticated - redirect to login
} else if (res.status === 403) {
  // Authenticated but not authorized
}
```

## 🧪 Testing Checklist

### Admin Authentication
- [ ] Admin can login at `/admin/login`
- [ ] Admin session persists across page refreshes
- [ ] Admin can logout successfully
- [ ] Non-admin users cannot access admin panel

### API Routes
- [ ] `/api/admin/contacts` - View contact submissions
- [ ] `/api/admin/careers` - View career applications
- [ ] `/api/newsletter-admin` - Manage newsletters
- [ ] `/api/email-analytics` - View email stats
- [ ] `/api/contact` - Public contact form works
- [ ] `/api/subscribe` - Newsletter signup works

### Database Operations
- [ ] Analytics events are being tracked
- [ ] Contact forms save to database
- [ ] Newsletter signups work
- [ ] Admin activity is logged

## ⚠️ Known Issues to Monitor

1. **Duplicate Tables**: Still have both `admin_users` and `user_profiles`
2. **Email Tables**: Multiple email tracking systems exist
3. **Empty Tables**: Several tables with 0 rows (career_applications, etc.)

## 🚀 Deployment Commands

```bash
# 1. Test locally first
npm run dev

# 2. Build and test
npm run build
npm start

# 3. Deploy to production (example with Vercel)
vercel --prod

# 4. Monitor logs
vercel logs --follow
```

## 📊 Success Metrics

- ✅ Zero authentication errors in logs
- ✅ All admin functions working
- ✅ No increase in error rates
- ✅ Response times remain stable
- ✅ No service role keys in application logs

## 🔄 Rollback Plan

If issues occur:
1. Revert to previous deployment
2. Old routes still work (if using gradual deployment)
3. Database changes are backwards compatible
4. No data loss since changes are additive

---

**Remember**: The auth fix migration MUST be applied before deploying, or admin login will break!