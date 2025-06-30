# Quick Start Guide for New Lessons

## 1. Copy the Template
```bash
cp public/presentations/template-lesson.html public/presentations/week[X]/lesson[Y]/index.html
```

## 2. Update CSS Import Path
Change the CSS import to point to the correct location:
```html
<link rel="stylesheet" href="../../css/bloom-reveal-theme.css">
```

## 3. Image Selection Checklist
- [ ] All images feature women/mothers (no men)
- [ ] Diverse representation
- [ ] High quality (min 2000px width)
- [ ] Emotionally appropriate
- [ ] From Unsplash or similar quality source

## 4. Replace All Placeholders
Search for `[` in your file and replace all bracketed placeholders:
- `[LESSON TITLE]`
- `[HERO IMAGE URL]`
- `[DESCRIPTIVE ALT TEXT]`
- etc.

## 5. Slide Structure (13 slides)
1. **Hero Opening** - Full-screen image with title
2. **Welcome** - Split layout acknowledging their presence
3. **What This Is** - 3-image grid showing positive aspects
4. **What This Isn't** - Floating card with boundaries
5. **Timeline/Concept** - Visual progression
6. **Reality Grid** - 6 images showing challenges
7. **Statistics** - Community image with data overlay
8. **Key Truth** - Quote with portrait
9-10. **Journey Steps** - 3 cards per slide
11. **Features** - Split layout with visual list
12. **Practice** - Simple action with image
13. **Closing** - Hopeful image with encouragement

## 6. Color Variations
For variety across lessons, you can adjust accent colors:
```css
:root {
  /* Week 2 might use more blues/greens */
  --bloom-coral: #74C0FC;  /* Sky instead of coral */
  --bloom-lavender: #95E1D3;  /* Mint instead of lavender */
}
```

## 7. Testing Checklist
- [ ] All text readable (check overlays)
- [ ] Images load properly
- [ ] Fragments work correctly
- [ ] No overlapping elements
- [ ] Hover effects functional
- [ ] PDF export works (`?print-pdf`)

## 8. Common Image Searches
```
"mother baby bonding"
"women supporting each other"
"postpartum recovery"
"new mother tired"
"woman journaling therapy"
"diverse mothers group"
"woman meditation self care"
"mother finding joy"
"women community circle"
```

## 9. Quick Fixes

### Text hard to read?
Add stronger overlay:
```css
.hero-scrim {
  background: linear-gradient(to bottom, 
    rgba(0,0,0,0.2) 0%, 
    rgba(0,0,0,0.5) 30%, 
    rgba(0,0,0,0.85) 70%, 
    rgba(0,0,0,0.98) 100%);
}
```

### Images not impactful enough?
Use portrait orientation images for emotional connection, landscape for context.

### Spacing issues?
Check grid gaps and padding:
```css
gap: 2.5rem;  /* Increase if needed */
padding: 3rem;  /* Adjust for breathing room */
```

## 10. Final Polish
- Preview at: `http://localhost:3000/presentations/week[X]/lesson[Y]/`
- Export PDF: Add `?print-pdf` to URL
- Test on different screen sizes
- Have someone else review for typos

Remember: Quality over speed. Each lesson should feel as polished as Week 1, Lesson 1.