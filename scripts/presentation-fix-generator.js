const fs = require('fs').promises;
const path = require('path');
const { DESIGN_RULES } = require('./analyze-presentations');

class PresentationFixGenerator {
  constructor() {
    this.fixes = [];
    this.cssCache = new Map();
  }

  /**
   * Generate fixes based on analysis results
   */
  async generateFixes(analysisReport, presentationPath) {
    console.log(`\n🔧 Generating fixes for ${presentationPath}`);
    
    this.fixes = [];
    
    // Read the presentation HTML
    const html = await fs.readFile(presentationPath, 'utf-8');
    
    // Process each slide's issues
    for (const slideAnalysis of analysisReport.slides) {
      console.log(`\n📍 Processing Slide ${slideAnalysis.slideNumber}`);
      
      for (const issue of slideAnalysis.issues) {
        const fix = await this.generateFixForIssue(issue, slideAnalysis.slideNumber, html);
        if (fix) {
          this.fixes.push(fix);
        }
      }
      
      // Handle critical fixes with higher priority
      for (const criticalFix of slideAnalysis.criticalFixes) {
        const fix = await this.generateCriticalFix(criticalFix, slideAnalysis.slideNumber, html);
        if (fix) {
          fix.priority = 'critical';
          this.fixes.push(fix);
        }
      }
    }
    
    // Sort fixes by priority and type
    this.fixes.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    return this.fixes;
  }

  /**
   * Generate fix for a specific issue
   */
  async generateFixForIssue(issue, slideNumber, html) {
    switch (issue.type) {
      case 'TEXT_SIZE':
        return this.generateTextSizeFix(issue, slideNumber);
      
      case 'SPACING':
        return this.generateSpacingFix(issue, slideNumber);
      
      case 'CONTRAST':
        return this.generateContrastFix(issue, slideNumber);
      
      case 'COGNITIVE_LOAD':
        return this.generateCognitiveLoadFix(issue, slideNumber);
      
      case 'MOBILE':
        return this.generateMobileFix(issue, slideNumber);
      
      default:
        console.log(`⚠️  Unknown issue type: ${issue.type}`);
        return null;
    }
  }

  /**
   * Generate text size fixes
   */
  generateTextSizeFix(issue, slideNumber) {
    const fixes = [];
    
    // Map current sizes to optimal sizes
    const sizeMapping = {
      '0.9rem': '1.25rem',   // Too small → readable
      '0.95rem': '1.25rem',  // Borderline → readable
      '1rem': '1.25rem',     // Minimum → comfortable
      '1.05rem': '1.3rem',   // Small → comfortable
      '1.1rem': '1.4rem',    // Smallish → good
      '1.2rem': '1.5rem',    // OK → optimal
      '1.5rem': '1.8rem',    // Heading → better heading
      '2rem': '2.5rem',      // Quote → better quote
    };
    
    if (issue.examples) {
      issue.examples.forEach(example => {
        const match = example.match(/font-size:\s*([\d.]+rem)/);
        if (match) {
          const currentSize = match[1];
          const newSize = sizeMapping[currentSize] || '1.5rem';
          
          fixes.push({
            type: 'TEXT_SIZE',
            slideNumber,
            priority: issue.severity === 'high' ? 'high' : 'medium',
            description: `Increase text size from ${currentSize} to ${newSize}`,
            oldString: example,
            newString: example.replace(currentSize, newSize),
            selector: this.guessSelector(example, slideNumber)
          });
        }
      });
    }
    
    return fixes.length > 0 ? fixes[0] : null;
  }

  /**
   * Generate spacing fixes
   */
  generateSpacingFix(issue, slideNumber) {
    const spacingMapping = {
      '0.5rem': '1.5rem',
      '0.75rem': '1.5rem',
      '1rem': '2rem',
      'margin: 0': 'margin: 1rem 0'
    };
    
    return {
      type: 'SPACING',
      slideNumber,
      priority: 'low',
      description: 'Improve element spacing',
      suggestions: Object.entries(spacingMapping).map(([old, newVal]) => ({
        find: old,
        replace: newVal
      }))
    };
  }

