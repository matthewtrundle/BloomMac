#!/usr/bin/env node

/**
 * DIAGNOSE SLIDE 8 ISSUE
 * Figure out what the expert is actually seeing
 */

const fs = require('fs').promises;
const path = require('path');

async function diagnose(presentationPath) {
  console.log(`\n🔍 DIAGNOSING SLIDE 8 ISSUE\n`);

  const html = await fs.readFile(presentationPath, 'utf-8');
  
  // Find all sections
  const sections = html.match(/<section[^>]*>[\s\S]*?<\/section>/g) || [];
  
  console.log(`Found ${sections.length} slides total\n`);
  
  // Check slide 8 specifically
  if (sections.length >= 8) {
    const slide8 = sections[7]; // 0-indexed
    
    console.log(`SLIDE 8 ANALYSIS:`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    
    // Check background
    const bgMatch = slide8.match(/data-background-(\w+)="([^"]+)"/);
    if (bgMatch) {
      console.log(`Background type: ${bgMatch[1]}`);
      console.log(`Background value: ${bgMatch[2]}\n`);
    }
    
    // Check for dark backgrounds
    if (slide8.includes('background-color="#1a1a1a"') || 
        slide8.includes('background-gradient') ||
        slide8.includes('rgba(0,0,0') ||
        slide8.includes('linear-gradient')) {
      console.log(`⚠️  DARK BACKGROUND DETECTED!\n`);
    }
    
    // Check text colors
    const colorMatches = slide8.match(/color:\s*([^;}"]+)/g) || [];
    console.log(`Text colors found:`);
    colorMatches.forEach(color => {
      console.log(`  - ${color}`);
    });
    
    // Check for specific dark text issues
    const darkTextPattern = /color:\s*(#[0-5][0-9a-fA-F]{5}|#[0-5][0-9a-fA-F]{2}|var\(--bloom-charcoal\)|var\(--bloom-warm-gray\))/g;
    const darkTextMatches = slide8.match(darkTextPattern);
    if (darkTextMatches) {
      console.log(`\n❌ DARK TEXT FOUND:`);
      darkTextMatches.forEach(match => {
        console.log(`  - ${match}`);
      });
    }
    
    // Show first 500 chars of slide 8
    console.log(`\nSlide 8 preview:`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(slide8.substring(0, 500) + '...');
  }
  
  // Also check for any gradient backgrounds in the entire presentation
  console.log(`\n\nGRADIENT BACKGROUND SEARCH:`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  
  sections.forEach((section, index) => {
    if (section.includes('gradient') && section.includes('background')) {
      console.log(`\nSlide ${index + 1} has gradient background:`);
      const preview = section.substring(0, 200);
      console.log(preview + '...');
    }
  });
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🔍 Diagnose Slide 8 Issue

Figures out what the expert panel is seeing.

Usage:
  npm run diagnose-slide8 "week1 lesson1"
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
    
    await diagnose(presentationPath);
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { diagnose };