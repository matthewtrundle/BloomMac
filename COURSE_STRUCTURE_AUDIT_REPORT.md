# Course Structure Audit Report - Postpartum Wellness Foundations

## Executive Summary

This audit compares the course structure for "Postpartum Wellness Foundations" across three sources:
1. Master document (CLAUDE.md)
2. Database (course_modules and course_lessons tables)
3. Course detail pages

**Key Finding**: There are significant discrepancies in week titles between these sources.

## 1. Master Document (CLAUDE.md) - Lines 202-209

```
Week 1: Understanding Your Fourth Trimester (4 lessons)
Week 2: Cultivating Self-Compassion & Building Resilience (5 lessons)
Week 3: Building Your Support Ecosystem (4 lessons)
Week 4: Understanding & Managing Postpartum Anxiety (4 lessons)
Week 5: Identity Integration & Matrescence (4 lessons)
Week 6: Sustainable Wellness & Moving Forward (4 lessons)
```

Total: 6 weeks, 25 lessons

## 2. Database Structure

### From course_modules table:
```
Week 1: Understanding Your Fourth Trimester (4 lessons) ✅
Week 2: Nurturing Self-Compassion (5 lessons) ❌
Week 3: Building Your Support System (4 lessons) ❌
Week 4: Managing Anxiety & Overwhelm (4 lessons) ❌
Week 5: Rediscovering Your Identity (4 lessons) ❌
Week 6: Moving Forward with Confidence (4 lessons) ❌
```

Total: 6 weeks, 25 lessons (count matches, but titles don't)

## 3. Course Detail Pages

### From /app/courses/postpartum-wellness-foundations/page.tsx (hardcoded data):
The page contains complete curriculum with full lesson details. Week titles match master document:
- Week 1: Understanding Your Fourth Trimester ✅
- Week 2: Cultivating Self-Compassion & Building Resilience ✅
- Week 3: Building Your Support Ecosystem ✅
- Week 4: Understanding & Managing Postpartum Anxiety ✅
- Week 5: Identity Integration & Matrescence ✅
- Week 6: Sustainable Wellness & Moving Forward ✅

### From /app/courses/[id]/page.tsx (generic template):
This page uses hardcoded data that doesn't match either source:
- Week 1: Understanding Your Postpartum Experience ❌
- Week 2: Managing Overwhelming Emotions ❌
- Week 3: Anxiety & Worry Management ❌
- Week 4: Self-Care That Actually Works ❌
- Week 5: Strengthening Relationships ❌
- Week 6: Building Your New Identity ❌

## Discrepancy Analysis

### Week Title Mismatches:

| Week | Master Document (CLAUDE.md) | Database | Specific Course Page | Generic Template |
|------|---------------------------|----------|---------------------|------------------|
| 1 | Understanding Your Fourth Trimester | Understanding Your Fourth Trimester ✅ | Understanding Your Fourth Trimester ✅ | Understanding Your Postpartum Experience ❌ |
| 2 | Cultivating Self-Compassion & Building Resilience | Nurturing Self-Compassion ❌ | Cultivating Self-Compassion & Building Resilience ✅ | Managing Overwhelming Emotions ❌ |
| 3 | Building Your Support Ecosystem | Building Your Support System ❌ | Building Your Support Ecosystem ✅ | Anxiety & Worry Management ❌ |
| 4 | Understanding & Managing Postpartum Anxiety | Managing Anxiety & Overwhelm ❌ | Understanding & Managing Postpartum Anxiety ✅ | Self-Care That Actually Works ❌ |
| 5 | Identity Integration & Matrescence | Rediscovering Your Identity ❌ | Identity Integration & Matrescence ✅ | Strengthening Relationships ❌ |
| 6 | Sustainable Wellness & Moving Forward | Moving Forward with Confidence ❌ | Sustainable Wellness & Moving Forward ✅ | Building Your New Identity ❌ |

### Lesson Count Consistency:
- All sources agree on lesson counts per week (4-5-4-4-4-4)
- Total of 25 lessons is consistent

## Issues Identified

1. **Database Inconsistency**: The database has simplified/different week titles that don't match the master document
2. **Generic Template Problem**: The `/app/courses/[id]/page.tsx` template has completely different week titles and doesn't pull from the database
3. **Hardcoded Data**: Course pages are using hardcoded data instead of database content
4. **No Dynamic Data**: The course pages aren't fetching real data from the database

## Recommendations

1. **Immediate Action**: Update the database `course_modules` table to match the exact week titles from CLAUDE.md
2. **Code Update**: Modify `/app/courses/[id]/page.tsx` to fetch actual data from the database instead of using hardcoded values
3. **Remove Duplication**: The specific course page (`/app/courses/postpartum-wellness-foundations/page.tsx`) should use the same data source as the generic template
4. **Create Single Source of Truth**: Ensure all course data comes from the database, not hardcoded values

## SQL to Fix Database Week Titles

```sql
-- Update Week 2
UPDATE course_modules 
SET title = 'Cultivating Self-Compassion & Building Resilience'
WHERE course_id = '9549c2c2-52e9-4d3b-bac3-bddc25b4065b' AND week_number = 2;

-- Update Week 3
UPDATE course_modules 
SET title = 'Building Your Support Ecosystem'
WHERE course_id = '9549c2c2-52e9-4d3b-bac3-bddc25b4065b' AND week_number = 3;

-- Update Week 4
UPDATE course_modules 
SET title = 'Understanding & Managing Postpartum Anxiety'
WHERE course_id = '9549c2c2-52e9-4d3b-bac3-bddc25b4065b' AND week_number = 4;

-- Update Week 5
UPDATE course_modules 
SET title = 'Identity Integration & Matrescence'
WHERE course_id = '9549c2c2-52e9-4d3b-bac3-bddc25b4065b' AND week_number = 5;

-- Update Week 6
UPDATE course_modules 
SET title = 'Sustainable Wellness & Moving Forward'
WHERE course_id = '9549c2c2-52e9-4d3b-bac3-bddc25b4065b' AND week_number = 6;
```

## Conclusion

The course structure has the correct number of weeks and lessons across all sources, but the week titles are inconsistent. The database needs to be updated to match the master document, and the course pages need to be modified to pull data dynamically from the database rather than using hardcoded values.