  /**
   * Generate contrast fixes
   */
  generateContrastFix(issue, slideNumber) {
    return {
      type: 'CONTRAST',
      slideNumber,
      priority: 'high',
      description: 'Improve color contrast for accessibility',
      suggestions: [
        {
          selector: issue.element,
          css: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: '#ffffff'
          }
        }
      ]
    };
  }

  /**
   * Generate cognitive load fixes
   */
  generateCognitiveLoadFix(issue, slideNumber) {
    return {
      type: 'COGNITIVE_LOAD',
      slideNumber,
      priority: 'medium',
      description: 'Reduce information density',
      suggestions: [
        'Split content across multiple slides',
        'Use progressive disclosure with fragments',
        'Reduce bullet points to maximum 5',
        'Simplify language and shorten sentences'
      ]
    };
  }

  /**
   * Generate mobile responsiveness fixes
   */
  generateMobileFix(issue, slideNumber) {
    return {
      type: 'MOBILE',
      slideNumber,
      priority: 'medium',
      description: 'Improve mobile responsiveness',
      css: `
@media (max-width: 768px) {
  .reveal h1 { font-size: 2rem !important; }
  .reveal h2 { font-size: 1.75rem !important; }
  .reveal h3 { font-size: 1.5rem !important; }
  .reveal p { font-size: 1.1rem !important; }
  .container { padding: 1rem !important; }
  .grid { grid-template-columns: 1fr !important; }
}
      `
    };
  }

  /**
   * Generate critical fixes
   */
  async generateCriticalFix(criticalFix, slideNumber, html) {
    switch (criticalFix.type) {
      case 'TEXT_SIZE':
        return {
          type: 'CRITICAL_TEXT',
          slideNumber,
          priority: 'critical',
          description: criticalFix.description,
          globalCss: `
/* Critical text size fixes for slide ${slideNumber} */
.reveal section:nth-child(${slideNumber}) p { 
  font-size: clamp(1.25rem, 2vw, 1.5rem) !important;
  line-height: 1.6 !important;
}
.reveal section:nth-child(${slideNumber}) h3 { 
  font-size: clamp(1.8rem, 3vw, 2.2rem) !important;
}
.reveal section:nth-child(${slideNumber}) li { 
  font-size: clamp(1.2rem, 2vw, 1.4rem) !important;
  margin-bottom: 0.8rem !important;
}
          `
        };
      
      default:
        return null;
    }
  }

  /**
   * Guess selector from CSS string
   */
  guessSelector(cssString, slideNumber) {
    // This is a simplified selector guesser
    // In production, we'd parse the HTML properly
    if (cssString.includes('h1')) return `.reveal section:nth-child(${slideNumber}) h1`;
    if (cssString.includes('h2')) return `.reveal section:nth-child(${slideNumber}) h2`;
    if (cssString.includes('h3')) return `.reveal section:nth-child(${slideNumber}) h3`;
    if (cssString.includes('p')) return `.reveal section:nth-child(${slideNumber}) p`;
    return `.reveal section:nth-child(${slideNumber})`;
  }

  /**
   * Apply fixes to the presentation
   */
  async applyFixes(presentationPath, fixes) {
    console.log(`\n🚀 Applying ${fixes.length} fixes to presentation...`);
    
    let html = await fs.readFile(presentationPath, 'utf-8');
    let cssAdditions = [];
    let appliedCount = 0;
    
    for (const fix of fixes) {
      console.log(`\n✏️  Applying ${fix.type} fix for slide ${fix.slideNumber}`);
      console.log(`   ${fix.description}`);
      
      switch (fix.type) {
        case 'TEXT_SIZE':
          if (fix.oldString && fix.newString) {
            const before = html.includes(fix.oldString);
            html = html.replace(fix.oldString, fix.newString);
            const after = html.includes(fix.newString);
            if (before && after) {
              appliedCount++;
              console.log(`   ✅ Replaced: ${fix.oldString} → ${fix.newString}`);
            }
          }
          break;
        
        case 'CRITICAL_TEXT':
        case 'MOBILE':
          if (fix.globalCss) {
            cssAdditions.push(fix.globalCss);
            appliedCount++;
          }
          break;
        
        case 'SPACING':
          if (fix.suggestions) {
            fix.suggestions.forEach(suggestion => {
              const regex = new RegExp(suggestion.find, 'g');
              const matches = html.match(regex);
              if (matches) {
                html = html.replace(regex, suggestion.replace);
                appliedCount++;
                console.log(`   ✅ Replaced ${matches.length} instances of ${suggestion.find}`);
              }
            });
          }
          break;
      }
    }
    
    // Add CSS additions before closing </style> tag
    if (cssAdditions.length > 0) {
      const cssBlock = `
        
        /* Automated fixes applied by Presentation Analyzer */
        ${cssAdditions.join('\n\n')}
      `;
      
      html = html.replace('</style>', cssBlock + '\n    </style>');
    }
    
    // Create backup
    const backupPath = presentationPath.replace('.html', `-backup-${Date.now()}.html`);
    await fs.copyFile(presentationPath, backupPath);
    console.log(`\n💾 Backup created: ${backupPath}`);
    
    // Write fixed version
    await fs.writeFile(presentationPath, html);
    console.log(`\n✅ Applied ${appliedCount} fixes successfully!`);
    
    return {
      appliedCount,
      backupPath,
      cssAdditions: cssAdditions.length
    };
  }

  /**
   * Generate fix report
   */
  generateFixReport(fixes) {
    const report = {
      totalFixes: fixes.length,
      byPriority: {
        critical: fixes.filter(f => f.priority === 'critical').length,
        high: fixes.filter(f => f.priority === 'high').length,
        medium: fixes.filter(f => f.priority === 'medium').length,
        low: fixes.filter(f => f.priority === 'low').length
      },
      byType: {},
      slides: {}
    };
    
    fixes.forEach(fix => {
      // Count by type
      if (!report.byType[fix.type]) {
        report.byType[fix.type] = 0;
      }
      report.byType[fix.type]++;
      
      // Group by slide
      if (!report.slides[fix.slideNumber]) {
        report.slides[fix.slideNumber] = [];
      }
      report.slides[fix.slideNumber].push({
        type: fix.type,
        priority: fix.priority,
        description: fix.description
      });
    });
    
    return report;
  }

  /**
   * Generate CSS fix file for manual review
   */
  async generateCssFixFile(fixes, outputPath) {
    const cssContent = [
      '/* Automated CSS Fixes for Presentation */',
      '/* Generated by Presentation Analyzer */',
      `/* Date: ${new Date().toISOString()} */`,
      '',
      '/* Apply these fixes to improve readability and accessibility */',
      ''
    ];
    
    // Group fixes by slide
    const fixesBySlide = {};
    fixes.forEach(fix => {
      if (!fixesBySlide[fix.slideNumber]) {
        fixesBySlide[fix.slideNumber] = [];
      }
      fixesBySlide[fix.slideNumber].push(fix);
    });
    
    // Generate CSS for each slide
    Object.entries(fixesBySlide).forEach(([slideNumber, slideFixes]) => {
      cssContent.push(`/* Slide ${slideNumber} Fixes */`);
      
      slideFixes.forEach(fix => {
        if (fix.globalCss) {
          cssContent.push(fix.globalCss);
        } else if (fix.css) {
          cssContent.push(`${fix.selector} {`);
          Object.entries(fix.css).forEach(([prop, value]) => {
            cssContent.push(`  ${prop}: ${value};`);
          });
          cssContent.push('}');
        }
      });
      
      cssContent.push('');
    });
    
    // Add responsive fixes
    cssContent.push('/* Global Responsive Improvements */');
    cssContent.push(`
@media (max-width: 768px) {
  .reveal .slides section {
    padding: 1rem !important;
  }
  
  .reveal h1 { font-size: clamp(2rem, 5vw, 3rem) !important; }
  .reveal h2 { font-size: clamp(1.75rem, 4vw, 2.5rem) !important; }
  .reveal h3 { font-size: clamp(1.5rem, 3.5vw, 2rem) !important; }
  .reveal p { font-size: clamp(1.1rem, 2.5vw, 1.4rem) !important; }
  
  .grid, .asymmetric-grid {
    grid-template-columns: 1fr !important;
    gap: 1rem !important;
  }
}
    `);
    
    await fs.writeFile(outputPath, cssContent.join('\n'));
    console.log(`\n📄 CSS fix file generated: ${outputPath}`);
  }
}

module.exports = PresentationFixGenerator;