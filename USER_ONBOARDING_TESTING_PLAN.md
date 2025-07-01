# User Onboarding Flow Testing Plan

## Overview
This plan tests the complete user journey from signup through profile setup, including the new onboarding flow, appointment booking, and dashboard features we've built.

## Test Environment Setup

### Prerequisites:
1. Clear browser cache/cookies
2. Use incognito/private browsing for clean tests
3. Have test payment method ready (Stripe test card: 4242 4242 4242 4242)
4. Test email address that you can access

## 1. User Registration Flow

### Test 1.1: New User Signup
**URL:** https://bloompsychologynorthaustin.com/auth/signup

**Test Steps:**
1. Click "Get Started" or "Sign Up" button
2. Enter test data:
   - Email: testuser-[timestamp]@example.com
   - Password: TestPass123!
   - First Name: Test
   - Last Name: User
3. Accept terms of service
4. Click "Create Account"

**Verify:**
- ✅ User created in Supabase Auth
- ✅ Verification email sent
- ✅ Redirected to email verification page
- ✅ User profile created in `user_profiles` table

### Test 1.2: Email Verification
1. Check email for verification link
2. Click verification link
3. Verify:
   - ✅ Email marked as verified
   - ✅ Redirected to onboarding flow
   - ✅ Can now access authenticated pages

### Test 1.3: Existing User Login
**URL:** https://bloompsychologynorthaustin.com/auth/login

1. Enter credentials from Test 1.1
2. Click "Sign In"
3. Verify:
   - ✅ Successfully authenticated
   - ✅ Redirected to dashboard or intended page
   - ✅ Session persists on page refresh

## 2. Onboarding Flow Testing

### Test 2.1: First-Time User Onboarding
**URL:** https://bloompsychologynorthaustin.com/onboarding

**Step 1: Welcome**
- ✅ Displays welcome message
- ✅ Shows user's name
- ✅ "Get Started" button works

**Step 2: Personal Information**
```
- Phone: (555) 123-4567
- Date of Birth: 01/01/1990
- Gender: [Select option]
- Pronouns: [Select option]
```
Verify:
- ✅ Form validation works
- ✅ Phone number formatting automatic
- ✅ Can proceed to next step

**Step 3: Mental Health Goals**
Select 2-3 options:
- [ ] Manage anxiety
- [ ] Improve mood
- [ ] Better sleep
- [ ] Stress management
- [ ] Relationship issues
- [ ] Postpartum support

Verify:
- ✅ Can select multiple options
- ✅ Selections saved

**Step 4: Preferences**
```
- Session Type: [In-person/Virtual/No preference]
- Preferred Days: [Select multiple]
- Preferred Times: [Morning/Afternoon/Evening]
- Insurance: [Select or "Self-pay"]
```

**Step 5: Emergency Contact**
```
- Name: Emergency Contact
- Relationship: Spouse
- Phone: (555) 987-6543
```

**Step 6: Consent & Agreements**
- [ ] Consent to treatment
- [ ] Privacy policy
- [ ] Cancellation policy
- [ ] Communication preferences

**Verify Completion:**
- ✅ All data saved to user_profiles
- ✅ Onboarding marked complete
- ✅ Redirected to dashboard
- ✅ Achievement unlocked: "Profile Complete"

### Test 2.2: Skip and Return
1. Start onboarding
2. Complete 2 steps
3. Close browser/logout
4. Login again
5. Verify:
   - ✅ Returns to correct step
   - ✅ Previous entries saved
   - ✅ Can complete remaining steps

## 3. User Dashboard Testing

### Test 3.1: Dashboard Overview
**URL:** https://bloompsychologynorthaustin.com/dashboard

**Verify Display:**
- ✅ Welcome message with user's name
- ✅ Upcoming appointments (if any)
- ✅ Recent activity
- ✅ Quick actions available
- ✅ Progress indicators

### Test 3.2: Navigation
Test each dashboard section:
- [ ] My Appointments
- [ ] My Profile
- [ ] My Courses
- [ ] Resources
- [ ] Settings
- [ ] Help & Support

## 4. Profile Management

### Test 4.1: View Profile
**URL:** https://bloompsychologynorthaustin.com/profile

**Verify:**
- ✅ All information from onboarding displayed
- ✅ Profile photo upload works
- ✅ Achievements/badges shown
- ✅ Account created date correct

### Test 4.2: Edit Profile
1. Click "Edit Profile"
2. Update:
   - Phone number
   - Address
   - Emergency contact
3. Save changes
4. Verify:
   - ✅ Changes saved to database
   - ✅ Success notification shown
   - ✅ Updated info displays correctly

