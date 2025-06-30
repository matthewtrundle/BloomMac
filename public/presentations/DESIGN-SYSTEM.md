# Bloom Psychology Presentation Design System

## Overview
This design system captures the approach developed for Week 1, Lesson 1 to ensure consistency across all future presentations.

## Core Design Principles

### 1. **Images as Heroes**
- Images are the primary storytelling element, not background decoration
- Every image must be meaningful and support the content
- Full-bleed, magazine-style layouts
- Professional photography only (no clip art or basic icons)

### 2. **Target Audience Focus**
- **All images must feature women, mothers, or mother-baby pairs**
- Diverse representation is crucial
- Authentic, emotional moments over stock poses
- Age-appropriate for postpartum journey (20s-40s)

### 3. **Text Readability is Sacred**
- Always use text protection overlays on images
- Dark scrims for light text: `linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)`
- Light cards for dark text: `rgba(255, 255, 255, 0.98)` with backdrop blur
- Minimum font sizes: H1: 5.5rem, H2: 4rem, Body: 1.6rem

## Color Palette

```css
:root {
  /* Primary Brand Colors */
  --bloom-sage: #8B9A82;
  --bloom-charcoal: #1a1a1a;
  --bloom-warm-gray: #4a4a4a;
  --bloom-cream: #faf8f5;
  
  /* Accent Colors */
  --bloom-coral: #FF6B6B;
  --bloom-peach: #FFB4A2;
  --bloom-golden: #FFCB77;
  --bloom-mint: #95E1D3;
  --bloom-lavender: #C589E8;
  --bloom-sky: #74C0FC;
  --bloom-rose: #FFA8C5;
  
  /* Shadows */
  --shadow-dramatic: 0 30px 80px rgba(0,0,0,0.3);
}
```

## Typography

```css
/* Font Stack */
--font-display: 'Cormorant Garamond', serif;  /* Headlines */
--font-body: 'Inter', -apple-system, sans-serif;  /* Body text */

/* Size Scale */
h1: 5.5rem
h2: 4rem
h3: 2.5rem
body: 1.6rem
small: 1.3rem
```

## Layout Templates

### 1. **Hero Slide with Text Overlay**
```html
<section>
  <div class="hero-image-slide">
    <img src="[woman/mother image]" alt="[descriptive alt]">
    <div class="hero-scrim"></div>
    <div class="text-protection">
      <h1>Title with <span class="gradient-text">Emphasis</span></h1>
      <p>Supporting text</p>
    </div>
  </div>
</section>
```

### 2. **Magazine Split Layout**
```html
<section>
  <div class="magazine-split">
    <div class="content-panel">
      <h2>Content Title</h2>
      <p>Content text</p>
    </div>
    <div class="image-panel">
      <img src="[image]" alt="[alt]">
    </div>
  </div>
</section>
```

### 3. **Image with Floating Card**
```html
<section>
  <div class="image-with-card">
    <img src="[full-bleed image]" alt="[alt]">
    <div class="floating-card floating-card-bottom">
      <h2>Card Title</h2>
      <div class="content">
        <!-- Statistics, lists, etc. -->
      </div>
    </div>
  </div>
</section>
```

### 4. **Image Grid (Reality/Stats)**
```html
<div class="image-grid">
  <div class="stat-image-card">
    <img src="[woman experiencing X]" alt="[alt]">
    <div class="stat-overlay">
      <h3>Category</h3>
      <p>Description</p>
    </div>
  </div>
  <!-- Repeat for 6 items -->
</div>
```

### 5. **Journey Cards**
```html
<div class="journey-card">
  <div class="journey-image">
    <img src="[woman in relevant situation]" alt="[alt]">
    <div class="journey-number-overlay">1</div>
  </div>
  <div class="journey-content-panel">
    <h3>Journey Step Title</h3>
    <p>Description of this step</p>
  </div>
</div>
```

### 6. **Rights/Feature Grid**
```html
<div class="rights-grid">
  <div class="right-card">
    <div class="right-card-image">
      <img src="[empowering image]" alt="[alt]">
    </div>
    <div class="right-card-content">
      <p>You have the right to <strong>key message</strong></p>
    </div>
  </div>
</div>
```

## Image Selection Guidelines

