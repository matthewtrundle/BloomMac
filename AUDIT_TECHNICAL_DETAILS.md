# BLOOM PLATFORM - TECHNICAL AUDIT DETAILS
**Companion to COMPREHENSIVE_PLATFORM_AUDIT_2025.md**

## DETAILED CODE EXAMPLES & PATTERNS

### 🚨 SECURITY VULNERABILITIES - CODE EXAMPLES

#### 1. Service Role Abuse Pattern
```typescript
// ❌ BAD - Found in 15+ files
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Bypasses ALL security
);

// User can update ANY profile
const { error } = await supabaseAdmin
  .from('user_profiles')
  .update(data)
  .eq('id', anyUserId); // No verification!

// ✅ GOOD - Proper pattern
const supabase = createRouteHandlerClient({ cookies });
const { data: { user } } = await supabase.auth.getUser();

// Only update own profile
const { error } = await supabase
  .from('user_profiles')
  .update(data)
  .eq('id', user.id); // RLS enforced
```

#### 2. SQL Injection Vulnerabilities
```typescript
// ❌ BAD - Direct concatenation
const searchTerm = request.query.search;
const query = `SELECT * FROM posts WHERE title LIKE '%${searchTerm}%'`;

// ✅ GOOD - Parameterized
const { data } = await supabase
  .from('posts')
  .select('*')
  .ilike('title', `%${searchTerm}%`);
```

#### 3. Missing Input Validation
```typescript
// ❌ BAD - No validation
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, name, phone } = body; // Trust user input?
  
  // ✅ GOOD - Proper validation
  const schema = z.object({
    email: z.string().email().max(255),
    name: z.string().min(1).max(100).regex(/^[a-zA-Z\s'-]+$/),
    phone: z.string().regex(/^\+?[\d\s()-]+$/).optional()
  });
  
  try {
    const validated = schema.parse(body);
    // Process validated data
  } catch (error) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
}
```

### 📊 DATABASE SCHEMA CONFLICTS

#### User Profiles Table Variations
```sql
-- Version 1 (schema.sql)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Version 2 (complete-user-course-schema.sql)
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL, -- Now required
  last_name VARCHAR(100) NOT NULL,  -- Now required
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'student',
  postpartum_date DATE,
  -- 15+ more fields...
);

-- Version 3 (migrations)
ALTER TABLE user_profiles 
ADD COLUMN email VARCHAR(255), -- Duplicates auth.users!
ADD COLUMN total_stars INTEGER DEFAULT 0;
```

#### Missing Table Examples
```typescript
// Code expects this table
const { data } = await supabase
  .from('appointment_data')
  .select(`
    *,
    user_profiles (first_name, last_name, phone)
  `)
  .eq('provider_id', providerId);

// But table doesn't exist in any schema!
// Should be:
CREATE TABLE appointment_data (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id),
  provider_id UUID REFERENCES user_profiles(id),
  appointment_date TIMESTAMPTZ NOT NULL,
  appointment_type VARCHAR(50),
  status VARCHAR(20) DEFAULT 'scheduled',
  payment_status VARCHAR(20) DEFAULT 'pending',
  no_show_fee_charged BOOLEAN DEFAULT FALSE,
  reminder_sent BOOLEAN DEFAULT FALSE,
  confirmation_received BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 🔄 SYSTEM CONFLICTS - DETAILED EXAMPLES

#### Authentication Confusion
```typescript
// File 1: Uses Supabase auth
const { user } = useAuth(); // AuthContext
if (!user) redirect('/auth/login');

// File 2: Uses admin JWT
const token = cookies().get('adminToken');
const payload = await verifyJWT(token);
if (!payload) redirect('/admin/login');

// File 3: Checks role in database
const { data: profile } = await supabase
  .from('user_profiles')
  .select('role')
  .eq('id', user.id)
  .single();
if (profile.role !== 'provider') throw new Error('Unauthorized');

// Result: 3 different auth patterns in same app!
```

#### Email System Chaos
```typescript
// System 1: Resend API
import { sendEmail } from '@/lib/resend-client';
await sendEmail({
  to: email,
  subject: 'Welcome',
  html: '<p>Welcome!</p>'
});

// System 2: Email Queue
await supabase.from('email_queue').insert({
  recipient_email: email,
  subject: 'Welcome',
  html_content: '<p>Welcome!</p>',
  scheduled_for: new Date()
});

// System 3: Direct SMTP (legacy)
const transporter = nodemailer.createTransport({...});
await transporter.sendMail({
  to: email,
  subject: 'Welcome',
  html: '<p>Welcome!</p>'
});
```

### 🛠️ API ENDPOINT PATTERNS

#### Unprotected Endpoints
```typescript
// ❌ BAD - No authentication
export async function POST(request: NextRequest) {
  const { message } = await request.json();
  // Process without checking user...
}

// ✅ GOOD - Proper protection
export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Check additional permissions if needed
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single();
    
  if (profile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // Process request...
}
```

#### Rate Limiting Implementation
```typescript
// Current implementation (good example)
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const identifier = request.headers.get('x-forwarded-for') || 'anonymous';
  const rateLimitResult = await rateLimit(RATE_LIMITS.contact, identifier);
  
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { 
        status: 429,
        headers: {
          'Retry-After': Math.ceil((rateLimitResult.reset.getTime() - Date.now()) / 1000).toString()
        }
      }
    );
  }
  
  // Process request...
}
```

### 📝 FORM PROCESSING ISSUES

#### Contact Form Overengineering
```typescript
// Current flow - too many operations
export async function POST(request: NextRequest) {
  const { name, email, message } = await request.json();
  
  // 1. Insert contact submission
  await supabase.from('contact_submissions').insert({...});
  
  // 2. Upsert subscriber (why?)
  await supabase.from('subscribers').upsert({...});
  
  // 3. Create automation trigger
  await supabase.from('email_automation_triggers').insert({...});
  
  // 4. Send admin notification
  await sendEmail({ to: 'jana@...', ... });
  
  // 5. Send user confirmation
  await sendEmail({ to: email, ... });
  
  // 6. Track analytics
  await supabase.from('analytics_events').insert({...});
  
  // Problem: Any failure leaves partial data!
}

