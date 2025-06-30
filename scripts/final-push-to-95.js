#!/usr/bin/env node

/**
 * FINAL PUSH TO 95% - The Last Mile
 * We're at 94%, need just 1 more point!
 */

const fs = require('fs').promises;
const path = require('path');

class FinalPushOptimizer {
  async optimize(presentationPath) {
    console.log(`\n🚀 FINAL PUSH TO 95% WORLD-CLASS`);
    console.log(`📍 Current: 94% | Target: 95%+\n`);

    let html = await fs.readFile(presentationPath, 'utf-8');

    // Create backup
    const backupPath = presentationPath.replace('.html', `-final-push-backup-${Date.now()}.html`);
    await fs.copyFile(presentationPath, backupPath);
    console.log(`💾 Backup: ${path.basename(backupPath)}`);

    // The remaining issues from analysis:
    // 1. Still seeing font smoothing requests on every slide
    // 2. Text-rendering optimization missing
    // 3. Some slides still need darker text
    // 4. Letter spacing on headers
    // 5. Consistent vertical rhythm

    const finalPushCSS = `
    
    /* ===== FINAL PUSH TO 95% WORLD-CLASS ===== */
    /* The Last Mile - Micro-optimizations that matter */
    
    /* 1. ENSURE font smoothing is REALLY applied */
    * {
        -webkit-font-smoothing: antialiased !important;
        -moz-osx-font-smoothing: grayscale !important;
        text-rendering: optimizeLegibility !important;
        font-kerning: normal !important;
    }
    
    /* 2. Professional letter-spacing on ALL headers */
    .reveal h1, 
    .reveal h2, 
    .reveal h3, 
    .reveal h4 {
        letter-spacing: -0.02em !important;
        font-feature-settings: "kern" 1, "liga" 1, "calt" 1 !important;
    }
    
    /* 3. Darker text contrast (video requires this) */
    .reveal p,
    .reveal li,
    .reveal span:not([style*="color:"]) {
        color: #0a0a0a !important;
    }
    
    /* Headers even darker */
    .reveal h1, .reveal h2, .reveal h3 {
        color: #000000 !important;
    }
    
    /* 4. Consistent vertical rhythm (8px grid) */
    .reveal p { margin-bottom: 16px !important; }
    .reveal h1 { margin-bottom: 32px !important; }
    .reveal h2 { margin-bottom: 24px !important; }
    .reveal h3 { margin-bottom: 16px !important; }
    .reveal ul, .reveal ol { margin: 24px 0 !important; }
    .reveal li { margin-bottom: 16px !important; }
    
    /* 5. Enhanced font weights for hierarchy */
    .reveal h1 { font-weight: 800 !important; }
    .reveal h2 { font-weight: 700 !important; }
    .reveal h3 { font-weight: 600 !important; }
    .reveal strong { font-weight: 700 !important; }
    
    /* 6. Perfect shadows on EVERYTHING */
    .image-panel,
    .content-panel,
    .stat-card,
    .journey-card,
    .right-card,
    div[style*="background: white"],
    div[style*="background:#fff"],
    div[style*="background: #fff"] {
        box-shadow: 0 2px 4px rgba(0,0,0,0.02), 
                    0 4px 8px rgba(0,0,0,0.04),
                    0 8px 16px rgba(0,0,0,0.06),
                    0 16px 32px rgba(0,0,0,0.08) !important;
    }
    
    /* 7. CSS Gap for modern layouts */
    div[style*="display: grid"],
    div[style*="display:grid"] {
        gap: 24px !important;
    }
    
    div[style*="display: flex"],
    div[style*="display:flex"] {
        gap: 16px !important;
    }
    
    /* 8. Micro-polish details */
    .elegant-divider {
        height: 3px !important;
        background: linear-gradient(90deg, 
            transparent 0%, 
            var(--bloom-sage) 20%, 
            var(--bloom-sage) 80%, 
            transparent 100%) !important;
    }
    
    /* 9. Image optimization for video */
    img {
        image-rendering: -webkit-optimize-contrast !important;
        image-rendering: crisp-edges !important;
    }
    
    /* 10. Perfect line heights */
    .reveal p { line-height: 1.7 !important; }
    .reveal li { line-height: 1.8 !important; }
    .reveal h1 { line-height: 1.1 !important; }
    .reveal h2 { line-height: 1.2 !important; }
    .reveal h3 { line-height: 1.3 !important; }
    `;

    // Inject the final CSS
    const styleEndIndex = html.lastIndexOf('</style>');
    if (styleEndIndex > -1) {
      html = html.substring(0, styleEndIndex) + finalPushCSS + '\n    </style>' + html.substring(styleEndIndex + 8);
    }

    // Final HTML tweaks
    console.log(`\n🔧 APPLYING FINAL TWEAKS:`);

    // Ensure ALL text uses optimal sizes
    const textSizeMap = {
      '1.4rem': '1.5rem',
      '1.35rem': '1.5rem',
      '1.45rem': '1.5rem'
    };

    for (const [oldSize, newSize] of Object.entries(textSizeMap)) {
      const regex = new RegExp(`font-size:\\s*${oldSize}`, 'g');
      const matches = html.match(regex);
      if (matches) {
        html = html.replace(regex, `font-size: ${newSize}`);
        console.log(`  ✅ Optimized ${matches.length} instances of ${oldSize}`);
      }
    }

    // Write the final version
    await fs.writeFile(presentationPath, html);

    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ FINAL PUSH COMPLETE!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 Micro-optimizations applied:
   • Font smoothing forced on ALL elements
   • Letter spacing perfected on headers
   • Maximum contrast for video (pure black headers)
   • 8px vertical rhythm grid implemented
   • Enhanced font weights for hierarchy
   • Multi-layer shadows on all cards
   • Modern CSS gap properties
   • Perfect line heights
   
📊 Expected Score: 95%+ WORLD-CLASS! 🏆

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
🚀 Final Push to 95%

The last 1% to achieve world-class status!
Currently at 94% - this will get us over the line.

Usage:
  npm run final-push "week1 lesson1"
    `);
    process.exit(0);
  }

  const optimizer = new FinalPushOptimizer();
  
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
    
    await optimizer.optimize(presentationPath);
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = FinalPushOptimizer;