# Bloom Psychology Course Platform - Master Implementation Plan

## Executive Summary

This document outlines the comprehensive plan to transform Bloom Psychology's course platform from a hardcoded prototype to a fully-featured, database-driven learning management system (LMS) integrated with the existing admin panel.

## Current State Analysis

### ✅ Working Components
- Course viewing experience (`/course/week1/`, etc.)
- Mock authentication system with test credentials
- Basic Stripe payment integration
- Admin panel infrastructure
- Email automation system
- Blog management system

### ⚠️ Critical Issues

1. **No Course Management in Admin Panel**
   - Course management not visible in admin navigation
   - No UI for creating/editing courses

2. **Content Storage**
   - All course content hardcoded in TypeScript files
   - HTML slides stored as static files
   - No database storage for lessons/content

3. **Database Schema Conflicts**
   - 4 overlapping course-related schemas:
     - `courses` + `course_enrollments` (basic system)
     - `course_users` + `course_progress` (user tracking)
     - `course_purchases` + `user_course_access` (payment system)
     - Missing tables for actual course content

4. **Authentication System**
   - Using mock authentication with hardcoded users
   - Not integrated with Supabase Auth
   - No real user management

### 📊 Database Audit Results

**Existing Course-Related Tables:**
- `courses` - Basic course metadata
- `course_enrollments` - User enrollment tracking
- `course_users` - Separate user system (not integrated with auth)
- `course_progress` - Progress tracking
- `course_purchases` - Stripe payment records
- `user_course_access` - Access control
- Multiple user tracking tables with overlapping functionality

**Missing Critical Tables:**
- Course modules/weeks structure
- Course lessons with content
- Course assets/resources
- Content versioning

## Implementation Plan

### PHASE 1: Foundation & Navigation (Week 1-2)

#### 1.1 Admin Navigation Update

**File:** `/components/admin/AdminHeader.tsx` (or equivalent)

Add Course Management to the admin sidebar:

```typescript
const navigationItems = [
  // ... existing items
  {
    icon: BookOpen, // or GraduationCap
    label: 'Course Management',
    href: '/admin/courses',
    badge: 'NEW', // temporary badge to highlight new feature
    subItems: [
      { label: 'All Courses', href: '/admin/courses' },
      { label: 'Course Analytics', href: '/admin/courses/analytics' },
      { label: 'Student Progress', href: '/admin/courses/students' },
      { label: 'Course Settings', href: '/admin/courses/settings' }
    ]
  }
];
```

#### 1.2 Database Schema Consolidation

**New Migration File:** `/supabase/migrations/consolidate-course-schema.sql`

```sql
-- Create missing course content tables
CREATE TABLE IF NOT EXISTS course_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    objectives JSONB DEFAULT '[]',
    order_index INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(course_id, week_number)
);

CREATE TABLE IF NOT EXISTS course_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
    lesson_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT,
    video_duration_minutes INTEGER,
    video_thumbnail_url TEXT,
    slides_html TEXT, -- Store HTML slides content
    transcript TEXT,
    script_notes TEXT,
    resources JSONB DEFAULT '[]',
    order_index INTEGER DEFAULT 0,
    is_preview BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(module_id, lesson_number)
);

CREATE TABLE IF NOT EXISTS course_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT,
    file_type VARCHAR(50),
    file_size_bytes INTEGER,
    download_count INTEGER DEFAULT 0,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX idx_course_lessons_module_id ON course_lessons(module_id);
CREATE INDEX idx_course_resources_course_id ON course_resources(course_id);

-- Enable RLS
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_resources ENABLE ROW LEVEL SECURITY;
```

#### 1.3 Content Migration Strategy

**Migration Script:** `/scripts/migrate-course-content-to-db.js`

