# Fix Instructions for app/api/admin/careers/[id]/route.ts

## Fix Type: standard

### Standard Route Fix

1. Replace service role client with authenticated client
2. Add proper authentication check
3. Use RLS policies for data access

Replace:
```typescript
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

With:
```typescript
const { supabase, response } = createSupabaseRouteHandlerClient(request);
const user = await getAuthenticatedUser(supabase);

if (!user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

## Current Service Role Usage:

Line 6: `process.env.SUPABASE_SERVICE_ROLE_KEY!`

## Testing:

1. Test with authenticated user
2. Test with unauthenticated request (should return 401)
3. Verify RLS policies are working
4. Check for any permission errors
