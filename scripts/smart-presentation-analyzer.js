#!/usr/bin/env node

/**
 * SMART PRESENTATION ANALYZER
 * Catches REAL visual issues, not theoretical bullshit
 */

const { PresentationAnalyzer } = require('./analyze-presentations');
const fs = require('fs').promises;
const path = require('path');

class SmartPresentationAnalyzer {
  constructor() {
    this.analyzer = new PresentationAnalyzer();
    this.realIssues = {
      DARK_ON_DARK: {
        severity: 'CRITICAL',
        patterns: [
          /color:\s*#[0-3][0-9a-fA-F]{5}.*?background.*?rgba\(0,\s*0,\s*0/,
          /data-background-color="#1a1a1a".*?color:\s*#[0-9a-fA-F]{6}(?!.*?white)/
        ]
      },
      OVERFLOW_CONTENT: {
        severity: 'CRITICAL',
        patterns: [
          /grid-template-rows:\s*repeat\(\d+,\s*\d+px\)/,
          /height:\s*[4-9]\d{2}px/
        ]
      },
      UNREADABLE_OVERLAYS: {
        severity: 'HIGH',
        patterns: [
          /rgba\(255,\s*255,\s*255,\s*0\.[0-6]/,
          /rgba\(0,\s*0,\s*0,\s*0\.[0-5]/
        ]
      },
      TINY_TEXT: {
        severity: 'HIGH',
        patterns: [
          /font-size:\s*0\.\d+rem/,
          /font-size:\s*1\.[0-2]rem/
        ]
      }
    };
  }

  async analyze(presentationPath) {
    console.log(`\n🔍 SMART PRESENTATION ANALYSIS`);
    console.log(`📍 Target: ${presentationPath}`);
    console.log(`🎯 Focus: Real Visual Issues\n`);

    await this.analyzer.init();

    try {
      // Capture screenshots like before
      const screenshots = await this.analyzer.captureSlides(presentationPath);
      const html = await fs.readFile(presentationPath, 'utf-8');
      
      console.log(`📸 Analyzing ${screenshots.length} slides...\n`);

      const issues = {
        critical: [],
        high: [],
        medium: [],
        visual: []
      };

      // Extract slide HTML
      const slides = html.split(/<section[^>]*>/);
      
      for (let i = 1; i < slides.length && i <= screenshots.length; i++) {
        const slideHtml = slides[i];
        const slideNum = i;
        
        console.log(`\nSlide ${slideNum}:`);
        
        // Check for REAL issues
        const slideIssues = this.checkRealIssues(slideHtml, slideNum);
        
        if (slideIssues.length === 0) {
          console.log(`  ✅ No major issues`);
        } else {
          slideIssues.forEach(issue => {
            console.log(`  ❌ ${issue.type}: ${issue.description}`);
            issues[issue.severity.toLowerCase()].push({
              slide: slideNum,
              ...issue
            });
          });
        }
      }

      // Generate practical report
      const report = await this.generateSmartReport(
        presentationPath,
        screenshots,
        issues
      );

      await this.analyzer.cleanup();
      return report;

    } catch (error) {
      await this.analyzer.cleanup();
      throw error;
    }
  }

  checkRealIssues(slideHtml, slideNum) {
    const foundIssues = [];

    // 1. Dark text on dark background
    if (slideHtml.includes('data-background-color="#1a1a1a"') || 
        slideHtml.includes('data-background-color="#000') ||
        slideHtml.includes('background: rgba(0, 0, 0')) {
      
      // Check if text is properly white
      if (!slideHtml.includes('color: white') && 
          !slideHtml.includes('color:#fff') && 
          !slideHtml.includes('color: #fff')) {
        foundIssues.push({
          type: 'DARK_ON_DARK',
          severity: 'CRITICAL',
          description: 'Dark text on dark background - text will be unreadable',
          fix: 'Add style="color: white" to text elements'
        });
      }
    }

    // 2. Content overflow
    const heightMatch = slideHtml.match(/height:\s*(\d+)px/g);
    if (heightMatch) {
      heightMatch.forEach(match => {
        const height = parseInt(match.match(/\d+/)[0]);
        if (height > 600) {
          foundIssues.push({
            type: 'OVERFLOW_CONTENT',
            severity: 'CRITICAL',
            description: `Element with ${height}px height may overflow screen`,
            fix: 'Use max-height: calc(100vh - 150px) instead'
          });
        }
      });
    }

    // 3. Fixed grid heights
    if (slideHtml.match(/grid-template-rows:\s*repeat\(\d+,\s*\d+px\)/)) {
      foundIssues.push({
        type: 'FIXED_GRID',
        severity: 'HIGH',
        description: 'Fixed grid heights will cause overflow',
        fix: 'Use minmax() or fr units for responsive grids'
      });
    }

    // 4. Poor overlay contrast
    const overlayMatch = slideHtml.match(/rgba\([^)]+\)/g);
    if (overlayMatch) {
      overlayMatch.forEach(match => {
        const opacity = parseFloat(match.match(/[\d.]+(?=\))/)?.[0] || 1);
        if (opacity < 0.7 && match.includes('0, 0, 0')) {
          foundIssues.push({
            type: 'WEAK_OVERLAY',
            severity: 'HIGH',
            description: `Overlay too transparent (${opacity}) - text may be unreadable`,
            fix: 'Use minimum 0.8 opacity for text overlays'
          });
        }
      });
    }

    // 5. Tiny text
    const textSizes = slideHtml.match(/font-size:\s*[\d.]+rem/g);
    if (textSizes) {
      textSizes.forEach(size => {
        const remValue = parseFloat(size.match(/[\d.]+/)[0]);
        if (remValue < 1.5) {
          foundIssues.push({
            type: 'TINY_TEXT',
            severity: 'HIGH',
            description: `Text too small: ${size}`,
            fix: 'Minimum 1.5rem for video recording'
          });
        }
      });
    }

    // 6. Missing contrast on hero images
    if (slideHtml.includes('data-background-image') && 
        !slideHtml.includes('hero-scrim') && 
        !slideHtml.includes('text-protection')) {
      foundIssues.push({
        type: 'NO_SCRIM',
        severity: 'HIGH',
        description: 'Background image without text protection',
        fix: 'Add scrim or text-protection overlay'
      });
    }

    return foundIssues;
  }

