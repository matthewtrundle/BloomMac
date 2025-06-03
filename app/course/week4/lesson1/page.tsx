'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Menu, X, MessageCircle, Heart, Shield, Volume2, Mic, Target, Users, CheckCircle, AlertTriangle, Star, Compass } from 'lucide-react';

// Beautiful slide data for Week 4 Lesson 1
const slides = [
  {
    id: 1,
    type: 'hero',
    content: {
      title: 'Communicating Needs Without Guilt',
      subtitle: 'Your Voice Matters',
      description: 'Learning to ask for what you need isn\'t selfish - it\'s essential. Today we explore how to communicate your needs with confidence, clarity, and without the weight of guilt.',
      background: 'gradient-communication',
      backgroundImage: '/images/biff01_imagine_warm_modern_therapy_office_two_women_in_conver_1b19f253-c5eb-4b43-b05c-cabfbbf7c66b_3.png',
      overlay: true
    }
  },
  {
    id: 2,
    type: 'needs-are-not-selfish',
    content: {
      title: 'Your Needs Are Not Selfish',
      subtitle: 'Reframing the fundamental truth about needs',
      culturalMessages: [
        'Good mothers sacrifice everything for their children',
        'Asking for help means you\'re weak or failing',
        'Your needs should come last',
        'If you were a better mother, you wouldn\'t need help'
      ],
      truthReframes: [
        'Meeting your needs models healthy self-care for your children',
        'Asking for help is a sign of wisdom and strength',
        'Your needs matter as much as everyone else\'s',
        'Needing support is human, not a character flaw'
      ],
      coreInsight: 'Your needs are not selfish - they are information about what you require to be your best self.',
      clinicalWisdom: 'Mothers who clearly communicate their needs experience less resentment, better relationships, and improved mental health.',
      background: 'gradient-truth',
      backgroundImage: '/images/biff01_imagine_confident_single_mother_holding_baby_standing__b3179601-8cbf-4af3-9b29-bedcbc4946a3_0.png'
    }
  },
  {
    id: 3,
    type: 'guilt-cycle',
    content: {
      title: 'Understanding the Guilt Cycle',
      subtitle: 'How guilt keeps you from getting what you need',
      cycle: [
        {
          stage: 'Need Arises',
          description: 'You recognize something you need',
          emotion: 'Awareness',
          color: 'blue'
        },
        {
          stage: 'Guilt Emerges',
          description: 'Internal voices say you shouldn\'t need this',
          emotion: 'Shame',
          color: 'red'
        },
        {
          stage: 'Silence or Apologetic Request',
          description: 'You either don\'t ask or ask while minimizing',
          emotion: 'Frustration',
          color: 'orange'
        },
        {
          stage: 'Need Unmet',
          description: 'Your need remains unaddressed',
          emotion: 'Resentment',
          color: 'purple'
        },
        {
          stage: 'Increased Stress',
          description: 'Stress builds, making you need even more support',
          emotion: 'Depletion',
          color: 'gray'
        }
      ],
      breakingThePattern: 'To break this cycle, we interrupt at stage 2 - catching the guilt and choosing courage instead.',
      guildSources: [
        'Internalized messages about \'good mothers\'',
        'Fear of being seen as demanding or needy',
        'Comparison to other mothers (who also struggle privately)',
        'Belief that struggling means you\'re doing it wrong'
      ],
      healingApproach: 'Guilt is not your moral compass - it\'s often internalized shame that needs healing.',
      background: 'gradient-cycle',
      backgroundImage: '/images/biff01_imagine_woman_in_meditation_pose_serene_environment_br_1f66e17b-a951-4d9f-b895-127fabc89208_1.png'
    }
  },
  {
    id: 4,
    type: 'types-of-needs',
    content: {
      title: 'Understanding Your Different Types of Needs',
      subtitle: 'All needs are valid - let\'s categorize them',
      categories: [
        {
          title: 'PHYSICAL NEEDS',
          icon: '💪',
          color: 'green',
          needs: [
            'Sleep and rest',
            'Nutritious food and time to eat',
            'Physical activity and movement',
            'Medical care and health support',
            'Personal hygiene and self-care time'
          ],
          examples: [
            '"I need 7 hours of sleep to function well"',
            '"I need 30 minutes to eat lunch without interruption"'
          ]
        },
        {
          title: 'EMOTIONAL NEEDS',
          icon: '💝',
          color: 'pink',
          needs: [
            'Understanding and empathy',
            'Appreciation and recognition',
            'Emotional support during hard times',
            'Time to process and feel feelings',
            'Validation of your experience'
          ],
          examples: [
            '"I need you to listen without trying to fix"',
            '"I need acknowledgment for how hard I\'m working"'
          ]
        },
        {
          title: 'PRACTICAL NEEDS',
          icon: '🛠️',
          color: 'blue',
          needs: [
            'Help with household tasks',
            'Childcare support',
            'Time for personal interests',
            'Financial resources',
            'Professional development'
          ],
          examples: [
            '"I need help with dishes three times a week"',
            '"I need two hours on Saturday for myself"'
          ]
        },
        {
          title: 'RELATIONAL NEEDS',
          icon: '🤝',
          color: 'purple',
          needs: [
            'Quality time with partner',
            'Friendship and social connection',
            'Intimacy and affection',
            'Shared decision-making',
            'Respect for your autonomy'
          ],
          examples: [
            '"I need us to talk for 15 minutes daily"',
            '"I need to maintain some friendships"'
          ]
        }
      ],
      reflection: 'Which category of needs do you find hardest to express? Which do you minimize most?',
      validation: 'All of these needs are legitimate and important for your wellbeing.',
      background: 'gradient-needs',
      backgroundImage: '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__1c12cc3c-cebd-47e2-ad9b-66b9bbca6480_0.png'
    }
  },
  {
    id: 5,
    type: 'communication-formula',
    content: {
      title: 'The Clear Communication Formula',
      subtitle: 'A structure for expressing needs effectively',
      formula: {
        title: 'The S.P.E.A.K. Formula',
        steps: [
          {
            letter: 'S',
            word: 'Situation',
            description: 'State the specific situation objectively',
            example: '"When I\'m trying to put the baby down for a nap..."'
          },
          {
            letter: 'P',
            word: 'Personal Impact',
            description: 'Share how this affects you personally',
            example: '"...I feel overwhelmed when the house is loud..."'
          },
          {
            letter: 'E',
            word: 'Emotion',
            description: 'Name your emotion without blame',
            example: '"...and I feel stressed and anxious..."'
          },
          {
            letter: 'A',
            word: 'Ask',
            description: 'Make a clear, specific request',
            example: '"...so I need you to keep noise levels down during nap time."'
          },
          {
            letter: 'K',
            word: 'Kindness',
            description: 'End with appreciation or understanding',
            example: '"I know it\'s hard to remember, and I appreciate your help."'
          }
        ]
      },
      beforeAndAfter: {
        before: {
          title: 'Before (Unclear/Guilt-laden):',
          examples: [
            '"I\'m sorry to bother you, but could you maybe help a little more? I know you\'re tired too..."',
            '"I hate to ask, but I\'m struggling and I feel terrible about it..."',
            '"I should be able to handle this, but..."'
          ]
        },
        after: {
          title: 'After (Clear and Direct):',
          examples: [
            '"When I\'m managing bedtime alone every night, I feel exhausted. I need you to handle bedtime on Tuesday and Thursday. This would help me recharge for the week."',
            '"When the kitchen is left messy overnight, I feel overwhelmed starting my day. I need us to clean up together after dinner. I appreciate you working with me on this."'
          ]
        }
      },
      keyPrinciples: [
        'Be specific rather than general',
        'Focus on the behavior, not the person',
        'Express the impact on you, not what they\'re doing wrong',
        'Ask for what you want, not what you don\'t want',
        'End with connection, not demands'
      ],
      background: 'gradient-formula',
      backgroundImage: '/images/biff01_imagine_woman_writing_in_journal_therapy_workbook_peac_7f6a2636-e20e-44c3-9edf-8de89e48ffc7_2.png'
    }
  },
  {
    id: 6,
    type: 'timing-and-context',
    content: {
      title: 'Timing and Context for Difficult Conversations',
      subtitle: 'When and how to have important discussions',
      timingPrinciples: [
        {
          principle: 'Choose calm moments',
          description: 'Not during stress, arguments, or crisis',
          example: 'Wait until both of you are rested, not during a meltdown'
        },
        {
          principle: 'Plan ahead when possible',
          description: 'For big conversations, give advance notice',
          example: '"I\'d like to talk about childcare arrangements. When works for you this week?"'
        },
        {
          principle: 'Consider the other person\'s state',
          description: 'Are they overwhelmed, tired, or stressed?',
          example: 'If partner just got home from work, wait an hour'
        },
        {
          principle: 'Create privacy',
          description: 'Important conversations need safe space',
          example: 'Not in front of children or other family members'
        }
      ],
      contextConsiderations: [
        {
          context: 'WITH YOUR PARTNER',
          tips: [
            'Schedule regular check-ins for ongoing needs',
            'Start with appreciation before requests',
            'Frame as teamwork, not criticism',
            'Be open to their needs too'
          ]
        },
        {
          context: 'WITH FAMILY/IN-LAWS',
          tips: [
            'Set boundaries early and gently',
            'Use "we" statements when possible',
            'Acknowledge their care while stating limits',
            'Have partner support you when needed'
          ]
        },
        {
          context: 'WITH FRIENDS',
          tips: [
            'Be honest about your capacity',
            'Suggest alternatives when saying no',
            'Express what you can offer',
            'Maintain connection while setting limits'
          ]
        },
        {
          context: 'WITH PROFESSIONALS',
          tips: [
            'Prepare specific questions beforehand',
            'Ask for clarification when needed',
            'Advocate for your preferences',
            'Request time to process information'
          ]
        }
      ],
      redFlags: [
        'Avoid important conversations when emotions are very high',
        'Don\'t have serious talks when either person is exhausted',
        'Avoid public settings for sensitive discussions',
        'Don\'t ambush someone with big requests'
      ],
      background: 'gradient-timing',
      backgroundImage: '/images/biff01_imagine_woman_on_laptop_in_cozy_home_setting_having_vi_65b5942f-d2fb-4103-84e6-722269d37e3b_0.png'
    }
  },
  {
    id: 7,
    type: 'handling-pushback',
    content: {
      title: 'Handling Pushback and Resistance',
      subtitle: 'What to do when people don\'t respond well',
      commonPushback: [
        {
          response: '"You\'re being too demanding"',
          strategy: '"I\'m asking for what I need to be my best self. Let\'s find a solution that works for both of us."',
          approach: 'Stay calm and redirect to problem-solving'
        },
        {
          response: '"Other moms don\'t need this much help"',
          strategy: '"Every family is different. This is what our family needs right now."',
          approach: 'Avoid comparison trap and focus on your reality'
        },
        {
          response: '"I\'m tired too"',
          strategy: '"I understand you\'re tired. How can we both get what we need?"',
          approach: 'Validate and collaborate rather than compete'
        },
        {
          response: '"You should be grateful"',
          strategy: '"I am grateful, and I also have needs. Both can be true."',
          approach: 'Refuse either/or thinking'
        },
        {
          response: '"This is just how it is with babies"',
          strategy: '"Yes, babies are demanding, and we can still support each other better."',
          approach: 'Acknowledge reality while advocating for change'
        }
      ],
      defensiveResponses: {
        title: 'When People Get Defensive',
        strategies: [
          'Stay calm and don\'t take the bait',
          'Acknowledge their feelings without backing down',
          'Return to your core message',
          'Take a break if emotions escalate',
          'Focus on the future, not past grievances'
        ]
      },
      yourRights: [
        'You have the right to ask for what you need',
        'You have the right to be heard and taken seriously',
        'You have the right to have your needs matter',
        'You have the right to set boundaries',
        'You have the right to change your mind about what you need'
      ],
      whenToWalkAway: [
        'If someone becomes verbally abusive',
        'If the conversation becomes circular',
        'If you\'re being gaslit or manipulated',
        'If you need time to think',
        'If emotions are too high to be productive'
      ],
      selfCareAfter: 'After difficult conversations, practice self-compassion. You were brave to speak up.',
      background: 'gradient-resistance',
      backgroundImage: '/images/biff01_imagine_supportive_womens_group_therapy_session_circle_41bd705b-5dd8-4957-a199-b2fa0530b46f_3.png'
    }
  },
  {
    id: 8,
    type: 'boundaries-vs-requests',
    content: {
      title: 'Boundaries vs. Requests',
      subtitle: 'Understanding the difference and when to use each',
      comparison: [
        {
          type: 'REQUESTS',
          definition: 'What you ask others to do',
          characteristics: [
            'Involves other people\'s cooperation',
            'Can be negotiated',
            'Depends on others\' willingness',
            'May require compromise'
          ],
          examples: [
            '"Could you help with bath time tonight?"',
            '"I\'d like us to take turns with night wakings"',
            '"Would you mind keeping your voice down during nap time?"'
          ],
          whenToUse: 'When you need cooperation or help from others',
          color: 'blue'
        },
        {
          type: 'BOUNDARIES',
          definition: 'What you will and won\'t do',
          characteristics: [
            'About your own behavior',
            'Not negotiable',
            'You control them',
            'Protect your wellbeing'
          ],
          examples: [
            '"I won\'t discuss parenting decisions in front of the children"',
            '"I need 30 minutes to myself when you get home before discussing the day"',
            '"I don\'t take parenting advice from people who criticize my choices"'
          ],
          whenToUse: 'When protecting your energy, values, or wellbeing',
          color: 'purple'
        }
      ],
      boundaryStatements: [
        {
          situation: 'Unsolicited parenting advice',
          boundary: '"I\'m not open to advice about this topic."',
          enforcement: 'Change the subject or leave the conversation'
        },
        {
          situation: 'Pressure to attend events when overwhelmed',
          boundary: '"I won\'t commit to social events when I\'m feeling overwhelmed."',
          enforcement: 'Decline invitations that don\'t serve you'
        },
        {
          situation: 'Being interrupted during self-care time',
          boundary: '"Unless it\'s an emergency, I\'m not available during my rest time."',
          enforcement: 'Don\'t respond to non-urgent interruptions'
        },
        {
          situation: 'Guilt trips about your choices',
          boundary: '"I don\'t engage in conversations that make me feel judged."',
          enforcement: 'End conversations that become critical'
        }
      ],
      keyInsight: 'Requests involve asking others to change. Boundaries involve you changing what you will accept.',
      healthyBoundaries: 'Healthy boundaries aren\'t walls - they\'re gates that you control.',
      background: 'gradient-boundaries',
      backgroundImage: '/images/biff01_imagine_cozy_therapy_office_comfortable_armchair_warm__da0354fc-70ec-4bb0-90f7-96e8eb17f2e7_0.png'
    }
  },
  {
    id: 9,
    type: 'script-templates',
    content: {
      title: 'Communication Script Templates',
      subtitle: 'Ready-to-use language for common situations',
      templates: [
        {
          situation: 'ASKING PARTNER FOR HELP',
          script: '"When I\'m managing [specific task] alone repeatedly, I feel overwhelmed and exhausted. I need you to [specific request] on [specific days/times]. This would help me [specific benefit]. Can we make this plan work?"',
          example: '"When I\'m managing bedtime alone every night, I feel exhausted and resentful. I need you to handle bedtime routine on Tuesdays and Thursdays. This would help me recharge and be more present. Can we make this plan work?"'
        },
        {
          situation: 'SETTING BOUNDARIES WITH FAMILY',
          script: '"I appreciate your [concern/help/advice]. Right now, what would be most helpful is [specific request]. I need some space around [boundary topic] to figure out what works for our family."',
          example: '"I appreciate your concern about the baby\'s schedule. Right now, what would be most helpful is support without advice. I need some space around sleep decisions to figure out what works for our family."'
        },
        {
          situation: 'DECLINING SOCIAL INVITATIONS',
          script: '"Thank you for thinking of me. I\'m in a season where I need to be selective about commitments. I can\'t make it to [event], but I\'d love to [alternative suggestion] when things settle down."',
          example: '"Thank you for thinking of me. I\'m in a season where I need to be selective about commitments. I can\'t make it to book club, but I\'d love to grab coffee one-on-one when things settle down."'
        },
        {
          situation: 'ASKING FOR EMOTIONAL SUPPORT',
          script: '"I\'m having a hard time with [situation]. I don\'t need you to fix anything - I just need you to listen and understand. Could you give me [time amount] to share what\'s going on?"',
          example: '"I\'m having a hard time adjusting to motherhood. I don\'t need you to fix anything - I just need you to listen and understand. Could you give me 15 minutes to share what\'s going on?"'
        },
        {
          situation: 'COMMUNICATING PHYSICAL NEEDS',
          script: '"My body needs [specific need] to recover/function well. I need [specific request] to make this happen. This isn\'t optional for my health - it\'s necessary."',
          example: '"My body needs 7 hours of sleep to function well. I need help with night feedings twice a week to make this happen. This isn\'t optional for my health - it\'s necessary."'
        }
      ],
      customizationTips: [
        'Replace bracketed sections with your specific situation',
        'Adjust the tone to match your relationship',
        'Add appreciation when appropriate',
        'Be specific about timing and logistics',
        'Practice saying it out loud before the conversation'
      ],
      rememberThis: 'These are starting points - adapt them to fit your voice and situation.',
      background: 'gradient-scripts',
      backgroundImage: '/images/biff01_imagine_woman_writing_in_journal_therapy_workbook_peac_7f6a2636-e20e-44c3-9edf-8de89e48ffc7_0.png'
    }
  },
  {
    id: 10,
    type: 'self-advocacy-practice',
    content: {
      title: 'Building Your Self-Advocacy Muscle',
      subtitle: 'Practical exercises to strengthen your voice',
      progressiveExercises: [
        {
          level: 'BEGINNER',
          title: 'Start Small and Safe',
          exercises: [
            'Practice saying "I need..." in the mirror',
            'Write down your needs without judgment',
            'Ask for something small from a supportive person',
            'Notice when you minimize your needs in conversation',
            'Practice the S.P.E.A.K. formula on low-stakes situations'
          ],
          example: 'Ask your partner to bring you a glass of water'
        },
        {
          level: 'INTERMEDIATE',
          title: 'Expand Your Comfort Zone',
          exercises: [
            'Have one small boundary conversation weekly',
            'Ask for help with a recurring task',
            'Practice saying no without over-explaining',
            'Share a feeling without apologizing for it',
            'Request a specific type of support'
          ],
          example: 'Ask for help with dishes three times this week'
        },
        {
          level: 'ADVANCED',
          title: 'Address Bigger Issues',
          exercises: [
            'Have a planned conversation about relationship dynamics',
            'Set a boundary with someone who often pushes back',
            'Advocate for yourself in a professional setting',
            'Address a pattern that\'s not working',
            'Ask for what you need even when it feels "too much"'
          ],
          example: 'Discuss redistribution of household responsibilities'
        }
      ],
      dailyPractices: [
        'Notice when you have a need (even if you don\'t express it)',
        'Practice one "I need" statement daily',
        'Celebrate when you speak up, regardless of the outcome',
        'Reflect on what made it easier or harder to communicate',
        'Forgive yourself when you revert to old patterns'
      ],
      affirmations: [
        'My needs are valid and important',
        'I deserve to be heard and supported',
        'Speaking up for myself is a form of self-care',
        'I can ask for what I need with kindness and confidence',
        'My voice matters in my relationships'
      ],
      successMetrics: [
        'You notice needs arising without judgment',
        'You speak up more often than you stay silent',
        'You feel less resentment in your relationships',
        'People respond more positively to your requests',
        'You feel more confident in your relationships'
      ],
      reminder: 'This is a skill that improves with practice. Be patient with yourself as you grow.',
      background: 'gradient-practice',
      backgroundImage: '/images/biff01_imagine_confident_single_mother_holding_baby_standing__b3179601-8cbf-4af3-9b29-bedcbc4946a3_3.png'
    }
  },
  {
    id: 11,
    type: 'week-practices',
    content: {
      title: 'Your Week 4 Communication Practices',
      subtitle: 'Building your voice one conversation at a time',
      practices: [
        {
          title: 'Daily need awareness',
          description: 'Notice and name one need each day',
          duration: '2 minutes',
          icon: '👁️'
        },
        {
          title: 'S.P.E.A.K. formula practice',
          description: 'Use the formula for one small request',
          duration: 'One conversation',
          icon: '🗣️'
        },
        {
          title: 'Boundary setting',
          description: 'Practice one small boundary this week',
          duration: 'As needed',
          icon: '🛡️'
        },
        {
          title: 'Script preparation',
          description: 'Prepare language for one important conversation',
          duration: '10 minutes',
          icon: '📝'
        },
        {
          title: 'Self-advocacy reflection',
          description: 'Journal about communication wins and challenges',
          duration: '5 minutes daily',
          icon: '🪞'
        }
      ],
      affirmation: 'I communicate my needs with clarity, kindness, and confidence. My voice matters and deserves to be heard.',
      reminder: 'Start with the smallest, safest request. Every time you speak up, you\'re building strength.',
      background: 'gradient-practice',
      backgroundImage: '/images/biff01_imagine_woman_writing_in_journal_therapy_workbook_peac_7f6a2636-e20e-44c3-9edf-8de89e48ffc7_0.png'
    }
  },
  {
    id: 12,
    type: 'bridge-forward',
    content: {
      title: 'What\'s Coming Next',
      subtitle: 'In our next lesson: Building Support Systems',
      preview: 'Now that you know how to communicate your needs, we\'ll explore how to build support systems that actually meet those needs - identifying who can help with what, and creating networks that sustain you.',
      topics: [
        'Mapping your current support network',
        'Identifying gaps in your support system',
        'Creating reciprocal relationships',
        'Building professional support teams'
      ],
      connectionToLesson: 'The communication skills you\'ve learned will be essential for building these supportive relationships.',
      truth: 'You\'re not meant to do this alone. Clear communication is the first step toward getting the support you deserve.',
      closing: 'Your voice is powerful. Use it wisely and with confidence.',
      background: 'gradient-sage-bloom',
      backgroundImage: '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__fe9419f0-6fe7-4ed9-9888-c062989a9600_1.png'
    }
  }
];

