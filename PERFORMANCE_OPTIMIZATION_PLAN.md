# Bloom Psychology Performance Optimization Plan

## Current Performance Issues Identified

### 1. Image Optimization Issues
- **Problem**: Large PNG images (biff* images are likely unoptimized)
- **Impact**: Slow initial page load, high bandwidth usage
- **Evidence**: 40+ blog images, hero images, service images all in PNG format

### 2. JavaScript Bundle Size
- **Problem**: Large client-side bundles with unnecessary dependencies
- **Impact**: Slow Time to Interactive (TTI)
- **Potential issues**:
  - Framer Motion loaded on every page
  - Full Tailwind CSS bundle
  - Unused component code

### 3. Render Blocking Resources
- **Problem**: CSS and JS blocking initial render
- **Impact**: Slow First Contentful Paint (FCP)
- **Areas to check**:
  - Font loading strategy
  - Critical CSS extraction
  - JavaScript loading order

### 4. Component Loading Strategy
- **Problem**: All components loaded upfront
- **Impact**: Unnecessary JavaScript execution
- **Components to optimize**:
  - CalendlyEmbed (heavy third-party script)
  - ChatBot
  - ExitIntentPopup (removed but check for remnants)
  - Analytics scripts

## Proposed Optimization Strategy

### Phase 1: Image Optimization (Highest Impact)

#### 1.1 Convert Images to Next-Gen Formats
```bash
# Convert all biff* PNGs to WebP and AVIF
# Expected size reduction: 60-80%
```
- Use Sharp to batch convert images
- Implement responsive image sizes
- Add blur placeholders for all images

#### 1.2 Implement Proper Image Components
```tsx
// Replace all img tags with optimized Next.js Image
// Add proper width/height to prevent layout shift
// Implement lazy loading for below-fold images
```

#### 1.3 Image CDN Setup
- Configure Next.js image optimization
- Set up proper caching headers
- Consider external CDN for static assets

### Phase 2: Code Splitting & Lazy Loading

#### 2.1 Dynamic Imports for Heavy Components
```tsx
// Components to lazy load:
const CalendlyEmbed = dynamic(() => import('@/components/CalendlyEmbed'), {
  loading: () => <div>Loading scheduler...</div>,
  ssr: false
});

const ChatBot = dynamic(() => import('@/components/ui/ChatBot'), {
  loading: () => null,
  ssr: false
});

const NewsletterSignup = dynamic(() => import('@/components/ui/NewsletterSignup'));
```

#### 2.2 Route-Based Code Splitting
- Ensure each route only loads necessary code
- Move page-specific components to page files
- Implement proper prefetching strategy

### Phase 3: CSS Optimization

#### 3.1 Purge Unused Tailwind Classes
```js
// tailwind.config.js updates
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  // Add safelist for dynamic classes
}
```

#### 3.2 Critical CSS Extraction
- Inline critical above-fold CSS
- Load non-critical CSS asynchronously
- Remove unused animations

### Phase 4: JavaScript Optimization

#### 4.1 Bundle Analysis & Tree Shaking
```bash
# Run bundle analyzer
ANALYZE=true npm run build
```
- Remove unused imports
- Replace heavy libraries with lighter alternatives
- Implement proper tree shaking

#### 4.2 Third-Party Script Optimization
```tsx
// Load scripts only when needed
<Script 
  src="https://www.googletagmanager.com/gtag/js" 
  strategy="afterInteractive" 
/>
```

### Phase 5: Server & Caching Optimization

#### 5.1 Static Generation for Blog Posts
```tsx
// Ensure all blog posts are statically generated
export async function generateStaticParams() {
  return blogPosts.map(post => ({ slug: post.slug }));
}
```

#### 5.2 API Route Optimization
- Add proper caching headers
- Implement request deduplication
- Optimize database queries

#### 5.3 Edge Runtime for Lightweight Routes
```tsx
export const runtime = 'edge'; // For lightweight API routes
```

### Phase 6: Core Web Vitals Optimization

#### 6.1 Reduce Layout Shift (CLS)
- Add explicit dimensions to all images
- Reserve space for dynamic content
- Fix font loading flash

#### 6.2 Improve First Input Delay (FID)
- Reduce main thread blocking
- Defer non-critical JavaScript
- Optimize event handlers

#### 6.3 Optimize Largest Contentful Paint (LCP)
- Preload hero images
- Optimize server response time
- Implement resource hints

## Implementation Priority & Timeline

### Immediate Actions (Day 1)
1. Image optimization and conversion
2. Implement lazy loading for heavy components
3. Add proper image dimensions

### Short Term (Days 2-3)
1. Code splitting implementation
2. CSS optimization
3. Bundle size reduction

### Medium Term (Week 2)
1. Caching strategy implementation
2. Third-party script optimization
3. Performance monitoring setup

## Expected Results

### Performance Metrics Goals
- **First Contentful Paint**: < 1.5s (from ~3-4s)
- **Time to Interactive**: < 3.5s (from ~6-8s)
- **Total Bundle Size**: < 200KB (from ~500KB+)
- **Image Sizes**: 60-80% reduction
- **Lighthouse Score**: 90+ (from ~50-60)

### Business Impact
- Reduced bounce rate by 30-50%
- Improved SEO rankings
- Better mobile experience
- Lower bandwidth costs

## Monitoring & Testing

### Tools to Use
1. Lighthouse CI for automated testing
2. Web Vitals monitoring
3. Real User Monitoring (RUM)
4. Bundle size tracking

### Testing Checklist
- [ ] Test on slow 3G connection
- [ ] Test on low-end devices
- [ ] Verify all functionality still works
- [ ] Check accessibility isn't impacted
- [ ] Validate SEO elements remain intact

## Rollback Plan
- Keep backups of all original files
- Implement changes incrementally
- Test each optimization separately
- Have quick rollback process ready

## Questions Before Implementation

1. **Image Quality**: What quality level is acceptable for images? (85% is usually good)
2. **Browser Support**: Do we need to support older browsers?
3. **Analytics**: Should we add performance tracking?
4. **CDN Budget**: Is there budget for a CDN service?
5. **Development vs Production**: Should we implement different strategies for each?

## Next Steps
1. Review and approve this plan
2. Prioritize which optimizations to implement first
3. Set up performance monitoring baseline
4. Begin implementation with highest-impact items