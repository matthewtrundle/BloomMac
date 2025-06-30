#!/usr/bin/env node

/**
 * VISUAL-BASED EXPERT PANEL
 * Analyzes actual screenshots instead of HTML
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

class VisualExpertPanel {
  constructor() {
    this.experts = [
      {
        name: "Visual QA Expert",
        focus: "Text readability and contrast",
        checkScreenshot: async (screenshotPath, slideNum) => {
          const issues = [];
          
          // This is where we'd use AI vision to analyze the screenshot
          // For now, we'll create a manual review process
          
          issues.push({
            type: 'manual-review',
            severity: 'info',
            message: `Review screenshot at: ${screenshotPath}`,
            checkFor: [
              'White text on white background',
              'Black text on black background', 
              'Text cut off or overflowing',
              'Cards not aligned properly',
              'Text too small to read',
              'Images covering text'
            ]
          });
          
          return issues;
        }
      },
      {
        name: "Layout Inspector", 
        focus: "Card alignment and spacing",
        checkScreenshot: async (screenshotPath, slideNum) => {
          const issues = [];
          
          issues.push({
            type: 'manual-review',
            severity: 'info',
            message: `Check layout in: ${screenshotPath}`,
            checkFor: [
              'Cards overlapping',
              'Uneven spacing between cards',
              'Cards going off screen',
              'Content not centered',
              'Inconsistent margins'
            ]
          });
          
          return issues;
        }
      }
    ];
  }

  async analyzePresentation(presentationPath) {
    console.log(`\n🔍 VISUAL-BASED EXPERT PANEL ANALYSIS\n`);
    
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 });

      const fileUrl = `file://${path.resolve(presentationPath)}`;
      await page.goto(fileUrl, { waitUntil: 'networkidle0' });

      // Wait for Reveal.js
      await page.waitForFunction(() => window.Reveal, { timeout: 10000 });
      await page.evaluate(() => {
        Reveal.configure({ 
          transition: 'none',
          controls: false,
          progress: false
        });
      });

      const totalSlides = await page.evaluate(() => Reveal.getTotalSlides());
      console.log(`📊 Found ${totalSlides} slides to analyze\n`);

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const outputDir = path.join('analysis', 'visual-review', timestamp);
      await fs.mkdir(outputDir, { recursive: true });

      const allIssues = [];

      // Capture and analyze each slide
      for (let i = 0; i < totalSlides; i++) {
        await page.evaluate(slideIndex => Reveal.slide(slideIndex), i);
        await page.waitForTimeout(500);

        const screenshotPath = path.join(outputDir, `slide-${i + 1}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: false });
        console.log(`📸 Captured slide ${i + 1}/${totalSlides}`);

        // Run visual analysis
        const slideIssues = [];
        for (const expert of this.experts) {
          const issues = await expert.checkScreenshot(screenshotPath, i + 1);
          if (issues.length > 0) {
            slideIssues.push({
              expert: expert.name,
              focus: expert.focus,
              issues
            });
          }
        }

        if (slideIssues.length > 0) {
          allIssues.push({
            slideNumber: i + 1,
            screenshot: screenshotPath,
            issues: slideIssues
          });
        }
      }

      // Generate visual review HTML
      await this.generateVisualReport(outputDir, allIssues, totalSlides);

      console.log(`\n✅ Visual analysis complete!`);
      console.log(`📁 Screenshots saved to: ${outputDir}`);
      console.log(`📄 Open the report: file://${path.resolve(outputDir, 'visual-review.html')}\n`);

    } finally {
      await browser.close();
    }
  }

  async generateVisualReport(outputDir, allIssues, totalSlides) {
    const html = `<!DOCTYPE html>
<html>
<head>
    <title>Visual Expert Panel Review</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        h1 { color: #333; margin-bottom: 30px; }
        .slide-review {
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .slide-header {
            display: flex;
            align-items: center;
            gap: 20px;
            margin-bottom: 20px;
        }
        .slide-number {
            font-size: 24px;
            font-weight: bold;
            color: #666;
        }
        .screenshot {
            width: 100%;
            max-width: 800px;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin: 20px 0;
        }
        .checklist {
            background: #f8f9fa;
            border-left: 4px solid #17a2b8;
            padding: 15px;
            margin: 10px 0;
        }
        .checklist h3 {
            margin: 0 0 10px 0;
            color: #17a2b8;
        }
        .checklist ul {
            margin: 0;
            padding-left: 20px;
        }
        .checklist li {
            margin: 5px 0;
        }
        .manual-check {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 5px 0;
        }
        .manual-check input[type="checkbox"] {
            width: 20px;
            height: 20px;
        }
        .summary {
            background: #28a745;
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .instructions {
            background: #ffc107;
            color: #000;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
    </style>
</head>
<body>
    <h1>🔍 Visual Expert Panel Review</h1>
    
    <div class="instructions">
        <h2>📋 How to use this review:</h2>
        <ol>
            <li>Look at each screenshot carefully</li>
            <li>Check for the issues listed in each checklist</li>
            <li>Mark the checkbox if you find the issue</li>
            <li>Add notes about specific problems you see</li>
        </ol>
    </div>
    
    <div class="summary">
        <h2>📊 Summary</h2>
        <p>Total slides: ${totalSlides}</p>
        <p>Slides requiring review: ${allIssues.length}</p>
    </div>
`;

    // Add each slide for review
    for (let i = 0; i < totalSlides; i++) {
      const slideNum = i + 1;
      const slideIssue = allIssues.find(issue => issue.slideNumber === slideNum);
      
      const slideHtml = `
    <div class="slide-review">
        <div class="slide-header">
            <span class="slide-number">Slide ${slideNum}</span>
        </div>
        <img src="slide-${slideNum}.png" class="screenshot" alt="Slide ${slideNum}">
        
        <div class="checklist">
            <h3>🎨 Visual Quality Checklist</h3>
            <div class="manual-check">
                <input type="checkbox" id="slide${slideNum}-contrast">
                <label for="slide${slideNum}-contrast">❌ Text has poor contrast (white on white, dark on dark)</label>
            </div>
            <div class="manual-check">
                <input type="checkbox" id="slide${slideNum}-cutoff">
                <label for="slide${slideNum}-cutoff">❌ Text is cut off or goes off screen</label>
            </div>
            <div class="manual-check">
                <input type="checkbox" id="slide${slideNum}-cards">
                <label for="slide${slideNum}-cards">❌ Cards are misaligned or overlapping</label>
            </div>
            <div class="manual-check">
                <input type="checkbox" id="slide${slideNum}-small">
                <label for="slide${slideNum}-small">❌ Text is too small to read</label>
            </div>
            <div class="manual-check">
                <input type="checkbox" id="slide${slideNum}-spacing">
                <label for="slide${slideNum}-spacing">❌ Poor spacing or layout issues</label>
            </div>
        </div>
        
        <div style="margin-top: 20px;">
            <label><strong>Notes for Slide ${slideNum}:</strong></label>
            <textarea id="notes-slide${slideNum}" rows="3" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;" 
                placeholder="Describe any specific issues you see..."></textarea>
        </div>
    </div>
`;
      
      html += slideHtml;
    }

    html += `
    <div style="margin-top: 40px; text-align: center;">
        <button onclick="generateReport()" style="background: #007bff; color: white; padding: 15px 30px; border: none; border-radius: 5px; font-size: 18px; cursor: pointer;">
            Generate Issue Report
        </button>
    </div>

    <script>
        function generateReport() {
            const issues = [];
            for (let i = 1; i <= ${totalSlides}; i++) {
                const slideIssues = [];
                
                if (document.getElementById(\`slide\${i}-contrast\`).checked) {
                    slideIssues.push('Poor text contrast');
                }
                if (document.getElementById(\`slide\${i}-cutoff\`).checked) {
                    slideIssues.push('Text cut off');
                }
                if (document.getElementById(\`slide\${i}-cards\`).checked) {
                    slideIssues.push('Card alignment issues');
                }
                if (document.getElementById(\`slide\${i}-small\`).checked) {
                    slideIssues.push('Text too small');
                }
                if (document.getElementById(\`slide\${i}-spacing\`).checked) {
                    slideIssues.push('Layout/spacing issues');
                }
                
                const notes = document.getElementById(\`notes-slide\${i}\`).value;
                
                if (slideIssues.length > 0 || notes) {
                    issues.push({
                        slide: i,
                        problems: slideIssues,
                        notes: notes
                    });
                }
            }
            
            console.log('Issues found:', issues);
            alert('Report generated! Check console for issues. Total issues: ' + issues.length);
        }
    </script>
</body>
</html>`;

    await fs.writeFile(path.join(outputDir, 'visual-review.html'), html);
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🔍 Visual-Based Expert Panel

This tool captures screenshots and creates a visual review checklist.

Usage:
  node scripts/visual-based-expert-panel.js "week1 lesson1"
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
    
    const panel = new VisualExpertPanel();
    await panel.analyzePresentation(presentationPath);
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { VisualExpertPanel };