#!/usr/bin/env node

const { PresentationAnalyzer } = require('./analyze-presentations');
const PresentationFixGenerator = require('./presentation-fix-generator');
const fs = require('fs').promises;
const path = require('path');

/**
 * Enhanced analyzer that can both analyze and fix presentations
 */
class PresentationImprover {
  constructor() {
    this.analyzer = new PresentationAnalyzer();
    this.fixGenerator = new PresentationFixGenerator();
  }

  async improvePresentation(presentationPath, options = {}) {
    console.log(`\n🎯 Starting Presentation Improvement Process`);
    console.log(`📍 Target: ${presentationPath}`);
    console.log(`🔧 Auto-fix: ${options.autoFix ? 'Enabled' : 'Disabled'}`);
    console.log(`🎯 Target Score: ${options.targetScore || 85}%\n`);

    try {
      await this.analyzer.init();

      let currentScore = 0;
      let iteration = 0;
      const maxIterations = options.maxIterations || 3;
      const targetScore = options.targetScore || 85;

      while (iteration < maxIterations && currentScore < targetScore) {
        console.log(`\n🔄 Iteration ${iteration + 1}/${maxIterations}`);
        
        // Step 1: Capture screenshots
        const screenshots = await this.analyzer.captureSlides(presentationPath);
        
        // Step 2: Analyze each slide
        const analyses = [];
        for (const screenshot of screenshots) {
          const slideHtml = await this.getSlideHtml(presentationPath, screenshot.slideNumber);
          const analysis = await this.enhancedAnalyze(screenshot, slideHtml);
          analyses.push(analysis);
        }
        
        // Step 3: Generate report
        const report = await this.analyzer.generateReport(presentationPath, analyses);
        currentScore = report.summary.averageScore;
        
        console.log(`\n📊 Current Score: ${currentScore}%`);
        
        if (currentScore >= targetScore) {
          console.log(`✅ Target score reached!`);
          break;
        }
        
        if (options.autoFix && iteration < maxIterations - 1) {
          // Step 4: Generate fixes
          const fixes = await this.fixGenerator.generateFixes(report, presentationPath);
          
          if (fixes.length === 0) {
            console.log(`\n⚠️  No automatic fixes available`);
            break;
          }
          
          // Step 5: Apply fixes
          console.log(`\n🔧 Found ${fixes.length} fixes to apply`);
          const fixReport = this.fixGenerator.generateFixReport(fixes);
          
          console.log(`\n📋 Fix Summary:`);
          console.log(`   Critical: ${fixReport.byPriority.critical}`);
          console.log(`   High: ${fixReport.byPriority.high}`);
          console.log(`   Medium: ${fixReport.byPriority.medium}`);
          console.log(`   Low: ${fixReport.byPriority.low}`);
          
          if (options.dryRun) {
            console.log(`\n🔍 Dry run mode - fixes not applied`);
            await this.saveDryRunReport(fixes, presentationPath);
          } else {
            const result = await this.fixGenerator.applyFixes(presentationPath, fixes);
            console.log(`\n✅ Applied ${result.appliedCount} fixes`);
          }
        }
        
        iteration++;
      }
      
      // Final report
      console.log(`\n🎉 Improvement Process Complete!`);
      console.log(`   Final Score: ${currentScore}%`);
      console.log(`   Iterations: ${iteration}`);
      
      return {
        finalScore: currentScore,
        iterations: iteration,
        improved: currentScore >= targetScore
      };
      
    } finally {
      await this.analyzer.cleanup();
    }
  }

  async enhancedAnalyze(screenshot, slideHtml) {
    // Enhanced analysis with more detailed checks
    const analysis = await this.analyzer.analyzeSlide(screenshot, slideHtml);
    
    // Add more sophisticated checks
    analysis.issues.push(...this.checkAccessibility(slideHtml));
    analysis.issues.push(...this.checkMobileResponsiveness(slideHtml));
    analysis.issues.push(...this.checkCognitiveLoad(slideHtml));
    
    // Recalculate scores based on all issues
    this.recalculateScores(analysis);
    
    return analysis;
  }

