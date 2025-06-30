#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { PresentationAnalyzer } = require('./analyze-presentations');

class PresentationHealthDashboard {
  constructor() {
    this.analyzer = new PresentationAnalyzer();
    this.dashboardDir = path.join(process.cwd(), 'analysis', 'dashboard');
    this.data = {
      presentations: [],
      summary: {},
      trends: [],
      lastUpdated: null
    };
  }

  async init() {
    await fs.mkdir(this.dashboardDir, { recursive: true });
    await this.loadExistingData();
  }

  async loadExistingData() {
    try {
      const dataPath = path.join(this.dashboardDir, 'health-data.json');
      const data = await fs.readFile(dataPath, 'utf-8');
      this.data = JSON.parse(data);
    } catch (error) {
      console.log('📊 No existing health data found, starting fresh');
    }
  }

  async scanAllPresentations() {
    console.log('\n🔍 Scanning all presentations...');
    
    const presentationPaths = await this.findAllPresentations();
    console.log(`📁 Found ${presentationPaths.length} presentations to analyze\n`);
    
    await this.analyzer.init();
    
    try {
      for (const presentationPath of presentationPaths) {
        console.log(`\n📊 Analyzing: ${presentationPath}`);
        
        // Skip if recently analyzed (within 24 hours)
        const existing = this.data.presentations.find(p => p.path === presentationPath);
        if (existing && this.isRecent(existing.analyzedAt)) {
          console.log('   ⏭️  Recently analyzed, skipping...');
          continue;
        }
        
        // Analyze presentation
        const screenshots = await this.analyzer.captureSlides(presentationPath);
        const analyses = [];
        
        for (const screenshot of screenshots) {
          const analysis = await this.analyzer.analyzeSlide(screenshot, '');
          analyses.push(analysis);
        }
        
        const report = await this.analyzer.generateReport(presentationPath, analyses);
        
        // Update data
        this.updatePresentationData(presentationPath, report);
      }
      
      // Generate summary and trends
      this.generateSummary();
      this.calculateTrends();
      
      // Save data
      await this.saveData();
      
      // Generate dashboard
      await this.generateDashboard();
      
    } finally {
      await this.analyzer.cleanup();
    }
  }

  async findAllPresentations() {
    // In a real implementation, this would scan the file system
    // For now, return a mock list
    return [
      '/bloom-course-content/weeks/week-1-foundation/lesson-1-welcome/presentation-animated-complete.html',
      '/bloom-course-content/weeks/week-1-foundation/lesson-2-normal-vs-concern/presentation.html',
      '/bloom-course-content/weeks/week-1-foundation/lesson-3-hormones/presentation.html'
    ];
  }

  isRecent(timestamp, hoursThreshold = 24) {
    const analyzedTime = new Date(timestamp).getTime();
    const now = Date.now();
    const hoursSince = (now - analyzedTime) / (1000 * 60 * 60);
    return hoursSince < hoursThreshold;
  }

  updatePresentationData(presentationPath, report) {
    const existingIndex = this.data.presentations.findIndex(p => p.path === presentationPath);
    
    const presentationData = {
      path: presentationPath,
      name: this.extractPresentationName(presentationPath),
      week: this.extractWeek(presentationPath),
      lesson: this.extractLesson(presentationPath),
      analyzedAt: new Date().toISOString(),
      score: report.summary.averageScore,
      slideCount: report.slideCount,
      issues: {
        critical: report.summary.criticalIssuesCount,
        total: Object.values(report.summary.commonIssues).reduce((a, b) => a + b, 0),
        byType: report.summary.commonIssues
      },
      scores: {
        lowest: report.summary.lowestScore,
        highest: report.summary.highestScore,
        average: report.summary.averageScore
      },
      needsWork: report.summary.averageScore < 85,
      improvements: []
    };
    
    if (existingIndex >= 0) {
      // Track improvements
      const oldScore = this.data.presentations[existingIndex].score;
      if (oldScore !== presentationData.score) {
        presentationData.improvements.push({
          date: new Date().toISOString(),
          oldScore,
          newScore: presentationData.score,
          change: presentationData.score - oldScore
        });
      }
      this.data.presentations[existingIndex] = presentationData;
    } else {
      this.data.presentations.push(presentationData);
    }
  }

