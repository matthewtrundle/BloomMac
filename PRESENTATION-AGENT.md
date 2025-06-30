# Bloom Psychology Presentation Design Agent

## Quick Start

To create a new presentation, simply run:

```bash
npm run create-presentation "week1 lesson2"
```

This will:
1. Generate a complete presentation based on our design system
2. Apply appropriate colors and themes
3. Suggest relevant images
4. Create a content guide
5. Set up all 13 slides with proper structure

## How the Agent Works

The design agent (`scripts/create-presentation.js`) contains:

### 1. **Complete Design Knowledge**
- All color palettes for each week
- Lesson themes and emotional tones
- Image search terms mapped to emotions
- Statistics and key truths for each week
- Homework assignments

### 2. **Automatic Generation**
- Creates the full HTML presentation
- Applies week-specific color schemes
- Generates image search suggestions
- Provides content placeholders
- Creates a content guide

### 3. **Smart Defaults**
- Week 1: Warm corals and lavenders (welcoming)
- Week 2: Cool mints and blues (calming)
- Week 3: Golden and peach (joyful)
- Week 4: Sky blues and mints (soothing)
- Week 5: Purples and roses (connecting)
- Week 6: Sage and golden (completing)

## Usage Examples

```bash
# Create Week 1, Lesson 2
npm run create-presentation "week1 lesson2"

# Create Week 3, Lesson 1
npm run create-presentation "week3 lesson1"

# Create Week 6, Lesson 3 (final lesson)
npm run create-presentation "week6 lesson3"
```

## What Gets Generated

### 1. **Presentation File**
Location: `/public/presentations/week[X]/lesson[Y]/index.html`

Features:
- All 13 slides pre-structured
- Week-appropriate color scheme
- Proper reveal.js configuration
- All animations and effects

### 2. **Content Guide**
Location: `/public/presentations/week[X]/lesson[Y]/content-guide.md`

Includes:
- Theme overview
- Slide-by-slide suggestions
- Image search terms
- Customization notes

## Post-Generation Steps

1. **Review Generated Content**
   - Open the presentation in browser
   - Check color scheme matches week theme
   - Verify slide structure

2. **Add Specific Content**
   - Replace placeholder text
   - Add lesson-specific examples
   - Customize statistics if needed

3. **Find and Add Images**
   - Use suggested search terms
   - Focus on women/mothers only
   - Ensure diversity
   - High quality (2000px+)

4. **Test Everything**
   - Check all text is readable
   - Test hover effects
   - Verify fragments work
   - Export to PDF

## Design Agent Intelligence

The agent understands:

### **Week Progressions**
- Week 1: Introduction and validation
- Week 2: Cognitive work
- Week 3: Behavioral activation
- Week 4: Anxiety management
- Week 5: Relationships
- Week 6: Integration and future

### **Emotional Arcs**
- Early weeks: More validation, gentleness
- Middle weeks: Active strategies, empowerment
- Later weeks: Confidence, celebration

### **Color Psychology**
- Warm colors for welcoming/connecting
- Cool colors for calming/soothing
- Bright colors for activation/joy

## Extending the Agent

To add new content, edit `scripts/create-presentation.js`:

### Add a New Week Theme:
```javascript
lessonThemes: {
  week7: {
    lesson1: {
      title: "Your Title",
      subtitle: "Your subtitle",
      focus: "Main focus",
      emotions: ["emotion1", "emotion2"]
    }
  }
}
```

### Add New Statistics:
```javascript
statistics: {
  week7: {
    stat1: { number: "XX%", label: "description", color: "gradient" },
    // ...
  }
}
```

### Add New Image Terms:
```javascript
imageSearchTerms: {
  newEmotion: ["search term 1", "search term 2", "search term 3"]
}
```

## Best Practices

1. **Trust the System**
   - The agent applies all our design learnings
   - Don't override unless necessary
   - Keep consistency across lessons

2. **Image Selection**
   - Always women/mothers
   - Match emotional tone
   - Professional quality only
   - Diverse representation

3. **Content Flow**
   - Follow the 13-slide structure
   - Maintain emotional arc
   - End with hope/empowerment

4. **Testing**
   - Always preview before finalizing
   - Check PDF export
   - Test on different screens

## Troubleshooting

### "No theme found" Error
- Check week/lesson format: "week1 lesson2"
- Verify the lesson exists in the agent

### Images Don't Match Theme
- Review emotion keywords
- Check image search suggestions
- Use content guide recommendations

### Colors Look Wrong
- Verify week number
- Check CSS overrides
- Ensure using correct template

## Summary

The design agent encapsulates everything we learned:
- Professional magazine-style layouts
- Women-focused imagery
- Readable text with proper overlays
- Consistent visual hierarchy
- Emotional journey mapping
- Quality over quantity

Just give it a week and lesson number, and it creates a presentation that matches the quality of our Week 1, Lesson 1 masterpiece!