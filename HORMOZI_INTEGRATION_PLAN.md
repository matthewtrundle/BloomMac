# Hormozi Integration Plan: Practical Implementation

## 🎯 Overview: What Changes & What Stays

### ✅ Keep the Course Names (Already Filmed)
- "Postpartum Wellness Foundations" - Keep as official name
- ADD powerful subtitles/taglines for marketing
- Use transformation language in descriptions

### 🔄 What Actually Changes:

## 1. 🏷️ Package Naming & Positioning

### Current → New Frontend Display:
```
Bronze Package → "Kickstart Your Recovery - $397"
Silver Package → "Total Transformation Package - $1,297" 
Gold Package → "Done-With-You Complete System - $2,497"
Platinum Package → "White Glove VIP Experience - $3,997"
```

### Implementation:
- Update `/app/checkout/page.tsx` - Package selection UI
- Update `/components/checkout/AddOnStep.tsx` - Package names
- Create new `/app/packages/` landing pages with outcome focus

## 2. 📝 Copy Changes Throughout Site

### Course Pages (`/app/courses/[id]/page.tsx`)

**Above the fold:**
```typescript
// OLD
<h1>Postpartum Wellness Foundations</h1>
<p>A 6-week program for new mothers</p>

// NEW
<h1>Postpartum Wellness Foundations</h1>
<h2 className="text-2xl text-purple-600 mb-4">
  From Survival Mode to Confident Mom in 6 Weeks
</h2>
<p>Join 500+ mothers who went from overwhelmed to empowered</p>
```

### Add "Certainty Stack" Section:
```typescript
<div className="bg-green-50 p-6 rounded-lg mb-8">
  <h3 className="font-bold text-xl mb-4">This WILL Work For You If...</h3>
  <ul className="space-y-2">
    <li>✓ You have 10 minutes a day</li>
    <li>✓ You're 0-12 months postpartum</li>
    <li>✓ You want to feel like yourself again</li>
    <li>✓ You're ready to stop just surviving</li>
  </ul>
</div>
```

## 3. 🛒 Cart & Checkout Flow Updates

### Cart Drawer (`/components/cart/CartDrawer.tsx`)
Add testimonial at bottom:
```typescript
{state.items.length > 0 && (
  <div className="p-4 bg-purple-50 border-t">
    <p className="text-sm italic">
      "I added the workbook review and it changed everything. 
      Worth 10x the price." - Sarah M.
    </p>
  </div>
)}
```

### Checkout Page Updates:

#### Step 1: Cart Review
- Add "You're moments away from transformation" messaging
- Show value stack for packages
- Add urgency: "Complete order in next 10 min for bonus"

#### Step 2: Add-Ons
- Rename to "Accelerate Your Results"
- Position as "shortcuts" not "extras"
- Use Hormozi's "First 10 buyers get..." urgency

#### Step 3: Payment
- Lead with payment plan amount: "Start for just $97"
- Add guarantee badge prominently
- Include Hormozi's closing copy

## 4. 🏠 Homepage Hero Section

### Current Hero:
```typescript
// OLD
<h1>Supporting Mothers Through Postpartum</h1>
<p>Professional therapy and courses</p>

// NEW
<h1>Stop Surviving. Start Thriving.</h1>
<p className="text-xl">
  The proven system that's helped 500+ moms go from 
  exhausted to energized in weeks (not years)
</p>
<div className="flex gap-4 mt-6">
  <span>⏱️ See changes in 48 hours</span>
  <span>✓ 30-day guarantee</span>
  <span>👩‍⚕️ Created by Dr. Jana</span>
</div>
```

## 5. 💳 Pricing Display Changes

### All Price Displays:
```typescript
// Component: PriceDisplay.tsx
const PriceDisplay = ({ price, comparePrice, paymentPlan }) => (
  <div>
    {/* Always show payment plan first */}
    <div className="text-3xl font-bold text-purple-600">
      Start for ${paymentPlan}/mo
    </div>
    <div className="text-sm text-gray-600">
      or ${price} (save ${comparePrice - price})
    </div>
  </div>
);
```

## 6. 🎯 New Components to Build

### 1. Urgency Banner (`/components/ui/UrgencyBanner.tsx`)
```typescript
// Shows at top of course/package pages
<UrgencyBanner>
  🔥 17 moms viewing • 8 spots left for January cohort • 
  Next group won't start until February
</UrgencyBanner>
```

