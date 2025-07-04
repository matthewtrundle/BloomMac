# Fix Instructions for app/api/admin/auth/login/route.ts

## Fix Type: admin-auth

### Admin Auth Route Fix

1. This handles admin authentication
2. Needs special handling for admin login
3. Migrate to Supabase Auth:

```typescript
// Consider migrating admin auth to Supabase Auth with roles
// For now, use limited service client for admin verification only
```

## Current Service Role Usage:

Line 8: `process.env.SUPABASE_SERVICE_ROLE_KEY!`

## Testing:

1. Test with authenticated user
2. Test with unauthenticated request (should return 401)
3. Verify RLS policies are working
4. Check for any permission errors
