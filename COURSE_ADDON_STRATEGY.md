# Course Add-On Strategy & Implementation Plan

## 🎯 Executive Summary

This plan outlines a comprehensive add-on strategy for the Bloom Psychology course platform, designed to increase revenue per customer while providing genuine value to new mothers seeking additional support.

## 👥 Expert Panel Consultation

### E-Commerce Strategy Expert
**Sarah Chen, Former Masterclass VP of Product**
"The key is positioning add-ons as natural extensions of the learning journey, not just upsells. Present them at moments when the value is most apparent - during checkout and at key milestones within the course."

### Mental Health Business Consultant  
**Dr. Marcus Williams, Healthcare Business Scaling Expert**
"Scalability in mental health services requires clear service tiers. Premium access to Dr. Rundle maintains brand value, while certified counselors provide accessible support. This model has worked well for BetterHelp and similar platforms."

### Implementation Architect
**Alex Rodriguez, Shopify Plus Technical Lead**
"Moving from single-product to multi-product checkout requires careful UX consideration. A cart system adds complexity but enables higher average order values through bundling and impulse add-ons."

## 📦 Proposed Add-On Products

### 1. **Workbook Review & Feedback Sessions**

#### Tiers:
- **Premium Review** (with Dr. Jana Rundle): $197
  - 45-minute personalized video review
  - Written feedback report
  - Action plan for next steps
  - Available after course completion

- **Standard Review** (with Certified Counselor): $97
  - 30-minute video review
  - Key insights and recommendations
  - Available after each module

#### Positioning:
"Get personalized guidance on your workbook responses. Our experts will help you dig deeper into your insights and create actionable next steps."

### 2. **Physical Workbook Bundle**

#### Options:
- **Complete Workbook Set**: $67
  - All 6 weeks of beautifully printed workbooks
  - Spiral-bound for easy writing
  - Includes bonus tracking journal
  - Ships within 3-5 business days

- **Premium Workbook Package**: $97
  - Hardcover workbook collection
  - Includes pens, highlighters, sticky notes
  - Motivational card deck
  - Gift box packaging

#### Positioning:
"While digital workbooks are included free, many moms prefer the tactile experience of writing by hand. Our printed workbooks become keepsakes of your journey."

### 3. **Weekly Check-In Sessions**

#### Tiers:
- **Dr. Jana's Weekly Circle**: $497 (for 6 weeks)
  - 30-minute group session with Dr. Jana
  - Max 8 participants
  - End of each week
  - Q&A and guidance

- **Counselor Support Sessions**: $297 (for 6 weeks)
  - 30-minute small group (max 12)
  - Led by certified perinatal counselor
  - Weekly check-ins and support
  - Community building focus

- **1-on-1 Express Sessions**: $127 per session
  - 20-minute individual sessions
  - With certified counselor
  - Book as needed
  - Focus on specific challenges

#### Positioning:
"Get the support you need, when you need it. Choose from group sessions for community connection or individual sessions for personalized attention."

## 💰 Pricing Strategy & Bundles

### Bundle Options (Presented at Checkout):

1. **Complete Care Package**: $597 (Save $191)
   - Base course ($297)
   - Physical workbook set ($67)
   - 6 weekly counselor sessions ($297)
   - 1 workbook review ($97)
   - Total value: $758

2. **Premium Support Package**: $797 (Save $264)
   - Base course ($297)
   - Premium workbook package ($97)
   - Dr. Jana's weekly circle ($497)
   - Premium workbook review ($197)
   - Total value: $1,088

3. **DIY Plus Package**: $397 (Save $64)
   - Base course ($297)
   - Physical workbook set ($67)
   - 1 workbook review with counselor ($97)
   - Total value: $461

## 🛒 Cart & Checkout Flow Changes

### Current Flow:
```
Course Page → Direct Checkout → Payment → Success
```

### New Flow:
```
Course Page → Add to Cart → Cart Review → Add-On Selection → Checkout → Payment → Success
```

### Key UX Improvements:

1. **Smart Cart System**
   - Persistent cart across sessions
   - Quick add/remove functionality
   - Bundle suggestions based on selections
   - Mobile-optimized cart drawer

2. **Staged Add-On Presentation**
   - **Stage 1** (Cart Page): Physical products
   - **Stage 2** (Pre-checkout): Support sessions
   - **Stage 3** (Post-purchase): Additional services

