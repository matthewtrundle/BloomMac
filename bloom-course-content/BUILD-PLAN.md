# Professional Presentation Build Plan

## Current Situation
- We have a browser-saved HTML file as our template (lesson1.html)
- It has embedded styling that makes it look professional
- Other presentations look unprofessional because they're missing the proper CSS
- Image paths are broken

## What Makes the Template Professional
1. **Full-bleed hero images** with text overlays
2. **Magazine-style layouts** with proper spacing
3. **Professional typography** (Cormorant Garamond + Inter)
4. **Smooth animations** and transitions
5. **Cohesive color system** with gradients
6. **High-quality Midjourney images**

## The Right Approach

### Step 1: Extract Clean Template
- Remove browser artifacts (inline styles, saved comments)
- Keep the essential CSS classes
- Fix paths to use CDN for Reveal.js
- Use our local bloom-reveal-theme.css

### Step 2: Create Master Template
- Clean HTML structure
- Proper CSS includes
- Correct image paths
- No browser-generated code

### Step 3: Build Each Lesson
- Use the master template
- Replace content while keeping structure
- Use appropriate images from our library
- Maintain design consistency

### Step 4: Quality Check
- Professional typography
- Images display correctly
- Smooth transitions
- Mobile responsive

## CSS Structure Needed
```css
/* From template - these are ESSENTIAL */
.hero-image-slide - Full screen image backgrounds
.hero-scrim - Dark overlay for text readability  
.text-protection - Bottom gradient for text
.magazine-split - Two column layouts
.content-panel - Text side of split
.image-panel - Image side of split
.gradient-text - Colorful text accents
.midjourney-image - Proper image sizing
```

## Let's Build It Right
1. Create clean template
2. Test with Lesson 1
3. Apply to Lessons 2, 3, 4
4. Verify professional quality