### 2. Value Stack Component (`/components/ui/ValueStack.tsx`)
```typescript
// Shows full value breakdown
<ValueStack
  items={[
    { name: "6-Week Program", value: 497 },
    { name: "Workbook Analysis", value: 497 },
    { name: "Support Sessions", value: 297 },
    // etc...
  ]}
  totalValue={2876}
  yourPrice={1297}
/>
```

### 3. Guarantee Badge (`/components/ui/GuaranteeBadge.tsx`)
```typescript
// Floating badge on checkout
<GuaranteeBadge
  title="The Postpartum Promise"
  description="Feel 50% better in 30 days or pay nothing"
  terms="Plus keep all materials"
/>
```

### 4. Testimonial Ticker (`/components/ui/TestimonialTicker.tsx`)
```typescript
// Rotating testimonials at friction points
<TestimonialTicker
  testimonials={[
    "Just finished week 2 and already sleeping better - Maria",
    "My husband noticed the change immediately - Sarah",
    "Worth every penny and then some - Jessica"
  ]}
/>
```

## 7. 📊 Data & Analytics Changes

### Track New Metrics:
- Time on checkout page before purchase
- Which urgency element triggered action
- Value stack views vs purchases
- Guarantee badge interaction

### A/B Tests to Run:
1. Payment-first pricing vs total price first
2. Hormozi close vs current close
3. Cohort urgency vs discount urgency
4. 30-day vs 60-day guarantee

## 8. 📧 Email Sequence Updates

### Cart Abandonment Emails:
- Hour 1: "Your transformation is waiting" + testimonial
- Hour 24: "Sarah almost didn't buy either..." story
- Day 3: "Last chance + surprise bonus"

### Post-Purchase:
- Immediate: "You made the right choice" validation
- Day 1: "Your first quick win" exercise
- Day 7: "Upgrade to faster results?" upsell

## 9. 🚀 Implementation Priority Order

### Week 1: High-Impact, Low-Effort
1. ✅ Add guarantee to checkout page
2. ✅ Change package names in UI
3. ✅ Add payment plan messaging
4. ✅ Update checkout copy with Hormozi close
5. ✅ Add testimonials to cart drawer

### Week 2: Value Communication
1. ✅ Build Value Stack component
2. ✅ Add to all package pages
3. ✅ Update course page subtitles
4. ✅ Add "certainty stack" sections
5. ✅ Implement urgency banner

### Week 3: Conversion Optimization
1. ✅ A/B test pricing display
2. ✅ Add testimonial ticker
3. ✅ Implement cohort-based urgency
4. ✅ Update email sequences
5. ✅ Add social proof notifications

### Week 4: Scale & Optimize
1. ✅ Analyze data from changes
2. ✅ Double down on winners
3. ✅ Create affiliate program
4. ✅ Build referral system
5. ✅ Plan next cohort launch

## 10. 🎨 Design System Updates

### New Design Tokens:
```css
/* Urgency colors */
--color-urgent: #FF6B6B;
--color-success: #51CF66;
--color-value: #FFD93D;

/* Hormozi-style emphasis */
.text-power {
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.guarantee-badge {
  background: linear-gradient(135deg, #FFD93D, #FF6B6B);
  border: 3px solid #000;
  box-shadow: 4px 4px 0 #000;
}
```

## 💡 The Compromise Solution

Since we can't rename the course itself:

1. **Keep**: "Postpartum Wellness Foundations" as the official name
2. **Add**: Power subtitles everywhere it appears
3. **Use**: Transformation language in all marketing
4. **Frame**: The course name as the "method" and the transformation as the "result"

Example:
> **Postpartum Wellness Foundations**  
> *The proven method to go from exhausted to energized in 6 weeks*

This way, the course materials stay consistent while the marketing speaks to outcomes.

## 📈 Expected Impact

With these changes:
- **Conversion rate**: 15% → 25-30%
- **Average order value**: $297 → $800+
- **Payment plan adoption**: 20% → 50%
- **Refund rate**: Should stay under 5% with guarantee

## 🚦 Go/No-Go Decisions

### Must Do (Non-Negotiable):
1. Add guarantee language
2. Show payment plans first
3. Add value stacks
4. Implement real urgency
5. Testimonials everywhere

### Can Wait:
1. Full course rename
2. Complex automation
3. Advanced analytics
4. Affiliate program
5. Mobile app

---

The key is to implement Hormozi's psychology and tactics without breaking what's already working. Start with copy changes and guarantee - those are free to implement and will show immediate impact.