# Stripe Integration Plan - Bloom Platform

## 📅 Last Updated: January 10, 2025

## 🎯 Overview
This document outlines the complete plan for setting up and testing Stripe payments for the Bloom course platform. The integration is 90% complete with production-ready code - mainly requires configuration and security fixes.

## 💻 Current Implementation Status

### ✅ What's Already Built
1. **Core Stripe Integration** (`/lib/stripe.ts`)
   - Client and server-side SDK configured
   - Course pricing defined:
     - Postpartum Wellness Foundations: $197
     - Anxiety Management for New Moms: $127
     - Partner Support Bootcamp: $97

2. **API Endpoints**
   - `/api/stripe/create-checkout-session`: Creates Stripe checkout sessions
   - `/api/stripe/webhook`: Handles payment events and grants course access

3. **UI Components**
   - `CoursePurchaseButton`: Polished purchase flow component
   - `/checkout` page: Checkout flow page

4. **Database Schema**
   - `course_purchases`: Tracks all purchase attempts
   - `user_course_access`: Manages course access permissions
   - `course_progress`: Tracks lesson/module completion

### ❌ What Needs Setup
1. Environment variables (Stripe keys)
2. Products/prices in Stripe Dashboard
3. Webhook configuration
4. Security fix for course content access

## 📋 Phase 1: Configuration & Setup

### 1.1 Environment Variables
Add to `.env.local`:
```bash
# Stripe API Keys (from Stripe Dashboard)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... # Get after webhook setup

# Feature Flag
COURSES_ENABLED=true

# Price IDs (after creating in Stripe)
STRIPE_PRICE_POSTPARTUM_WELLNESS=price_...
STRIPE_PRICE_ANXIETY_MANAGEMENT=price_...
STRIPE_PRICE_PARTNER_SUPPORT=price_...
```

### 1.2 Stripe Dashboard Setup
1. **Create Products** (in Test Mode)
   - "Postpartum Wellness Foundations" → $197
   - "Anxiety Management for New Moms" → $127
   - "Partner Support Bootcamp" → $97

2. **Configure Webhook**
   - URL: `https://[your-domain]/api/stripe/webhook`
   - Events: 
     - `checkout.session.completed`
     - `checkout.session.expired`
     - `checkout.session.async_payment_failed`

3. **Checkout Settings**
   - Enable automatic tax (if needed)
   - Configure payment methods
   - Set up promotion codes (optional)

### 1.3 Database Setup
Run the schema file in Supabase SQL Editor:
```sql
-- File: /supabase/course-payment-schema.sql
-- Creates: course_purchases, user_course_access, course_progress
```

## 📋 Phase 2: Security & Architecture Fixes

### 2.1 🚨 CRITICAL Security Fix
**Problem**: Dynamic course pages have NO authentication
- Route: `/course/[courseSlug]/week/[weekNumber]/lesson/[lessonNumber]`
- API: `/api/course/content` - Missing auth checks

**Solution**: Add authentication to `/pages/api/course/content.ts`:
```typescript
// Add session check
const session = await getServerSession(req, res, authOptions);
if (!session) {
  return res.status(401).json({ error: 'Unauthorized' });
}

// Check course access
const hasAccess = await checkCourseAccess(session.user.email, courseSlug);
if (!hasAccess) {
  return res.status(403).json({ error: 'No access to this course' });
}
```

### 2.2 Database Issues to Fix
1. **Inconsistent IDs**: Some tables use email, others use user_id
2. **Missing Foreign Keys**: Course references use slugs instead of UUIDs
3. **Redundant Tables**: `course_purchases` and `course_enrollments` both exist

## 📋 Phase 3: Testing Plan

### 3.1 Test Scenarios

#### Scenario 1: New User Purchase
1. Create test account
2. Browse `/courses`
3. Purchase "Postpartum Wellness" course
4. Use test card: `4242 4242 4242 4242`
5. Verify:
   - Access granted in database
   - Course appears in `/my-courses`
   - Can view all lessons

#### Scenario 2: Failed Payment
1. Use decline card: `4000 0000 0000 0002`
2. Verify no access granted
3. Check error handling

#### Scenario 3: Free Access
1. Admin grants free access
2. User can access without payment
3. Progress tracking works

