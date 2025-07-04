# PHASE 1: AUTHENTICATION CONSOLIDATION PLAN (Day 5-7)

## Overview
Consolidate three separate authentication systems into a single Supabase Auth system with proper role management.

## Current State (3 Auth Systems)
1. **Supabase Auth** - Regular users
2. **Custom JWT** - Admin panel
3. **Role Checks** - Provider dashboard

## Target State (1 Unified System)
- **Supabase Auth** with custom claims for all users
- Role-based access control (RBAC)
- Unified session management
- Consistent authorization patterns

## Step-by-Step Migration Plan

### Day 5: Prepare Supabase for Admin Users

#### 1. Create Admin Role Management
```sql
-- Add role support to user_profiles if not exists
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user' 
CHECK (role IN ('user', 'provider', 'admin', 'super_admin'));

-- Create index for role queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Create admin audit trail if not exists
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id VARCHAR(100),
  metadata JSONB DEFAULT '{}',
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create RLS policies for admin access
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update user profiles" ON user_profiles
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE role = 'super_admin'
    )
  );
```

#### 2. Migrate Admin Users to Supabase Auth
```javascript
// Script: migrate-admins-to-supabase.js
const { createClient } = require('@supabase/supabase-js');

async function migrateAdmins() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  // Get all admin users from old table
  const { data: oldAdmins } = await supabase
    .from('admin_users')
    .select('*');
    
  for (const admin of oldAdmins) {
    // Create Supabase auth user
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: admin.email,
      password: generateSecurePassword(), // Send via secure channel
      email_confirm: true
    });
    
    if (!authError && authUser) {
      // Create user profile with admin role
      await supabase
        .from('user_profiles')
        .insert({
          id: authUser.user.id,
          email: admin.email,
          first_name: admin.name.split(' ')[0],
          last_name: admin.name.split(' ').slice(1).join(' '),
          role: admin.role === 'super_admin' ? 'super_admin' : 'admin',
          created_at: admin.created_at
        });
        
      console.log(`Migrated admin: ${admin.email}`);
    }
  }
  
  // Disable old admin_users table
  await supabase.rpc('disable_table_access', { table_name: 'admin_users' });
}
```

### Day 6: Update Middleware and Components

#### 1. New Unified Middleware
```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  // Public routes that don't need auth
  const publicRoutes = ['/auth/login', '/auth/signup', '/api/contact', '/api/careers'];
  const isPublicRoute = publicRoutes.some(route => req.nextUrl.pathname.startsWith(route));
  
  if (isPublicRoute) {
    return res;
  }
  
  // Check authentication
  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
  
  // Check admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();
      
    if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }
  
  // Check provider routes
  if (req.nextUrl.pathname.startsWith('/provider')) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();
      
    if (!profile || !['provider', 'admin', 'super_admin'].includes(profile.role)) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }
  
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

#### 2. Update AuthContext
```typescript
// contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  isProvider: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isAdmin: false,
  isProvider: false,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });
    
    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    setProfile(data);
  };
  
  const value = {
    user,
    profile,
    isAdmin: profile?.role === 'admin' || profile?.role === 'super_admin',
    isProvider: profile?.role === 'provider' || profile?.role === 'admin' || profile?.role === 'super_admin',
    loading,
    signIn: async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },
    signOut: async () => {
      await supabase.auth.signOut();
    },
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### Day 7: Testing and Cleanup

#### 1. Test Checklist
- [ ] Regular user login/signup
- [ ] Admin login with new system
- [ ] Provider access to dashboard
- [ ] All API endpoints with new auth
- [ ] Role-based UI elements
- [ ] Session persistence
- [ ] Logout functionality
- [ ] Password reset flow

#### 2. Cleanup Tasks
```bash
# Remove old auth files
rm lib/auth.ts.old
rm -rf app/api/admin/auth/  # After confirming new auth works

# Remove old migrations
rm scripts/migrate-admin-auth.js.old

# Update environment variables
# Remove: JWT_SECRET, ADMIN_PASSWORD_HASH
# Keep: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
```

#### 3. Database Cleanup
```sql
-- After confirming migration success
DROP TABLE IF EXISTS admin_users;
DROP TABLE IF EXISTS admin_sessions;

-- Remove old JWT tokens
DELETE FROM storage.objects WHERE bucket_id = 'admin-tokens';
```

## Rollback Plan

If issues arise:

1. **Immediate Rollback**
   ```bash
   git checkout main
   npm run build
   npm run deploy
   ```

2. **Database Rollback**
   ```sql
   -- Re-enable admin_users table
   ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
   
   -- Restore admin user access
   UPDATE user_profiles SET role = 'user' 
   WHERE role IN ('admin', 'super_admin') 
   AND created_at > '2024-01-04';
   ```

3. **Environment Rollback**
   - Restore JWT_SECRET
   - Restore admin middleware
   - Redeploy previous version

## Success Metrics

- Zero authentication failures
- All admin functions working
- No unauthorized access
- Session management stable
- Performance unchanged

## Final Validation

Before marking Phase 1 complete:

1. All hardcoded credentials removed ✓
2. All API routes use proper auth ✓
3. Single authentication system ✓
4. Role-based access working ✓
5. Audit logging functional ✓
6. Security scan passing ✓

---

**Note**: Keep the old admin_users table for 30 days as backup before final deletion.