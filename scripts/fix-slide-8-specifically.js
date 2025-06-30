#!/usr/bin/env node

/**
 * FIX SLIDE 8 SPECIFICALLY
 * The one remaining critical issue
 */

const fs = require('fs').promises;
const path = require('path');

async function fixSlide8(presentationPath) {
  console.log(`\n🎯 FIXING SLIDE 8 - DARK TEXT ON DARK BACKGROUND\n`);

  let html = await fs.readFile(presentationPath, 'utf-8');

  // Backup
  const backupPath = presentationPath.replace('.html', `-slide8-fix-backup-${Date.now()}.html`);
  await fs.copyFile(presentationPath, backupPath);
  console.log(`💾 Backup: ${path.basename(backupPath)}`);

  // Add comprehensive CSS fix for ALL gradient backgrounds
  const slide8FixCSS = `
    
    /* ===== SLIDE 8 SPECIFIC FIX ===== */
    /* Force white text on ALL gradient backgrounds */
    
    /* Any section with gradient background */
    section[data-background-gradient] * {
        color: white !important;
        text-shadow: 0 3px 10px rgba(0,0,0,0.7) !important;
    }
    
    /* Specific gradient patterns */
    section[data-background-gradient*="#8B9A82"] *,
    section[data-background-gradient*="8B9A82"] *,
    section[data-background-gradient*="rgb(139"] *,
    section[data-background-gradient*="rgba(139"] * {
        color: white !important;
    }
    
    /* Blockquotes on gradients */
    section[data-background-gradient] blockquote {
        color: white !important;
        font-weight: 600 !important;
    }
    
    /* Emphasized text on gradients */
    section[data-background-gradient] em,
    section[data-background-gradient] strong {
        color: white !important;
    }
    
    /* Fragments on gradients */
    section[data-background-gradient] .fragment {
        color: white !important;
    }
    
    /* Even inline styles can't override this */
    section[data-background-gradient] [style*="color"] {
        color: white !important;
    }
    `;

  // Inject the CSS
  const styleEndIndex = html.lastIndexOf('</style>');
  if (styleEndIndex > -1) {
    html = html.substring(0, styleEndIndex) + slide8FixCSS + '\n    </style>' + html.substring(styleEndIndex + 8);
  }

  // Also fix any inline styles in gradient sections
  const gradientSectionRegex = /<section([^>]*data-background-gradient[^>]*)>([\s\S]*?)<\/section>/g;
  let fixCount = 0;
  
  html = html.replace(gradientSectionRegex, (match, attrs, content) => {
    fixCount++;
    
    // Remove any color styles that aren't white
    let fixedContent = content;
    
    // Fix inline color styles
    fixedContent = fixedContent.replace(/style="([^"]*?)color:\s*(?!white|#fff|#ffffff|rgba\(255,\s*255,\s*255)[^;"]+([^"]*?)"/g, 
      (m, before, after) => {
        return `style="${before}color: white${after}"`;
      });
    
    // Add color white to elements without color
    fixedContent = fixedContent.replace(/<(h[1-6]|p|span|blockquote)([^>]*?)>/g, (m, tag, attrs) => {
      if (!attrs.includes('style=')) {
        return `<${tag}${attrs} style="color: white">`;
      } else if (!attrs.includes('color:')) {
        return m.replace('style="', 'style="color: white; ');
      }
      return m;
    });
    
    return `<section${attrs}>${fixedContent}</section>`;
  });

  console.log(`✅ Fixed ${fixCount} gradient background sections`);

  // Write the fixed file
  await fs.writeFile(presentationPath, html);

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ SLIDE 8 FIXED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

All text on gradient backgrounds is now WHITE.
This should resolve the last critical issue.

📁 Updated: ${presentationPath}
💾 Backup: ${backupPath}

🎯 Next: Run expert panel to confirm 100% score!
`);
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🎯 Fix Slide 8 Specifically

Fixes the dark text on gradient background issue.

Usage:
  npm run fix-slide8 "week1 lesson1"
    `);
    process.exit(0);
  }

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
    
    await fixSlide8(presentationPath);
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { fixSlide8 };