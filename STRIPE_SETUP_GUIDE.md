# Stripe Payment Integration Setup Guide

## Current Status ✅

Your Stripe integration is fully built and ready! Here's what's implemented:

### 1. **Complete Payment Flow**
- ✅ Course purchase buttons with email collection
- ✅ Checkout session creation API
- ✅ Webhook handling for payment confirmation
- ✅ Automatic course access granting
- ✅ Purchase tracking in database

### 2. **Test Mode Ready**
- ✅ Full test mode implementation
- ✅ Mock checkout page for testing without Stripe account
- ✅ Test card selection for different scenarios
- ✅ Database recording of test purchases

### 3. **Database Tables**
- ✅ `course_purchases` - Track all purchase attempts
- ✅ `user_course_access` - Manage course access
- ✅ `user_courses` - User enrollment data

## 🧪 Testing Without Stripe Account

You can test the entire payment flow right now:

1. **Start your dev server**
   ```bash
   npm run dev
   ```

2. **Visit a course page**
   - Go to: http://localhost:3011/courses/postpartum-wellness-foundations

3. **Click "Buy Now"**
   - Enter any email address
   - You'll be redirected to the test checkout page

4. **Complete test purchase**
   - Select a test card (default is successful payment)
   - Click "Pay"
   - You'll be redirected to success page

5. **Verify in database**
   - Check `course_purchases` table for the transaction
   - Check `user_course_access` table for granted access

## 🚀 When You're Ready for Real Stripe

### Step 1: Create Stripe Account
1. Go to https://stripe.com
2. Sign up for an account
3. Complete business verification

### Step 2: Get Your API Keys
1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your keys to `.env.local`:
   ```bash
   STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
   ```

### Step 3: Create Products in Stripe
1. Go to https://dashboard.stripe.com/test/products
2. Create 3 products:

   **Product 1: Postpartum Wellness Foundations**
   - Price: $197.00 (one-time)
   - Copy the price ID

   **Product 2: Anxiety Management for New Moms**
   - Price: $127.00 (one-time)
   - Copy the price ID

   **Product 3: Partner Support Bootcamp**
   - Price: $97.00 (one-time)
   - Copy the price ID

3. Add price IDs to `.env.local`:
   ```bash
   STRIPE_PRICE_POSTPARTUM_WELLNESS=price_YOUR_ID_HERE
   STRIPE_PRICE_ANXIETY_MANAGEMENT=price_YOUR_ID_HERE
   STRIPE_PRICE_PARTNER_SUPPORT=price_YOUR_ID_HERE
   ```

### Step 4: Set Up Webhook
1. Go to https://dashboard.stripe.com/test/webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://your-domain.com/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.payment_failed`
5. Copy the signing secret to `.env.local`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE
   ```

### Step 5: Test with Real Stripe
1. Use test card: `4242 4242 4242 4242`
2. Any future expiry date
3. Any 3-digit CVC
4. Any billing ZIP code

## 📊 Monitoring Purchases

### View Purchase History
```sql
-- See all purchases
SELECT * FROM course_purchases ORDER BY created_at DESC;

-- See successful purchases
SELECT * FROM course_purchases WHERE status = 'completed';

-- See who has access to courses
SELECT * FROM user_course_access WHERE payment_status = 'paid';
```

### Test Mode vs Production
- Test mode purchases have `status = 'test_mode'`
- Real purchases have `status = 'completed'`
- Access table uses `payment_status = 'test_paid'` vs `'paid'`

## 🔧 Customization Options

### 1. **Modify Prices**
Edit `/lib/stripe.ts`:
```typescript
export const COURSE_PRICES = {
  'postpartum-wellness-foundations': {
    amount: 19700, // $197.00 in cents
    // ...
  }
};
```

### 2. **Add Discount Codes**
Already enabled in checkout session:
```typescript
allow_promotion_codes: true,
```

### 3. **Add Subscription Plans**
Template included in `.env.stripe.example` for monthly/annual plans

### 4. **Customize Success Page**
Edit `/app/courses/purchase-success/page.tsx`

### 5. **Add Email Receipts**
Uncomment in webhook handler:
```typescript
// await sendCourseWelcomeEmail(customerEmail, courseId);
```

## 🚨 Important Security Notes

1. **Never commit real API keys** - Use environment variables
2. **Always verify webhook signatures** - Already implemented
3. **Use HTTPS in production** - Required for webhooks
4. **Enable Stripe fraud protection** - In Stripe dashboard
5. **Set up tax collection** - Already enabled with `automatic_tax`

## 📱 What Your Customers See

1. **Clean purchase flow** - Email collection inline
2. **Secure checkout** - Hosted by Stripe
3. **Trust badges** - SSL, instant access, lifetime access
4. **Mobile optimized** - Responsive design
5. **Clear pricing** - Shows savings on original price

## 🎯 Next Steps After Stripe Setup

1. **Connect to email system** - Send purchase confirmations
2. **Add course access checks** - Protect course content
3. **Build admin dashboard** - View sales analytics
4. **Set up refund handling** - Process through Stripe
5. **Add upsells** - Offer additional courses after purchase

The payment system is production-ready once you add your Stripe credentials!