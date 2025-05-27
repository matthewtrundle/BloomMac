# Performance Diagnosis for Score Drop (66 → 49)

## Possible Causes for Lower Score

### 1. **Images Not Loading from Optimized Paths**
- WebP images are created but may not be served properly
- The site might still be loading original PNGs
- Browser might not support WebP fallback

### 2. **JavaScript Bundle Too Large**
- Dynamic imports might not be working correctly
- Too much JavaScript loaded upfront
- Unused code not tree-shaken

### 3. **Render-Blocking Resources**
- CSS not optimized
- Fonts blocking render
- Scripts loading synchronously

### 4. **Missing Critical Optimizations**
- No Service Worker
- No HTTP/2 Push
- No Critical CSS inlining
- No resource hints working

## Immediate Actions to Check

### 1. Verify WebP Images Are Being Served
```bash
# Check Network tab in Chrome DevTools
# Look for image requests - should be .webp not .png
```

### 2. Check JavaScript Bundle Size
```bash
npm run build
npm run analyze
```

### 3. Common Issues After Optimization

1. **Image 404s**: If optimized images aren't found, browser falls back to originals
2. **Increased JavaScript**: Dynamic imports add wrapper code
3. **Layout Shift**: If image dimensions aren't properly set
4. **Font Flash**: If fonts aren't preloaded correctly

## Quick Fixes to Try

### 1. Add Explicit Width/Height to All Images
```tsx
// Instead of using fill, use explicit dimensions
<Image
  src="/images/optimized/Hero/herooptimzed.webp"
  alt="Hero"
  width={1920}
  height={1080}
  sizes="100vw"
  priority
/>
```

### 2. Ensure Responsive Images Work
```tsx
// Add srcSet for responsive images
<Image
  src="/images/optimized/Hero/herooptimzed.webp"
  alt="Hero"
  width={1920}
  height={1080}
  sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 1920px"
  quality={85}
  priority
/>
```

### 3. Check Console for Errors
- 404 errors for images
- JavaScript errors
- Failed lazy loading

### 4. Disable JavaScript and Check
- Site should still show content
- Images should load
- No layout shift

## Lighthouse Specific Issues

Common reasons for score drops:
1. **Largest Contentful Paint (LCP)**: Hero image not optimized
2. **Total Blocking Time (TBT)**: Too much JavaScript
3. **Cumulative Layout Shift (CLS)**: Images without dimensions
4. **First Contentful Paint (FCP)**: Render-blocking resources

## Next Steps

1. Run local Lighthouse audit with DevTools
2. Check Network tab for actual loaded resources
3. Verify no 404s or fallbacks to PNG
4. Check if lazy loading is causing issues
5. Temporarily disable optimizations to isolate issue