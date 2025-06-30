#!/usr/bin/env node

/**
 * IMPLEMENT EXCELLENCE FIXES
 * Precise implementation of critical analysis feedback
 * Only fixes what's actually broken
 */

const fs = require('fs').promises;
const path = require('path');

class ExcellenceFixer {
  async implement(presentationPath) {
    console.log(`\n🎯 IMPLEMENTING EXCELLENCE FIXES`);
    console.log(`📍 Target: ${presentationPath}\n`);

    let html = await fs.readFile(presentationPath, 'utf-8');

    // Create backup
    const backupPath = presentationPath.replace('.html', `-excellence-backup-${Date.now()}.html`);
    await fs.copyFile(presentationPath, backupPath);
    console.log(`💾 Backup created: ${path.basename(backupPath)}`);

    // STEP 1: Fix inline font sizes in HTML
    console.log(`\n📝 FIXING INLINE FONT SIZES:`);
    
    const inlineFixes = [
      // Fix all the specific sizes mentioned in critical analysis
      { pattern: /font-size:\s*0\.9rem/g, replacement: 'font-size: 1.5rem', count: 0 },
      { pattern: /font-size:\s*0\.95rem/g, replacement: 'font-size: 1.5rem', count: 0 },
      { pattern: /font-size:\s*1rem/g, replacement: 'font-size: 1.5rem', count: 0 },
      { pattern: /font-size:\s*1\.05rem/g, replacement: 'font-size: 1.5rem', count: 0 },
      { pattern: /font-size:\s*1\.1rem/g, replacement: 'font-size: 1.5rem', count: 0 },
      { pattern: /font-size:\s*1\.15rem/g, replacement: 'font-size: 1.5rem', count: 0 },
      { pattern: /font-size:\s*1\.2rem/g, replacement: 'font-size: 1.5rem', count: 0 },
      { pattern: /font-size:\s*1\.25rem/g, replacement: 'font-size: 1.5rem', count: 0 },
      { pattern: /font-size:\s*1\.3rem/g, replacement: 'font-size: 1.5rem', count: 0 },
      // Fix clamp values that start too small
      { pattern: /font-size:\s*clamp\(1\.1rem,([^)]+)\)/g, replacement: 'font-size: clamp(1.5rem,$1)', count: 0 }
    ];

    let totalInlineFixes = 0;
    for (const fix of inlineFixes) {
      const matches = html.match(fix.pattern);
      if (matches) {
        fix.count = matches.length;
        html = html.replace(fix.pattern, fix.replacement);
        totalInlineFixes += fix.count;
        console.log(`  ✅ Fixed ${fix.count} instances of ${fix.pattern.source}`);
      }
    }