  checkAccessibility(html) {
    const issues = [];
    
    // Check for alt text on images
    const imgMatches = html.match(/<img[^>]+>/g) || [];
    imgMatches.forEach(img => {
      if (!img.includes('alt=')) {
        issues.push({
          type: 'ACCESSIBILITY',
          severity: 'high',
          description: 'Image missing alt text',
          element: img.substring(0, 50) + '...'
        });
      }
    });
    
    // Check for proper heading hierarchy
    const headings = html.match(/<h[1-6][^>]*>/g) || [];
    let lastLevel = 0;
    headings.forEach(heading => {
      const level = parseInt(heading.charAt(2));
      if (level > lastLevel + 1) {
        issues.push({
          type: 'ACCESSIBILITY',
          severity: 'medium',
          description: `Heading hierarchy skip: h${lastLevel} to h${level}`,
        });
      }
      lastLevel = level;
    });
    
    return issues;
  }

  checkMobileResponsiveness(html) {
    const issues = [];
    
    // Check for fixed widths
    const fixedWidths = html.match(/width:\s*\d+px/g) || [];
    if (fixedWidths.length > 0) {
      issues.push({
        type: 'MOBILE',
        severity: 'medium',
        description: `Found ${fixedWidths.length} fixed width declarations`,
        examples: fixedWidths.slice(0, 3)
      });
    }
    
    // Check for non-responsive font sizes
    const pxFontSizes = html.match(/font-size:\s*\d+px/g) || [];
    if (pxFontSizes.length > 0) {
      issues.push({
        type: 'MOBILE',
        severity: 'medium',
        description: `Found ${pxFontSizes.length} px font-size declarations`,
        examples: pxFontSizes.slice(0, 3)
      });
    }
    
    return issues;
  }

  checkCognitiveLoad(html) {
    const issues = [];
    
    // Count text density
    const textContent = html.replace(/<[^>]*>/g, '').trim();
    const wordCount = textContent.split(/\s+/).length;
    
    if (wordCount > 150) {
      issues.push({
        type: 'COGNITIVE_LOAD',
        severity: 'high',
        description: `High text density: ${wordCount} words on slide`,
        suggestion: 'Consider splitting content across multiple slides'
      });
    }
    
    // Count bullet points
    const bulletPoints = (html.match(/<li>/g) || []).length;
    if (bulletPoints > 7) {
      issues.push({
        type: 'COGNITIVE_LOAD',
        severity: 'medium',
        description: `Too many bullet points: ${bulletPoints}`,
        suggestion: 'Limit to 5-7 bullet points per slide'
      });
    }
    
    return issues;
  }

  recalculateScores(analysis) {
    const issueWeights = {
      ACCESSIBILITY: { high: -15, medium: -10, low: -5 },
      TEXT_SIZE: { high: -20, medium: -15, low: -10 },
      SPACING: { high: -10, medium: -7, low: -5 },
      COGNITIVE_LOAD: { high: -15, medium: -10, low: -5 },
      MOBILE: { high: -15, medium: -10, low: -5 },
      CONTRAST: { high: -20, medium: -15, low: -10 }
    };
    
    // Start with perfect score and deduct based on issues
    let scores = {
      readability: 100,
      hierarchy: 100,
      cognitiveLoad: 100,
      accessibility: 100,
      mobile: 100
    };
    
    analysis.issues.forEach(issue => {
      const weight = issueWeights[issue.type]?.[issue.severity] || -5;
      
      switch (issue.type) {
        case 'TEXT_SIZE':
        case 'CONTRAST':
          scores.readability += weight;
          break;
        case 'SPACING':
          scores.hierarchy += weight;
          break;
        case 'COGNITIVE_LOAD':
          scores.cognitiveLoad += weight;
          break;
        case 'ACCESSIBILITY':
          scores.accessibility += weight;
          break;
        case 'MOBILE':
          scores.mobile += weight;
          break;
      }
    });
    
    // Ensure scores don't go below 0
    Object.keys(scores).forEach(key => {
      scores[key] = Math.max(0, scores[key]);
    });
    
    analysis.scores = scores;
    analysis.scores.overall = Math.round(
      (scores.readability * 0.3) +
      (scores.hierarchy * 0.2) +
      (scores.cognitiveLoad * 0.2) +
      (scores.accessibility * 0.2) +
      (scores.mobile * 0.1)
    );
  }