### Must-Have Criteria:
1. **Women/Mother Focus**: Every human in frame should be female
2. **Emotional Authenticity**: Real moments, not overly posed
3. **Diversity**: Various ethnicities, ages (20s-40s), body types
4. **High Quality**: Minimum 2000px width, sharp focus
5. **Appropriate Mood**: Supportive, hopeful, real (not always happy)

### Image Categories Needed:
- Mother with newborn (tender moments)
- Women supporting women (community)
- Self-care/meditation moments
- Emotional authenticity (including struggle)
- Journey/path metaphors
- Sunrise/new beginning imagery
- Hands (holding, supporting, caring)

### Recommended Unsplash Searches:
- "mother newborn"
- "women supporting"
- "postpartum"
- "new mother"
- "women community"
- "maternal mental health"
- "self care woman"
- "woman meditation"
- "diverse mothers"

## Component Library

### Gradient Text
```css
.gradient-text {
  background: linear-gradient(135deg, var(--bloom-coral) 0%, var(--bloom-lavender) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### Floating Shapes (Decoration)
```css
.floating-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  animation: float 20s ease-in-out infinite;
  opacity: 0.3;
}
```

### Glass Card Effect
```css
.floating-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.5);
  box-shadow: var(--shadow-dramatic);
}
```

### Hero Scrim
```css
.hero-scrim {
  background: linear-gradient(to bottom, 
    transparent 0%, 
    rgba(0,0,0,0.3) 30%, 
    rgba(0,0,0,0.8) 70%, 
    rgba(0,0,0,0.95) 100%
  );
}
```

## Animation Guidelines

### Fragments
- Use `fade-in-up` for most content reveals
- Use `scale-in` for statistics and emphasis
- Keep animations subtle and professional

### Hover Effects
- Images: `transform: scale(1.08-1.1)`
- Cards: `translateY(-8px)` with shadow increase
- Journey cards: `translateX(15px)`

### Transitions
- Page transitions: `fade` with `slow` speed
- Background transitions: `fade`
- All CSS transitions: `0.3-0.4s ease` or `cubic-bezier(0.4, 0, 0.2, 1)`

## Content Guidelines

### Slide Types & Order
1. **Hero Opening**: Full-screen image with title
2. **Courage/Welcome**: Split layout acknowledging their presence
3. **What This Is**: Grid or split showing positive aspects
4. **What This Isn't**: Boundaries and expectations
5. **Timeline/Journey**: Visual progression
6. **Reality Check**: Grid showing challenges
7. **Statistics**: Community and prevalence
8. **Key Truth**: Quote format with portrait
9. **Path Forward**: Journey cards (6 steps)
10. **What's Included**: Features with split layout
11. **Rights/Empowerment**: Grid of affirmations
12. **Practice/Homework**: Simple action with image
13. **Closing**: Hopeful image with encouragement

### Text Content Principles
- Lead with empathy and validation
- Use "you/your" language
- Balance honesty about struggles with hope
- Include research/statistics for credibility
- End each section with empowerment

## Technical Setup

### Reveal.js Configuration
```javascript
Reveal.initialize({
  width: 1920,
  height: 1080,
  margin: 0,
  transition: 'fade',
  transitionSpeed: 'slow',
  backgroundTransition: 'fade',
  pdfMaxPagesPerSlide: 1,
  pdfSeparateFragments: false
});
```

### Export Settings
- Access slides at: `/presentations/week[X]/lesson[Y]/index.html`
- PDF export: Add `?print-pdf` to URL
- Landscape orientation for PowerPoint conversion

## Quality Checklist

Before finalizing any presentation:
- [ ] All images feature women/mothers appropriately
- [ ] Text is readable on every slide (check overlays)
- [ ] No overlapping elements or spacing issues
- [ ] Consistent visual hierarchy throughout
- [ ] Emotional journey makes sense
- [ ] Diverse representation achieved
- [ ] All hover states work properly
- [ ] Fragments enhance storytelling
- [ ] Export to PDF works correctly
- [ ] Mobile/tablet view acceptable

## Future Lessons Quick Start

1. Copy `/public/presentations/week1/lesson1/final.html` as starting point
2. Update content while maintaining structure
3. Find new images following guidelines above
4. Adjust color accents if needed for variety
5. Maintain same quality standards

This design system ensures every future lesson maintains the professional, emotionally resonant quality established in Week 1, Lesson 1.