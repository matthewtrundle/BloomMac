# Implementation Guide for Virtual Therapy & Courses

## 📍 **Page URLs - Correct Links**

### Virtual Therapy Pages:
- **/virtual-therapy** - Main virtual therapy hub
- **/virtual-therapy/how-it-works** - Setup guide
- **/virtual-therapy/technology-privacy** - Security info
- **/virtual-therapy/is-virtual-right-for-you** - Interactive assessment (NOT /assessment)

### Texas City Pages:
- **/texas-service-areas** - All Texas locations hub
- **/texas-service-areas/houston** - Houston area page
- **/texas-service-areas/dallas** - Dallas-Fort Worth page
- **/texas-service-areas/san-antonio** - San Antonio page
- **/texas-service-areas/austin-metro** - Austin metro area
- **/texas-service-areas/why-travel-to-austin** - When in-person is needed

### Course Pages:
- **/courses** - Main courses hub
- **/courses/postpartum-wellness-foundations** - 6-week program
- **/courses/anxiety-management-for-new-moms** - 4-week program
- **/courses/partner-support-bootcamp** - 2-week program
- **/courses/checkout** - Purchase flow (needs Stripe integration)

---

## 💳 **Stripe Payment Integration**

### What You Need to Do:

1. **Create Stripe Account**
   - Go to https://stripe.com
   - Sign up for a business account
   - Complete identity verification

2. **Get API Keys**
   - Dashboard → Developers → API Keys
   - Copy your publishable key and secret key

3. **Install Stripe**
   ```bash
   npm install stripe @stripe/stripe-js
   ```

4. **Environment Variables**
   Add to your `.env.local`:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_... (for webhooks)
   ```

5. **Implementation Options**

   **Option A: Simple Stripe Checkout (Recommended)**
   ```typescript
   // pages/api/create-checkout-session.ts
   import { NextApiRequest, NextApiResponse } from 'next';
   import Stripe from 'stripe';

   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
     apiVersion: '2023-10-16',
   });

   export default async function handler(
     req: NextApiRequest,
     res: NextApiResponse
   ) {
     const { courseId, courseName, price } = req.body;

     try {
       const session = await stripe.checkout.sessions.create({
         payment_method_types: ['card'],
         line_items: [
           {
             price_data: {
               currency: 'usd',
               product_data: {
                 name: courseName,
                 description: `Access to ${courseName} course`,
               },
               unit_amount: price * 100, // Stripe uses cents
             },
             quantity: 1,
           },
         ],
         mode: 'payment',
         success_url: `${req.headers.origin}/courses/success?session_id={CHECKOUT_SESSION_ID}`,
         cancel_url: `${req.headers.origin}/courses/${courseId}`,
         metadata: {
           courseId,
         },
       });

       res.status(200).json({ sessionId: session.id });
     } catch (err) {
       res.status(500).json({ error: 'Failed to create checkout session' });
     }
   }
   ```

   **Option B: Custom Payment Form**
   - Use Stripe Elements for embedded payment form
   - More control but more complex

6. **Update Checkout Page**
   Replace the demo message with actual Stripe integration

---

## 🔗 **How Location Pages Work**

### Navigation Flow:
1. **Homepage** → "Now Serving All of Texas" section → Links to:
   - /virtual-therapy (Learn about virtual therapy)
   - /texas-service-areas (See your area)

2. **Texas Service Areas Hub** (/texas-service-areas) shows:
   - Map/visual of Texas
   - Links to each major city page
   - General benefits of virtual therapy

3. **City-Specific Pages** (e.g., /texas-service-areas/houston):
   - City-specific challenges and solutions
   - Local testimonials
   - "Book Virtual Session" CTA
   - Links back to main virtual therapy page

### Purpose of Location Pages:
- **SEO**: Rank for "Houston therapy", "Dallas postpartum support", etc.
- **Relevance**: Speak to city-specific concerns
- **Trust**: Show understanding of local culture/challenges
- **Conversion**: Multiple entry points to booking

---

## 🚀 **Quick Launch Checklist**

### Before Going Live:
- [ ] Set up Stripe account and verify
- [ ] Add Stripe API keys to environment variables
- [ ] Implement checkout session API endpoint
- [ ] Test payment flow with Stripe test cards
- [ ] Set up Stripe webhooks for order fulfillment
- [ ] Create success/cancel pages for checkout
- [ ] Add Google Analytics/tracking to new pages
- [ ] Test all navigation links
- [ ] Review all content for accuracy
- [ ] Set up email automation platform (e.g., ConvertKit, Mailchimp)

### Marketing Launch:
- [ ] Email announcement to existing list
- [ ] Social media posts about virtual therapy expansion
- [ ] Update Google My Business with virtual services
- [ ] Create blog post about virtual therapy benefits
- [ ] Run targeted ads for each city page

---

## 🐛 **Troubleshooting**

### Common Issues:
1. **404 Errors**: Make sure using exact URLs above
2. **Stripe Errors**: Check API keys are correct
3. **Email Not Sending**: Verify email service is configured
4. **Images Not Loading**: Check image paths are correct

### Need Help?
- Stripe Docs: https://stripe.com/docs
- Next.js Docs: https://nextjs.org/docs
- Contact Stripe Support for payment issues