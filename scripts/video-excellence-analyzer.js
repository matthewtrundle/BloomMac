#!/usr/bin/env node

const { PresentationAnalyzer } = require('./analyze-presentations');
const fs = require('fs').promises;
const path = require('path');

/**
 * Video Excellence Analyzer - Ultra-critical analysis for world-class visual polish
 * Focused on presentation aesthetics, not user interaction
 */
class VideoExcellenceAnalyzer {
  constructor() {
    this.analyzer = new PresentationAnalyzer();
    this.criticalThreshold = 95; // World-class standard
  }

  async analyzeCritically(presentationPath) {
    console.log(`\n🔍 CRITICAL VIDEO EXCELLENCE ANALYSIS`);
    console.log(`📍 Target: ${presentationPath}`);
    console.log(`🎯 World-Class Standard: 95%+`);
    console.log(`${'='.repeat(60)}\n`);

    await this.analyzer.init();

    try {
      const screenshots = await this.analyzer.captureSlides(presentationPath);
      const html = await fs.readFile(presentationPath, 'utf-8');
      
      console.log(`📸 Analyzing ${screenshots.length} slides with extreme scrutiny...\n`);

      const slideAnalyses = [];
      
      for (let i = 0; i < screenshots.length; i++) {
        console.log(`\n${'─'.repeat(60)}`);
        console.log(`🎬 SLIDE ${i + 1} - CRITICAL ANALYSIS`);
        console.log(`${'─'.repeat(60)}`);
        
        const analysis = await this.performCriticalSlideAnalysis(
          screenshots[i], 
          html, 
          i + 1
        );
        
        slideAnalyses.push(analysis);
        
        // Detailed console output for each slide
        this.outputDetailedSlideAnalysis(analysis, i + 1);
      }

      // Overall presentation critique
      const presentationCritique = this.generatePresentationCritique(slideAnalyses);
      
      // Generate and save detailed report
      const report = await this.generateCriticalReport(
        presentationPath,
        slideAnalyses,
        presentationCritique
      );

      return report;

    } finally {
      await this.analyzer.cleanup();
    }
  }

  async performCriticalSlideAnalysis(screenshot, html, slideNumber) {
    const analysis = {
      slideNumber,
      scores: {},
      critiques: [],
      polishOpportunities: [],
      worldClassGaps: []
    };

    // Extract slide-specific HTML (simplified for this example)
    const slideContent = this.extractSlideContent(html, slideNumber);

    // 1. Typography Excellence (30% weight)
    const typographyCritique = this.critiqueTypography(slideContent);
    analysis.scores.typography = typographyCritique.score;
    analysis.critiques.push(...typographyCritique.issues);
    analysis.polishOpportunities.push(...typographyCritique.opportunities);

    // 2. Visual Hierarchy (25% weight)
    const hierarchyCritique = this.critiqueVisualHierarchy(slideContent);
    analysis.scores.hierarchy = hierarchyCritique.score;
    analysis.critiques.push(...hierarchyCritique.issues);
    analysis.polishOpportunities.push(...hierarchyCritique.opportunities);

    // 3. Spacing & Composition (20% weight)
    const spacingCritique = this.critiqueSpacing(slideContent);
    analysis.scores.spacing = spacingCritique.score;
    analysis.critiques.push(...spacingCritique.issues);
    analysis.polishOpportunities.push(...spacingCritique.opportunities);

    // 4. Color & Contrast (15% weight)
    const colorCritique = this.critiqueColorUsage(slideContent);
    analysis.scores.color = colorCritique.score;
    analysis.critiques.push(...colorCritique.issues);
    analysis.polishOpportunities.push(...colorCritique.opportunities);

    // 5. Professional Polish (10% weight)
    const polishCritique = this.critiqueProfessionalPolish(slideContent);
    analysis.scores.polish = polishCritique.score;
    analysis.critiques.push(...polishCritique.issues);
    analysis.worldClassGaps.push(...polishCritique.gaps);

    // Calculate weighted overall score
    analysis.overallScore = Math.round(
      (analysis.scores.typography * 0.30) +
      (analysis.scores.hierarchy * 0.25) +
      (analysis.scores.spacing * 0.20) +
      (analysis.scores.color * 0.15) +
      (analysis.scores.polish * 0.10)
    );

    // Determine if meets world-class standard
    analysis.meetsWorldClass = analysis.overallScore >= this.criticalThreshold;

    return analysis;
  }

