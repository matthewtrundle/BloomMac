#!/usr/bin/env node

/**
 * FIX ACTUAL VISUAL ISSUES
 * Based on REAL screenshots, not theoretical analysis
 */

const fs = require('fs').promises;
const path = require('path');

class VisualIssueFixer {
  async fix(presentationPath) {
    console.log(`\n🎯 FIXING ACTUAL VISUAL ISSUES`);
    console.log(`📍 Based on real screenshots\n`);

    let html = await fs.readFile(presentationPath, 'utf-8');

    // Backup
    const backupPath = presentationPath.replace('.html', `-visual-fix-backup-${Date.now()}.html`);
    await fs.copyFile(presentationPath, backupPath);
    console.log(`💾 Backup: ${path.basename(backupPath)}`);

    const realFixesCSS = `
    
    /* ===== FIXING ACTUAL VISUAL ISSUES ===== */
    /* Based on screenshots showing REAL problems */
    
    /* 1. FIX: Dark text on dark backgrounds */
    /* Hero slides with dark overlays need WHITE text */
    .hero-content h1,
    .hero-content h2,
    .hero-content p,
    .text-protection h1,
    .text-protection h2,
    .text-protection p,
    .hero-scrim + * h1,
    .hero-scrim + * h2,
    .hero-scrim + * p,
    [style*="background: rgba(0,0,0"] h1,
    [style*="background: rgba(0,0,0"] h2,
    [style*="background: rgba(0,0,0"] p,
    [style*="background: rgba(0,0,0"] span {
        color: white !important;
        text-shadow: 0 2px 8px rgba(0,0,0,0.8) !important;
    }
    
    /* 2. FIX: Cards getting cut off */
    /* Ensure cards fit on screen */
    .journey-card,
    .week-card,
    .stat-card {
        max-height: calc(100vh - 200px) !important;
        overflow: visible !important;
    }
    
    /* Grid layouts need proper height constraints */
    .image-grid,
    .rights-grid,
    .journey-grid,
    div[style*="grid-template-rows"] {
        max-height: calc(100vh - 150px) !important;
        overflow-y: auto !important;
    }
    
    /* 3. FIX: Floating cards on images need better contrast */
    .floating-card {
        background: rgba(255, 255, 255, 0.98) !important;
        backdrop-filter: blur(20px) saturate(180%) !important;
        -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3) !important;
    }
    
    .floating-card-dark {
        background: rgba(26, 26, 26, 0.98) !important;
        color: white !important;
    }
    
    .floating-card-dark h1,
    .floating-card-dark h2,
    .floating-card-dark h3,
    .floating-card-dark p {
        color: white !important;
    }
    
    /* 4. FIX: Text overlays on images */
    .text-overlay,
    .image-caption,
    .stat-overlay {
        background: linear-gradient(to top, 
            rgba(0,0,0,0.95) 0%, 
            rgba(0,0,0,0.8) 50%, 
            rgba(0,0,0,0.6) 100%) !important;
    }
    
    .text-overlay *,
    .image-caption *,
    .stat-overlay * {
        color: white !important;
    }
    
    /* 5. FIX: Slides with background images need scrim */
    section[data-background-image] .content,
    section[data-background-image] .container {
        background: linear-gradient(to bottom,
            rgba(0,0,0,0.7) 0%,
            rgba(0,0,0,0.85) 50%,
            rgba(0,0,0,0.95) 100%) !important;
        padding: 3rem !important;
        border-radius: 0 !important;
    }
    
    /* 6. FIX: Ensure reveal controls are visible */
    .reveal .controls {
        color: white !important;
        background: rgba(0,0,0,0.5) !important;
        border-radius: 50% !important;
        padding: 10px !important;
    }
    
    /* 7. UNDO: Bad contrast decisions from before */
    /* Regular slides should have normal contrast */
    section:not([data-background-image]) p,
    section:not([data-background-image]) li {
        color: #2a2a2a !important; /* Not pure black */
    }
    
    section:not([data-background-image]) h1,
    section:not([data-background-image]) h2,
    section:not([data-background-image]) h3 {
        color: #1a1a1a !important; /* Not pure black */
    }
    
    /* 8. FIX: Responsive sizing for video recording */
    .reveal .slides section {
        width: 100% !important;
        height: 100vh !important;
        max-width: 1920px !important;
        max-height: 1080px !important;
        margin: 0 auto !important;
    }
    
    /* 9. FIX: Journey cards specifically */
    .journey-card {
        min-height: 120px !important;
        max-height: 180px !important;
    }
    
    .journey-card .journey-content-panel {
        padding: 1.5rem !important;
    }
    
    .journey-card h3 {
        font-size: 1.6rem !important;
        margin-bottom: 0.5rem !important;
    }
    
    .journey-card p {
        font-size: 1.3rem !important;
        line-height: 1.5 !important;
    }
    `;

    // Inject fixes
    const styleEndIndex = html.lastIndexOf('</style>');
    if (styleEndIndex > -1) {
      html = html.substring(0, styleEndIndex) + realFixesCSS + '\n    </style>' + html.substring(styleEndIndex + 8);
    }

    // Fix specific HTML issues
    console.log(`\n🔧 FIXING HTML ISSUES:`);

    // Ensure dark slide text is white
    html = html.replace(
      /(<section[^>]*data-background-color="#1a1a1a"[^>]*>[\s\S]*?)style="color:\s*#[0-9a-fA-F]{6}"/g,
      '$1style="color: white"'
    );
    console.log(`  ✅ Fixed text color on dark slides`);

    // Fix cut-off grids
    html = html.replace(
      /grid-template-rows:\s*repeat\(2,\s*380px\)/g,
      'grid-template-rows: repeat(2, minmax(300px, 1fr))'
    );
    console.log(`  ✅ Fixed grid heights`);

    await fs.writeFile(presentationPath, html);

    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ VISUAL ISSUES FIXED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 Real fixes applied:
   • White text on dark backgrounds
   • Cards fit on screen properly
   • Better contrast for overlays
   • Proper scrims on background images
   • Responsive sizing for 1920x1080
   • Journey cards properly sized
   • Undid overly aggressive black text
   
📁 Updated: ${presentationPath}
💾 Backup: ${backupPath}
`);

    return { backupPath };
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🎯 Fix Actual Visual Issues

Fixes REAL problems seen in screenshots:
- Dark text on dark backgrounds
- Cards cut off at bottom
- Poor contrast on overlays

Usage:
  npm run fix-visual "week1 lesson1"
    `);
    process.exit(0);
  }

  const fixer = new VisualIssueFixer();
  
  try {
    let presentationPath = args[0];
    
    if (presentationPath.match(/week\d+\s+lesson\d+/i)) {
      const [week, lesson] = presentationPath.toLowerCase().split(/\s+/);
      const weekNum = week.replace('week', '');
      const lessonNum = lesson.replace('lesson', '');
      
      const lessonNames = {
        '1': 'welcome',
        '2': 'normal-vs-concern',
        '3': 'hormones',
        '4': 'honoring'
      };
      
      const lessonName = lessonNames[lessonNum] || `lesson-${lessonNum}`;
      presentationPath = `bloom-course-content/weeks/week-${weekNum}-foundation/lesson-${lessonNum}-${lessonName}/presentation-animated-complete.html`;
    }
    
    await fixer.fix(presentationPath);
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = VisualIssueFixer;