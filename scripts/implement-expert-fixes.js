#!/usr/bin/env node

/**
 * IMPLEMENT EXPERT PANEL FIXES
 * Based on expert review findings
 */

const fs = require('fs').promises;
const path = require('path');

class ExpertFixImplementer {
  async implement(presentationPath) {
    console.log(`\n🔧 IMPLEMENTING EXPERT PANEL FIXES`);
    console.log(`📍 Target: ${presentationPath}\n`);

    let html = await fs.readFile(presentationPath, 'utf-8');

    // Create backup
    const backupPath = presentationPath.replace('.html', `-expert-fixes-backup-${Date.now()}.html`);
    await fs.copyFile(presentationPath, backupPath);
    console.log(`💾 Backup: ${path.basename(backupPath)}`);

    console.log(`\n📝 APPLYING EXPERT RECOMMENDATIONS:\n`);

    // CRITICAL FIX 1: Text over images need scrims
    // Slides 1, 4, 5, 7, 8, 10, 12 need protection layers
    console.log(`1️⃣ Adding text protection scrims to slides with background images...`);
    
    // Add scrim CSS first
    const scrimCSS = `
    
    /* ===== EXPERT PANEL FIXES ===== */
    /* Text protection scrims for readability */
    
    /* Hero scrim for slides with background images */
    .hero-scrim,
    .text-protection-scrim {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(to bottom, 
            transparent 0%, 
            rgba(0,0,0,0.3) 30%, 
            rgba(0,0,0,0.7) 60%, 
            rgba(0,0,0,0.85) 100%);
        pointer-events: none;
        z-index: 1;
    }
    
    /* Ensure text is above scrim */
    .hero-content,
    .text-protection {
        position: relative;
        z-index: 2;
    }
    
    /* White text on dark scrims */
    .hero-content h1,
    .hero-content h2,
    .hero-content h3,
    .hero-content p,
    .text-protection h1,
    .text-protection h2,
    .text-protection h3,
    .text-protection p {
        color: white !important;
        text-shadow: 0 2px 8px rgba(0,0,0,0.5) !important;
    }
    `;

    // Inject scrim CSS
    const styleEndIndex = html.lastIndexOf('</style>');
    if (styleEndIndex > -1) {
      html = html.substring(0, styleEndIndex) + scrimCSS + '\n    </style>' + html.substring(styleEndIndex + 8);
    }

    // Add scrims to slides with background images
    let scrimCount = 0;
    html = html.replace(/<section([^>]*data-background-image[^>]*)>([\s\S]*?)<\/section>/g, (match, attrs, content) => {
      // Check if scrim already exists
      if (!content.includes('hero-scrim') && !content.includes('text-protection-scrim')) {
        scrimCount++;
        // Add scrim div after opening section tag
        return `<section${attrs}>
                <div class="hero-scrim"></div>${content}</section>`;
      }
      return match;
    });
    console.log(`  ✅ Added ${scrimCount} text protection scrims`);

    // CRITICAL FIX 2: Slide 8 - Dark text on dark background
    console.log(`\n2️⃣ Fixing dark text on dark background (Slide 8)...`);
    
    // Find slide 8 specifically (data-background-gradient)
    const slide8Regex = /<section[^>]*data-background-gradient[^>]*>([\s\S]*?)<\/section>/;
    const slide8Match = html.match(slide8Regex);
    
    if (slide8Match) {
      let slide8Content = slide8Match[0];
      
      // Fix all text to be white
      slide8Content = slide8Content.replace(/style="color:\s*#?\w+"/g, 'style="color: white"');
      
      // Add explicit white color to any text without color
      slide8Content = slide8Content.replace(/<h(\d)([^>]*)>/g, (m, level, attrs) => {
        if (!attrs.includes('style=')) {
          return `<h${level}${attrs} style="color: white">`;
        } else if (!attrs.includes('color:')) {
          return m.replace('style="', 'style="color: white; ');
        }
        return m;
      });
      
      slide8Content = slide8Content.replace(/<p([^>]*)>/g, (m, attrs) => {
        if (!attrs.includes('style=')) {
          return `<p${attrs} style="color: white">`;
        } else if (!attrs.includes('color:')) {
          return m.replace('style="', 'style="color: white; ');
        }
        return m;
      });
      
      slide8Content = slide8Content.replace(/<span([^>]*)>/g, (m, attrs) => {
        if (!attrs.includes('style=')) {
          return `<span${attrs} style="color: white">`;
        } else if (!attrs.includes('color:')) {
          return m.replace('style="', 'style="color: white; ');
        }
        return m;
      });
      
      html = html.replace(slide8Regex, slide8Content);
      console.log(`  ✅ Fixed dark text on gradient background`);
    }

    // ADDITIONAL CSS FIXES for all dark background slides
    const darkSlideFixCSS = `
    
    /* Fix all dark background slides */
    section[data-background-color="#1a1a1a"] h1,
    section[data-background-color="#1a1a1a"] h2,
    section[data-background-color="#1a1a1a"] h3,
    section[data-background-color="#1a1a1a"] p,
    section[data-background-color="#1a1a1a"] span,
    section[data-background-color="#1a1a1a"] li,
    section[data-background-gradient*="8B9A82"] h1,
    section[data-background-gradient*="8B9A82"] h2,
    section[data-background-gradient*="8B9A82"] h3,
    section[data-background-gradient*="8B9A82"] p,
    section[data-background-gradient*="8B9A82"] span,
    section[data-background-gradient*="8B9A82"] blockquote {
        color: white !important;
        text-shadow: 0 2px 8px rgba(0,0,0,0.5) !important;
    }
    
    /* Ensure fragment visibility on dark backgrounds */
    section[data-background-color="#1a1a1a"] .fragment,
    section[data-background-gradient*="8B9A82"] .fragment {
        color: white !important;
    }
    `;

    // Add dark slide fixes
    const lastStyleIndex = html.lastIndexOf('</style>');
    if (lastStyleIndex > -1) {
      html = html.substring(0, lastStyleIndex) + darkSlideFixCSS + '\n    </style>' + html.substring(lastStyleIndex + 8);
    }

    // FIX 3: Break long paragraphs into bullet points (warning from cognitive load expert)
    console.log(`\n3️⃣ Breaking long paragraphs into readable chunks...`);
    
    // Find paragraphs over 150 characters
    let longParagraphCount = 0;
    html = html.replace(/<p([^>]*)>([^<]{150,})<\/p>/g, (match, attrs, text) => {
      // Skip if it's already styled as a quote or special text
      if (attrs.includes('pullquote') || attrs.includes('quote')) {
        return match;
      }
      
      // If it has multiple sentences, consider breaking
      const sentences = text.match(/[^.!?]+[.!?]+/g);
      if (sentences && sentences.length > 2) {
        longParagraphCount++;
        // Add line breaks between sentences for better readability
        const improvedText = sentences.join('<br/><br/>');
        return `<p${attrs}>${improvedText}</p>`;
      }
      
      return match;
    });
    console.log(`  ✅ Improved ${longParagraphCount} long paragraphs`);

    // Write the fixed file
    await fs.writeFile(presentationPath, html);

    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ EXPERT FIXES IMPLEMENTED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Changes Applied:
   • ${scrimCount} text protection scrims added
   • Dark text on dark background fixed (Slide 8)
   • All dark slides now have white text
   • ${longParagraphCount} long paragraphs improved
   
🎯 Expected Outcome:
   • All text readable over images
   • No more contrast issues
   • Better cognitive load management
   
📁 Updated: ${presentationPath}
💾 Backup: ${backupPath}

🚀 Next: Run expert panel again to verify fixes
`);

    return { scrimCount, longParagraphCount, backupPath };
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🔧 Expert Panel Fix Implementation

Implements the specific fixes identified by the expert panel:
- Adds text protection scrims to images
- Fixes dark text on dark backgrounds
- Improves long paragraphs

Usage:
  npm run implement-expert "week1 lesson1"
    `);
    process.exit(0);
  }

  const fixer = new ExpertFixImplementer();
  
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
    
    await fixer.implement(presentationPath);
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = ExpertFixImplementer;