  critiqueTypography(slideContent) {
    const critique = {
      score: 100,
      issues: [],
      opportunities: []
    };

    // Check font sizes
    const fontSizeMatches = slideContent.match(/font-size:\s*([^;]+)/g) || [];
    fontSizeMatches.forEach(match => {
      const size = match.match(/(\d+(?:\.\d+)?)(rem|px|em)/);
      if (size) {
        const value = parseFloat(size[1]);
        const unit = size[2];
        
        if (unit === 'px' && value < 24) {
          critique.score -= 5;
          critique.issues.push({
            severity: 'HIGH',
            issue: `Small text found: ${match}`,
            fix: 'Minimum 24px (1.5rem) for video clarity'
          });
        }
        
        if (unit === 'rem' && value < 1.3) {
          critique.score -= 5;
          critique.issues.push({
            severity: 'HIGH',
            issue: `Suboptimal text size: ${match}`,
            fix: `Increase to at least 1.5rem for video recording`
          });
        }
      }
    });

    // Check line heights
    if (!slideContent.includes('line-height')) {
      critique.score -= 10;
      critique.issues.push({
        severity: 'MEDIUM',
        issue: 'Missing explicit line-height definitions',
        fix: 'Add line-height: 1.6-1.8 for optimal readability'
      });
    }

    // Check font weights
    const h1Count = (slideContent.match(/<h1/g) || []).length;
    const h2Count = (slideContent.match(/<h2/g) || []).length;
    const h3Count = (slideContent.match(/<h3/g) || []).length;
    
    if (h1Count + h2Count + h3Count > 0) {
      if (!slideContent.includes('font-weight: 600') && !slideContent.includes('font-weight: 700')) {
        critique.score -= 5;
        critique.opportunities.push({
          type: 'TYPOGRAPHY_WEIGHT',
          suggestion: 'Use font-weight: 600-700 for headers to create stronger hierarchy',
          impact: 'HIGH'
        });
      }
    }

    // World-class typography checks
    if (!slideContent.includes('-webkit-font-smoothing')) {
      critique.score -= 5;
      critique.opportunities.push({
        type: 'FONT_RENDERING',
        suggestion: 'Add -webkit-font-smoothing: antialiased for crisp video rendering',
        impact: 'MEDIUM'
      });
    }

    if (!slideContent.includes('letter-spacing')) {
      critique.score -= 3;
      critique.opportunities.push({
        type: 'TYPOGRAPHY_REFINEMENT',
        suggestion: 'Add subtle letter-spacing (-0.02em) to headers for professional polish',
        impact: 'LOW'
      });
    }

    return critique;
  }

  critiqueVisualHierarchy(slideContent) {
    const critique = {
      score: 100,
      issues: [],
      opportunities: []
    };

    // Check heading structure
    const headings = slideContent.match(/<h[1-6][^>]*>/g) || [];
    if (headings.length === 0) {
      critique.score -= 15;
      critique.issues.push({
        severity: 'HIGH',
        issue: 'No clear heading structure',
        fix: 'Add h1/h2/h3 elements for proper hierarchy'
      });
    }

    // Check for visual emphasis
    const hasEmphasis = slideContent.includes('font-style: italic') || 
                       slideContent.includes('font-weight: bold') ||
                       slideContent.includes('color: var(--bloom-coral)');
    
    if (!hasEmphasis) {
      critique.score -= 10;
      critique.opportunities.push({
        type: 'EMPHASIS',
        suggestion: 'Add visual emphasis (color, weight, or style) to key words',
        impact: 'HIGH'
      });
    }

    // Check for proper contrast ratios in hierarchy
    const colorChanges = (slideContent.match(/color:/g) || []).length;
    if (colorChanges < 2) {
      critique.score -= 8;
      critique.opportunities.push({
        type: 'COLOR_HIERARCHY',
        suggestion: 'Use color variations to reinforce visual hierarchy',
        impact: 'MEDIUM'
      });
    }

    // Check for size progression
    const h1Size = slideContent.match(/h1.*font-size:\s*([^;]+)/);
    const h2Size = slideContent.match(/h2.*font-size:\s*([^;]+)/);
    const h3Size = slideContent.match(/h3.*font-size:\s*([^;]+)/);
    
    if (h1Size && h2Size && h3Size) {
      // Verify proper size cascade
      critique.opportunities.push({
        type: 'SIZE_CASCADE',
        suggestion: 'Ensure 1.5x scale between heading levels for clear hierarchy',
        impact: 'MEDIUM'
      });
    }

    return critique;
  }

