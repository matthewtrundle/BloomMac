# Week 1 Presentation Reorganization Plan

## Current State → Desired State

### File Movements Required:

1. **Create New Lesson 2** (Physical Recovery)
   - Current: Missing
   - Action: Create new presentation for "Your Body's Wisdom - Recovery Reimagined"
   - Use template: `/public/presentations/template-lesson.html`
   - Images to use from assets folder:
     - Woman looking at postpartum body in mirror
     - Woman doing breathing exercise on bed
     - Mother resting on couch while partner holds baby
     - Woman practicing mindfulness
     - Mother yawning while holding baby

2. **Move Current Lesson 2 → Lesson 3**
   - Current: "Your Emotions Aren't Broken" 
   - New: "Emotional Alchemy - Transforming Difficult Feelings"
   - Action: Update title only, content already aligns

3. **Move Current Lesson 3 → Lesson 4**
   - Current: "Your Village Isn't Optional"
   - New: "Building Your Foundation"
   - Action: Update title only, content already aligns

## Implementation Steps:

### Step 1: Create New Lesson 2 Presentation
```bash
# Copy template
cp /public/presentations/template-lesson.html /public/presentations/week1/lesson2/index-new.html

# Update with physical recovery content
# - Use slides structure from aligned script
# - Incorporate body-focused images
# - Maintain design system standards
```

### Step 2: Reorganize Existing Presentations
```bash
# Move current lesson2 to lesson3
mv /public/presentations/week1/lesson2/index.html /public/presentations/week1/lesson3/index-new.html

# Move current lesson3 to lesson4
mv /public/presentations/week1/lesson3/index.html /public/presentations/week1/lesson4/index.html

# Put new lesson2 in place
mv /public/presentations/week1/lesson2/index-new.html /public/presentations/week1/lesson2/index.html

# Put new lesson3 in place
mv /public/presentations/week1/lesson3/index-new.html /public/presentations/week1/lesson3/index.html
```

### Step 3: Update Titles and References

1. **Lesson 2 (New):** Update title to "Your Body's Wisdom - Recovery Reimagined"
2. **Lesson 3:** Update title to "Emotional Alchemy - Transforming Difficult Feelings"
3. **Lesson 4:** Update title to "Building Your Foundation"

### Step 4: Image Verification

Ensure all presentations use images from:
`/public/presentations/week1/assets/images/`

No external image references should exist.

### Step 5: Frontend Connection

Update course management system to reference:
- Lesson 1: `/public/presentations/week1/lesson1/index.html` ✓
- Lesson 2: `/public/presentations/week1/lesson2/index.html` (new)
- Lesson 3: `/public/presentations/week1/lesson3/index.html` (moved from L2)
- Lesson 4: `/public/presentations/week1/lesson4/index.html` (moved from L3)

## Content Outline for New Lesson 2

### Slide Structure:
1. **Hero Opening** - "Your Body Has Carried You This Far"
2. **The Recovery Timeline** - Realistic expectations 
3. **What's Happening Inside** - Beautiful biology
4. **Common Experiences** - Normalized symptoms grid
5. **Rest as Resistance** - Revolutionary self-care
6. **Nourishment Strategy** - Fuel not diet
7. **Movement as Medicine** - Gentle progression
8. **Sleep Architecture** - Understanding disruption
9. **When to Seek Help** - Clear medical guidance
10. **Partner Support** - How they can help
11. **Body Gratitude Practice** - This week's tool
12. **Your Healing Rights** - Empowerment
13. **Closing** - "Trust Your Body's Wisdom"

## Success Criteria:

- [ ] All four lessons have presentations
- [ ] Titles match course structure
- [ ] Scripts align with presentations
- [ ] All images are from Week 1 assets folder
- [ ] Design system consistency maintained
- [ ] Frontend can access all presentations
- [ ] Navigation between lessons works