#!/usr/bin/env node

/**
 * Video Presentation Optimizer
 * Focused improvements for presentations being recorded as videos
 * No interactive elements - pure visual/UI excellence
 */

const fs = require('fs').promises;
const path = require('path');

class VideoPresentationOptimizer {
  constructor() {
    this.improvements = {
      // Visual Polish (High Priority for Video)
      visualPolish: [
        {
          name: "Enhanced Typography Hierarchy",
          description: "Stronger visual hierarchy for video clarity",
          css: `
/* Video Recording Optimizations - Typography */
.reveal h1 { 
  font-size: clamp(3rem, 6vw, 5rem) !important;
  font-weight: 700 !important;
  letter-spacing: -0.03em !important;
}

.reveal h2 { 
  font-size: clamp(2.5rem, 5vw, 4rem) !important;
  font-weight: 600 !important;
}

.reveal h3 { 
  font-size: clamp(2rem, 4vw, 3rem) !important;
  font-weight: 600 !important;
}

/* Ensure all text is crisp for video */
.reveal * {
  -webkit-font-smoothing: antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
}`,
          priority: "critical"
        },
        {
          name: "Professional Shadow System",
          description: "Consistent, elegant shadows for depth",
          css: `
/* Professional Shadow System */
.image-panel,
.stat-card,
.fragment[style*="background"],
div[style*="box-shadow"] {
  box-shadow: 0 10px 40px rgba(0,0,0,0.08) !important;
}

/* Stronger shadows for hero elements */
.hero-image-slide,
.asymmetric-grid .image-panel {
  box-shadow: 0 20px 60px rgba(0,0,0,0.12) !important;
}`,
          priority: "high"
        },
        {
          name: "Color Vibrancy Boost",
          description: "Enhanced colors for video recording",
          css: `
/* Color Enhancement for Video */
:root {
  /* Boost saturation slightly for video */
  --bloom-coral: #FF5555;
  --bloom-peach: #FFB4A2;
  --bloom-golden: #FFCB77;
  --bloom-mint: #7FD9C5;
  --bloom-lavender: #C589E8;
  --bloom-sky: #5AB8FC;
}

/* Ensure backgrounds are pure white for video */
.reveal {
  background-color: #FFFFFF !important;
}

section[data-background-color="#FFFFFF"] {
  background-color: #FFFFFF !important;
}`,
          priority: "medium"
        }
      ],

      // Spacing & Breathing Room
      spacingRefinements: [
        {
          name: "Generous Padding",
          description: "More breathing room for video clarity",
          css: `
/* Enhanced Spacing for Video */
.reveal .slides section {
  padding: 3rem !important;
}

.content-panel {
  padding: 3rem !important;
}

.container {
  padding: 0 3rem !important;
}

/* More space between elements */
.reveal p + p,
.reveal p + div,
.reveal div + p {
  margin-top: 1.5rem !important;
}`,
          priority: "high"
        },
        {
          name: "Card Spacing",
          description: "Better separation between cards",
          css: `
/* Card Grid Spacing */
div[style*="grid"] {
  gap: 2rem !important;
}

/* Individual card padding */
.stat-card,
div[style*="padding: 2rem"] {
  padding: 2.5rem !important;
}`,
          priority: "medium"
        }
      ],

      // Visual Consistency
      consistency: [
        {
          name: "Border Radius Harmony",
          description: "Consistent rounded corners",
          css: `
/* Consistent Border Radius */
.image-panel,
.stat-card,
div[style*="border-radius"] {
  border-radius: 16px !important;
}

/* Smaller radius for inline elements */
.elegant-divider,
span[style*="border-radius"] {
  border-radius: 4px !important;
}`,
          priority: "low"
        },
        {
          name: "Line Height Optimization",
          description: "Optimal line height for readability",
          css: `
/* Optimal Line Heights */
.reveal p {
  line-height: 1.7 !important;
}

.reveal li {
  line-height: 1.8 !important;
  margin-bottom: 1rem !important;
}

.pullquote {
  line-height: 1.5 !important;
}`,
          priority: "high"
        }
      ],

      // Video-Specific Enhancements
      videoOptimizations: [
        {
          name: "Remove Animations",
          description: "Static content for smooth recording",
          css: `
/* Disable animations for video recording */
.reveal .slides section.present > * {
  animation: none !important;
}

.fragment {
  opacity: 1 !important;
  visibility: visible !important;
}

/* Remove transitions */
* {
  transition: none !important;
}`,
          priority: "critical"
        },
        {
          name: "High Contrast Mode",
          description: "Ensure text pops on video",
          css: `
/* Enhanced Contrast for Video */
.reveal h1, .reveal h2, .reveal h3, .reveal h4 {
  color: #0a0a0a !important;
}

.reveal p {
  color: #2a2a2a !important;
}

/* Ensure colored text has enough contrast */
span[style*="color: var(--bloom-coral)"] {
  font-weight: 600 !important;
}`,
          priority: "high"
        }
      ],

      // Polish Details
      polishDetails: [
        {
          name: "Quote Styling",
          description: "Beautiful quote formatting",
          css: `
/* Enhanced Quote Styling */
.pullquote {
  position: relative;
  padding: 2rem 3rem !important;
  font-size: clamp(2rem, 3vw, 2.8rem) !important;
  color: var(--bloom-sage) !important;
  font-weight: 500 !important;
}

.pullquote::before {
  font-size: 6rem !important;
  opacity: 0.15 !important;
}`,
          priority: "medium"
        },
        {
          name: "Stat Card Enhancement",
          description: "More impactful statistics",
          css: `
/* Enhanced Stat Cards */
.stat-card .display-serif,
div[class*="stat"] .display-serif {
  font-size: 4.5rem !important;
  font-weight: 700 !important;
  color: var(--bloom-coral) !important;
}

.stat-overlay {
  background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.3)) !important;
}`,
          priority: "medium"
        }
      ]
    };
  }