  critiqueSpacing(slideContent) {
    const critique = {
      score: 100,
      issues: [],
      opportunities: []
    };

    // Check padding
    const paddingMatches = slideContent.match(/padding:\s*([^;]+)/g) || [];
    let insufficientPadding = 0;
    
    paddingMatches.forEach(match => {
      if (match.includes('0.5rem') || match.includes('1rem')) {
        insufficientPadding++;
      }
    });

    if (insufficientPadding > 0) {
      critique.score -= insufficientPadding * 3;
      critique.issues.push({
        severity: 'MEDIUM',
        issue: `${insufficientPadding} instances of insufficient padding`,
        fix: 'Minimum 1.5rem padding for breathing room'
      });
    }

    // Check margins
    const marginZero = (slideContent.match(/margin:\s*0/g) || []).length;
    if (marginZero > 2) {
      critique.score -= 5;
      critique.opportunities.push({
        type: 'SPACING_RHYTHM',
        suggestion: 'Add consistent vertical rhythm with margins (1rem, 1.5rem, 2rem)',
        impact: 'HIGH'
      });
    }

    // Check for white space
    const divCount = (slideContent.match(/<div/g) || []).length;
    const spacingElements = (slideContent.match(/margin|padding|gap/g) || []).length;
    
    if (divCount > 0 && spacingElements / divCount < 0.5) {
      critique.score -= 10;
      critique.issues.push({
        severity: 'HIGH',
        issue: 'Insufficient white space definition',
        fix: 'Add explicit spacing to create visual breathing room'
      });
    }

    // World-class spacing
    if (!slideContent.includes('gap:')) {
      critique.score -= 5;
      critique.opportunities.push({
        type: 'MODERN_SPACING',
        suggestion: 'Use CSS gap property for consistent spacing in flex/grid layouts',
        impact: 'MEDIUM'
      });
    }

    return critique;
  }

  critiqueColorUsage(slideContent) {
    const critique = {
      score: 100,
      issues: [],
      opportunities: []
    };

    // Check color usage
    const colorMatches = slideContent.match(/color:\s*([^;]+)/g) || [];
    const backgroundMatches = slideContent.match(/background:\s*([^;]+)/g) || [];
    
    // Check for proper contrast
    const blackTextCount = colorMatches.filter(c => 
      c.includes('#000') || c.includes('#111') || c.includes('#222')
    ).length;
    
    if (blackTextCount === 0) {
      critique.score -= 5;
      critique.opportunities.push({
        type: 'CONTRAST',
        suggestion: 'Use darker text (#1a1a1a) for maximum video contrast',
        impact: 'HIGH'
      });
    }

    // Check for color consistency
    const customColors = slideContent.match(/var\(--bloom-[^)]+\)/g) || [];
    if (customColors.length === 0) {
      critique.score -= 10;
      critique.issues.push({
        severity: 'MEDIUM',
        issue: 'Not using brand color system',
        fix: 'Use var(--bloom-*) colors for consistency'
      });
    }

    // Check for accent color usage
    const accentColors = customColors.filter(c => 
      c.includes('coral') || c.includes('mint') || c.includes('golden')
    );
    