```javascript
import { createClient } from '@supabase/supabase-js';
import { enhancedCourseContent } from '../lib/data/enhanced-course-content';
import { weeks3To6Content } from '../lib/data/weeks-3-6-content';
import fs from 'fs/promises';
import path from 'path';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function migrateCourseContent() {
  console.log('Starting course content migration...');
  
  try {
    // 1. Ensure course exists
    const { data: course } = await supabase
      .from('courses')
      .select('id')
      .eq('slug', 'postpartum-wellness-foundations')
      .single();
    
    if (!course) {
      console.error('Course not found!');
      return;
    }
    
    // 2. Migrate modules (weeks)
    const weeks = [...enhancedCourseContent.weeks, ...weeks3To6Content];
    
    for (const [index, week] of weeks.entries()) {
      const { data: module } = await supabase
        .from('course_modules')
        .insert({
          course_id: course.id,
          week_number: index + 1,
          title: week.title,
          description: week.description,
          objectives: week.objectives || [],
          order_index: index,
          is_published: true
        })
        .select()
        .single();
      
      console.log(`Created module: Week ${index + 1}`);
      
      // 3. Migrate lessons
      for (const [lessonIndex, lesson] of week.lessons.entries()) {
        // Read HTML slides if they exist
        let slidesHtml = null;
        const slidesPath = path.join(
          process.cwd(),
          'course-materials',
          `week${index + 1}-slides-lesson${lessonIndex + 1}.html`
        );
        
        try {
          slidesHtml = await fs.readFile(slidesPath, 'utf-8');
        } catch (err) {
          console.log(`No slides found for Week ${index + 1}, Lesson ${lessonIndex + 1}`);
        }
        
        await supabase
          .from('course_lessons')
          .insert({
            module_id: module.id,
            lesson_number: lessonIndex + 1,
            title: lesson.title,
            description: lesson.description,
            video_url: lesson.videoUrl,
            video_duration_minutes: lesson.duration,
            slides_html: slidesHtml,
            transcript: lesson.transcript,
            order_index: lessonIndex,
            is_published: true
          });
        
        console.log(`  - Created lesson: ${lesson.title}`);
      }
    }
    
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run migration
migrateCourseContent();
```

### PHASE 2: Authentication & Access Control (Week 3-4)

#### 2.1 Supabase Auth Integration

