#!/usr/bin/env node

/**
 * Complete 15-Slide Deck for Week 1 Lesson 1
 * Aligned with 10-minute video script
 * ~40 seconds per slide average
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Import the professional templates
const { professionalSlideTemplates } = require('./slide-templates-complete');

// Complete 15-slide deck aligned with script
const completeLesson1Slides = [
  // Slide 1: Hero Welcome (0:00-0:30)
  {
    template: 'heroWelcome',
    content: {
      emoji: '🌸',
      title: 'Welcome to Your Fourth Trimester',
      subtitle: 'A Sacred Space for Your Becoming',
      message: 'Before we begin, honor yourself. You are here, investing in your mental health during one of life\'s most challenging transitions. That isn\'t just courage - that\'s profound wisdom.'
    }
  },

  // Slide 2: Personal Connection (0:30-1:00)
  {
    template: 'conceptMetaphor',
    content: {
      title: 'Hello, Beautiful Mama',
      description: 'I\'m Dr. Jana, and what you\'re experiencing right now - the overwhelm, the uncertainty, maybe even the numbness - it\'s not a flaw in your character.',
      points: [
        { icon: '🧠', text: 'It\'s your nervous system responding to the most significant transformation a human can experience' },
        { icon: '💝', text: 'You\'re not broken. You\'re becoming.' },
        { icon: '🌱', text: 'This space is designed for exactly where you are right now' }
      ],
      metaphor: {
        visual: '🦋',
        caption: 'Like a butterfly in chrysalis, transformation feels like dissolution before it feels like emergence'
      }
    }
  },

  // Slide 3: Sacred Container Part 1 (1:00-1:30)
  {
    template: 'safeContainer',
    content: {
      title: 'Our Sacred Container',
      thisIs: [
        'Trauma-informed and attachment-focused',
        'Based on 15+ years of clinical research',
        'A place where ALL parts of you are welcomed',
        'Designed for your nervous system\'s current capacity',
        'Your permission slip to prioritize yourself'
      ],
      thisIsNot: [
        'A substitute for crisis intervention',
        'A place for toxic positivity',
        'Somewhere you need to perform or be "grateful enough"',
        'Another source of pressure or judgment'
      ]
    }
  },

  // NEW Slide 4: Emotional Checkpoint (1:30-2:00)
  {
    template: 'emotionalCheckpoint',
    content: {
      title: 'Pause & Notice',
      emoji: '🫶',
      prompt: 'Take three deep breaths with me.',
      questions: [
        'What does your body need right now?',
        'Permission to cry?',
        'To rest?',
        'To feel seen?'
      ],
      affirmation: 'Whatever it is, you have it.',
      instruction: 'Place your hand on your heart as we continue.'
    }
  },

  // Slide 5: The Science - Brain Changes (2:00-2:45)
  {
    template: 'neuroscienceVisual',
    content: {
      title: 'Your Brain on Motherhood',
      subtitle: 'What\'s Really Happening Inside',
      brainChanges: [
        { 
          area: 'Gray Matter',
          change: 'Reorganizing for hypervigilance',
          purpose: 'Evolutionary protection system activated'
        },
        {
          area: 'Amygdala',
          change: '2x more reactive',
          purpose: 'Scanning for baby\'s needs 24/7'
        },
        {
          area: 'Prefrontal Cortex',
          change: 'Temporarily offline',
          purpose: 'Why decisions feel impossible'
        },
        {
          area: 'Hippocampus',
          change: 'Memory consolidation disrupted',
          purpose: 'Why you can\'t remember if you ate today'
        }
      ],
      bottomLine: 'This isn\'t anxiety. This is architecture.'
    }
  },

  // Slide 6: Fourth Trimester Reality (2:45-3:30)
  {
    template: 'conceptMetaphor',
    content: {
      title: 'The Truth About Your Fourth Trimester',
      description: 'Society tells us the fourth trimester is "just" the first three months. But neuroscience tells us a different story.',
      points: [
        { icon: '🧬', text: 'Your brain is literally rewiring itself - growing new neural pathways at an unprecedented rate' },
        { icon: '🔬', text: 'Your gray matter is reorganizing for vigilance, empathy, and connection' },
        { icon: '⚡', text: 'You\'re experiencing the largest hormonal shift in human biology' },
        { icon: '🛡️', text: 'Your amygdala is hyperactive - not because you\'re anxious, but because you\'re evolutionarily designed to protect' }
      ],
      metaphor: {
        visual: '🧠',
        caption: 'Your brain isn\'t malfunctioning - it\'s magnificently adapting'
      }
    }
  },

  // Slide 7: What You're Navigating (3:30-4:15)
  {
    template: 'statsWithHumanity',
    content: {
      title: 'What You\'re Really Navigating',
      subtitle: 'All of this. Simultaneously.',
      stats: [
        { number: '🧠', label: 'Identity Death & Rebirth', context: 'Matrescence - as profound as adolescence' },
        { number: '🌊', label: 'Massive Hormonal Shifts', context: 'Larger than puberty and menopause combined' },
        { number: '💤', label: 'Sleep Deprivation', context: 'That would be considered torture in other contexts' },
        { number: '🔗', label: 'Attachment Reorganization', context: 'With everyone in your life, including yourself' }
      ],
      message: 'When you think about it this way...',
      emphasis: 'Your resilience is actually extraordinary.'
    }
  },

  // Slide 8: You're Not Alone - Statistics (4:15-5:00)
  {
    template: 'statsWithHumanity',
    content: {
      title: 'Your Invisible Community',
      subtitle: 'Not as statistics - as your neighbors, sisters, friends',
      stats: [
        { number: '80%', label: 'experience baby blues', context: 'That\'s 4 out of every 5 moms at the playground' },
        { number: '20%', label: 'develop postpartum depression', context: 'Your neighbor, your sister, your best friend' },
        { number: '15%', label: 'experience postpartum anxiety', context: 'Including the moms who "have it all together"' },
        { number: '40%', label: 'report intrusive thoughts', context: 'Most too ashamed to tell anyone' }
      ],
      message: 'Struggling is NORMAL. It\'s not a bug in the system...',
      emphasis: 'It\'s a feature of profound transformation.'
    }
  },

  // NEW Slide 9: Revolutionary Reframe (5:00-5:30)
  {
    template: 'revolutionaryReframe',
    content: {
      title: 'Let\'s Get Revolutionary',
      oldStory: {
        label: 'The Old Story',
        points: [
          'Good mothers don\'t struggle',
          'You should bounce back',
          'Asking for help is weakness',
          'Your needs come last'
        ]
      },
      newStory: {
        label: 'The Truth',
        points: [
          'Good mothers feel everything',
          'You\'re meant to be changed',
          'Asking for help is wisdom',
          'Your wellness is the foundation'
        ]
      },
      bridge: 'Which story is your nervous system still believing?'
    }
  },

  // Slide 10: Cultural Truth Bomb (5:30-6:00)
  {
    template: 'conceptMetaphor',
    content: {
      title: 'The Real Problem',
      description: 'The problem isn\'t you. The problem is a culture that expects you to "bounce back" from an experience that\'s meant to fundamentally change you.',
      points: [
        { icon: '🌍', text: 'Other cultures have 40-day lying-in periods' },
        { icon: '👥', text: 'Mothers were never meant to do this alone' },
        { icon: '💔', text: 'Modern isolation is the anomaly, not your struggle' }
      ],
      metaphor: {
        visual: '🏝️',
        caption: 'You\'re not failing at motherhood. You\'re succeeding in impossible conditions.'
      }
    }
  },

  // Slide 11: Your Fourth Trimester Rights (6:00-7:00)
  {
    template: 'practiceSlide',
    content: {
      title: 'Your Fourth Trimester Rights',
      subtitle: 'Not just nice ideas - therapeutic prescriptions for your healing',
      practice: {
        name: 'Rights to Embody',
        frequency: 'Read daily, believe gradually',
        instruction: 'You have the RIGHT to:',
        steps: [
          'Feel whatever you feel without justification',
          'Ask for help as many times as you need it',
          'Prioritize your mental health as much as baby\'s physical health',
          'Grieve who you were before becoming a mother',
          'Have needs that exist beyond your baby\'s needs',
          'Change your mind about what works for your family',
          'Set boundaries with well-meaning advice-givers'
        ]
      },
      science: {
        text: 'As you read each one, notice which ones your body resists.',
        emphasis: 'That\'s where your healing work begins.'
      }
    }
  },

  // NEW Slide 12: Guided Practice Setup (7:00-7:30)
  {
    template: 'guidedPracticeIntro',
    content: {
      title: 'Your First Medicine',
      subtitle: 'Let\'s practice together right now',
      icon: '🤲',
      setup: [
        'Place both hands on your heart',
        'Feel the warmth of your touch',
        'Notice your breath naturally deepening',
        'You\'re activating your vagus nerve'
      ],
      scienceNote: 'Self-touch releases oxytocin. Your own hands can be medicine.'
    }
  },

  // Slide 13: The "Enough" Practice (7:30-8:30)
  {
    template: 'practiceSlide',
    content: {
      title: 'The "Enough" Practice',
      subtitle: 'Your nervous system medicine for this week',
      practice: {
        name: 'Three Sacred Phrases',
        frequency: '3 times daily (morning, afternoon, bedtime)',
        instruction: 'With hands on heart, speak these truths:',
        steps: [
          'I am learning, and that\'s enough.',
          'I am trying, and that\'s enough.',
          'I am here, and that\'s enough.'
        ]
      },
      science: {
        text: 'This isn\'t positive thinking. This is nervous system regulation through self-touch (oxytocin release) and self-compassion (vagal tone improvement).',
        emphasis: 'It\'s neuroscience-backed healing.'
      }
    }
  },

  // NEW Slide 14: Integration & Next Steps (8:30-9:30)
  {
    template: 'weeklyIntegration',
    content: {
      title: 'Your Week 1 Foundation',
      practices: [
        {
          name: 'Daily "Enough" Practice',
          when: 'Morning, afternoon, bedtime',
          duration: '30 seconds each'
        },
        {
          name: 'Rights Reading',
          when: 'Once daily',
          duration: '2 minutes'
        },
        {
          name: 'Body Check-ins',
          when: 'Before each feeding',
          duration: '10 seconds'
        }
      ],
      reminder: 'Screenshot this or write it where you\'ll see it. Your healing happens in these micro-moments.',
      preview: 'Next lesson: Understanding what\'s really happening in your body\'s recovery - the truth that helps you heal.'
    }
  },

  // Slide 15: Closing Integration (9:30-10:00)
  {
    template: 'closingIntegration',
    content: {
      emoji: '💝',
      title: 'You\'ve Already Begun',
      message: 'By showing up today, by staying present through this lesson, you\'ve already started rewiring your nervous system for self-compassion. That\'s not small. That\'s revolutionary.',
      takeaways: [
        'Your struggles are normal responses to extraordinary circumstances',
        'You\'re not alone - you\'re part of an invisible sisterhood',
        'Healing happens in small, gentle moments of self-compassion',
        'Your nervous system is doing exactly what it\'s designed to do',
        'Asking for help is a sign of wisdom, not weakness'
      ],
      nextStep: 'Next: The Body Truth (What\'s Really Happening)',
      lessonNumber: 1
    }
  }
];

// New templates for the additional slides
const additionalTemplates = {
  emotionalCheckpoint: (content) => `
    <div class="slide-container emotional-checkpoint">
      <style>
        .emotional-checkpoint {
          background: linear-gradient(135deg, #FEF5F1 0%, #F5F7FA 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px;
        }

        .checkpoint-wrapper {
          max-width: 800px;
          text-align: center;
        }

        .checkpoint-emoji {
          font-size: 80px;
          margin-bottom: 30px;
          animation: heartbeat 2s ease-in-out infinite;
        }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .checkpoint-title {
          font-family: 'Playfair Display', serif;
          font-size: 48px;
          color: #2D3748;
          margin-bottom: 30px;
        }

        .checkpoint-prompt {
          font-family: 'Montserrat', sans-serif;
          font-size: 28px;
          color: #4A5568;
          margin-bottom: 40px;
          font-weight: 500;
        }

        .question-list {
          list-style: none;
          padding: 0;
          margin: 0 0 40px 0;
        }

        .question-item {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          color: #718096;
          margin: 15px 0;
          font-style: italic;
        }

        .checkpoint-affirmation {
          font-family: 'Montserrat', sans-serif;
          font-size: 24px;
          color: #D53F8C;
          font-weight: 600;
          margin-bottom: 30px;
        }

        .checkpoint-instruction {
          font-family: 'Montserrat', sans-serif;
          font-size: 20px;
          color: #718096;
          font-style: italic;
          padding: 20px;
          background: rgba(255,255,255,0.8);
          border-radius: 15px;
        }
      </style>

      <div class="checkpoint-wrapper">
        <div class="checkpoint-emoji">${content.emoji}</div>
        <h2 class="checkpoint-title">${content.title}</h2>
        <p class="checkpoint-prompt">${content.prompt}</p>
        
        <ul class="question-list">
          ${content.questions.map(q => `<li class="question-item">${q}</li>`).join('')}
        </ul>
        
        <p class="checkpoint-affirmation">${content.affirmation}</p>
        <p class="checkpoint-instruction">${content.instruction}</p>
      </div>
    </div>
  `,

  neuroscienceVisual: (content) => `
    <div class="slide-container neuroscience-visual">
      <style>
        .neuroscience-visual {
          background: #1A202C;
          color: white;
          padding: 60px;
        }

        .neuro-wrapper {
          max-width: 1400px;
          margin: 0 auto;
        }

        .neuro-title {
          font-family: 'Playfair Display', serif;
          font-size: 52px;
          text-align: center;
          margin-bottom: 15px;
          background: linear-gradient(135deg, #FED7E2 0%, #D6F5D6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .neuro-subtitle {
          font-family: 'Montserrat', sans-serif;
          font-size: 24px;
          text-align: center;
          color: #CBD5E0;
          margin-bottom: 50px;
        }

        .brain-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          margin-bottom: 50px;
        }

        .brain-card {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 30px;
          border: 1px solid rgba(255,255,255,0.2);
          transition: all 0.3s ease;
        }

        .brain-card:hover {
          transform: translateY(-5px);
          background: rgba(255,255,255,0.15);
        }

        .brain-area {
          font-family: 'Montserrat', sans-serif;
          font-size: 22px;
          font-weight: 600;
          color: #FED7E2;
          margin-bottom: 10px;
        }

        .brain-change {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          color: white;
          margin-bottom: 15px;
          line-height: 1.4;
        }

        .brain-purpose {
          font-family: 'Montserrat', sans-serif;
          font-size: 16px;
          color: #CBD5E0;
          font-style: italic;
        }

        .bottom-line {
          text-align: center;
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          color: #FED7E2;
          padding: 30px;
          background: rgba(255,255,255,0.05);
          border-radius: 20px;
          margin-top: 40px;
        }
      </style>

      <div class="neuro-wrapper">
        <h2 class="neuro-title">${content.title}</h2>
        <p class="neuro-subtitle">${content.subtitle}</p>
        
        <div class="brain-grid">
          ${content.brainChanges.map(change => `
            <div class="brain-card">
              <h3 class="brain-area">${change.area}</h3>
              <p class="brain-change">${change.change}</p>
              <p class="brain-purpose">${change.purpose}</p>
            </div>
          `).join('')}
        </div>
        
        <div class="bottom-line">${content.bottomLine}</div>
      </div>
    </div>
  `,

  revolutionaryReframe: (content) => `
    <div class="slide-container revolutionary-reframe">
      <style>
        .revolutionary-reframe {
          background: #FAFAF8;
          padding: 60px;
        }

        .reframe-wrapper {
          max-width: 1200px;
          margin: 0 auto;
        }

        .reframe-title {
          font-family: 'Playfair Display', serif;
          font-size: 52px;
          color: #2D3748;
          text-align: center;
          margin-bottom: 50px;
        }

        .stories-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          margin-bottom: 50px;
        }

        .story-column {
          padding: 40px;
          border-radius: 20px;
        }

        .old-story {
          background: linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%);
          border: 2px solid #FCA5A5;
        }

        .new-story {
          background: linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%);
          border: 2px solid #6EE7B7;
        }

        .story-label {
          font-family: 'Montserrat', sans-serif;
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 30px;
          text-align: center;
        }

        .old-story .story-label {
          color: #991B1B;
        }

        .new-story .story-label {
          color: #065F46;
        }

        .story-points {
          list-style: none;
          padding: 0;
        }

        .story-point {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          line-height: 1.6;
          margin: 20px 0;
          padding: 15px;
          background: rgba(255,255,255,0.7);
          border-radius: 10px;
          text-align: center;
        }

        .bridge-question {
          text-align: center;
          font-family: 'Montserrat', sans-serif;
          font-size: 28px;
          color: #4A5568;
          font-style: italic;
          padding: 30px;
          background: linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%);
          border-radius: 20px;
        }
      </style>

      <div class="reframe-wrapper">
        <h2 class="reframe-title">${content.title}</h2>
        
        <div class="stories-grid">
          <div class="story-column old-story">
            <h3 class="story-label">${content.oldStory.label}</h3>
            <ul class="story-points">
              ${content.oldStory.points.map(point => 
                `<li class="story-point">${point}</li>`
              ).join('')}
            </ul>
          </div>
          
          <div class="story-column new-story">
            <h3 class="story-label">${content.newStory.label}</h3>
            <ul class="story-points">
              ${content.newStory.points.map(point => 
                `<li class="story-point">${point}</li>`
              ).join('')}
            </ul>
          </div>
        </div>
        
        <div class="bridge-question">${content.bridge}</div>
      </div>
    </div>
  `,

  guidedPracticeIntro: (content) => `
    <div class="slide-container guided-practice-intro">
      <style>
        .guided-practice-intro {
          background: linear-gradient(135deg, #F3E7E9 0%, #E3EEFF 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px;
        }

        .practice-intro-wrapper {
          max-width: 900px;
          text-align: center;
        }

        .practice-icon {
          font-size: 100px;
          margin-bottom: 30px;
          animation: gentle-glow 3s ease-in-out infinite;
        }

        @keyframes gentle-glow {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(236, 72, 153, 0.3)); }
          50% { filter: drop-shadow(0 0 40px rgba(236, 72, 153, 0.5)); }
        }

        .practice-title {
          font-family: 'Playfair Display', serif;
          font-size: 48px;
          color: #2D3748;
          margin-bottom: 20px;
        }

        .practice-subtitle {
          font-family: 'Montserrat', sans-serif;
          font-size: 24px;
          color: #718096;
          margin-bottom: 50px;
        }

        .setup-steps {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.08);
          margin-bottom: 40px;
        }

        .setup-step {
          font-family: 'Montserrat', sans-serif;
          font-size: 22px;
          color: #4A5568;
          margin: 20px 0;
          padding: 15px;
          background: #F7FAFC;
          border-radius: 10px;
          border-left: 4px solid #EC4899;
        }

        .science-note {
          font-family: 'Montserrat', sans-serif;
          font-size: 18px;
          color: #718096;
          font-style: italic;
          padding: 20px;
          background: rgba(237, 100, 166, 0.1);
          border-radius: 15px;
        }
      </style>

      <div class="practice-intro-wrapper">
        <div class="practice-icon">${content.icon}</div>
        <h2 class="practice-title">${content.title}</h2>
        <p class="practice-subtitle">${content.subtitle}</p>
        
        <div class="setup-steps">
          ${content.setup.map(step => 
            `<div class="setup-step">${step}</div>`
          ).join('')}
        </div>
        
        <p class="science-note">${content.scienceNote}</p>
      </div>
    </div>
  `,

  weeklyIntegration: (content) => `
    <div class="slide-container weekly-integration">
      <style>
        .weekly-integration {
          background: linear-gradient(135deg, #FAFAF8 0%, #EDF2F7 100%);
          padding: 60px;
        }

        .integration-wrapper {
          max-width: 1200px;
          margin: 0 auto;
        }

        .integration-title {
          font-family: 'Playfair Display', serif;
          font-size: 48px;
          color: #2D3748;
          text-align: center;
          margin-bottom: 50px;
        }

        .practices-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 30px;
          margin-bottom: 40px;
        }

        .practice-card {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
          border-top: 4px solid;
          border-image: linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%) 1;
        }

        .practice-name {
          font-family: 'Montserrat', sans-serif;
          font-size: 24px;
          font-weight: 600;
          color: #2D3748;
          margin-bottom: 15px;
        }

        .practice-timing {
          display: flex;
          gap: 20px;
          margin-bottom: 10px;
        }

        .timing-item {
          font-family: 'Montserrat', sans-serif;
          font-size: 16px;
          color: #718096;
        }

        .timing-label {
          font-weight: 600;
          color: #4A5568;
        }

        .integration-reminder {
          background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
          border-radius: 20px;
          padding: 30px;
          text-align: center;
          margin-bottom: 30px;
        }

        .reminder-text {
          font-family: 'Montserrat', sans-serif;
          font-size: 20px;
          color: #78350F;
          font-weight: 500;
        }

        .preview-box {
          background: #2D3748;
          color: white;
          border-radius: 20px;
          padding: 30px;
          text-align: center;
        }

        .preview-text {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          line-height: 1.6;
        }
      </style>

      <div class="integration-wrapper">
        <h2 class="integration-title">${content.title}</h2>
        
        <div class="practices-grid">
          ${content.practices.map(practice => `
            <div class="practice-card">
              <h3 class="practice-name">${practice.name}</h3>
              <div class="practice-timing">
                <div class="timing-item">
                  <span class="timing-label">When:</span> ${practice.when}
                </div>
                <div class="timing-item">
                  <span class="timing-label">Time:</span> ${practice.duration}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="integration-reminder">
          <p class="reminder-text">📱 ${content.reminder}</p>
        </div>
        
        <div class="preview-box">
          <p class="preview-text">${content.preview}</p>
        </div>
      </div>
    </div>
  `
};

// Merge all templates
const allTemplates = { ...professionalSlideTemplates, ...additionalTemplates };

async function createCompleteSlides() {
  try {
    console.log('🎨 Creating complete 15-slide deck for Week 1 Lesson 1...\n');

    // Generate HTML for all slides
    const slidesHtml = completeLesson1Slides.map((slide, index) => {
      const template = allTemplates[slide.template];
      if (!template) {
        console.error(`❌ Unknown template: ${slide.template}`);
        return '';
      }
      
      console.log(`✅ Created slide ${index + 1}: ${slide.content.title || 'Slide'}`);
      return template(slide.content);
    }).join('\n<!-- SLIDE -->\n');

    // Save to file for review
    const fs = require('fs');
    const outputPath = './course-materials/week1-lesson1-complete-15-slides.html';
    
    const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Week 1 Lesson 1: Welcome to Your Fourth Trimester (Complete)</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      .slide-container {
        display: none;
      }
      .slide-container.active {
        display: flex;
      }
      .slide-nav {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 10px 20px;
        border-radius: 30px;
        z-index: 1000;
      }
    </style>
</head>
<body>
    ${slidesHtml}
    
    <div class="slide-nav">
      <span id="slideNumber">1</span> / ${completeLesson1Slides.length}
    </div>

    <script>
      let currentSlide = 0;
      const slides = document.querySelectorAll('.slide-container');
      const slideNumber = document.getElementById('slideNumber');
      
      function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        slideNumber.textContent = currentSlide + 1;
      }
      
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') showSlide(currentSlide + 1);
        if (e.key === 'ArrowLeft') showSlide(currentSlide - 1);
      });
      
      showSlide(0);
    </script>
</body>
</html>`;

    fs.writeFileSync(outputPath, fullHtml);
    console.log(`\n📁 Saved to: ${outputPath}`);

    // Update database with proper slide separators
    const { data: course } = await supabase
      .from('courses')
      .select('id')
      .eq('slug', 'postpartum-wellness-foundations')
      .single();

    if (course) {
      const { data: module } = await supabase
        .from('course_modules')
        .select('id')
        .eq('course_id', course.id)
        .eq('week_number', 1)
        .single();

      if (module) {
        const { data: updateData, error: updateError } = await supabase
          .from('course_lessons')
          .update({ 
            slides_html: slidesHtml,
            script_notes: 'Complete 15-slide deck aligned with 10-minute script. ~40 seconds per slide.'
          })
          .eq('module_id', module.id)
          .eq('lesson_number', 1)
          .select();

        if (updateError) {
          console.error('❌ Update error:', updateError);
        } else {
          console.log('\n✅ Successfully updated database with complete slide deck!');
        }
      }
    }

    console.log('\n🎯 Summary:');
    console.log(`- Created ${completeLesson1Slides.length} professional slides`);
    console.log('- Properly formatted with <!-- SLIDE --> separators');
    console.log('- Fixed timing: 10 minutes / 15 slides = ~40 seconds per slide');
    console.log('- Added missing content: emotional checkpoints, neuroscience, guided practice');
    console.log('- Ready for focus group testing!');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the script
createCompleteSlides();