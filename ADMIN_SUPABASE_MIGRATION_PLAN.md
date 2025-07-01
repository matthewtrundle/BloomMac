# Bloom Psychology Admin Supabase Migration Plan

## Phase 1: Database Schema Creation

### 1.1 Contact Submissions Table

```sql
-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    service TEXT,
    message TEXT NOT NULL,
    source TEXT DEFAULT 'website',
    page TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
    replied_at TIMESTAMPTZ,
    replied_by UUID REFERENCES admin_users(id),
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX idx_contact_submissions_created ON contact_submissions(created_at DESC);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can view all contact submissions" ON contact_submissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Admins can update contact submissions" ON contact_submissions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid()
        )
    );

-- Trigger for updated_at
CREATE TRIGGER update_contact_submissions_updated_at 
    BEFORE UPDATE ON contact_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 1.2 Career Applications Table

```sql
-- Create career_applications table
CREATE TABLE IF NOT EXISTS career_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    position TEXT NOT NULL,
    experience TEXT,
    message TEXT,
    resume_url TEXT,
    resume_filename TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    availability TEXT,
    salary_expectations TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'interviewing', 'contacted', 'hired', 'rejected', 'archived')),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    notes TEXT,
    reviewed_by UUID REFERENCES admin_users(id),
    reviewed_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_career_applications_status ON career_applications(status);
CREATE INDEX idx_career_applications_position ON career_applications(position);
CREATE INDEX idx_career_applications_created ON career_applications(created_at DESC);

-- Enable RLS
ALTER TABLE career_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can submit career applications" ON career_applications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all career applications" ON career_applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Admins can update career applications" ON career_applications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid()
        )
    );

-- Trigger for updated_at
CREATE TRIGGER update_career_applications_updated_at 
    BEFORE UPDATE ON career_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 1.3 Analytics Events Table

```sql
-- Create analytics_events table
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL,
    event_category TEXT,
    event_action TEXT,
    event_label TEXT,
    event_value NUMERIC,
    page_url TEXT,
    page_title TEXT,
    referrer TEXT,
    user_agent TEXT,
    ip_address INET,
    user_id UUID REFERENCES auth.users(id),
    session_id TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    country TEXT,
    city TEXT,
    metadata JSONB DEFAULT '{}',
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for analytics queries
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_timestamp ON analytics_events(timestamp DESC);
CREATE INDEX idx_analytics_events_page ON analytics_events(page_url);
CREATE INDEX idx_analytics_events_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_session ON analytics_events(session_id);

-- Partitioning for performance (monthly partitions)
-- This is optional but recommended for high-volume analytics
CREATE TABLE analytics_events_2025_01 PARTITION OF analytics_events
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- Enable RLS
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can insert analytics events" ON analytics_events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all analytics" ON analytics_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid()
        )
    );
```

### 1.4 Admin Activity Log Table

```sql
-- Create admin_activity_log table
CREATE TABLE IF NOT EXISTS admin_activity_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_user_id UUID NOT NULL REFERENCES admin_users(id),
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    entity_name TEXT,
    old_values JSONB,
    new_values JSONB,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_admin_activity_admin ON admin_activity_log(admin_user_id);
CREATE INDEX idx_admin_activity_entity ON admin_activity_log(entity_type, entity_id);
CREATE INDEX idx_admin_activity_action ON admin_activity_log(action);
CREATE INDEX idx_admin_activity_created ON admin_activity_log(created_at DESC);

-- Enable RLS
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can view activity logs" ON admin_activity_log
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid()
        )
    );

-- Function to log admin activity
CREATE OR REPLACE FUNCTION log_admin_activity(
    p_action TEXT,
    p_entity_type TEXT DEFAULT NULL,
    p_entity_id TEXT DEFAULT NULL,
    p_entity_name TEXT DEFAULT NULL,
    p_old_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL,
    p_details JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    v_activity_id UUID;
BEGIN
    INSERT INTO admin_activity_log (
        admin_user_id, action, entity_type, entity_id, 
        entity_name, old_values, new_values, details
    ) VALUES (
        auth.uid(), p_action, p_entity_type, p_entity_id, 
        p_entity_name, p_old_values, p_new_values, p_details
    ) RETURNING id INTO v_activity_id;
    
    RETURN v_activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 1.5 Update Admin Users Table

```sql
-- Add missing columns to admin_users if needed
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS 
    permissions JSONB DEFAULT '{"blog": true, "newsletter": true, "contacts": true, "careers": true, "analytics": true}';

ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS 
    two_factor_enabled BOOLEAN DEFAULT false;

ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS 
    two_factor_secret TEXT;

ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS 
    profile_image TEXT;

ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS 
    phone TEXT;

