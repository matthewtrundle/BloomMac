# Bloom Presentation Template Guide

## Design Principles
1. **Magazine-Quality Design**: Professional, clean, sophisticated
2. **No Animations**: Static presentations for better control and professionalism
3. **Consistent Color Palette**: Use Bloom brand colors consistently
4. **Typography Hierarchy**: Clear distinction between headings and body text
5. **Visual Balance**: Mix of text-heavy and image-focused slides

## Color Palette
- **Primary**: Sage (#8B9A82), Charcoal (#1a1a1a)
- **Accents**: Coral (#FF6B6B), Peach (#FFB4A2), Golden (#FFCB77), Mint (#95E1D3), Lavender (#C589E8)
- **Backgrounds**: White (#FFFFFF), Cream (#FFF9F0)

## Slide Types

### 1. Cinematic Opening (First Slide)
- Full-screen background image with gradient overlay
- Week/Lesson badge
- Large title with italic emphasis
- Brief description
- Bottom signature line

### 2. Content + Image Split
- Asymmetric grid (golden ratio)
- Content on one side, image on other
- Decorative circles for visual interest
- Used for key messages

### 3. Four-Panel Grid
- For presenting multiple concepts
- Each card has:
  - Gradient background with image overlay
  - Icon or visual element
  - Title and description
- Keep text concise

### 4. Full-Screen Message
- Background image with dark overlay
- Centered white text
- For impactful statements

### 5. Statistics Display
- Clean white background
- Large numbers with color
- Brief descriptions
- Grid or row layout

### 6. Practice/Action Slides
- Image on left, content on right
- Bordered practice box
- Clear action items

### 7. Closing Slide
- Similar to opening but with completion badge
- Hopeful/forward-looking message
- "See you next time" signature

## Image Guidelines
1. Use authentic, diverse photography
2. Avoid stock photos that look staged
3. Each image should be used only once
4. Images should support the emotional tone
5. Apply opacity overlays for text readability

## Text Guidelines
1. **Titles**: Short, impactful, use emphasis sparingly
2. **Body**: Clear, concise, avoid jargon
3. **Font Sizes**: Use clamp() for responsive sizing
4. **Line Height**: Generous spacing for readability

## Technical Notes
1. All slides are 100vh height
2. Use CSS Grid and Flexbox for layouts
3. Images use relative paths: `../../../shared-assets/images/`
4. No fragment classes or animations
5. Responsive breakpoint at 768px

## Creating New Presentations
1. Copy the template file
2. Replace all [PLACEHOLDERS] with actual content
3. Choose appropriate images from shared-assets
4. Adjust color schemes for variety (use different accent colors)
5. Ensure script alignment with slides
6. Test on different screen sizes

## Slide Count Guidelines
- Aim for 10-12 slides for a 10-12 minute lesson
- Allow ~1 minute per slide average
- Some slides (like opening) may be shorter
- Practice slides may take longer

## Accessibility Considerations
1. High contrast between text and backgrounds
2. Alt text for all images
3. Clear typography hierarchy
4. No reliance on color alone for meaning