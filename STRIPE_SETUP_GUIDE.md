# Stripe Integration Setup Guide

## Overview
The Bloom Psychology platform has Stripe integration code ready but not activated. This guide walks through the steps to enable and test payment processing.

## Current Status
- ✅ Stripe SDK installed (`@stripe/stripe-js` and `stripe`)
- ✅ Client and server Stripe initialization in `/lib/stripe.ts`
- ✅ Checkout session API endpoint at `/pages/api/stripe/create-checkout-session.ts`
- ✅ Cart system integrated with AddToCartButton component
- ✅ Checkout page ready at `/app/checkout/page.tsx`
- ❌ Missing environment variables
- ❌ No Stripe products created
- ❌ Webhook endpoints not configured

## Step 1: Set Environment Variables

Add these to your `.env.local` file:

```env
# Stripe Keys (get from https://dashboard.stripe.com/apikeys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... # or pk_live_... for production
STRIPE_SECRET_KEY=sk_test_... # or sk_live_... for production

# Course Price IDs (create in Stripe Dashboard first)
STRIPE_PRICE_POSTPARTUM_WELLNESS=price_...
STRIPE_PRICE_ANXIETY_MANAGEMENT=price_...
STRIPE_PRICE_PARTNER_SUPPORT=price_...

# Enable courses
COURSES_ENABLED=true
```

## Step 2: Create Products in Stripe Dashboard

1. Go to [Stripe Dashboard > Products](https://dashboard.stripe.com/products)
2. Create these products:

### Postpartum Wellness Foundations
- **Name**: Postpartum Wellness Foundations
- **Description**: 6-week comprehensive self-paced program for postpartum emotional wellness
- **Price**: $197.00 (one-time)
- **Image**: Upload course image
- Save the Price ID for environment variables

### Anxiety Management for New Moms
- **Name**: Anxiety Management for New Moms
- **Description**: 4-week evidence-based program for managing postpartum anxiety
- **Price**: $127.00 (one-time)
- **Image**: Upload course image
- Save the Price ID for environment variables

### Partner Support Bootcamp
- **Name**: Partner Support Bootcamp
- **Description**: 2-week intensive program for partners to provide meaningful support
- **Price**: $97.00 (one-time)
- **Image**: Upload course image
- Save the Price ID for environment variables

## Step 3: Test in Development Mode

### Test Card Numbers
Use these test cards in Stripe's test mode:
- **Success**: 4242 4242 4242 4242
- **Requires Authentication**: 4000 0025 0000 3155
- **Declined**: 4000 0000 0000 9995

### Testing Flow:
1. Start the development server: `npm run dev`
2. Navigate to `/courses`
3. Click "Add to Cart" on any course
4. Go to checkout
5. Fill in email and name
6. Click "Complete Purchase"
7. Use a test card number
8. Verify redirect to success page

## Step 4: Configure Webhooks (For Production)

1. Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy the webhook signing secret
5. Add to environment: `STRIPE_WEBHOOK_SECRET=whsec_...`

## Step 5: Create Webhook Handler

Create `/pages/api/stripe/webhook.ts`:

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '../../../lib/stripe';
import { buffer } from 'micro';
import { supabase } from '../../../lib/supabase';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature']!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;

  try {
    const buf = await buffer(req);
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      // Grant course access
      await supabase.from('user_course_access').insert({
        user_id: session.metadata.userId,
        course_id: session.metadata.courseId,
        payment_status: 'completed',
        stripe_session_id: session.id,
      });
      
      // Update purchase record
      await supabase.from('course_purchases').update({
        status: 'completed',
        completed_at: new Date().toISOString()
      }).eq('stripe_checkout_session_id', session.id);
      
      break;
      
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
}
```

## Step 6: Update Checkout Integration

The `/app/checkout/page.tsx` needs to be updated to actually create Stripe checkout sessions. Currently it shows a placeholder. Here's the key change needed:

```typescript
const handleCheckout = async () => {
  if (!customerEmail.trim()) {
    alert('Please enter your email address');
    return;
  }

  setIsLoading(true);

  try {
    // Create checkout session for all cart items
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseId: items[0].metadata?.courseId, // For single course
        customerEmail,
        customerName,
      }),
    });

    const { sessionId, url } = await response.json();
    
    if (url) {
      // Redirect to Stripe Checkout
      window.location.href = url;
    }
  } catch (error) {
    console.error('Checkout error:', error);
    alert('There was an error processing your checkout. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
```

## Step 7: Database Tables Needed

These tables should already exist, but verify they're present:

```sql
-- Course purchases tracking
CREATE TABLE IF NOT EXISTS course_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_email VARCHAR(255),
  customer_name VARCHAR(255),
  course_id VARCHAR(255),
  stripe_checkout_session_id VARCHAR(255),
  amount INTEGER,
  currency VARCHAR(3),
  status VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- User course access
CREATE TABLE IF NOT EXISTS user_course_access (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  course_id VARCHAR(255),
  payment_status VARCHAR(50),
  stripe_session_id VARCHAR(255),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Testing Checklist

- [ ] Environment variables added
- [ ] Products created in Stripe Dashboard
- [ ] Test mode enabled in Stripe
- [ ] Can add courses to cart
- [ ] Can proceed to checkout
- [ ] Test payment completes successfully
- [ ] Success page shows after payment
- [ ] Database records created

## Common Issues

### "Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
- Ensure the env variable starts with `NEXT_PUBLIC_`
- Restart the dev server after adding env variables

### Checkout session fails
- Check that COURSES_ENABLED=true
- Verify Price IDs match environment variables
- Check Stripe API keys are correct

### Webhook failures
- Verify webhook endpoint URL is correct
- Check webhook signing secret matches
- Ensure bodyParser is disabled for webhook route

## Going Live Checklist

1. [ ] Switch to live Stripe API keys
2. [ ] Update webhook endpoints to production URL
3. [ ] Test with real payment method
4. [ ] Enable Stripe tax if needed
5. [ ] Configure email receipts in Stripe
6. [ ] Set up fraud prevention rules
7. [ ] Enable customer portal for refunds

## Support

- Stripe Documentation: https://stripe.com/docs
- Stripe Support: https://support.stripe.com
- Test Cards: https://stripe.com/docs/testing