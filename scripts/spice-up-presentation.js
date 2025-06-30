#!/usr/bin/env node

/**
 * SPICE UP PRESENTATION - Ultra Enhancement Mode
 * Takes presentations from good to WORLD-CLASS (95%+)
 * Based on critical analysis feedback
 */

const fs = require('fs').promises;
const path = require('path');

class PresentationSpicer {
  constructor() {
    this.enhancements = {
      // CRITICAL TYPOGRAPHY FIXES (Biggest impact)
      typography: {
        name: "🔥 TYPOGRAPHY OVERHAUL",
        fixes: [
          {
            pattern: /font-size:\s*(0\.9|0\.95|1|1\.05|1\.1|1\.15|1\.2|1\.25)rem/g,
            replacement: 'font-size: 1.8rem',
            description: "Boost ALL small text to video-ready sizes"
          },
          {
            pattern: /font-size:\s*clamp\(1\.1rem[^)]+\)/g,
            replacement: 'font-size: clamp(1.8rem, 2.5vw, 2.2rem)',
            description: "Fix clamp() values for better readability"
          }
        ],
        css: `
/* 🌟 WORLD-CLASS TYPOGRAPHY SYSTEM */
.reveal {
  -webkit-font-smoothing: antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
  text-rendering: optimizeLegibility !important;
  font-feature-settings: "kern" 1, "liga" 1 !important;
}

.reveal h1 {
  font-size: clamp(4rem, 7vw, 6rem) !important;
  font-weight: 800 !important;
  letter-spacing: -0.04em !important;
  line-height: 0.95 !important;
  color: #0a0a0a !important;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
}

.reveal h2 {
  font-size: clamp(3rem, 5vw, 4.5rem) !important;
  font-weight: 700 !important;
  letter-spacing: -0.03em !important;
  line-height: 1.1 !important;
  color: #0a0a0a !important;
}

.reveal h3 {
  font-size: clamp(2.2rem, 3.5vw, 3rem) !important;
  font-weight: 600 !important;
  letter-spacing: -0.02em !important;
  color: #1a1a1a !important;
}

.reveal p, .reveal li {
  font-size: clamp(1.8rem, 2.5vw, 2.2rem) !important;
  line-height: 1.7 !important;
  color: #1a1a1a !important;
  font-weight: 400 !important;
}

/* Ensure list items have proper spacing */
.reveal ul, .reveal ol {
  margin-left: 0 !important;
}

.reveal li {
  margin-bottom: 1.5rem !important;
}

/* Bold text enhancement */
.reveal strong {
  font-weight: 700 !important;
  color: #0a0a0a !important;
}

/* Subtitle and caption text */
.subtitle-caps {
  font-size: 1.6rem !important;
  letter-spacing: 0.15em !important;
  font-weight: 600 !important;
  color: #2a2a2a !important;
}`
      },

      // DEPTH & SHADOWS (Professional polish)
      shadows: {
        name: "💎 PREMIUM SHADOW SYSTEM",
        css: `
/* 🎨 MULTI-LAYER SHADOW SYSTEM */
.image-panel,
.stat-card,
.content-card,
div[style*="background: white"],
div[style*="background: #fff"],
div[style*="background: rgb(255"],
div[style*="background: rgba(255, 255, 255"] {
  box-shadow: 
    0 2px 4px rgba(0,0,0,0.04),
    0 8px 16px rgba(0,0,0,0.08),
    0 16px 32px rgba(0,0,0,0.12),
    0 24px 48px rgba(0,0,0,0.16) !important;
  transition: box-shadow 0.3s ease !important;
}

/* Hero images get dramatic shadows */
.hero-image-slide,
.asymmetric-grid .image-panel {
  box-shadow: 
    0 4px 8px rgba(0,0,0,0.06),
    0 12px 24px rgba(0,0,0,0.12),
    0 24px 48px rgba(0,0,0,0.18),
    0 40px 80px rgba(0,0,0,0.24) !important;
}

/* Floating elements */
.fragment[style*="background"],
.stat-overlay {
  box-shadow: 
    0 4px 12px rgba(0,0,0,0.1),
    0 12px 28px rgba(0,0,0,0.15),
    0 24px 48px rgba(0,0,0,0.2) !important;
}

/* Text on dark backgrounds needs glow */
.hero-content h1,
.hero-content p,
[style*="color: white"] {
  text-shadow: 
    0 2px 4px rgba(0,0,0,0.3),
    0 4px 8px rgba(0,0,0,0.2),
    0 8px 16px rgba(0,0,0,0.1) !important;
}`
      },

      // SPACING & BREATHING ROOM
      spacing: {
        name: "🌬️ LUXURIOUS SPACING",
        css: `
/* 📐 PROFESSIONAL SPACING SYSTEM */
.reveal .slides section {
  padding: 4rem !important;
}

.content-panel {
  padding: 4rem !important;
}

.container {
  padding: 0 4rem !important;
  max-width: 1600px !important;
  margin: 0 auto !important;
}

/* Vertical rhythm perfection */
.reveal p + p,
.reveal p + div,
.reveal div + p,
.reveal h2 + p,
.reveal h3 + p {
  margin-top: 2rem !important;
}

.reveal h1 + p {
  margin-top: 2.5rem !important;
}

.reveal h2 {
  margin-top: 3rem !important;
  margin-bottom: 2rem !important;
}

.reveal h3 {
  margin-top: 2.5rem !important;
  margin-bottom: 1.5rem !important;
}

/* Grid and flex gaps */
div[style*="grid"] {
  gap: 3rem !important;
}

div[style*="flex"] {
  gap: 2rem !important;
}

/* Card padding luxury */
.stat-card,
div[style*="padding: 2rem"],
div[style*="padding:2rem"] {
  padding: 3rem !important;
}

/* List breathing room */
.reveal ul, .reveal ol {
  margin: 2rem 0 !important;
}

/* Divider spacing */
.elegant-divider {
  margin: 3rem 0 !important;
}`
      },

      // COLOR ENHANCEMENT
      colors: {
        name: "🎨 VIBRANT COLOR BOOST",
        css: `
/* 🌈 ENHANCED COLOR SYSTEM FOR VIDEO */
:root {
  /* Boosted saturation for video */
  --bloom-coral: #FF5252 !important;
  --bloom-peach: #FF9575 !important;
  --bloom-golden: #FFD54F !important;
  --bloom-mint: #69F0AE !important;
  --bloom-lavender: #B388FF !important;
  --bloom-sky: #40C4FF !important;
  --bloom-rose: #FF80AB !important;
  --bloom-teal: #26C6DA !important;
  --bloom-orange: #FF7043 !important;
  
  /* Professional grays */
  --bloom-charcoal: #0a0a0a !important;
  --bloom-dark-gray: #1a1a1a !important;
  --bloom-text: #2a2a2a !important;
  --bloom-light-text: #4a4a4a !important;
}

/* Ensure pure white backgrounds */
.reveal,
.reveal .slides,
section[data-background-color="#FFFFFF"],
section[data-background-color="#FFF9F0"],
section[data-background-color="#FDFCFB"] {
  background-color: #FFFFFF !important;
}

/* Accent color usage */
span[style*="color: var(--bloom-coral)"] {
  font-weight: 700 !important;
  font-size: 1.1em !important;
}

/* Gradient enhancements */
.gradient-text {
  background: linear-gradient(135deg, 
    var(--bloom-coral) 0%, 
    var(--bloom-lavender) 50%,
    var(--bloom-sky) 100%) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
  font-weight: 800 !important;
}`
      },

      // MICRO-INTERACTIONS & POLISH
      polish: {
        name: "✨ FINISHING TOUCHES",
        css: `
/* 🎯 PROFESSIONAL POLISH DETAILS */

/* Rounded corners harmony */
.image-panel,
.stat-card,
.content-card,
div[style*="border-radius"] {
  border-radius: 20px !important;
  overflow: hidden !important;
}

/* Image enhancements */
.image-panel img,
.stat-card img {
  object-fit: cover !important;
  width: 100% !important;
  height: 100% !important;
  filter: contrast(1.05) brightness(0.98) !important;
}

/* Premium borders */
.image-panel,
.stat-card {
  border: 1px solid rgba(0,0,0,0.06) !important;
}

/* Number styling */
.display-serif {
  font-family: 'Playfair Display', 'Cormorant Garamond', serif !important;
  font-weight: 700 !important;
  font-size: 5rem !important;
  letter-spacing: -0.02em !important;
}

/* Quote enhancement */
.pullquote {
  position: relative !important;
  padding: 3rem 4rem !important;
  font-size: clamp(2.2rem, 3.5vw, 3rem) !important;
  font-weight: 500 !important;
  font-style: italic !important;
  color: var(--bloom-sage) !important;
  background: linear-gradient(135deg, 
    rgba(139, 154, 130, 0.05) 0%, 
    rgba(139, 154, 130, 0.1) 100%) !important;
  border-left: 6px solid var(--bloom-sage) !important;
  border-radius: 0 20px 20px 0 !important;
}

.pullquote::before {
  content: '"' !important;
  position: absolute !important;
  top: -20px !important;
  left: 20px !important;
  font-size: 8rem !important;
  opacity: 0.15 !important;
  font-family: 'Cormorant Garamond', serif !important;
}

/* Stat cards dramatic style */
.stat-card .display-serif,
div[class*="stat"] .display-serif {
  font-size: 5.5rem !important;
  font-weight: 800 !important;
  color: var(--bloom-coral) !important;
  text-shadow: 0 4px 8px rgba(255, 82, 82, 0.2) !important;
}

/* Progress dots (if any) */
.progress-indicator {
  display: none !important;
}

/* Skip navigation */
.skip-nav {
  display: none !important;
}

/* Ensure crisp edges */
* {
  -webkit-backface-visibility: hidden !important;
  backface-visibility: hidden !important;
}`
      },

      // ANIMATION REFINEMENTS
      animations: {
        name: "🎬 SMOOTH TRANSITIONS",
        css: `
/* 🌊 REFINED ANIMATION SYSTEM */

/* Fragment transitions */
.reveal .fragment {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.reveal .fragment.visible {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

/* Slide transitions */
.reveal .slides section {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

/* Subtle entrance animation */
@keyframes elegantFadeIn {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.reveal .slides section.present {
  animation: elegantFadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

/* Hover states for interactive elements */
.stat-card,
.image-panel {
  transition: transform 0.3s ease, box-shadow 0.3s ease !important;
}

.stat-card:hover,
.image-panel:hover {
  transform: translateY(-4px) !important;
  box-shadow: 
    0 4px 8px rgba(0,0,0,0.06),
    0 12px 24px rgba(0,0,0,0.12),
    0 24px 48px rgba(0,0,0,0.18),
    0 40px 80px rgba(0,0,0,0.24) !important;
}`
      }
    };
  }

  async spiceUp(presentationPath) {
    console.log(`
🌶️  SPICE UP PRESENTATION - WORLD-CLASS MODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Target: ${presentationPath}
Goal: Push to 95%+ World-Class Standard
`);

    // Read the presentation
    let html = await fs.readFile(presentationPath, 'utf-8');
    const originalLength = html.length;

    // Create backup
    const backupPath = presentationPath.replace('.html', `-spiced-backup-${Date.now()}.html`);
    await fs.copyFile(presentationPath, backupPath);
    console.log(`\n💾 Backup created: ${path.basename(backupPath)}`);

    // Apply text replacements
    console.log(`\n🔧 APPLYING CRITICAL FIXES:`);
    let fixCount = 0;
    
    for (const fix of this.enhancements.typography.fixes) {
      const matches = html.match(fix.pattern);
      if (matches) {
        console.log(`  ✅ ${fix.description} (${matches.length} instances)`);
        html = html.replace(fix.pattern, fix.replacement);
        fixCount += matches.length;
      }
    }

    // Build the mega CSS injection
    console.log(`\n💉 INJECTING WORLD-CLASS ENHANCEMENTS:`);
    const cssInjections = [];
    
    for (const [key, enhancement] of Object.entries(this.enhancements)) {
      if (enhancement.css) {
        console.log(`  ${enhancement.name}`);
        cssInjections.push(enhancement.css);
      }
    }

    // Create the ultimate CSS block
    const ultimateCSS = `
    
    /* ================================================================
       🔥 WORLD-CLASS PRESENTATION ENHANCEMENT SYSTEM 🔥
       Generated: ${new Date().toISOString()}
       Target Score: 95%+ (World-Class Standard)
       ================================================================ */
    
    ${cssInjections.join('\n\n')}
    
    /* ================================================================
       END WORLD-CLASS ENHANCEMENTS
       ================================================================ */
    `;

    // Inject the CSS
    const styleEndIndex = html.indexOf('</style>');
    if (styleEndIndex > -1) {
      html = html.substring(0, styleEndIndex) + ultimateCSS + '\n    </style>' + html.substring(styleEndIndex + 8);
    } else {
      // Add a new style tag if none exists
      const headEndIndex = html.indexOf('</head>');
      html = html.substring(0, headEndIndex) + 
        `<style>${ultimateCSS}</style>\n` + 
        html.substring(headEndIndex);
    }

    // Additional HTML fixes
    console.log(`\n🎯 APPLYING HTML OPTIMIZATIONS:`);
    
    // Ensure all fragments are properly set up
    html = html.replace(/class="fragment(?!\s)/g, 'class="fragment ');
    console.log(`  ✅ Fragment classes normalized`);
    
    // Add loading="eager" to all images for video
    html = html.replace(/(<img[^>]*?)>/g, (match, p1) => {
      if (!p1.includes('loading=')) {
        return p1 + ' loading="eager">';
      }
      return match;
    });
    console.log(`  ✅ Images optimized for video loading`);

    // Write the spiced-up file
    await fs.writeFile(presentationPath, html);

    // Summary
    const newLength = html.length;
    const increase = ((newLength - originalLength) / originalLength * 100).toFixed(1);

    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ SPICE-UP COMPLETE!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Results:
   • ${fixCount} critical typography fixes applied
   • ${Object.keys(this.enhancements).length} enhancement systems injected
   • File size increased by ${increase}% (quality additions)
   
🎯 Expected Improvements:
   • Typography: +15-20 points
   • Visual Hierarchy: +5-8 points  
   • Spacing: +5-7 points
   • Color & Contrast: +3-5 points
   • Polish & Details: +5-10 points
   
🚀 Next Steps:
   1. Run video-excellence analyzer to verify improvements
   2. Preview in browser for visual confirmation
   3. Record your video with confidence!

📁 Updated: ${presentationPath}
💾 Backup: ${backupPath}
`);

    return {
      fixCount,
      enhancementsApplied: Object.keys(this.enhancements).length,
      backupPath
    };
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
🌶️  SPICE UP PRESENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Push your presentations to WORLD-CLASS standard (95%+)
Based on critical video excellence analysis.

Usage:
  npm run spice-up "week1 lesson1"
  npm run spice-up <presentation-path>

Examples:
  npm run spice-up "week1 lesson1"
  npm run spice-up bloom-course-content/weeks/week-1-foundation/lesson-1-welcome/presentation-animated-complete.html

This will:
  • Fix ALL critical typography issues
  • Add professional shadows and depth
  • Enhance spacing and breathing room
  • Boost color vibrancy for video
  • Add micro-polish details
  • Optimize animations for recording
`);
    process.exit(0);
  }

  const spicer = new PresentationSpicer();

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

    await spicer.spiceUp(presentationPath);

  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = PresentationSpicer;