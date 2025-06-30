# Week 1 Course Materials Integration Guide

## Overview
This guide provides instructions for integrating the enhanced Week 1 curriculum (Lessons 1-4) into the course management system.

## Materials Created

### Lesson 1: You Are Not Broken (Previously Created)
- **Slides**: `week1-lesson1-world-class.html` (10 data-driven slides)
- **Script**: Enhanced script with research citations
- **Focus**: Normalizing the postpartum experience with global data

### Lesson 2: Your Emotions Aren't Broken
- **Slides**: `week1-lesson2-slides.html` (10 slides)
- **Script**: `week1-lesson2-script-enhanced.md`
- **Key Topics**:
  - Brain changes and neuroplasticity
  - Daily emotional forecast
  - RAIN technique
  - Breathing protocols
  - Partner education

### Lesson 3: Your Village Isn't Optional  
- **Slides**: `week1-lesson3-slides.html` (10 slides)
- **Script**: `week1-lesson3-script-enhanced.md`
- **Key Topics**:
  - Isolation epidemic data
  - Support circles framework
  - Scripts for asking for help
  - Building micro-connections
  - Digital village strategies

### Lesson 4: Self-Care That Actually Works
- **Slides**: `week1-lesson4-slides.html` (10 slides)
- **Script**: `week1-lesson4-script-enhanced.md`
- **Key Topics**:
  - Debunking self-care myths
  - 2-minute rituals
  - Habit stacking
  - Basic needs as foundation
  - Personal care menu

## Integration Steps

### 1. Database Integration

Each lesson needs to be added to the course lessons table with:

```javascript
{
  course_id: [postpartum-wellness-foundations-id],
  week_number: 1,
  lesson_number: [2-4],
  title: [lesson title],
  description: [brief description],
  video_url: null, // To be added when videos are recorded
  slides_html: [contents of HTML file],
  script_content: [contents of enhanced script],
  duration_minutes: 45,
  resources: {
    research_citations: [array of citations],
    downloadable_pdfs: [array of PDF links],
    additional_reading: [array of links]
  }
}
```

### 2. Video Production Guide

For each lesson, create videos following this structure:

1. **Intro** (30 seconds): Personal connection, preview of content
2. **Main Content** (35-40 minutes): Follow enhanced script, display slides
3. **Practice Integration** (4-5 minutes): Homework and daily practice
4. **Closing** (30 seconds): Encouragement and preview of next lesson

### 3. Slide Display Implementation

The slides use HTML with inline styles for maximum compatibility. To display in the course platform:

```javascript
// Split slides by delimiter
const slides = slidesHtml.split('<!-- SLIDE -->');

// Display one slide at a time with navigation
<SlideViewer 
  slides={slides}
  currentSlide={currentSlideIndex}
  onNext={() => setCurrentSlideIndex(prev => prev + 1)}
  onPrevious={() => setCurrentSlideIndex(prev => prev - 1)}
/>
```

### 4. Interactive Elements

Add these interactive features to enhance engagement:

1. **Emotion Tracker**: Daily check-in tool (Lesson 2)
2. **Support Circle Mapper**: Visual tool for identifying support (Lesson 3)
3. **Habit Stack Builder**: Personalized routine creator (Lesson 4)
4. **Progress Badges**: Gamification for daily practices

### 5. Mobile Optimization

All slides are designed mobile-first, but ensure:
- Touch-friendly navigation
- Readable fonts (minimum 16px)
- Scrollable content within slides
- Offline access to downloaded content

### 6. Community Integration

Link each lesson to discussion forums:
- Lesson 2: "Daily Emotion Check-In Thread"
- Lesson 3: "Finding Your Village Success Stories"
- Lesson 4: "2-Minute Wins Celebration"

### 7. Assessment and Progress Tracking

Create simple assessments:
- Pre-lesson: "How are you feeling today?" (1-10 scale)
- Post-lesson: Key takeaway reflection
- Weekly: Progress on daily practices
- Course completion: Comprehensive wellbeing assessment

### 8. Resource Downloads

Create downloadable PDFs for:
- Emotion tracking template
- RAIN technique card
- Support circles worksheet
- Scripts for asking for help
- Personal care menu planner
- Habit stacking guide

### 9. Email Automation Integration

Trigger emails based on lesson completion:
- After Lesson 2: "Your Daily Emotion Tracker" (PDF)
- After Lesson 3: "This Week's Connection Challenge"
- After Lesson 4: "Your Personal Care Plan Template"

### 10. Analytics to Track

Monitor these key metrics:
- Lesson completion rates
- Daily practice adherence
- Community engagement
- Most replayed sections (indicates confusion or high value)
- Resource download rates

## Quality Assurance Checklist

Before going live, verify:
- [ ] All slides display correctly on mobile and desktop
- [ ] Scripts match slide content
- [ ] Research citations are properly formatted
- [ ] Interactive elements function properly
- [ ] Downloads are accessible
- [ ] Email triggers work correctly
- [ ] Community links are active
- [ ] Progress tracking saves properly
- [ ] Videos play smoothly (when added)
- [ ] Navigation between lessons is intuitive

## Support Materials for Instructors

If other facilitators will teach this content, provide:
- Detailed facilitator notes
- Common questions and answers
- Additional research references
- Adaptation suggestions for different populations
- Technical troubleshooting guide

## Future Enhancements

Consider adding:
- Live Q&A sessions after each week
- Guest expert interviews
- Partner/support person specific content
- Cultural adaptation guides
- Translation into other languages
- Accessibility features (captions, audio descriptions)

## Maintenance Schedule

Monthly reviews:
- Update statistics with latest research
- Refresh examples and cultural references  
- Check all links and resources
- Review community feedback
- Update scripts based on common questions

## Success Metrics

Track these outcomes:
- 80% completion rate for Week 1
- 70% daily practice adherence
- 60% community engagement
- 90% report feeling "less alone"
- 75% successfully ask for help
- 85% implement at least one self-care practice

This comprehensive curriculum positions the course as a leader in evidence-based postpartum education, combining cutting-edge research with practical, accessible solutions for real mothers.