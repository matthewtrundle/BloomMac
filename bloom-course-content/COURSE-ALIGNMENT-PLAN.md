# Comprehensive Course Alignment Plan
## Postpartum Wellness Foundations - 6 Week Course

### Executive Summary
We have identified significant discrepancies between three different course structures:
1. **Public Website** (bloompsychologynorthaustin.com/courses) - Shows a 3-week course
2. **Admin Section** - Shows a 6-week course with different lesson titles
3. **Actual Content** (/bloom-course-content/weeks) - Has 2 weeks completed with yet different titles

### Current State Analysis

#### 1. Public Website Structure (3 Weeks)
```
Week 1: Understanding Postpartum Emotions
- Welcome to Your Postpartum Journey (12 min)
- What's Normal vs. What's Not (14 min)
- The Science of Postpartum Changes (11 min)
- Honoring Your Experience (13 min)

Week 2: Building Coping Strategies
- Stress Management Essentials (15 min)
- Emotional Regulation Tools (12 min)
- Mindfulness for Busy Moms (13 min)
- Creating Your Coping Toolkit (11 min)

Week 3: Creating Self-Care Routines
- Redefining Self-Care (14 min)
- Micro Self-Care Moments (12 min)
- Physical Wellness Basics (13 min)
- Building Sustainable Routines (11 min)
```

#### 2. Admin Section Structure (6 Weeks)
```
Week 1: Understanding Your Fourth Trimester (4 lessons)
Week 2: Nurturing Self-Compassion (5 lessons)
Week 3: Building Your Support System (4 lessons)
Week 4: Managing Anxiety & Overwhelm (4 lessons)
Week 5: Rediscovering Your Identity (4 lessons)
Week 6: Moving Forward with Confidence (4 lessons)
```

#### 3. Actual Content Structure (What We Have)
```
Week 1: Foundation (4 lessons) ✅
- lesson-1-welcome
- lesson-2-normal-vs-not
- lesson-3-science
- lesson-4-honoring

Week 2: Self-Compassion (5 lessons) ✅
- lesson-1-power-of-self-compassion
- lesson-2-releasing-perfectionism
- lesson-3-stress-management
- lesson-4-emotional-regulation
- lesson-5-coping-toolkit
```

### Recommended Path Forward

## Phase 1: Immediate Actions (Week 1-2)

### 1.1 Align Current Content
Since videos are already being produced using the existing scripts, we should:

**Keep the existing structure for Weeks 1-2** as the foundation:
- Week 1: Foundation (4 lessons) - COMPLETE
- Week 2: Self-Compassion (5 lessons) - SCRIPTS COMPLETE

### 1.2 Update Database/Admin
Update the admin section to reflect the actual content:
```sql
-- Update Week 1 lesson titles to match actual scripts
UPDATE course_lessons SET 
  title = CASE 
    WHEN position = 1 THEN 'Welcome to Your Postpartum Journey'
    WHEN position = 2 THEN 'What''s Normal vs. What''s Not'
    WHEN position = 3 THEN 'The Science of Postpartum Changes'
    WHEN position = 4 THEN 'Honoring Your Experience'
  END
WHERE module_id = [Week 1 ID];

-- Update Week 2 to match actual scripts
UPDATE course_modules SET title = 'Nurturing Self-Compassion & Building Coping Skills' 
WHERE position = 2;

UPDATE course_lessons SET
  title = CASE
    WHEN position = 1 THEN 'The Power of Self-Compassion'
    WHEN position = 2 THEN 'Releasing Perfectionism'
    WHEN position = 3 THEN 'Stress Management Essentials'
    WHEN position = 4 THEN 'Emotional Regulation Tools'
    WHEN position = 5 THEN 'Creating Your Coping Toolkit'
  END
WHERE module_id = [Week 2 ID];
```

## Phase 2: Content Creation Plan (Weeks 3-6)

### Week 3: Building Your Support System
**Folder:** `week-3-support-system`
```
lesson-1-identifying-needs/
  - week3lesson1.md: "Identifying Your Support Needs" (12 min)
  - presentation.html
lesson-2-partner-communication/
  - week3lesson2.md: "Communicating with Your Partner" (10 min)
  - presentation.html
lesson-3-family-boundaries/
  - week3lesson3.md: "Setting Boundaries with Family" (11 min)
  - presentation.html
lesson-4-building-village/
  - week3lesson4.md: "Building Your Village" (13 min)
  - presentation.html
```

### Week 4: Managing Anxiety & Overwhelm
**Folder:** `week-4-anxiety-management`
```
lesson-1-understanding-anxiety/
  - week4lesson1.md: "Understanding Postpartum Anxiety" (11 min)
  - presentation.html
lesson-2-calming-nervous-system/
  - week4lesson2.md: "Calming Your Nervous System" (9 min)
  - presentation.html
lesson-3-racing-thoughts/
  - week4lesson3.md: "Managing Racing Thoughts" (13 min)
  - presentation.html
lesson-4-daily-calm/
  - week4lesson4.md: "Creating Calm in Daily Life" (10 min)
  - presentation.html
```

