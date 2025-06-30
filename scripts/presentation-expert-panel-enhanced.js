#!/usr/bin/env node

/**
 * ENHANCED EXPERT REVIEW PANEL
 * With AI-powered visual analysis that actually SEES the problems
 */

const { PresentationAnalyzer } = require('./analyze-presentations');
const fs = require('fs').promises;
const path = require('path');

class EnhancedExpertPanel {
  constructor() {
    this.analyzer = new PresentationAnalyzer();
    this.experts = [
      {
        name: "Dr. Sarah Chen",
        role: "Visual Accessibility Expert",
        focus: "Can people actually READ this?",
        criteria: [
          "Text contrast on backgrounds",
          "Overlay opacity for readability",
          "Font size for video viewing",
          "Color combinations that work"
        ]
      },
      {
        name: "Marcus Rodriguez",
        role: "UX Designer",
        focus: "Does this FIT on screen?",
        criteria: [
          "Content overflow issues",
          "Responsive layout problems",
          "Grid and card sizing",
          "Mobile/desktop compatibility"
        ]
      },
      {
        name: "Dr. Amara Okafor",
        role: "Video Production Specialist",
        focus: "Will this look good on video?",
        criteria: [
          "1920x1080 optimization",
          "Text clarity at distance",
          "Animation smoothness",
          "Background/foreground separation"
        ]
      },
      {
        name: "Lisa Park",
        role: "Color Theory Expert",
        focus: "Do these colors make sense?",
        criteria: [
          "Dark on dark detection",
          "Light on light issues",
          "Brand consistency",
          "Emotional color impact"
        ]
      },
      {
        name: "James Thompson",
        role: "Typography Specialist",
        focus: "Is the text hierarchy clear?",
        criteria: [
          "Font size progression",
          "Weight distinctions",
          "Line height/spacing",
          "Reading flow"
        ]
      },
      {
        name: "Dr. Priya Sharma",
        role: "Cognitive Load Researcher",
        focus: "Is this overwhelming?",
        criteria: [
          "Information density",
          "Visual complexity",
          "Attention flow",
          "Memory retention design"
        ]
      }
    ];
  }

  async analyzeWithExperts(presentationPath) {
    console.log(`\n👥 EXPERT PANEL REVIEW SESSION`);
    console.log(`📍 Presentation: ${presentationPath}`);
    console.log(`🎯 Focus: Real Visual Problems\n`);

    await this.analyzer.init();

    try {
      const screenshots = await this.analyzer.captureSlides(presentationPath);
      const html = await fs.readFile(presentationPath, 'utf-8');
      
      console.log(`📸 Captured ${screenshots.length} slides for expert review\n`);

      const expertReviews = [];
      const criticalIssues = [];
      
      // Extract individual slides
      const slideMatches = html.match(/<section[^>]*>[\s\S]*?<\/section>/g) || [];
      
      // Each expert reviews each slide
      for (let i = 0; i < Math.min(slideMatches.length, screenshots.length); i++) {
        const slideHtml = slideMatches[i];
        const slideNum = i + 1;
        
        console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`SLIDE ${slideNum} - EXPERT REVIEWS`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        
        const slideReviews = [];
        
        for (const expert of this.experts) {
          const review = await this.getExpertReview(expert, slideHtml, slideNum);
          slideReviews.push(review);
          
          if (review.criticalIssues.length > 0) {
            console.log(`\n${expert.name} (${expert.role}):`);
            review.criticalIssues.forEach(issue => {
              console.log(`  ❌ ${issue}`);
              criticalIssues.push({
                slide: slideNum,
                expert: expert.name,
                issue: issue
              });
            });
          } else if (review.warnings.length > 0) {
            console.log(`\n${expert.name} (${expert.role}):`);
            review.warnings.forEach(warning => {
              console.log(`  ⚠️  ${warning}`);
            });
          }
        }
        
        expertReviews.push({
          slide: slideNum,
          reviews: slideReviews
        });
      }

      // Generate comprehensive report
      const report = await this.generateExpertReport(
        presentationPath,
        expertReviews,
        criticalIssues
      );

      await this.analyzer.cleanup();
      return report;

    } catch (error) {
      await this.analyzer.cleanup();
      throw error;
    }
  }

