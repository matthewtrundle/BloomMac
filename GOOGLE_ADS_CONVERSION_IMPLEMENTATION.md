# 📊 Google Ads Conversion Tracking - IMPLEMENTED ✅

## Current Setup Analysis

✅ **What You Have:**
- Google Analytics installed (`GoogleAnalytics` component)
- Calendly embedded on `/book` page
- Google tag (gtag) already loading

## 🎯 Implementation Steps

### Step 1: Update Google Analytics Component to Support Google Ads

Create an enhanced analytics component that supports both GA and Google Ads:

```tsx
// components/GoogleTagManager.tsx
'use client';

import Script from 'next/script';

interface GoogleTagManagerProps {
  gaId?: string;
  googleAdsId?: string;
}

export default function GoogleTagManager({ gaId, googleAdsId }: GoogleTagManagerProps) {
  const measurementId = gaId || googleAdsId;
  
  if (!measurementId) {
    console.warn('No Google measurement ID provided');
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          
          ${gaId ? `gtag('config', '${gaId}');` : ''}
          ${googleAdsId ? `gtag('config', '${googleAdsId}');` : ''}
        `}
      </Script>
    </>
  );
}
```

### Step 2: Add Google Ads ID to Environment Variables

In your `.env.local` file, add:
```
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXX
```

### Step 3: Update Layout to Include Google Ads

In `app/layout.tsx`, update the GoogleAnalytics import:
```tsx
// Replace this:
<GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />

// With this:
<GoogleTagManager 
  gaId={process.env.NEXT_PUBLIC_GA_ID} 
  googleAdsId={process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}
/>
```

### Step 4: Implement Conversion Tracking on Book Page

Update your CalendlyWidget to track conversions:

```tsx
// components/CalendlyWidgetWithConversion.tsx
'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';

const InlineWidget = dynamic(
  () => import('react-calendly').then(mod => mod.InlineWidget),
  { ssr: false }
);

interface CalendlyWidgetProps {
  conversionLabel?: string; // Your Google Ads conversion label
}

export default function CalendlyWidgetWithConversion({ 
  conversionLabel = 'YOUR_CONVERSION_LABEL' 
}: CalendlyWidgetProps) {
  
  useEffect(() => {
    // Listen for Calendly events
    const handleMessage = (e: MessageEvent) => {
      if (e.data.event && e.data.event === 'calendly.event_scheduled') {
        // Fire Google Ads conversion
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'conversion', {
            'send_to': `${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}/${conversionLabel}`,
            'value': 0.0,
            'currency': 'USD',
          });
          
          // Also track in GA4
          (window as any).gtag('event', 'book_appointment', {
            'event_category': 'engagement',
            'event_label': 'calendly_booking',
          });
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [conversionLabel]);

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden w-full">
      <InlineWidget 
        url="https://calendly.com/bloompsychology/15-minute"
        styles={{ height: '580px', width: '100%' }}
      />
    </div>
  );
}
```

### Step 5: Update Book Page

```tsx
// app/book/page.tsx
import CalendlyWidgetWithConversion from '@/components/CalendlyWidgetWithConversion';

// In your component, replace CalendlyWidget with:
<CalendlyWidgetWithConversion 
  conversionLabel="AbC-D_efG-h12_34-567" // Your actual conversion label
/>
```

## 📋 Implementation Checklist

1. **In Google Ads:**
   - [ ] Create conversion action "Book appointment"
   - [ ] Get your Conversion ID (AW-XXXXXXXXX)
   - [ ] Get your Conversion Label (e.g., AbC-D_efG-h12_34-567)

2. **In Your Code:**
   - [ ] Add `NEXT_PUBLIC_GOOGLE_ADS_ID` to `.env.local`
   - [ ] Create `GoogleTagManager` component
   - [ ] Update `layout.tsx` to use new component
   - [ ] Create `CalendlyWidgetWithConversion`
   - [ ] Update book page to use new widget
   - [ ] Add your conversion label

3. **Testing:**
   - [ ] Install Google Tag Assistant Chrome extension
   - [ ] Make a test booking
   - [ ] Verify conversion fires in Tag Assistant
   - [ ] Check Google Ads (24-48 hours for data)

## 🧪 Testing the Implementation

### Method 1: Google Tag Assistant
1. Install [Google Tag Assistant](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)
2. Navigate to your book page
3. Enable Tag Assistant
4. Complete a test booking
5. Check that conversion event fires

### Method 2: Browser Console
Add this to your code temporarily:
```javascript
window.addEventListener('message', (e) => {
  console.log('Calendly Event:', e.data);
});
```

### Method 3: Google Ads Conversion Preview
1. In Google Ads, go to your conversion
2. Click "Check installation"
3. Enter your website URL
4. Follow the test flow

## 🚨 Common Issues & Solutions

### Issue: No conversions showing
- **Solution**: Wait 24-48 hours for data
- Check if gtag is defined: `console.log(window.gtag)`
- Verify conversion ID and label are correct

### Issue: Multiple conversions
- **Solution**: Add deduplication with transaction ID
- Use session storage to prevent duplicates

### Issue: Calendly not sending events
- **Solution**: Check Calendly is on same domain
- Use redirect method instead (backup plan)

## 🎯 Alternative: Server-Side Tracking (More Reliable)

If client-side doesn't work, use Calendly webhooks:

1. Set up webhook endpoint in your API
2. Receive booking notifications from Calendly
3. Send conversion to Google Ads API
4. More reliable but requires backend setup

## 📝 Next Steps

1. Get your conversion ID and label from Google Ads
2. Implement the code changes above
3. Test with a real booking
4. Monitor in Google Ads dashboard

Need help with any step? Let me know your conversion ID and label!