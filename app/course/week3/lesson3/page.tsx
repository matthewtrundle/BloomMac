'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Menu, X, Compass, Heart, Star, Target, Shield, Anchor, Mountain, TreePine, Gem, Layers } from 'lucide-react';
import CourseAuthWrapper from '@/components/CourseAuthWrapper';

// Beautiful slide data that matches the comprehensive course content
const slides = [
  {
    id: 1,
    type: 'hero',
    content: {
      title: 'Values-Based Living',
      subtitle: 'Creating Meaning in Motherhood',
      description: 'In early motherhood, it\'s easy to lose touch with what matters most to you beyond keeping everyone alive. Today we reconnect with your authentic self and begin living from your deepest truths.',
      background: 'gradient-values',
      backgroundImage: '/images/biff01_imagine_woman_walking_in_nature_path_trees_and_flowers_dc53f2ba-0c3a-4b5a-a758-62679e547b70_1.png',
      overlay: true
    }
  },
  {
    id: 2,
    type: 'survival-to-values',
    content: {
      title: 'From Survival to Values',
      subtitle: 'Who are you beyond daily tasks?',
      reality: 'Your world has shrunk to feeding schedules and diaper changes. This isn\'t wrong - it\'s necessary survival.',
      questions: [
        'But there comes a time when you need to remember:',
        'Who are you?',
        'What do you stand for?',
        'How do you want to live?'
      ],
      clinicalInsight: 'Mothers who maintain connection to their core values during the transition show greater resilience, less depression, and more life satisfaction long-term.',
      invitation: 'Today we reconnect with your authentic self and begin living from your deepest truths, even within the constraints of early motherhood.',
      background: 'gradient-emergence',
      backgroundImage: '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__1c12cc3c-cebd-47e2-ad9b-66b9bbca6480_0.png'
    }
  },
  {
    id: 3,
    type: 'values-vs-goals',
    content: {
      title: 'Understanding Core Values',
      subtitle: 'Values are different from goals',
      comparison: [
        {
          type: 'GOALS',
          icon: '🎯',
          traits: [
            'Things you achieve',
            'Have endpoints',
            'Can be completed',
            'External recognition'
          ],
          color: 'blue'
        },
        {
          type: 'VALUES',
          icon: '🧭',
          traits: [
            'Ways you choose to live',
            'Ongoing direction',
            'Never fully achieved',
            'Internal satisfaction'
          ],
          color: 'purple'
        }
      ],
      examples: [
        {
          goal: 'Lose baby weight',
          value: 'Taking care of my body'
        },
        {
          goal: 'Have well-behaved children',
          value: 'Nurturing with love and boundaries'
        }
      ],
      categories: [
        {
          title: 'RELATIONSHIP VALUES',
          items: ['Love, connection, intimacy', 'Loyalty, commitment, trust', 'Community, friendship, family', 'Service, helping, contributing'],
          icon: '💕'
        },
        {
          title: 'PERSONAL GROWTH VALUES',
          items: ['Learning, curiosity, wisdom', 'Creativity, self-expression, beauty', 'Adventure, courage, risk-taking', 'Spirituality, meaning, purpose'],
          icon: '🌱'
        },
        {
          title: 'ACHIEVEMENT VALUES',
          items: ['Excellence, mastery, competence', 'Leadership, influence, impact', 'Independence, self-reliance, freedom', 'Security, stability, order'],
          icon: '⭐'
        },
        {
          title: 'WELLBEING VALUES',
          items: ['Health, vitality, physical care', 'Peace, tranquility, mindfulness', 'Joy, pleasure, fun', 'Balance, moderation, harmony'],
          icon: '🌸'
        }
      ],
      reflection: 'Which values feel most alive for you? Which have you been neglecting?',
      background: 'gradient-understanding',
      backgroundImage: '/images/biff01_imagine_woman_writing_in_journal_therapy_workbook_peac_7f6a2636-e20e-44c3-9edf-8de89e48ffc7_2.png'
    }
  },
  {
    id: 4,
    type: 'values-assessment',
    content: {
      title: 'Values Assessment for New Mothers',
      subtitle: 'Let\'s identify your core values in this season',
      methods: [
        {
          title: 'LIFE REVIEW METHOD',
          icon: '📖',
          prompts: [
            'Think of moments when you felt most alive and authentic',
            'What were you doing?',
            'What values were you living?',
            'What made these moments meaningful?'
          ]
        },
        {
          title: 'ENERGY AUDIT METHOD',
          icon: '⚡',
          prompts: [
            'Consider activities that give you energy vs. drain you',
            'Feel aligned vs. feel forced',
            'Create satisfaction vs. create resentment',
            'What values are present in energizing activities?'
          ]
        },
        {
          title: 'ADMIRATION METHOD',
          icon: '✨',
          prompts: [
            'Think of mothers you admire',
            'What qualities do they embody?',
            'How do they live their values?',
            'What values do you see reflected in their choices?'
          ]
        },
        {
          title: 'REGRET ANALYSIS METHOD',
          icon: '💭',
          prompts: [
            'Consider moments of regret or disappointment',
            'What values were you unable to honor?',
            'What would living your values have looked like?',
            'How can you align more closely going forward?'
          ]
        }
      ],
      motherhoodShifts: {
        title: 'How have your values shifted since becoming a mother?',
        questions: [
          'What values have become MORE important?',
          'What values have become LESS important?',
          'What NEW values have emerged?',
          'What values feel impossible to live right now?'
        ],
        commonShifts: [
          'Safety and protection become paramount',
          'Connection and family move to center',
          'Achievement and recognition may decrease',
          'Present moment awareness increases',
          'Service and nurturing expand',
          'Independence and freedom get redefined'
        ]
      },
      truth: 'This isn\'t loss - it\'s evolution.',
      background: 'gradient-assessment',
      backgroundImage: '/images/biff01_imagine_woman_on_laptop_in_cozy_home_setting_having_vi_65b5942f-d2fb-4103-84e6-722269d37e3b_2.png'
    }
  },
  {
    id: 5,
    type: 'living-values-small',
    content: {
      title: 'Living Values in Small Ways',
      subtitle: 'You don\'t need dramatic life changes to live your values',
      categories: [
        {
          value: 'CONNECTION',
          icon: '🤝',
          actions: [
            'Send one meaningful text daily',
            'Make eye contact during baby care',
            'Share one vulnerable truth with your partner',
            'Call a friend while walking with stroller',
            'Join one mom group or online community'
          ],
          color: 'rose'
        },
        {
          value: 'CREATIVITY',
          icon: '🎨',
          actions: [
            'Take one photo that captures beauty',
            'Hum or sing while doing baby care',
            'Rearrange one space aesthetically',
            'Try one new recipe or combination',
            'Write three sentences about your experience'
          ],
          color: 'purple'
        },
        {
          value: 'LEARNING',
          icon: '📚',
          actions: [
            'Listen to podcasts during feeding',
            'Read one article about something interesting',
            'Ask one question you\'ve been curious about',
            'Watch one educational video',
            'Learn one new thing about child development'
          ],
          color: 'blue'
        },
        {
          value: 'HEALTH',
          icon: '🌿',
          actions: [
            'Take three conscious breaths hourly',
            'Choose one nourishing food daily',
            'Move your body for five minutes',
            'Step outside for fresh air',
            'Prioritize sleep when possible'
          ],
          color: 'green'
        },
        {
          value: 'SERVICE',
          icon: '💝',
          actions: [
            'Offer one act of kindness',
            'Support another mother',
            'Contribute to a cause you care about',
            'Share helpful information',
            'Model values for your children'
          ],
          color: 'amber'
        }
      ],
      principle: 'Values can be lived in 30-second moments. It\'s not about grand gestures - it\'s about conscious choices throughout your day.',
      background: 'gradient-small-ways',
      backgroundImage: '/images/biff01_imagine_mother_doing_gentle_yoga_while_baby_plays_on_m_f02d29cf-d33c-474c-bc39-c589f0768d8d_1.png'
    }
  },
  {
    id: 6,
    type: 'values-activity-plan',
    content: {
      title: 'Creating Your Values-Based Activity Plan',
      subtitle: 'Let\'s create sustainable ways to honor your values',
      steps: [
        {
          number: 1,
          title: 'IDENTIFY YOUR TOP 5 VALUES',
          instruction: 'From our exploration, what are your most important values right now?'
        },
        {
          number: 2,
          title: 'ASSESS CURRENT ALIGNMENT',
          prompts: [
            'For each value, rate 1-10:',
            'How well am I currently living this value?',
            'What obstacles prevent me from living this value?',
            'What small changes could increase alignment?'
          ]
        },
        {
          number: 3,
          title: 'DESIGN MICRO-PRACTICES',
          structure: [
            'For each value, create:',
            'One daily micro-action (30 seconds - 5 minutes)',
            'One weekly practice (15-30 minutes)',
            'One monthly experience (larger time investment)'
          ]
        },
        {
          number: 4,
          title: 'INTEGRATE WITH EXISTING LIFE',
          areas: [
            'How can you infuse values into:',
            'Baby care routines',
            'Household tasks',
            'Self-care activities',
            'Relationships',
            'Rest and leisure'
          ]
        },
        {
          number: 5,
          title: 'CREATE VALUES REMINDERS',
          tools: [
            'Phone wallpaper with your values',
            'Sticky notes with value words',
            'Daily intention setting',
            'Weekly values check-in'
          ]
        }
      ],
      example: {
        value: 'CREATIVITY',
        daily: 'Take one beautiful photo',
        weekly: 'Try one creative cooking experiment',
        monthly: 'Visit a museum or gallery',
        integration: 'Sing to baby, arrange flowers, wear colors you love'
      },
      expectation: 'You won\'t live all values perfectly all the time. The goal is conscious awareness and small, consistent choices.',
      background: 'gradient-planning',
      backgroundImage: '/images/biff01_imagine_woman_writing_in_journal_therapy_workbook_peac_242c4d8e-9b44-46fd-9453-babbeae35f90_2.png'
    }
  },
  {
    id: 7,
    type: 'values-decision-making',
    content: {
      title: 'Values-Based Decision Making',
      subtitle: 'Use your values as a compass for daily decisions',
      filter: {
        title: 'THE VALUES FILTER',
        questions: [
          'Which option better aligns with my values?',
          'How can I honor my values within constraints?',
          'What would living my values look like here?',
          'How can I be true to myself in this situation?'
        ]
      },
      examples: [
        {
          decision: 'SOCIAL INVITATION',
          values: 'Connection vs. Rest',
          response: 'I value both connection and rest. Could we do something low-key that honors both?'
        },
        {
          decision: 'PARTNER CONFLICT',
          values: 'Honesty vs. Harmony',
          response: 'I value our relationship and my own truth. How can I share honestly while staying connected?'
        },
        {
          decision: 'BABY CARE CHOICE',
          values: 'Attachment vs. Independence',
          response: 'How can I respond to my baby\'s needs while also taking care of myself?'
        }
      ],
      boundaries: {
        title: 'VALUES-BASED BOUNDARIES',
        examples: [
          'I value family time, so I won\'t check work emails after 7pm',
          'I value my health, so I need help with night feeds',
          'I value honesty, so I\'ll share when I\'m struggling'
        ]
      },
      practice: 'Think of one current decision you\'re facing. Apply the values filter. What guidance emerges?',
      background: 'gradient-decisions',
      backgroundImage: '/images/biff01_imagine_warm_modern_therapy_office_two_women_in_conver_1b19f253-c5eb-4b43-b05c-cabfbbf7c66b_3.png'
    }
  },
  {
    id: 8,
    type: 'values-legacy',
    content: {
      title: 'Living Your Values Legacy',
      subtitle: 'Your values-based living creates ripple effects',
      impacts: [
        {
          area: 'FOR YOUR CHILDREN',
          effects: [
            'They learn what matters by watching you',
            'They see how to live authentically',
            'They understand that mothers are whole people',
            'They witness values-based decision making'
          ],
          icon: '👶'
        },
        {
          area: 'FOR YOUR RELATIONSHIPS',
          effects: [
            'People know what you stand for',
            'You attract aligned connections',
            'You contribute authentically',
            'You model healthy living'
          ],
          icon: '💑'
        },
        {
          area: 'FOR YOURSELF',
          effects: [
            'You maintain connection to your identity',
            'You experience meaning beyond survival',
            'You build resilience through purpose',
            'You create a life you\'re proud of'
          ],
          icon: '🌟'
        }
      ],
      reflection: {
        title: 'Legacy Reflection',
        prompt: 'Imagine your child as an adult, describing how you lived during their early years:',
        questions: [
          'What values would you want them to say you embodied?',
          'How would you want them to remember your choices?',
          'What legacy do you want to create through your daily living?'
        ]
      },
      commitment: 'Living your values isn\'t selfish - it\'s the greatest gift you can give your family.',
      background: 'gradient-legacy',
      backgroundImage: '/images/biff01_imagine_confident_single_mother_holding_baby_standing__b3179601-8cbf-4af3-9b29-bedcbc4946a3_3.png'
    }
  },
  {
    id: 9,
    type: 'week-practices',
    content: {
      title: 'Your Week 3 Values Practices',
      subtitle: 'Choose what resonates with you',
      practices: [
        {
          title: 'Daily values awareness',
          description: 'Notice when you\'re living your values',
          duration: 'Throughout day',
          icon: '🔍'
        },
        {
          title: 'Weekly values check-in',
          description: 'Assess alignment and adjust',
          duration: '10 minutes',
          icon: '📊'
        },
        {
          title: 'Values micro-actions',
          description: 'One tiny values-based action daily',
          duration: '30 seconds - 5 minutes',
          icon: '✨'
        },
        {
          title: 'Decision-making practice',
          description: 'Use values filter for choices',
          duration: 'As needed',
          icon: '🧭'
        },
        {
          title: 'Legacy reflection',
          description: 'Journal about the life you\'re creating',
          duration: '15 minutes weekly',
          icon: '📝'
        }
      ],
      affirmation: 'I honor my values in small and large ways. I live authentically while adapting to motherhood. My values guide me toward a meaningful life.',
      reminder: 'Start with awareness. Notice when you feel aligned and when you don\'t. This information guides your choices.',
      background: 'gradient-practice',
      backgroundImage: '/images/biff01_imagine_woman_writing_in_journal_therapy_workbook_peac_7f6a2636-e20e-44c3-9edf-8de89e48ffc7_0.png'
    }
  },
  {
    id: 10,
    type: 'bridge-forward',
    content: {
      title: 'What\'s Coming Next',
      subtitle: 'In our final Week 3 lesson: Sustainable Habits',
      preview: 'We integrate everything into sustainable habits for long-term vitality. You\'ll learn to create systems that support your wellbeing automatically, even on the hardest days.',
      topics: [
        'Creating mom-friendly habit systems',
        'The four pillars of sustainable vitality',
        'Troubleshooting common obstacles',
        'Building flexibility into your routines'
      ],
      reminder: 'You\'re not just identifying values - you\'re creating a life aligned with what matters most.',
      truth: 'Every values-based choice you make is shaping the mother you\'re becoming and the childhood your baby will remember.',
      closing: 'Your values are your North Star. Let them guide you home to yourself.',
      background: 'gradient-sage-bloom',
      backgroundImage: '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__fe9419f0-6fe7-4ed9-9888-c062989a9600_1.png'
    }
  }
];