### 3.2 Stripe Test Cards
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Insufficient: 4000 0000 0000 9995
3D Secure: 4000 0025 0000 3155
```

## 📋 Phase 4: Monitoring & Analytics

### 4.1 Key Metrics
- Payment success rate (target: >98%)
- Conversion rate (target: >15%)
- Course completion rate (target: >80%)

### 4.2 Monitoring Queries
```sql
-- Daily revenue
SELECT DATE(created_at), COUNT(*), SUM(amount/100) 
FROM course_purchases 
WHERE payment_status = 'paid' 
GROUP BY DATE(created_at);

-- Course popularity
SELECT course_id, COUNT(*) as purchases 
FROM user_course_access 
GROUP BY course_id;
```

## 📋 Phase 5: Production Launch

### 5.1 Pre-Launch Checklist
- [ ] All test scenarios pass
- [ ] Security gap fixed
- [ ] Production keys configured
- [ ] Webhook verified
- [ ] Database backed up
- [ ] Error monitoring ready

### 5.2 Rollout Plan
1. **Soft Launch**: 10% of users (5 people)
2. **Monitor**: 48 hours
3. **Full Launch**: All users
4. **Announce**: Email campaign

## 🚨 Known Issues & Risks

### Current Issues
1. **Security Gap**: Course content accessible without auth
2. **Database Inconsistency**: Mixed use of emails vs user IDs
3. **Empty Tables**: course_purchases and course_enrollments unused

### Risk Mitigation
1. **Payment Failures**: Retry logic + manual resolution
2. **Access Issues**: Admin dashboard for access management
3. **Performance**: Cache course content + CDN for videos

## 💰 Revenue Projections
- 46 subscribers × 15% conversion × $197 = ~$1,360
- 46 subscribers × 30% conversion × $197 = ~$2,720

## 🛠️ Technical Contacts
- Stripe Support: support.stripe.com
- Webhook Debugging: dashboard.stripe.com/test/webhooks
- API Reference: stripe.com/docs/api

## 📝 Next Steps
1. **Today**: Add environment variables
2. **Tomorrow**: Fix security gap
3. **This Week**: Complete all testing
4. **Next Week**: Launch to beta users

---

## 🔍 Database Verification Results (Jan 10, 2025)

### ✅ Database Tables Confirmed
All required tables exist in the database:
- `courses`: 3 courses defined
- `course_modules`: 12 modules (6 weeks for main course)
- `course_lessons`: 49 lessons total
- `course_purchases`: 0 rows (ready for use)
- `user_course_access`: 1 row (beta tester access)
- `course_progress`: 1 row (test data)

### ⚠️ Schema Inconsistencies Found

#### 1. **course_progress Table Mismatch**
The actual table uses different columns than the schema file:

**Schema File** (course-payment-schema.sql):
- Uses `customer_email` for user identification
- Uses text fields: `course_id`, `module_id`, `lesson_id`

**Actual Database**:
- Uses `user_id` (UUID) for user identification
- Uses `course_id` (text), but `week_number` and `lesson_number` (integers)
- No `module_id` or `lesson_id` fields

#### 2. **user_course_access Table**
- Schema matches implementation ✅
- Uses `customer_email` (not user_id) - this is intentional for Stripe integration
- Has a `payment_status` field that includes 'free' option (not in schema CHECK constraint)

#### 3. **Price Discrepancy**
- Database shows Postpartum course at $297
- Stripe code shows $197
- Need to align these prices

### 📋 Required Fixes

1. **Update course_progress Schema** - Either:
   - Option A: Modify the schema file to match current implementation
   - Option B: Migrate existing data to match schema file

2. **Add 'free' to payment_status CHECK constraint** in user_course_access

3. **Align course prices** between database and Stripe configuration

4. **Add missing 'test_paid' status** to payment_status CHECK constraint

### ✅ API Endpoints Verified
- `/api/stripe/create-checkout-session`: Correctly uses course_purchases table
- `/api/stripe/webhook`: Properly updates both course_purchases and user_course_access
- Both endpoints handle the schema correctly

---

**Remember**: Always test with Stripe test mode first. Never commit real API keys to git.