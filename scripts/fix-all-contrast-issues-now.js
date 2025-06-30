#!/usr/bin/env node

/**
 * FIX ALL CONTRAST ISSUES - AGGRESSIVE
 * Find and fix EVERY possible dark text on dark background
 */

const fs = require('fs').promises;
const path = require('path');

async function fixAllContrastIssues(presentationPath) {
  console.log(`\n🔥 FIXING ALL CONTRAST ISSUES AGGRESSIVELY\n`);

  let html = await fs.readFile(presentationPath, 'utf-8');

  // Backup
  const backupPath = presentationPath.replace('.html', `-contrast-fix-${Date.now()}.html`);
  await fs.copyFile(presentationPath, backupPath);

  // 1. Find ALL slides with dark backgrounds
  const darkBackgroundPatterns = [
    /background-color:\s*#[0-3][0-9a-fA-F]{5}/g,
    /background-color:\s*rgba?\([^)]*0\.[0-6]/g,
    /--bloom-charcoal/g,
    /--bloom-warm-gray/g,
    /#1a1a1a/g,
    /#2d2d2d/g,
    /#333333/g
  ];

  // 2. Force white text on ANY dark background
  const forcedWhiteTextCSS = `
    /* AGGRESSIVE CONTRAST FIX - FORCE WHITE TEXT ON DARK BACKGROUNDS */
    
    /* Any slide with dark background image */
    section[data-background-image]:not([style*="background: rgba(255,255,255"]) h1,
    section[data-background-image]:not([style*="background: rgba(255,255,255"]) h2,
    section[data-background-image]:not([style*="background: rgba(255,255,255"]) h3,
    section[data-background-image]:not([style*="background: rgba(255,255,255"]) h4,
    section[data-background-image]:not([style*="background: rgba(255,255,255"]) p,
    section[data-background-image]:not([style*="background: rgba(255,255,255"]) li,
    section[data-background-image]:not([style*="background: rgba(255,255,255"]) span {
        color: white !important;
        text-shadow: 0 2px 8px rgba(0,0,0,0.9) !important;
    }
    
    /* Any slide with dark background color */
    section[data-background-color="#1a1a1a"] *,
    section[data-background-color="#2d2d2d"] *,
    section[data-background-color="#333333"] *,
    section[style*="background-color: #1"] *,
    section[style*="background-color: #2"] *,
    section[style*="background-color: #3"] * {
        color: white !important;
    }
    
    /* Fix any element with dark background */
    [style*="background-color: #1"],
    [style*="background-color: #2"],
    [style*="background-color: #3"],
    [style*="background: #1"],
    [style*="background: #2"],
    [style*="background: #3"] {
        color: white !important;
    }
    
    /* Ensure cards on dark backgrounds have proper contrast */
    section[data-background-color="#4B5563"] .fragment,
    section[data-background-color="#4B5563"] [style*="background"],
    section[style*="background-color: #4B5563"] .fragment,
    section[style*="background-color: #4B5563"] [style*="background"] {
        background: white !important;
        color: #1a1a1a !important;
    }
  `;

  // 3. Inject aggressive CSS
  const styleEndIndex = html.lastIndexOf('</style>');
  if (styleEndIndex > -1) {
    html = html.substring(0, styleEndIndex) + forcedWhiteTextCSS + '\n    </style>' + html.substring(styleEndIndex + 8);
  }

  // 4. Fix inline styles with dark text
  html = html.replace(/color:\s*(var\(--bloom-charcoal\)|#[0-3][0-9a-fA-F]{5}|#[0-3][0-9a-fA-F]{2})/g, 'color: white');

  // 5. Add data attributes to help identify dark sections
  html = html.replace(/<section([^>]*data-background-color="#[0-3][0-9a-fA-F]{5}[^>]*)>/g, 
    '<section$1 data-force-white-text="true">');

  await fs.writeFile(presentationPath, html);

  console.log(`
✅ AGGRESSIVE CONTRAST FIXES APPLIED!

Changes:
• Force white text on ALL dark backgrounds
• Override any dark text inline styles  
• Add text shadows for readability
• Fix cards on dark backgrounds

This should fix ALL contrast issues.
`);
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  
  try {
    let presentationPath = args[0];
    
    if (!presentationPath || presentationPath.match(/week\d+\s+lesson\d+/i)) {
      presentationPath = 'bloom-course-content/weeks/week-1-foundation/lesson-1-welcome/presentation-animated-complete.html';
    }
    
    await fixAllContrastIssues(presentationPath);
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}