// Weeks 3-6 of the Enhanced Postpartum Wellness Course
// Continuing evidence-based content with CBT, ACT, and mindfulness approaches

export const weeks3to6Content = [
  {
    week: 3,
    title: 'Rebuilding Joy and Meaningful Activities',
    description: 'Behavioral activation techniques to reconnect with pleasure and purpose in daily life',
    clinicalFocus: 'Behavioral activation, activity scheduling, value-based actions',
    estimatedTime: '80 minutes',
    
    lessons: [
      {
        id: 'lesson-3-1',
        number: 9,
        title: 'Understanding Depression and Inactivity',
        duration: '9 min',
        type: 'video',
        description: 'How depression feeds on inactivity and withdrawal - breaking the cycle.',
        keyLearning: 'Understand the relationship between behavior and mood',
        clinicalNotes: 'Behavioral activation theory and depression maintenance cycles'
      },
      {
        id: 'lesson-3-2', 
        number: 10,
        title: 'Rediscovering What Brings You Joy',
        duration: '11 min',
        type: 'video',
        description: 'Identifying activities that nurture your soul, even with a baby.',
        keyLearning: 'Reconnect with personal values and meaningful activities',
        clinicalNotes: 'Values clarification and activity identification'
      },
      {
        id: 'lesson-3-3',
        number: 11,
        title: 'Baby-Inclusive Activities for Wellbeing',
        duration: '8 min',
        type: 'video',
        description: 'Creative ways to engage in self-care and meaningful activities with your baby.',
        keyLearning: 'Practical strategies for maintaining interests as a mother',
        clinicalNotes: 'Realistic behavioral activation with childcare constraints'
      },
      {
        id: 'lesson-3-4',
        number: 12,
        title: 'Building Your Weekly Activity Plan',
        duration: '10 min',
        type: 'video',
        description: 'Creating a sustainable schedule that includes both necessities and nurturing activities.',
        keyLearning: 'Practical planning for behavioral activation',
        clinicalNotes: 'Activity scheduling and graded task assignment'
      }
    ],
    
    workbook: {
      id: 'workbook-3',
      title: 'Week 3: Rebuilding Joy Through Action',
      therapeuticFramework: 'Behavioral activation exercises and activity scheduling',
      estimatedTime: '45-55 minutes',
      
      questions: [
        {
          id: 'w3_values_exploration',
          type: 'values_exercise',
          title: 'Reconnecting with Your Core Values',
          instructions: 'Values are what matter most to you in life. Even when life feels overwhelming, connecting with your values can guide meaningful action.',
          therapeuticPurpose: 'Values clarification for behavioral activation',
          questions: [
            {
              id: 'life_values_ranking',
              text: 'From the list below, choose your top 5 most important life values:',
              type: 'ranking_exercise',
              maxChoices: 5,
              options: [
                'Family relationships',
                'Personal growth',
                'Creativity and self-expression',
                'Health and fitness', 
                'Learning and knowledge',
                'Helping others',
                'Adventure and fun',
                'Spirituality/meaning',
                'Financial security',
                'Independence',
                'Connection and friendship',
                'Achievement and success',
                'Beauty and aesthetics',
                'Justice and fairness',
                'Tradition and heritage'
              ]
            },
            {
              id: 'values_motherhood_connection',
              text: 'How do your top values connect to your role as a mother?',
              placeholder: 'Consider how being a mother might express these values or create new ways to live them...',
              type: 'textarea',
              minChars: 150
            },
            {
              id: 'values_currently_neglected', 
              text: 'Which of your important values feel neglected or ignored right now?',
              type: 'textarea',
              followUp: 'What small action could help you reconnect with one of these values this week?'
            }
          ]
        },
        
        {
          id: 'w3_activity_assessment',
          type: 'behavioral_assessment',
          title: 'Current Activity Patterns',
          instructions: 'Understanding your current activity patterns helps identify areas for positive change.',
          questions: [
            {
              id: 'typical_day_breakdown',
              text: 'Thinking about a typical day, estimate how much time you spend on:',
              type: 'time_allocation',
              categories: [
                { name: 'Baby care (feeding, changing, etc.)', time: 0 },
                { name: 'Household tasks', time: 0 },
                { name: 'Personal care (eating, hygiene)', time: 0 },
                { name: 'Sleep/rest', time: 0 },
                { name: 'Social connection', time: 0 },
                { name: 'Enjoyable activities', time: 0 },
                { name: 'Exercise/movement', time: 0 },
                { name: 'Learning/growth activities', time: 0 }
              ],
              totalHours: 24
            },
            {
              id: 'activity_satisfaction',
              text: 'Rate your satisfaction with how you spend your time in each area (1-10):',
              type: 'satisfaction_rating',
              categories: [
                'Baby care quality',
                'Household management', 
                'Personal self-care',
                'Sleep quality',
                'Social connections',
                'Fun and enjoyment',
                'Physical activity',
                'Personal growth'
              ],
              scale: { min: 1, max: 10 }
            },
            {
              id: 'energy_giving_activities',
              text: 'What activities, even small ones, tend to give you energy or lift your mood?',
              placeholder: 'Examples: hot shower, music, texting a friend, stepping outside, holding baby skin-to-skin...',
              type: 'textarea'
            },
            {
              id: 'energy_draining_activities',
              text: 'What activities consistently drain your energy or worsen your mood?',
              placeholder: 'Be honest about what feels overwhelming or unsustainable...',
              type: 'textarea'
            }
          ]
        },
        
        {
          id: 'w3_pleasant_activities_planning',
          type: 'activity_planning',
          title: 'Pleasant Activities Menu',
          instructions: 'Create a personalized menu of activities that bring you joy, accomplishment, or connection. Include options for different energy levels and time constraints.',
          therapeuticPurpose: 'Activity planning for behavioral activation',
          questions: [
            {
              id: 'quick_mood_boosters',
              text: '5-Minute Mood Boosters (things you can do in 5 minutes or less):',
              type: 'list_builder',
              placeholder: 'Examples: Listen to one favorite song, step outside, deep breathing, text appreciation to someone...',
              minItems: 5,
              suggestions: [
                'Listen to a favorite song',
                'Step outside for fresh air',
                'Practice deep breathing',
                'Look at photos that make you smile',
                'Send an appreciative text',
                'Stretch your body',
                'Pet an animal',
                'Smell something pleasant',
                'Write down one thing you\'re grateful for'
              ]
            },
            {
              id: 'medium_activities',
              text: '15-30 Minute Activities (when you have a bit more time):',
              type: 'list_builder',
              placeholder: 'Examples: Take a shower, call a friend, read, gentle yoga...',
              minItems: 5,
              suggestions: [
                'Take a long, hot shower',
                'Call or video chat with a friend',
                'Read a few pages of a book',
                'Do gentle yoga or stretching',
                'Watch a funny video',
                'Do a creative activity',
                'Organize one small space',
                'Cook or eat something you enjoy',
                'Take a walk (with or without baby)'
              ]
            },
            {
              id: 'longer_activities',
              text: 'Longer Activities (for when you have an hour or more):',
              type: 'list_builder',
              placeholder: 'Examples: Meet a friend, hobby time, exercise class, spa activities...',
              minItems: 3,
              suggestions: [
                'Meet a friend for coffee',
                'Engage in a hobby',
                'Take an exercise class',
                'Have a date with partner',
                'Go to a movie or event',
                'Take a long bath',
                'Work on a creative project',
                'Visit a favorite place'
              ]
            },
            {
              id: 'baby_inclusive_activities',
              text: 'Activities You Can Do WITH Baby:',
              type: 'list_builder',
              placeholder: 'Examples: Walking in nature, visiting a friend, baby-wearing while doing hobbies...',
              minItems: 4,
              suggestions: [
                'Walk in nature or park',
                'Visit friends or family',
                'Baby-wearing while doing light activities',
                'Swimming or water activities',
                'Attend baby-friendly events',
                'Listen to music or audiobooks while nursing',
                'Do yoga with baby nearby',
                'Explore new places together'
              ]
            }
          ]
        },
        
        {
          id: 'w3_weekly_activity_scheduling',
          type: 'scheduling_exercise',
          title: 'Your Weekly Activity Schedule',
          instructions: 'Schedule specific pleasant activities into your week. Start small and be realistic about your energy and time constraints.',
          questions: [
            {
              id: 'weekly_pleasant_activity_goals',
              text: 'This week, I commit to including these pleasant activities:',
              type: 'weekly_scheduler',
              categories: [
                { name: 'Daily 5-minute mood boosters', target: 7, selected: [] },
                { name: 'Medium activities (15-30 min)', target: 3, selected: [] },
                { name: 'Longer activities (1+ hour)', target: 1, selected: [] },
                { name: 'Baby-inclusive activities', target: 2, selected: [] }
              ]
            },
            {
              id: 'activity_obstacles',
              text: 'What obstacles might prevent you from doing these activities?',
              placeholder: 'Consider practical barriers, energy levels, childcare, motivation...',
              type: 'textarea'
            },
            {
              id: 'obstacle_solutions',
              text: 'How can you work around these obstacles?',
              placeholder: 'Brainstorm specific solutions or backup plans...',
              type: 'textarea',
              therapeuticNote: 'Problem-solving for behavioral activation'
            },
            {
              id: 'accountability_plan',
              text: 'How will you remind yourself and stay accountable to these plans?',
              type: 'checkbox_multiple',
              options: [
                'Set phone reminders',
                'Ask partner/friend to check in',
                'Write activities in planner',
                'Track completion daily',
                'Reward yourself for follow-through',
                'Link activities to existing routines',
                'Prepare materials in advance'
              ]
            }
          ]
        },
        
        {
          id: 'w3_accomplishment_activities',
          type: 'mastery_exercise',
          title: 'Building Sense of Accomplishment',
          instructions: 'Activities that give us a sense of mastery and accomplishment are crucial for mental health. These don\'t have to be big - small wins count!',
          therapeuticPurpose: 'Mastery activity identification and planning',
          questions: [
            {
              id: 'recent_accomplishments',
              text: 'What are some things you\'ve accomplished recently, even small ones?',
              placeholder: 'Examples: kept baby fed, did laundry, had a good conversation, learned something new...',
              type: 'textarea',
              minChars: 100
            },
            {
              id: 'skills_before_baby',
              text: 'What skills or abilities did you have before becoming a mother that you\'d like to reconnect with?',
              placeholder: 'Think about work skills, hobbies, talents, knowledge areas...',
              type: 'textarea'
            },
            {
              id: 'new_skills_interest',
              text: 'Are there any new skills you\'d like to develop that fit with your life as a mother?',
              placeholder: 'Consider baby development knowledge, parenting skills, or personal interests...',
              type: 'textarea'
            },
            {
              id: 'weekly_mastery_goals',
              text: 'What small accomplishment goals will you set for this week?',
              type: 'goal_setting',
              goals: [
                { category: 'Personal care', goal: '', specific: '', measurable: '', timeframe: '' },
                { category: 'Household', goal: '', specific: '', measurable: '', timeframe: '' },
                { category: 'Learning/Growth', goal: '', specific: '', measurable: '', timeframe: '' },
                { category: 'Relationship', goal: '', specific: '', measurable: '', timeframe: '' }
              ],
              instructions: 'Make goals specific, measurable, and achievable'
            }
          ]
        }
      ]
    },
    
    meditation: {
      id: 'meditation-3',
      title: 'Loving-Kindness Meditation for Mothers (12 min)',
      description: 'Cultivate compassion for yourself and your family through traditional loving-kindness practice',
      duration: '12 min',
      techniques: ['Loving-kindness', 'Self-compassion', 'Intention setting'],
      instructions: 'A heart-opening practice designed specifically for mothers.'
    }
  },
  
  {
    week: 4,
    title: 'Mindfulness and Anxiety Management',
    description: 'Acceptance and Commitment Therapy (ACT) principles for managing anxiety and living mindfully',
    clinicalFocus: 'ACT techniques, mindfulness skills, anxiety management strategies',
    estimatedTime: '90 minutes',
    
    lessons: [
      {
        id: 'lesson-4-1',
        number: 13,
        title: 'Understanding Postpartum Anxiety',
        duration: '11 min',
        type: 'video',
        description: 'Recognizing anxiety symptoms and understanding their purpose in protecting your baby.',
        keyLearning: 'Normalize anxiety while learning management strategies',
        clinicalNotes: 'Anxiety psychoeducation and normalization'
      },
      {
        id: 'lesson-4-2',
        number: 14,
        title: 'The Difference Between Pain and Suffering',
        duration: '9 min',
        type: 'video', 
        description: 'ACT principle: how resistance to difficult emotions creates additional suffering.',
        keyLearning: 'Understand acceptance vs. resistance in emotional pain',
        clinicalNotes: 'ACT principle of creative hopelessness and acceptance'
      },
      {
        id: 'lesson-4-3',
        number: 15,
        title: 'Mindfulness Skills for Anxious Moments',
        duration: '13 min',
        type: 'video',
        description: 'Practical mindfulness techniques you can use when anxiety arises.',
        keyLearning: 'In-the-moment anxiety management skills',
        clinicalNotes: 'Mindfulness-based anxiety interventions'
      },
      {
        id: 'lesson-4-4',
        number: 16,
        title: 'Creating Space Between You and Your Thoughts',
        duration: '10 min',
        type: 'video',
        description: 'Cognitive defusion techniques to reduce the power of anxious thoughts.',
        keyLearning: 'Develop psychological flexibility with difficult thoughts',
        clinicalNotes: 'ACT cognitive defusion strategies'
      }
    ],
    
    workbook: {
      id: 'workbook-4',
      title: 'Week 4: Mindfulness and Anxiety Mastery',
      therapeuticFramework: 'ACT-based mindfulness and anxiety management techniques',
      estimatedTime: '50-60 minutes',
      
      questions: [
        {
          id: 'w4_anxiety_assessment',
          type: 'clinical_assessment',
          title: 'Understanding Your Anxiety Patterns',
          instructions: 'Anxiety after having a baby is incredibly common. Understanding your patterns helps you respond more skillfully.',
          therapeuticPurpose: 'Anxiety pattern identification and normalization',
          questions: [
            {
              id: 'anxiety_triggers',
              text: 'What situations typically trigger anxiety for you as a new mother?',
              type: 'checkbox_multiple',
              options: [
                'Baby crying for extended periods',
                'Leaving baby with others',
                'Baby sleeping too long/too little',
                'Feeding concerns',
                'Health/development worries',
                'Partner being away',
                'Going out in public with baby',
                'Making parenting decisions',
                'Sleep deprivation',
                'Intrusive thoughts about baby safety'
              ]
            },
            {
              id: 'anxiety_symptoms',
              text: 'How does anxiety show up in your body?',
              type: 'checkbox_multiple',
              options: [
                'Racing heart',
                'Tight chest or shortness of breath',
                'Muscle tension',
                'Headaches',
                'Nausea or stomach issues',
                'Restlessness or trembling',
                'Hot/cold flashes',
                'Racing thoughts',
                'Difficulty concentrating',
                'Sleep disruption'
              ]
            },
            {
              id: 'anxiety_frequency',
              text: 'How often do you experience significant anxiety?',
              type: 'scale',
              scale: { min: 1, max: 7, labels: ['Rarely', 'Several times a week', 'Daily'] },
              followUp: 'On average, how long do these anxiety episodes last?'
            }
          ]
        },
        
        {
          id: 'w4_mindfulness_practice',
          type: 'skill_building_exercise',
          title: 'Building Your Mindfulness Toolkit',
          instructions: 'Mindfulness helps create space between you and anxious thoughts. Let\'s explore what works for you.',
          questions: [
            {
              id: 'current_mindfulness',
              text: 'What mindfulness or calming practices have you tried before (if any)?',
              placeholder: 'Examples: meditation, deep breathing, yoga, prayer, walking in nature...',
              type: 'textarea'
            },
            {
              id: 'present_moment_practice',
              text: 'Ground yourself in this moment: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.',
              type: 'textarea',
              placeholder: 'Take a moment to really notice your surroundings using all your senses...'
            },
            {
              id: 'baby_mindfulness',
              text: 'Choose one routine with your baby to practice mindfulness this week:',
              type: 'radio',
              options: [
                'Mindful feeding - notice baby\'s cues, your breath, the connection',
                'Mindful changing - focus on gentle touch, baby\'s expressions',
                'Mindful bath time - feel the water, notice baby\'s responses',
                'Mindful holding - skin-to-skin with focused attention',
                'Mindful play - be fully present during tummy time or peek-a-boo'
              ],
              followUp: 'What do you hope to notice or experience during these mindful moments?'
            }
          ]
        },
        
        {
          id: 'w4_thought_defusion',
          type: 'act_exercise',
          title: 'Creating Distance from Anxious Thoughts',
          instructions: 'Anxious thoughts feel very real and urgent. ACT teaches us to see thoughts as mental events, not facts.',
          therapeuticPurpose: 'Cognitive defusion and psychological flexibility',
          questions: [
            {
              id: 'sticky_thoughts',
              text: 'What anxious thoughts tend to "stick" in your mind and feel very believable?',
              placeholder: 'Examples: "Something terrible will happen to my baby," "I\'m not doing enough," "I should be enjoying this more..."',
              type: 'textarea',
              minChars: 100
            },
            {
              id: 'thought_defusion_practice',
              text: 'Pick one sticky thought from above and practice relating to it differently:',
              type: 'step_by_step_exercise',
              steps: [
                {
                  instruction: 'Write the thought as it usually appears:',
                  placeholder: 'Example: "I\'m a bad mother"'
                },
                {
                  instruction: 'Now write: "I\'m having the thought that..."',
                  placeholder: 'Example: "I\'m having the thought that I\'m a bad mother"'
                },
                {
                  instruction: 'Now write: "I notice I\'m having the thought that..."',
                  placeholder: 'Example: "I notice I\'m having the thought that I\'m a bad mother"'
                }
              ],
              reflection: 'How does the thought feel different after these exercises?'
            }
          ]
        },
        
        {
          id: 'w4_anxiety_response_plan',
          type: 'coping_plan',
          title: 'Your Personal Anxiety Response Toolkit',
          instructions: 'Create specific strategies for different levels of anxiety so you have a clear plan when worry arises.',
          questions: [
            {
              id: 'mild_anxiety_tools',
              text: 'When anxiety is mild (3-4 out of 10), I will try:',
              type: 'checkbox_multiple',
              options: [
                '4-7-8 breathing (in for 4, hold 7, out for 8)',
                '5-4-3-2-1 grounding (5 things I see, 4 I touch, etc.)',
                'Gentle stretching or movement',
                'Remind myself "This is temporary"',
                'Feel my feet on the floor',
                'Take 3 deep belly breaths',
                'Use a calming affirmation'
              ]
            },
            {
              id: 'moderate_anxiety_tools',
              text: 'When anxiety is moderate (5-7 out of 10), I will:',
              type: 'checkbox_multiple',
              options: [
                'Call my support person',
                'Use a mindfulness app or recording',
                'Take a warm shower or bath',
                'Hold baby skin-to-skin for comfort',
                'Go outside for fresh air',
                'Practice thought defusion exercises',
                'Listen to calming music',
                'Wrap myself in a soft blanket'
              ]
            },
            {
              id: 'severe_anxiety_plan',
              text: 'When anxiety is severe (8-10 out of 10), my emergency plan is:',
              type: 'emergency_plan',
              steps: [
                'First, I will ensure baby is safe (crib, with partner, etc.)',
                'Then I will call this support person: ________________',
                'My emergency calming strategy is: ________________',
                'If episodes become frequent, I will contact my healthcare provider'
              ]
            }
          ]
        }
      ]
    },
    
    meditation: {
      id: 'meditation-4',
      title: 'RAIN Meditation for Anxiety (15 min)',
      description: 'Recognize, Allow, Investigate, Nurture - a complete practice for working with difficult emotions',
      duration: '15 min',
      techniques: ['RAIN technique', 'Self-compassion', 'Acceptance'],
      instructions: 'A gentle way to be with anxiety when it arises.'
    }
  },
  
  {
    week: 5,
    title: 'Relationships and Communication',
    description: 'Strengthening relationships and communication skills during the postpartum transition',
    clinicalFocus: 'Communication skills, boundary setting, relationship maintenance',
    estimatedTime: '85 minutes',
    
    lessons: [
      {
        id: 'lesson-5-1',
        number: 17,
        title: 'How Relationships Change After Baby',
        duration: '10 min',
        type: 'video',
        description: 'Understanding normal relationship adjustments and challenges in the postpartum period.',
        keyLearning: 'Normalize relationship changes and identify areas for improvement',
        clinicalNotes: 'Relationship psychoeducation and expectation setting'
      },
      {
        id: 'lesson-5-2',
        number: 18,
        title: 'Expressing Needs Without Guilt',
        duration: '12 min',
        type: 'video',
        description: 'Learning to communicate your needs clearly and without apologizing for having them.',
        keyLearning: 'Assertive communication and self-advocacy skills',
        clinicalNotes: 'Assertiveness training adapted for postpartum mothers'
      },
      {
        id: 'lesson-5-3',
        number: 19,
        title: 'Setting Healthy Boundaries',
        duration: '11 min',
        type: 'video',
        description: 'Creating boundaries that protect your energy and support your recovery.',
        keyLearning: 'Boundary setting skills for various relationships',
        clinicalNotes: 'Boundary work for postpartum mental health'
      },
      {
        id: 'lesson-5-4',
        number: 20,
        title: 'Rebuilding Intimacy and Connection',
        duration: '9 min',
        type: 'video',
        description: 'Practical strategies for maintaining emotional and physical intimacy after baby.',
        keyLearning: 'Relationship maintenance during major life transition',
        clinicalNotes: 'Couple therapy principles for postpartum adjustment'
      }
    ],
    
    workbook: {
      id: 'workbook-5',
      title: 'Week 5: Strengthening Relationships & Communication',
      therapeuticFramework: 'Communication skills training and boundary setting techniques',
      estimatedTime: '45-55 minutes',
      
      questions: [
        {
          id: 'w5_relationship_assessment',
          type: 'relationship_assessment',
          title: 'Understanding Your Current Relationships',
          instructions: 'Becoming a mother changes all your relationships. Let\'s explore these changes with compassion.',
          questions: [
            {
              id: 'relationship_changes',
              text: 'How have your relationships changed since becoming a mother?',
              type: 'relationship_rating',
              relationships: [
                { type: 'Partner/Spouse', before: 0, now: 0, description: '' },
                { type: 'Your parents', before: 0, now: 0, description: '' },
                { type: 'In-laws', before: 0, now: 0, description: '' },
                { type: 'Close friends', before: 0, now: 0, description: '' },
                { type: 'Siblings', before: 0, now: 0, description: '' },
                { type: 'Work colleagues', before: 0, now: 0, description: '' }
              ],
              scale: { min: 1, max: 10, labels: ['Very strained', 'Very strong'] }
            },
            {
              id: 'support_satisfaction',
              text: 'How satisfied are you with the support you\'re receiving from:',
              type: 'satisfaction_rating',
              categories: [
                'Emotional support',
                'Practical help with baby',
                'Household assistance',
                'Understanding and patience',
                'Respect for your needs',
                'Encouragement and validation'
              ],
              scale: { min: 1, max: 5, labels: ['Very unsatisfied', 'Very satisfied'] }
            }
          ]
        },
        
        {
          id: 'w5_communication_skills',
          type: 'skill_building_exercise',
          title: 'Assertive Communication Practice',
          instructions: 'Learn to express your needs clearly and kindly, without guilt or aggression.',
          therapeuticPurpose: 'Assertiveness training for postpartum mothers',
          questions: [
            {
              id: 'needs_identification',
              text: 'What do you need more of from the important people in your life?',
              type: 'needs_assessment',
              categories: [
                { need: 'More help with baby care', importance: 0, current: 0 },
                { need: 'More emotional support', importance: 0, current: 0 },
                { need: 'More understanding when I\'m struggling', importance: 0, current: 0 },
                { need: 'More help with household tasks', importance: 0, current: 0 },
                { need: 'More patience when I\'m learning', importance: 0, current: 0 },
                { need: 'More time for myself', importance: 0, current: 0 },
                { need: 'More appreciation for what I\'m doing', importance: 0, current: 0 }
              ],
              scales: {
                importance: { min: 1, max: 5, label: 'How important is this?' },
                current: { min: 1, max: 5, label: 'How much are you getting now?' }
              }
            },
            {
              id: 'communication_practice',
              text: 'Practice using "I" statements. Choose your most important need and practice expressing it:',
              type: 'communication_builder',
              template: {
                situation: 'When _______ happens,',
                feeling: 'I feel _______',
                need: 'because I need _______.',
                request: 'Would you be willing to _______?'
              },
              example: {
                situation: 'When you come home and immediately ask what\'s for dinner,',
                feeling: 'I feel overwhelmed and unappreciated',
                need: 'because I need to feel like my day of caring for the baby matters.',
                request: 'Would you be willing to first ask how my day was and thank me?'
              }
            },
            {
              id: 'difficult_conversation',
              text: 'Is there a conversation you\'ve been avoiding? Practice what you might say:',
              type: 'conversation_prep',
              prompts: [
                'The situation I need to address is...',
                'I\'ve been avoiding this because...',
                'What I want the other person to understand is...',
                'The specific change I\'d like to request is...',
                'If they say no or get defensive, I will...'
              ]
            }
          ]
        },
        
        {
          id: 'w5_boundary_setting',
          type: 'boundary_exercise',
          title: 'Creating Healthy Boundaries',
          instructions: 'Boundaries protect your energy and help relationships work better. They\'re acts of self-care, not selfishness.',
          questions: [
            {
              id: 'boundary_assessment',
              text: 'In which areas do you need stronger boundaries?',
              type: 'checkbox_multiple',
              options: [
                'Visits from family/friends',
                'Advice-giving from others',
                'Expectations about entertaining',
                'Pressure to "bounce back" quickly',
                'Comments about your parenting',
                'Help that comes with judgment',
                'Social media comparisons',
                'Work demands during leave',
                'Household perfection standards',
                'Taking care of others\' emotions'
              ]
            },
            {
              id: 'boundary_practice',
              text: 'Practice setting boundaries with kind but clear language:',
              type: 'boundary_scripts',
              scenarios: [
                {
                  situation: 'Someone gives unwanted parenting advice',
                  boundary: 'Thank you for caring. Right now I\'m learning what works for our family.',
                  personal: ''
                },
                {
                  situation: 'Family wants to visit when you\'re not ready',
                  boundary: 'We\'d love to see you. Can we schedule a time that works better for us?',
                  personal: ''
                },
                {
                  situation: 'Partner expects pre-baby standards',
                  boundary: 'I\'m doing my best with a new baby. Can we adjust our expectations?',
                  personal: ''
                },
                {
                  situation: 'Someone offers help but creates more work',
                  boundary: 'I appreciate the offer. What would help most is ______.',
                  personal: ''
                }
              ]
            },
            {
              id: 'boundary_support',
              text: 'What support do you need to maintain these boundaries?',
              type: 'support_planning',
              areas: [
                'Partner backing up my decisions',
                'Scripts for difficult conversations',
                'Reminder that boundaries are healthy',
                'Help saying no without guilt',
                'Someone to practice with',
                'Confidence in my own judgment'
              ]
            }
          ]
        },
        
        {
          id: 'w5_relationship_nurturing',
          type: 'relationship_exercise',
          title: 'Nurturing Important Relationships',
          instructions: 'Even with limited time and energy, small gestures can maintain and strengthen your connections.',
          questions: [
            {
              id: 'relationship_priorities',
              text: 'Which relationships are most important to nurture right now?',
              type: 'relationship_ranking',
              prompt: 'List up to 5 people and rank by priority:',
              maxPeople: 5
            },
            {
              id: 'connection_strategies',
              text: 'What are realistic ways to maintain connection with each priority person?',
              type: 'connection_planning',
              strategies: [
                { time: '5 minutes', ideas: ['Text message', 'Quick call', 'Voice memo', 'Photo share'] },
                { time: '15 minutes', ideas: ['Video chat', 'Coffee together', 'Walk and talk', 'Lunch date'] },
                { time: '1 hour+', ideas: ['Dinner together', 'Activity/outing', 'Deep conversation', 'Quality time'] }
              ],
              commitment: 'This week I will try:'
            },
            {
              id: 'intimacy_rebuilding',
              text: 'For your romantic relationship (if applicable), what feels realistic for reconnection?',
              type: 'intimacy_planning',
              areas: [
                { type: 'Emotional intimacy', ideas: ['Daily check-ins', 'Appreciation sharing', 'Device-free time'] },
                { type: 'Physical affection', ideas: ['Hugging', 'Hand-holding', 'Cuddling', 'Massage'] },
                { type: 'Fun/play', ideas: ['Favorite show together', 'Games', 'Shared hobby', 'Date nights'] },
                { type: 'Sexual intimacy', ideas: ['Open communication', 'Take pressure off', 'Focus on closeness'] }
              ]
            }
          ]
        }
      ]
    },
    
    meditation: {
      id: 'meditation-5',
      title: 'Loving-Kindness for Relationships (12 min)',
      description: 'Extend compassion to yourself and others in your life',
      duration: '12 min',
      techniques: ['Loving-kindness', 'Compassion cultivation', 'Relationship healing'],
      instructions: 'A practice for healing and strengthening your connections with others.'
    }
  },
  
  {
    week: 6,
    title: 'Integration and Thriving Forward',
    description: 'Integrating skills learned and creating a sustainable plan for ongoing wellness',
    clinicalFocus: 'Integration, relapse prevention, future planning, celebration',
    estimatedTime: '75 minutes',
    
    lessons: [
      {
        id: 'lesson-6-1',
        number: 21,
        title: 'Recognizing Your Growth',
        duration: '8 min',
        type: 'video',
        description: 'Celebrating the progress you\'ve made and skills you\'ve developed.',
        keyLearning: 'Acknowledge growth and build confidence',
        clinicalNotes: 'Progress review and confidence building'
      },
      {
        id: 'lesson-6-2',
        number: 22,
        title: 'Creating Your Wellness Maintenance Plan',
        duration: '12 min',
        type: 'video',
        description: 'Developing a sustainable plan for maintaining mental health long-term.',
        keyLearning: 'Long-term wellness planning and relapse prevention',
        clinicalNotes: 'Relapse prevention planning'
      },
      {
        id: 'lesson-6-3',
        number: 23,
        title: 'When to Seek Additional Support',
        duration: '9 min',
        type: 'video',
        description: 'Recognizing when professional help is needed and how to access it.',
        keyLearning: 'Understanding ongoing mental health needs',
        clinicalNotes: 'Treatment escalation and resource connection'
      },
      {
        id: 'lesson-6-4',
        number: 24,
        title: 'Your Vision for Thriving Motherhood',
        duration: '10 min',
        type: 'video',
        description: 'Creating a personal vision for the kind of mother and person you want to continue becoming.',
        keyLearning: 'Future visioning and motivation',
        clinicalNotes: 'Values-based goal setting and motivation'
      }
    ],
    
    workbook: {
      id: 'workbook-6',
      title: 'Week 6: Integration & Creating Your Wellness Plan',
      therapeuticFramework: 'Integration, relapse prevention, and future planning',
      estimatedTime: '55-65 minutes',
      
      questions: [
        {
          id: 'w6_progress_review',
          type: 'progress_assessment',
          title: 'Celebrating Your Growth',
          instructions: 'Take time to acknowledge how far you\'ve come. Growth often happens gradually and we don\'t always notice it.',
          questions: [
            {
              id: 'skills_learned',
              text: 'What skills have you learned or strengthened during this course?',
              type: 'skills_checklist',
              categories: [
                {
                  category: 'Cognitive Skills',
                  skills: ['Challenging negative thoughts', 'Using thought records', 'Recognizing thinking traps', 'Self-compassion']
                },
                {
                  category: 'Emotional Skills',
                  skills: ['Managing anxiety', 'Processing difficult feelings', 'Mindfulness practices', 'Accepting emotions']
                },
                {
                  category: 'Behavioral Skills',
                  skills: ['Activity scheduling', 'Pleasant activity planning', 'Self-care routines', 'Goal setting']
                },
                {
                  category: 'Relationship Skills',
                  skills: ['Assertive communication', 'Boundary setting', 'Asking for help', 'Expressing needs']
                }
              ]
            },
            {
              id: 'most_helpful',
              text: 'What has been most helpful to you from this course?',
              type: 'reflection_ranking',
              options: [
                'Learning I\'m not alone in my struggles',
                'Practical coping strategies',
                'Understanding postpartum mental health',
                'Permission to prioritize self-care',
                'Tools for managing difficult thoughts',
                'Communication and boundary skills',
                'Connection with other mothers',
                'Hope that things can get better'
              ],
              followUp: 'Why was this particularly meaningful for you?'
            },
            {
              id: 'confidence_changes',
              text: 'Rate your confidence in these areas now compared to week 1:',
              type: 'confidence_comparison',
              areas: [
                'Managing difficult emotions',
                'Coping with baby\'s needs',
                'Asking for help when needed',
                'Taking care of yourself',
                'Communicating your needs',
                'Feeling like a good mother',
                'Handling unexpected challenges',
                'Trusting your instincts'
              ],
              scale: { min: 1, max: 10, improvement: true }
            }
          ]
        },
        
        {
          id: 'w6_wellness_plan',
          type: 'planning_exercise',
          title: 'Your Personal Wellness Maintenance Plan',
          instructions: 'Create a sustainable plan for maintaining your mental health beyond this course.',
          therapeuticPurpose: 'Relapse prevention and long-term wellness planning',
          questions: [
            {
              id: 'warning_signs',
              text: 'What are your personal early warning signs that you might be struggling?',
              type: 'warning_signs_checklist',
              categories: [
                {
                  category: 'Emotional Signs',
                  signs: ['Increased anxiety', 'Persistent sadness', 'Feeling overwhelmed', 'Loss of enjoyment', 'Increased irritability']
                },
                {
                  category: 'Physical Signs',
                  signs: ['Sleep problems', 'Appetite changes', 'Low energy', 'Physical tension', 'Getting sick more often']
                },
                {
                  category: 'Behavioral Signs',
                  signs: ['Isolating from others', 'Neglecting self-care', 'Avoiding activities', 'Increased conflict', 'Difficulty making decisions']
                },
                {
                  category: 'Thinking Signs',
                  signs: ['Negative self-talk', 'Catastrophic thinking', 'Self-blame', 'Difficulty concentrating', 'Hopeless thoughts']
                }
              ],
              personalTop3: 'My top 3 warning signs to watch for:'
            },
            {
              id: 'daily_wellness_plan',
              text: 'What will you commit to doing daily for your mental health?',
              type: 'daily_commitment_builder',
              timeBlocks: [
                {
                  time: 'Morning (5 minutes)',
                  options: ['Mindful breathing', 'Gratitude practice', 'Positive intention setting', 'Gentle stretching'],
                  selected: [],
                  custom: ''
                },
                {
                  time: 'Midday check-in (2 minutes)',
                  options: ['Mood check', 'Self-compassion moment', 'Quick grounding', 'Encouraging self-talk'],
                  selected: [],
                  custom: ''
                },
                {
                  time: 'Evening (5 minutes)',
                  options: ['Reflection journaling', 'Day appreciation', 'Progressive relaxation', 'Tomorrow planning'],
                  selected: [],
                  custom: ''
                }
              ]
            },
            {
              id: 'weekly_wellness_plan',
              text: 'What will you commit to doing weekly?',
              type: 'weekly_commitment_checklist',
              options: [
                'One longer self-care activity (30+ minutes)',
                'Connection with supportive friend/family',
                'Pleasant activity or hobby',
                'Physical movement or exercise',
                'Review and plan upcoming week',
                'Practice a skill from the course',
                'Check in with mental health provider',
                'Time in nature or outdoors'
              ],
              commitment: 'I will do _____ of these each week'
            },
            {
              id: 'crisis_plan',
              text: 'When warning signs appear, what will you do?',
              type: 'crisis_response_plan',
              levels: [
                {
                  level: 'Yellow Zone (Mild warning signs)',
                  actions: ['Increase self-care', 'Use coping strategies', 'Reach out to support person', 'Review course materials']
                },
                {
                  level: 'Orange Zone (Moderate symptoms)',
                  actions: ['Contact therapist', 'Increase support', 'Consider medication evaluation', 'Reduce stressors']
                },
                {
                  level: 'Red Zone (Crisis level)',
                  actions: ['Call provider immediately', 'Activate crisis plan', 'Call helpline: 988', 'Go to emergency room if needed']
                }
              ]
            }
          ]
        },
        
        {
          id: 'w6_future_visioning',
          type: 'visioning_exercise',
          title: 'Your Vision for Thriving Motherhood',
          instructions: 'Imagine yourself thriving as a mother. What does that look like? What values guide you?',
          questions: [
            {
              id: 'thriving_vision',
              text: 'When you imagine yourself thriving as a mother in 6 months, what do you see?',
              type: 'vision_description',
              prompts: [
                'How are you feeling day to day?',
                'What is your relationship with your baby like?',
                'How are you taking care of yourself?',
                'What are your relationships like?',
                'What brings you joy and meaning?'
              ],
              minChars: 200
            },
            {
              id: 'core_values',
              text: 'What values do you want to guide your motherhood journey?',
              type: 'values_selection',
              options: [
                'Compassion (for myself and others)',
                'Presence (being fully with my family)',
                'Growth (continuously learning and adapting)',
                'Balance (caring for all parts of my life)',
                'Authenticity (being true to myself)',
                'Connection (nurturing relationships)',
                'Joy (finding lightness and fun)',
                'Resilience (bouncing back from challenges)',
                'Patience (with myself and my baby)',
                'Love (as the foundation for everything)'
              ],
              maxSelections: 5,
              personal: 'Other values important to me:'
            },
            {
              id: 'letter_to_future_self',
              text: 'Write a letter to yourself to read when you\'re having a difficult day:',
              type: 'letter_writing',
              prompts: [
                'What do you want to remind yourself?',
                'What strengths have you discovered?',
                'What would you tell yourself about being a good mother?',
                'What hope do you want to offer yourself?',
                'How far have you already come?'
              ],
              minChars: 300
            }
          ]
        },
        
        {
          id: 'w6_gratitude_and_commitment',
          type: 'completion_exercise',
          title: 'Gratitude & Moving Forward',
          instructions: 'Take a moment to appreciate your journey and commit to your ongoing wellness.',
          questions: [
            {
              id: 'gratitude_reflection',
              text: 'What are you most grateful for from this experience?',
              type: 'gratitude_categories',
              categories: [
                { category: 'About yourself', reflection: '' },
                { category: 'About your support system', reflection: '' },
                { category: 'About your growth', reflection: '' },
                { category: 'About your baby', reflection: '' },
                { category: 'About the journey', reflection: '' }
              ]
            },
            {
              id: 'commitment_statement',
              text: 'Complete this commitment to yourself:',
              type: 'commitment_builder',
              template: {
                promise: 'I promise to continue caring for my mental health by...',
                when_struggling: 'When I\'m struggling, I will remember...',
                support: 'I will reach out for support when...',
                celebration: 'I will celebrate my progress by...'
              }
            },
            {
              id: 'next_steps',
              text: 'What are your specific next steps for continued support?',
              type: 'next_steps_planning',
              options: [
                'Continue individual therapy',
                'Join ongoing support group',
                'Schedule regular check-ins with provider',
                'Connect with other course participants',
                'Find local new mom groups',
                'Set up accountability partner',
                'Schedule 3-month wellness review',
                'Plan regular self-care activities'
              ],
              specific_plans: 'My specific plans are:'
            }
          ]
        }
      ]
    },
    
    meditation: {
      id: 'meditation-6',
      title: 'Integration & Loving Intentions (18 min)',
      description: 'A comprehensive practice bringing together all techniques learned, ending with loving intentions for your journey',
      duration: '18 min',
      techniques: ['Integration practice', 'Loving-kindness', 'Intention setting', 'Future visioning'],
      instructions: 'A culminating practice that honors your growth and sets intentions for your path ahead.'
    }
  }
];

export default weeks3to6Content;