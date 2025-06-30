const fs = require('fs');

// Read the presentation file
const filePath = '/Users/mattrundle/Documents/Bloom/bloom-course-content/weeks/week-1-foundation/lesson-1-welcome/presentation-animated-complete.html';
const content = fs.readFileSync(filePath, 'utf-8');

// Define slide boundaries by searching for section tags
const slideMatches = [...content.matchAll(/<section[^>]*>/g)];
const slides = [];

slideMatches.forEach((match, index) => {
    const startPos = match.index;
    const endPos = index < slideMatches.length - 1 ? slideMatches[index + 1].index : content.length;
    const slideContent = content.substring(startPos, endPos);
    
    // Extract slide title
    let title = '';
    const h1Match = slideContent.match(/<h1[^>]*>([^<]+(?:<[^>]+>[^<]+)*)<\/h1>/);
    const h2Match = slideContent.match(/<h2[^>]*>([^<]+(?:<[^>]+>[^<]+)*)<\/h2>/);
    
    if (h1Match) {
        title = h1Match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    } else if (h2Match) {
        title = h2Match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    }
    
    // Find all fragments in this slide
    const fragmentMatches = [...slideContent.matchAll(/class="fragment([^"]*)"[^>]*>[\s\S]*?<\/div>/g)];
    
    if (fragmentMatches.length > 0) {
        const slideInfo = {
            number: index + 1,
            title: title || `Slide ${index + 1}`,
            fragments: []
        };
        
        fragmentMatches.forEach((fragMatch, fragIndex) => {
            const animationType = fragMatch[1].trim() || 'default';
            const fragmentContent = fragMatch[0];
            
            // Extract meaningful content
            let description = '';
            
            // Check for specific content patterns
            if (fragmentContent.includes('Sacred Traditions')) {
                description = 'Cultural postpartum traditions from China, Latin America, and India';
            } else if (fragmentContent.includes('Modern Truth')) {
                description = 'Reality check about recovery time and the myth of "bouncing back"';
            } else if (fragmentContent.includes('What Social Media Shows')) {
                description = 'Unrealistic social media portrayals of postpartum recovery';
            } else if (fragmentContent.includes('The Truth:')) {
                description = 'Honest perspective on recovery being non-linear and individual';
            } else if (fragmentContent.includes('1 in 5')) {
                description = 'Statistic: 1 in 5 mothers experience postpartum mood disorders';
            } else if (fragmentContent.includes('70%')) {
                description = 'Statistic: 70% of mothers feel unprepared for postpartum';
            } else if (fragmentContent.includes('95%')) {
                description = 'Statistic: 95% wish they had more support';
            } else if (fragmentContent.includes('100%')) {
                description = 'Statistic: 100% deserve compassionate care';
            } else if (fragmentContent.includes('Tour de France')) {
                description = 'Comparison: Tour de France recovery vs postpartum recovery';
            } else if (fragmentContent.includes('Foundation')) {
                description = 'Week 1: Foundation - Understanding the fourth trimester';
            } else if (fragmentContent.includes('Self-Compassion')) {
                description = 'Week 2: Self-Compassion - Learning to be kind to yourself';
            } else if (fragmentContent.includes('Communication')) {
                description = 'Week 3: Communication - Expressing needs and setting boundaries';
            } else if (fragmentContent.includes('Managing Anxiety')) {
                description = 'Week 4: Managing Anxiety - Tools for calming your mind';
            } else if (fragmentContent.includes('Identity')) {
                description = 'Week 5: Identity - Navigating who you are becoming';
            } else if (fragmentContent.includes('Sustainable Wellness')) {
                description = 'Week 6: Sustainable Wellness - Building long-term well-being';
            } else if (fragmentContent.includes('About "Bouncing Back"')) {
                description = 'Truth about recovery: Not about returning to who you were';
            } else if (fragmentContent.includes('About Perfection')) {
                description = 'Truth about perfection: Progress over perfection';
            } else if (fragmentContent.includes('About Comparison')) {
                description = 'Truth about comparison: Your journey is unique';
            } else if (fragmentContent.includes('Your Support Options')) {
                description = 'Available support: Course community, emergency resources, professional help';
            } else if (fragmentContent.includes('Bloom Psychology')) {
                description = 'Contact information and website for Bloom Psychology';
            } else if (fragmentContent.includes('Remember:')) {
                description = 'Reminder that all forms of self-care count';
            } else if (fragmentContent.includes('🚨')) {
                description = 'When to seek immediate help - emergency signs';
            } else if (fragmentContent.includes('⚠️')) {
                description = 'Warning signs that indicate need for additional support';
            } else {
                // Generic descriptions based on content
                if (fragmentContent.match(/\d+%/)) {
                    const percent = fragmentContent.match(/(\d+%)/)[1];
                    description = `Statistic or data point showing ${percent}`;
                } else if (animationType.includes('fade-up')) {
                    description = 'Content fading up into view';
                } else if (animationType.includes('scale-in')) {
                    description = 'Content scaling in with emphasis';
                } else {
                    description = 'Additional content appearing';
                }
            }
            
            slideInfo.fragments.push({
                click: fragIndex + 1,
                animation: animationType,
                description: description
            });
        });
        
        slides.push(slideInfo);
    }
});

// Output formatted results
console.log('# Fragment Analysis for Week 1 Lesson 1 Presentation\n');
console.log('## Summary');
console.log(`- Total slides: ${slideMatches.length}`);
console.log(`- Slides with animations: ${slides.length}`);
console.log(`- Total click-through animations: ${slides.reduce((sum, s) => sum + s.fragments.length, 0)}\n`);

console.log('## Detailed Slide-by-Slide Breakdown\n');

slides.forEach(slide => {
    console.log(`### ${slide.title}`);
    console.log(`**Slide number:** ${slide.number}`);
    console.log(`**Number of clicks:** ${slide.fragments.length}\n`);
    
    slide.fragments.forEach(frag => {
        console.log(`**Click ${frag.click}** (${frag.animation})`);
        console.log(`- ${frag.description}\n`);
    });
    console.log('---\n');
});