    if (accentColors.length === 0) {
      critique.score -= 5;
      critique.opportunities.push({
        type: 'COLOR_ACCENT',
        suggestion: 'Add accent colors to highlight key information',
        impact: 'MEDIUM'
      });
    }

    // Check backgrounds
    if (backgroundMatches.length === 0) {
      critique.score -= 5;
      critique.opportunities.push({
        type: 'BACKGROUND_DEPTH',
        suggestion: 'Add subtle background colors or gradients for depth',
        impact: 'LOW'
      });
    }

    return critique;
  }

  critiqueProfessionalPolish(slideContent) {
    const critique = {
      score: 100,
      issues: [],
      opportunities: [],
      gaps: []
    };

    // Shadow usage
    const shadowCount = (slideContent.match(/box-shadow/g) || []).length;
    if (shadowCount === 0) {
      critique.score -= 10;
      critique.gaps.push({
        type: 'DEPTH',
        gap: 'No shadows for depth perception',
        worldClassExample: 'box-shadow: 0 10px 40px rgba(0,0,0,0.08)',
        impact: 'Creates professional depth and hierarchy'
      });
    }

    // Border radius consistency
    const borderRadiusMatches = slideContent.match(/border-radius:\s*([^;]+)/g) || [];
    if (borderRadiusMatches.length === 0) {
      critique.score -= 5;
      critique.gaps.push({
        type: 'MODERN_DESIGN',
        gap: 'No rounded corners',
        worldClassExample: 'border-radius: 12px for cards, 8px for buttons',
        impact: 'Modern, polished appearance'
      });
    }

    // Transitions (even for static video, shows attention to detail)
    if (!slideContent.includes('transition:')) {
      critique.score -= 5;
      critique.opportunities.push({
        type: 'POLISH_DETAIL',
        suggestion: 'Add transitions to show craftsmanship (even if not used in video)',
        impact: 'LOW'
      });
    }

    // Image quality indicators
    const imgTags = slideContent.match(/<img[^>]*>/g) || [];
    imgTags.forEach(img => {
      if (!img.includes('alt=')) {
        critique.score -= 3;
        critique.issues.push({
          severity: 'LOW',
          issue: 'Missing alt text on image',
          fix: 'Add descriptive alt text for completeness'
        });
      }
    });

    // Professional typography details
    if (!slideContent.includes('text-rendering')) {
      critique.score -= 2;
      critique.gaps.push({
        type: 'TYPOGRAPHY_DETAIL',
        gap: 'Missing text-rendering optimization',
        worldClassExample: 'text-rendering: optimizeLegibility',
        impact: 'Subtle improvement in text clarity'
      });
    }

    // Layout sophistication
    const flexCount = (slideContent.match(/display:\s*flex/g) || []).length;
    const gridCount = (slideContent.match(/display:\s*grid/g) || []).length;
    
    if (flexCount === 0 && gridCount === 0) {
      critique.score -= 10;
      critique.gaps.push({
        type: 'LAYOUT_MODERN',
        gap: 'Not using modern layout techniques',
        worldClassExample: 'CSS Grid or Flexbox for precise alignment',
        impact: 'Professional, pixel-perfect layouts'
      });
    }

    return critique;
  }

  outputDetailedSlideAnalysis(analysis, slideNumber) {
    const scoreColor = analysis.overallScore >= 95 ? '\x1b[32m' : // Green
                      analysis.overallScore >= 85 ? '\x1b[33m' : // Yellow
                      '\x1b[31m'; // Red
    const reset = '\x1b[0m';

    console.log(`\n📊 Overall Score: ${scoreColor}${analysis.overallScore}%${reset} ${
      analysis.meetsWorldClass ? '✅ WORLD-CLASS' : '❌ NEEDS IMPROVEMENT'
    }`);

    console.log(`\n📈 Detailed Scores:`);
    console.log(`   Typography:    ${this.getScoreBar(analysis.scores.typography)} ${analysis.scores.typography}%`);
    console.log(`   Hierarchy:     ${this.getScoreBar(analysis.scores.hierarchy)} ${analysis.scores.hierarchy}%`);
    console.log(`   Spacing:       ${this.getScoreBar(analysis.scores.spacing)} ${analysis.scores.spacing}%`);
    console.log(`   Color:         ${this.getScoreBar(analysis.scores.color)} ${analysis.scores.color}%`);
    console.log(`   Polish:        ${this.getScoreBar(analysis.scores.polish)} ${analysis.scores.polish}%`);

    if (analysis.critiques.length > 0) {
      console.log(`\n⚠️  Critical Issues (${analysis.critiques.length}):`);
      analysis.critiques.slice(0, 5).forEach(critique => {
        console.log(`   ${this.getSeverityIcon(critique.severity)} ${critique.issue}`);
        console.log(`      → ${critique.fix}`);
      });
    }

    if (analysis.polishOpportunities.length > 0) {
      console.log(`\n💎 Polish Opportunities (${analysis.polishOpportunities.length}):`);
      analysis.polishOpportunities.slice(0, 3).forEach(opp => {
        console.log(`   • ${opp.suggestion}`);
        console.log(`     Impact: ${opp.impact}`);
      });
    }

    if (analysis.worldClassGaps.length > 0) {
      console.log(`\n🌟 World-Class Gaps:`);
      analysis.worldClassGaps.forEach(gap => {
        console.log(`   • ${gap.gap}`);
        console.log(`     Example: ${gap.worldClassExample}`);
      });
    }
  }

  getScoreBar(score) {
    const filled = Math.round(score / 10);
    const empty = 10 - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  }

  getSeverityIcon(severity) {
    switch(severity) {
      case 'HIGH': return '🔴';
      case 'MEDIUM': return '🟡';
      case 'LOW': return '🟢';
      default: return '•';
    }
  }

  generatePresentationCritique(slideAnalyses) {
    const avgScore = Math.round(
      slideAnalyses.reduce((sum, s) => sum + s.overallScore, 0) / slideAnalyses.length
    );

    const allIssues = slideAnalyses.flatMap(s => s.critiques);
    const allOpportunities = slideAnalyses.flatMap(s => s.polishOpportunities);
    const allGaps = slideAnalyses.flatMap(s => s.worldClassGaps);

    // Group issues by type
    const issueTypes = {};
    allIssues.forEach(issue => {
      const type = issue.issue.split(':')[0];
      issueTypes[type] = (issueTypes[type] || 0) + 1;
    });

    // Find patterns
    const patterns = {
      consistentIssues: Object.entries(issueTypes)
        .filter(([_, count]) => count >= 3)
        .map(([type, count]) => ({ type, count })),
      
      weakestAreas: Object.entries({
        typography: slideAnalyses.map(s => s.scores.typography),
        hierarchy: slideAnalyses.map(s => s.scores.hierarchy),
        spacing: slideAnalyses.map(s => s.scores.spacing),
        color: slideAnalyses.map(s => s.scores.color),
        polish: slideAnalyses.map(s => s.scores.polish)
      }).map(([area, scores]) => ({
        area,
        avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      })).sort((a, b) => a.avgScore - b.avgScore),

      worldClassSlides: slideAnalyses.filter(s => s.meetsWorldClass).map(s => s.slideNumber),
      needsWorkSlides: slideAnalyses.filter(s => s.overallScore < 85).map(s => s.slideNumber)
    };

    return {
      overallScore: avgScore,
      meetsWorldClass: avgScore >= this.criticalThreshold,
      totalIssues: allIssues.length,
      totalOpportunities: allOpportunities.length,
      totalGaps: allGaps.length,
      patterns,
      topPriorities: this.identifyTopPriorities(allIssues, allOpportunities, allGaps)
    };
  }

  identifyTopPriorities(issues, opportunities, gaps) {
    const priorities = [];

    // High severity issues first
    const highIssues = issues.filter(i => i.severity === 'HIGH');
    if (highIssues.length > 0) {
      priorities.push({
        type: 'CRITICAL_FIXES',
        items: highIssues.slice(0, 5),
        estimatedImpact: '+10-15 points'
      });
    }

    // High impact opportunities
    const highOpps = opportunities.filter(o => o.impact === 'HIGH');
    if (highOpps.length > 0) {
      priorities.push({
        type: 'QUICK_WINS',
        items: highOpps.slice(0, 5),
        estimatedImpact: '+5-10 points'
      });
    }

    // World-class gaps
    if (gaps.length > 0) {
      priorities.push({
        type: 'EXCELLENCE_GAPS',
        items: gaps.slice(0, 3),
        estimatedImpact: '+5-8 points'
      });
    }

    return priorities;
  }

  async generateCriticalReport(presentationPath, slideAnalyses, presentationCritique) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportDir = path.join(process.cwd(), 'analysis', 'video-excellence');
    await fs.mkdir(reportDir, { recursive: true });

    const report = {
      metadata: {
        presentationPath,
        analyzedAt: new Date().toISOString(),
        slideCount: slideAnalyses.length,
        analyzerVersion: '2.0',
        mode: 'CRITICAL_VIDEO_EXCELLENCE'
      },
      summary: {
        overallScore: presentationCritique.overallScore,
        meetsWorldClass: presentationCritique.meetsWorldClass,
        gap: this.criticalThreshold - presentationCritique.overallScore,
        totalIssues: presentationCritique.totalIssues,
        totalOpportunities: presentationCritique.totalOpportunities
      },
      detailedAnalysis: {
        bySlide: slideAnalyses,
        patterns: presentationCritique.patterns,
        priorities: presentationCritique.topPriorities
      },
      actionPlan: this.generateActionPlan(presentationCritique, slideAnalyses)
    };

    // Save JSON
    const jsonPath = path.join(reportDir, `critical-analysis-${timestamp}.json`);
    await fs.writeFile(jsonPath, JSON.stringify(report, null, 2));

    // Generate HTML
    const htmlPath = path.join(reportDir, `critical-analysis-${timestamp}.html`);
    const htmlContent = this.generateHTMLReport(report);
    await fs.writeFile(htmlPath, htmlContent);

    console.log(`\n${'='.repeat(60)}`);
    console.log(`📊 FINAL PRESENTATION SCORE: ${presentationCritique.overallScore}%`);
    console.log(`🎯 World-Class Gap: ${this.criticalThreshold - presentationCritique.overallScore} points`);
    console.log(`\n📄 Detailed Reports Generated:`);
    console.log(`   JSON: ${jsonPath}`);
    console.log(`   HTML: ${htmlPath}`);

    return report;
  }

  generateActionPlan(critique, slideAnalyses) {
    const plan = {
      immediate: [],
      shortTerm: [],
      excellence: []
    };

    // Immediate fixes (1-2 hours)
    if (critique.topPriorities.find(p => p.type === 'CRITICAL_FIXES')) {
      plan.immediate.push({
        action: 'Fix critical typography issues',
        slides: slideAnalyses.filter(s => s.scores.typography < 85).map(s => s.slideNumber),
        effort: '1 hour',
        impact: '+10-15 points'
      });
    }

    // Short term (1 day)
    plan.shortTerm.push({
      action: 'Implement consistent spacing system',
      details: 'Use 8px grid: 8px, 16px, 24px, 32px, 48px',
      effort: '2-3 hours',
      impact: '+5-8 points'
    });

    plan.shortTerm.push({
      action: 'Enhance visual hierarchy',
      details: 'Add color accents, adjust font weights, improve contrast',
      effort: '2 hours',
      impact: '+5-7 points'
    });

    // Excellence (1 week)
    plan.excellence.push({
      action: 'Professional image curation',
      details: 'Replace all images with high-quality, on-brand photography',
      effort: '1-2 days',
      impact: '+5 points'
    });

    plan.excellence.push({
      action: 'Micro-typography refinement',
      details: 'Letter-spacing, text-rendering, custom font loading',
      effort: '2-3 hours',
      impact: '+3-5 points'
    });

    return plan;
  }

  generateHTMLReport(report) {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Critical Video Excellence Analysis - ${new Date().toLocaleDateString()}</title>
    <style>
        body {
            font-family: -apple-system, 'Inter', sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem;
            background: #fafafa;
        }
        
        .header {
            background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
            color: white;
            padding: 3rem;
            border-radius: 16px;
            margin-bottom: 3rem;
        }
        
        h1 {
            margin: 0 0 1rem 0;
            font-size: 2.5rem;
            font-weight: 700;
        }
        
        .score-display {
            font-size: 5rem;
            font-weight: 800;
            margin: 2rem 0;
            display: inline-block;
        }
        
        .world-class { color: #4ade80; }
        .excellent { color: #60a5fa; }
        .good { color: #fbbf24; }
        .needs-work { color: #f87171; }
        
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin: 3rem 0;
        }
        
        .metric-card {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.06);
            text-align: center;
        }
        
        .metric-number {
            font-size: 3rem;
            font-weight: 700;
            margin: 0;
        }
        
        .metric-label {
            color: #666;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 0.5rem;
        }
        
        .slide-analysis {
            background: white;
            padding: 2.5rem;
            margin: 2rem 0;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.06);
            border-left: 4px solid #ddd;
        }
        
        .slide-analysis.world-class {
            border-left-color: #4ade80;
        }
        
        .slide-analysis.needs-work {
            border-left-color: #f87171;
        }
        
        .issue {
            background: #fee;
            border-left: 4px solid #f44;
            padding: 1rem;
            margin: 0.5rem 0;
            border-radius: 4px;
        }
        
        .opportunity {
            background: #fef3c7;
            border-left: 4px solid #fbbf24;
            padding: 1rem;
            margin: 0.5rem 0;
            border-radius: 4px;
        }
        
        .gap {
            background: #ede9fe;
            border-left: 4px solid #8b5cf6;
            padding: 1rem;
            margin: 0.5rem 0;
            border-radius: 4px;
        }
        
        .action-plan {
            background: #f0fdf4;
            padding: 2rem;
            border-radius: 12px;
            margin: 2rem 0;
        }
        
        .score-bar {
            display: inline-block;
            width: 100px;
            height: 10px;
            background: #e5e7eb;
            border-radius: 5px;
            margin-right: 1rem;
            position: relative;
        }
        
        .score-bar-fill {
            position: absolute;
            height: 100%;
            background: #60a5fa;
            border-radius: 5px;
        }
        
        pre {
            background: #f3f4f6;
            padding: 1rem;
            border-radius: 8px;
            overflow-x: auto;
        }
        
        .priority-high { color: #dc2626; font-weight: 600; }
        .priority-medium { color: #f59e0b; font-weight: 600; }
        .priority-low { color: #10b981; font-weight: 600; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎬 Critical Video Excellence Analysis</h1>
        <p>World-Class Standard: 95%+ | Focus: Visual Polish for Video Recording</p>
        <div class="score-display ${
          report.summary.overallScore >= 95 ? 'world-class' :
          report.summary.overallScore >= 85 ? 'excellent' :
          report.summary.overallScore >= 75 ? 'good' :
          'needs-work'
        }">${report.summary.overallScore}%</div>
        <p style="font-size: 1.5rem; margin-top: 1rem;">
          Gap to World-Class: <strong>${report.summary.gap} points</strong>
        </p>
    </div>
    
    <div class="summary-grid">
        <div class="metric-card">
            <p class="metric-number">${report.summary.totalIssues}</p>
            <p class="metric-label">Critical Issues</p>
        </div>
        <div class="metric-card">
            <p class="metric-number">${report.summary.totalOpportunities}</p>
            <p class="metric-label">Polish Opportunities</p>
        </div>
        <div class="metric-card">
            <p class="metric-number">${report.metadata.slideCount}</p>
            <p class="metric-label">Slides Analyzed</p>
        </div>
        <div class="metric-card">
            <p class="metric-number">${report.detailedAnalysis.patterns.worldClassSlides.length}</p>
            <p class="metric-label">World-Class Slides</p>
        </div>
    </div>
    
    <h2>📊 Detailed Slide Analysis</h2>
    ${report.detailedAnalysis.bySlide.map(slide => `
        <div class="slide-analysis ${slide.meetsWorldClass ? 'world-class' : slide.overallScore < 85 ? 'needs-work' : ''}">
            <h3>Slide ${slide.slideNumber} - Score: ${slide.overallScore}%</h3>
            
            <div style="margin: 1rem 0;">
                ${Object.entries(slide.scores).map(([category, score]) => `
                    <div style="margin: 0.5rem 0;">
                        <strong>${category.charAt(0).toUpperCase() + category.slice(1)}:</strong>
                        <div class="score-bar">
                            <div class="score-bar-fill" style="width: ${score}%"></div>
                        </div>
                        ${score}%
                    </div>
                `).join('')}
            </div>
            
            ${slide.critiques.length > 0 ? `
                <h4>Critical Issues:</h4>
                ${slide.critiques.map(critique => `
                    <div class="issue">
                        <span class="priority-${critique.severity.toLowerCase()}">${critique.severity}</span>
                        ${critique.issue}<br>
                        <strong>Fix:</strong> ${critique.fix}
                    </div>
                `).join('')}
            ` : ''}
            
            ${slide.polishOpportunities.length > 0 ? `
                <h4>Polish Opportunities:</h4>
                ${slide.polishOpportunities.map(opp => `
                    <div class="opportunity">
                        ${opp.suggestion}<br>
                        <strong>Impact:</strong> ${opp.impact}
                    </div>
                `).join('')}
            ` : ''}
            
            ${slide.worldClassGaps.length > 0 ? `
                <h4>World-Class Gaps:</h4>
                ${slide.worldClassGaps.map(gap => `
                    <div class="gap">
                        <strong>${gap.type}:</strong> ${gap.gap}<br>
                        <strong>Example:</strong> <code>${gap.worldClassExample}</code>
                    </div>
                `).join('')}
            ` : ''}
        </div>
    `).join('')}
    
    <h2>🎯 Action Plan</h2>
    <div class="action-plan">
        <h3>Immediate Actions (1-2 hours)</h3>
        ${report.actionPlan.immediate.map(action => `
            <div style="margin: 1rem 0;">
                <strong>${action.action}</strong><br>
                Slides: ${action.slides ? action.slides.join(', ') : 'All'}<br>
                Impact: ${action.impact}
            </div>
        `).join('')}
        
        <h3>Short Term (1 day)</h3>
        ${report.actionPlan.shortTerm.map(action => `
            <div style="margin: 1rem 0;">
                <strong>${action.action}</strong><br>
                ${action.details}<br>
                Impact: ${action.impact}
            </div>
        `).join('')}
        
        <h3>Excellence Phase (1 week)</h3>
        ${report.actionPlan.excellence.map(action => `
            <div style="margin: 1rem 0;">
                <strong>${action.action}</strong><br>
                ${action.details}<br>
                Impact: ${action.impact}
            </div>
        `).join('')}
    </div>
</body>
</html>`;
  }

  extractSlideContent(html, slideNumber) {
    // Simplified extraction - in production would parse properly
    const sections = html.split('<section');
    if (sections[slideNumber]) {
      return sections[slideNumber].split('</section>')[0];
    }
    return '';
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🎬 CRITICAL VIDEO EXCELLENCE ANALYZER

Ultra-critical analysis focused on visual polish for video recording.
No user interaction elements - pure aesthetic excellence.

Usage:
  npm run video-excellence "week1 lesson1"

Features:
  - Extremely detailed critique (95% world-class standard)
  - Slide-by-slide visual analysis
  - Typography, hierarchy, spacing, color, polish scoring
  - Specific fixes with impact estimates
  - Detailed console output during analysis
  - Comprehensive HTML report

This analyzer is MUCH more critical than the standard analyzer.
It will find every imperfection and opportunity for polish.
    `);
    process.exit(0);
  }

  const analyzer = new VideoExcellenceAnalyzer();
  
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
    
    await analyzer.analyzeCritically(presentationPath);
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = VideoExcellenceAnalyzer;