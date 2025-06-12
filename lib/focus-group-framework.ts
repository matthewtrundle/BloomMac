/**
 * Focus Group Testing Framework
 * For gathering feedback from 500 new moms on course effectiveness
 */

export const focusGroupFramework = {
  recruitment: {
    targetSize: 500,
    demographics: {
      stage: ['0-3 months postpartum', '3-6 months', '6-12 months', '12+ months'],
      firstTime: ['First-time moms (60%)', 'Experienced moms (40%)'],
      geography: ['Urban (40%)', 'Suburban (40%)', 'Rural (20%)'],
      support: ['Strong support system', 'Moderate support', 'Limited support'],
      mentalHealth: ['No concerns', 'Mild symptoms', 'Moderate symptoms', 'In treatment']
    },
    recruitmentChannels: [
      'Postpartum support groups',
      'Pediatrician offices',
      'Lactation consultants',
      'Mom Facebook groups',
      'Instagram mom communities',
      'Childbirth education centers'
    ]
  },

  testingProtocol: {
    format: 'Self-paced online with guided checkpoints',
    duration: '1 week to complete Lesson 1',
    platform: 'Secure learning portal with analytics',
    
    preAssessment: {
      mentalHealthScreen: 'Edinburgh Postnatal Depression Scale (EPDS)',
      expectations: 'What are you hoping to gain?',
      currentChallenges: 'Top 3 struggles right now',
      previousSupport: 'What help have you sought?'
    },

    duringLesson: {
      engagementMetrics: [
        'Time spent per slide',
        'Replay frequency',
        'Pause points',
        'Navigation patterns'
      ],
      microFeedback: [
        'After each slide: "How did this make you feel?" (emoji scale)',
        'After concepts: "How relevant is this to you?" (1-5)',
        'After practices: "Will you try this?" (Yes/Maybe/No)'
      ]
    },

    postLesson: {
      immediate: {
        overallRating: '1-10 scale',
        mostValuable: 'What resonated most?',
        confusing: 'What wasn\'t clear?',
        emotional: 'How do you feel now vs before?',
        actionable: 'What will you do differently?'
      },
      
      oneWeekLater: {
        retention: 'What do you remember?',
        application: 'What have you tried?',
        impact: 'What difference has it made?',
        sharing: 'Have you shared with others?'
      },
      
      oneMonthLater: {
        sustainedChange: 'What stuck with you?',
        rippleEffects: 'How has it affected your family?',
        recommendScore: 'NPS - Would you recommend?',
        testimonial: 'In your own words...'
      }
    }
  },

  feedbackQuestions: {
    content: [
      'Did the content feel like it was written for YOU?',
      'Was anything triggering or overwhelming?',
      'What information was new to you?',
      'What validated your experience?',
      'What do you wish was included?'
    ],
    
    presentation: [
      'Were the slides easy to follow?',
      'Was the pacing appropriate?',
      'Did the visuals enhance understanding?',
      'Was the text readable and clear?',
      'Did you feel engaged throughout?'
    ],
    
    practical: [
      'Can you realistically do the practices?',
      'Do the tools fit your lifestyle?',
      'Will you continue to the next lesson?',
      'Would you pay for this course?',
      'How much would you pay?'
    ],
    
    emotional: [
      'Did you feel seen and understood?',
      'Did it reduce feelings of isolation?',
      'Do you feel more hopeful?',
      'Did it normalize your experience?',
      'Do you feel more self-compassionate?'
    ]
  },

  analysisFramework: {
    quantitative: {
      completionRate: 'Target: >85%',
      satisfactionScore: 'Target: >8.5/10',
      nps: 'Target: >70',
      practiceAdoption: 'Target: >75% try at least one',
      continuationIntent: 'Target: >90% want Lesson 2'
    },
    
    qualitative: {
      themesAnalysis: [
        'Most mentioned positive aspects',
        'Common pain points',
        'Surprising insights',
        'Cultural considerations',
        'Suggested improvements'
      ],
      
      personaRefinement: [
        'Who benefited most?',
        'Who struggled with content?',
        'Unexpected user groups',
        'Access barriers identified'
      ],
      
      contentOptimization: [
        'Slides needing revision',
        'Missing topics',
        'Overwhelming sections',
        'Most powerful moments'
      ]
    }
  },

  implementationPlan: {
    week1: {
      tasks: [
        'Set up testing platform',
        'Create recruitment materials',
        'Launch recruitment campaign',
        'Screen and onboard participants'
      ]
    },
    
    week2_3: {
      tasks: [
        'Participants complete Lesson 1',
        'Monitor engagement metrics',
        'Provide technical support',
        'Gather immediate feedback'
      ]
    },
    
    week4_5: {
      tasks: [
        'Conduct follow-up surveys',
        'Analyze quantitative data',
        'Code qualitative responses',
        'Identify key themes'
      ]
    },
    
    week6: {
      tasks: [
        'Compile comprehensive report',
        'Create revision recommendations',
        'Plan implementation of changes',
        'Prepare for next lesson testing'
      ]
    }
  },

  ethicalConsiderations: {
    consent: 'Clear informed consent process',
    compensation: '$50 gift card for full participation',
    support: 'Mental health resources provided',
    privacy: 'All data anonymized',
    optOut: 'Can withdraw at any time',
    clinical: 'Clear disclaimers about educational vs therapeutic'
  },

  successMetrics: {
    primary: [
      '90% say content is highly relevant',
      '85% feel less alone',
      '80% implement at least one practice',
      '95% would recommend to a friend'
    ],
    
    secondary: [
      'Reduced EPDS scores at 1 month',
      'Increased self-compassion measures',
      'High social sharing rates',
      'Requests for additional content'
    ],
    
    ultimate: {
      vision: 'Create a course that becomes the gold standard for postpartum mental health education',
      measure: 'Adoption by healthcare providers and insurance coverage'
    }
  }
};

export const sampleFeedbackSurvey = {
  immediatePostLesson: {
    rating: {
      question: 'Overall, how valuable was this lesson for you?',
      type: 'scale',
      range: '1-10',
      labels: {
        1: 'Not valuable',
        5: 'Somewhat valuable',
        10: 'Extremely valuable'
      }
    },
    
    resonance: {
      question: 'What part of the lesson resonated with you most deeply?',
      type: 'open-text',
      promptExamples: [
        'The statistics that showed I\'m not alone',
        'The explanation of brain changes',
        'The Fourth Trimester Rights',
        'The Enough Practice'
      ]
    },
    
    clarity: {
      question: 'Was there anything confusing or unclear?',
      type: 'open-text',
      followUp: 'What would have made it clearer?'
    },
    
    emotional: {
      question: 'How do you feel after completing this lesson?',
      type: 'multi-select',
      options: [
        'More understood',
        'Less alone',
        'More hopeful',
        'Validated',
        'Overwhelmed',
        'Confused',
        'Motivated',
        'Emotional'
      ]
    },
    
    action: {
      question: 'Which practice or tool are you most likely to try?',
      type: 'single-select',
      options: [
        'The Enough Practice',
        'Reading my Fourth Trimester Rights daily',
        'Sharing statistics with my partner',
        'Being more self-compassionate',
        'Other (please specify)'
      ]
    }
  }
};