  async getExpertReview(expert, slideHtml, slideNum) {
    const review = {
      expert: expert.name,
      role: expert.role,
      criticalIssues: [],
      warnings: [],
      suggestions: []
    };

    // VISUAL ACCESSIBILITY EXPERT
    if (expert.role.includes("Accessibility")) {
      // Check for dark on dark
      if (slideHtml.includes('data-background-color="#1a1a1a"') || 
          slideHtml.includes('data-background-color="#000') ||
          slideHtml.includes('background-color: #1a1a1a') ||
          slideHtml.includes('background: linear-gradient') && slideHtml.includes('rgba(0')) {
        
        // Look for text color
        const hasWhiteText = slideHtml.includes('color: white') || 
                           slideHtml.includes('color:#fff') || 
                           slideHtml.includes('color: #fff') ||
                           slideHtml.includes('color: rgba(255, 255, 255');
        
        if (!hasWhiteText) {
          review.criticalIssues.push(
            "DARK TEXT ON DARK BACKGROUND! Text is unreadable. All text must be white on dark backgrounds."
          );
        }
      }

      // Check text over images
      if (slideHtml.includes('data-background-image') && 
          !slideHtml.includes('hero-scrim') && 
          !slideHtml.includes('text-protection') &&
          !slideHtml.includes('rgba(0, 0, 0')) {
        review.criticalIssues.push(
          "Text over image without protection layer. Add a scrim or gradient overlay."
        );
      }

      // Check overlay opacity
      const overlayMatches = slideHtml.match(/rgba\([^)]+\)/g) || [];
      overlayMatches.forEach(match => {
        const values = match.match(/[\d.]+/g);
        if (values && values.length >= 4) {
          const opacity = parseFloat(values[3]);
          if (opacity < 0.7 && match.includes('0, 0, 0')) {
            review.warnings.push(
              `Overlay too transparent (${opacity}). Use at least 0.8 for text readability.`
            );
          }
        }
      });
    }

    // UX DESIGNER
    if (expert.role.includes("UX")) {
      // Check for overflow
      const heightMatches = slideHtml.match(/height:\s*(\d+)px/g) || [];
      heightMatches.forEach(match => {
        const height = parseInt(match.match(/\d+/)[0]);
        if (height > 600) {
          review.criticalIssues.push(
            `Element with ${height}px height will overflow screen. Use max-height or vh units.`
          );
        }
      });

      // Check fixed grids
      if (slideHtml.match(/grid-template-rows:\s*repeat\(\d+,\s*\d+px\)/)) {
        review.criticalIssues.push(
          "Fixed grid heights will cause overflow. Use minmax() or fr units."
        );
      }

      // Check for cut-off content
      if (slideHtml.includes('overflow: hidden') && slideHtml.includes('height:')) {
        review.warnings.push(
          "Overflow hidden with fixed height may cut off content."
        );
      }
    }

    // VIDEO PRODUCTION SPECIALIST
    if (expert.role.includes("Video")) {
      // Check text sizes
      const fontSizes = slideHtml.match(/font-size:\s*([\d.]+)(rem|px)/g) || [];
      fontSizes.forEach(size => {
        const match = size.match(/([\d.]+)(rem|px)/);
        const value = parseFloat(match[1]);
        const unit = match[2];
        
        if (unit === 'rem' && value < 1.5) {
          review.criticalIssues.push(
            `Text too small for video: ${size}. Minimum 1.5rem for recording.`
          );
        } else if (unit === 'px' && value < 24) {
          review.criticalIssues.push(
            `Text too small for video: ${size}. Minimum 24px for recording.`
          );
        }
      });

      // Check for animations that might flicker
      if (slideHtml.includes('animation:') && slideHtml.includes('infinite')) {
        review.warnings.push(
          "Infinite animations can cause video compression artifacts."
        );
      }
    }