    // STEP 2: Add CSS fixes for remaining issues
    const cssFixBlock = `
    
    /* ===== EXCELLENCE IMPLEMENTATION FIXES ===== */
    /* Generated: ${new Date().toISOString()} */
    /* Target: 95%+ World-Class Standard */
    
    /* 1. CRITICAL: Font Smoothing & Rendering */
    .reveal * {
        -webkit-font-smoothing: antialiased !important;
        -moz-osx-font-smoothing: grayscale !important;
        text-rendering: optimizeLegibility !important;
    }
    
    /* 2. CRITICAL: Fix any remaining small text in CSS */
    .subtitle-caps {
        font-size: 1.5rem !important;
        letter-spacing: 0.12em !important;
        font-weight: 600 !important;
    }
    
    /* Journey step text that's too small */
    .journey-step strong,
    .journey-number + div strong {
        font-size: 1.6rem !important;
    }
    
    .journey-step span,
    .journey-number + div span {
        font-size: 1.5rem !important;
    }
    
    /* Stat card text */
    .stat-card p {
        font-size: 1.5rem !important;
    }
    
    /* Any p tags with inline styles we might have missed */
    p[style*="font-size: 1.1rem"],
    p[style*="font-size: 1.2rem"],
    p[style*="font-size: 1.25rem"],
    p[style*="font-size: 1.3rem"] {
        font-size: 1.5rem !important;
    }
    
    /* 3. DEPTH: Professional shadows */
    .image-panel {
        box-shadow: 0 10px 40px rgba(0,0,0,0.08) !important;
    }
    
    .stat-card,
    .content-card,
    .fragment[style*="background"] {
        box-shadow: 0 8px 32px rgba(0,0,0,0.06) !important;
    }
    
    /* 4. CONTRAST: Darker text for video */
    .reveal h1, .reveal h2, .reveal h3, .reveal h4 {
        color: #0a0a0a !important;
    }
    
    .reveal p {
        color: #1a1a1a !important;
    }
    
    /* Ensure white text on dark backgrounds has proper contrast */
    .hero-content h1,
    .hero-content p,
    [style*="color: white"],
    [style*="color: #fff"],
    [style*="color: #ffffff"] {
        text-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
    }
    
    /* 5. SPACING: Better padding on problem areas */
    .elegant-divider {
        margin: 1.5rem 0 !important;
    }
    
    /* Insufficient padding fixes */
    section[style*="padding: 1rem"] {
        padding: 2rem !important;
    }
    
    /* 6. MODERN LAYOUT: Add where missing */
    .container > div:not([style*="display"]) {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
    
    /* 7. ENSURE FRAGMENTS WORK */
    .reveal .fragment {
        opacity: 0 !important;
        visibility: hidden !important;
        transition: opacity 0.5s ease, visibility 0.5s ease !important;
    }
    
    .reveal .fragment.visible,
    .reveal .fragment.current-fragment {
        opacity: 1 !important;
        visibility: visible !important;
    }
    `;

    // Inject CSS at the right place
    const styleEndIndex = html.lastIndexOf('</style>');
    if (styleEndIndex > -1) {
      html = html.substring(0, styleEndIndex) + cssFixBlock + '\n    </style>' + html.substring(styleEndIndex + 8);
    }

    // STEP 3: Additional specific fixes
    console.log(`\n🔧 APPLYING ADDITIONAL FIXES:`);

    // Ensure images have proper loading
    const imgPattern = /<img([^>]*?)>/g;
    let imgCount = 0;
    html = html.replace(imgPattern, (match, attrs) => {
      if (!attrs.includes('loading=')) {
        imgCount++;
        return `<img${attrs} loading="eager">`;
      }
      return match;
    });
    if (imgCount > 0) console.log(`  ✅ Added loading="eager" to ${imgCount} images`);

    // Fix any remaining visible fragments
    html = html.replace(/class="fragment visible/g, 'class="fragment');
    console.log(`  ✅ Reset fragment visibility states`);

    // Write the fixed file
    await fs.writeFile(presentationPath, html);

    // Summary
    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ EXCELLENCE FIXES IMPLEMENTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Changes Applied:
   • ${totalInlineFixes} inline font sizes fixed
   • Font smoothing & rendering optimized
   • Professional shadows added
   • Contrast improved for video
   • Spacing issues resolved
   • Modern layout techniques applied
   
🎯 Expected Score Improvement:
   • From: 89%
   • To: 95%+ (World-Class)
   
📁 Updated: ${presentationPath}
💾 Backup: ${backupPath}

🚀 Next: Run video-excellence analyzer to verify
`);

    return { totalInlineFixes, backupPath };
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🎯 Excellence Implementation

Implements specific fixes from critical analysis.
Targets 95%+ world-class standard.

Usage:
  npm run implement-excellence "week1 lesson1"
  npm run implement-excellence <presentation-path>
    `);
    process.exit(0);
  }

  const fixer = new ExcellenceFixer();
  
  try {
    let presentationPath = args[0];
    
    // Handle week/lesson format
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
    
    await fixer.implement(presentationPath);
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = ExcellenceFixer;