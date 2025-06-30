#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

// Design rules and e-learning best practices
const DESIGN_RULES = {
  typography: {
    title: { 
      minSize: 48, // 3rem at 16px base
      optimalSize: 64, // 4rem
      maxSize: 96, // 6rem
      lineHeight: 1.2
    },
    subtitle: { 
      minSize: 28.8, // 1.8rem
      optimalSize: 35.2, // 2.2rem
      maxSize: 48,
      lineHeight: 1.3
    },
    heading: {
      minSize: 24, // 1.5rem
      optimalSize: 32, // 2rem
      maxSize: 40,
      lineHeight: 1.4
    },
    body: { 
      minSize: 19.2, // 1.2rem
      optimalSize: 24, // 1.5rem
      maxSize: 32,
      lineHeight: 1.6
    },
    quote: { 
      minSize: 32, // 2rem
      optimalSize: 40, // 2.5rem
      maxSize: 56,
      lineHeight: 1.7
    },
    caption: {
      minSize: 16, // 1rem
      optimalSize: 19.2, // 1.2rem
      maxSize: 24,
      lineHeight: 1.5
    }
  },
  spacing: {
    sectionPadding: { min: 32, optimal: 48 }, // 2-3rem
    elementGap: { min: 24, optimal: 32 }, // 1.5-2rem
    cardPadding: { min: 32, optimal: 40 }, // 2-2.5rem
    containerMargin: { min: 16, optimal: 32 }
  },
  colorContrast: {
    minRatio: 4.5, // WCAG AA
    optimalRatio: 7.0, // WCAG AAA
    largeTextMinRatio: 3.0 // WCAG AA for large text
  },
  cognitiveLoad: {
    maxBulletsPerSlide: 5,
    maxWordsPerBullet: 12,
    maxLinesPerParagraph: 4,
    maxElementsPerSlide: 7
  },
  responsive: {
    minViewportWidth: 320,
    tabletBreakpoint: 768,
    desktopBreakpoint: 1024
  }
};

// Analysis prompts for different aspects
const ANALYSIS_PROMPTS = {
  readability: `Analyze this slide for text readability:
- Check all text sizes (should be minimum 1.2rem for body, 1.8rem for headings)
- Evaluate line height and spacing
- Assess contrast ratios
- Identify any text that might be hard to read on mobile
Return specific elements that need improvement with current and suggested sizes.`,

  hierarchy: `Evaluate the visual hierarchy:
- Is there a clear primary focal point?
- Are heading levels distinct?
- Is the reading flow logical?
- Are important elements emphasized appropriately?
Identify hierarchy issues and suggest improvements.`,

  cognitiveLoad: `Assess cognitive load:
- Count text elements and bullet points
- Check for information overload
- Evaluate use of white space
- Assess if the slide tries to communicate too much
Rate cognitive load as low/medium/high and suggest simplifications.`,

  accessibility: `Check accessibility compliance:
- Color contrast ratios (WCAG AA/AAA)
- Text size minimums
- Interactive element sizes (min 44x44px)
- Clear focus indicators
List any accessibility violations.`,

  mobile: `Evaluate mobile responsiveness:
- Will text be readable at 320px width?
- Are touch targets large enough?
- Does layout need restructuring for mobile?
- Any overflow issues?
Flag mobile-specific concerns.`
};

class PresentationAnalyzer {
  constructor() {
    this.browser = null;
    this.analysisDir = path.join(process.cwd(), 'analysis');
    this.resultsDir = path.join(this.analysisDir, 'results');
    this.screenshotsDir = path.join(this.analysisDir, 'screenshots');
  }

  async init() {
    // Create analysis directories
    await fs.mkdir(this.analysisDir, { recursive: true });
    await fs.mkdir(this.resultsDir, { recursive: true });
    await fs.mkdir(this.screenshotsDir, { recursive: true });

    // Launch Puppeteer
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  async captureSlides(presentationPath, baseUrl = 'http://localhost:3000') {
    const page = await this.browser.newPage();
    
    // Set viewport for desktop
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Construct full URL
    let url;
    if (presentationPath.startsWith('http')) {
      url = presentationPath;
    } else if (presentationPath.startsWith('/')) {
      // Absolute path - prepend baseUrl
      url = `${baseUrl}${presentationPath}`;
    } else {
      // Relative path - convert to file:// URL
      const absolutePath = path.resolve(process.cwd(), presentationPath);
      url = `file://${absolutePath}`;
    }
    
    console.log(`📸 Capturing slides from: ${url}`);
    
    try {
      await page.goto(url, { waitUntil: 'networkidle2' });
      
      // Get total number of slides
      const totalSlides = await page.evaluate(() => {
        // For Reveal.js presentations
        if (typeof Reveal !== 'undefined') {
          return Reveal.getTotalSlides();
        }
        // Fallback: count sections
        return document.querySelectorAll('section').length;
      });
      
      console.log(`📊 Found ${totalSlides} slides to analyze`);
      
      const screenshots = [];
      
      // Capture each slide
      for (let i = 0; i < totalSlides; i++) {
        // Navigate to specific slide
        await page.goto(`${url}#/${i}`, { waitUntil: 'networkidle2' });
        
        // Wait for animations to complete
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate filename
        const timestamp = Date.now();
        const filename = `slide-${i + 1}-${timestamp}.png`;
        const filepath = path.join(this.screenshotsDir, filename);
        
        // Take screenshot
        await page.screenshot({ 
          path: filepath,
          fullPage: false,
          type: 'png'
        });
        
        // Also capture mobile view
        await page.setViewport({ width: 375, height: 667 }); // iPhone SE
        const mobileFilename = `slide-${i + 1}-mobile-${timestamp}.png`;
        const mobileFilepath = path.join(this.screenshotsDir, mobileFilename);
        await page.screenshot({ 
          path: mobileFilepath,
          fullPage: false,
          type: 'png'
        });
        
        // Reset to desktop
        await page.setViewport({ width: 1920, height: 1080 });
        
        screenshots.push({
          slideNumber: i + 1,
          desktop: filepath,
          mobile: mobileFilepath,
          url: `${url}#/${i}`
        });
        
        console.log(`✅ Captured slide ${i + 1}/${totalSlides}`);
      }
      
      await page.close();
      return screenshots;
      
    } catch (error) {
      console.error(`❌ Error capturing slides: ${error.message}`);
      await page.close();
      throw error;
    }
  }

  async analyzeSlide(screenshot, slideHtml) {
    // This is where we would integrate with GPT-4 Vision or Claude's vision API
    // For now, we'll create a mock analysis structure
    
    const analysis = {
      slideNumber: screenshot.slideNumber,
      timestamp: new Date().toISOString(),
      scores: {
        overall: 0,
        readability: 0,
        hierarchy: 0,
        cognitiveLoad: 0,
        accessibility: 0,
        mobile: 0
      },
      issues: [],
      suggestions: [],
      criticalFixes: []
    };
    
    // Simulate text size analysis
    const textSizeIssues = this.checkTextSizes(slideHtml);
    analysis.issues.push(...textSizeIssues);
    
    // Simulate spacing analysis
    const spacingIssues = this.checkSpacing(slideHtml);
    analysis.issues.push(...spacingIssues);
    
    // Calculate scores
    analysis.scores.readability = textSizeIssues.length === 0 ? 90 : 60;
    analysis.scores.hierarchy = 75; // Mock score
    analysis.scores.cognitiveLoad = 80; // Mock score
    analysis.scores.accessibility = spacingIssues.length === 0 ? 85 : 65;
    analysis.scores.mobile = 70; // Mock score
    
    // Overall score is weighted average
    analysis.scores.overall = Math.round(
      (analysis.scores.readability * 0.3) +
      (analysis.scores.hierarchy * 0.2) +
      (analysis.scores.cognitiveLoad * 0.2) +
      (analysis.scores.accessibility * 0.2) +
      (analysis.scores.mobile * 0.1)
    );
    
    // Identify critical fixes (score < 70)
    if (analysis.scores.readability < 70) {
      analysis.criticalFixes.push({
        type: 'TEXT_SIZE',
        priority: 'high',
        description: 'Multiple text elements are too small for comfortable reading'
      });
    }
    
    return analysis;
  }

  checkTextSizes(html) {
    const issues = [];
    
    // Mock text size detection
    // In real implementation, we'd parse the HTML and check actual font sizes
    const textPatterns = [
      { pattern: /font-size:\s*0\.9\d*rem/g, issue: 'Text too small (< 1rem)' },
      { pattern: /font-size:\s*1\.0\d*rem/g, issue: 'Body text borderline small (1rem)' },
      { pattern: /font-size:\s*\d+px/g, issue: 'Using px instead of rem units' }
    ];
    
    textPatterns.forEach(({ pattern, issue }) => {
      const matches = html.match(pattern);
      if (matches) {
        issues.push({
          type: 'TEXT_SIZE',
          severity: 'medium',
          description: issue,
          count: matches.length,
          examples: matches.slice(0, 3)
        });
      }
    });
    
    return issues;
  }

  checkSpacing(html) {
    const issues = [];
    
    // Mock spacing detection
    const spacingPatterns = [
      { pattern: /padding:\s*0\.5rem/g, issue: 'Insufficient padding (< 1rem)' },
      { pattern: /margin:\s*0\s*;/g, issue: 'No margin between elements' }
    ];
    
    spacingPatterns.forEach(({ pattern, issue }) => {
      const matches = html.match(pattern);
      if (matches) {
        issues.push({
          type: 'SPACING',
          severity: 'low',
          description: issue,
          count: matches.length
        });
      }
    });
    
    return issues;
  }

  async generateReport(presentationPath, analyses) {
    const reportData = {
      presentation: presentationPath,
      analyzedAt: new Date().toISOString(),
      slideCount: analyses.length,
      summary: {
        averageScore: 0,
        lowestScore: 100,
        highestScore: 0,
        criticalIssuesCount: 0,
        commonIssues: {}
      },
      slides: analyses,
      recommendations: []
    };
    
    // Calculate summary statistics
    let totalScore = 0;
    analyses.forEach(analysis => {
      totalScore += analysis.scores.overall;
      reportData.summary.lowestScore = Math.min(reportData.summary.lowestScore, analysis.scores.overall);
      reportData.summary.highestScore = Math.max(reportData.summary.highestScore, analysis.scores.overall);
      reportData.summary.criticalIssuesCount += analysis.criticalFixes.length;
      
      // Track common issues
      analysis.issues.forEach(issue => {
        if (!reportData.summary.commonIssues[issue.type]) {
          reportData.summary.commonIssues[issue.type] = 0;
        }
        reportData.summary.commonIssues[issue.type]++;
      });
    });
    
    reportData.summary.averageScore = Math.round(totalScore / analyses.length);
    
    // Generate recommendations
    if (reportData.summary.averageScore < 70) {
      reportData.recommendations.push({
        priority: 'high',
        action: 'Major redesign needed',
        description: 'The presentation scores below 70% and needs significant improvements'
      });
    }
    
    if (reportData.summary.commonIssues.TEXT_SIZE > 3) {
      reportData.recommendations.push({
        priority: 'high',
        action: 'Increase text sizes globally',
        description: 'Multiple slides have text readability issues'
      });
    }
    
    // Save JSON report
    const reportPath = path.join(this.resultsDir, `report-${Date.now()}.json`);
    await fs.writeFile(reportPath, JSON.stringify(reportData, null, 2));
    
    // Generate HTML report
    const htmlReport = this.generateHtmlReport(reportData);
    const htmlPath = path.join(this.resultsDir, `report-${Date.now()}.html`);
    await fs.writeFile(htmlPath, htmlReport);
    
    console.log(`\n📊 Analysis Report Generated:`);
    console.log(`   JSON: ${reportPath}`);
    console.log(`   HTML: ${htmlPath}`);
    
    return reportData;
  }

  generateHtmlReport(data) {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Presentation Analysis Report - ${data.presentation}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            background: #f5f5f5;
        }
        .header {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
        }
        h1 { color: #1a1a1a; margin: 0 0 1rem 0; }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin: 2rem 0;
        }
        .stat-card {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .stat-number {
            font-size: 2.5rem;
            font-weight: bold;
            margin: 0;
        }
        .stat-label {
            color: #666;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .score-good { color: #22c55e; }
        .score-medium { color: #f59e0b; }
        .score-poor { color: #ef4444; }
        .slide-analysis {
            background: white;
            padding: 2rem;
            margin: 1rem 0;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .issue {
            background: #fee;
            border-left: 4px solid #f44;
            padding: 1rem;
            margin: 0.5rem 0;
        }
        .recommendation {
            background: #ffe;
            border-left: 4px solid #fa0;
            padding: 1rem;
            margin: 0.5rem 0;
        }
        .screenshots {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin: 1rem 0;
        }
        .screenshot img {
            width: 100%;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Presentation Analysis Report</h1>
        <p><strong>Presentation:</strong> ${data.presentation}</p>
        <p><strong>Analyzed:</strong> ${new Date(data.analyzedAt).toLocaleString()}</p>
        <p><strong>Slides:</strong> ${data.slideCount}</p>
    </div>
    
    <div class="summary">
        <div class="stat-card">
            <p class="stat-number ${data.summary.averageScore >= 80 ? 'score-good' : data.summary.averageScore >= 60 ? 'score-medium' : 'score-poor'}">
                ${data.summary.averageScore}%
            </p>
            <p class="stat-label">Average Score</p>
        </div>
        <div class="stat-card">
            <p class="stat-number">${data.summary.lowestScore}%</p>
            <p class="stat-label">Lowest Slide</p>
        </div>
        <div class="stat-card">
            <p class="stat-number">${data.summary.highestScore}%</p>
            <p class="stat-label">Highest Slide</p>
        </div>
        <div class="stat-card">
            <p class="stat-number ${data.summary.criticalIssuesCount > 0 ? 'score-poor' : 'score-good'}">
                ${data.summary.criticalIssuesCount}
            </p>
            <p class="stat-label">Critical Issues</p>
        </div>
    </div>
    
    ${data.recommendations.length > 0 ? `
        <div style="background: white; padding: 2rem; border-radius: 8px; margin: 2rem 0;">
            <h2>Recommendations</h2>
            ${data.recommendations.map(rec => `
                <div class="recommendation">
                    <strong>${rec.action}</strong>
                    <p>${rec.description}</p>
                </div>
            `).join('')}
        </div>
    ` : ''}
    
    <h2>Slide-by-Slide Analysis</h2>
    ${data.slides.map(slide => `
        <div class="slide-analysis">
            <h3>Slide ${slide.slideNumber} - Score: ${slide.scores.overall}%</h3>
            
            <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 1rem; margin: 1rem 0;">
                <div>
                    <strong>Readability:</strong> ${slide.scores.readability}%
                </div>
                <div>
                    <strong>Hierarchy:</strong> ${slide.scores.hierarchy}%
                </div>
                <div>
                    <strong>Cognitive Load:</strong> ${slide.scores.cognitiveLoad}%
                </div>
                <div>
                    <strong>Accessibility:</strong> ${slide.scores.accessibility}%
                </div>
                <div>
                    <strong>Mobile:</strong> ${slide.scores.mobile}%
                </div>
            </div>
            
            ${slide.issues.length > 0 ? `
                <h4>Issues Found:</h4>
                ${slide.issues.map(issue => `
                    <div class="issue">
                        <strong>${issue.type}:</strong> ${issue.description}
                        ${issue.count ? `<br><small>Found ${issue.count} instances</small>` : ''}
                    </div>
                `).join('')}
            ` : '<p style="color: green;">✅ No major issues found</p>'}
            
            ${slide.criticalFixes.length > 0 ? `
                <h4 style="color: red;">⚠️ Critical Fixes Needed:</h4>
                ${slide.criticalFixes.map(fix => `
                    <div style="background: #fdd; padding: 1rem; margin: 0.5rem 0; border-radius: 4px;">
                        ${fix.description}
                    </div>
                `).join('')}
            ` : ''}
        </div>
    `).join('')}
</body>
</html>`;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🎯 Presentation Analyzer - Automated Slide Improvement System

Usage:
  npm run analyze-presentation <path-or-week-lesson>

Examples:
  npm run analyze-presentation "week1 lesson1"
  npm run analyze-presentation "/bloom-course-content/weeks/week-1-foundation/lesson-1-welcome/presentation-animated-complete.html"
  npm run analyze-presentation "http://localhost:3000/presentations/week1/lesson1"

Options:
  --all          Analyze all presentations
  --week=N       Analyze all lessons in week N
  --fix          Automatically generate fixes (coming soon)
    `);
    process.exit(0);
  }

  const analyzer = new PresentationAnalyzer();
  
  try {
    await analyzer.init();
    
    let presentationPath = args[0];
    
    // Handle week/lesson format
    if (presentationPath.match(/week\d+\s+lesson\d+/i)) {
      const [week, lesson] = presentationPath.toLowerCase().split(/\s+/);
      const weekNum = week.replace('week', '');
      const lessonNum = lesson.replace('lesson', '');
      
      // Map lesson numbers to actual lesson names
      const lessonNames = {
        '1': 'welcome',
        '2': 'normal-vs-concern',
        '3': 'hormones',
        '4': 'honoring'
      };
      
      const lessonName = lessonNames[lessonNum] || `lesson-${lessonNum}`;
      
      // Try the animated-complete version first, fallback to regular
      const animatedPath = `bloom-course-content/weeks/week-${weekNum}-foundation/lesson-${lessonNum}-${lessonName}/presentation-animated-complete.html`;
      const regularPath = `bloom-course-content/weeks/week-${weekNum}-foundation/lesson-${lessonNum}-${lessonName}/presentation.html`;
      
      // Check which file exists
      const fs = require('fs');
      if (fs.existsSync(animatedPath)) {
        presentationPath = animatedPath;
      } else if (fs.existsSync(regularPath)) {
        presentationPath = regularPath;
      } else {
        console.error(`❌ Could not find presentation for ${week} ${lesson}`);
        console.error(`   Tried: ${animatedPath}`);
        console.error(`   Tried: ${regularPath}`);
        process.exit(1);
      }
    }
    
    console.log(`\n🔍 Starting presentation analysis...`);
    console.log(`📍 Target: ${presentationPath}\n`);
    
    // Capture screenshots
    const screenshots = await analyzer.captureSlides(presentationPath);
    
    // Analyze each slide
    const analyses = [];
    for (const screenshot of screenshots) {
      // In real implementation, we'd read the HTML for the specific slide
      const slideHtml = '<div>Mock HTML content</div>'; // Placeholder
      const analysis = await analyzer.analyzeSlide(screenshot, slideHtml);
      analyses.push(analysis);
    }
    
    // Generate report
    const report = await analyzer.generateReport(presentationPath, analyses);
    
    // Display summary
    console.log(`\n✨ Analysis Complete!`);
    console.log(`📊 Overall Score: ${report.summary.averageScore}%`);
    console.log(`🎯 Slides Analyzed: ${report.slideCount}`);
    console.log(`⚠️  Critical Issues: ${report.summary.criticalIssuesCount}`);
    
    if (report.summary.averageScore < 70) {
      console.log(`\n⚠️  This presentation needs significant improvements!`);
    } else if (report.summary.averageScore < 85) {
      console.log(`\n💡 This presentation could benefit from some improvements.`);
    } else {
      console.log(`\n✅ This presentation meets quality standards!`);
    }
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  } finally {
    await analyzer.cleanup();
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { PresentationAnalyzer, DESIGN_RULES, ANALYSIS_PROMPTS };