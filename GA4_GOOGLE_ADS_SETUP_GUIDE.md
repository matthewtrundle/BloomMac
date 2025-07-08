# 📊 GA4 & Google Ads Setup Guide - Bloom Psychology

## 🔧 What We Fixed Today (Jan 8, 2025)

### 1. Google Ads Conversion Tracking for Calendly
- ✅ Added conversion tracking to CalendlyBookingWidget
- ✅ Fixed CSP headers to allow Google Ads domains
- ✅ Conversion fires when someone books through Calendly
- **Conversion ID**: `AW-16914020514`
- **Conversion Label**: `E8GTCPmLruwaEKLxnYE_`

### 2. GA4 Property Mismatch
- ❌ **Issue**: Code was sending to wrong GA4 property
  - Code had: `G-B2NKG26XBE`
  - Actual property: `G-GETD3M62S8`
- ✅ **Fixed**: Updated `.env.local` with correct GA4 ID

### 3. Environment Variables (Production Ready)
```
NEXT_PUBLIC_GA_ID=G-GETD3M62S8
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-16914020514
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=E8GTCPmLruwaEKLxnYE_
```

## 📋 Events Being Tracked

Your site tracks these custom events:
1. **`contact_form_submit`** - When contact form is submitted
2. **`book_appointment`** - When Calendly booking completed  
3. **`newsletter_signup`** - When newsletter signup submitted
4. **`page_view`** - Standard page views (automatic)

## 🎯 Tomorrow's Tasks (After 24 Hours)

### Step 1: Check GA4 Events Report
1. Go to [Google Analytics](https://analytics.google.com)
2. Navigate to **Reports → Engagement → Events**
3. You should see:
   - `contact_form_submit`
   - `book_appointment`
   - `newsletter_signup`
   - Plus standard events (page_view, session_start, etc.)

### Step 2: Mark Events as Conversions in GA4
1. In the Events report, find your custom events
2. Click the star ⭐ next to each event to mark as "Key Event"
3. Mark these as conversions:
   - `contact_form_submit`
   - `book_appointment`

### Step 3: Import Conversions to Google Ads
1. Go to [Google Ads](https://ads.google.com)
2. Navigate to **Tools → Conversions**
3. Click **"+ New conversion action"**
4. Choose **"Import"**
5. Select **"Google Analytics 4 properties"**
6. Select your GA4 property (bloompsychologynorthaustin.com)
7. You should now see your ACTUAL events:
   - `contact_form_submit`
   - `book_appointment`
8. Import the ones you want to track

### Step 4: Add Conversion Goals to Campaigns
1. Go to your **Virtual Therapy - Texas** campaign
2. Click **Settings**
3. Find **"Goals"** section
4. Select your conversions:
   - "Book Appointment" (already set up)
   - Any newly imported GA4 conversions
5. Save

## 🧪 Testing Tools

### Test Conversion Tracking
- **URL**: `/test-conversion`
- **Purpose**: Test Google Ads conversion firing
- **How**: Click "Fire Test Conversion" and check console

### Test GA4 Events  
- **URL**: `/test-ga4-events`
- **Purpose**: Test GA4 event tracking
- **How**: Click event buttons and check GA4 Realtime

## 🔍 Troubleshooting

### If Events Don't Appear in GA4:
1. Check you're looking at the right property (G-GETD3M62S8)
2. Events can take 24-48 hours to appear in regular reports
3. Use Realtime reports for immediate testing
4. Disable ad blockers during testing

### If Google Ads Import Shows Wrong Events:
1. Make sure you marked events as conversions in GA4 first
2. Wait 24 hours after marking as conversions
3. Check you're importing from the correct GA4 property

### If Conversions Show "Inactive":
- This is normal until someone actually converts
- Status will change to "Recording conversions" after first conversion
- Can take 24-48 hours to update

## 📊 Your Analytics Setup

### Google Analytics 4
- **Property**: bloompsychologynorthaustin.com
- **Measurement ID**: G-GETD3M62S8
- **Stream ID**: 10355378459

### Google Ads
- **Account ID**: 750-678-9001
- **Conversion Tracking ID**: AW-16914020514
- **Book Appointment Label**: E8GTCPmLruwaEKLxnYE_

## 🚀 Current Campaign Status

### Campaign 1
- ✅ Has conversion goals
- ✅ Tracking "Book Appointment"

### Virtual Therapy - Texas
- ⚠️ Missing conversion goals
- 📌 **Action Required**: Add "Book Appointment" conversion

## 📝 Quick Reference Commands

### Check if conversions are firing:
1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Filter by "google"
4. Complete action (book/submit form)
5. Look for requests to:
   - `googleads.g.doubleclick.net`
   - `www.googleadservices.com`

### Verify GA4 is working:
```javascript
// In browser console:
console.log(window.gtag); // Should show function
console.log(window.dataLayer); // Should show array
```

## 🎉 Success Checklist

- [x] Google Ads conversion tracking implemented
- [x] GA4 property ID corrected
- [x] CSP headers updated for Google Ads
- [ ] Events marked as conversions in GA4 (wait 24hrs)
- [ ] Conversions imported to Google Ads (after marking in GA4)
- [ ] Virtual Therapy campaign has conversion goals
- [ ] Conversions showing as "Recording" status

---

**Created**: January 8, 2025  
**Last Updated**: January 8, 2025  
**Next Review**: January 9, 2025 (after 24hr event collection)