  async generateSmartReport(presentationPath, screenshots, issues) {
    const timestamp = new Date().toISOString();
    const totalIssues = issues.critical.length + issues.high.length + issues.medium.length;
    
    // Calculate a REAL score based on actual problems
    let score = 100;
    score -= issues.critical.length * 15;  // Critical issues are BAD
    score -= issues.high.length * 5;       // High issues matter
    score -= issues.medium.length * 2;     // Medium issues are minor
    score = Math.max(0, score);

    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Smart Presentation Analysis - ${timestamp}</title>
    <style>
        body {
            font-family: -apple-system, 'Inter', sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            background: #f5f5f5;
        }
        
        .header {
            background: white;
            padding: 3rem;
            border-radius: 16px;
            margin-bottom: 2rem;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        
        .score {
            font-size: 4rem;
            font-weight: 800;
            margin: 1rem 0;
        }
        
        .score-good { color: #22c55e; }
        .score-warning { color: #f59e0b; }
        .score-bad { color: #ef4444; }
        
        .issue-card {
            background: white;
            padding: 2rem;
            margin: 1rem 0;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            border-left: 4px solid #ddd;
        }
        
        .issue-critical {
            border-left-color: #ef4444;
            background: #fef2f2;
        }
        
        .issue-high {
            border-left-color: #f59e0b;
            background: #fffbeb;
        }
        
        .issue-medium {
            border-left-color: #3b82f6;
            background: #eff6ff;
        }
        
        .fix-box {
            background: #f3f4f6;
            padding: 1rem;
            margin-top: 0.5rem;
            border-radius: 8px;
            font-family: monospace;
        }
        
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
            margin: 2rem 0;
        }
        
        .metric-card {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .metric-number {
            font-size: 2.5rem;
            font-weight: 700;
            margin: 0;
        }
        
        .metric-label {
            color: #666;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎯 Smart Presentation Analysis</h1>
        <p><strong>File:</strong> ${presentationPath}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        <div class="score ${score >= 80 ? 'score-good' : score >= 60 ? 'score-warning' : 'score-bad'}">
            ${score}%
        </div>
        <p>Based on REAL visual issues, not theoretical metrics</p>
    </div>
    
    <div class="summary-grid">
        <div class="metric-card">
            <p class="metric-number" style="color: #ef4444;">${issues.critical.length}</p>
            <p class="metric-label">Critical Issues</p>
        </div>
        <div class="metric-card">
            <p class="metric-number" style="color: #f59e0b;">${issues.high.length}</p>
            <p class="metric-label">High Priority</p>
        </div>
        <div class="metric-card">
            <p class="metric-number" style="color: #3b82f6;">${issues.medium.length}</p>
            <p class="metric-label">Medium Priority</p>
        </div>
    </div>
    
    ${issues.critical.length > 0 ? `
    <h2>🚨 Critical Issues (Fix Immediately)</h2>
    ${issues.critical.map(issue => `
        <div class="issue-card issue-critical">
            <h3>Slide ${issue.slide}: ${issue.type}</h3>
            <p>${issue.description}</p>
            <div class="fix-box">Fix: ${issue.fix}</div>
        </div>
    `).join('')}
    ` : ''}
    
    ${issues.high.length > 0 ? `
    <h2>⚠️ High Priority Issues</h2>
    ${issues.high.map(issue => `
        <div class="issue-card issue-high">
            <h3>Slide ${issue.slide}: ${issue.type}</h3>
            <p>${issue.description}</p>
            <div class="fix-box">Fix: ${issue.fix}</div>
        </div>
    `).join('')}
    ` : ''}
    
    ${issues.medium.length > 0 ? `
    <h2>📋 Medium Priority Issues</h2>
    ${issues.medium.map(issue => `
        <div class="issue-card issue-medium">
            <h3>Slide ${issue.slide}: ${issue.type}</h3>
            <p>${issue.description}</p>
            <div class="fix-box">Fix: ${issue.fix}</div>
        </div>
    `).join('')}
    ` : ''}
    
    ${totalIssues === 0 ? `
    <div class="issue-card" style="border-left-color: #22c55e; background: #f0fdf4;">
        <h2>✅ No Major Visual Issues Found!</h2>
        <p>The presentation appears to be visually sound for video recording.</p>
    </div>
    ` : ''}
    
    <h2>🎬 Quick Fix Script</h2>
    <div class="fix-box">
        <p>Run this to auto-fix critical issues:</p>
        <code>npm run fix-visual "week1 lesson1"</code>
    </div>
</body>
</html>`;

    // Save report
    const reportDir = path.join(process.cwd(), 'analysis', 'smart-analysis');
    await fs.mkdir(reportDir, { recursive: true });
    const reportPath = path.join(reportDir, `analysis-${Date.now()}.html`);
    await fs.writeFile(reportPath, html);
    
    console.log(`\n📊 ANALYSIS COMPLETE`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Score: ${score}%`);
    console.log(`Critical Issues: ${issues.critical.length}`);
    console.log(`High Priority: ${issues.high.length}`);
    console.log(`Medium Priority: ${issues.medium.length}`);
    console.log(`\n📄 Report saved: ${reportPath}`);

    return {
      score,
      issues,
      reportPath
    };
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🎯 Smart Presentation Analyzer

Catches REAL visual issues:
- Dark text on dark backgrounds
- Content that overflows screen
- Unreadable text overlays
- Fixed heights that break layouts
- Missing text protection on images

Usage:
  npm run smart-analyze "week1 lesson1"
    `);
    process.exit(0);
  }

  const analyzer = new SmartPresentationAnalyzer();
  
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
    
    await analyzer.analyze(presentationPath);
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = SmartPresentationAnalyzer;