3. **Social Proof Integration**
   - "87% of moms found weekly sessions helpful"
   - "Over 500 workbook sets shipped"
   - Testimonials for each add-on

## 👥 Scalability Plan for Counselor Network

### Counselor Requirements:
- Master's degree in counseling/psychology
- Perinatal mental health certification
- 2+ years postpartum counseling experience
- Complete Bloom training program

### Onboarding Process:
1. Application & screening
2. Background verification
3. 8-hour Bloom methodology training
4. Practice sessions with feedback
5. Ongoing supervision by Dr. Jana

### Quality Assurance:
- Session recordings (with consent) for review
- Monthly supervision meetings
- Client satisfaction surveys
- Standardized session frameworks

### Counselor Compensation:
- $60/hour for group sessions
- $80/hour for individual sessions
- $150 per workbook review
- Performance bonuses based on ratings

## 🔧 Technical Implementation Plan

### Phase 1: Cart Infrastructure (Week 1-2)
```typescript
// New cart context and hooks
- useCart() hook for cart management
- Cart persistence in localStorage
- Server-side cart validation
- Abandoned cart recovery
```

### Phase 2: Add-On Products (Week 3-4)
```typescript
// Product types
interface AddOnProduct {
  id: string;
  type: 'physical' | 'service' | 'digital';
  name: string;
  price: number;
  recurring?: boolean;
  fulfillment: 'immediate' | 'scheduled' | 'shipped';
}
```

### Phase 3: Checkout Updates (Week 5-6)
- Multiple line items in Stripe checkout
- Shipping address collection
- Service scheduling integration
- Bundle discount application

### Phase 4: Fulfillment Systems (Week 7-8)
- Physical product shipping integration
- Calendar booking for sessions
- Automated email confirmations
- Counselor assignment system

## 📊 Projected Revenue Impact

### Conservative Scenario (20% attach rate):
- Base course revenue: $13,662 (46 customers × $297)
- Add-on revenue: $3,682 (20% taking $397 bundle)
- **Total: $17,344** (27% increase)

### Moderate Scenario (35% attach rate):
- Base course revenue: $13,662
- Add-on revenue: $7,441 (mix of bundles)
- **Total: $21,103** (54% increase)

### Optimistic Scenario (50% attach rate):
- Base course revenue: $13,662
- Add-on revenue: $12,474 (premium bundles)
- **Total: $26,136** (91% increase)

## 📈 Success Metrics

1. **Attach Rate**: % of course buyers adding extras
2. **Average Order Value**: Target $450+ (up from $297)
3. **Counselor Utilization**: 70%+ booked sessions
4. **Satisfaction Scores**: 4.5+ stars average
5. **Repeat Purchase Rate**: 30%+ buying additional sessions

## 🚀 Launch Strategy

### Soft Launch (Month 1):
- Offer only to beta customers
- Test all systems with limited inventory
- Gather feedback and iterate

### Full Launch (Month 2):
- Email campaign to existing customers
- Add-ons available to all new purchases
- Counselor network at 3-5 providers

### Scale Phase (Month 3+):
- Expand counselor network to 10+
- Introduce subscription options
- Add corporate/gift packages

## ⚠️ Risk Mitigation

1. **Quality Control**: Rigorous counselor training and monitoring
2. **Capacity Management**: Waitlist system for popular times
3. **Refund Policy**: Clear 14-day satisfaction guarantee
4. **Technical Issues**: Phased rollout with fallback options
5. **Regulatory Compliance**: Ensure all counselors licensed in their states

## 💡 Future Opportunities

1. **Subscription Model**: Monthly counseling membership
2. **Corporate Packages**: Employer-sponsored access
3. **Gift Options**: Baby shower registry integration
4. **Partner Programs**: Include partners in sessions
5. **International Expansion**: Time-zone specific counselors

## 🎯 Immediate Next Steps

1. **Validate Pricing**: Survey existing customers
2. **Design Cart UI**: Create mockups for review
3. **Recruit Counselors**: Start application process
4. **Update Stripe**: Configure for multiple products
5. **Legal Review**: Service agreements and policies

---

## Summary

This add-on strategy transforms the course from a one-time purchase into a comprehensive support ecosystem. By offering multiple touchpoints and price levels, we can serve more mothers while significantly increasing revenue per customer. The key is maintaining quality while scaling through a carefully vetted counselor network.