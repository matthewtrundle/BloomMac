# Quick Development Start (No Docker Required)

## Remote Development Setup

Since you're a solo developer, you can safely use your production Supabase for development. This avoids Docker complexity.

### 1. Use Development Environment File
```bash
# Copy development environment
cp .env.development .env.local

# Start development
npm run dev
```

### 2. Safety Rules for Remote Development

**DO:**
- ✅ Test with fake/test data
- ✅ Use test email addresses (test@example.com)
- ✅ Create test users for development
- ✅ Be careful with destructive operations

**DON'T:**
- ❌ Delete production data
- ❌ Run untested migrations
- ❌ Use real customer emails for testing
- ❌ Make schema changes without testing

### 3. Create Test Data in Production

Run this in Supabase SQL Editor to create safe test data:

```sql
-- Create a test user that's clearly marked
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
VALUES ('99999999-9999-9999-9999-999999999999', 'dev-test@bloom.local', crypt('devtest123', gen_salt('bf')), now())
ON CONFLICT (id) DO NOTHING;

-- Add to admin_users for testing
INSERT INTO admin_users (id, email, name, role, is_active)
VALUES ('99999999-9999-9999-9999-999999999999', 'dev-test@bloom.local', 'Dev Test User', 'admin', true)
ON CONFLICT (id) DO NOTHING;
```

### 4. Development Workflow

1. **Make code changes locally**
2. **Test with dev test user**
3. **Create migrations for schema changes**
4. **Test migrations in SQL editor first**
5. **Commit and deploy when ready**

### 5. When to Use Local Supabase

Use local Supabase (with Docker) when:
- Making risky schema changes
- Testing data deletion
- Onboarding new team members
- Running automated tests

For now, remote development is perfectly fine for:
- Building features
- Testing UI/UX
- API development
- Most daily work

### 6. Quick Commands

```bash
# Start development (using remote Supabase)
npm run dev

# View remote database
open https://supabase.com/dashboard/project/utetcmirepwdxbtrcczv/editor

# Check what environment you're using
grep SUPABASE_URL .env.local
```

This approach lets you start coding immediately without Docker!