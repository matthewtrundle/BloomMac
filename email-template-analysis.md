# Email Template Analysis - Bloom Psychology

## 🟢 ACTIVELY USED TEMPLATES

### Newsletter Signup Trigger (`newsletter_signup`)
**Status: ACTIVE - Working correctly**
- Triggered when: User signs up for newsletter (profile settings or public forms)
- Emails sent:
  1. Welcome to Your Journey of Growth with Bloom Psychology 🌸 (immediate)
  2. 3 Quick Wins for Your Mental Wellness Journey 🌟 (3 days)
  3. Is This Normal? (Spoiler: You're Not Alone) 🤗 (7 days)
  4. Your Self-Care Isn't Selfish (Here's Why) 💅✨ (14 days)
  5. One Month Later: How Are You Really? 💭 (30 days)

### Contact Form Trigger (`contact_form`)
**Status: ACTIVE - Working correctly**
- Triggered when: User submits contact form
- Immediate emails (hardcoded in API):
  - Notification to jana@bloompsychologynorthaustin.com
  - Notification to matt@bloompsychologynorthaustin.com
  - Confirmation to customer
- Follow-up sequence:
  1. Thank you for reaching out - We'll be in touch soon! 🌸 (immediate)
  2. Thinking of you - Resources while you wait 💕 (3 days)
  3. Your weekly wellness toolkit 🧰 (7 days)

## 🔴 ARCHIVED/DISABLED TEMPLATES

### Resource Download Trigger (`resource_download`)
**Status: ARCHIVED - Not in use**
- Why archived: All resources are free content on the website, no gated downloads
- Has 4 emails configured but never triggered
- Templates can be deleted

### New Mom Program Trigger (`new_mom_program`)
**Status: DISABLED BY DESIGN - Not in use**
- Why disabled: Bookings handled via Calendly
- Has 0 emails configured
- Trigger never called in codebase

## 🟡 DUPLICATE/ORPHANED TEMPLATES

### In `email_templates` table:
1. **Newsletter Welcome** (3 duplicates!) - OLD VERSION
2. **Newsletter Welcome Back** - ORPHANED
3. **Contact Form Follow-up** - OLD VERSION (replaced by sequence)
4. **New Mom Support Program** - ORPHANED
5. **5 Ways to Manage Daily Anxiety** - ORPHANED

### In `email_templates_custom` table:
1. **bookingConfirmation series** - ORPHANED (no trigger)
2. **contactFollowup series** - OLD VERSION (replaced)
3. **leadNurture series** - ORPHANED (no trigger)
4. **newsletter series** - OLD VERSION (replaced)

### In `sequence_emails` table (Automated):
1. **Welcome Series** - INACTIVE (old newsletter sequence)
2. **Newsletter Signup Sequence** - ✅ ACTIVE (current)
3. **Resource Download Follow-Up** - ARCHIVED
4. **Contact Follow-up** - ✅ ACTIVE (current)

## 📋 CLEANUP RECOMMENDATIONS

### Keep These:
- Newsletter Signup Sequence (5 emails) - ACTIVE
- Contact Follow-up (3 emails) - ACTIVE

### Delete These:
1. All 3 "Newsletter Welcome" duplicates in email_templates
2. "Newsletter Welcome Back" template
3. "New Mom Support Program" template
4. "5 Ways to Manage Daily Anxiety" template
5. All bookingConfirmation templates
6. All leadNurture templates
7. Old contactFollowup templates (keep only sequence_emails version)
8. Old newsletter templates (keep only sequence_emails version)
9. Resource Download Follow-Up sequence and emails
10. Inactive Welcome Series

### Archive These Sequences:
- `resource_download` sequence
- `new_mom_program` sequence
- Old `newsletter_signup` Welcome Series (inactive)

## 🎯 SUMMARY

**Currently Working:**
- Newsletter signup → 5 email sequence over 30 days
- Contact form → Immediate notifications + 3 follow-up emails over 7 days

**Total Templates:**
- 31 templates exist
- Only 11 are actively used (8 sequence emails + 3 hardcoded)
- 20 can be deleted/archived

This will clean up the email center and make it much easier to manage!