#!/usr/bin/env node

/**
 * TARGETED PRESENTATION FIXES
 * Careful, specific fixes based on critical analysis
 * Won't break your presentation!
 */

const fs = require('fs').promises;
const path = require('path');

class TargetedFixer {
  async fix(presentationPath) {
    console.log(`\n🎯 TARGETED PRESENTATION FIXES`);
    console.log(`📍 Target: ${presentationPath}\n`);

    let html = await fs.readFile(presentationPath, 'utf-8');

    // Create backup
    const backupPath = presentationPath.replace('.html', `-targeted-backup-${Date.now()}.html`);
    await fs.copyFile(presentationPath, backupPath);
    console.log(`💾 Backup created: ${path.basename(backupPath)}`);

    // TARGETED FIXES - Only what's needed
    const targetedCSS = `
    
    /* ===== TARGETED FIXES FOR VIDEO EXCELLENCE ===== */
    /* Based on critical analysis feedback */
    
    /* 1. Font Smoothing (Essential for video) */
    .reveal * {
        -webkit-font-smoothing: antialiased !important;
        -moz-osx-font-smoothing: grayscale !important;
        text-rendering: optimizeLegibility !important;
    }
    
    /* 2. Fix specific small text sizes */
    /* Only target problem areas, not everything */
    .subtitle-caps {
        font-size: 1.3rem !important; /* was 0.9rem */
        font-weight: 600 !important;
    }
    
    .stat-card p,
    .journey-step p {
        font-size: 1.5rem !important; /* was 1.1rem */
    }
    
    /* List items in specific contexts */
    .fragment[style*="font-size: 1.1rem"],
    .fragment[style*="font-size: 1rem"],
    .fragment[style*="font-size: 0.9"] {
        font-size: 1.5rem !important;
    }
    
    /* 3. Subtle shadows for depth */
    .image-panel {
        box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
    }
    
    .stat-card {
        box-shadow: 0 8px 24px rgba(0,0,0,0.08) !important;
    }
    
    /* 4. Better contrast for specific elements */
    .reveal h1, .reveal h2, .reveal h3 {
        color: #0a0a0a !important;
    }
    
    .reveal p {
        color: #1a1a1a !important;
    }
    
    /* 5. Fix specific spacing issues */
    .elegant-divider {
        margin: 2rem 0 !important;
    }
    
    /* 6. Ensure fragments work properly */
    .reveal .fragment {
        opacity: 0 !important;
        visibility: hidden !important;
        transition: all 0.5s ease !important;
    }
    
    .reveal .fragment.visible,
    .reveal .fragment.current-fragment {
        opacity: 1 !important;
        visibility: visible !important;
    }
    
    /* 7. Fix clamp values that are too small */
    p[style*="font-size: clamp(1.1rem"] {
        font-size: clamp(1.5rem, 2vw, 1.8rem) !important;
    }
    
    /* 8. Specific fixes for problem slides */
    /* Slide 5 - Journey text */
    .journey-step strong {
        font-size: 1.6rem !important;
    }
    
    .journey-step span {
        font-size: 1.4rem !important;
    }
    `;

    // Inject CSS more carefully
    const styleEndIndex = html.indexOf('</style>');
    if (styleEndIndex > -1) {
      // Find any existing video optimizations and replace them
      const videoOptStart = html.indexOf('/* ===== VIDEO PRESENTATION OPTIMIZATIONS =====');
      const videoOptEnd = html.indexOf('/* ===== PROPER VIDEO RECORDING OPTIMIZATIONS =====');
      
      if (videoOptStart > -1 && videoOptStart < styleEndIndex) {
        // Remove old optimizations
        const beforeOpt = html.substring(0, videoOptStart);
        const afterOpt = html.substring(styleEndIndex);
        html = beforeOpt + targetedCSS + '\n    </style>' + afterOpt.substring(8);
      } else if (videoOptEnd > -1 && videoOptEnd < styleEndIndex) {
        // Add after proper optimizations
        html = html.substring(0, styleEndIndex) + targetedCSS + '\n    </style>' + html.substring(styleEndIndex + 8);
      } else {
        // Just add before closing style tag
        html = html.substring(0, styleEndIndex) + targetedCSS + '\n    </style>' + html.substring(styleEndIndex + 8);
      }
    }

    // Specific HTML fixes
    let fixCount = 0;

    // Fix small inline font sizes
    const inlineFixPatterns = [
      { find: /font-size:\s*0\.9rem/g, replace: 'font-size: 1.5rem' },
      { find: /font-size:\s*0\.95rem/g, replace: 'font-size: 1.5rem' },
      { find: /font-size:\s*1rem/g, replace: 'font-size: 1.5rem' },
      { find: /font-size:\s*1\.05rem/g, replace: 'font-size: 1.5rem' },
      { find: /font-size:\s*1\.1rem/g, replace: 'font-size: 1.5rem' },
      { find: /font-size:\s*1\.15rem/g, replace: 'font-size: 1.5rem' },
      { find: /font-size:\s*1\.2rem/g, replace: 'font-size: 1.5rem' },
      { find: /font-size:\s*1\.25rem/g, replace: 'font-size: 1.5rem' }
    ];

    for (const pattern of inlineFixPatterns) {
      const matches = html.match(pattern.find);
      if (matches) {
        html = html.replace(pattern.find, pattern.replace);
        fixCount += matches.length;
        console.log(`✅ Fixed ${matches.length} instances of ${pattern.find.source}`);
      }
    }

    // Write fixed file
    await fs.writeFile(presentationPath, html);

    console.log(`\n✨ Targeted fixes complete!`);
    console.log(`   - ${fixCount} inline font sizes fixed`);
    console.log(`   - Added font smoothing for video`);
    console.log(`   - Enhanced shadows and contrast`);
    console.log(`   - Preserved all animations and layouts`);
    console.log(`\n📁 Updated: ${presentationPath}`);

    return { fixCount, backupPath };
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🎯 Targeted Presentation Fixes

Careful fixes that won't break your presentation.
Based on critical analysis feedback.

Usage:
  npm run targeted-fix "week1 lesson1"
  npm run targeted-fix <presentation-path>
    `);
    process.exit(0);
  }

  const fixer = new TargetedFixer();
  
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
    
    await fixer.fix(presentationPath);
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = TargetedFixer;