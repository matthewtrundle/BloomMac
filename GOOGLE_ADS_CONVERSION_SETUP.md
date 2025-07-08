# Google Ads Conversion Tracking Setup for Calendly

## 🎯 Step 1: Create the Conversion Action in Google Ads

1. In Google Ads, go to **Tools & Settings → Conversions**
2. Click **+ New Conversion Action**
3. Select **Website**
4. Choose **"Create manually using code"**
5. Set these parameters:
   - **Category**: "Submit lead form" or "Book appointment"
   - **Conversion name**: "Calendly Appointment Booking"
   - **Value**: "Don't use a value" (or set a value if you want)
   - **Count**: "One conversion per click"
   - **Conversion window**: 30 days
   - **Attribution model**: "Data-driven" (recommended)

## 🏷️ Step 2: Get Your Conversion ID and Label

After creating the conversion action, Google will provide:
- **Conversion ID**: Something like `AW-123456789`
- **Conversion Label**: Something like `AbC-D_efG-h12_34-567`

## 📝 Step 3: Add to Your Website

### Option A: Global Site Tag (Already Installed)
If you already have Google Analytics or the global site tag, skip this part.

### Option B: Add to Your Site
Add this to your root layout if not already present:
```tsx
// In app/layout.tsx
import Script from 'next/script'

<Script
  src={`https://www.googletagmanager.com/gtag/js?id=AW-XXXXXXXXX`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'AW-XXXXXXXXX');
  `}
</Script>
```

## 🔗 Step 4: Configure Calendly Redirect

1. **In Calendly Event Type Settings:**
   - Go to your event type
   - Click "Edit"
   - Go to "Confirmation page"
   - Select "Redirect to an external site"
   - Enter: `https://yoursite.com/booking-confirmed?event_type={event_type_name}`

2. **Update the Conversion Code:**
   In `/app/booking-confirmed/page.tsx`, replace the conversion tracking code:
   ```javascript
   (window as any).gtag('event', 'conversion', {
     'send_to': 'AW-XXXXXXXXX/YOUR_CONVERSION_LABEL',
     'value': 0.0,
     'currency': 'USD',
   });
   ```

## 🧪 Step 5: Test Your Setup

1. **Use Google Tag Assistant:**
   - Install the Chrome extension
   - Visit your booking confirmation page
   - Verify the conversion fires

2. **Test Booking Flow:**
   - Go through a test booking on Calendly
   - Ensure you're redirected to `/booking-confirmed`
   - Check Google Ads for conversion data (may take 24 hours)

## 🚀 Alternative Methods

### Method 1: Calendly Webhooks (Advanced)
```javascript
// Create an API endpoint at /api/calendly-conversion
export async function POST(request: Request) {
  const event = await request.json();
  
  if (event.event === 'invitee.created') {
    // Server-side conversion tracking
    await fetch(`https://www.google.com/pagead/conversion/${CONVERSION_ID}/?...`);
  }
}
```

### Method 2: Thank You Page Pixel
Instead of redirect, show a custom confirmation with pixel:
```html
<!-- On Calendly confirmation -->
<img src="https://www.googleadservices.com/pagead/conversion/XXXXXXXXX/?label=XXXXXXXXX&guid=ON&script=0" />
```

## 📊 Verification Checklist

- [ ] Conversion action created in Google Ads
- [ ] Conversion ID and Label saved
- [ ] Booking confirmation page created
- [ ] Calendly redirect configured
- [ ] Test booking completed
- [ ] Conversion showing in Google Ads (wait 24h)

## 🔍 Troubleshooting

1. **No conversions showing:**
   - Check if redirect URL is correct
   - Verify gtag code is firing (use Tag Assistant)
   - Wait 24-48 hours for data

2. **Multiple conversions:**
   - Change to "One conversion per click"
   - Add deduplication logic

3. **Wrong value:**
   - Update the value parameter in the gtag event
   - Or set to "Don't use a value"

## 💡 Pro Tips

1. **Enhanced Conversions**: Enable this in Google Ads for better matching
2. **Offline Conversions**: Upload completed appointments later
3. **Call Tracking**: Set up a separate conversion for phone calls
4. **Value Tracking**: Assign values based on service type

Need help? The booking confirmation page is ready at `/booking-confirmed` - just add your conversion ID!