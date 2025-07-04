# 🎯 Smart Deployment Strategy - Phase 1

## 🚀 The Plan: Archive & Replace

**Goal**: Replace old routes with secure versions WITHOUT having both active simultaneously.

## 📋 Pre-Deployment Checklist

### 1. Test Locally First
```bash
# Test critical paths with secure routes
npm run dev

# Test these specifically:
- Admin login flow
- Contact form submission  
- Newsletter signup
- Profile save
- Career application (with file upload)
```

### 2. Create Archive Plan
```bash
# See what will be archived
node scripts/archive_old_routes.js prepare

# Review the manifest at archived_routes/archive_manifest.json
```

### 3. Backup Database
```bash
# In Supabase dashboard, create a backup
# Or use Supabase CLI
supabase db dump > backup_$(date +%Y%m%d_%H%M%S).sql
```

## 🔄 Deployment Steps

### Step 1: Archive & Deploy (Local Test)
```bash
# Archive old routes and activate secure ones
node scripts/archive_old_routes.js archive

# Test everything locally
npm run dev

# If something breaks, restore immediately:
node scripts/archive_old_routes.js restore
```

### Step 2: Deploy to Staging (If Available)
```bash
# Commit the changes
git add -A
git commit -m "Deploy Phase 1 secure routes (archived originals)"

# Deploy to staging
git push staging main

# Test all critical paths on staging
```

### Step 3: Production Deployment
```bash
# If staging tests pass, deploy to production
git push origin main

# Or if using Vercel
vercel --prod
```

### Step 4: Monitor Closely
```bash
# Watch logs for errors
vercel logs --follow

# Check for:
- 401/403 errors (auth issues)
- 500 errors (code issues)
- Missing routes
```

## 🚨 Rollback Plan

If anything goes wrong:

### Option 1: Quick Restore (Recommended)
```bash
# Restore original routes from archive
node scripts/archive_old_routes.js restore

# Commit and deploy
git add -A
git commit -m "Rollback: Restore original routes"
git push origin main
```

### Option 2: Git Revert
```bash
# Revert the deployment commit
git revert HEAD
git push origin main
```

## 📊 Route Deployment Groups

### Group A: Low Risk (Deploy First)
These have minimal changes and clear data:
- ✅ Contact form routes
- ✅ Analytics tracking routes  
- ✅ Newsletter signup routes
- ✅ Profile save/update routes

### Group B: Medium Risk (Deploy Second)
These need careful testing:
- ⚠️ Admin auth routes (critical path)
- ⚠️ Admin management routes
- ⚠️ Newsletter admin routes

### Group C: High Risk (Deploy Last)
These have complex dependencies:
- 🔴 Career applications (file uploads)
- 🔴 Payment routes (Stripe webhooks)
- 🔴 Email analytics (multiple tables)
- 🔴 Calendly webhooks

## 🧪 Testing Script

Create a test script to verify routes after deployment:

```javascript
// scripts/test_deployed_routes.js
const tests = [
  {
    name: 'Admin Login',
    method: 'POST',
    url: '/api/admin/auth/login',
    body: { email: 'test@admin.com', password: 'test' }
  },
  {
    name: 'Contact Form',
    method: 'POST', 
    url: '/api/contact/submit',
    body: { name: 'Test', email: 'test@test.com', message: 'Test' }
  },
  // Add more tests...
];

// Run tests and report results
```

## 🎯 Success Criteria

After deployment, verify:

1. **No Dual Routes**: Check that `-secure` files are gone
   ```bash
   find . -name "*-secure.ts" -o -name "*-secure.js" | grep -E "(api|pages)"
   # Should return nothing
   ```

2. **Archive Exists**: Confirm backups are in place
   ```bash
   ls -la archived_routes/
   ```

3. **All Routes Working**: Run the test script
   ```bash
   node scripts/test_deployed_routes.js
   ```

4. **No Service Role in Logs**: Check application logs
   ```bash
   grep -i "service.role" vercel.log
   # Should find nothing
   ```

## 📝 Post-Deployment Tasks

1. **Update Documentation**: Note which routes were replaced
2. **Monitor for 24 hours**: Watch error rates
3. **Clean up archive**: After stable for 1 week
4. **Update frontend**: Remove any references to old routes

## ⚠️ Things to Remember

1. **DON'T delete archives immediately** - Keep for at least 1 week
2. **DON'T deploy all routes at once** - Use groups
3. **DON'T deploy on Friday** - Give yourself time to monitor
4. **DO test file uploads** - Career applications are critical
5. **DO keep monitoring** - First 24 hours are crucial

---

**Remember**: The archive script ensures we can always rollback quickly. Test thoroughly before each deployment step!