-- Create function to check admin permissions
CREATE OR REPLACE FUNCTION check_admin_permission(
    p_permission TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_permissions JSONB;
BEGIN
    SELECT permissions INTO v_permissions
    FROM admin_users
    WHERE id = auth.uid();
    
    IF v_permissions IS NULL THEN
        RETURN FALSE;
    END IF;
    
    RETURN COALESCE((v_permissions->p_permission)::BOOLEAN, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Phase 2: API Implementation

### 2.1 Contact Management API

Create `/pages/api/admin/contacts.ts`:

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Auth handled by middleware
  const userId = req.headers['x-user-id'];
  const userEmail = req.headers['x-user-email'];
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      try {
        // Get all contacts with stats
        const { data: contacts, error } = await supabaseAdmin
          .from('contact_submissions')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Calculate stats
        const stats = {
          total: contacts.length,
          new: contacts.filter(c => c.status === 'new').length,
          replied: contacts.filter(c => c.status === 'replied').length,
          responseRate: contacts.length > 0 
            ? Math.round((contacts.filter(c => c.status === 'replied').length / contacts.length) * 100)
            : 0
        };
        
        // Log activity
        await supabaseAdmin.rpc('log_admin_activity', {
          p_action: 'view_contacts',
          p_details: { count: contacts.length }
        });
        
        return res.status(200).json({ contacts, stats });
      } catch (error) {
        console.error('Error fetching contacts:', error);
        return res.status(500).json({ error: 'Failed to fetch contacts' });
      }

    case 'POST':
      // Create new contact (for API submissions)
      try {
        const { data, error } = await supabaseAdmin
          .from('contact_submissions')
          .insert(req.body)
          .select()
          .single();
        
        if (error) throw error;
        
        // Send notification email to admin
        // TODO: Implement email notification
        
        return res.status(201).json(data);
      } catch (error) {
        console.error('Error creating contact:', error);
        return res.status(500).json({ error: 'Failed to create contact' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: 'Method not allowed' });
  }
}
```

Create `/pages/api/admin/contacts/[id].ts`:

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const userId = req.headers['x-user-id'];
  
  if (!userId || !id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  switch (req.method) {
    case 'PATCH':
      try {
        const { status, notes, ...otherUpdates } = req.body;
        
        // Get current contact for logging
        const { data: oldContact } = await supabaseAdmin
          .from('contact_submissions')
          .select('*')
          .eq('id', id)
          .single();
        
        // Update contact
        const updates: any = { ...otherUpdates, updated_at: new Date().toISOString() };
        
        if (status) {
          updates.status = status;
          if (status === 'replied') {
            updates.replied_at = new Date().toISOString();
            updates.replied_by = userId;
          }
        }
        
        if (notes !== undefined) {
          updates.notes = notes;
        }
        
        const { data, error } = await supabaseAdmin
          .from('contact_submissions')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        
        // Log activity
        await supabaseAdmin.rpc('log_admin_activity', {
          p_action: 'update_contact',
          p_entity_type: 'contact',
          p_entity_id: id,
          p_entity_name: data.name,
          p_old_values: oldContact,
          p_new_values: data
        });
        
        return res.status(200).json(data);
      } catch (error) {
        console.error('Error updating contact:', error);
        return res.status(500).json({ error: 'Failed to update contact' });
      }

    case 'DELETE':
      try {
        const { error } = await supabaseAdmin
          .from('contact_submissions')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        // Log activity
        await supabaseAdmin.rpc('log_admin_activity', {
          p_action: 'delete_contact',
          p_entity_type: 'contact',
          p_entity_id: id
        });
        
        return res.status(200).json({ success: true });
      } catch (error) {
        console.error('Error deleting contact:', error);
        return res.status(500).json({ error: 'Failed to delete contact' });
      }

    default:
      res.setHeader('Allow', ['PATCH', 'DELETE']);
      return res.status(405).json({ error: 'Method not allowed' });
  }
}
```

### 2.2 Analytics Tracking Implementation

Create `/pages/api/analytics/track.ts`:

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import { getClientIp } from '@/lib/utils';
import UAParser from 'ua-parser-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      event_type,
      event_category,
      event_action,
      event_label,
      event_value,
      page_url,
      page_title,
      session_id,
      user_id,
      metadata
    } = req.body;

    // Parse user agent
    const parser = new UAParser(req.headers['user-agent']);
    const ua = parser.getResult();

    // Get client IP
    const ip_address = getClientIp(req);

    // Insert event
    const { error } = await supabaseAdmin
      .from('analytics_events')
      .insert({
        event_type,
        event_category,
        event_action,
        event_label,
        event_value,
        page_url,
        page_title,
        referrer: req.headers.referer || null,
        user_agent: req.headers['user-agent'],
        ip_address,
        user_id,
        session_id,
        device_type: ua.device.type || 'desktop',
        browser: ua.browser.name,
        os: ua.os.name,
        metadata
      });

    if (error) throw error;

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return res.status(500).json({ error: 'Failed to track event' });
  }
}
```

## Phase 3: Frontend Updates

### 3.1 Update Middleware for Supabase Auth

Update `/middleware.ts`:

```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Check if user is admin
  if (session?.user) {
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (adminUser) {
      // Add admin info to headers
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('x-user-id', adminUser.id);
      requestHeaders.set('x-user-email', adminUser.email);
      requestHeaders.set('x-user-role', adminUser.role);
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }
  }

  // Redirect to login if not authenticated
  if (req.nextUrl.pathname.startsWith('/admin') && 
      !req.nextUrl.pathname.startsWith('/admin/login')) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/newsletter-admin', '/api/blog-admin-supabase']
};
```

### 3.2 Update Admin Login Page

Update `/app/admin/login/page.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Mail, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if user is admin
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

      if (adminError || !adminUser) {
        await supabase.auth.signOut();
        throw new Error('Not authorized as admin');
      }

      // Update last login
      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', adminUser.id);

      // Log activity
      await supabase.rpc('log_admin_activity', {
        p_action: 'admin_login',
        p_details: { email }
      });

      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-bloom-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-bloom-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <p className="text-gray-600 mt-2">Bloom Psychology Admin Panel</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloom-primary focus:border-transparent"
                  placeholder="admin@bloompsychology.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloom-primary focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-bloom-primary text-white py-2 px-4 rounded-lg hover:bg-bloom-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

