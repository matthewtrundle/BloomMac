# CLAUDE.md - Critical Project Context for AI Assistants

## 🚨 PLATFORM OVERVIEW

### What Was Removed (Jan 2025):
- ❌ All appointment scheduling features
- ❌ Provider dashboard and clinical notes
- ❌ Patient-linked workbooks
- ❌ Payment processing for appointments
- ❌ Any features that store PHI

### Platform Focus: Educational Wellness Platform
- ✅ Online courses and lessons
- ✅ Anonymous wellness resources
- ✅ Newsletter and email automation
- ✅ Community features (coming soon)
- ✅ Free educational content
- ✅ E-commerce cart system with multi-step checkout
- ✅ Add-on products and tiered packages
- ✅ Payment plans and professional upsells
- ✅ **"My Growth Studio"** - Personalized wellness hub for course access and progress tracking

### If User Asks About Appointments:
Direct them to use SimplePractice or Calendly for appointment booking. This platform is now focused on educational content only.

## 🛑 DATABASE SCHEMA & CRITICAL RULES

### CURRENT DATABASE TABLES (Last Updated: Jan 2025):

| Table Name | Purpose | Key Info | Critical Notes |
|------------|---------|----------|----------------|
| **email_templates** | Email template storage | 1 row | id, name, subject, content, category, variables (jsonb) |
| **email_sequences** | Email automation sequences | 2 active: newsletter_signup, contact_form | trigger, status, name |
| **sequence_emails** | Individual emails in sequences | 8 rows | position, subject, content, delays |
| **sequence_enrollments** | User enrollments in sequences | 37 rows | subscriber_id, current_position, status |
| **subscribers** | Newsletter/email subscribers | 46 rows | **NO `subscribed` COLUMN - USE `status`** |
| **user_profiles** | ALL user profiles (including admins) | 6 rows | **NO EMAIL COLUMN - email is in auth.users** |
| **contact_submissions** | Contact form submissions | 24 rows | |
| **courses** | Course definitions | 3 rows | |
| **course_modules** | Course week/module structure | 12 rows | |
| **course_lessons** | Individual lessons | 49 rows | |
| **email_automation_logs** | Email send history | 96 rows | |
| **analytics_events** | Site analytics | 4,409 rows | |

### STRICT RULES - NO EXCEPTIONS:
1. **NEVER** assume a column exists - ALWAYS verify first
2. **NEVER** create mock/fake data - USE REAL DATA from database
3. **NEVER** guess table names - USE THE LIST ABOVE
4. **NEVER** make up API responses - QUERY THE DATABASE
5. **ALWAYS** query before assuming structure

