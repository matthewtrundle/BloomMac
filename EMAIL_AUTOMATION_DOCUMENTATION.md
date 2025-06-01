# Email Automation Documentation - Bloom Psychology

## Overview
This document outlines all automated email sequences and their triggers in the Bloom Psychology system. The system uses Resend for email delivery and Supabase for tracking and automation.

## Email Sequences & Triggers

### 1. Newsletter Signup Sequence
**Trigger**: When someone signs up for the newsletter via any form on the website

#### Email Flow:
1. **Welcome Email** - Sent immediately
   - Subject: "Welcome to Your Journey of Growth with Bloom Psychology 🌸"
   - Contains: Welcome message, free resource link (5 Grounding Techniques), what to expect
   - Includes: Call-to-action for free consultation

2. **3-Day Check-In** - Sent after 72 hours
   - Subject: "3 Quick Wins for Your Mental Wellness Journey 🌟"
   - Contains: 3 simple mental health practices (Morning Bloom Ritual, 5-4-3-2-1 Grounding, Gratitude Glow-Up)
   - Includes: Gentle invitation to book consultation

3. **Week 1 Check-In** - Sent after 7 days (168 hours)
   - Subject: "Is This Normal? (Spoiler: You're Not Alone) 🤗"
   - Contains: Sarah's story (client testimonial), mental health statistics, common questions
   - Includes: Reassurance and booking invitation

4. **2-Week Self-Care Reminder** - Sent after 14 days (336 hours)
   - Subject: "Your Self-Care Isn't Selfish (Here's Why) 💅✨"
   - Contains: Self-care myth busting, 5-minute self-care ideas, bonus self-care toolkit
   - Includes: Encouragement to prioritize mental health

5. **30-Day Check-In** - Sent after 30 days (720 hours)
   - Subject: "One Month Later: How Are You Really? 💭"
   - Contains: Reflection prompts, Sarah's journey timeline, special offer ($25 off first session)
   - Includes: Time-limited discount code (48 hours)

### 2. Contact Form Follow-Up Sequence
**Trigger**: When someone submits the contact form on the website

#### Email Flow:
1. **Immediate Confirmation** - Sent immediately
   - Subject: "We Got Your Message! Here's What Happens Next 💌"
   - Contains: Timeline of response, helpful resources while waiting
   - Note: This goes to the person who submitted the form

2. **Admin Notification** - Sent immediately
   - To: jana@bloompsychologynorthaustin.com (CC: matt@bloompsychologynorthaustin.com)
   - Contains: Form submission details

3. **72-Hour Follow-Up** - Sent after 72 hours (if no booking made)
   - Subject: "Still Here for You (No Pressure!) 🤗"
   - Contains: Gentle check-in, reminder of options, scheduling link

4. **7-Day Resources Email** - Sent after 7 days (168 hours)
   - Subject: "Free Resources to Support Your Journey 🎁"
   - Contains: Links to free resources (calm kit, self-assessment, new mom guide, podcast)

### 3. Booking Confirmation Sequence
**Trigger**: When someone books a consultation through Calendly/booking system

#### Email Flow:
1. **Booking Confirmation** - Sent immediately
   - Subject: "Yay! Your Consultation is Confirmed 🎉"
   - Contains: Appointment details, how to prepare, what to expect
   - Note: Currently handled by Calendly, not the custom system

2. **24-Hour Reminder** - Sent 24 hours before appointment
   - Subject: "See You Tomorrow! Quick Reminder 📅✨"
   - Contains: Appointment reminder, last-minute tips, tech check reminders

3. **48-Hour Post-Consultation Follow-Up** - Sent 48 hours after appointment
   - Subject: "How Was Your Consultation? We'd Love to Know! 💭"
   - Contains: Feedback request, booking options, special offer ($20 off if booked within 48 hours)

### 4. Lead Nurture Sequence (Resource Downloads)
**Trigger**: When someone downloads a free resource from the website

#### Email Flow:
1. **Resource Delivery** - Sent immediately
   - Subject: "Your Resource is Here! Plus a Little Extra 🎁"
   - Contains: Download link, quick-start tips, therapy invitation

2. **72-Hour Check-In** - Sent after 72 hours
   - Subject: "Quick Check: Is Your Resource Helping? 🤔"
   - Contains: Reflection questions, common roadblocks, success story

3. **7-Day Success Story** - Sent after 7 days (168 hours)
   - Subject: "From Struggling to Thriving: Sarah's Story 🌟"
   - Contains: Detailed client success story, journey timeline, booking invitation

4. **14-Day No-Pressure Check-In** - Sent after 14 days (336 hours)
   - Subject: "No Rush - Your Timeline is the Right Timeline ⏰💕"
   - Contains: Support options (blog, podcast, support circles), gentle reminder

## Technical Implementation

### Email Sending
- **Service**: Resend API
- **From Address**: Dr. Jana Rundle <jana@bloompsychologynorthaustin.com>
- **Tracking**: Open tracking pixels and click tracking on all links

### Automation Processing
- **Storage**: Supabase tables
  - `subscribers` - Newsletter subscribers
  - `contact_submissions` - Contact form submissions
  - `email_automation_logs` - Tracks sent emails
  - `email_templates_custom` - Custom email templates

### Trigger Points
1. **Newsletter Signup**: `/api/newsletter-signup` endpoint
2. **Contact Form**: `/api/send-email` endpoint
3. **Booking**: Currently external (Calendly)
4. **Resource Download**: Various download endpoints

### Email Personalization
All emails support the following variables:
- `{{firstName}}` or `{{name}}` - Recipient's name
- `{{email}}` - Recipient's email
- `{{resourceName}}` - For resource download emails
- `{{appointmentDetails}}` - For booking emails

### Unsubscribe Handling
- All emails include unsubscribe links
- Unsubscribe updates subscriber status in database
- Prevents future automated emails

## Testing & Monitoring

### Test Mode
- In development, emails go to: matthewtrundle@gmail.com
- Production emails go to actual recipients

### Email Analytics Tracked
- Open rates (via tracking pixel)
- Click rates (via URL redirection)
- Unsubscribe rates
- Bounce handling (via Resend webhooks)

## Special Offers & Time-Sensitive Elements

1. **30-Day Newsletter Sequence**: 
   - $25 off first session
   - Code: BLOOM30
   - Expires: 48 hours after email sent

2. **Post-Consultation Follow-Up**:
   - $20 off first full session
   - Must book within 48 hours

## Admin Management

### Email Editor Access
- Location: `/admin/email-editor`
- Authentication: Same as admin backend
- Capabilities: Edit subject lines and content for all emails

### Monitoring
- Activity logs: `/admin/activity`
- Email analytics: `/admin/email`
- Subscriber management: `/admin/newsletter`

## Important Notes

1. **Consent**: All email recipients have explicitly opted in
2. **Frequency**: Maximum 1 email per sequence step to avoid spam
3. **Timing**: Emails respect timezone (currently all CST)
4. **Privacy**: All emails include privacy policy link
5. **Testing**: Always test email changes before deploying

## Future Enhancements Planned
- Birthday emails
- Anniversary emails (1 year since first session)
- Re-engagement campaigns for inactive subscribers
- Seasonal mental health tips
- Workshop/event announcements

---

Last Updated: January 2025