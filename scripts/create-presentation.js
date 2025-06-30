#!/usr/bin/env node

/**
 * Bloom Psychology Presentation Generator
 * 
 * Usage: npm run create-presentation "week1 lesson2"
 * 
 * This script acts as a design agent that:
 * 1. Loads all design documentation
 * 2. Understands the lesson context
 * 3. Generates a complete presentation
 * 4. Suggests appropriate images
 * 5. Creates content based on lesson number
 */

const fs = require('fs').promises;
const path = require('path');

// Design system knowledge base
const DESIGN_SYSTEM = {
  colorPalettes: {
    week1: { primary: '#FF6B6B', secondary: '#C589E8' },
    week2: { primary: '#95E1D3', secondary: '#74C0FC' },
    week3: { primary: '#FFCB77', secondary: '#FFB4A2' },
    week4: { primary: '#74C0FC', secondary: '#95E1D3' },
    week5: { primary: '#C589E8', secondary: '#FFA8C5' },
    week6: { primary: '#8B9A82', secondary: '#FFCB77' }
  },
  
  lessonThemes: {
    week1: {
      lesson1: {
        title: "Welcome to Your Fourth Trimester",
        subtitle: "A journey through postpartum wellness",
        focus: "Introduction and validation",
        emotions: ["welcoming", "supportive", "hopeful"]
      },
      lesson2: {
        title: "Understanding Your Emotions",
        subtitle: "Making sense of the emotional rollercoaster",
        focus: "Emotional awareness and normalization",
        emotions: ["understanding", "validating", "compassionate"]
      },
      lesson3: {
        title: "Building Your Support Network",
        subtitle: "You don't have to do this alone",
        focus: "Connection and community",
        emotions: ["connected", "supported", "empowered"]
      }
    },
    week2: {
      lesson1: {
        title: "Working with Difficult Thoughts",
        subtitle: "When your mind feels like your enemy",
        focus: "Cognitive strategies",
        emotions: ["empowering", "practical", "reassuring"]
      },
      lesson2: {
        title: "The Power of Mindfulness",
        subtitle: "Finding calm in the chaos",
        focus: "Present-moment awareness",
        emotions: ["peaceful", "grounding", "gentle"]
      },
      lesson3: {
        title: "Reframing Your Story",
        subtitle: "Changing the narrative",
        focus: "Cognitive restructuring",
        emotions: ["transformative", "hopeful", "strong"]
      }
    },
    week3: {
      lesson1: {
        title: "Rediscovering Joy",
        subtitle: "Finding yourself again",
        focus: "Behavioral activation",
        emotions: ["joyful", "playful", "light"]
      },
      lesson2: {
        title: "Small Steps, Big Changes",
        subtitle: "Building momentum",
        focus: "Gradual exposure",
        emotions: ["encouraging", "achievable", "progressive"]
      },
      lesson3: {
        title: "Creating Meaningful Moments",
        subtitle: "What matters most",
        focus: "Values clarification",
        emotions: ["meaningful", "authentic", "purposeful"]
      }
    },
    week4: {
      lesson1: {
        title: "Understanding Anxiety",
        subtitle: "When worry takes over",
        focus: "Anxiety education",
        emotions: ["calming", "informative", "reassuring"]
      },
      lesson2: {
        title: "Calming Your Nervous System",
        subtitle: "Tools for immediate relief",
        focus: "Somatic techniques",
        emotions: ["soothing", "grounding", "safe"]
      },
      lesson3: {
        title: "Breaking the Worry Cycle",
        subtitle: "Finding peace of mind",
        focus: "Worry management",
        emotions: ["liberating", "clear", "confident"]
      }
    },
    week5: {
      lesson1: {
        title: "Strengthening Your Partnership",
        subtitle: "Growing together, not apart",
        focus: "Relationship dynamics",
        emotions: ["connected", "understanding", "loving"]
      },
      lesson2: {
        title: "Communication That Connects",
        subtitle: "Being heard and understood",
        focus: "Communication skills",
        emotions: ["open", "honest", "supportive"]
      },
      lesson3: {
        title: "Building Your Village",
        subtitle: "Creating community",
        focus: "Social support",
        emotions: ["inclusive", "warm", "belonging"]
      }
    },
    week6: {
      lesson1: {
        title: "Reflecting on Your Journey",
        subtitle: "How far you've come",
        focus: "Progress recognition",
        emotions: ["proud", "reflective", "accomplished"]
      },
      lesson2: {
        title: "Planning for the Future",
        subtitle: "Sustainable wellness",
        focus: "Maintenance planning",
        emotions: ["forward-looking", "prepared", "confident"]
      },
      lesson3: {
        title: "Celebrating Your Strength",
        subtitle: "You are enough",
        focus: "Self-compassion and closure",
        emotions: ["celebratory", "empowering", "complete"]
      }
    }
  },

  imageSearchTerms: {
    welcoming: ["mother holding newborn tenderly", "warm embrace mother baby", "gentle motherhood moment"],
    supportive: ["women supporting each other", "mothers circle support", "hands holding together women"],
    hopeful: ["sunrise with mother silhouette", "mother looking forward hope", "new beginning motherhood"],
    understanding: ["woman reflecting quietly", "contemplative mother", "emotional awareness woman"],
    validating: ["therapist listening woman", "supportive conversation women", "understanding embrace"],
    compassionate: ["self compassion woman", "gentle self care", "woman hand on heart"],
    connected: ["mothers group circle", "women community gathering", "supportive friends mothers"],
    empowered: ["confident mother portrait", "strong woman motherhood", "empowered new mother"],
    peaceful: ["woman meditation peaceful", "calm mother breathing", "serene motherhood moment"],
    grounding: ["woman in nature grounding", "feet on earth mother", "centered peaceful woman"],
    joyful: ["mother laughing genuinely", "joyful motherhood moment", "woman finding joy again"],
    meaningful: ["mother purposeful moment", "meaningful connection baby", "intentional motherhood"],
    calming: ["soothing mother baby", "calm breathing woman", "peaceful anxiety relief"],
    soothing: ["gentle touch mother", "calming nature scene woman", "soft light mother"],
    loving: ["couple with baby tender", "partnership parenting love", "supportive partner embrace"]
  },

  slideContent: {
    statistics: {
      week1: {
        stat1: { number: "80%", label: "experience baby blues", color: "gradient" },
        stat2: { number: "20%", label: "develop PPD", color: "mint" },
        stat3: { number: "10%", label: "experience PPA", color: "lavender" }
      },
      week2: {
        stat1: { number: "90%", label: "report intrusive thoughts", color: "gradient" },
        stat2: { number: "75%", label: "feel guilt about thoughts", color: "sky" },
        stat3: { number: "100%", label: "can learn new strategies", color: "mint" }
      },
      week3: {
        stat1: { number: "5", label: "minutes can shift your mood", color: "gradient" },
        stat2: { number: "3", label: "activities to start", color: "golden" },
        stat3: { number: "∞", label: "possibilities ahead", color: "rose" }
      },
      week4: {
        stat1: { number: "40%", label: "experience postpartum anxiety", color: "gradient" },
        stat2: { number: "2-3", label: "breaths to calm", color: "sky" },
        stat3: { number: "24/7", label: "tools available", color: "mint" }
      },
      week5: {
        stat1: { number: "67%", label: "report relationship strain", color: "gradient" },
        stat2: { number: "93%", label: "can improve with support", color: "lavender" },
        stat3: { number: "2", label: "people working together", color: "rose" }
      },
      week6: {
        stat1: { number: "6", label: "weeks of growth", color: "gradient" },
        stat2: { number: "100%", label: "deserving of celebration", color: "golden" },
        stat3: { number: "1", label: "amazing you", color: "sage" }
      }
    },
    
    keyTruths: {
      week1: "Mental health struggles after birth are common, treatable, and not your fault",
      week2: "Your thoughts are not facts, and you are not your thoughts",
      week3: "Joy doesn't have to be earned; it can be cultivated",
      week4: "Anxiety is trying to protect you, but you can teach it better ways",
      week5: "Connection heals, and vulnerability creates connection",
      week6: "You have everything you need within you to continue this journey"
    },
    
    homework: {
      week1: "Place your hand on your heart once a day and say: 'I'm doing the best I can, and that's enough.'",
      week2: "When a difficult thought arises, pause and ask: 'Is this thought helpful or true?'",
      week3: "Do one small thing today that used to bring you joy, just for 5 minutes.",
      week4: "Practice the 4-7-8 breathing technique when you feel anxious.",
      week5: "Share one feeling with someone you trust today.",
      week6: "Write yourself a letter of appreciation for all you've overcome."
    }
  }
};

