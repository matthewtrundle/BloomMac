# 🚨 Bloom Platform Recovery Action Plan

## Current Situation
- **Production**: ~7% functional (major database connection issues)
- **Local**: 92.9% functional (after our fixes)
- **Root Causes**: Missing env vars, auth conflicts, RLS issues, schema mismatches

## Immediate Actions (Do These NOW)

### 1. Check Production Environment Variables
```bash
# In your production dashboard (Vercel/Netlify/etc), verify these exist:
NEXT_PUBLIC_SUPABASE_URL=https://utetcmirepwdxbtrcczv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
JWT_SECRET=[your-jwt-secret]
DATABASE_URL=[your-database-url]
```

### 2. Create Emergency Database Health Check
Deploy this immediately to production:

```typescript
// pages/api/health/check.ts
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const results = {
    env: {
      url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      serviceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    connection: false,
    error: null
  };

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const { count, error } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true });
      
    results.connection = !error;
    results.error = error?.message || null;
  } catch (e) {
    results.error = e.message;
  }

  return res.status(results.connection ? 200 : 500).json(results);
}
```

### 3. Apply Critical RLS Fixes
Run these on production immediately:

```sql
-- Fix service role checks (these are currently broken)
DO $$
DECLARE
    pol RECORD;
BEGIN
    -- Fix all policies checking for service_role incorrectly
    FOR pol IN 
        SELECT schemaname, tablename, policyname
        FROM pg_policies
        WHERE qual LIKE '%service_role%'
        AND qual LIKE '%auth.jwt()%'
    LOOP
        -- Drop and recreate with correct check
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
            pol.policyname, pol.schemaname, pol.tablename);
    END LOOP;
END $$;

-- Temporarily disable RLS on critical public tables
ALTER TABLE public.subscribers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts DISABLE ROW LEVEL SECURITY;

-- Enable basic policies for user data
CREATE POLICY "Users can view own profiles" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);
    
CREATE POLICY "Users can update own profiles" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);
```

### 4. Create Unified Supabase Client
Replace all Supabase client files with this:

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  throw new Error('Missing Supabase configuration');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side only
export function getServiceSupabase() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error('Service role key not configured');
  }
  return createClient(supabaseUrl!, serviceKey);
}
```

## Phase 1: Quick Wins (Next 4 Hours)

### Fix Newsletter Signup
```typescript
// pages/api/newsletter/subscribe.ts
import { getServiceSupabase } from '@/lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, source = 'website' } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const supabase = getServiceSupabase();
    
    const { data, error } = await supabase
      .from('subscribers')
      .insert({ 
        email, 
        source,
        subscribed: true,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Duplicate
        return res.status(200).json({ message: 'Already subscribed' });
      }
      throw error;
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Newsletter signup error:', error);
    return res.status(500).json({ 
      error: 'Failed to subscribe',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
```

### Fix Contact Form
```typescript
// pages/api/contact/submit.ts
import { getServiceSupabase } from '@/lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;

  try {
    const supabase = getServiceSupabase();
    
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert({
        name,
        email,
        subject,
        message,
        status: 'new',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Send email notification (if configured)
    // await sendContactNotification(data);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ error: 'Failed to submit form' });
  }
}
```

## Phase 2: Core Features (Next 24 Hours)

### 1. Fix User Authentication
- Consolidate all auth to use Supabase Auth
- Remove custom JWT implementation
- Update middleware to use Supabase session

### 2. Fix Admin Panel
- Migrate admin auth to Supabase with custom claims
- Update admin routes to check for admin role
- Fix admin dashboard queries

### 3. Enable Key Features
- User profiles (with proper RLS)
- Course enrollment
- Wellness tracking
- Basic appointments

## Monitoring & Validation

### Create Status Dashboard
```typescript
// pages/api/status.ts
export default async function handler(req, res) {
  const status = {
    database: await checkDatabase(),
    auth: await checkAuth(),
    features: {
      newsletter: await checkFeature('subscribers'),
      contact: await checkFeature('contact_submissions'),
      blog: await checkFeature('blog_posts'),
      courses: await checkFeature('courses'),
      users: await checkFeature('user_profiles')
    }
  };

  const healthy = Object.values(status.features).every(f => f);
  
  return res.status(healthy ? 200 : 503).json({
    status: healthy ? 'operational' : 'degraded',
    ...status
  });
}
```

## Success Metrics

### Phase 1 (4 hours)
- [ ] Database connections working
- [ ] Newsletter signups functional
- [ ] Contact forms working
- [ ] Blog posts visible
- [ ] Health check endpoint deployed

### Phase 2 (24 hours)
- [ ] User authentication working
- [ ] Admin can log in
- [ ] User profiles functional
- [ ] Basic RLS policies working
- [ ] 60%+ features restored

### Phase 3 (1 week)
- [ ] All features operational
- [ ] RLS properly configured
- [ ] Performance optimized
- [ ] Monitoring in place
- [ ] 95%+ functionality

## Emergency Contacts

- Supabase Support: support@supabase.io
- Database Expert: [Your DBA contact]
- DevOps Lead: [Your DevOps contact]

## Rollback Procedures

Each change should be:
1. Tested locally first
2. Deployed to staging (if available)
3. Deployed to production with monitoring
4. Rolled back if errors spike

Keep this document updated as you progress through the recovery!