  async getSlideHtml(presentationPath, slideNumber) {
    // In a real implementation, we'd extract the specific slide HTML
    // For now, return mock HTML
    const fullHtml = await fs.readFile(presentationPath, 'utf-8');
    
    // Try to extract slide section
    const slideRegex = new RegExp(`<section[^>]*>.*?</section>`, 'gs');
    const slides = fullHtml.match(slideRegex) || [];
    
    if (slides[slideNumber - 1]) {
      return slides[slideNumber - 1];
    }
    
    return '<div>Mock slide content</div>';
  }

  async saveDryRunReport(fixes, presentationPath) {
    const reportPath = path.join(
      this.analyzer.resultsDir, 
      `dry-run-fixes-${Date.now()}.json`
    );
    
    await fs.writeFile(reportPath, JSON.stringify({
      presentation: presentationPath,
      timestamp: new Date().toISOString(),
      fixes: fixes,
      summary: this.fixGenerator.generateFixReport(fixes)
    }, null, 2));
    
    console.log(`\n📄 Dry run report saved: ${reportPath}`);
  }

  async batchImprove(presentations, options = {}) {
    console.log(`\n🚀 Batch Improvement Mode`);
    console.log(`📁 Processing ${presentations.length} presentations\n`);
    
    const results = [];
    
    for (const presentation of presentations) {
      console.log(`\n${'='.repeat(60)}`);
      const result = await this.improvePresentation(presentation, options);
      results.push({
        presentation,
        ...result
      });
    }
    
    // Summary report
    console.log(`\n${'='.repeat(60)}`);
    console.log(`\n📊 Batch Improvement Summary:`);
    console.log(`   Total Presentations: ${results.length}`);
    console.log(`   Successfully Improved: ${results.filter(r => r.improved).length}`);
    console.log(`   Average Final Score: ${Math.round(
      results.reduce((sum, r) => sum + r.finalScore, 0) / results.length
    )}%`);
    
    return results;
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help')) {
    console.log(`
🎯 Presentation Analyzer & Improver

Usage:
  npm run improve-presentations <path> [options]

Options:
  --fix              Apply fixes automatically
  --dry-run          Show what would be fixed without applying
  --target=N         Target score (default: 85)
  --iterations=N     Max improvement iterations (default: 3)
  --all              Process all presentations
  --week=N           Process all presentations in week N

Examples:
  npm run improve-presentations "week1 lesson1" --fix
  npm run improve-presentations "/path/to/presentation.html" --dry-run
  npm run improve-presentations --week=1 --fix --target=90
    `);
    process.exit(0);
  }

  const improver = new PresentationImprover();
  
  try {
    // Separate flags from paths
    const flags = args.filter(arg => arg.startsWith('--'));
    const paths = args.filter(arg => !arg.startsWith('--'));
    
    const options = {
      autoFix: flags.includes('--fix'),
      dryRun: flags.includes('--dry-run'),
      targetScore: parseInt(flags.find(a => a.startsWith('--target='))?.split('=')[1] || '85'),
      maxIterations: parseInt(flags.find(a => a.startsWith('--iterations='))?.split('=')[1] || '3')
    };
    
    let presentations = [];
    
    if (flags.includes('--all')) {
      // Find all presentations
      // Implementation would scan for all presentation files
      console.log('Finding all presentations...');
      presentations = []; // TODO: Implement file scanning
    } else if (flags.find(a => a.startsWith('--week='))) {
      const week = flags.find(a => a.startsWith('--week=')).split('=')[1];
      // Find all presentations in specified week
      console.log(`Finding all presentations in week ${week}...`);
      presentations = []; // TODO: Implement week scanning
    } else {
      // Single presentation
      if (paths.length === 0) {
        console.error('❌ No presentation path provided');
        console.log('\nUsage: npm run improve-dry "week1 lesson1"');
        process.exit(1);
      }
      
      let presentationPath = paths[0];
      
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
      
      presentations = [presentationPath];
    }
    
    if (presentations.length === 0) {
      console.error('❌ No presentations found to process');
      process.exit(1);
    }
    
    if (presentations.length === 1) {
      await improver.improvePresentation(presentations[0], options);
    } else {
      await improver.batchImprove(presentations, options);
    }
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { PresentationImprover };