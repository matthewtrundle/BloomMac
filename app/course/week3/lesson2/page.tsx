'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Menu, X, Heart, Sparkles, Sun, Moon, Coffee, Music, Flower, Gift, Star, Smile } from 'lucide-react';
import CourseAuthWrapper from '@/components/CourseAuthWrapper';

// Beautiful slide data that matches the comprehensive course content
const slides = [
  {
    id: 1,
    type: 'hero',
    content: {
      title: 'Rediscovering Joy in Motherhood',
      subtitle: 'Not the Instagram Version',
      description: 'Today we talk about something that might feel impossible right now: finding joy in your current life. Real joy - the kind that bubbles up from deep inside when you least expect it.',
      background: 'gradient-joy',
      backgroundImage: '/images/biff01_imagine_Latina_mother_playing_peek-a-boo_with_laughing_9f91dae6-b308-42f4-935f-8c0bb0a6d485_0.png',
      overlay: true
    }
  },
  {
    id: 2,
    type: 'revolutionary-insight',
    content: {
      title: 'Joy as Revolution',
      subtitle: 'A radical act of self-preservation',
      statement: 'In a culture that expects mothers to sacrifice everything for their children, choosing joy is an act of revolution.',
      declaration: "It's saying: 'My happiness matters. My vitality serves my family.'",
      clinicalWisdom: [
        "Joy isn't a luxury in early motherhood - it's medicine.",
        "It's what prevents depression from taking root.",
        "It's what helps you show up as the mother you want to be."
      ],
      invitation: 'Today we reclaim your birthright to feel good.',
      background: 'gradient-revolution',
      backgroundImage: '/images/biff01_imagine_confident_single_mother_holding_baby_standing__b3179601-8cbf-4af3-9b29-bedcbc4946a3_0.png'
    }
  },
  {
    id: 3,
    type: 'joy-vs-happiness',
    content: {
      title: 'Understanding Joy vs. Happiness',
      subtitle: 'Let\'s distinguish between happiness and joy',
      comparison: [
        {
          type: 'HAPPINESS',
          icon: '😊',
          traits: [
            'Dependent on circumstances',
            'Temporary and fleeting',
            'Based on external events',
            'Often elusive during difficult times'
          ],
          color: 'yellow'
        },
        {
          type: 'JOY',
          icon: '✨',
          traits: [
            'Available regardless of circumstances',
            'Arises from connection and meaning',
            'Based on internal recognition',
            'Accessible even during challenges'
          ],
          color: 'pink'
        }
      ],
      examples: {
        title: 'Examples of Joy in Motherhood',
        moments: [
          'The weight of your sleeping baby on your chest',
          'Watching your baby discover their hands',
          'The smell of your baby\'s head',
          'Your baby\'s first smile directed at you',
          'The quiet moments of successful soothing',
          'Your own strength in meeting challenges',
          'The love that surprises you with its intensity'
        ]
      },
      blockers: {
        title: 'Joy Blockers in Early Motherhood',
        items: [
          'Exhaustion masking beautiful moments',
          'Anxiety overshadowing present experiences',
          'Comparison stealing gratitude',
          'Overwhelm crowding out awareness',
          'Perfectionism preventing presence'
        ]
      },
      insight: 'Joy is always available - but you need to train your attention to notice it.',
      background: 'gradient-comparison',
      backgroundImage: '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__1c12cc3c-cebd-47e2-ad9b-66b9bbca6480_2.png'
    }
  },
  {
    id: 4,
    type: 'neuroscience-of-joy',
    content: {
      title: 'The Neuroscience of Joy and Gratitude',
      subtitle: 'What happens in your brain when you experience joy',
      neurochemicalChanges: [
        {
          chemical: 'Dopamine',
          effect: 'Motivation and reward',
          icon: '⚡'
        },
        {
          chemical: 'Serotonin',
          effect: 'Mood stability and wellbeing',
          icon: '🌟'
        },
        {
          chemical: 'Oxytocin',
          effect: 'Connection and bonding',
          icon: '💕'
        },
        {
          chemical: 'Endorphins',
          effect: 'Natural pain relief and pleasure',
          icon: '🌈'
        }
      ],
      neuralPathways: [
        'Joy experiences create neural pathways',
        'Repeated joy practices strengthen these pathways',
        'Your brain literally learns to notice more joy',
        'Attention training rewires automatic responses'
      ],
      gratitudePower: {
        title: 'Gratitude\'s Specific Power',
        effects: [
          'Increases left prefrontal cortex activity (positive emotions)',
          'Reduces amygdala reactivity (fear response)',
          'Strengthens neural pathways for optimism',
          'Improves immune function and sleep quality'
        ]
      },
      resilienceConnection: [
        'Joy experiences build emotional reserves',
        'Positive emotions broaden perspective',
        'Pleasant memories become resources during hard times',
        'Joy practices increase stress tolerance'
      ],
      practicalImplication: 'Even 30 seconds of intentional joy noticing changes your brain. This isn\'t wishful thinking - it\'s neuroscience.',
      background: 'gradient-neuroscience',
      backgroundImage: '/images/biff01_imagine_woman_in_meditation_pose_serene_environment_br_1f66e17b-a951-4d9f-b895-127fabc89208_3.png'
    }
  },
  {
    id: 5,
    type: 'micro-moments-practice',
    content: {
      title: 'Micro-Moments of Joy Practice',
      subtitle: 'Joy doesn\'t require dramatic experiences. It lives in micro-moments.',
      categories: [
        {
          title: 'SENSORY JOY',
          icon: '☕',
          moments: [
            'The first sip of warm coffee',
            'Sunlight on your skin',
            'Your baby\'s soft skin against yours',
            'The sound of rain on windows',
            'Fresh air filling your lungs'
          ],
          color: 'amber'
        },
        {
          title: 'CONNECTION JOY',
          icon: '💝',
          moments: [
            'Eye contact with your baby',
            'A hug that lasts three seconds longer',
            'A friend\'s laugh on the phone',
            'Your partner bringing you tea',
            'A stranger\'s smile at the grocery store'
          ],
          color: 'rose'
        },
        {
          title: 'ACCOMPLISHMENT JOY',
          icon: '🎯',
          moments: [
            'Baby successfully napping',
            'A task completed',
            'A problem solved creatively',
            'A moment of successful soothing',
            'Progress noticed'
          ],
          color: 'blue'
        },
        {
          title: 'SPIRITUAL JOY',
          icon: '✨',
          moments: [
            'Feeling connected to something larger',
            'Moments of awe and wonder',
            'Gratitude that takes your breath away',
            'Sensing your baby\'s pure essence',
            'Recognizing your own growth'
          ],
          color: 'purple'
        }
      ],
      practice: {
        title: 'The 3-Breath Joy Practice',
        steps: [
          '1. Notice a pleasant moment',
          '2. Take three conscious breaths',
          '3. Say internally: "This is joy"'
        ]
      },
      assignment: 'Catch 3 micro-moments of joy today. Don\'t create them - just notice them.',
      background: 'gradient-micro-moments',
      backgroundImage: '/images/biff01_imagine_mother_doing_gentle_yoga_while_baby_plays_on_m_f02d29cf-d33c-474c-bc39-c589f0768d8d_1.png'
    }
  },
  {
    id: 6,
    type: 'joy-scheduling',
    content: {
      title: 'Joy Scheduling and Planning',
      subtitle: 'Intentional joy scheduling for exhausted moms',
      dailyAnchors: {
        title: 'DAILY JOY ANCHORS (choose 2)',
        options: [
          'Morning: One thing to look forward to',
          'Midday: One moment of presence',
          'Evening: One gratitude reflection'
        ]
      },
      weeklyInfusions: {
        title: 'WEEKLY JOY INFUSIONS (choose 1)',
        options: [
          'Solo: 30 minutes doing something purely for pleasure',
          'Social: Connection with someone who lights you up',
          'Creative: Making or creating something',
          'Nature: Time outdoors with intention'
        ]
      },
      monthlyInvestments: {
        title: 'MONTHLY JOY INVESTMENTS (plan ahead)',
        options: [
          'Larger experience that feeds your soul',
          'Time with people who truly see you',
          'Activity that connects you to your pre-mom identity',
          'Something you\'ve been wanting to try'
        ]
      },
      emergencyKit: {
        title: 'JOY EMERGENCY KIT (for hard days)',
        items: [
          'List of 10 things that always bring you tiny joy',
          'Photos that make you smile',
          'Songs that lift your spirits',
          'Sensory items (essential oils, soft textures)',
          'Contacts of people who can boost your mood'
        ]
      },
      principles: [
        'Start smaller than you think necessary',
        'Include baby when possible',
        'Don\'t wait for perfect circumstances',
        'Lower the bar for what counts as joy',
        'Celebrate noticing joy, even if you don\'t feel it fully'
      ],
      planningExercise: {
        title: 'Look at this week and identify:',
        prompts: [
          '3 daily moments you could infuse with more joy',
          '1 weekly activity you could add',
          '1 person you could connect with',
          '1 creative/pleasurable activity to try'
        ]
      },
      background: 'gradient-scheduling',
      backgroundImage: '/images/biff01_imagine_woman_on_laptop_in_cozy_home_setting_having_vi_65b5942f-d2fb-4103-84e6-722269d37e3b_0.png'
    }
  },
  {
    id: 7,
    type: 'joy-resistance',
    content: {
      title: 'Overcoming Joy Resistance',
      subtitle: 'Common resistance to joy and loving responses',
      resistances: [
        {
          resistance: "I don't deserve joy when I'm struggling",
          response: 'Joy is medicine for struggle, not a reward for perfection'
        },
        {
          resistance: 'Focusing on joy feels selfish',
          response: 'My joy creates a more positive environment for my family'
        },
        {
          resistance: 'I should be focused on my responsibilities',
          response: 'Joy gives me energy to meet my responsibilities more fully'
        },
        {
          resistance: "I don't have time for joy",
          response: "Joy can be found in moments I'm already living"
        },
        {
          resistance: 'Nothing feels joyful anymore',
          response: 'Practicing joy attention rebuilds my capacity to feel it'
        },
        {
          resistance: 'I feel guilty being happy when my baby is fussy',
          response: 'My emotional regulation helps me respond to baby more skillfully'
        }
      ],
      deeperWork: {
        title: 'If joy feels completely foreign:',
        approaches: [
          'Start with contentment or peace instead',
          'Notice moments of "not-bad" before expecting "good"',
          'Practice appreciation before gratitude',
          'Look for beauty before seeking happiness'
        ]
      },
      gentleInquiry: 'What messages did you learn about joy, pleasure, or happiness growing up? How might these be affecting your current relationship with joy?',
      reframe: 'You learning to experience joy is gift to everyone who loves you.',
      background: 'gradient-resistance',
      backgroundImage: '/images/biff01_imagine_warm_modern_therapy_office_two_women_in_conver_1b19f253-c5eb-4b43-b05c-cabfbbf7c66b_3.png'
    }
  },
  {
    id: 8,
    type: 'week-practices',
    content: {
      title: 'Your Week 3 Joy Practices',
      subtitle: 'Choose what resonates with you',
      practices: [
        {
          title: 'Daily 3-breath joy noticing',
          description: 'Pause to acknowledge pleasant moments',
          duration: '30 seconds',
          icon: '🌸'
        },
        {
          title: 'Weekly joy planning',
          description: 'Schedule one joy-focused activity',
          duration: '5 minutes planning',
          icon: '📅'
        },
        {
          title: 'Joy resistance awareness',
          description: 'Notice and gently respond to resistance',
          duration: 'Throughout day',
          icon: '🔍'
        },
        {
          title: 'Micro-moment appreciation',
          description: 'Actively seek tiny joys',
          duration: 'Ongoing',
          icon: '✨'
        },
        {
          title: 'Emergency joy kit creation',
          description: 'Gather joy resources for hard days',
          duration: '15 minutes once',
          icon: '🎁'
        }
      ],
      affirmations: [
        'I am worthy of joy in all seasons of my life',
        'My joy contributes to my family\'s wellbeing',
        'I can find beauty and pleasure in small moments',
        'Joy is my birthright, not something I have to earn'
      ],
      reminder: 'Joy is not frivolous. Joy is fuel.',
      background: 'gradient-practice',
      backgroundImage: '/images/biff01_imagine_woman_writing_in_journal_therapy_workbook_peac_7f6a2636-e20e-44c3-9edf-8de89e48ffc7_0.png'
    }
  },
  {
    id: 9,
    type: 'commitment-ritual',
    content: {
      title: 'Joy Commitment Ritual',
      subtitle: 'Making a sacred promise to yourself',
      instruction: 'Place your hand on your heart and make this commitment:',
      commitment: 'I commit to noticing joy in my life. I commit to believing I deserve happiness. I commit to seeking and creating moments of pleasure and beauty, knowing this serves not just me, but everyone I love.',
      practices: [
        'Daily 3-breath joy noticing practice',
        'Weekly joy planning and scheduling',
        'Joy resistance awareness and gentle response',
        'Micro-moment appreciation throughout days',
        'Emergency joy kit creation'
      ],
      reflection: 'Which affirmation resonates most deeply with you right now?',
      background: 'gradient-commitment',
      backgroundImage: '/images/biff01_imagine_confident_single_mother_holding_baby_standing__b3179601-8cbf-4af3-9b29-bedcbc4946a3_3.png'
    }
  },
  {
    id: 10,
    type: 'bridge-forward',
    content: {
      title: 'What\'s Coming Next',
      subtitle: 'In our next lesson: Values-Based Living',
      preview: 'We explore creating meaningful activities that align with your deepest values - helping you build a life that feels authentic and purposeful even within the constraints of early motherhood.',
      topics: [
        'Identifying your core values as a mother and individual',
        'Living your values in small, sustainable ways',
        'Creating meaning in everyday moments',
        'Building a values-based activity plan'
      ],
      reminder: 'Joy isn\'t about forcing happiness. It\'s about opening to the full spectrum of human experience with curiosity and compassion.',
      truth: 'Every moment of joy you allow yourself creates ripples of wellbeing for your entire family.',
      closing: 'Your joy matters. Your happiness serves. Your vitality heals.',
      background: 'gradient-sage-bloom',
      backgroundImage: '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__fe9419f0-6fe7-4ed9-9888-c062989a9600_1.png'
    }
  }
];