// Main generator function
async function generatePresentation(weekLesson) {
  try {
    // Parse input
    const [weekStr, lessonStr] = weekLesson.toLowerCase().split(/\s+/);
    const weekNum = weekStr.replace('week', '');
    const lessonNum = lessonStr.replace('lesson', '');
    
    const week = `week${weekNum}`;
    const lesson = `lesson${lessonNum}`;
    
    console.log(`\n🎨 Bloom Psychology Presentation Generator`);
    console.log(`📚 Creating: Week ${weekNum}, Lesson ${lessonNum}`);
    console.log(`${'─'.repeat(50)}\n`);
    
    // Get theme data
    const theme = DESIGN_SYSTEM.lessonThemes[week]?.[lesson];
    if (!theme) {
      throw new Error(`No theme found for ${week} ${lesson}`);
    }
    
    const colors = DESIGN_SYSTEM.colorPalettes[week];
    const stats = DESIGN_SYSTEM.slideContent.statistics[week];
    const truth = DESIGN_SYSTEM.slideContent.keyTruths[week];
    const homework = DESIGN_SYSTEM.slideContent.homework[week];
    
    // Load template
    const templatePath = path.join(__dirname, '../public/presentations/template-lesson.html');
    let template = await fs.readFile(templatePath, 'utf-8');
    
    // Generate image suggestions
    console.log(`📸 Suggested Images for "${theme.title}":\n`);
    const imageUrls = generateImageSuggestions(theme.emotions);
    
    // Replace placeholders
    template = replacePlaceholders(template, {
      week,
      lesson,
      weekNum,
      lessonNum,
      theme,
      colors,
      stats,
      truth,
      homework,
      imageUrls
    });
    
    // Create output directory
    const outputDir = path.join(__dirname, `../public/presentations/${week}/${lesson}`);
    await fs.mkdir(outputDir, { recursive: true });
    
    // Write file
    const outputPath = path.join(outputDir, 'index.html');
    await fs.writeFile(outputPath, template);
    
    console.log(`\n✅ Presentation created successfully!`);
    console.log(`📁 Location: ${outputPath}`);
    console.log(`🌐 View at: http://localhost:3000/presentations/${week}/${lesson}/`);
    console.log(`📄 Export PDF: http://localhost:3000/presentations/${week}/${lesson}/?print-pdf`);
    
    // Create content guide
    await createContentGuide(outputDir, { week, lesson, theme, stats, truth, homework });
    
    console.log(`\n📝 Content guide created: ${outputDir}/content-guide.md`);
    console.log(`\n🎯 Next Steps:`);
    console.log(`1. Review the generated presentation`);
    console.log(`2. Add specific content for each slide`);
    console.log(`3. Find and add appropriate images`);
    console.log(`4. Test all interactions and export\n`);
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}\n`);
    process.exit(1);
  }
}

// Generate image suggestions based on emotions
function generateImageSuggestions(emotions) {
  const suggestions = {
    hero: [],
    concepts: [],
    journey: [],
    practice: []
  };
  
  emotions.forEach(emotion => {
    const terms = DESIGN_SYSTEM.imageSearchTerms[emotion] || [];
    terms.forEach(term => {
      console.log(`   - ${term}`);
    });
    suggestions.hero.push(...terms.slice(0, 1));
    suggestions.concepts.push(...terms.slice(0, 2));
    suggestions.journey.push(...terms.slice(1, 3));
    suggestions.practice.push(...terms.slice(0, 1));
  });
  
  return suggestions;
}

// Replace all placeholders in template
function replacePlaceholders(template, data) {
  const { week, lesson, weekNum, lessonNum, theme, colors, stats, truth, homework } = data;
  
  // Basic replacements
  template = template.replace(/\[LESSON TITLE\]/g, theme.title);
  template = template.replace(/\[MAIN TITLE\]/g, theme.title);
  template = template.replace(/\[EMPHASIZED SUBTITLE\]/g, theme.subtitle.split(' ').slice(-3).join(' '));
  template = template.replace(/\[SUPPORTING TAGLINE\]/g, theme.subtitle);
  template = template.replace(/Week \[X\]/g, `Week ${weekNum}`);
  template = template.replace(/Lesson \[Y\]/g, `Lesson ${lessonNum}`);
  
  // Color replacements
  template = template.replace(/--bloom-coral: #FF6B6B;/g, `--bloom-coral: ${colors.primary};`);
  template = template.replace(/--bloom-lavender: #C589E8;/g, `--bloom-lavender: ${colors.secondary};`);
  
  // Statistics
  if (stats) {
    template = template.replace(/\[XX\]%/g, (match, offset) => {
      if (template.lastIndexOf('stat-big-number', offset) > template.lastIndexOf('</div>', offset)) {
        if (template.indexOf('gradient-text', offset - 100) > offset - 100) return stats.stat1.number;
        if (template.indexOf('mint', offset - 100) > offset - 100) return stats.stat2.number;
        if (template.indexOf('lavender', offset - 100) > offset - 100) return stats.stat3.number;
      }
      return match;
    });
  }
  
  // Key truth
  if (truth) {
    const truthParts = truth.split(/\s(common|treatable|facts|earned|heals|within)\s/);
    template = template.replace(/\[FIRST PART OF MESSAGE\]/g, truthParts[0] || truth);
  }
  
  // Homework
  if (homework) {
    const homeworkParts = homework.match(/"([^"]+)"/);
    template = template.replace(/\[PRACTICE QUOTE OR MANTRA\]/g, homeworkParts ? homeworkParts[1] : homework);
    template = template.replace(/\[PRACTICE INSTRUCTIONS\]/g, homework.split('"')[0].trim());
  }
  
  // Image placeholders with suggestions
  template = template.replace(/\[HERO IMAGE URL[^\]]*\]/g, 'https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?q=80&w=3000');
  template = template.replace(/\[SUPPORTIVE IMAGE URL\]/g, 'https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=3000');
  
  // Generic replacements for remaining placeholders
  template = template.replace(/\[[^\]]+\]/g, (match) => {
    // Keep some placeholders for manual editing
    if (match.includes('IMAGE') || match.includes('ALT TEXT')) return match;
    
    // Provide contextual defaults
    if (match.includes('WELCOMING')) return `Welcome Back`;
    if (match.includes('EMPHASIS')) return theme.focus;
    if (match.includes('SECTION TITLE')) return `Understanding ${theme.focus}`;
    if (match.includes('POINT')) return `Key insight about ${theme.focus}`;
    if (match.includes('Category')) return 'Aspect';
    if (match.includes('Description')) return 'Experience';
    
    return match;
  });
  
  return template;
}

// Create content guide
async function createContentGuide(outputDir, data) {
  const { week, lesson, theme, stats, truth, homework } = data;
  
  const guide = `# Content Guide: ${theme.title}

## Theme Overview
- **Title**: ${theme.title}
- **Subtitle**: ${theme.subtitle}
- **Focus**: ${theme.focus}
- **Emotional Tone**: ${theme.emotions.join(', ')}

## Slide-by-Slide Content Suggestions

### Slide 1: Hero Opening
- Use image of mother in ${theme.emotions[0]} moment
- Emphasize "${theme.subtitle}"

### Slide 2: Welcome/Acknowledgment
- Acknowledge where they are in their journey
- Validate their experience with ${theme.focus}

### Slide 3: Key Concepts
- Concept 1: Understanding ${theme.focus}
- Concept 2: Common experiences
- Concept 3: Path forward

### Slide 4: Important Points
- What to expect in this lesson
- How this connects to their daily life
- Permission statements

### Slides 5-6: Educational Content
- Deep dive into ${theme.focus}
- Real-world examples
- Practical applications

### Slide 7: Statistics
- ${stats.stat1.number}: ${stats.stat1.label}
- ${stats.stat2.number}: ${stats.stat2.label}
- ${stats.stat3.number}: ${stats.stat3.label}

### Slide 8: Key Truth
"${truth}"

### Slides 9-10: Journey Steps
- Step-by-step process for ${theme.focus}
- Actionable strategies
- Building blocks for success

### Slide 11: Resources & Tools
- Video lessons on ${theme.focus}
- Workbook exercises
- Guided practices
- Community support

### Slide 12: Practice
${homework}

### Slide 13: Closing
- Reinforce progress
- Preview next lesson
- Words of encouragement

## Image Search Suggestions

### Primary Searches:
${theme.emotions.map(e => DESIGN_SYSTEM.imageSearchTerms[e]?.[0]).filter(Boolean).map(term => `- ${term}`).join('\n')}

### Additional Options:
- "${theme.focus} motherhood"
- "postpartum ${theme.emotions[0]}"
- "new mother ${theme.focus}"

## Notes for Customization
- Adjust statistics based on current research
- Add personal stories or examples
- Include local resources if applicable
- Consider cultural sensitivity in imagery
`;

  await fs.writeFile(path.join(outputDir, 'content-guide.md'), guide);
}

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log(`
Usage: npm run create-presentation "week1 lesson2"

Examples:
  npm run create-presentation "week1 lesson2"
  npm run create-presentation "week2 lesson1"
  npm run create-presentation "week6 lesson3"
    `);
    process.exit(0);
  }
  
  generatePresentation(args[0]);
}

module.exports = { generatePresentation, DESIGN_SYSTEM };