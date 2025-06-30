#!/usr/bin/env node

/**
 * FIX SLIDE 8 - THE REAL ISSUE
 * The slide has a white overlay but might appear dark depending on the image
 */

const fs = require('fs').promises;
const path = require('path');

async function fixSlide8Correctly(presentationPath) {
  console.log(`\n🎯 FIXING SLIDE 8 - CONTRAST ISSUE\n`);

  let html = await fs.readFile(presentationPath, 'utf-8');

  // Backup
  const backupPath = presentationPath.replace('.html', `-slide8-correct-backup-${Date.now()}.html`);
  await fs.copyFile(presentationPath, backupPath);
  console.log(`💾 Backup: ${path.basename(backupPath)}`);

  // Find all sections
  const sections = html.split(/<section/);
  
  if (sections.length > 8) {
    // Get slide 8 (index 8 because first split is empty)
    let slide8 = '<section' + sections[8];
    const slide8End = slide8.indexOf('</section>') + 10;
    slide8 = slide8.substring(0, slide8End);
    
    console.log(`Found slide 8 - analyzing...`);
    
    // The issue: slide 8 has a white overlay but dark text might not be readable
    // Solution: Make the white overlay stronger OR change text to white with dark overlay
    
    // Option 1: Strengthen the white overlay
    let fixedSlide8 = slide8;
    
    // Change the white overlay to be more opaque
    fixedSlide8 = fixedSlide8.replace(
      'background: rgba(255,255,255,0.93)',
      'background: rgba(255,255,255,0.97)'
    );
    
    // Ensure all text has good contrast
    fixedSlide8 = fixedSlide8.replace(/color: var\(--bloom-charcoal\)/g, 'color: #0a0a0a');
    fixedSlide8 = fixedSlide8.replace(/color: var\(--bloom-warm-gray\)/g, 'color: #2a2a2a');
    
    // Add text shadows for better readability
    fixedSlide8 = fixedSlide8.replace(
      /<h[2-4]([^>]*)>/g,
      (match, attrs) => {
        if (!attrs.includes('text-shadow')) {
          if (attrs.includes('style=')) {
            return match.replace('style="', 'style="text-shadow: 0 1px 3px rgba(0,0,0,0.1); ');
          } else {
            return match.replace('>', ' style="text-shadow: 0 1px 3px rgba(0,0,0,0.1);">');
          }
        }
        return match;
      }
    );
    
    // Replace slide 8 in the HTML
    sections[8] = fixedSlide8.replace('<section', '');
    html = sections.join('<section');
  }

  // Add comprehensive CSS for slide 8 specifically
  const slide8CSS = `
    
    /* ===== SLIDE 8 SPECIFIC CONTRAST FIX ===== */
    
    /* Target slide 8 specifically */
    section:nth-of-type(8) {
        /* Ensure text is readable */
    }
    
    section:nth-of-type(8) h2,
    section:nth-of-type(8) h3,
    section:nth-of-type(8) h4 {
        color: #0a0a0a !important;
        text-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
        font-weight: 600 !important;
    }
    
    section:nth-of-type(8) p {
        color: #1a1a1a !important;
        font-weight: 500 !important;
    }
    
    /* Ensure colored elements stay vibrant */
    section:nth-of-type(8) [style*="--bloom-coral"] {
        color: var(--bloom-coral) !important;
        font-weight: 700 !important;
    }
    
    section:nth-of-type(8) [style*="--bloom-sky"] {
        color: var(--bloom-sky) !important;
        font-weight: 700 !important;
    }
    
    /* Alternative fix: If the expert sees it as dark, force white text */
    @media (prefers-color-scheme: dark) {
        section:nth-of-type(8) h2,
        section:nth-of-type(8) h3,
        section:nth-of-type(8) h4,
        section:nth-of-type(8) p {
            color: white !important;
            text-shadow: 0 2px 8px rgba(0,0,0,0.8) !important;
        }
    }
    `;

  // Inject the CSS
  const styleEndIndex = html.lastIndexOf('</style>');
  if (styleEndIndex > -1) {
    html = html.substring(0, styleEndIndex) + slide8CSS + '\n    </style>' + html.substring(styleEndIndex + 8);
  }

  // Write the fixed file
  await fs.writeFile(presentationPath, html);

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ SLIDE 8 CONTRAST FIXED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Changes made:
• Increased white overlay opacity (0.97)
• Changed charcoal/gray text to darker values
• Added subtle text shadows
• Added CSS fallback for dark mode

📁 Updated: ${presentationPath}
💾 Backup: ${backupPath}

🎯 This should resolve the contrast issue!
`);
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🎯 Fix Slide 8 Contrast Issue

Fixes the actual contrast problem on slide 8.

Usage:
  npm run fix-slide8-correct "week1 lesson1"
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
    
    await fixSlide8Correctly(presentationPath);
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { fixSlide8Correctly };