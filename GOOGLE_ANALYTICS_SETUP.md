# Google Analytics 4 (GA4) Setup Guide

## Overview
Google Analytics 4 is now integrated into the Bloom Psychology website. The implementation includes:
- Automatic page view tracking
- Custom event tracking for all interactions
- Integration with the existing analytics system
- Privacy-compliant implementation

## Setup Steps

### 1. Create a Google Analytics 4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click on "Admin" (gear icon)
3. Under "Property", click "Create Property"
4. Enter property details:
   - Property name: "Bloom Psychology"
   - Reporting time zone: Your local timezone
   - Currency: USD
5. Click "Next" and fill in business details
6. Click "Create" and accept the terms

### 2. Get Your Measurement ID

1. In your new property, go to Admin > Data Streams
2. Click "Add stream" > "Web"
3. Enter your website URL: `https://www.bloompsychologynorthaustin.com`
4. Stream name: "Bloom Psychology Website"
5. Click "Create stream"
6. Copy the Measurement ID (starts with "G-")

### 3. Add the Measurement ID to Your Environment

Add the following to your `.env.local` file:

```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID.

### 4. Deploy and Verify

1. Deploy your changes to production
2. Visit your website
3. In Google Analytics, go to Reports > Realtime
4. You should see your visit appear in real-time

## Events Being Tracked

The following events are automatically tracked:

### Standard Events
- `page_view` - Every page visit
- `scroll` - 90% scroll depth (GA4 enhanced measurement)
- `click` - Outbound link clicks (GA4 enhanced measurement)

### Custom Events
- `contact_form` - Contact form submissions
- `booking_click` - Booking/consultation clicks
- `newsletter_signup` - Newsletter signups
- `new_mom_signup` - New mom program signups
- `resource_download` - Resource PDF downloads
- `chatbot_interaction` - Chatbot interactions
- `exit_intent` - Exit intent popup shown
- `scroll_banner` - Scroll banner interactions

## Testing Your Implementation

### Using Google Analytics DebugView

1. Install the [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna) Chrome extension
2. Enable the extension
3. Visit your website
4. In GA4, go to Admin > DebugView
5. You should see your events appearing in real-time

### Using Browser Console

Open your browser console and look for messages like:
- "Event tracked: page_view /"
- "Event tracked: contact_form /contact"

## Custom Event Implementation

The analytics system automatically sends events to both:
1. Your internal analytics API (`/api/track-event`)
2. Google Analytics 4 (if configured)

To track a custom event, use:

```javascript
import { analytics } from '@/lib/analytics';

// Track a custom event
analytics.trackEvent({
  type: 'custom_event_name',
  page: '/current-page',
  data: {
    action: 'specific_action',
    value: 'event_value'
  }
});
```

## Privacy Compliance

The implementation:
- Respects user privacy choices
- Does not collect personally identifiable information (PII)
- Uses Google's privacy-safe features
- Implements IP anonymization by default

## Conversion Tracking

To set up conversion tracking in GA4:

1. Go to Admin > Events
2. Find the event you want to track as a conversion
3. Toggle "Mark as conversion"
4. Common conversions to track:
   - `contact_form`
   - `booking_click`
   - `newsletter_signup`
   - `new_mom_signup`

## Goals and Audiences

### Recommended Goals
1. Contact form submissions
2. Booking/consultation clicks
3. Newsletter signups
4. Time on site > 2 minutes
5. Pages per session > 3

### Recommended Audiences
1. Engaged visitors (time > 2 min OR pages > 3)
2. High-intent users (visited contact OR booking page)
3. Resource downloaders
4. Returning visitors

## Reports to Monitor

### Key Reports
1. **Acquisition**: Traffic sources and campaigns
2. **Engagement**: Pages, events, and conversions
3. **Demographics**: User characteristics
4. **Tech**: Devices and browsers
5. **Realtime**: Current activity

### Custom Reports
Consider creating custom reports for:
- Service page performance
- Blog engagement
- Conversion funnel analysis
- Source/medium performance

## Troubleshooting

### Events Not Appearing
1. Check that `NEXT_PUBLIC_GA_ID` is set correctly
2. Verify the Measurement ID starts with "G-"
3. Check browser console for errors
4. Ensure ad blockers are disabled for testing
5. Wait 24-48 hours for full data processing

### Page Views Missing
1. Check that AnalyticsProvider wraps your app
2. Verify navigation is being tracked
3. Check for JavaScript errors

### Need Help?
- [GA4 Documentation](https://support.google.com/analytics/answer/9304153)
- [GA4 Event Reference](https://support.google.com/analytics/answer/9322688)
- [Debug Your Implementation](https://support.google.com/analytics/answer/9333209)