function Week3Lesson2Content() {
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
      'gradient-joy': 'bg-gradient-to-br from-pink-100 via-rose-50 to-red-100',
      'gradient-revolution': 'bg-gradient-to-br from-purple-100 via-pink-50 to-rose-100',
      'gradient-comparison': 'bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100',
      'gradient-neuroscience': 'bg-gradient-to-br from-indigo-100 via-purple-50 to-violet-100',
      'gradient-micro-moments': 'bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100',
      'gradient-scheduling': 'bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100',
      'gradient-resistance': 'bg-gradient-to-br from-red-100 via-rose-50 to-pink-100',
      'gradient-practice': 'bg-gradient-to-br from-violet-100 via-purple-50 to-indigo-100',
      'gradient-commitment': 'bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100',
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
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-900/70 via-rose-800/50 to-red-700/40" />
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
                <Heart className="w-16 h-16 mx-auto text-white/60" />
              </motion.div>
            </div>
          </div>
        );

      case 'revolutionary-insight':
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
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100/80 via-pink-50/80 to-rose-100/80" />
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
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-xl text-center"
                >
                  <p className="text-2xl text-slate-700 leading-relaxed mb-6">
                    {slide.content.statement}
                  </p>
                  <p className="text-3xl font-playfair text-purple-800 font-bold">
                    {slide.content.declaration}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                >
                  <h3 className="text-2xl font-bold text-rose-800 mb-6 text-center">Clinical Wisdom</h3>
                  <div className="space-y-4">
                    {slide.content.clinicalWisdom.map((wisdom: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <Sparkles className="w-6 h-6 text-rose-500 mt-1 flex-shrink-0" />
                        <p className="text-lg text-slate-700">{wisdom}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 }}
                  className="bg-gradient-to-r from-purple-100 to-rose-100 rounded-3xl p-8 shadow-xl text-center"
                >
                  <p className="text-3xl font-playfair text-purple-800 font-bold">
                    {slide.content.invitation}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        );

      case 'joy-vs-happiness':
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
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/80 via-amber-50/80 to-orange-100/80" />
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
                          className="flex items-start gap-3"
                        >
                          <Sun className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                          <p className="text-slate-700">{trait}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                >
                  <h3 className="text-2xl font-bold text-amber-800 mb-6 text-center">
                    {slide.content.examples.title}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {slide.content.examples.moments.map((moment: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 + index * 0.1 }}
                        className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl"
                      >
                        <Heart className="w-5 h-5 text-amber-600 flex-shrink-0" />
                        <p className="text-slate-700">{moment}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5 }}
                  className="bg-gradient-to-r from-orange-100 to-red-100 rounded-3xl p-8 shadow-xl"
                >
                  <h3 className="text-2xl font-bold text-red-800 mb-6 text-center">
                    {slide.content.blockers.title}
                  </h3>
                  <div className="space-y-3">
                    {slide.content.blockers.items.map((blocker: string, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <Moon className="w-5 h-5 text-red-500" />
                        <p className="text-slate-700">{blocker}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8 }}
                  className="text-center bg-gradient-to-r from-yellow-100 to-orange-100 rounded-3xl p-6 shadow-xl"
                >
                  <Sparkles className="w-12 h-12 mx-auto text-orange-600 mb-4" />
                  <p className="text-2xl font-bold text-orange-800">
                    {slide.content.insight}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        );

      case 'neuroscience-of-joy':
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
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/80 via-purple-50/80 to-violet-100/80" />
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
                {slide.content.neurochemicalChanges.map((item: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{item.icon}</div>
                      <div>
                        <h4 className="text-xl font-bold text-indigo-800">{item.chemical}</h4>
                        <p className="text-slate-700">{item.effect}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                >
                  <h3 className="text-2xl font-bold text-purple-800 mb-6 text-center">Neural Pathway Strengthening</h3>
                  <div className="space-y-3">
                    {slide.content.neuralPathways.map((pathway: string, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <Star className="w-5 h-5 text-purple-500" />
                        <p className="text-slate-700">{pathway}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 }}
                  className="bg-gradient-to-r from-violet-100 to-indigo-100 rounded-3xl p-8 shadow-xl"
                >
                  <h3 className="text-2xl font-bold text-violet-800 mb-6 text-center">
                    {slide.content.gratitudePower.title}
                  </h3>
                  <div className="space-y-3">
                    {slide.content.gratitudePower.effects.map((effect: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <Flower className="w-5 h-5 text-violet-500 mt-1 flex-shrink-0" />
                        <p className="text-slate-700">{effect}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5 }}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                >
                  <h3 className="text-xl font-bold text-indigo-800 mb-4 text-center">The Joy-Resilience Connection</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {slide.content.resilienceConnection.map((item: string, index: number) => (
                      <div key={index} className="p-3 bg-indigo-50 rounded-xl">
                        <p className="text-slate-700">{item}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8 }}
                  className="text-center bg-gradient-to-r from-purple-100 to-indigo-100 rounded-3xl p-8 shadow-xl border-l-8 border-purple-400"
                >
                  <p className="text-2xl font-bold text-purple-800">
                    {slide.content.practicalImplication}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        );

      case 'micro-moments-practice':
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
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100/80 via-orange-50/80 to-yellow-100/80" />
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
                {slide.content.categories.map((category: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.2 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                  >
                    <div className="text-center mb-6">
                      <div className="text-5xl mb-4">{category.icon}</div>
                      <h3 className="text-2xl font-bold text-slate-800">{category.title}</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {category.moments.map((moment: string, momentIndex: number) => (
                        <motion.div
                          key={momentIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.2 + momentIndex * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <Sparkles className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                          <p className="text-slate-700">{moment}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 }}
                className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-3xl p-8 shadow-xl mb-8"
              >
                <h3 className="text-2xl font-bold text-amber-800 mb-6 text-center">
                  {slide.content.practice.title}
                </h3>
                <div className="space-y-3">
                  {slide.content.practice.steps.map((step: string, index: number) => (
                    <div key={index} className="text-center p-3 bg-white/60 rounded-xl">
                      <p className="text-lg text-amber-800">{step}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 }}
                className="text-center bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
              >
                <Gift className="w-12 h-12 mx-auto text-orange-600 mb-4" />
                <p className="text-2xl font-bold text-orange-800">
                  {slide.content.assignment}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'joy-scheduling':
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

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
                    <h3 className="text-xl font-bold text-emerald-800 mb-4">
                      {slide.content.dailyAnchors.title}
                    </h3>
                    <div className="space-y-2">
                      {slide.content.dailyAnchors.options.map((option: string, index: number) => (
                        <div key={index} className="flex items-center gap-3">
                          <Sun className="w-5 h-5 text-emerald-500" />
                          <p className="text-slate-700">{option}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
                    <h3 className="text-xl font-bold text-teal-800 mb-4">
                      {slide.content.weeklyInfusions.title}
                    </h3>
                    <div className="space-y-2">
                      {slide.content.weeklyInfusions.options.map((option: string, index: number) => (
                        <div key={index} className="flex items-center gap-3">
                          <Star className="w-5 h-5 text-teal-500" />
                          <p className="text-slate-700">{option}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-6"
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
                    <h3 className="text-xl font-bold text-green-800 mb-4">
                      {slide.content.monthlyInvestments.title}
                    </h3>
                    <div className="space-y-2">
                      {slide.content.monthlyInvestments.options.map((option: string, index: number) => (
                        <div key={index} className="flex items-center gap-3">
                          <Gift className="w-5 h-5 text-green-500" />
                          <p className="text-slate-700">{option}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-3xl p-6 shadow-xl">
                    <h3 className="text-xl font-bold text-emerald-800 mb-4">
                      {slide.content.emergencyKit.title}
                    </h3>
                    <div className="space-y-2">
                      {slide.content.emergencyKit.items.map((item: string, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          <Heart className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                          <p className="text-slate-700 text-sm">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl mb-8"
              >
                <h3 className="text-xl font-bold text-green-800 mb-4">Sustainable Joy Principles</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {slide.content.principles.map((principle: string, index: number) => (
                    <div key={index} className="p-3 bg-green-50 rounded-xl">
                      <p className="text-slate-700">{principle}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="bg-gradient-to-r from-teal-100 to-green-100 rounded-3xl p-8 shadow-xl text-center"
              >
                <h3 className="text-2xl font-bold text-teal-800 mb-6">
                  {slide.content.planningExercise.title}
                </h3>
                <div className="space-y-3">
                  {slide.content.planningExercise.prompts.map((prompt: string, index: number) => (
                    <p key={index} className="text-lg text-slate-700">• {prompt}</p>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        );

      case 'joy-resistance':
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
                <div className="absolute inset-0 bg-gradient-to-br from-red-100/80 via-rose-50/80 to-pink-100/80" />
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
                {slide.content.resistances.map((item: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-red-50 p-6 rounded-xl">
                        <h4 className="font-bold text-red-800 mb-2">Resistance</h4>
                        <p className="text-red-700 italic">"{item.resistance}"</p>
                      </div>
                      <div className="bg-green-50 p-6 rounded-xl">
                        <h4 className="font-bold text-green-800 mb-2">Response</h4>
                        <p className="text-green-700">{item.response}</p>
                      </div>
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
                <h3 className="text-2xl font-bold text-rose-800 mb-6 text-center">
                  {slide.content.deeperWork.title}
                </h3>
                <div className="space-y-3">
                  {slide.content.deeperWork.approaches.map((approach: string, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <Smile className="w-5 h-5 text-rose-500" />
                      <p className="text-slate-700">{approach}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3 }}
                className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-3xl p-8 shadow-xl text-center"
              >
                <p className="text-xl text-rose-800 mb-6">
                  {slide.content.gentleInquiry}
                </p>
                <p className="text-2xl font-bold text-pink-800">
                  {slide.content.reframe}
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
                <div className="absolute inset-0 bg-gradient-to-br from-violet-100/80 via-purple-50/80 to-indigo-100/80" />
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
                className="bg-gradient-to-r from-purple-100 to-violet-100 rounded-3xl p-8 shadow-xl mb-8"
              >
                <h3 className="text-2xl font-bold text-purple-800 mb-6 text-center">Joy Affirmations</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {slide.content.affirmations.map((affirmation: string, index: number) => (
                    <div key={index} className="p-4 bg-white/60 rounded-xl text-center">
                      <p className="text-purple-800 italic">"{affirmation}"</p>
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
                <Sparkles className="w-12 h-12 mx-auto text-violet-600 mb-4" />
                <p className="text-2xl font-bold text-violet-800">
                  {slide.content.reminder}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'commitment-ritual':
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

            <div className="relative z-10 max-w-6xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16"
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
                transition={{ delay: 0.5 }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl mb-12"
              >
                <p className="text-xl text-rose-800 mb-8">
                  {slide.content.instruction}
                </p>
                <div className="bg-gradient-to-r from-rose-100 to-pink-100 rounded-2xl p-8 mb-8">
                  <Heart className="w-16 h-16 mx-auto text-rose-600 mb-6" />
                  <p className="text-2xl font-playfair text-rose-800 italic leading-relaxed">
                    "{slide.content.commitment}"
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl mb-8"
              >
                <h3 className="text-xl font-bold text-purple-800 mb-4">This Week's Practices:</h3>
                <div className="space-y-2">
                  {slide.content.practices.map((practice: string, index: number) => (
                    <div key={index} className="flex items-center gap-3 justify-center">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <p className="text-slate-700">{practice}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3 }}
                className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 shadow-lg"
              >
                <p className="text-xl text-purple-800">
                  {slide.content.reflection}
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
                        <Star className="w-5 h-5 text-teal-600 flex-shrink-0" />
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
                    href="/course/week3/lesson3"
                    className="inline-block bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-teal-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Continue to Lesson 3 →
                  </Link>
                  <p className="text-white/80 text-sm">
                    Values-Based Living and Meaningful Activities
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
              Lesson 2: {currentSlide + 1} / {slides.length}
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
                <h3 className="text-2xl font-bold text-slate-800">Week 3 Lesson 2</h3>
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
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
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
                    ? 'w-12 bg-gradient-to-r from-pink-500 to-rose-500'
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

export default function Week3Lesson2Page() {
  return (
    <CourseAuthWrapper courseSlug="postpartum-wellness-foundations">
      <Week3Lesson2Content />
    </CourseAuthWrapper>
  );
}