**Update:** `/pages/api/course/login.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  try {
    // 1. Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 2. Check course access
    const { data: courseAccess } = await supabase
      .from('user_course_access')
      .select('course_id, access_granted_at')
      .eq('customer_email', email)
      .eq('payment_status', 'paid');

    if (!courseAccess || courseAccess.length === 0) {
      return res.status(403).json({ error: 'No active course access' });
    }

    // 3. Create session
    return res.status(200).json({
      user: {
        id: authData.user.id,
        email: authData.user.email,
        courses: courseAccess
      },
      session: authData.session
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

#### 2.2 Course Access Verification

**New Middleware:** `/middleware/course-access.ts`

```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return NextResponse.redirect(new URL('/course/login', req.url));
  }

  // Extract course info from URL
  const pathname = req.nextUrl.pathname;
  const courseMatch = pathname.match(/\/learn\/([^\/]+)/);
  
  if (courseMatch) {
    const courseSlug = courseMatch[1];
    
    // Verify course access
    const { data: access } = await supabase
      .from('user_course_access')
      .select('id')
      .eq('customer_email', session.user.email)
      .eq('course_id', courseSlug)
      .eq('payment_status', 'paid')
      .single();
    
    if (!access) {
      return NextResponse.redirect(new URL('/courses', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/learn/:path*', '/course/:path*']
};
```

### PHASE 3: Stripe Payment Integration (Week 4-5)

#### 3.1 Update Stripe Webhook

**File:** `/pages/api/stripe/webhook.ts`

```typescript
// Add to existing webhook handler
case 'checkout.session.completed':
  const session = event.data.object as Stripe.Checkout.Session;
  
  // Grant course access
  await supabase.from('user_course_access').insert({
    customer_email: session.customer_email,
    course_id: session.metadata.course_id,
    stripe_customer_id: session.customer,
    stripe_session_id: session.id,
    payment_status: 'paid',
    access_granted_at: new Date().toISOString()
  });
  
  // Create user account if doesn't exist
  const { data: existingUser } = await supabase.auth.admin.getUserByEmail(
    session.customer_email
  );
  
  if (!existingUser) {
    // Create new user with temporary password
    const tempPassword = generateSecurePassword();
    
    await supabase.auth.admin.createUser({
      email: session.customer_email,
      password: tempPassword,
      email_confirm: true
    });
    
    // Send welcome email with login instructions
    await sendCourseWelcomeEmail(session.customer_email, tempPassword);
  }
  break;
```

### PHASE 4: Admin Content Management UI (Week 5-6)

#### 4.1 Course Editor Features

**Required Components:**
1. Course listing with search/filter
2. Course details editor
3. Module/week manager
4. Lesson content editor with:
   - WYSIWYG HTML editor for slides
   - Video URL management
   - Transcript editor
   - Resource uploader
5. Student progress viewer
6. Analytics dashboard

#### 4.2 Content Best Practices

**HTML Slides Storage:**
- Store complete HTML in database
- Use Supabase Storage for embedded images
- Implement version history
- Add preview functionality

**Video Management:**
- Store only URLs (use external hosting)
- Support: YouTube, Vimeo, Cloudflare Stream
- Track viewing progress separately
- Implement resume functionality

### PHASE 5: Migration Execution Plan

#### Week 1: Foundation
- [ ] Add Course Management to admin navigation
- [ ] Deploy database schema updates
- [ ] Create migration scripts

#### Week 2: Content Migration
- [ ] Run content migration script
- [ ] Verify all content transferred correctly
- [ ] Test course viewing with database content

#### Week 3: Authentication
- [ ] Replace mock auth with Supabase Auth
- [ ] Migrate existing test users
- [ ] Implement password reset flow

#### Week 4: Payment Integration
- [ ] Connect Stripe webhook to course access
- [ ] Test purchase flow end-to-end
- [ ] Implement access expiration (if needed)

#### Week 5: Admin UI
- [ ] Build course listing page
- [ ] Create course editor interface
- [ ] Implement content preview

#### Week 6: Testing & Launch
- [ ] Full system testing
- [ ] User acceptance testing
- [ ] Production deployment
- [ ] Monitor and iterate

## Risk Mitigation

1. **Data Loss Prevention**
   - Keep all existing tables
   - Create backups before migration
   - Test in staging environment first

2. **User Disruption**
   - Maintain existing course URLs
   - Gradual rollout with feature flags
   - Fallback to hardcoded content if needed

3. **Payment Issues**
   - Log all Stripe events
   - Manual access grant capability
   - Payment reconciliation tools

## Success Metrics

1. **Technical**
   - All course content in database
   - Zero downtime during migration
   - < 200ms page load times

2. **Business**
   - Course completion rate > 70%
   - Payment success rate > 95%
   - Support tickets < 5% of users

3. **User Experience**
   - Student satisfaction > 4.5/5
   - Mobile usage > 40%
   - Weekly active users > 80%

## Support Documentation

### Admin Training Topics
1. Creating and editing courses
2. Managing student access
3. Viewing analytics
4. Handling support issues

### Student Support Topics
1. Account creation and login
2. Course navigation
3. Technical requirements
4. Progress tracking

## Conclusion

This plan provides a clear path from the current hardcoded system to a fully-featured, database-driven course platform. The phased approach ensures minimal disruption while delivering maximum value at each stage.

**Next Steps:**
1. Review and approve plan
2. Set up staging environment
3. Begin Phase 1 implementation

---

*Document Version: 1.0*  
*Last Updated: January 2025*  
*Owner: Bloom Psychology Development Team*