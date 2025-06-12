# Pricing Removal Summary

## Changes Made

### 1. Service Pages (`/services/[slug]`)
- **Removed**: Entire "Investment in Your Wellbeing" pricing section (lines 192-296)
- **Impact**: All 6 service pages no longer display pricing information
- **Services affected**:
  - Therapy for Women
  - Therapy for Moms
  - Parent Support
  - Anxiety & Stress Management
  - Postpartum Depression Support
  - Postpartum Anxiety Support

### 2. Services Data (`/lib/data/services.ts`)
- **Removed**: All `pricing` objects from each service
- **Details removed**:
  - Session fees ($150-$225)
  - Initial consultation (Free 15-minute)
  - Special options (In-home sessions, support groups)
  - Insurance information
  - Sliding scale mentions
  - Payment plans

### 3. FAQ Page (`/app/faq/page.tsx`)
- **Removed**: "What are your therapy fees and payment options?" question
- **Details removed**:
  - Individual Session: $175 for 50 minutes
  - Parent Coaching: $200 for 60 minutes
  - Payment timing and accepted cards

### 4. New Mom Program Booking (`/app/book-new-mom-program/page.tsx`)
- **Removed**: Entire "Insurance & Payment" section
- **Kept**: Session Options section (Virtual, In-Person, Flexible Scheduling)
- **Details removed**:
  - "Most Insurance Accepted"
  - "Super Bills Provided"
  - "Sliding Scale Available"

### 5. Chatbot (`/pages/api/chatbot.ts`)
- **Updated**: Cost response to direct users to contact office
- **Removed**: Sliding-fee scale mentions from:
  - 'cost' response
  - 'insurance' response
  - System prompt

### 6. Postpartum Landing Page (`/pages/ads/postpartum-start.tsx`)
- **Removed**: "Insurance Accepted" trust badge
- **Kept**: Other trust badges (Free Consultation, HIPAA Compliant, Licensed Professionals)

## Remaining References

All direct pricing information has been removed. The following non-pricing references remain:
- Insurance coverage explanations (out-of-network provider status)
- Super Bill availability for reimbursement
- General references to payment without specific amounts

## Verification Complete

✅ No more "Investment in Your Wellbeing" sections
✅ No dollar amounts displayed anywhere
✅ No "sliding scale" mentions
✅ No specific session rates or payment options
✅ Insurance information limited to provider status only