  extractPresentationName(path) {
    const parts = path.split('/');
    return parts[parts.length - 1].replace('.html', '');
  }

  extractWeek(path) {
    const match = path.match(/week-(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  extractLesson(path) {
    const match = path.match(/lesson-(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  generateSummary() {
    const presentations = this.data.presentations;
    
    this.data.summary = {
      totalPresentations: presentations.length,
      averageScore: Math.round(
        presentations.reduce((sum, p) => sum + p.score, 0) / presentations.length
      ),
      presentationsNeedingWork: presentations.filter(p => p.needsWork).length,
      totalCriticalIssues: presentations.reduce((sum, p) => sum + p.issues.critical, 0),
      byWeek: {},
      byIssueType: {},
      scoreDistribution: {
        excellent: presentations.filter(p => p.score >= 90).length,
        good: presentations.filter(p => p.score >= 80 && p.score < 90).length,
        needsWork: presentations.filter(p => p.score >= 70 && p.score < 80).length,
        poor: presentations.filter(p => p.score < 70).length
      }
    };
    
    // Group by week
    presentations.forEach(p => {
      if (!this.data.summary.byWeek[p.week]) {
        this.data.summary.byWeek[p.week] = {
          presentations: 0,
          averageScore: 0,
          scores: []
        };
      }
      this.data.summary.byWeek[p.week].presentations++;
      this.data.summary.byWeek[p.week].scores.push(p.score);
    });
    
    // Calculate week averages
    Object.keys(this.data.summary.byWeek).forEach(week => {
      const weekData = this.data.summary.byWeek[week];
      weekData.averageScore = Math.round(
        weekData.scores.reduce((a, b) => a + b, 0) / weekData.scores.length
      );
    });
    
    // Aggregate issue types
    presentations.forEach(p => {
      Object.entries(p.issues.byType).forEach(([type, count]) => {
        if (!this.data.summary.byIssueType[type]) {
          this.data.summary.byIssueType[type] = 0;
        }
        this.data.summary.byIssueType[type] += count;
      });
    });
    
    this.data.lastUpdated = new Date().toISOString();
  }

  calculateTrends() {
    // Track score trends over time
    const now = new Date();
    const trendEntry = {
      date: now.toISOString(),
      averageScore: this.data.summary.averageScore,
      presentationsAnalyzed: this.data.summary.totalPresentations,
      criticalIssues: this.data.summary.totalCriticalIssues
    };
    
    this.data.trends.push(trendEntry);
    
    // Keep only last 30 days of trends
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    this.data.trends = this.data.trends.filter(t => 
      new Date(t.date) > thirtyDaysAgo
    );
  }

  async saveData() {
    const dataPath = path.join(this.dashboardDir, 'health-data.json');
    await fs.writeFile(dataPath, JSON.stringify(this.data, null, 2));
    console.log(`\n💾 Health data saved`);
  }

  async generateDashboard() {
    const dashboardHtml = this.generateDashboardHtml();
    const dashboardPath = path.join(this.dashboardDir, 'index.html');
    await fs.writeFile(dashboardPath, dashboardHtml);
    
    console.log(`\n🎯 Dashboard generated: ${dashboardPath}`);
    console.log(`\n📊 Health Summary:`);
    console.log(`   Total Presentations: ${this.data.summary.totalPresentations}`);
    console.log(`   Average Score: ${this.data.summary.averageScore}%`);
    console.log(`   Needing Work: ${this.data.summary.presentationsNeedingWork}`);
    console.log(`   Critical Issues: ${this.data.summary.totalCriticalIssues}`);
  }

  generateDashboardHtml() {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Presentation Health Dashboard | Bloom Psychology</title>
    <style>
        :root {
            --bloom-sage: #8B9A82;
            --bloom-coral: #FF6B6B;
            --bloom-peach: #FFB4A2;
            --bloom-golden: #FFCB77;
            --bloom-mint: #95E1D3;
            --bloom-lavender: #C589E8;
            --bloom-sky: #74C0FC;
        }
        
        * { box-sizing: border-box; }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background: #f8f9fa;
        }
        
        .dashboard {
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .header {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            margin-bottom: 2rem;
        }
        
        h1 {
            margin: 0 0 0.5rem 0;
            color: #1a1a1a;
            font-size: 2.5rem;
        }
        
        .subtitle {
            color: #666;
            font-size: 1.1rem;
        }
        
        .last-updated {
            color: var(--bloom-sage);
            font-size: 0.9rem;
            margin-top: 1rem;
        }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 3rem;
        }
        
        .metric-card {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .metric-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: var(--bloom-coral);
        }
        
        .metric-card.good::before { background: var(--bloom-mint); }
        .metric-card.warning::before { background: var(--bloom-golden); }
        .metric-card.critical::before { background: var(--bloom-coral); }
        
        .metric-value {
            font-size: 3rem;
            font-weight: bold;
            margin: 0;
            line-height: 1;
        }
        
        .metric-label {
            color: #666;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 0.5rem;
        }
        
        .section {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            margin-bottom: 2rem;
        }
        
        .section-title {
            font-size: 1.5rem;
            margin: 0 0 1.5rem 0;
            color: #1a1a1a;
        }
        
        .presentations-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .presentations-table th,
        .presentations-table td {
            text-align: left;
            padding: 1rem;
            border-bottom: 1px solid #eee;
        }
        
        .presentations-table th {
            font-weight: 600;
            color: #666;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .score-badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-weight: 600;
            font-size: 0.9rem;
        }
        
        .score-excellent { background: #d4f4dd; color: #22c55e; }
        .score-good { background: #e0f2fe; color: #0ea5e9; }
        .score-warning { background: #fef3c7; color: #f59e0b; }
        .score-poor { background: #fee2e2; color: #ef4444; }
        
        .chart-container {
            height: 300px;
            margin: 2rem 0;
            display: flex;
            align-items: flex-end;
            justify-content: space-around;
            border: 1px solid #eee;
            padding: 2rem;
            border-radius: 8px;
        }
        
        .bar {
            width: 60px;
            background: var(--bloom-sky);
            border-radius: 4px 4px 0 0;
            position: relative;
            transition: all 0.3s ease;
        }
        
        .bar:hover {
            background: var(--bloom-coral);
            transform: translateY(-5px);
        }
        
        .bar-label {
            position: absolute;
            bottom: -25px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 0.8rem;
            color: #666;
        }
        
        .bar-value {
            position: absolute;
            top: -25px;
            left: 50%;
            transform: translateX(-50%);
            font-weight: 600;
            color: #333;
        }
        
        .issues-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        }
        
        .issue-type {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 8px;
            border-left: 4px solid var(--bloom-coral);
        }
        
        .issue-type-name {
            font-weight: 600;
            color: #333;
            margin-bottom: 0.25rem;
        }
        
        .issue-type-count {
            color: #666;
            font-size: 0.9rem;
        }
        
        .trends-chart {
            margin-top: 2rem;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 8px;
            min-height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #666;
        }
        
        @media (max-width: 768px) {
            .metrics-grid {
                grid-template-columns: 1fr;
            }
            
            .dashboard {
                padding: 1rem;
            }
        }
    </style>
</head>
<body>
    <div class="dashboard">
        <div class="header">
            <h1>📊 Presentation Health Dashboard</h1>
            <p class="subtitle">Monitor and improve the quality of all course presentations</p>
            <p class="last-updated">Last updated: ${new Date(this.data.lastUpdated).toLocaleString()}</p>
        </div>
        
        <div class="metrics-grid">
            <div class="metric-card ${this.data.summary.averageScore >= 85 ? 'good' : this.data.summary.averageScore >= 70 ? 'warning' : 'critical'}">
                <p class="metric-value">${this.data.summary.averageScore}%</p>
                <p class="metric-label">Average Score</p>
            </div>
            
            <div class="metric-card">
                <p class="metric-value">${this.data.summary.totalPresentations}</p>
                <p class="metric-label">Total Presentations</p>
            </div>
            
            <div class="metric-card ${this.data.summary.presentationsNeedingWork === 0 ? 'good' : 'warning'}">
                <p class="metric-value">${this.data.summary.presentationsNeedingWork}</p>
                <p class="metric-label">Need Improvement</p>
            </div>
            
            <div class="metric-card ${this.data.summary.totalCriticalIssues === 0 ? 'good' : 'critical'}">
                <p class="metric-value">${this.data.summary.totalCriticalIssues}</p>
                <p class="metric-label">Critical Issues</p>
            </div>
        </div>
        
        <div class="section">
            <h2 class="section-title">📈 Score Distribution</h2>
            <div class="chart-container">
                <div class="bar" style="height: ${this.data.summary.scoreDistribution.excellent * 20}px">
                    <span class="bar-value">${this.data.summary.scoreDistribution.excellent}</span>
                    <span class="bar-label">90-100%</span>
                </div>
                <div class="bar" style="height: ${this.data.summary.scoreDistribution.good * 20}px">
                    <span class="bar-value">${this.data.summary.scoreDistribution.good}</span>
                    <span class="bar-label">80-89%</span>
                </div>
                <div class="bar" style="height: ${this.data.summary.scoreDistribution.needsWork * 20}px">
                    <span class="bar-value">${this.data.summary.scoreDistribution.needsWork}</span>
                    <span class="bar-label">70-79%</span>
                </div>
                <div class="bar" style="height: ${Math.max(this.data.summary.scoreDistribution.poor * 20, 10)}px">
                    <span class="bar-value">${this.data.summary.scoreDistribution.poor}</span>
                    <span class="bar-label">&lt;70%</span>
                </div>
            </div>
        </div>
        
        <div class="section">
            <h2 class="section-title">🎯 Presentations Overview</h2>
            <table class="presentations-table">
                <thead>
                    <tr>
                        <th>Presentation</th>
                        <th>Week</th>
                        <th>Lesson</th>
                        <th>Score</th>
                        <th>Issues</th>
                        <th>Last Analyzed</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.data.presentations.map(p => `
                        <tr>
                            <td><strong>${p.name}</strong></td>
                            <td>Week ${p.week}</td>
                            <td>Lesson ${p.lesson}</td>
                            <td>
                                <span class="score-badge ${
                                    p.score >= 90 ? 'score-excellent' :
                                    p.score >= 80 ? 'score-good' :
                                    p.score >= 70 ? 'score-warning' :
                                    'score-poor'
                                }">${p.score}%</span>
                            </td>
                            <td>${p.issues.total} (${p.issues.critical} critical)</td>
                            <td>${new Date(p.analyzedAt).toLocaleDateString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="section">
            <h2 class="section-title">⚠️ Common Issues</h2>
            <div class="issues-grid">
                ${Object.entries(this.data.summary.byIssueType)
                    .sort((a, b) => b[1] - a[1])
                    .map(([type, count]) => `
                        <div class="issue-type">
                            <div class="issue-type-name">${type.replace(/_/g, ' ')}</div>
                            <div class="issue-type-count">${count} occurrences</div>
                        </div>
                    `).join('')}
            </div>
        </div>
        
        <div class="section">
            <h2 class="section-title">📊 Trends</h2>
            <div class="trends-chart">
                ${this.data.trends.length > 1 
                    ? 'Trend visualization would go here' 
                    : 'Not enough data for trends yet. Check back after multiple analyses.'}
            </div>
        </div>
    </div>
</body>
</html>`;
  }
}

// CLI interface
async function main() {
  const dashboard = new PresentationHealthDashboard();
  
  console.log(`
📊 Presentation Health Dashboard
================================
`);
  
  try {
    await dashboard.init();
    await dashboard.scanAllPresentations();
    
    console.log(`\n✅ Dashboard generation complete!`);
    console.log(`\n📍 View your dashboard at:`);
    console.log(`   ${path.join(dashboard.dashboardDir, 'index.html')}`);
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = PresentationHealthDashboard;