### Week 5: Rediscovering Your Identity
**Folder:** `week-5-identity`
```
lesson-1-who-am-i/
  - week5lesson1.md: "Who Am I Now? Identity in Motherhood" (12 min)
  - presentation.html
lesson-2-grieving-self/
  - week5lesson2.md: "Grieving Your Pre-Baby Self" (11 min)
  - presentation.html
lesson-3-integration/
  - week5lesson3.md: "Integrating All Parts of You" (10 min)
  - presentation.html
lesson-4-values/
  - week5lesson4.md: "Reconnecting with Your Values" (13 min)
  - presentation.html
```

### Week 6: Moving Forward with Confidence
**Folder:** `week-6-moving-forward`
```
lesson-1-celebrating-growth/
  - week6lesson1.md: "Celebrating Your Growth" (10 min)
  - presentation.html
lesson-2-ongoing-wellness/
  - week6lesson2.md: "Planning for Ongoing Wellness" (11 min)
  - presentation.html
lesson-3-future-challenges/
  - week6lesson3.md: "Navigating Future Challenges" (9 min)
  - presentation.html
lesson-4-continued-journey/
  - week6lesson4.md: "Your Continued Journey" (12 min)
  - presentation.html
```

## Phase 3: Workbook Development

### Workbook Structure for Each Week:
```
/assets/workbooks/week-X/
  - week-X-workbook.html (printable version)
  - week-X-workbook-interactive.html (digital version)
  - week-X-exercises.md (content source)
```

### Workbook Content Guidelines:
1. **Week 1 Workbook**: Emotional awareness exercises, mood tracking
2. **Week 2 Workbook**: Self-compassion practices, coping strategy worksheets
3. **Week 3 Workbook**: Support network mapping, communication scripts
4. **Week 4 Workbook**: Anxiety management tools, thought records
5. **Week 5 Workbook**: Identity exploration, values clarification
6. **Week 6 Workbook**: Progress reflection, future planning

## Phase 4: Script Development Guidelines

### Script Template Structure:
```markdown
# Week X, Lesson Y: [Title]
*Video Script - [X] minutes*

## Introduction (30 seconds)
[Hook and connection to previous lesson]

## Main Content Sections (8-12 minutes)
[2-4 main teaching points with research/examples]

## Practical Application (2-3 minutes)
[Specific exercises or techniques]

## Closing (30 seconds)
[Key takeaway and preview of next lesson]

---
*Total time: [X] minutes*
```

### Content Priorities for Remaining Weeks:

**Week 3 Focus**: Practical relationship and communication skills
- Partner communication templates
- Family boundary scripts
- Community building strategies
- Cultural considerations

**Week 4 Focus**: Evidence-based anxiety management
- CBT techniques adapted for postpartum
- Somatic approaches
- Quick relief strategies
- Long-term management

**Week 5 Focus**: Identity integration
- Matrescence concept
- Role theory
- Values-based living
- Cultural identity considerations

**Week 6 Focus**: Sustainable wellness
- Relapse prevention
- Growth mindset
- Resource compilation
- Celebration and acknowledgment

## Phase 5: Website Alignment

### 5.1 Update Public Course Page
Expand from 3 weeks to 6 weeks to match actual curriculum

### 5.2 Create Course Hub
Develop a central location showing:
- Course overview
- Weekly modules
- Lesson access
- Progress tracking
- Resource downloads

### 5.3 Database Synchronization
Create automated scripts to ensure consistency between:
- Database course structure
- File system organization
- Public website display
- Admin interface

## Implementation Timeline

**Week 1 (Immediate)**:
- [ ] Update database to match current Week 1-2 content
- [ ] Create Week 3 folder structure
- [ ] Begin Week 3 script writing

**Week 2**:
- [ ] Complete Week 3 scripts
- [ ] Create Week 3 presentations
- [ ] Start Week 4 content
- [ ] Develop Week 2 workbook

**Week 3-4**:
- [ ] Complete Weeks 4-5 content
- [ ] Create all workbooks
- [ ] Update public website

**Week 5-6**:
- [ ] Complete Week 6 content
- [ ] Final quality review
- [ ] Launch full 6-week course

## Success Metrics

1. **Content Consistency**: All three systems show identical course structure
2. **Completion Rate**: 80% of students complete all 6 weeks
3. **Engagement**: Average video completion >75%
4. **Workbook Usage**: 60% download and use workbooks
5. **Student Satisfaction**: >4.5/5 rating

## Risk Mitigation

1. **Content Drift**: Weekly sync meetings to ensure alignment
2. **Technical Issues**: Automated testing of all course links
3. **User Confusion**: Clear migration communication
4. **Quality Control**: Peer review of all scripts before production

## Recommended Next Steps

1. **Immediate** (Today):
   - Approve this plan
   - Update Week 2 lesson titles in database
   - Create Week 3 folder structure

2. **This Week**:
   - Write Week 3, Lesson 1 script
   - Design workbook template
   - Update admin interface

3. **Next Week**:
   - Complete Week 3 scripts
   - Begin Week 4 content
   - Test course flow

This comprehensive plan ensures consistency across all platforms while building on the strong foundation already created.