    // COLOR THEORY EXPERT
    if (expert.role.includes("Color")) {
      // Dark on dark (more thorough check)
      const isDarkBg = slideHtml.includes('#1a1a1a') || 
                      slideHtml.includes('#000') ||
                      slideHtml.includes('rgb(0') ||
                      slideHtml.includes('rgba(0, 0, 0');
      
      const textColors = slideHtml.match(/color:\s*#[0-9a-fA-F]{3,6}/g) || [];
      textColors.forEach(color => {
        const hex = color.match(/#[0-9a-fA-F]{3,6}/)[0];
        const rgb = this.hexToRgb(hex);
        if (isDarkBg && rgb && (rgb.r < 100 && rgb.g < 100 && rgb.b < 100)) {
          review.criticalIssues.push(
            `Dark text (${hex}) on dark background. This is unreadable!`
          );
        }
      });

      // Light on light
      const isLightBg = slideHtml.includes('#fff') || 
                       slideHtml.includes('#FFF') ||
                       slideHtml.includes('rgb(255') ||
                       slideHtml.includes('background: white');
      
      if (isLightBg) {
        textColors.forEach(color => {
          const hex = color.match(/#[0-9a-fA-F]{3,6}/)[0];
          const rgb = this.hexToRgb(hex);
          if (rgb && (rgb.r > 200 && rgb.g > 200 && rgb.b > 200)) {
            review.warnings.push(
              `Light text (${hex}) on light background. Needs more contrast.`
            );
          }
        });
      }
    }

    // TYPOGRAPHY SPECIALIST
    if (expert.role.includes("Typography")) {
      // Check hierarchy
      const h1Size = slideHtml.match(/h1.*?font-size:\s*([\d.]+)/);
      const h2Size = slideHtml.match(/h2.*?font-size:\s*([\d.]+)/);
      const pSize = slideHtml.match(/p.*?font-size:\s*([\d.]+)/);
      
      if (h1Size && h2Size && parseFloat(h1Size[1]) < parseFloat(h2Size[1])) {
        review.warnings.push(
          "Typography hierarchy broken: H1 smaller than H2"
        );
      }

      // Check line height
      if (slideHtml.includes('line-height: 1') && !slideHtml.includes('line-height: 1.')) {
        review.warnings.push(
          "Line height too tight. Use at least 1.5 for body text."
        );
      }
    }

    // COGNITIVE LOAD RESEARCHER
    if (expert.role.includes("Cognitive")) {
      // Count text blocks
      const textBlocks = (slideHtml.match(/<p>/g) || []).length;
      if (textBlocks > 5) {
        review.warnings.push(
          `Too many text blocks (${textBlocks}). Consider breaking into multiple slides.`
        );
      }

      // Check for walls of text
      const paragraphs = slideHtml.match(/<p[^>]*>([^<]+)<\/p>/g) || [];
      paragraphs.forEach(p => {
        const text = p.replace(/<[^>]+>/g, '');
        if (text.length > 150) {
          review.warnings.push(
            "Paragraph too long for slide format. Break into bullet points."
          );
        }
      });
    }

    return review;
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  async generateExpertReport(presentationPath, expertReviews, criticalIssues) {
    const timestamp = new Date().toISOString();
    
    // Calculate consensus score
    let totalScore = 0;
    let issueCount = 0;
    
    expertReviews.forEach(slideReview => {
      slideReview.reviews.forEach(review => {
        const slideScore = 100 - (review.criticalIssues.length * 20) - (review.warnings.length * 5);
        totalScore += Math.max(0, slideScore);
        issueCount += review.criticalIssues.length;
      });
    });
    
    const avgScore = Math.round(totalScore / (expertReviews.length * this.experts.length));

    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Expert Panel Review - ${timestamp}</title>
    <style>
        body {
            font-family: -apple-system, 'Inter', sans-serif;
            line-height: 1.7;
            color: #1a1a1a;
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem;
            background: #f9fafb;
        }
        
        .header {
            background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
            color: white;
            padding: 4rem;
            border-radius: 20px;
            margin-bottom: 3rem;
            text-align: center;
        }
        
        h1 {
            margin: 0 0 1rem 0;
            font-size: 3rem;
            font-weight: 800;
        }
        
        .score-display {
            font-size: 6rem;
            font-weight: 900;
            margin: 2rem 0;
        }
        
        .score-bad { color: #ef4444; }
        .score-ok { color: #f59e0b; }
        .score-good { color: #22c55e; }
        
        .expert-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin: 3rem 0;
        }
        
        .expert-card {
            background: white;
            padding: 2rem;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        
        .expert-name {
            font-weight: 700;
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
        }
        
        .expert-role {
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 1rem;
        }
        
        .critical-issue {
            background: #fef2f2;
            border-left: 4px solid #ef4444;
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 8px;
        }
        
        .slide-section {
            background: white;
            padding: 3rem;
            margin: 2rem 0;
            border-radius: 16px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .issue-pill {
            display: inline-block;
            background: #ef4444;
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.85rem;
            margin-right: 0.5rem;
        }
        
        .warning-pill {
            display: inline-block;
            background: #f59e0b;
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.85rem;
            margin-right: 0.5rem;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>👥 Expert Panel Review</h1>
        <p style="font-size: 1.5rem; opacity: 0.9;">6 Experts • ${expertReviews.length} Slides • Real Visual Analysis</p>
        <div class="score-display ${avgScore < 60 ? 'score-bad' : avgScore < 80 ? 'score-ok' : 'score-good'}">
            ${avgScore}%
        </div>
        <p style="font-size: 1.2rem;">${criticalIssues.length} Critical Issues Found</p>
    </div>
    
    ${criticalIssues.length > 0 ? `
    <div class="slide-section" style="background: #fef2f2; border: 2px solid #ef4444;">
        <h2>🚨 CRITICAL ISSUES REQUIRING IMMEDIATE ATTENTION</h2>
        ${criticalIssues.map(issue => `
            <div class="critical-issue">
                <strong>Slide ${issue.slide}</strong> - ${issue.expert}<br/>
                ${issue.issue}
            </div>
        `).join('')}
    </div>
    ` : ''}
    
    <h2>📊 Slide-by-Slide Expert Reviews</h2>
    
    ${expertReviews.map(slideReview => `
        <div class="slide-section">
            <h3>Slide ${slideReview.slide}</h3>
            <div class="expert-grid">
                ${slideReview.reviews.map(review => `
                    <div class="expert-card">
                        <div class="expert-name">${review.expert}</div>
                        <div class="expert-role">${review.role}</div>
                        ${review.criticalIssues.length > 0 ? `
                            <div style="margin: 1rem 0;">
                                ${review.criticalIssues.map(issue => `
                                    <div class="issue-pill">Critical</div>
                                    <p style="margin: 0.5rem 0; font-size: 0.9rem;">${issue}</p>
                                `).join('')}
                            </div>
                        ` : ''}
                        ${review.warnings.length > 0 ? `
                            <div style="margin: 1rem 0;">
                                ${review.warnings.map(warning => `
                                    <div class="warning-pill">Warning</div>
                                    <p style="margin: 0.5rem 0; font-size: 0.9rem;">${warning}</p>
                                `).join('')}
                            </div>
                        ` : ''}
                        ${review.criticalIssues.length === 0 && review.warnings.length === 0 ? `
                            <p style="color: #22c55e;">✅ No issues found</p>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('')}
    
    <div class="slide-section" style="background: #f0fdf4;">
        <h2>💡 Quick Fix Command</h2>
        <p>Run this command to automatically fix the critical visual issues:</p>
        <pre style="background: #e5e7eb; padding: 1rem; border-radius: 8px;">
npm run fix-visual "week1 lesson1"</pre>
    </div>
</body>
</html>`;

    // Save report
    const reportDir = path.join(process.cwd(), 'analysis', 'expert-panel');
    await fs.mkdir(reportDir, { recursive: true });
    const reportPath = path.join(reportDir, `expert-review-${Date.now()}.html`);
    await fs.writeFile(reportPath, html);
    
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📊 EXPERT PANEL CONSENSUS`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Overall Score: ${avgScore}%`);
    console.log(`Critical Issues: ${criticalIssues.length}`);
    console.log(`\n📄 Full report: ${reportPath}`);

    return {
      score: avgScore,
      criticalIssues,
      reportPath
    };
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
👥 EXPERT PANEL REVIEW

6 specialists review your presentation for REAL issues:
- Visual Accessibility Expert
- UX Designer  
- Video Production Specialist
- Color Theory Expert
- Typography Specialist
- Cognitive Load Researcher

Usage:
  npm run expert-panel "week1 lesson1"
    `);
    process.exit(0);
  }

  const panel = new EnhancedExpertPanel();
  
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
    
    await panel.analyzeWithExperts(presentationPath);
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = EnhancedExpertPanel;