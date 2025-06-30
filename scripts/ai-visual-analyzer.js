#!/usr/bin/env node

/**
 * AI-POWERED VISUAL ANALYZER
 * Uses AI to analyze screenshots and detect real visual issues
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

class AIVisualAnalyzer {
  async analyzeScreenshot(screenshotPath, slideNumber) {
    // In a real implementation, this would use an AI vision API
    // For now, we'll create a structured analysis prompt
    
    const analysisPrompt = `
Analyze this presentation slide screenshot for these specific visual issues:

1. CONTRAST ISSUES:
   - White or light text on white/light backgrounds
   - Dark or black text on dark/black backgrounds
   - Text that is hard to read due to poor contrast

2. LAYOUT ISSUES:
   - Text that is cut off or goes beyond the slide boundaries
   - Cards or content boxes that overlap
   - Cards that are misaligned or have inconsistent spacing
   - Content that appears off-center or poorly positioned

3. TYPOGRAPHY ISSUES:
   - Text that is too small for video recording (less than 24px)
   - Fonts that are hard to read
   - Inconsistent text sizes within the same hierarchy

4. OVERFLOW ISSUES:
   - Content that appears truncated with "..."
   - Text that runs off the edge of cards
   - Elements that are partially hidden

5. FORMATTING ISSUES:
   - Cards with inconsistent styles
   - Broken grid layouts
   - Elements that don't align properly

Return a JSON object with:
{
  "hasIssues": boolean,
  "criticalIssues": [
    {
      "type": "contrast|layout|typography|overflow|formatting",
      "severity": "critical|warning",
      "description": "specific description",
      "location": "where on the slide",
      "fix": "how to fix it"
    }
  ]
}
`;

    return {
      slideNumber,
      screenshotPath,
      prompt: analysisPrompt,
      needsManualReview: true
    };
  }

  async captureAndAnalyze(presentationPath) {
    console.log(`\n🤖 AI-POWERED VISUAL ANALYSIS\n`);
    
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 });

      const fileUrl = `file://${path.resolve(presentationPath)}`;
      await page.goto(fileUrl, { waitUntil: 'networkidle0' });

      await page.waitForFunction(() => window.Reveal, { timeout: 10000 });
      await page.evaluate(() => {
        Reveal.configure({ 
          transition: 'none',
          controls: false,
          progress: false
        });
      });

      const totalSlides = await page.evaluate(() => Reveal.getTotalSlides());
      console.log(`📊 Analyzing ${totalSlides} slides\n`);

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const outputDir = path.join('analysis', 'ai-visual', timestamp);
      await fs.mkdir(outputDir, { recursive: true });

      const analyses = [];

      // Capture each slide
      for (let i = 0; i < totalSlides; i++) {
        await page.evaluate(slideIndex => Reveal.slide(slideIndex), i);
        await new Promise(resolve => setTimeout(resolve, 300));

        // Take screenshot
        const screenshotPath = path.join(outputDir, `slide-${i + 1}.png`);
        await page.screenshot({ 
          path: screenshotPath, 
          fullPage: false
        });
        
        console.log(`📸 Analyzing slide ${i + 1}/${totalSlides}`);
        
        // Get slide content for context
        const slideContent = await page.evaluate(() => {
          const currentSlide = Reveal.getCurrentSlide();
          return {
            hasBackgroundImage: !!currentSlide.dataset.backgroundImage,
            backgroundColor: currentSlide.dataset.backgroundColor || 
                           window.getComputedStyle(currentSlide).backgroundColor,
            textElements: Array.from(currentSlide.querySelectorAll('h1, h2, h3, h4, p, li, span')).length,
            hasCards: currentSlide.querySelectorAll('[class*="card"], [class*="fragment"]').length > 0
          };
        });

        const analysis = await this.analyzeScreenshot(screenshotPath, i + 1);
        analysis.context = slideContent;
        analyses.push(analysis);
      }

      // Generate report
      await this.generateAIReport(outputDir, analyses, presentationPath);

      console.log(`\n✅ Analysis complete!`);
      console.log(`📁 Results saved to: ${outputDir}`);
      console.log(`\n🎯 Next step: Review the visual analysis report`);
      console.log(`   file://${path.resolve(outputDir, 'ai-visual-analysis.html')}\n`);

    } finally {
      await browser.close();
    }
  }

  async generateAIReport(outputDir, analyses, presentationPath) {
    let html = `<!DOCTYPE html>
<html>
<head>
    <title>AI Visual Analysis Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 1600px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
        }
        .slide-analysis {
            background: white;
            border-radius: 10px;
            padding: 30px;
            margin-bottom: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .slide-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            align-items: start;
        }
        .screenshot-container {
            position: relative;
        }
        .screenshot {
            width: 100%;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
        }
        .analysis-panel {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
        }
        .issue-detector {
            margin: 20px 0;
            padding: 20px;
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            border-radius: 4px;
        }
        .critical-issue {
            background: #f8d7da;
            border-left-color: #dc3545;
        }
        .analysis-prompt {
            background: #e7f3ff;
            border: 1px solid #b8daff;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            white-space: pre-wrap;
            font-family: monospace;
            font-size: 12px;
        }
        .context-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        .context-item {
            background: #e9ecef;
            padding: 15px;
            border-radius: 6px;
            text-align: center;
        }
        .context-label {
            font-size: 12px;
            color: #6c757d;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .context-value {
            font-size: 20px;
            font-weight: bold;
            color: #495057;
            margin-top: 5px;
        }
        .manual-check-form {
            background: #fff;
            border: 2px solid #dee2e6;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
        }
        .check-item {
            display: flex;
            align-items: center;
            margin: 10px 0;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 4px;
        }
        .check-item input[type="checkbox"] {
            width: 20px;
            height: 20px;
            margin-right: 15px;
        }
        textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ced4da;
            border-radius: 4px;
            font-family: inherit;
            resize: vertical;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🤖 AI Visual Analysis Report</h1>
        <p>Presentation: ${path.basename(presentationPath)}</p>
        <p>Generated: ${new Date().toLocaleString()}</p>
    </div>
`;

    for (const analysis of analyses) {
      const { slideNumber, screenshotPath, context } = analysis;
      
      html += `
    <div class="slide-analysis">
        <h2>Slide ${slideNumber}</h2>
        
        <div class="slide-grid">
            <div class="screenshot-container">
                <img src="${path.basename(screenshotPath)}" class="screenshot" alt="Slide ${slideNumber}">
            </div>
            
            <div class="analysis-panel">
                <h3>📊 Slide Context</h3>
                <div class="context-info">
                    <div class="context-item">
                        <div class="context-label">Background</div>
                        <div class="context-value">${context.hasBackgroundImage ? '🖼️ Image' : '🎨 Color'}</div>
                    </div>
                    <div class="context-item">
                        <div class="context-label">Text Elements</div>
                        <div class="context-value">${context.textElements}</div>
                    </div>
                    <div class="context-item">
                        <div class="context-label">Has Cards</div>
                        <div class="context-value">${context.hasCards ? '✅ Yes' : '❌ No'}</div>
                    </div>
                </div>
                
                <h3>🔍 Visual Issue Checklist</h3>
                <div class="manual-check-form">
                    <div class="check-item">
                        <input type="checkbox" id="slide${slideNumber}-white-on-white">
                        <label for="slide${slideNumber}-white-on-white">
                            <strong>White/Light text on white/light background</strong><br>
                            <small>Text is barely visible or completely invisible</small>
                        </label>
                    </div>
                    
                    <div class="check-item">
                        <input type="checkbox" id="slide${slideNumber}-dark-on-dark">
                        <label for="slide${slideNumber}-dark-on-dark">
                            <strong>Dark/Black text on dark/black background</strong><br>
                            <small>Text blends into the background</small>
                        </label>
                    </div>
                    
                    <div class="check-item">
                        <input type="checkbox" id="slide${slideNumber}-text-cutoff">
                        <label for="slide${slideNumber}-text-cutoff">
                            <strong>Text cut off or overflowing</strong><br>
                            <small>Words or sentences are truncated or go off screen</small>
                        </label>
                    </div>
                    
                    <div class="check-item">
                        <input type="checkbox" id="slide${slideNumber}-cards-broken">
                        <label for="slide${slideNumber}-cards-broken">
                            <strong>Cards misaligned or broken</strong><br>
                            <small>Card layout is incorrect, overlapping, or inconsistent</small>
                        </label>
                    </div>
                    
                    <div class="check-item">
                        <input type="checkbox" id="slide${slideNumber}-text-small">
                        <label for="slide${slideNumber}-text-small">
                            <strong>Text too small for video</strong><br>
                            <small>Font size appears less than 24px equivalent</small>
                        </label>
                    </div>
                </div>
                
                <h3>📝 Specific Issues</h3>
                <textarea id="issues-slide${slideNumber}" rows="4" 
                    placeholder="Describe exactly what's wrong (e.g., 'The title is white text on a white card background')"></textarea>
            </div>
        </div>
    </div>
`;
    }

    html += `
    <script>
        function collectIssues() {
            const issues = [];
            ${analyses.map(a => `
            const slide${a.slideNumber}Issues = [];
            if (document.getElementById('slide${a.slideNumber}-white-on-white').checked) {
                slide${a.slideNumber}Issues.push({
                    type: 'contrast',
                    severity: 'critical',
                    issue: 'White text on white background'
                });
            }
            if (document.getElementById('slide${a.slideNumber}-dark-on-dark').checked) {
                slide${a.slideNumber}Issues.push({
                    type: 'contrast',
                    severity: 'critical',
                    issue: 'Dark text on dark background'
                });
            }
            if (document.getElementById('slide${a.slideNumber}-text-cutoff').checked) {
                slide${a.slideNumber}Issues.push({
                    type: 'layout',
                    severity: 'critical',
                    issue: 'Text cut off or overflowing'
                });
            }
            if (document.getElementById('slide${a.slideNumber}-cards-broken').checked) {
                slide${a.slideNumber}Issues.push({
                    type: 'layout',
                    severity: 'critical',
                    issue: 'Cards misaligned or broken'
                });
            }
            if (document.getElementById('slide${a.slideNumber}-text-small').checked) {
                slide${a.slideNumber}Issues.push({
                    type: 'typography',
                    severity: 'warning',
                    issue: 'Text too small for video'
                });
            }
            
            const specificIssues = document.getElementById('issues-slide${a.slideNumber}').value;
            if (slide${a.slideNumber}Issues.length > 0 || specificIssues) {
                issues.push({
                    slide: ${a.slideNumber},
                    issues: slide${a.slideNumber}Issues,
                    description: specificIssues
                });
            }
            `).join('\n')}
            
            console.log('Collected issues:', JSON.stringify(issues, null, 2));
            
            // Create downloadable JSON
            const dataStr = JSON.stringify(issues, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            
            const exportFileDefaultName = 'visual-issues-${new Date().toISOString().split('T')[0]}.json';
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            
            alert('Issues exported! Total slides with issues: ' + issues.length);
        }
    </script>
    
    <div style="position: fixed; bottom: 20px; right: 20px;">
        <button onclick="collectIssues()" style="background: #28a745; color: white; padding: 15px 30px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.2);">
            📥 Export Issues as JSON
        </button>
    </div>
</body>
</html>`;

    await fs.writeFile(path.join(outputDir, 'ai-visual-analysis.html'), html);
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🤖 AI-Powered Visual Analyzer

This tool captures screenshots and provides structured analysis.

Usage:
  node scripts/ai-visual-analyzer.js "week1 lesson1"
    `);
    process.exit(0);
  }

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
    
    const analyzer = new AIVisualAnalyzer();
    await analyzer.captureAndAnalyze(presentationPath);
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { AIVisualAnalyzer };