function Week3Lesson3Content() {
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
      'gradient-values': 'bg-gradient-to-br from-indigo-100 via-purple-50 to-violet-100',
      'gradient-emergence': 'bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100',
      'gradient-understanding': 'bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100',
      'gradient-assessment': 'bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100',
      'gradient-small-ways': 'bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100',
      'gradient-planning': 'bg-gradient-to-br from-violet-100 via-purple-50 to-indigo-100',
      'gradient-decisions': 'bg-gradient-to-br from-cyan-100 via-blue-50 to-indigo-100',
      'gradient-legacy': 'bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100',
      'gradient-practice': 'bg-gradient-to-br from-purple-100 via-violet-50 to-indigo-100',
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
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/70 via-purple-800/50 to-violet-700/40" />
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
                <Compass className="w-16 h-16 mx-auto text-white/60" />
              </motion.div>
            </div>
          </div>
        );

      case 'survival-to-values':
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
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100/80 via-orange-50/80 to-yellow-100/80" />
              </div>
            )}

            <div className="relative z-10 max-w-6xl mx-auto">
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

              <div className="space-y-12">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-xl"
                >
                  <p className="text-xl text-slate-700 leading-relaxed mb-8">
                    {slide.content.reality}
                  </p>
                  <div className="space-y-3">
                    {slide.content.questions.map((question: string, index: number) => (
                      <motion.p
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className={`text-2xl ${index === 0 ? 'text-amber-800' : 'text-amber-700 font-playfair font-bold'}`}
                      >
                        {question}
                      </motion.p>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-3xl p-8 shadow-xl"
                >
                  <Shield className="w-12 h-12 text-amber-600 mb-4 mx-auto" />
                  <p className="text-xl text-amber-800 text-center">
                    {slide.content.clinicalInsight}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 }}
                  className="text-center bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                >
                  <p className="text-2xl font-playfair text-orange-800 font-bold">
                    {slide.content.invitation}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        );

      case 'values-vs-goals':
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
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/80 via-indigo-50/80 to-purple-100/80" />
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
                {slide.content.comparison.map((item: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.2 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                  >
                    <div className="text-center mb-6">
                      <div className="text-5xl mb-4">{item.icon}</div>
                      <h3 className="text-2xl font-bold text-slate-800">{item.type}</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {item.traits.map((trait: string, traitIndex: number) => (
                        <motion.div
                          key={traitIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.2 + traitIndex * 0.1 }}
                          className="flex items-center gap-3"
                        >
                          <Target className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                          <p className="text-slate-700">{trait}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl mb-8"
              >
                <h3 className="text-2xl font-bold text-purple-800 mb-6 text-center">Examples</h3>
                <div className="space-y-4">
                  {slide.content.examples.map((example: any, index: number) => (
                    <div key={index} className="grid md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-xl">
                        <p className="text-blue-800"><strong>Goal:</strong> {example.goal}</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-xl">
                        <p className="text-purple-800"><strong>Value:</strong> {example.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {slide.content.categories.map((category: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                    className="bg-gradient-to-br from-white/90 to-indigo-50/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-3xl">{category.icon}</div>
                      <h4 className="text-xl font-bold text-slate-800">{category.title}</h4>
                    </div>
                    <div className="space-y-2">
                      {category.items.map((item: string, itemIndex: number) => (
                        <p key={itemIndex} className="text-sm text-slate-700">{item}</p>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 }}
                className="text-center bg-gradient-to-r from-indigo-100 to-purple-100 rounded-3xl p-6 shadow-xl"
              >
                <p className="text-2xl font-bold text-indigo-800">
                  {slide.content.reflection}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'values-assessment':
        return (
          <div className="relative min-h-screen flex items-center justify-center px-8 py-16 overflow-hidden">
            {/* Background */}
            {slide.content.backgroundImage && (
              <div className="absolute inset-0">
                <Image
                  src={slide.content.backgroundImage}
                  alt="Background"
                  fill
                  className="object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-green-100/80 via-emerald-50/80 to-teal-100/80" />
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

              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {slide.content.methods.map((method: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-3xl">{method.icon}</div>
                      <h3 className="text-xl font-bold text-slate-800">{method.title}</h3>
                    </div>
                    <div className="space-y-2">
                      {method.prompts.map((prompt: string, promptIndex: number) => (
                        <p key={promptIndex} className="text-slate-700 italic">• {prompt}</p>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl mb-8"
              >
                <h3 className="text-2xl font-bold text-emerald-800 mb-6 text-center">
                  {slide.content.motherhoodShifts.title}
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    {slide.content.motherhoodShifts.questions.map((question: string, index: number) => (
                      <div key={index} className="p-3 bg-emerald-50 rounded-xl">
                        <p className="text-emerald-800">{question}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-teal-50 rounded-xl p-6">
                    <h4 className="font-bold text-teal-800 mb-3">Common Shifts:</h4>
                    <div className="space-y-2">
                      {slide.content.motherhoodShifts.commonShifts.map((shift: string, index: number) => (
                        <div key={index} className="flex items-start gap-2">
                          <TreePine className="w-4 h-4 text-teal-600 mt-1 flex-shrink-0" />
                          <p className="text-sm text-teal-700">{shift}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="text-center bg-gradient-to-r from-emerald-100 to-teal-100 rounded-3xl p-8 shadow-xl"
              >
                <Gem className="w-12 h-12 mx-auto text-emerald-600 mb-4" />
                <p className="text-3xl font-playfair text-emerald-800 font-bold">
                  {slide.content.truth}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'living-values-small':
        return (
          <div className="relative min-h-screen flex items-center justify-center px-8 py-16 overflow-hidden">
            {/* Background */}
            {slide.content.backgroundImage && (
              <div className="absolute inset-0">
                <Image
                  src={slide.content.backgroundImage}
                  alt="Background"
                  fill
                  className="object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-rose-100/80 via-pink-50/80 to-purple-100/80" />
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

              <div className="space-y-8 mb-12">
                {slide.content.categories.map((category: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.2 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-4xl">{category.icon}</div>
                      <h3 className="text-2xl font-bold text-slate-800">IF YOU VALUE {category.value}</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {category.actions.map((action: string, actionIndex: number) => (
                        <motion.div
                          key={actionIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.2 + actionIndex * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <Heart className="w-5 h-5 text-rose-500 mt-1 flex-shrink-0" />
                          <p className="text-slate-700">{action}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.8 }}
                className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-8 shadow-xl text-center border-l-8 border-purple-400"
              >
                <Star className="w-16 h-16 mx-auto text-purple-600 mb-4" />
                <p className="text-2xl font-bold text-purple-800">
                  {slide.content.principle}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'values-activity-plan':
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
                <div className="absolute inset-0 bg-gradient-to-br from-violet-100/80 via-purple-50/80 to-indigo-100/80" />
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

              <div className="space-y-6 mb-12">
                {slide.content.steps.map((step: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-violet-500 text-white rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                        {step.number}
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-slate-800 mb-3">{step.title}</h3>
                        {step.instruction && (
                          <p className="text-slate-700 italic mb-3">{step.instruction}</p>
                        )}
                        {(step.prompts || step.structure || step.areas || step.tools) && (
                          <div className="space-y-2">
                            {(step.prompts || step.structure || step.areas || step.tools).map((item: string, itemIndex: number) => (
                              <p key={itemIndex} className="text-slate-700 pl-4">• {item}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                className="bg-gradient-to-r from-violet-100 to-indigo-100 rounded-3xl p-8 shadow-xl mb-8"
              >
                <h3 className="text-xl font-bold text-violet-800 mb-4">Example Integration:</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <p className="text-violet-800"><strong>Value:</strong> {slide.content.example.value}</p>
                    <p className="text-slate-700"><strong>Daily:</strong> {slide.content.example.daily}</p>
                    <p className="text-slate-700"><strong>Weekly:</strong> {slide.content.example.weekly}</p>
                    <p className="text-slate-700"><strong>Monthly:</strong> {slide.content.example.monthly}</p>
                  </div>
                  <div className="bg-white/60 rounded-xl p-4">
                    <p className="text-slate-700"><strong>Integration:</strong> {slide.content.example.integration}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="text-center bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl"
              >
                <p className="text-xl text-violet-800">
                  {slide.content.expectation}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'values-decision-making':
        return (
          <div className="relative min-h-screen flex items-center justify-center px-8 py-16 overflow-hidden">
            {/* Background */}
            {slide.content.backgroundImage && (
              <div className="absolute inset-0">
                <Image
                  src={slide.content.backgroundImage}
                  alt="Background"
                  fill
                  className="object-cover opacity-20"
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
                <h3 className="text-2xl font-bold text-blue-800 mb-6 text-center">
                  {slide.content.filter.title}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {slide.content.filter.questions.map((question: string, index: number) => (
                    <div key={index} className="p-4 bg-blue-50 rounded-xl">
                      <p className="text-blue-800 italic">{question}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <div className="space-y-6 mb-12">
                {slide.content.examples.map((example: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl"
                  >
                    <div className="grid md:grid-cols-3 gap-4 items-center">
                      <div className="bg-cyan-50 p-4 rounded-xl">
                        <p className="font-bold text-cyan-800">{example.decision}</p>
                      </div>
                      <div className="bg-indigo-50 p-4 rounded-xl">
                        <p className="text-indigo-800">{example.values}</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-xl">
                        <p className="text-blue-700 italic">"{example.response}"</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-3xl p-8 shadow-xl mb-8"
              >
                <h3 className="text-2xl font-bold text-cyan-800 mb-6 text-center">
                  {slide.content.boundaries.title}
                </h3>
                <div className="space-y-3">
                  {slide.content.boundaries.examples.map((boundary: string, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-cyan-600 flex-shrink-0" />
                      <p className="text-slate-700 italic">"{boundary}"</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="text-center bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
              >
                <Compass className="w-12 h-12 mx-auto text-blue-600 mb-4" />
                <p className="text-xl text-blue-800">
                  {slide.content.practice}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'values-legacy':
        return (
          <div className="relative min-h-screen flex items-center justify-center px-8 py-16 overflow-hidden">
            {/* Background */}
            {slide.content.backgroundImage && (
              <div className="absolute inset-0">
                <Image
                  src={slide.content.backgroundImage}
                  alt="Background"
                  fill
                  className="object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100/80 via-yellow-50/80 to-orange-100/80" />
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

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {slide.content.impacts.map((impact: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.2 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl"
                  >
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-3">{impact.icon}</div>
                      <h3 className="text-xl font-bold text-slate-800">{impact.area}</h3>
                    </div>
                    
                    <div className="space-y-2">
                      {impact.effects.map((effect: string, effectIndex: number) => (
                        <div key={effectIndex} className="flex items-start gap-2">
                          <Star className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
                          <p className="text-sm text-slate-700">{effect}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl mb-8"
              >
                <h3 className="text-2xl font-bold text-amber-800 mb-6 text-center">
                  {slide.content.reflection.title}
                </h3>
                <p className="text-xl text-slate-700 text-center mb-6 italic">
                  {slide.content.reflection.prompt}
                </p>
                <div className="space-y-3">
                  {slide.content.reflection.questions.map((question: string, index: number) => (
                    <div key={index} className="p-4 bg-amber-50 rounded-xl">
                      <p className="text-amber-800">{question}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="text-center bg-gradient-to-r from-amber-100 to-orange-100 rounded-3xl p-8 shadow-xl"
              >
                <Mountain className="w-16 h-16 mx-auto text-amber-600 mb-4" />
                <p className="text-3xl font-playfair text-amber-800 font-bold">
                  {slide.content.commitment}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'week-practices':
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
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100/80 via-violet-50/80 to-indigo-100/80" />
              </div>
            )}

            <div className="relative z-10 max-w-6xl mx-auto">
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

              <div className="space-y-6 mb-12">
                {slide.content.practices.map((practice: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl"
                  >
                    <div className="flex items-center gap-6">
                      <div className="text-4xl">{practice.icon}</div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">{practice.title}</h3>
                        <p className="text-slate-700 mb-2">{practice.description}</p>
                        <p className="text-sm text-violet-600 font-semibold">{practice.duration}</p>
                      </div>
                      <div className="w-6 h-6 border-2 border-violet-400 rounded flex-shrink-0"></div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                className="bg-gradient-to-r from-violet-100 to-indigo-100 rounded-3xl p-8 shadow-xl mb-8 text-center"
              >
                <p className="text-2xl font-playfair text-violet-800 italic mb-6">
                  "{slide.content.affirmation}"
                </p>
                <p className="text-lg text-indigo-700">
                  {slide.content.reminder}
                </p>
              </motion.div>
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
                        <Layers className="w-5 h-5 text-teal-600 flex-shrink-0" />
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
                    {slide.content.reminder}
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
                    href="/course/week3/lesson4"
                    className="inline-block bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-teal-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Continue to Lesson 4 →
                  </Link>
                  <p className="text-white/80 text-sm">
                    Sustainable Habits for Ongoing Vitality
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
        return null;
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
            href="/course/week3"
            className="text-white/80 hover:text-white bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Week 3
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="text-white/80 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-lg">
              Lesson 3: {currentSlide + 1} / {slides.length}
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
                <h3 className="text-2xl font-bold text-slate-800">Week 3 Lesson 3</h3>
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
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
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
                    ? 'w-12 bg-gradient-to-r from-indigo-500 to-purple-500'
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

export default function Week3Lesson3Page() {
  return (
    <CourseAuthWrapper courseSlug="postpartum-wellness-foundations">
      <Week3Lesson3Content />
    </CourseAuthWrapper>
  );
}