### Test 4.3: Therapy Preferences
Update preferences:
- [ ] Preferred therapist
- [ ] Session frequency
- [ ] Communication preferences
- [ ] Appointment reminders

## 5. Appointment Booking Flow

### Test 5.1: Book First Appointment
**URL:** https://bloompsychologynorthaustin.com/appointments/book

1. Click "Book Appointment"
2. Select service type:
   - Initial Consultation
   - Regular Session
   - Specialized Therapy
3. Choose provider (if multiple)
4. Select date and time
5. Add notes (optional)
6. Confirm booking

**Verify:**
- ✅ Appointment created in database
- ✅ Confirmation email sent
- ✅ Calendar invite sent
- ✅ Shows in dashboard
- ✅ Reminder scheduled

### Test 5.2: Manage Appointments
Test each function:
- [ ] View appointment details
- [ ] Reschedule appointment (24hr notice)
- [ ] Cancel appointment
- [ ] Add to personal calendar
- [ ] View appointment history

## 6. Payment Integration

### Test 6.1: Add Payment Method
1. Go to Settings → Payment Methods
2. Add test card: 4242 4242 4242 4242
3. Verify:
   - ✅ Card saved securely
   - ✅ Shows last 4 digits only
   - ✅ Can set as default

### Test 6.2: Session Payment
After appointment:
- ✅ Invoice generated
- ✅ Can view invoice
- ✅ Can download receipt
- ✅ Payment history updated

## 7. Course Access (If Purchased)

### Test 7.1: Course Enrollment
If user purchased a course via Stripe:
1. Go to My Courses
2. Verify:
   - ✅ Purchased course appears
   - ✅ Can access course content
   - ✅ Progress tracking works
   - ✅ Can download materials

### Test 7.2: Course Progress
- [ ] Watch a video lesson
- [ ] Complete a worksheet
- [ ] Track progress
- [ ] Earn achievement badges

## 8. Settings & Preferences

### Test 8.1: Account Settings
**URL:** https://bloompsychologynorthaustin.com/settings

Test each section:
- [ ] Change password
- [ ] Update email (requires verification)
- [ ] Notification preferences
- [ ] Privacy settings
- [ ] Data export request

### Test 8.2: Communication Preferences
Set preferences for:
- [ ] Appointment reminders (email/SMS)
- [ ] Newsletter subscription
- [ ] Promotional emails
- [ ] Care team messages

## 9. Help & Support Features

### Test 9.1: Help Center
- ✅ FAQs accessible
- ✅ Search functionality works
- ✅ Contact support form works
- ✅ Emergency resources visible

### Test 9.2: Resource Library
- ✅ Can browse resources
- ✅ Can download materials
- ✅ Tracks downloaded resources
- ✅ Personalized recommendations

## 10. Mobile Responsiveness

Test entire flow on:
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] Tablet (iPad)

Verify:
- ✅ All forms usable
- ✅ Navigation works
- ✅ Buttons clickable
- ✅ Text readable
- ✅ Images load properly

## Edge Cases to Test

### Test 11.1: Error Handling
- [ ] Invalid email format
- [ ] Weak password
- [ ] Duplicate account
- [ ] Network timeout
- [ ] Payment failure
- [ ] Session expiry

### Test 11.2: Data Validation
- [ ] Required fields enforced
- [ ] Phone number formatting
- [ ] Date validations
- [ ] Character limits respected

## Performance Metrics

### Expected Load Times:
- Signup page: < 2s
- Dashboard: < 3s
- Profile load: < 2s
- Appointment booking: < 2s

### Success Metrics:
- ✅ 100% of forms submittable
- ✅ No console errors
- ✅ All API calls succeed
- ✅ Email delivery confirmed
- ✅ Data persists correctly

## Test User Cleanup

After testing:
1. Document any issues found
2. Delete test users (if needed)
3. Clear test appointments
4. Archive test data

## Issue Tracking Template

```
Issue: [Brief description]
Steps to Reproduce:
1. 
2. 
3. 
Expected Result:
Actual Result:
Browser/Device:
Screenshot: [attach if applicable]
Severity: [Critical/High/Medium/Low]
```

## Rollback Procedures

If critical issues found:
1. Disable user registration temporarily
2. Put up maintenance message
3. Fix issues in staging
4. Re-test thoroughly
5. Deploy fixes
6. Re-enable registration

## Sign-off Checklist

- [ ] All test scenarios completed
- [ ] No critical bugs found
- [ ] Performance acceptable
- [ ] Mobile experience smooth
- [ ] Email delivery working
- [ ] Payment flow secure
- [ ] Data properly saved
- [ ] User experience intuitive
- [ ] Help resources accessible
- [ ] Ready for production use