  async optimizeForVideo(presentationPath, options = {}) {
    console.log(`\n🎬 Video Presentation Optimizer`);
    console.log(`📍 Target: ${presentationPath}`);
    console.log(`🎯 Mode: ${options.mode || 'balanced'}\n`);

    // Read presentation
    let html = await fs.readFile(presentationPath, 'utf-8');

    // Create backup
    const backupPath = presentationPath.replace('.html', `-video-backup-${Date.now()}.html`);
    await fs.copyFile(presentationPath, backupPath);
    console.log(`💾 Backup created: ${backupPath}`);

    // Apply improvements based on mode
    const selectedImprovements = this.selectImprovements(options.mode);
    const cssAdditions = [];

    for (const improvement of selectedImprovements) {
      console.log(`✅ Applying: ${improvement.name}`);
      cssAdditions.push(improvement.css);
    }

    // Apply CSS
    if (cssAdditions.length > 0) {
      const cssBlock = `
        
        /* ===== VIDEO PRESENTATION OPTIMIZATIONS ===== */
        /* Applied: ${new Date().toISOString()} */
        /* Mode: ${options.mode || 'balanced'} */
        ${cssAdditions.join('\n')}
      `;
      html = html.replace('</style>', cssBlock + '\n    </style>');
    }

    // Additional fixes
    html = this.applyAdditionalFixes(html, options);

    // Write updated file
    await fs.writeFile(presentationPath, html);

    console.log(`\n✨ Video optimizations complete!`);
    console.log(`📁 Updated: ${presentationPath}`);

    return {
      appliedCount: selectedImprovements.length,
      backupPath
    };
  }

  selectImprovements(mode) {
    const selected = [];

    switch (mode) {
      case 'minimal':
        // Just the essentials
        selected.push(...this.improvements.visualPolish.filter(i => i.priority === 'critical'));
        selected.push(...this.improvements.videoOptimizations.filter(i => i.priority === 'critical'));
        break;

      case 'balanced':
      default:
        // Recommended set
        selected.push(...this.improvements.visualPolish);
        selected.push(...this.improvements.spacingRefinements.filter(i => i.priority !== 'low'));
        selected.push(...this.improvements.consistency.filter(i => i.priority === 'high'));
        selected.push(...this.improvements.videoOptimizations.filter(i => i.priority === 'critical'));
        selected.push(...this.improvements.polishDetails.filter(i => i.priority === 'medium'));
        break;

      case 'maximum':
        // Everything
        Object.values(this.improvements).forEach(category => {
          selected.push(...category);
        });
        break;
    }

    return selected;
  }

  applyAdditionalFixes(html, options) {
    // Fix any specific issues for video

    // 1. Ensure all images have loading="eager" for video
    html = html.replace(/loading="lazy"/g, 'loading="eager"');

    // 2. Remove progress indicator for video
    if (options.removeProgress !== false) {
      html = html.replace(/<div class="progress-indicator">[\s\S]*?<\/div>/g, '');
    }

    // 3. Remove skip navigation
    html = html.replace(/<a[^>]*class="skip-nav"[^>]*>[\s\S]*?<\/a>/g, '');

    // 4. Ensure fragments are visible
    html = html.replace(/class="fragment/g, 'class="fragment visible');

    return html;
  }

  async analyzeForVideo(presentationPath) {
    console.log(`\n🔍 Analyzing presentation for video recording...`);

    const html = await fs.readFile(presentationPath, 'utf-8');
    const issues = [];

    // Check for video-specific issues
    if (html.includes('animation:')) {
      issues.push({
        type: 'ANIMATION',
        severity: 'high',
        description: 'Animations present - may cause recording issues'
      });
    }

    if (html.includes('font-size: 0.9') || html.includes('font-size: 1rem')) {
      issues.push({
        type: 'SMALL_TEXT',
        severity: 'high',
        description: 'Text may be too small for video'
      });
    }

    if (!html.includes('-webkit-font-smoothing')) {
      issues.push({
        type: 'FONT_RENDERING',
        severity: 'medium',
        description: 'Font smoothing not optimized for video'
      });
    }

    return issues;
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
🎬 Video Presentation Optimizer

Optimizes presentations specifically for video recording.
Focuses on visual polish, readability, and static content.

Usage:
  npm run optimize-video "week1 lesson1" [options]

Options:
  --mode=minimal    Essential fixes only
  --mode=balanced   Recommended improvements (default)
  --mode=maximum    All visual enhancements
  --analyze         Analyze without applying changes

Examples:
  npm run optimize-video "week1 lesson1"
  npm run optimize-video "week1 lesson1" --mode=maximum
  npm run optimize-video "week1 lesson1" --analyze
    `);
    process.exit(0);
  }

  const optimizer = new VideoPresentationOptimizer();

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

    const options = {
      mode: args.find(a => a.startsWith('--mode='))?.split('=')[1] || 'balanced',
      analyze: args.includes('--analyze')
    };

    if (options.analyze) {
      const issues = await optimizer.analyzeForVideo(presentationPath);
      console.log(`\n📊 Video Readiness Analysis:`);
      issues.forEach(issue => {
        console.log(`   ${issue.severity.toUpperCase()}: ${issue.description}`);
      });
    } else {
      await optimizer.optimizeForVideo(presentationPath, options);
    }

  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = VideoPresentationOptimizer;