// Better approach
export async function POST(request: NextRequest) {
  const { name, email, message } = await request.json();
  
  // Use transaction
  const { error } = await supabase.rpc('process_contact_form', {
    p_name: name,
    p_email: email,
    p_message: message
  });
  
  if (error) {
    // Everything rolled back
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
  
  // Queue emails separately (can retry)
  await queueEmail('contact_notification', { name, email, message });
  await queueEmail('contact_confirmation', { name, email });
  
  return NextResponse.json({ success: true });
}
```

### 🔍 PROVIDER DASHBOARD ISSUES

#### Missing Table Reference
```typescript
// Provider dashboard expects this
interface ProviderAppointment {
  id: string;
  user_id: string;
  appointment_date: string;
  appointment_type: string;
  status: string;
  payment_status: string;
  no_show_fee_charged: boolean;
  reminder_sent: boolean;
  confirmation_received: boolean;
  user_profiles: {
    first_name: string;
    last_name: string;
    phone: string;
  };
}

// But queries non-existent table
const { data } = await supabase
  .from('appointment_data') // This table doesn't exist!
  .select(`
    *,
    user_profiles (
      first_name,
      last_name,
      phone
    )
  `);
```

### 🏗️ MIGRATION STRATEGY

#### Phase 1: Security Migration
```bash
# 1. Update environment variables
NEXT_PUBLIC_SUPABASE_URL=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx # Remove from client code
JWT_SECRET=$(openssl rand -base64 32)
ADMIN_EMAIL=secure@email.com
ADMIN_PASSWORD=$(openssl rand -base64 16)

# 2. Update auth flow
# Before: Custom JWT
# After: Supabase with custom claims
```

#### Phase 2: Database Migration
```sql
-- Step 1: Create canonical schema
CREATE SCHEMA bloom_v2;

-- Step 2: Create all tables with proper structure
CREATE TABLE bloom_v2.user_profiles AS 
SELECT DISTINCT ON (id) * FROM public.user_profiles
ORDER BY id, updated_at DESC;

-- Step 3: Add missing tables
CREATE TABLE bloom_v2.appointment_data (...);

-- Step 4: Migrate data with validation
INSERT INTO bloom_v2.appointment_data
SELECT * FROM legacy_appointments
WHERE user_id IN (SELECT id FROM bloom_v2.user_profiles);

-- Step 5: Add constraints after data is clean
ALTER TABLE bloom_v2.appointment_data
ADD CONSTRAINT fk_user FOREIGN KEY (user_id) 
REFERENCES bloom_v2.user_profiles(id) ON DELETE CASCADE;
```

### 🔧 PERFORMANCE OPTIMIZATIONS

#### Current Issues
```typescript
// N+1 Query Problem
const users = await getUsers();
for (const user of users) {
  const progress = await getCourseProgress(user.id); // N queries!
}

// Missing Indexes
SELECT * FROM user_lesson_progress 
WHERE user_id = $1 AND course_id = $2; // No index!

// Large Payload
return NextResponse.json({
  user: fullUserObject, // 50+ fields
  courses: allCourses,  // All course data
  workbooks: allWorkbooks // All workbook data
}); // 500KB+ response!
```

#### Optimized Patterns
```typescript
// Batch Query
const progress = await supabase
  .from('user_lesson_progress')
  .select(`
    *,
    user:user_id (first_name, last_name),
    course:course_id (title, slug)
  `)
  .in('user_id', userIds);

// Add Index
CREATE INDEX idx_progress_lookup 
ON user_lesson_progress(user_id, course_id);

// Minimize Payload
return NextResponse.json({
  user: { id, name, email }, // Only needed fields
  courses: courses.map(c => ({
    id: c.id,
    title: c.title,
    progress: c.progress
  }))
});
```

### 📋 TESTING REQUIREMENTS

#### Security Tests
```typescript
describe('API Security', () => {
  it('should reject unauthenticated requests', async () => {
    const res = await fetch('/api/profile/update', {
      method: 'POST',
      body: JSON.stringify({ name: 'Hacker' })
    });
    expect(res.status).toBe(401);
  });
  
  it('should prevent cross-user updates', async () => {
    const res = await authenticatedFetch('/api/profile/update', {
      body: { id: 'other-user-id', name: 'Hacked' }
    });
    expect(res.status).toBe(403);
  });
  
  it('should validate input', async () => {
    const res = await authenticatedFetch('/api/contact/submit', {
      body: { email: 'not-an-email' }
    });
    expect(res.status).toBe(400);
  });
});
```

#### Data Integrity Tests
```sql
-- Test: No orphaned records
SELECT * FROM user_lesson_progress p
WHERE NOT EXISTS (
  SELECT 1 FROM user_profiles u WHERE u.id = p.user_id
);

-- Test: Referential integrity
SELECT * FROM course_enrollments e
WHERE NOT EXISTS (
  SELECT 1 FROM courses c WHERE c.id = e.course_id
);

-- Test: Data consistency
SELECT * FROM user_profiles
WHERE email IS NOT NULL; -- Should be empty, email in auth.users
```

---

**This document provides detailed code examples and patterns to support the main audit findings.**