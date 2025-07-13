# Meditation Content System - Consistency Guide

## 🎯 **Current Issues Found**

### **Inconsistent Duration References:**
❌ Old file: "10-minute grounding practice" (hardcoded in `/app/course/week1/database-page.tsx`)  
✅ Current system: "Grounding Meditation for New Moms (8 min)"  
✅ Actual script: 8-10 minutes (adjustable by pace)

### **Multiple Description Sources:**
1. **WeekContent component** - Dynamic resource descriptions
2. **Course page** - Static curriculum descriptions  
3. **Old components** - Hardcoded legacy descriptions
4. **Database** - Should be single source of truth

---

## 📋 **MASTER MEDITATION SPECIFICATIONS**

### **Week 1: Grounding Meditation**
- **Official Title**: "Grounding Meditation for New Moms"
- **Duration**: 8-10 minutes (8 min standard, 10 min with longer pauses)
- **Description**: "Foundational grounding practice for fourth trimester"
- **Script Status**: ✅ Complete
- **Teaching Focus**: Present-moment awareness, body grounding, breath anchor

### **Week 2: Self-Compassion Break**
- **Official Title**: "Self-Compassion Break Meditation" 
- **Duration**: 10 minutes
- **Description**: "Dr. Kristin Neff's self-compassion protocol for mothers"
- **Script Status**: ✅ Complete
- **Teaching Focus**: Mindfulness, common humanity, self-kindness

### **Week 3: Loving-Kindness for Connection**
- **Official Title**: "Loving-Kindness Meditation for Connection"
- **Duration**: 12 minutes
- **Description**: "Building emotional bonds with self, baby, and community"
- **Script Status**: ⏳ Planned
- **Teaching Focus**: Extending love, healing relationships, community connection

### **Week 4: Anxiety Relief Body Scan**
- **Official Title**: "Anxiety Relief Body Scan"
- **Duration**: 10 minutes  
- **Description**: "Nervous system regulation for postpartum anxiety"
- **Script Status**: ⏳ Planned
- **Teaching Focus**: Polyvagal techniques, progressive relaxation, safety building

### **Week 5: Identity Integration Meditation**
- **Official Title**: "Identity Integration Meditation"
- **Duration**: 11 minutes
- **Description**: "Honoring past self while embracing maternal identity"
- **Script Status**: ⏳ Planned
- **Teaching Focus**: Matrescence, grief processing, values integration

### **Week 6: Gratitude & Growth Meditation**
- **Official Title**: "Gratitude & Growth Meditation"
- **Duration**: 10 minutes
- **Description**: "Celebrating journey and creating sustainable wellness"
- **Script Status**: ⏳ Planned
- **Teaching Focus**: Progress acknowledgment, future visioning, tool integration

---

## 🔧 **SYSTEMATIC FIXES NEEDED**

### **1. Clean Up Old Files**
- [ ] Remove or update `/app/course/week1/database-page.tsx` (has hardcoded descriptions)
- [ ] Audit all components for hardcoded meditation descriptions
- [ ] Ensure only WeekContent component defines resource descriptions

### **2. Update WeekContent Component**
Current WeekContent component should be updated to use the master specifications:

```typescript
const getWeekResources = (weekNum: number) => {
  const weekResources: Record<number, any[]> = {
    1: [
      {
        icon: Headphones,
        title: 'Grounding Meditation for New Moms',
        description: 'Foundational grounding practice for fourth trimester (8-10 min)',
        link: '/resources/week1-meditation.mp3'
      }
    ],
    2: [
      {
        icon: Headphones,
        title: 'Self-Compassion Break Meditation',
        description: 'Dr. Kristin Neff\'s self-compassion protocol for mothers (10 min)',
        link: '/resources/week2-meditation.mp3'
      }
    ],
    // etc...
  };
};
```

### **3. Database Integration**
Store meditation metadata in database for consistency:

```sql
-- Add meditation_data column to course_modules table
ALTER TABLE course_modules ADD COLUMN meditation_data JSONB;

-- Example data structure:
{
  "title": "Grounding Meditation for New Moms",
  "duration_minutes": 10,
  "description": "Foundational grounding practice for fourth trimester",
  "techniques": ["body_scan", "breath_awareness", "self_compassion"],
  "script_path": "/resources/week1-meditation-script.md",
  "audio_path": "/resources/week1-meditation.mp3"
}
```

---

## 📁 **FILE ORGANIZATION SYSTEM**

### **Script Files** (Detailed written content):
```
/resources/
  week1-meditation-script.md ✅
  week2-meditation-script.md ✅
  week3-meditation-script.md ⏳
  week4-meditation-script.md ⏳
  week5-meditation-script.md ⏳
  week6-meditation-script.md ⏳
```

### **Audio Files** (Production recordings):
```
/public/resources/
  week1-meditation.mp3 ✅ (placeholder)
  week2-meditation.mp3 ✅ (placeholder)
  week3-meditation.mp3 ✅ (placeholder)
  week4-meditation.mp3 ✅ (placeholder)
  week5-meditation.mp3 ✅ (placeholder)
  week6-meditation.mp3 ✅ (placeholder)
```

### **Shorter Versions** (For busy days):
```
/public/resources/
  week1-meditation-short.mp3 (5 min version)
  week2-meditation-short.mp3 (5 min version)
  // etc...
```

---

## 🎯 **PRODUCTION PIPELINE**

### **Phase 1: Script Development** (Current)
- [x] Week 1 script complete
- [x] Week 2 script complete  
- [ ] Week 3-6 scripts
- [ ] Review and refine all scripts

### **Phase 2: Professional Recording**
- [ ] Voice talent selection (maternal psychology background preferred)
- [ ] Studio recording of all 6 meditations
- [ ] Background music composition/selection
- [ ] Professional editing and mastering

### **Phase 3: Multiple Format Creation**
- [ ] Standard versions (8-12 minutes)
- [ ] Short versions (5 minutes) for busy days
- [ ] Audio-only versions for accessibility
- [ ] Transcripts for hearing accessibility

### **Phase 4: Quality Assurance**
- [ ] Test with postpartum mothers
- [ ] Clinical review by maternal mental health specialists
- [ ] Technical testing across devices
- [ ] Integration testing with course platform

---

## 🚀 **IMMEDIATE ACTION ITEMS**

### **High Priority:**
1. **Update WeekContent component** with master specifications
2. **Remove old hardcoded files** or update them
3. **Create remaining scripts** (Weeks 3-6)
4. **Standardize all duration references** across platform

### **Medium Priority:**
1. **Database schema updates** for meditation metadata
2. **Create short versions** of existing scripts
3. **Production planning** for audio recording

### **Future Enhancements:**
1. **User preference system** (short vs. long versions)
2. **Progress tracking** for meditation completion
3. **Downloadable audio** for offline use
4. **Multiple voice options** or languages

---

## 💡 **QUALITY STANDARDS**

### **All Meditations Must Have:**
- ✅ Specific duration clearly stated
- ✅ Evidence-based techniques
- ✅ Maternal psychology alignment
- ✅ Practical applicability for tired mothers
- ✅ Professional production quality
- ✅ Accessibility features (transcripts, multiple formats)

### **Consistency Requirements:**
- ✅ Matching titles across all components
- ✅ Accurate duration references
- ✅ Single source of truth for descriptions
- ✅ Progressive skill building across weeks
- ✅ Cohesive voice and tone throughout series

This systematic approach ensures every meditation serves the course objectives while maintaining professional quality and user experience consistency.