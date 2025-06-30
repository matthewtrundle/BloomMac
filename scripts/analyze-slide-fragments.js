const fs = require('fs');
const path = require('path');

// Read the presentation file
const filePath = '/Users/mattrundle/Documents/Bloom/bloom-course-content/weeks/week-1-foundation/lesson-1-welcome/presentation-animated-complete.html';
const content = fs.readFileSync(filePath, 'utf-8');

// Split content into lines for easier analysis
const lines = content.split('\n');

// Track current slide and fragments
let currentSlide = 0;
let slideInfo = [];
let inSlide = false;
let slideData = null;

lines.forEach((line, index) => {
    // Detect start of a new slide
    if (line.includes('<section')) {
        currentSlide++;
        inSlide = true;
        slideData = {
            slideNumber: currentSlide,
            title: '',
            fragments: [],
            backgroundType: ''
        };
        
        // Extract background info
        if (line.includes('data-background-image')) {
            slideData.backgroundType = 'image';
        } else if (line.includes('data-background-color')) {
            slideData.backgroundType = 'color';
        }
    }
    
    // Detect end of slide
    if (line.includes('</section>') && inSlide) {
        if (slideData.fragments.length > 0) {
            slideInfo.push(slideData);
        }
        inSlide = false;
        slideData = null;
    }
    
    // Extract slide title (h1 or h2)
    if (inSlide && !slideData.title) {
        const h1Match = line.match(/<h1[^>]*>([^<]+)<\/h1>/);
        const h2Match = line.match(/<h2[^>]*>([^<]+)/);
        if (h1Match) {
            slideData.title = h1Match[1].replace(/<[^>]+>/g, '').trim();
        } else if (h2Match) {
            // Look for complete h2 across multiple lines
            let fullH2 = '';
            let j = index;
            while (j < lines.length && !lines[j].includes('</h2>')) {
                fullH2 += lines[j] + ' ';
                j++;
            }
            fullH2 += lines[j];
            const cleanTitle = fullH2.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
            if (cleanTitle) {
                slideData.title = cleanTitle;
            }
        }
    }
    
    // Detect fragments
    if (inSlide && line.includes('class="fragment')) {
        const fragmentData = {
            lineNumber: index + 1,
            animation: '',
            content: '',
            description: ''
        };
        
        // Extract animation type
        const animationMatch = line.match(/class="fragment\s*([^"]*)/);
        if (animationMatch) {
            fragmentData.animation = animationMatch[1].trim() || 'default';
        }
        
        // Try to extract content from nearby lines
        let contentLines = [];
        let hasStatistic = false;
        let hasList = false;
        
        for (let j = index; j < Math.min(index + 20, lines.length); j++) {
            const contentLine = lines[j];
            
            // Look for statistics/percentages
            if (contentLine.match(/\d+%/) || contentLine.match(/\d+ in \d+/)) {
                hasStatistic = true;
            }
            
            // Look for list items
            if (contentLine.includes('<li>') || contentLine.includes('<ul>')) {
                hasList = true;
            }
            
            // Look for text content
            const textMatch = contentLine.match(/>([^<]+)</);
            if (textMatch && textMatch[1].trim() && !textMatch[1].includes('{')) {
                contentLines.push(textMatch[1].trim());
            }
            
            // Look for headers
            const headerMatch = contentLine.match(/<h[1-6][^>]*>([^<]+)/);
            if (headerMatch) {
                contentLines.push(headerMatch[1].trim());
            }
            
            // Look for paragraphs
            if (contentLine.includes('<p')) {
                let pContent = '';
                let k = j;
                while (k < lines.length && !lines[k].includes('</p>')) {
                    const pMatch = lines[k].match(/>([^<]+)</);
                    if (pMatch && pMatch[1].trim()) {
                        pContent += pMatch[1].trim() + ' ';
                    }
                    k++;
                }
                if (pContent) contentLines.push(pContent.trim());
            }
            
            // Stop at closing div
            if (contentLine.includes('</div>') && j > index) {
                break;
            }
        }
        
        // Create description based on content type
        if (hasStatistic) {
            fragmentData.description = 'Statistic/data point';
        } else if (hasList) {
            fragmentData.description = 'List or bullet points';
        } else if (contentLines.some(line => line.includes('?'))) {
            fragmentData.description = 'Question or prompt';
        } else if (contentLines.length > 0) {
            fragmentData.description = 'Text content';
        } else {
            fragmentData.description = 'Visual element';
        }
        
        fragmentData.content = contentLines.join(' ').substring(0, 150) + (contentLines.join(' ').length > 150 ? '...' : '');
        slideData.fragments.push(fragmentData);
    }
});

// Output results
console.log('\n=== SLIDE FRAGMENT ANALYSIS ===\n');
console.log(`Total slides with fragments: ${slideInfo.length}\n`);

slideInfo.forEach(slide => {
    console.log(`\nSlide ${slide.slideNumber}: ${slide.title || 'Untitled'}`);
    console.log(`Background: ${slide.backgroundType}`);
    console.log(`Number of fragments/clicks: ${slide.fragments.length}`);
    console.log('Fragments:');
    
    slide.fragments.forEach((fragment, index) => {
        console.log(`  Click ${index + 1}: ${fragment.animation} animation`);
        console.log(`     Type: ${fragment.description}`);
        if (fragment.content) {
            console.log(`     Content preview: ${fragment.content}`);
        }
    });
});

// Summary
console.log('\n=== SUMMARY ===');
console.log(`Total slides analyzed: ${currentSlide}`);
console.log(`Slides with fragments: ${slideInfo.length}`);
console.log(`Total fragments: ${slideInfo.reduce((sum, slide) => sum + slide.fragments.length, 0)}`);

// List of animation types used
const animationTypes = new Set();
slideInfo.forEach(slide => {
    slide.fragments.forEach(fragment => {
        animationTypes.add(fragment.animation);
    });
});
console.log('\nAnimation types used:');
animationTypes.forEach(type => console.log(`  - ${type}`));