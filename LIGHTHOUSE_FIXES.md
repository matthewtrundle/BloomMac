# Lighthouse Performance Fixes

## Issues That Could Cause Score Drop to 49

### 1. **Hero Image Not Using Responsive Sizes**
The hero image might be loading the full-size image on mobile devices.

**Fix:**
```tsx
// In app/page.tsx, update hero image
<Image
  src={heroImage}
  alt="Bloom Psychology hero"
  fill
  className="object-cover"
  style={{ objectPosition: '50% 20%' }}
  quality={85}
  sizes="(max-width: 640px) 100vw, (max-width: 1200px) 100vw, 100vw"
  priority
  placeholder="blur"
  blurDataURL="data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA="
/>
```

### 2. **Missing Image Placeholder Data**
Images without blur placeholders cause layout shift.

### 3. **JavaScript Execution Time**
Motion components might still be loading even though we removed framer-motion.

### 4. **Font Loading Strategy**
Fonts might be render-blocking.

**Fix in app/layout.tsx:**
```tsx
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  adjustFontFallback: true // Add this
});
```

### 5. **Missing meta viewport**
Check if viewport meta tag is properly set.

### 6. **Unused CSS**
Tailwind might be shipping unused styles.

## Quick Wins to Implement Now

1. **Add loading="eager" to hero image** (since it has priority)
2. **Add fetchpriority="high" to hero image**
3. **Ensure all images have blur placeholders**
4. **Add font-display: optional to critical fonts**
5. **Implement Critical CSS**

## Most Likely Culprit

The score drop from 66 to 49 suggests:
- **Largest Contentful Paint (LCP)** got worse
- This is usually the hero image
- The WebP might not be loading correctly
- Or the responsive images aren't working

## Test This First

1. Open Chrome DevTools
2. Go to Network tab
3. Load the site
4. Check if herooptimzed.webp loads or if it falls back to PNG
5. Check the size of the image being loaded