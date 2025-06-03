// Enhanced 6-Week Postpartum Wellness Foundations Course
// Developed with consultation from e-learning specialists and postpartum psychologists
// Evidence-based content incorporating CBT, ACT, and mindfulness approaches

export const enhancedCourseData = {
  'postpartum-wellness-foundations': {
    id: 'postpartum-wellness-foundations',
    title: 'Postpartum Wellness Foundations',
    description: 'Evidence-based 6-week program for navigating your fourth trimester with confidence',
    totalLessons: 24,
    totalWeeks: 6,
    estimatedTimePerWeek: '75-90 minutes',
    clinicalFramework: 'CBT, ACT, and Mindfulness-Based Interventions',
    
    curriculum: [
      {
        week: 1,
        title: 'Understanding Your Postpartum Journey',
        description: 'Foundation building with assessment, psychoeducation, and self-compassion',
        clinicalFocus: 'Assessment, psychoeducation, and foundation setting',
        estimatedTime: '75 minutes',
        
        lessons: [
          {
            id: 'lesson-1-1',
            number: 1,
            title: 'Welcome to Your Fourth Trimester',
            duration: '8 min',
            type: 'video',
            description: 'Understanding the biological, psychological, and social changes of early motherhood.',
            keyLearning: 'Normalize the challenges and celebrate the strength of new mothers',
            clinicalNotes: 'Psychoeducation to reduce isolation and normalize experiences'
          },
          {
            id: 'lesson-1-2',
            number: 2,
            title: 'Your Body After Birth: What to Expect',
            duration: '10 min',
            type: 'video',
            description: 'Physical recovery, hormonal changes, and when to seek medical support.',
            keyLearning: 'Distinguish normal recovery from concerning symptoms',
            clinicalNotes: 'Medical literacy and self-advocacy skills'
          },
          {
            id: 'lesson-1-3',
            number: 3,
            title: 'Emotional Waves: Understanding Postpartum Feelings',
            duration: '12 min',
            type: 'video',
            description: 'Mood changes, identity shifts, and the spectrum of postpartum mental health.',
            keyLearning: 'Emotional validation and mental health awareness',
            clinicalNotes: 'Depression/anxiety screening education and normalization'
          },
          {
            id: 'lesson-1-4',
            number: 4,
            title: 'Building Your Foundation for Healing',
            duration: '9 min',
            type: 'video',
            description: 'Creating a supportive environment and basic self-care principles.',
            keyLearning: 'Practical strategies for immediate comfort and support',
            clinicalNotes: 'Safety planning and resource identification'
          }
        ],
        
        workbook: {
          id: 'workbook-1',
          title: 'Week 1: Assessment & Foundation Building',
          therapeuticFramework: 'Assessment and psychoeducation with self-compassion introduction',
          estimatedTime: '30-40 minutes',
          
          questions: [
            {
              id: 'w1_screening',
              type: 'clinical_assessment',
              title: 'Postpartum Wellness Check-In',
              instructions: 'This brief assessment helps us understand how you\'re feeling and provides personalized support. All responses are confidential.',
              questions: [
                {
                  id: 'epds_1',
                  text: 'I have been able to laugh and see the funny side of things',
                  type: 'scale',
                  scale: { min: 0, max: 3, labels: ['As much as I always could', 'Not quite so much now', 'Definitely not so much now', 'Not at all'] },
                  clinicalNote: 'EPDS item 1 - anhedonia screening'
                },
                {
                  id: 'epds_2', 
                  text: 'I have looked forward with enjoyment to things',
                  type: 'scale',
                  scale: { min: 0, max: 3, labels: ['As much as I ever did', 'Rather less than I used to', 'Definitely less than I used to', 'Hardly at all'] },
                  clinicalNote: 'EPDS item 2 - anhedonia screening'
                },
                {
                  id: 'sleep_quality',
                  text: 'How would you rate your sleep quality when you do get the chance to sleep?',
                  type: 'scale',
                  scale: { min: 1, max: 5, labels: ['Very poor', 'Poor', 'Fair', 'Good', 'Very good'] }
                },
                {
                  id: 'support_level',
                  text: 'How supported do you feel right now?',
                  type: 'scale',
                  scale: { min: 1, max: 10, labels: ['Not at all supported', 'Completely supported'] },
                  followUp: 'What would help you feel more supported?'
                }
              ]
            },
            {
              id: 'w1_identity_exploration',
              type: 'therapeutic_exercise',
              title: 'Identity Mapping: Then, Now, and Becoming',
              instructions: 'This exercise helps you explore the natural identity changes that come with motherhood. Take your time and be gentle with yourself.',
              therapeuticPurpose: 'Identity integration and self-compassion work',
              questions: [
                {
                  id: 'identity_before',
                  text: 'Describe yourself before becoming a mother (or before this baby)',
                  placeholder: 'Consider your interests, roles, strengths, and how you spent your time...',
                  type: 'textarea',
                  minChars: 100
                },
                {
                  id: 'identity_now',
                  text: 'How would you describe yourself now?',
                  placeholder: 'What has changed? What has stayed the same? What surprises you?',
                  type: 'textarea',
                  minChars: 100
                },
                {
                  id: 'identity_becoming',
                  text: 'Who are you becoming? What kind of mother and person do you want to grow into?',
                  placeholder: 'Think about your values, hopes, and the strengths you want to develop...',
                  type: 'textarea',
                  minChars: 100
                },
                {
                  id: 'identity_bridge',
                  text: 'What from your "before" self do you want to keep and integrate into your life as a mother?',
                  placeholder: 'Perhaps hobbies, values, relationships, or parts of your personality...',
                  type: 'textarea'
                }
              ]
            },
            {
              id: 'w1_support_mapping',
              type: 'practical_exercise',
              title: 'Support System Mapping',
              instructions: 'Creating a clear picture of your support network helps you know who to reach out to and identifies areas to strengthen.',
              questions: [
                {
                  id: 'emotional_support',
                  text: 'Emotional Support: Who can you share your feelings with without judgment?',
                  placeholder: 'Name specific people and how to reach them...',
                  type: 'textarea'
                },
                {
                  id: 'practical_support',
                  text: 'Practical Support: Who can help with baby care, meals, or household tasks?',
                  placeholder: 'Include family, friends, hired help, or community resources...',
                  type: 'textarea'
                },
                {
                  id: 'professional_support',
                  text: 'Professional Support: What healthcare providers are on your team?',
                  placeholder: 'OB/GYN, pediatrician, therapist, lactation consultant, etc.',
                  type: 'textarea'
                },
                {
                  id: 'peer_support',
                  text: 'Peer Support: Do you have connections with other new mothers?',
                  placeholder: 'Mom groups, friends with babies, online communities...',
                  type: 'textarea'
                },
                {
                  id: 'support_gaps',
                  text: 'What type of support feels missing or insufficient right now?',
                  type: 'textarea',
                  followUp: 'What is one small step you could take this week to address this gap?'
                }
              ]
            },
            {
              id: 'w1_self_compassion_intro',
              type: 'mindfulness_exercise',
              title: 'Self-Compassion Practice: Your Inner Voice',
              instructions: 'Learning to speak kindly to yourself is crucial for postpartum healing. This exercise introduces you to your inner critic and inner compassionate friend.',
              therapeuticPurpose: 'Introduction to self-compassion practices (Kristin Neff model)',
              questions: [
                {
                  id: 'inner_critic_words',
                  text: 'What does your inner critic say to you when you\'re struggling with motherhood?',
                  placeholder: 'Write down the actual words or phrases your mind uses when you feel like you\'re failing...',
                  type: 'textarea',
                  clinicalNote: 'Identifying negative self-talk patterns'
                },
                {
                  id: 'critic_impact',
                  text: 'How does it feel in your body when that inner critic speaks?',
                  placeholder: 'Notice tension, heaviness, tightness, or other physical sensations...',
                  type: 'textarea'
                },
                {
                  id: 'compassionate_friend',
                  text: 'Imagine a wise, loving friend is watching you struggle. What would they say to you?',
                  placeholder: 'Write as if this friend is speaking directly to you with complete love and understanding...',
                  type: 'textarea',
                  clinicalNote: 'Developing self-compassionate voice'
                },
                {
                  id: 'compassion_practice',
                  text: 'This week, try replacing one critical thought with the compassionate friend\'s voice. What will you practice saying to yourself?',
                  placeholder: 'Choose one kind phrase to repeat when you notice self-criticism...',
                  type: 'textarea'
                }
              ]
            },
            {
              id: 'w1_safety_check',
              type: 'safety_assessment',
              title: 'Wellness and Safety Check',
              instructions: 'Your safety and wellbeing are our priority. These questions help us ensure you have the support you need.',
              isRequired: true,
              questions: [
                {
                  id: 'thoughts_of_harm_self',
                  text: 'In the past two weeks, have you had thoughts of harming yourself?',
                  type: 'yes_no',
                  escalationTrigger: 'yes',
                  followUp: 'If yes, how often do these thoughts occur?'
                },
                {
                  id: 'thoughts_of_harm_baby',
                  text: 'Have you had unwanted, disturbing thoughts about your baby being harmed?',
                  type: 'yes_no',
                  note: 'Intrusive thoughts are common and different from intentions to harm',
                  followUp: 'If yes, do these thoughts feel like something you want to act on, or do they disturb you?'
                },
                {
                  id: 'emergency_contacts',
                  text: 'Who can you contact in a mental health emergency?',
                  placeholder: 'List specific people with phone numbers, plus local crisis numbers...',
                  type: 'textarea',
                  isRequired: true
                }
              ]
            }
          ]
        },
        
        meditation: {
          id: 'meditation-1',
          title: 'Welcome Meditation: Embracing Your Journey (8 min)',
          description: 'A gentle introduction to mindfulness practices designed for new mothers',
          duration: '8 min',
          techniques: ['Body awareness', 'Breath focus', 'Self-compassion'],
          instructions: 'Find a comfortable position. You can hold your baby if needed.'
        },
        
        resources: [
          {
            title: 'Emergency Resources Card',
            type: 'pdf',
            description: 'Print-friendly card with crisis hotlines and local resources'
          },
          {
            title: 'Partner Discussion Guide',
            type: 'pdf', 
            description: 'Help your partner understand postpartum experiences'
          }
        ]
      },
      
      {
        week: 2,
        title: 'Challenging Negative Thoughts',
        description: 'Cognitive Behavioral Therapy techniques for managing difficult thoughts and building resilience',
        clinicalFocus: 'CBT thought records, cognitive restructuring, behavioral activation basics',
        estimatedTime: '85 minutes',
        
        lessons: [
          {
            id: 'lesson-2-1',
            number: 5,
            title: 'Understanding the Thought-Feeling Connection',
            duration: '10 min',
            type: 'video',
            description: 'How thoughts influence emotions and behaviors - the foundation of CBT.',
            keyLearning: 'Recognize the power of thoughts in shaping experience',
            clinicalNotes: 'CBT psychoeducation and cognitive model introduction'
          },
          {
            id: 'lesson-2-2',
            number: 6,
            title: 'Common Unhelpful Thinking Patterns',
            duration: '12 min',
            type: 'video',
            description: 'Identifying cognitive distortions specific to new motherhood.',
            keyLearning: 'Recognize all-or-nothing thinking, catastrophizing, and mind reading',
            clinicalNotes: 'Cognitive distortion identification with maternal examples'
          },
          {
            id: 'lesson-2-3',
            number: 7,
            title: 'The Thought Record Technique',
            duration: '9 min',
            type: 'video',
            description: 'Step-by-step guide to examining and challenging unhelpful thoughts.',
            keyLearning: 'Practical skill for thought examination and cognitive restructuring',
            clinicalNotes: 'CBT thought record methodology'
          },
          {
            id: 'lesson-2-4',
            number: 8,
            title: 'Building Your Realistic Thinking Toolkit',
            duration: '8 min',
            type: 'video',
            description: 'Developing balanced, helpful thoughts that support your wellbeing.',
            keyLearning: 'Create more balanced and realistic thought patterns',
            clinicalNotes: 'Cognitive restructuring and coping statement development'
          }
        ],
        
        workbook: {
          id: 'workbook-2',
          title: 'Week 2: Cognitive Tools for Emotional Wellness',
          therapeuticFramework: 'CBT thought records and cognitive restructuring exercises',
          estimatedTime: '40-50 minutes',
          
          questions: [
            {
              id: 'w2_thought_pattern_identification',
              type: 'assessment_exercise',
              title: 'Identifying Your Thought Patterns',
              instructions: 'This week, we\'ll explore how your thoughts affect your emotions. Awareness is the first step to change.',
              questions: [
                {
                  id: 'difficult_situations',
                  text: 'What situations as a new mother tend to trigger difficult emotions for you?',
                  placeholder: 'Examples: baby crying, comparing to other moms, partner interactions, sleep deprivation...',
                  type: 'checkbox_with_other',
                  options: [
                    'Baby crying for extended periods',
                    'Difficulty breastfeeding',
                    'Comparing myself to other mothers',
                    'Partner not helping enough',
                    'Feeling touched out',
                    'Sleep deprivation',
                    'Leaving baby with others',
                    'Baby\'s development milestones',
                    'Return to work decisions',
                    'Body image changes'
                  ]
                },
                {
                  id: 'automatic_thoughts',
                  text: 'When you selected those situations above, what thoughts typically go through your mind?',
                  placeholder: 'Write the actual thoughts, even if they seem extreme or irrational...',
                  type: 'textarea',
                  minChars: 100,
                  clinicalNote: 'Automatic thought identification'
                },
                {
                  id: 'emotional_impact',
                  text: 'How do these thoughts make you feel emotionally?',
                  type: 'checkbox_multiple',
                  options: [
                    'Anxious or worried',
                    'Sad or hopeless',
                    'Guilty or ashamed',
                    'Angry or irritated',
                    'Overwhelmed',
                    'Inadequate or like a failure',
                    'Isolated or alone',
                    'Numb or disconnected'
                  ]
                }
              ]
            },
            {
              id: 'w2_thought_record_practice',
              type: 'cbt_exercise',
              title: 'Thought Record Practice',
              instructions: 'Think of a specific recent situation that was emotionally difficult. We\'ll walk through examining the thoughts and developing more balanced alternatives.',
              therapeuticPurpose: 'CBT thought record for cognitive restructuring',
              questions: [
                {
                  id: 'situation_description',
                  text: 'Describe the specific situation (when, where, what happened):',
                  placeholder: 'Be specific: "Yesterday at 3pm, the baby was crying for 30 minutes and I couldn\'t console her..."',
                  type: 'textarea',
                  isRequired: true
                },
                {
                  id: 'emotions_rating',
                  text: 'What emotions did you feel and how intense were they (0-10)?',
                  type: 'emotion_rating',
                  emotions: ['Sad', 'Anxious', 'Angry', 'Guilty', 'Overwhelmed', 'Ashamed'],
                  scale: { min: 0, max: 10 }
                },
                {
                  id: 'automatic_thought',
                  text: 'What went through your mind? What were you telling yourself?',
                  placeholder: 'Write your thoughts exactly as they occurred: "I\'m a terrible mother," "I can\'t do anything right," etc.',
                  type: 'textarea',
                  isRequired: true,
                  clinicalNote: 'Hot thought identification'
                },
                {
                  id: 'thought_believability',
                  text: 'How much did you believe this thought at the time (0-100%)?',
                  type: 'scale',
                  scale: { min: 0, max: 100 },
                  unit: '%'
                },
                {
                  id: 'evidence_for',
                  text: 'What evidence supports this thought?',
                  placeholder: 'List specific facts (not feelings) that seem to support this thought...',
                  type: 'textarea'
                },
                {
                  id: 'evidence_against',
                  text: 'What evidence contradicts this thought?',
                  placeholder: 'List facts that don\'t support this thought, including past successes, alternative explanations...',
                  type: 'textarea'
                },
                {
                  id: 'alternative_thought',
                  text: 'What is a more balanced, realistic thought?',
                  placeholder: 'Create a thought that acknowledges challenges while being fair and compassionate...',
                  type: 'textarea',
                  isRequired: true,
                  clinicalNote: 'Balanced thought development'
                },
                {
                  id: 'new_emotion_rating',
                  text: 'If you believed this new thought, how would you feel (0-10)?',
                  type: 'emotion_rating',
                  emotions: ['Sad', 'Anxious', 'Angry', 'Guilty', 'Overwhelmed', 'Ashamed'],
                  scale: { min: 0, max: 10 }
                }
              ]
            },
            {
              id: 'w2_thinking_trap_identification',
              type: 'educational_exercise',
              title: 'Common Thinking Traps for New Mothers',
              instructions: 'Learn to recognize specific thinking patterns that can worsen postpartum stress and mood.',
              questions: [
                {
                  id: 'thinking_traps_checklist',
                  text: 'Which of these thinking patterns do you recognize in yourself?',
                  type: 'checklist_with_examples',
                  options: [
                    {
                      trap: 'All-or-Nothing Thinking',
                      description: 'Seeing things in extremes',
                      example: '"If I\'m not the perfect mother, I\'m a complete failure"',
                      personalExample: ''
                    },
                    {
                      trap: 'Mind Reading',
                      description: 'Assuming you know what others think',
                      example: '"Everyone can see I don\'t know what I\'m doing"',
                      personalExample: ''
                    },
                    {
                      trap: 'Catastrophizing',
                      description: 'Expecting the worst outcome',
                      example: '"If the baby cries, something terrible must be wrong"',
                      personalExample: ''
                    },
                    {
                      trap: 'Should Statements',
                      description: 'Rigid expectations about how things should be',
                      example: '"I should love every moment of motherhood"',
                      personalExample: ''
                    },
                    {
                      trap: 'Comparison',
                      description: 'Measuring yourself against others',
                      example: '"Other moms make this look so easy"',
                      personalExample: ''
                    }
                  ]
                },
                {
                  id: 'most_common_trap',
                  text: 'Which thinking trap do you fall into most often?',
                  type: 'select',
                  options: ['All-or-Nothing', 'Mind Reading', 'Catastrophizing', 'Should Statements', 'Comparison'],
                  followUp: 'What situations typically trigger this thinking pattern for you?'
                }
              ]
            },
            {
              id: 'w2_coping_statements',
              type: 'skill_building_exercise',
              title: 'Creating Your Coping Statements',
              instructions: 'Develop personalized, realistic statements you can use when difficult thoughts arise.',
              therapeuticPurpose: 'Coping statement development for thought management',
              questions: [
                {
                  id: 'difficult_moments',
                  text: 'What are your most challenging moments as a new mother?',
                  type: 'ranking_exercise',
                  options: [
                    'Middle of the night feedings',
                    'When baby won\'t stop crying',
                    'Feeling overwhelmed by tasks',
                    'Comparing myself to others',
                    'When I make mistakes',
                    'Feeling isolated or alone',
                    'Physical discomfort or pain',
                    'Relationship stress'
                  ],
                  instruction: 'Rank your top 3 most challenging moments'
                },
                {
                  id: 'coping_statement_1',
                  text: 'For your #1 challenging moment, create a coping statement:',
                  placeholder: 'Example: "This is hard right now, and that\'s normal. I\'m learning and doing my best."',
                  type: 'textarea',
                  guidingQuestions: [
                    'What would you tell a friend in this situation?',
                    'What reminder would help you feel more calm?',
                    'What truth about motherhood could comfort you?'
                  ]
                },
                {
                  id: 'coping_statement_2',
                  text: 'For your #2 challenging moment, create a coping statement:',
                  type: 'textarea'
                },
                {
                  id: 'coping_statement_3',
                  text: 'For your #3 challenging moment, create a coping statement:',
                  type: 'textarea'
                },
                {
                  id: 'practice_plan',
                  text: 'How will you remember to use these coping statements when you need them?',
                  placeholder: 'Ideas: write them on your phone, post on mirror, set daily reminders...',
                  type: 'textarea'
                }
              ]
            },
            {
              id: 'w2_mood_tracking',
              type: 'monitoring_exercise',
              title: 'Daily Mood and Thought Tracking',
              instructions: 'Track your mood and thoughts for three days to notice patterns and practice your new skills.',
              questions: [
                {
                  id: 'tracking_commitment',
                  text: 'Commit to tracking your mood and thoughts for 3 days this week. Which days will you choose?',
                  type: 'date_picker',
                  multiSelect: true,
                  min: 3,
                  max: 3
                },
                {
                  id: 'tracking_method',
                  text: 'How will you remind yourself to track? (Choose what works for your lifestyle)',
                  type: 'radio',
                  options: [
                    'Phone reminder 3 times per day',
                    'Journal by bedside for evening reflection',
                    'Note during baby feeding times',
                    'Voice memos throughout the day',
                    'Partner reminder system'
                  ]
                }
              ]
            }
          ]
        },
        
        meditation: {
          id: 'meditation-2',
          title: 'Thought Observation Meditation (10 min)',
          description: 'Practice noticing thoughts without getting caught up in them',
          duration: '10 min',
          techniques: ['Mindful awareness', 'Thought labeling', 'Non-attachment'],
          instructions: 'A gentle practice for observing thoughts as they come and go.'
        }
      },
      
      // Weeks 3-6 would continue with similar comprehensive structure...
      // Week 3: Behavioral Activation & Rebuilding Joy
      // Week 4: Mindfulness & Anxiety Management  
      // Week 5: Relationships & Communication
      // Week 6: Integration & Future Planning
      
    ]
  }
};

// Assessment scoring and interpretation guidelines
export const assessmentGuidelines = {
  epds: {
    scoringInstructions: 'Sum responses to all 10 questions',
    interpretationGuidelines: {
      '0-8': 'Low risk for depression',
      '9-11': 'Mild depression possible',
      '12-13': 'Moderate depression likely', 
      '14+': 'Severe depression likely - immediate professional support recommended'
    },
    redFlags: [
      'Any positive response to item 10 (self-harm thoughts)',
      'Score of 14 or higher',
      'Significant distress reported regardless of score'
    ]
  },
  
  safetyProtocols: {
    immediateRisk: [
      'Thoughts of self-harm or suicide',
      'Thoughts of harming the baby with intent',
      'Psychotic symptoms',
      'Severe inability to function'
    ],
    escalationProcedure: [
      'Immediate crisis line contact',
      'Emergency contact notification', 
      'Professional referral within 24 hours',
      'Follow-up safety check within 48 hours'
    ]
  }
};

export default enhancedCourseData;