## Phase 4: Migration Scripts

### 4.1 Create Initial Admin User

Create `/scripts/create-first-admin.js`:

```javascript
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createFirstAdmin() {
  const email = 'jana@bloompsychologynorthaustin.com';
  const password = 'ChangeMe123!'; // Change this immediately after first login
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    // Create auth user
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    
    if (authError) throw authError;
    
    // Create admin user record
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .insert({
        id: authUser.user.id,
        email,
        password: hashedPassword,
        name: 'Dr. Jana Rundle',
        role: 'super_admin',
        is_active: true,
        permissions: {
          blog: true,
          newsletter: true,
          contacts: true,
          careers: true,
          analytics: true,
          courses: true,
          email: true,
          settings: true
        }
      })
      .select()
      .single();
    
    if (adminError) throw adminError;
    
    console.log('Admin user created successfully:', adminUser);
    console.log('Initial password:', password);
    console.log('Please change this password immediately after first login!');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createFirstAdmin();
```

### 4.2 Run Migration

Create `/scripts/run-admin-migration.sh`:

```bash
#!/bin/bash

echo "Starting Bloom Psychology Admin Migration..."

# Step 1: Run database migrations
echo "Step 1: Creating database tables..."
npx supabase db push

# Step 2: Create first admin user
echo "Step 2: Creating initial admin user..."
node scripts/create-first-admin.js

# Step 3: Update environment variables
echo "Step 3: Update your .env.local file with:"
echo "NEXT_PUBLIC_SUPABASE_URL=your-supabase-url"
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key"
echo "SUPABASE_SERVICE_ROLE_KEY=your-service-key"

echo "Migration complete!"
```

## Phase 5: Testing Checklist

### Authentication Tests:
- [ ] Admin can log in with Supabase credentials
- [ ] Invalid credentials show error
- [ ] Session persists across page refreshes
- [ ] Logout clears session
- [ ] Protected routes redirect to login

### Contact Management Tests:
- [ ] View all contacts with proper stats
- [ ] Update contact status
- [ ] Add notes to contacts
- [ ] Export contacts to CSV
- [ ] Activity logged for all actions

### Career Applications Tests:
- [ ] Submit new application from public form
- [ ] View all applications in admin
- [ ] Update application status
- [ ] Download resumes
- [ ] Filter and search applications

### Analytics Tests:
- [ ] Events tracked from frontend
- [ ] Dashboard shows real data
- [ ] Date range filtering works
- [ ] Export analytics data
- [ ] Real-time updates

### Activity Log Tests:
- [ ] All admin actions logged
- [ ] Log entries show correct details
- [ ] Can filter by action type
- [ ] Can filter by date range
- [ ] Can search by entity

## Rollback Plan

If issues arise during migration:

1. **Database Rollback**:
   ```sql
   -- Remove new tables if needed
   DROP TABLE IF EXISTS contact_submissions CASCADE;
   DROP TABLE IF EXISTS career_applications CASCADE;
   DROP TABLE IF EXISTS analytics_events CASCADE;
   DROP TABLE IF EXISTS admin_activity_log CASCADE;
   ```

2. **Code Rollback**:
   - Revert middleware changes
   - Restore original login page
   - Remove new API endpoints

3. **Auth Rollback**:
   - Disable Supabase Auth
   - Re-enable JWT authentication
   - Restore original middleware

## Success Metrics

Migration is successful when:
1. All admin users can log in via Supabase
2. No mock data remains in the application
3. All admin actions are logged
4. Analytics show real user data
5. Contact forms save to database
6. Career applications work end-to-end
7. Email notifications function
8. No security vulnerabilities exist