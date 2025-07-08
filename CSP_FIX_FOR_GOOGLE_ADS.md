# 🔧 CSP Fix for Google Ads Conversion Tracking

## Issue
Google Ads conversion tracking is being blocked by Content Security Policy (CSP) headers:
- `Refused to load the script... because it violates the following Content Security Policy directive`
- `Fetch API cannot load https://www.googleadservices.com/... Refused to connect`

## Solution Applied
Updated `/lib/middleware/security-headers.ts` to allow Google Ads domains:

### Added to `script-src`:
- `https://googleads.g.doubleclick.net`
- `https://www.googleadservices.com`

### Added to `img-src`:
- `https://googleads.g.doubleclick.net`
- `https://www.google.com`

### Added to `connect-src`:
- `https://googleads.g.doubleclick.net`
- `https://www.googleadservices.com`
- `https://www.google.com`
- `https://stats.g.doubleclick.net`

## What You Need to Do

1. **Restart your Next.js server** to apply the CSP changes:
   ```bash
   # Stop the server (Ctrl+C) and start again:
   npm run dev
   ```

2. **Clear browser cache** (important!):
   - Chrome: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
   - Or open DevTools → Network tab → check "Disable cache"

3. **Test again**:
   - Go to `/test-conversion`
   - Open Console
   - Click "Fire Test Conversion"
   - You should NO LONGER see CSP errors
   - Instead, you should see successful network requests to Google

## Verification

### ✅ Good Signs:
- No more CSP errors in console
- Network tab shows successful requests to:
  - `googleads.g.doubleclick.net`
  - `www.googleadservices.com`
- Console shows: `✅ Conversion fired!`

### ❌ If Still Not Working:
1. Make sure you restarted the Next.js server
2. Try in an incognito window
3. Check if you're testing on localhost (some tracking might only work on production)

## Production Deployment
These CSP changes are already committed and will be deployed with your next push.