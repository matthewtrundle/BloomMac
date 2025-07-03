# Marketing Consent & Newsletter Flow

## Overview
When users check the "Marketing Communications" checkbox during onboarding, they are automatically subscribed to the Bloom Psychology newsletter and entered into an automated email sequence.

## How It Works

### 1. User Opts In During Onboarding
- In the **Consent Step**, users see an optional "Marketing Communications" checkbox
- Text: "I would like to receive helpful wellness tips, course updates, and special offers via email."
- This is **optional** - not required to continue

### 2. Profile Save Triggers Newsletter Signup
When the profile is saved:
- If `marketing_consent` is true, the system calls the newsletter signup endpoint
- User is added to the `subscribers` table with:
  - Email, first name, last name
  - Source: "onboarding"
  - Default interests: ["wellness", "mental-health"]
  - Status: "active"

### 3. Automated Email Sequence Begins
Users receive the **Newsletter Sequence** (5 emails):
1. **Welcome Email** - Sent immediately
   - Welcome message from Dr. Jana
   - What to expect
   - Monthly insights preview
   
2. **Day 3: Quick Wins**
   - 3 simple wellness strategies
   - Encouragement and support
   
3. **Day 7: "Is This Normal?"**
   - Statistics about maternal mental health
   - Normalizing common experiences
   
4. **Day 14: Self-Care Focus**
   - Self-care strategies for busy moms
   - Practical tips
   
5. **Day 30: Check-In**
   - Progress check-in
   - Special offer or discount

### 4. Ongoing Newsletter
After the initial sequence:
- Users receive monthly newsletters
- Content includes wellness tips, blog posts, and updates
- Managed through the Admin Newsletter Dashboard

## Database Changes

### user_profiles table
```sql
marketing_consent BOOLEAN DEFAULT FALSE
```

### Integration Points
1. **ProfileStep.tsx** - Sends marketing_consent with profile data
2. **api/profile/save.ts** - Subscribes to newsletter if consent is true
3. **api/newsletter-signup.ts** - Handles the subscription
4. **Email automation** - Triggers the newsletter sequence

## Admin Management
- View subscribers in `/admin/newsletter`
- Send manual newsletters
- Track subscriber growth
- Manage unsubscribes

## User Control
- Users can unsubscribe anytime via email links
- Future: Dashboard preference management
- GDPR compliant with explicit opt-in

## To Activate

Run this SQL in Supabase:
```sql
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_user_profiles_marketing_consent 
ON user_profiles(marketing_consent) 
WHERE marketing_consent = TRUE;
```