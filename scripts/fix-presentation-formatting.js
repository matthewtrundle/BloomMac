#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

/**
 * Fix presentation formatting and animation issues
 * Ensures proper sequential reveal for video recording
 */
class PresentationFormatter {
  async fix(presentationPath) {
    console.log(`\n🔧 Fixing Presentation Formatting`);
    console.log(`📍 Target: ${presentationPath}\n`);

    let html = await fs.readFile(presentationPath, 'utf-8');

    // Create backup
    const backupPath = presentationPath.replace('.html', `-format-backup-${Date.now()}.html`);
    await fs.copyFile(presentationPath, backupPath);
    console.log(`💾 Backup created: ${backupPath}`);

    // Remove problematic CSS that breaks animations
    const fixesToApply = [
      {
        name: "Remove animation disabling",
        find: /\/\* Disable animations for video recording \*\/[\s\S]*?\/\* Remove transitions \*\/\s*\*\s*{\s*transition:\s*none\s*!important;\s*}/g,
        replace: "/* Animations restored for proper sequencing */"
      },
      {
        name: "Remove forced fragment visibility",
        find: /\.fragment\s*{\s*opacity:\s*1\s*!important;\s*visibility:\s*visible\s*!important;\s*}/g,
        replace: ""
      },
      {
        name: "Remove entrance animation override",
        find: /\.reveal \.slides section\.present > \* {\s*animation:\s*none\s*!important;\s*}/g,
        replace: ""
      },
      {
        name: "Fix overly aggressive spacing",
        find: /\/\* More space between elements \*\/[\s\S]*?margin-top:\s*1\.5rem\s*!important;\s*}/g,
        replace: ""
      },
      {
        name: "Fix grid gap override",
        find: /div\[style\*="grid"\]\s*{\s*gap:\s*2rem\s*!important;\s*}/g,
        replace: ""
      },
      {
        name: "Fix padding override",
        find: /div\[style\*="padding:\s*2rem"\]\s*{\s*padding:\s*2\.5rem\s*!important;\s*}/g,
        replace: ""
      },
      {
        name: "Remove visible class addition",
        find: /class="fragment visible/g,
        replace: 'class="fragment'
      }
    ];

    // Apply fixes
    let fixCount = 0;
    for (const fix of fixesToApply) {
      const before = html.length;
      html = html.replace(fix.find, fix.replace);
      if (html.length !== before) {
        console.log(`✅ Applied: ${fix.name}`);
        fixCount++;
      }
    }

    // Add proper video-optimized CSS
    const properVideoCSS = `
        
        /* ===== PROPER VIDEO RECORDING OPTIMIZATIONS ===== */
        /* Maintains sequential reveal while optimizing for video */
        
        /* 1. Smooth Fragment Transitions */
        .reveal .fragment {
            transition: all 0.5s ease-out !important;
        }
        
        .reveal .fragment.visible {
            transition: all 0.5s ease-out !important;
        }
        
        /* 2. Text Optimization for Video (without breaking layout) */
        .reveal h1 { 
            font-size: clamp(3rem, 5vw, 4.5rem) !important;
            font-weight: 700 !important;
            -webkit-font-smoothing: antialiased !important;
        }
        
        .reveal h2 { 
            font-size: clamp(2.5rem, 4vw, 3.5rem) !important;
            font-weight: 600 !important;
            -webkit-font-smoothing: antialiased !important;
        }
        
        .reveal h3 { 
            font-size: clamp(2rem, 3vw, 2.5rem) !important;
            -webkit-font-smoothing: antialiased !important;
        }
        
        .reveal p {
            font-size: clamp(1.3rem, 2vw, 1.6rem) !important;
            line-height: 1.7 !important;
            -webkit-font-smoothing: antialiased !important;
        }
        
        /* 3. Better shadows without breaking layout */
        .image-panel {
            box-shadow: 0 20px 60px rgba(0,0,0,0.12) !important;
        }
        
        /* 4. Ensure good contrast for video */
        .reveal .slides section {
            color: #1a1a1a !important;
        }
        
        /* 5. Remove progress indicator for video */
        .progress-indicator {
            display: none !important;
        }
        
        /* 6. Remove skip nav for video */
        .skip-nav {
            display: none !important;
        }
        
        /* 7. Subtle entrance for non-fragment elements */
        @keyframes gentleFadeIn {
            from { opacity: 0.8; }
            to { opacity: 1; }
        }
        
        .reveal .slides section.present {
            animation: gentleFadeIn 0.5s ease-out;
        }
        
        /* 8. Fix specific spacing issues */
        .elegant-divider {
            margin: 1.5rem 0 !important;
        }
        
        .subtitle-caps {
            margin-bottom: 0.8rem !important;
        }
        
        /* 9. Ensure fragments work properly */
        .reveal .fragment {
            opacity: 0 !important;
            visibility: hidden !important;
        }
        
        .reveal .fragment.visible {
            opacity: 1 !important;
            visibility: visible !important;
        }
        
        .reveal .fragment.current-fragment {
            opacity: 1 !important;
            visibility: visible !important;
        }
        
        /* 10. Card improvements without breaking layout */
        .stat-card {
            transition: none !important; /* No hover for video */
        }
        
        /* 11. Ensure white backgrounds */
        .reveal {
            background: #FFFFFF !important;
        }
        
        section[data-background-color="#FFFFFF"],
        section[data-background-color="#FFF9F0"],
        section[data-background-color="#FDFCFB"] {
            background-color: #FFFFFF !important;
        }
    `;

    // Replace the entire video optimization section
    const styleEndIndex = html.indexOf('</style>');
    if (styleEndIndex > -1) {
      // Remove old video optimizations if they exist
      const videoOptStart = html.indexOf('/* ===== VIDEO PRESENTATION OPTIMIZATIONS =====');
      if (videoOptStart > -1 && videoOptStart < styleEndIndex) {
        html = html.substring(0, videoOptStart) + html.substring(styleEndIndex);
      }
      
      // Add new optimizations
      const newStyleEnd = html.indexOf('</style>');
      html = html.substring(0, newStyleEnd) + properVideoCSS + '\n    </style>' + html.substring(newStyleEnd + 8);
    }

    // Write fixed file
    await fs.writeFile(presentationPath, html);

    console.log(`\n✨ Formatting fixed!`);
    console.log(`   - ${fixCount} issues resolved`);
    console.log(`   - Sequential animations restored`);
    console.log(`   - Video optimizations applied properly`);
    console.log(`\n📁 Updated: ${presentationPath}`);

    return { fixCount, backupPath };
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🔧 Presentation Format Fixer

Fixes formatting issues and restores proper sequential animations.

Usage:
  npm run fix-format "week1 lesson1"
  npm run fix-format <presentation-path>
    `);
    process.exit(0);
  }

  const formatter = new PresentationFormatter();
  
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
    
    await formatter.fix(presentationPath);
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = PresentationFormatter;