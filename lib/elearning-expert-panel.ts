/**
 * E-Learning Expert Panel for Course Development
 * Bringing together specialists in adult learning, mental health education,
 * instructional design, and new mother support
 */

export const eLearningExperts = {
  instructionalDesigner: {
    name: "Dr. Sarah Chen",
    specialty: "Adult Learning & Microlearning",
    principles: [
      "Cognitive Load Theory - Chunk information into 3-5 key concepts per slide",
      "Dual Coding - Combine visual and verbal information for better retention",
      "Spaced Repetition - Review key concepts across multiple slides",
      "Active Learning - Include reflection prompts and self-assessment",
      "Emotional Safety - Start with validation before introducing new concepts"
    ],
    slideRecommendations: [
      "Use progressive disclosure - reveal information gradually",
      "Include 'breathing space' slides between heavy content",
      "Visual metaphors for abstract concepts (e.g., waves for emotions)",
      "Personal story integration points for connection",
      "Clear learning objectives at start, key takeaways at end"
    ]
  },

  mentalHealthEducator: {
    name: "Dr. Maria Rodriguez",
    specialty: "Trauma-Informed Pedagogy",
    principles: [
      "Window of Tolerance - Keep content within emotional safety zone",
      "Psychoeducation First - Explain the 'why' behind symptoms",
      "Normalize & Validate - Every slide should reduce shame",
      "Practical Application - Tools they can use immediately",
      "Hope & Agency - End each lesson with empowerment"
    ],
    contentStructure: [
      "Start with safety and grounding",
      "Move from external (body) to internal (emotions)",
      "Include 'pause and breathe' moments",
      "Offer choices and control throughout",
      "Close with integration and self-compassion"
    ]
  },

  newMomSpecialist: {
    name: "Lisa Thompson, LCSW",
    background: "15 years postpartum support",
    insights: [
      "Attention span is 3-5 minutes max when sleep deprived",
      "Visual content is processed faster than text",
      "Personal stories create immediate connection",
      "Statistics reduce isolation ('I'm not alone')",
      "Practical tools must be doable while holding baby"
    ],
    slidePreferences: [
      "Soft, calming color palettes (no harsh contrasts)",
      "Real photos over illustrations when possible",
      "Large, clear text (mobile-friendly)",
      "Bullet points over paragraphs",
      "Progress indicators for hope"
    ]
  },

  visualLearningExpert: {
    name: "Prof. James Wu",
    specialty: "Educational Psychology & Design",
    visualHierarchy: [
      "Hero images that evoke safety and understanding",
      "Icons to anchor concepts in memory",
      "Color coding for different types of content",
      "White space to prevent overwhelm",
      "Consistent visual language throughout"
    ],
    engagementTechniques: [
      "Story arc within each lesson",
      "Surprise elements to maintain attention",
      "Interactive moments (even if just mental)",
      "Visual progress through journey",
      "Celebration of small wins"
    ]
  },

  userExperienceResearcher: {
    name: "Dr. Aisha Patel",
    findings: "500 new mom focus group results",
    topNeeds: [
      "Feel understood within first 30 seconds",
      "See themselves reflected in content",
      "Get one actionable tool per lesson",
      "Know it's okay to pause/return later",
      "Feel hopeful by the end"
    ],
    commonFeedback: [
      "Too much text is overwhelming",
      "Love personal stories from instructor",
      "Need permission to feel negative emotions",
      "Want science but explained simply",
      "Appreciate beautiful, calming visuals"
    ]
  }
};

export const slideDesignPrinciples = {
  cognitive: {
    maxConceptsPerSlide: 3,
    idealWordCount: 30-50,
    visualToTextRatio: "60:40",
    readingTime: "15-20 seconds per slide"
  },
  
  emotional: {
    openingSlide: "Create safety and belonging",
    contentSlides: "Balance challenge with support",
    closingSlide: "Integrate and inspire action",
    throughout: "Maintain therapeutic presence"
  },
  
  visual: {
    colorPalette: {
      primary: "#E8D5D5", // Dusty rose
      secondary: "#B8D4C8", // Sage green  
      accent: "#F5E6D3", // Warm cream
      text: "#2D3748", // Soft charcoal
      background: "#FAFAF8" // Off white
    },
    typography: {
      headings: "Playfair Display (serif) - warmth & elegance",
      body: "Montserrat (sans-serif) - clarity & modernity",
      sizes: {
        title: "48-64px",
        subtitle: "32-40px", 
        body: "24-28px",
        caption: "18-20px"
      }
    },
    imagery: {
      style: "Soft, natural, inclusive",
      diversity: "Range of mothers represented",
      mood: "Hopeful, calm, empowering"
    }
  },
  
  accessibility: {
    contrastRatio: "WCAG AA compliant",
    fontSize: "Minimum 24px for body text",
    lineHeight: "1.5-1.8 for readability",
    language: "8th grade reading level"
  }
};

export const contentDensityGuidelines = {
  introSlide: {
    elements: ["Title", "Warm greeting", "Lesson overview"],
    wordCount: 40-60,
    visualFocus: "Welcoming hero image"
  },
  
  conceptSlide: {
    elements: ["Concept title", "3-4 bullet points", "Visual metaphor"],
    wordCount: 50-80,
    visualFocus: "Illustrative diagram or photo"
  },
  
  statisticsSlide: {
    elements: ["Context statement", "2-3 key stats", "Normalization message"],
    wordCount: 40-70,
    visualFocus: "Visual data representation"
  },
  
  toolSlide: {
    elements: ["Tool name", "3 steps", "When to use"],
    wordCount: 60-90,
    visualFocus: "Step-by-step visual guide"
  },
  
  reflectionSlide: {
    elements: ["Prompt question", "2-3 options", "Validation statement"],
    wordCount: 30-50,
    visualFocus: "Calming background image"
  },
  
  closingSlide: {
    elements: ["Key takeaway", "Practice reminder", "Next lesson preview"],
    wordCount: 50-70,
    visualFocus: "Inspiring, forward-looking image"
  }
};

export const lessonFlowTemplate = {
  opening: [
    { type: "welcome", duration: "30 sec", purpose: "Create safety" },
    { type: "overview", duration: "30 sec", purpose: "Set expectations" }
  ],
  
  body: [
    { type: "normalize", duration: "1 min", purpose: "Reduce isolation" },
    { type: "educate", duration: "2 min", purpose: "Build understanding" },
    { type: "tool", duration: "1.5 min", purpose: "Provide practical help" },
    { type: "practice", duration: "1 min", purpose: "Embody learning" }
  ],
  
  closing: [
    { type: "integrate", duration: "30 sec", purpose: "Solidify learning" },
    { type: "inspire", duration: "30 sec", purpose: "Motivate continuation" }
  ],
  
  throughout: {
    microBreaks: "Every 3-4 slides",
    validations: "Every 2-3 slides",
    visuals: "Every slide"
  }
};

export const feedbackQuestions = {
  immediate: [
    "Did you feel understood?",
    "Was anything overwhelming?",
    "What's your main takeaway?"
  ],
  
  postLesson: [
    "Which tool will you try first?",
    "What resonated most deeply?",
    "What questions do you still have?"
  ],
  
  weekLater: [
    "What have you actually used?",
    "What difference has it made?",
    "What would you change?"
  ]
};