### Common Mistakes That Keep Happening:
- Assuming `subscribed` column exists (IT DOESN'T - use `status`)
- Creating fake email analytics data
- Making up template structures
- Assuming table relationships without checking

### Key Schema Details:

#### `subscribers` table:
- `status` (varchar) - VALUES: 'active', 'unsubscribed', 'pending'
- `source` (varchar) - signup source
- **NO `subscribed` COLUMN - USE `status`**

#### `user_profiles` table:
- `role` field: 'admin', 'student', 'provider'
- **NO EMAIL COLUMN - email is in auth.users**
- Must JOIN with auth.users to get email

#### `user_preferences` table:
- `privacy_settings` (jsonb) - contains contact_visibility, profile_visibility
- `notification_preferences` (jsonb)
- `communication_preferences` (jsonb)

## 🔧 ESSENTIAL COMMANDS & TESTING

### Before ANY Database Work:
```bash
# Check database state - MANDATORY
npm run db:check

# Validate schema
npm run db:validate

# Query specific table
npm run db:query "SELECT * FROM table_name LIMIT 5"

# Test all queries
npm run db:test
```

### Database Access Methods:
```bash
# Check if table exists and row count
node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
supabase.from('table_name').select('count', { count: 'exact', head: true })
  .then(({count, error}) => console.log('table_name:', error ? 'Does not exist' : count + ' rows'));
"
```

### MANDATORY WORKFLOW - DO THIS AUTOMATICALLY:

| User Says | You MUST Run |
|-----------|--------------|
| "add [feature]" | `npm run db:check` then test queries |
| "why is [X] not working" | `npm run db:query` on the failing query |
| "show all [X]" | `npm run db:query "SELECT * FROM [table] LIMIT 5"` |
| "subscribers" | Verify columns first with `npm run db:check` |
| "email" | `npm run db:check \| grep email` |

**ENFORCEMENT**: If you write database code without showing test results first, the code WILL have bugs.

## 🔴 AUTHENTICATION & SECURITY

### Current Authentication System (Jan 2025)

**THE APP USES ONE USER TABLE WITH ROLE-BASED ACCESS:**
- **`user_profiles`** - For ALL users (admin and regular)
- Auth method: Supabase Auth + JWT tokens for admin routes
- **THERE IS NO `admin_users` TABLE!**
- Admin access controlled by `role = 'admin'` in user_profiles

### How Admin Login Works:
1. User submits email/password to `/api/admin/auth/login`
2. Authenticates with Supabase Auth (auth.users table)
3. Checks if user has `role = 'admin'` in `user_profiles` table
4. Creates JWT token AND Supabase session
5. Sets 3 cookies: adminToken, sb-access-token, sb-refresh-token

### 🚨 CRITICAL SECURITY VULNERABILITIES

**Status**: 20 tables with RLS (Row Level Security) disabled, exposing data to unauthorized access

#### Tables with Policies but RLS DISABLED (8 tables):
- `analytics_events`, `blog_posts`, `career_applications`, `contact_submissions`
- `courses`, `email_queue`, `email_templates`, `subscribers`

#### Quick Fix for Critical Tables:
```sql
-- Enable RLS on tables with existing policies (safe to run immediately)
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
```

### HIPAA Compliance Status: ⚠️ NOT COMPLIANT
- ❌ No encryption at rest for database
- ❌ No audit logs for data access
- ❌ No BAAs with Supabase/Resend/Vercel
- **NEVER store PHI in current system**
- **Use Calendly for appointments** (they handle HIPAA)

## 📧 EMAIL AUTOMATION SYSTEM

### PRODUCTION EMAIL SEQUENCES:

| Trigger | Status | Emails | Entry Point |
|---------|--------|--------|-------------|
| `newsletter_signup` | ✅ WORKING | 5 emails (30 days) | Profile settings, newsletter page |
| `contact_form` | ✅ WORKING | 3 emails (7 days) | Contact form submissions |
| `resource_download` | 🗃️ ARCHIVED | N/A | Resource pages are free content |
| `new_mom_program` | 🗃️ ARCHIVED | N/A | Calendly bookings |

### How It Works:
1. **Trigger Event**: User action (newsletter signup, contact form)
2. **enrollmentManager.enrollSubscriber()**: Creates enrollment record
3. **Cron Job**: `/api/cron/process-email-sequences/route.ts` runs every hour
4. **Email Processor**: Sends via Resend, updates enrollment status

### Key Files:
- `/lib/email-automation/enrollment-manager.ts` - Core enrollment logic
- `/app/api/cron/process-email-sequences/route.ts` - Email processor
- `/app/api/user/newsletter-subscribe/route.ts` - Working example

### Enrollment Manager API:
```javascript
await enrollmentManager.enrollSubscriber({
  subscriberId: 'uuid',
  trigger: 'newsletter_signup', // Must match email_sequences.trigger
  source: 'profile_settings'
});
```

### Testing Commands:
```bash
# Check sequence status
node scripts/check-pending-emails.js

# Test processor manually
node scripts/test-sequence-processor.js
```

## 📚 COURSE & DESIGN STANDARDS

### Course Structure: Postpartum Wellness Foundations (6 Weeks)
**Instructor**: Dr. Jana Rundle - Licensed Psychologist, Certified Perinatal Mental Health Specialist

#### Week Structure:
- **Week 1**: Understanding Your Fourth Trimester (4 lessons)
- **Week 2**: Cultivating Self-Compassion & Building Resilience (5 lessons)
- **Week 3**: Building Your Support Ecosystem (4 lessons)
- **Week 4**: Understanding & Managing Postpartum Anxiety (4 lessons)
- **Week 5**: Identity Integration & Matrescence (4 lessons)
- **Week 6**: Sustainable Wellness & Moving Forward (4 lessons)

**Status**: Week 1 complete, Week 2 scripts complete, Weeks 3-6 planned.

### 🎯 DR. JANA'S VOICE & SCRIPT DEVELOPMENT

**CRITICAL**: For ALL script development (meditation scripts, course content, video scripts), you MUST reference:

**`DR-JANA-VOICE-TRANSCRIPT-ANALYSIS.md`** - Comprehensive analysis of Dr. Jana's authentic speaking patterns, language choices, and therapeutic approach

This document contains:
- Permission-giving language patterns ("You have the right to...")
- Validation and normalization techniques
- Both/and thinking integration
- Scientific explanation style
- Biological wisdom framing
- ElevenLabs voice engineering tags
- Week-specific voice guidance for meditation scripts

**NEVER create scripts without first consulting this analysis document to ensure authentic Dr. Jana voice alignment.**

### 🎨 COMPREHENSIVE DESIGN SYSTEM & STANDARDS

**THIS IS NOT OPTIONAL** - All Bloom course presentations MUST follow sophisticated, magazine-quality design that creates emotionally intelligent educational experiences.

#### 📋 Primary Design Documentation (MUST REFERENCE):

1. **`/bloom-course-content/DESIGN-SYSTEM.md`** - Core design system foundation
2. **`/bloom-course-content/PRESENTATION-DESIGN-GUIDE.md`** - Advanced implementation guide
3. **`/bloom-course-content/weeks/week-1-foundation/PRESENTATION-TEMPLATE-GUIDE.md`** - Template specifics
4. **`/public/presentations/week1/assets/css/bloom-professional.css`** - Reference CSS implementation

#### 🚨 CRITICAL DESIGN REQUIREMENTS

##### Typography Foundation:
```css
--font-display: 'Cormorant Garamond', serif;     /* Headlines - REQUIRED */
--font-body: 'Inter', -apple-system, sans-serif; /* Body text - REQUIRED */

/* Responsive sizing with clamp() - MANDATORY */
h1: clamp(3.5rem, 7vw, 6rem);
h2: clamp(2.5rem, 5vw, 4rem);
body: clamp(1rem, 2vw, 1.3rem);
```

##### Required Visual Architecture:
1. **Hero Slides** - Full-bleed images with gradient scrims and text protection
2. **Magazine Layouts** - Asymmetric grids (60/40 or 3fr/2fr) NOT basic centering
3. **Glass Morphism** - Cards with `backdrop-filter: blur()` and sophisticated shadows
4. **Depth System** - Multi-layer shadows, overlapping elements, visual hierarchy
5. **Gradient Meshes** - Background visual interest without overwhelming content
6. **Color Journey** - Strategic emotional progression through slide sequence

##### Strategic Color Psychology (USE FULL PALETTE):
- **Sage (#8B9A82)**: Grounding, wisdom, professional authority
- **Coral (#FF6B6B)**: Urgency, importance, vulnerability moments
- **Golden (#FFCB77)**: Hope, transformation, achievement
- **Lavender (#C589E8)**: Transformation, spirituality, deeper work
- **Mint (#95E1D3)**: Freshness, clarity, new beginnings
- **Rose (#FFA8C5)**: Compassion, self-love, nurturing

#### 🎯 Design Implementation Process:

##### Step 1: Foundation Setup
- Import proper fonts (Google Fonts CDN)
- Implement full color palette as CSS variables
- Set up responsive typography with clamp()
- Create base layout containers with CSS Grid/Flexbox

##### Step 2: Layout Excellence
- Use magazine-quality layouts (study Vogue, Harper's Bazaar layouts)
- Implement visual hierarchy with varied card sizes and positioning
- Add depth through multiple shadow layers and element overlap
- Create asymmetric, dynamic compositions that guide the eye

##### Step 3: Visual Polish
- Add gradient mesh backgrounds where appropriate
- Implement glass morphism for floating cards and overlays
- Create sophisticated hover states with smooth transitions
- Polish fragment timing for storytelling rhythm

##### Step 4: Emotional Design Mapping
- Map colors to content emotional journey
- Progress from vulnerability (coral/sage) → transformation (lavender) → hope (golden/mint)
- Use visual metaphors that support content themes
- Ensure every design choice has psychological purpose

#### 🚫 DESIGN RED FLAGS (IMMEDIATE REDESIGN REQUIRED):

- **Basic Centered Layouts** - Everything centered with flexbox
- **Limited Color Usage** - Only 3-4 colors instead of full strategic palette
- **Missing Visual Effects** - No glass morphism, depth shadows, or gradient meshes
- **Poor Typography** - Not using Cormorant Garamond or responsive scaling
- **No Hover States** - Static presentations without interactive feedback
- **Flat Design** - No depth, layering, or visual hierarchy
- **Text Readability Issues** - Poor contrast over images
- **Same Layout Pattern** - Repetitive slide structures without variety

#### ✅ Quality Checklist (ALL MUST BE MET):

- [ ] Uses Cormorant Garamond for display typography
- [ ] Implements responsive sizing with clamp() functions
- [ ] Features magazine-quality asymmetric layouts
- [ ] Includes glass morphism effects where appropriate
- [ ] Has sophisticated multi-layer shadow system
- [ ] Colors support emotional journey progression
- [ ] Images follow selection guidelines (warm, hopeful, diverse)
- [ ] Text is readable on every slide with proper contrast
- [ ] Hover states work smoothly with CSS transitions
- [ ] Animations enhance storytelling without distraction
- [ ] Exports cleanly to PDF for offline viewing

#### 📍 Reference Implementations:

**Gold Standard Examples**:
- `/bloom-course-content/weeks/week-1-foundation/lesson-1-welcome/presentation.html`
- `/bloom-course-content/weeks/week-1-foundation/lesson-2-normal-vs-not/presentation.html`

**Study These for Layout Patterns**:
- Hero slide implementations with gradient scrims
- Magazine layout with asymmetric content placement
- Glass card implementations with backdrop blur
- Color journey progression through slide sequence

#### 🛠️ Design Audit Process:

Before considering any presentation complete:

1. **Visual Scan**: Does it look like a professional magazine spread?
2. **Color Check**: Are all 6 strategic colors being used purposefully?
3. **Typography Test**: Is Cormorant Garamond prominent and readable?
4. **Layout Variety**: Are there at least 3 different layout patterns?
5. **Emotional Journey**: Does the color progression support the content arc?
6. **Interactive Polish**: Do hover states and transitions feel smooth?

#### 💡 Design Philosophy:

These presentations honor the complexity and beauty of the postpartum journey. Every design choice should:
1. **Support emotional narrative** - Design follows content themes
2. **Create visual interest** - Varied layouts prevent monotony  
3. **Maintain professional polish** - Magazine-quality execution
4. **Enhance understanding** - Visual hierarchy guides comprehension
5. **Respect viewer intelligence** - Sophisticated without being overwhelming

**REMEMBER**: If a presentation doesn't meet these standards, it's not ready for production. The design system ensures every mother receives a world-class educational experience that matches the caliber of Dr. Jana's expertise.

## 🚨 HALLUCINATION PREVENTION & CONTEXT PRESERVATION

### Red Flags That Should Trigger Re-verification:
- "I'll create some example..." → NO! Query real data
- "Typically, this would..." → NO! Check actual implementation
- "It should have..." → NO! Verify what it actually has

### Memory Limitations:
- **AI WILL FORGET** - After ~10 messages, context may be lost
- **SOLUTION**: Always re-verify assumptions with database checks
- **NEVER** rely on information from earlier in conversation without re-checking

### Every 5 Operations:
1. Re-run `npm run db:check`
2. Re-validate assumptions
3. Update this file with discoveries

## 🛠️ DATABASE ACCESS LIMITATIONS

### Current Limitations:
**DNS Issue**: Cannot resolve `db.utetcmirepwdxbtrcczv.supabase.co` from this environment
- ❌ `psql` direct connection fails
- ❌ `pg` Node.js client fails  
- ✅ Supabase JS client works

### For Schema Changes:
- **Cannot execute DDL via JS client** (CREATE, ALTER, DROP)
- **Must use Supabase Dashboard SQL Editor**
- Generate validated `.sql` files first
- Always verify current state before changes

## 🚨 ENVIRONMENT VARIABLES

```env
# Database Access
NEXT_PUBLIC_SUPABASE_URL=https://utetcmirepwdxbtrcczv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # For migrations only!

# Authentication
JWT_SECRET=<32+ character secret>  # Still used for admin panel!

# Email
RESEND_API_KEY=re_...
```

## 💡 QUICK DECISION TREE

```
Need to know if column exists?
  → Run: npm run db:check
  
Creating new feature?
  → Check schema section first
  → Run: npm run db:validate
  
Modifying authentication?
  → Read authentication section
  → Test admin login flow
  
About to use mock data?
  → STOP! Query real data instead
  
Uncertain about anything?
  → Re-run database checks
  → Ask user to confirm before proceeding
```

## 🛒 E-COMMERCE CART SYSTEM (Jan 2025)

### Overview
Complete cart and checkout system with professional adaptations of conversion optimization principles. Balances revenue growth with therapeutic credibility.

### 📚 Key Documentation Hub
- **CART_SYSTEM_DOCUMENTATION.md** - Central reference for all cart functionality
- **docs/WELLNESS_HUB_REDESIGN.md** - "My Growth Studio" redesign documentation

### Core Components Built:
1. **Cart System** (`/lib/cart/cart-context.tsx`)
   - React Context with localStorage persistence
   - Multi-product type support (courses, add-ons, services, physical items)
   - Real-time price calculations

2. **Professional UI Components** (`/components/ui/`)
   - **ProfessionalValueDisplay** - "Investment" language, not "price"
   - **ConfidenceGuarantee** - 14-day satisfaction period
   - **GentleUrgency** - Real constraints only (cohort dates, availability)
   - **TrustBadge** - Dr. Jana's credentials & success metrics

3. **Multi-Step Checkout** (`/components/checkout/`)
   - Dynamic steps based on cart contents
   - Professional payment options with plans
   - Upsell opportunities at appropriate moments

### Product Strategy:
- **Courses**: $97-$297 (Postpartum Wellness, Anxiety Management, Partner Support)
- **Add-Ons**: Workbook Reviews ($97-$797), Quick Connect Sessions ($297), Partner Kit ($97)
- **Packages**: Foundation ($397) → Comprehensive ($1,297) → Accelerated ($2,497) → Concierge ($3,997)

### Professional Adaptations from Conversion Best Practices:
- ✅ Value stacking → "What's included in your investment"
- ✅ Payment plans → "Payment flexibility for families"
- ✅ Urgency → Real cohort dates and availability only
- ✅ Guarantees → Professional 14-day satisfaction period
- ✅ Testimonials → Authentic stories at key decision points

### Related Documentation:
- `STRIPE_INTEGRATION_PLAN.md` - Payment system architecture
- `REFINED_ADDON_STRATEGY.md` - Mother-validated add-on products
- `COMPLETE_PRODUCT_CATALOG.md` - Full product lineup with pricing
- `MARKETING_COPY_TIERED_PACKAGES.md` - Professional marketing copy
- `HORMOZI_AUDIT_RECOMMENDATIONS.md` - Original conversion principles
- `ADAPTED_PROFESSIONAL_IMPLEMENTATION.md` - How we adapted for wellness

### Implementation Status:
- ✅ Cart context and state management
- ✅ UI components with professional tone
- ✅ Multi-step checkout flow
- ✅ Stripe integration ready
- ⏳ Pending: Connect to production Stripe
- ⏳ Pending: Add counselor booking for workbook reviews

## 🌱 MY GROWTH STUDIO (Formerly Wellness Hub)

### Overview
"My Growth Studio" is the personalized dashboard where users access purchased courses, track progress, and engage with wellness resources. The name change from "Wellness Hub" reflects user feedback that the original felt too clinical.

### Key Features:
- **Personalized Dashboard** - Custom welcome, progress tracking, achievements
- **Course Library** - Access purchased courses with visual progress indicators
- **Resource Center** - Downloadable materials, worksheets, meditations
- **Progress Tracking** - Visual journey maps, streaks, milestone celebrations

### Implementation Status:
- ✅ Basic dashboard and course access (`/app/wellness-hub/`)
- ✅ Progress tracking system
- ⏳ Pending: Update all UI text from "Wellness Hub" to "My Growth Studio"
- ⏳ Pending: Enhanced resource library
- ⏳ Pending: Achievement badges and celebrations

### Related Files:
- `/app/wellness-hub/` - Main dashboard pages
- `/components/wellness-hub/` - UI components
- `/lib/wellness-hub/` - Business logic
- `docs/WELLNESS_HUB_REDESIGN.md` - Complete redesign documentation

### Database Tables Used:
- `user_course_access` - Course enrollments
- `course_progress` - Lesson completion tracking
- `user_achievements` - Badges and milestones
- `courses`, `course_modules`, `course_lessons` - Course content

## 🚨 FINAL REMINDER

**YOU ARE AN AI THAT MAKES MISTAKES.** The only way to prevent these mistakes is to TEST EVERYTHING FIRST. The tools exist. USE THEM AUTOMATICALLY. Don't wait to be asked.

---

**Remember**: This is a production app with real users. Always verify before making changes!

## 💡 Why This File Exists

This file is automatically provided to Claude at the start of every conversation. It contains critical context that prevents repeated mistakes and ensures consistency across sessions. 

**If you see Claude making assumptions about the database, remind them to check CLAUDE.md and run the database scripts!**