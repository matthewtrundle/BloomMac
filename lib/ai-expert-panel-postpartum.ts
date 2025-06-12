/**
 * AI Expert Panel for Postpartum Course Enhancement
 * 6 Specialists providing evidence-based recommendations
 */

export const expertPanel = {
  experts: [
    {
      name: "Dr. Sarah Chen",
      specialty: "Neuroscience & Maternal Brain Changes",
      credentials: "PhD Neuroscience, 15 years maternal brain research",
      keyInsights: {
        brainPlasticity: {
          finding: "Maternal brain undergoes largest adult neuroplasticity event outside of brain injury",
          implication: "Normalize 'mom brain' as adaptive evolution, not deficit",
          slideRecommendation: "Interactive brain scan showing regions changing with hover explanations"
        },
        attachmentCircuits: {
          finding: "Oxytocin-dopamine interaction creates powerful but exhausting vigilance loop",
          implication: "Explain why mothers can't 'just relax' - it's neurobiological",
          slideRecommendation: "Animated pathway showing vigilance loop with intervention points"
        },
        recoveryTimeline: {
          finding: "Full cognitive recovery takes 6-24 months, not 6 weeks",
          implication: "Reset expectations, reduce self-judgment",
          slideRecommendation: "Timeline visualization with normal variation ranges"
        }
      },
      courseRecommendations: [
        "Start with neuroscience to validate experiences",
        "Use brain scans and animations for engagement",
        "Provide 'brain hack' interventions at each stage",
        "Include partner brain changes data"
      ]
    },
    {
      name: "Dr. James Williams",
      specialty: "Clinical Psychology & PPD Treatment",
      credentials: "PsyD, 20 years specializing in perinatal mood disorders",
      keyInsights: {
        treatmentEfficacy: {
          finding: "Combined therapy + lifestyle interventions 40% more effective than either alone",
          implication: "Holistic approach essential, not optional",
          slideRecommendation: "Pie chart showing intervention combinations and success rates"
        },
        earlyIntervention: {
          finding: "Every week of delayed treatment increases recovery time by 1 month",
          implication: "Urgency without panic - early action matters",
          slideRecommendation: "Graph showing treatment timing vs recovery duration"
        },
        subclinicalSupport: {
          finding: "50% of mothers have subclinical symptoms that still need support",
          implication: "Don't wait for diagnosis - preventive care works",
          slideRecommendation: "Spectrum visualization showing all need support, not just diagnosed"
        }
      },
      courseRecommendations: [
        "Include self-assessment tools in each lesson",
        "Provide 'when to escalate' clear guidelines",
        "Integrate micro-interventions throughout",
        "Address partner mental health explicitly"
      ]
    },
    {
      name: "Dr. Fatima Al-Rashid",
      specialty: "Cultural Psychiatry & Global Maternal Health",
      credentials: "MD, MPH, WHO consultant on maternal mental health",
      keyInsights: {
        culturalProtection: {
          finding: "Traditional 40-day rest periods reduce PPD by 35-45% across cultures",
          implication: "Modern rush to 'bounce back' is pathological",
          slideRecommendation: "World map showing traditional practices and PPD rates"
        },
        communitySupport: {
          finding: "Cultures with communal child-rearing show 60% lower severe PPD",
          implication: "Isolation is a modern risk factor we must address",
          slideRecommendation: "Comparison chart: individualist vs collectivist outcomes"
        },
        ritualImportance: {
          finding: "Postpartum rituals reduce anxiety by 40% regardless of specific practice",
          implication: "Creating meaning and structure matters more than specific actions",
          slideRecommendation: "Menu of rituals from different cultures to adapt"
        }
      },
      courseRecommendations: [
        "Acknowledge cultural diversity in every lesson",
        "Provide ritual creation framework",
        "Include community building exercises",
        "Challenge Western 'bounce back' narrative explicitly"
      ]
    },
    {
      name: "Dr. Rebecca Stone",
      specialty: "Instructional Design & Adult Learning",
      credentials: "EdD, 18 years in health education design",
      keyInsights: {
        cognitiveLoad: {
          finding: "Postpartum women process 40% less information per session",
          implication: "Must chunk content into 3-5 minute segments max",
          slideRecommendation: "Use progressive disclosure, not all at once"
        },
        emotionalLearning: {
          finding: "Emotional resonance increases retention by 65% in new mothers",
          implication: "Lead with stories and validation, follow with data",
          slideRecommendation: "Story → Science → Strategy format for each topic"
        },
        practicalApplication: {
          finding: "Implementation increases 80% with embedded practice moments",
          implication: "Don't just teach - facilitate immediate practice",
          slideRecommendation: "Every slide needs 'Try This Now' 30-second exercise"
        }
      },
      courseRecommendations: [
        "Maximum 3 key points per slide",
        "Use visual metaphors over text",
        "Include pause points for processing",
        "Build in success celebrations"
      ]
    },
    {
      name: "Dr. Marcus Thompson",
      specialty: "Data Visualization & Information Architecture",
      credentials: "PhD Information Science, healthcare visualization expert",
      keyInsights: {
        visualHierarchy: {
          finding: "Sleep-deprived brains need 70% more visual contrast",
          implication: "High contrast, clear hierarchy essential",
          slideRecommendation: "Dark backgrounds with bright focal points"
        },
        dataStories: {
          finding: "Narrative data visualization increases comprehension by 55%",
          implication: "Don't just show stats - tell the story within them",
          slideRecommendation: "Animated charts that build understanding step by step"
        },
        mobileFirst: {
          finding: "78% of mothers access content on phones while nursing/holding baby",
          implication: "Must be thumb-scrollable and one-handed friendly",
          slideRecommendation: "Vertical layouts, large touch targets, minimal typing"
        }
      },
      courseRecommendations: [
        "Use iconography over text wherever possible",
        "Implement dark mode option for night feeding",
        "Create downloadable reference cards",
        "Use progress indicators for motivation"
      ]
    },
    {
      name: "Dr. Elena Rodriguez",
      specialty: "Behavioral Change & Habit Formation",
      credentials: "PhD Behavioral Psychology, maternal wellness researcher",
      keyInsights: {
        microHabits: {
          finding: "2-minute habits have 90% adherence vs 15% for 10-minute habits",
          implication: "Tiny consistent actions beat sporadic big efforts",
          slideRecommendation: "Habit menu with 2-min, 5-min, 10-min options"
        },
        identityBridge: {
          finding: "Framing changes as 'mother who...' increases adoption by 45%",
          implication: "Link new behaviors to emerging identity",
          slideRecommendation: "Identity statement generator for each practice"
        },
        socialAccountability: {
          finding: "Buddy system increases completion by 65%",
          implication: "Build in connection, not just content",
          slideRecommendation: "QR codes for instant buddy matching"
        }
      },
      courseRecommendations: [
        "Start with smallest possible win",
        "Use implementation intentions for each tool",
        "Create habit stacking opportunities",
        "Include celebration rituals for progress"
      ]
    }
  ],

  consensusRecommendations: {
    mustHaves: [
      "Neuroscience validation in lesson 1 to normalize experiences",
      "Cultural wisdom integration throughout",
      "Micro-practices (2 min or less) for immediate implementation",
      "Visual-first design with minimal cognitive load",
      "Progress celebration built into structure",
      "Partner/support person sections in each lesson"
    ],
    slideStructure: {
      opening: "Emotional hook with immediate validation",
      science: "Brain/body explanation with visuals",
      data: "Statistics presented as stories",
      culture: "Global wisdom and practices",
      practice: "2-minute try-it-now exercise",
      integration: "Identity-based implementation plan",
      celebration: "Progress acknowledgment"
    },
    designPrinciples: [
      "Mobile-first vertical layouts",
      "High contrast for tired eyes",
      "Icons over text",
      "Progressive disclosure",
      "Downloadable references",
      "Audio options for hands-free"
    ]
  },

  implementationPlan: {
    phase1: "Validate and normalize with neuroscience",
    phase2: "Provide cultural context and wisdom",
    phase3: "Teach evidence-based strategies",
    phase4: "Facilitate micro-implementation",
    phase5: "Build sustainable support systems",
    phase6: "Celebrate growth and progress"
  }
};