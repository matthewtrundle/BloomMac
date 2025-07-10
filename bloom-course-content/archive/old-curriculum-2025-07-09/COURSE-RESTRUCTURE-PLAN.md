# Course File Restructure Plan
*Program Management Approach to Clean Organization*

## Current Problems
1. Files scattered between `/course-materials/` and `/public/presentations/`
2. No clear week/lesson hierarchy
3. Scripts separated from presentations
4. Design docs mixed with content
5. Risk of losing work when context window closes

## Proposed New Structure

```
/bloom-course-content/
├── README.md                    # Master index of everything
├── course-design-system/        # Preserve design documentation
│   ├── DESIGN-SYSTEM.md
│   ├── presentation-templates/
│   └── course-guidelines.md
│
├── weeks/                       # All course content organized by week
│   ├── week-1-foundation/
│   │   ├── README.md           # Week 1 overview & status
│   │   ├── lesson-1-welcome/
│   │   │   ├── presentation.html
│   │   │   ├── script.md
│   │   │   ├── assets/         # Lesson-specific images
│   │   │   └── notes.md        # Development notes
│   │   ├── lesson-2-normal-vs-not/
│   │   │   ├── presentation.html
│   │   │   ├── script.md
│   │   │   └── assets/
│   │   ├── lesson-3-science/
│   │   │   ├── presentation.html
│   │   │   ├── script.md
│   │   │   └── assets/
│   │   └── lesson-4-honoring/
│   │       ├── presentation.html
│   │       ├── script.md
│   │       └── assets/
│   │
│   ├── week-2-self-compassion/
│   │   └── [same structure]
│   │
│   └── [weeks 3-6...]
│
├── shared-assets/               # Shared images, fonts, etc.
│   ├── images/
│   ├── css/
│   └── js/
│
├── course-management/           # Meta files for course admin
│   ├── transition-plans/
│   ├── content-outlines/
│   └── integration-guides/
│
└── archive/                     # All old versions
    ├── 2024-12-22-legacy/
    └── pre-restructure/
```

## Migration Plan

### Phase 1: Create New Structure
1. Create `/bloom-course-content/` as new root
2. Set up folder hierarchy
3. Create README templates

### Phase 2: Move Week 1 (Pilot)
1. Move completed v2 presentations
2. Move completed v2 scripts
3. Consolidate assets
4. Update all paths

### Phase 3: Archive & Clean
1. Archive entire old structure
2. Remove duplicates
3. Update documentation

### Phase 4: Document for Context Preservation
1. Create master index
2. Document all changes
3. Create recovery guide

## Benefits
- **Single source of truth** - No more duplicate locations
- **Clear hierarchy** - week → lesson → components
- **Self-contained lessons** - Everything in one place
- **Scalable** - Same structure for all 6 weeks
- **Context-proof** - Clear documentation survives session ends

## Implementation Checklist
- [ ] Get approval for structure
- [ ] Create new directory tree
- [ ] Move Week 1 as pilot
- [ ] Verify all links work
- [ ] Archive old structure
- [ ] Create master documentation
- [ ] Update course management system

## Recovery Documentation
Create `CONTEXT-RECOVERY.md` with:
- Current state of each week/lesson
- What was completed
- What needs work
- Key decisions made
- File locations