# 🚧 Missing Components To Build

## High Priority (Essential for Launch)

### 1. User Profile Edit Page
**Path:** `/app/profile/edit/page.tsx`
**Features:**
- Edit basic info (name, phone, postpartum date)
- Upload profile photo
- Update emergency contacts
- Change communication preferences
- Save insurance information

### 2. Settings Hub
**Path:** `/app/settings/page.tsx`
**Sections:**
- Account Settings
- Notification Preferences (Email/SMS/Push)
- Privacy Settings (existing)
- Payment Methods (link to existing)
- Connected Apps
- Data Export

### 3. Appointment Management Enhancements
**Updates to:** `/app/appointments/page.tsx`
**Add:**
- Cancel appointment button with policy warning
- Reschedule appointment (opens Calendly)
- Session notes viewer (after appointment)
- Add to calendar button
- SMS reminder opt-in toggle

### 4. Notification Preferences Component
**Path:** `/components/settings/NotificationPreferences.tsx`
**Options:**
- Email notifications (by type)
- SMS reminders (on/off + timing)
- In-app notifications
- Marketing emails opt-out
- Reminder frequency

## Medium Priority (Nice to Have)

### 5. Achievements Page
**Path:** `/app/achievements/page.tsx`
**Features:**
- Grid of all possible achievements
- Progress bars for in-progress achievements
- Earned vs unearned visual distinction
- Share achievement feature
- Achievement details modal

### 6. Activity History
**Path:** `/app/activity/page.tsx`
**Shows:**
- Login history
- Course progress timeline
- Appointment history
- Wellness check-ins
- Payment history

### 7. Wellness Tracker Enhancement
**Path:** `/app/wellness/page.tsx`
**Add:**
- Historical data charts
- Export wellness data
- Weekly/monthly summaries
- Trend analysis

## Low Priority (Future Features)

### 8. Account Management
**Path:** `/app/account/page.tsx`
**Features:**
- Export all user data (GDPR)
- Delete account option
- Pause account
- Linked accounts (Google, Apple)

### 9. Referral System
**Path:** `/app/referrals/page.tsx`
**Features:**
- Unique referral code
- Track referrals
- Reward system
- Social sharing

### 10. Help Center Integration
**Path:** `/app/help/page.tsx`
**Features:**
- FAQ search
- Contact support
- Video tutorials
- Live chat widget

## Implementation Priority Order

### Week 1: Core Missing Features
1. User Profile Edit Page
2. Notification Preferences
3. Appointment Cancellation UI

### Week 2: Settings & Management
4. Settings Hub
5. Achievement Details Page
6. Activity History

### Week 3: Polish & Enhancement
7. Wellness Tracker Charts
8. Account Management
9. Help Center

## Quick Wins (Can implement immediately)

### 1. Add Profile Edit Button to Dashboard
```tsx
// In /app/dashboard/page.tsx
<Link href="/profile/edit">
  <Button variant="outline">Edit Profile</Button>
</Link>
```

### 2. Add Settings Link to Navigation
```tsx
// In navigation component
<Link href="/settings">
  <Settings className="h-5 w-5" />
  <span>Settings</span>
</Link>
```

### 3. Add Appointment Actions
```tsx
// In appointment card component
<Button onClick={handleCancel} variant="outline" size="sm">
  Cancel Appointment
</Button>
<Button onClick={handleReschedule} variant="outline" size="sm">
  Reschedule
</Button>
```

## Database Ready ✅
All these features can use existing database tables:
- `user_profiles` - Profile edits
- `user_preferences` - Settings storage
- `user_notifications` - Notification prefs
- `appointment_data` - Cancellations
- `user_achievements` - Achievement page

## Next Steps
1. Start with User Profile Edit Page (highest impact)
2. Build Notification Preferences (user retention)
3. Enhance Appointment Management (better UX)
4. Create Settings Hub (centralize everything)