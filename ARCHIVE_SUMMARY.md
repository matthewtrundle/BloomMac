# Archive Summary

This document summarizes all files that have been moved to the archive directory based on the comprehensive audit.

## Archive Structure

```
archive/
├── app/
│   ├── admin/
│   │   ├── auth-email-test/
│   │   ├── backup/
│   │   ├── debug-nav/
│   │   ├── test-login/
│   │   ├── test-navigation/
│   │   ├── theme-concepts/
│   │   └── theme-variations/
│   ├── backup/
│   │   ├── courseId-backup/
│   │   ├── page.tsx.backup (supporting-your-partner)
│   │   └── page.tsx.backup (when-family-wants-to-help)
│   └── test-pages/
│       ├── checkout-test/
│       ├── debug-registration/
│       ├── test-page/
│       ├── page-broken.tsx
│       └── page-test.tsx
├── components/
│   ├── theme-concepts/
│   │   ├── GroundedGrowthConcept.tsx
│   │   ├── ModernMaternalConcept.tsx
│   │   ├── ModernMaternalVariations.tsx
│   │   └── QuietBloomConcept.tsx
│   └── ui/
│       ├── FloatingSeeds.tsx
│       ├── GardenResourceCard.tsx
│       ├── GardenServiceCard.tsx
│       ├── GardenZoneCard.tsx
│       ├── SeedPacketCard.tsx
│       ├── ServiceFlowers.tsx
│       └── TexasGardenMap.tsx
├── lib/
│   └── stripe-test-mode.ts
├── pages/
│   └── api/
│       ├── debug/
│       │   ├── debug-email-save.ts
│       │   └── test-registration.ts
│       ├── test/
│       │   ├── test-analytics.ts
│       │   ├── test-auth.ts (admin)
│       │   ├── test-auth.ts
│       │   ├── test-contact-email.ts
│       │   ├── test-email-access.ts
│       │   ├── test-email.ts
│       │   └── test-env.ts
│       └── backup.ts
├── public/
│   └── images/
│       └── garden-themed/
│           ├── flower no stem.svg
│           └── Flower with black 2.svg
├── scripts/
│   ├── debug/
│   │   └── [Previously archived debug scripts]
│   └── tests/
│       ├── add-test-data.js
│       ├── clean-all-test-data.js
│       ├── clean-test-data.js
│       ├── create-debug-newsletter-welcome.js
│       ├── fix-and-test-heatmap.js
│       ├── test-blog-api-save.js
│       ├── test-blog-storage-direct.js
│       ├── test-blog-storage-supabase.js
│       ├── test-click-tracking.js
│       ├── test-course-api-simple.js
│       ├── test-course-api.js
│       ├── test-email-automation-fix.js
│       ├── test-email-editor-api.js
│       ├── test-login-flow.js
│       ├── test-user-flows.js
│       ├── test-webp-images.js
│       ├── verify-all-tables.js
│       ├── verify-course-setup.js
│       ├── verify-script-fields.js
│       └── [Previously archived test scripts]
└── supabase/
    └── temporary/
        ├── create-email-automation-errors-table-simple.sql
        ├── create-email-logs-table.sql
        └── create-missing-tables.sql
```

## Summary of Archived Files

### 1. **Garden-Themed Components** (7 files)
All garden metaphor UI components have been moved to `archive/components/ui/`

### 2. **Theme Concept Components** (4 files)
All theme exploration components have been moved to `archive/components/theme-concepts/`

### 3. **Test and Debug Scripts** (19+ files)
All test and debug scripts have been moved to `archive/scripts/tests/` and `archive/scripts/debug/`

### 4. **Test Pages and Admin Tools** (13 directories)
All test pages, debug pages, and experimental admin tools have been moved to `archive/app/`

### 5. **Test API Routes** (11 files)
All test and debug API endpoints have been moved to `archive/pages/api/test/` and `archive/pages/api/debug/`

### 6. **Garden-Themed Images** (2 files)
SVG flower assets have been moved to `archive/public/images/garden-themed/`

### 7. **Temporary Files** (4 files)
- Backup files (.backup)
- Test mode configurations (stripe-test-mode.ts)
- Temporary SQL migration files

### 8. **Previously Archived** (90+ files)
Documentation, completed features, and historical files that were already in the archive directory

## Benefits of This Cleanup

1. **Cleaner Codebase**: Removed all test, debug, and experimental code from production directories
2. **Consistent Theme**: Removed all garden metaphor elements that don't align with the current brand
3. **Maintained History**: All files preserved in archive with their relative paths for reference
4. **Improved Navigation**: Easier to find production code without test/debug clutter
5. **Reduced Confusion**: No more mixing of old theme concepts with current implementation

## Next Steps

1. Update any imports that might reference archived components
2. Remove any unused dependencies related to archived features
3. Consider creating a `.archiveignore` file to exclude archive from certain operations
4. Document any breaking changes for team members