export default function Week4Lesson1Page() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        previousSlide();
      } else if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlide]);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const previousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsMenuOpen(false);
  };

  const getBackgroundClass = (background: string) => {
    const backgrounds: Record<string, string> = {
      'gradient-communication': 'bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100',
      'gradient-truth': 'bg-gradient-to-br from-emerald-100 via-teal-50 to-green-100',
      'gradient-cycle': 'bg-gradient-to-br from-red-100 via-orange-50 to-yellow-100',
      'gradient-needs': 'bg-gradient-to-br from-purple-100 via-pink-50 to-rose-100',
      'gradient-formula': 'bg-gradient-to-br from-cyan-100 via-blue-50 to-indigo-100',
      'gradient-timing': 'bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100',
      'gradient-resistance': 'bg-gradient-to-br from-rose-100 via-pink-50 to-red-100',
      'gradient-boundaries': 'bg-gradient-to-br from-violet-100 via-purple-50 to-indigo-100',
      'gradient-scripts': 'bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100',
      'gradient-practice': 'bg-gradient-to-br from-indigo-100 via-blue-50 to-cyan-100',
      'gradient-sage-bloom': 'bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-50'
    };
    return backgrounds[background] || 'bg-white';
  };

  const renderSlide = (slide: any) => {
    switch (slide.type) {
      case 'hero':
        return (
          <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            {slide.content.backgroundImage && (
              <div className="absolute inset-0">
                <Image
                  src={slide.content.backgroundImage}
                  alt="Background"
                  fill
                  className="object-cover"
                  priority
                />
                {slide.content.overlay && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-indigo-800/50 to-purple-700/40" />
                )}
              </div>
            )}
            
            {/* Content */}
            <div className="relative z-10 text-center px-8 max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="mb-8"
              >
                <h1 className="text-6xl md:text-8xl font-playfair font-bold text-white mb-6 leading-tight">
                  {slide.content.title}
                </h1>
                <p className="text-3xl md:text-4xl text-white/90 font-light mb-8">
                  {slide.content.subtitle}
                </p>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed"
              >
                {slide.content.description}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
                className="mt-12"
              >
                <MessageCircle className="w-16 h-16 mx-auto text-white/60" />
              </motion.div>
            </div>
          </div>
        );

      case 'needs-are-not-selfish':
        return (
          <div className="relative min-h-screen flex items-center justify-center px-8 overflow-hidden">
            {/* Background */}
            {slide.content.backgroundImage && (
              <div className="absolute inset-0">
                <Image
                  src={slide.content.backgroundImage}
                  alt="Background"
                  fill
                  className="object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/80 via-teal-50/80 to-green-100/80" />
              </div>
            )}

            <div className="relative z-10 max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
              >
                <h1 className="text-5xl md:text-6xl font-playfair text-slate-800 mb-6">
                  {slide.content.title}
                </h1>
                <p className="text-2xl text-slate-600">
                  {slide.content.subtitle}
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-red-50 rounded-3xl p-8 shadow-xl"
                >
                  <h3 className="text-2xl font-bold text-red-800 mb-6 text-center">Cultural Messages</h3>
                  <div className="space-y-4">
                    {slide.content.culturalMessages.map((message: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <AlertTriangle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                        <p className="text-red-700 italic">"{message}"</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-green-50 rounded-3xl p-8 shadow-xl"
                >
                  <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">Truth Reframes</h3>
                  <div className="space-y-4">
                    {slide.content.truthReframes.map((reframe: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                        <p className="text-green-700 font-medium">{reframe}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 }}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl text-center"
                >
                  <Heart className="w-12 h-12 mx-auto text-emerald-600 mb-4" />
                  <p className="text-2xl font-playfair text-emerald-800 font-bold mb-4">
                    {slide.content.coreInsight}
                  </p>
                  <p className="text-lg text-slate-700">
                    {slide.content.clinicalWisdom}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        );

      // Continue with other slide types...
      // For brevity, I'll add a few more key slide types

      case 'communication-formula':
        return (
          <div className="relative min-h-screen flex items-center justify-center px-8 py-16 overflow-hidden">
            {/* Background */}
            {slide.content.backgroundImage && (
              <div className="absolute inset-0">
                <Image
                  src={slide.content.backgroundImage}
                  alt="Background"
                  fill
                  className="object-cover opacity-15"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/80 via-blue-50/80 to-indigo-100/80" />
              </div>
            )}

            <div className="relative z-10 max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
              >
                <h1 className="text-5xl md:text-6xl font-playfair text-slate-800 mb-6">
                  {slide.content.title}
                </h1>
                <p className="text-2xl text-slate-600">
                  {slide.content.subtitle}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl mb-12"
              >
                <h3 className="text-3xl font-bold text-center text-cyan-800 mb-8">
                  {slide.content.formula.title}
                </h3>
                
                <div className="space-y-6">
                  {slide.content.formula.steps.map((step: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-start gap-6 p-4 bg-cyan-50 rounded-xl"
                    >
                      <div className="w-12 h-12 bg-cyan-600 text-white rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                        {step.letter}
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-xl font-bold text-slate-800 mb-2">{step.word}</h4>
                        <p className="text-slate-700 mb-2">{step.description}</p>
                        <p className="text-cyan-700 italic">"{step.example}"</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="bg-red-50 rounded-3xl p-6 shadow-xl"
                >
                  <h4 className="text-lg font-bold text-red-800 mb-4">{slide.content.beforeAndAfter.before.title}</h4>
                  <div className="space-y-3">
                    {slide.content.beforeAndAfter.before.examples.map((example: string, index: number) => (
                      <p key={index} className="text-red-700 italic text-sm">"{example}"</p>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="bg-green-50 rounded-3xl p-6 shadow-xl"
                >
                  <h4 className="text-lg font-bold text-green-800 mb-4">{slide.content.beforeAndAfter.after.title}</h4>
                  <div className="space-y-3">
                    {slide.content.beforeAndAfter.after.examples.map((example: string, index: number) => (
                      <p key={index} className="text-green-700 text-sm">"{example}"</p>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        );

      case 'bridge-forward':
        return (
          <div className="relative min-h-screen flex items-center justify-center px-8 py-16 overflow-hidden">
            {/* Background */}
            {slide.content.backgroundImage && (
              <div className="absolute inset-0">
                <Image
                  src={slide.content.backgroundImage}
                  alt="Background"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/60 via-teal-800/40 to-cyan-700/30" />
              </div>
            )}

            <div className="relative z-10 max-w-5xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16"
              >
                <h1 className="text-5xl md:text-6xl font-playfair text-white mb-6">
                  {slide.content.title}
                </h1>
                <p className="text-2xl text-white/90">
                  {slide.content.subtitle}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl mb-12"
              >
                <p className="text-xl text-slate-700 leading-relaxed mb-8">
                  {slide.content.preview}
                </p>
                
                <div className="bg-teal-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-teal-800 mb-4">Topics include:</h3>
                  <div className="space-y-2">
                    {slide.content.topics.map((topic: string, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-teal-600 flex-shrink-0" />
                        <p className="text-slate-700">{topic}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="space-y-8"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                  <p className="text-xl text-slate-700 mb-4">
                    {slide.content.connectionToLesson}
                  </p>
                  <p className="text-2xl font-playfair text-teal-800 mb-4">
                    {slide.content.truth}
                  </p>
                  <p className="text-xl text-slate-600 italic">
                    {slide.content.closing}
                  </p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8 }}
                  className="mt-8 space-y-4"
                >
                  <Link
                    href="/course/week4/lesson2"
                    className="inline-block bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-teal-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Continue to Lesson 2 →
                  </Link>
                  <p className="text-white/80 text-sm">
                    Building Support Systems That Actually Support
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.2 }}
                  className="mt-12"
                >
                  <Image
                    src="/images/Logo/BLOOM-LOGO.png"
                    alt="Bloom Psychology"
                    width={200}
                    height={80}
                    className="mx-auto opacity-80"
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        );

      default:
        return (
          <div className="relative min-h-screen flex items-center justify-center px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">
                Slide Type: {slide.type}
              </h2>
              <p className="text-xl text-slate-600">
                {slide.content.title}
              </p>
            </div>
          </div>
        );
    }
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className={`absolute inset-0 transition-all duration-700 ${getBackgroundClass(currentSlideData.content.background)}`} />

      {/* Navigation Header */}
      <div className="absolute top-0 left-0 right-0 z-50 p-6">
        <div className="flex justify-between items-center">
          <Link 
            href="/course/week4"
            className="text-white/80 hover:text-white bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Week 4
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="text-white/80 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-lg">
              Lesson 1: {currentSlide + 1} / {slides.length}
            </span>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 bg-black/20 backdrop-blur-sm hover:bg-black/30 rounded-lg transition-colors text-white"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Slide Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed right-0 top-0 bottom-0 w-96 bg-white/95 backdrop-blur-lg shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-slate-800">Week 4 Lesson 1</h3>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-3">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    onClick={() => goToSlide(index)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      index === currentSlide
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                        : 'hover:bg-gray-50 text-slate-700'
                    }`}
                  >
                    <span className="font-semibold">Slide {index + 1}</span>
                    <p className="text-sm opacity-80 mt-1 line-clamp-2">
                      {slide.content.title}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          {renderSlide(currentSlideData)}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center gap-6 bg-white/90 backdrop-blur-lg rounded-full shadow-xl px-8 py-4">
          <button
            onClick={previousSlide}
            disabled={currentSlide === 0}
            className="p-3 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'w-12 bg-gradient-to-r from-blue-500 to-indigo-500'
                    : 'w-3 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="p-3 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="fixed bottom-4 right-4 text-sm text-white/60 bg-black/20 backdrop-blur-sm px-3 py-2 rounded-lg">
        Use arrow keys or click to navigate
      </div>
    </div>
  );
}