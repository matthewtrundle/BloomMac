# Fix Instructions for app/api/auth/signup/route.ts

## Fix Type: public

### Public Route Fix

1. This is a public endpoint (no auth required)
2. Use anonymous Supabase client
3. Add rate limiting and validation:

```typescript
import { createSupabaseRouteHandlerClient } from '@/lib/supabase-server';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = await rateLimit(...);
  
  const { supabase } = createSupabaseRouteHandlerClient(request);
  // No auth check needed for public routes
  // Process request...
}
```

## Current Service Role Usage:

Line 8: `process.env.SUPABASE_SERVICE_ROLE_KEY!`

## Testing:

1. Test with authenticated user
2. Test with unauthenticated request (should return 401)
3. Verify RLS policies are working
4. Check for any permission errors
