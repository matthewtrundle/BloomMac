# Stripe Webhook Setup Guide

## Overview
This document outlines the remaining setup needed for proper Stripe webhook handling to enable course purchases.

## Current State
- ✅ Stripe integration exists for payment processing
- ✅ Course enrollment tables exist in database
- ⚠️ Webhook endpoints need to be connected to course enrollment creation

## Required Implementation

### 1. Update Stripe Webhook Handler
Location: `/pages/api/stripe/webhook.ts` (or similar)

```typescript
// Add handling for successful payment events
case 'checkout.session.completed':
  const session = event.data.object;
  
  // Extract metadata
  const userId = session.metadata.user_id;
  const courseId = session.metadata.course_id;
  
  // Create course enrollment
  await supabase
    .from('course_enrollments')
    .insert({
      user_id: userId,
      course_id: courseId,
      enrollment_date: new Date().toISOString(),
      payment_status: 'completed',
      stripe_session_id: session.id,
      amount_paid: session.amount_total / 100
    });
  
  // Award course purchase achievement (if first course)
  const { data: enrollments } = await supabase
    .from('course_enrollments')
    .select('id')
    .eq('user_id', userId);
  
  if (enrollments?.length === 1) {
    await awardAchievement(userId, 'first_course_enrolled');
  }
  
  break;
```

### 2. Add Missing Achievement
Add to `/lib/achievements.ts`:

```typescript
first_course_enrolled: {
  id: 'first_course_enrolled',
  name: 'Learning Begins',
  description: 'Enrolled in your first Bloom course',
  icon: '📖',
  category: 'journey',
  points: 30
}
```

### 3. Update Checkout Process
Ensure checkout includes necessary metadata:

```typescript
const session = await stripe.checkout.sessions.create({
  // ... other config
  metadata: {
    user_id: user.id,
    course_id: courseId,
    course_name: courseName
  },
  success_url: `${process.env.NEXT_PUBLIC_URL}/course/welcome?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.NEXT_PUBLIC_URL}/courses`
});
```

### 4. Create Welcome Page
Create `/app/course/welcome/page.tsx` for post-purchase:

```typescript
export default function CourseWelcomePage() {
  // Verify purchase
  // Award achievement
  // Redirect to first lesson or dashboard
}
```

## Testing Checklist

### Local Testing with Stripe CLI
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Trigger test event
stripe trigger checkout.session.completed
```

### Test Scenarios
1. **New User Purchase**
   - Create account
   - Purchase course
   - Verify enrollment created
   - Check achievement awarded
   - Confirm dashboard shows course

2. **Existing User Purchase**
   - Login as beta1@bloomtest.com
   - Purchase second course
   - Verify multiple enrollments
   - Check progress tracking

3. **Failed Payment Recovery**
   - Test failed payment
   - Verify no enrollment created
   - Test retry mechanism

## Production Setup

### Environment Variables
```env
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```

### Webhook Configuration in Stripe Dashboard
1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy webhook signing secret

## Security Considerations
- Always verify webhook signatures
- Validate user permissions
- Log all transactions
- Implement idempotency for duplicate events
- Store Stripe IDs for reconciliation

## Support & Monitoring
- Set up error alerts for failed webhooks
- Monitor enrollment creation rate
- Track payment success rate
- Log webhook processing times