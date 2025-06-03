'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Menu, X, Activity, Sparkles, Brain, Heart, Shield, Target, Sunrise, Coffee, TreePine } from 'lucide-react';

// Beautiful slide data that matches the comprehensive course content
const slides = [
  {
    id: 1,
    type: 'hero',
    content: {
      title: 'Understanding Behavioral Activation',
      subtitle: 'From Survival to Thriving',
      description: 'If you\'ve made it this far, you\'ve done the deep work of understanding your body and befriending your mind. Now we turn toward rebuilding vitality and joy.',
      background: 'gradient-activation',
      backgroundImage: '/images/biff01_imagine_woman_walking_in_nature_path_trees_and_flowers_dc53f2ba-0c3a-4b5a-a758-62679e547b70_1.png',
      overlay: true
    }
  },
  {
    id: 2,
    type: 'fundamental-truth',
    content: {
      title: 'The Revolutionary Truth',
      subtitle: 'A different approach to feeling better',
      message: 'I know what some of you are thinking: "Joy? I can barely survive each day." And that\'s exactly why we\'re here.',
      truth: 'You don\'t wait to feel better to start doing better. You start doing better to feel better.',
      clarification: 'This isn\'t about forcing positivity - it\'s about understanding the profound connection between what you do and how you feel.',
      wisdom: 'In treating postpartum depression for over 15 years, I\'ve learned: Mood follows action more than action follows mood. Today we harness this wisdom.',
      background: 'gradient-wisdom',
      backgroundImage: '/images/biff01_imagine_woman_in_meditation_pose_serene_environment_br_1f66e17b-a951-4d9f-b895-127fabc89208_3.png'
    }
  },
  {
    id: 3,
    type: 'activity-mood-cycle',
    content: {
      title: 'The Activity-Mood Connection',
      subtitle: 'Understanding the cycles',
      downwardSpiral: {
        title: 'THE DOWNWARD SPIRAL',
        steps: [
          'Depleted mood',
          'Less activity',
          'More isolation',
          'Lower mood',
          'Even less activity'
        ],
        reasons: [
          'Sleep deprivation reduces motivation',
          'Hormonal changes affect reward system',
          'Social isolation increases depression',
          'Loss of previous activities creates grief',
          'Overwhelming responsibilities crowd out joy'
        ]
      },
      neuroscience: 'Your brain\'s reward system (dopamine pathways) needs activation to function well. When you stop doing rewarding activities, these pathways weaken. Your brain literally forgets how to experience pleasure.',
      upwardSpiral: {
        title: 'THE UPWARD SPIRAL',
        steps: [
          'Small positive action',
          'Tiny mood lift',
          'Slightly more energy',
          'Ability for more action',
          'Better mood'
        ]
      },
      hope: 'This isn\'t about dramatic life changes. It\'s about micro-activations that rebuild your capacity for vitality.',
      goal: 'The goal isn\'t constant happiness - it\'s restoring your full emotional range, including the ability to experience pleasure, accomplishment, and connection.',
      background: 'gradient-cycles',
      backgroundImage: '/images/biff01_imagine_woman_writing_in_journal_therapy_workbook_peac_7f6a2636-e20e-44c3-9edf-8de89e48ffc7_0.png'
    }
  },
  {
    id: 4,
    type: 'activity-categories',
    content: {
      title: 'Types of Nourishing Activities',
      subtitle: 'Activities that rebuild vitality fall into four categories',
      categories: [
        {
          title: 'PLEASURE ACTIVITIES',
          subtitle: 'Feed Your Soul',
          icon: '💖',
          activities: [
            'Sensory pleasures: Warm bath, good coffee, soft music',
            'Creative expression: Drawing, singing, crafting',
            'Nature connection: Sunlight, fresh air, plants',
            'Physical pleasure: Gentle movement, stretching, massage'
          ],
          color: 'pink'
        },
        {
          title: 'ACCOMPLISHMENT ACTIVITIES',
          subtitle: 'Build Confidence',
          icon: '🏆',
          activities: [
            'Completing tasks: Organizing one drawer, answering emails',
            'Learning: Reading, podcasts, online courses',
            'Creating: Cooking, writing, making something',
            'Problem-solving: Fixing something, planning ahead'
          ],
          color: 'blue'
        },
        {
          title: 'CONNECTION ACTIVITIES',
          subtitle: 'Combat Isolation',
          icon: '🤝',
          activities: [
            'Intimate sharing: Deep conversation with friend',
            'Community participation: Mom groups, classes, volunteering',
            'Family connection: Quality time with partner/children',
            'Professional connection: Networking, mentoring'
          ],
          color: 'green'
        },
        {
          title: 'MEANING ACTIVITIES',
          subtitle: 'Feed Your Purpose',
          icon: '⭐',
          activities: [
            'Values-based actions: Acting according to your principles',
            'Service: Helping others, contributing to causes',
            'Growth: Personal development, spiritual practice',
            'Legacy building: Creating something lasting'
          ],
          color: 'purple'
        }
      ],
      insight: 'You need activities from ALL four categories for balanced wellbeing. Most exhausted moms focus only on accomplishment, neglecting pleasure, connection, and meaning.',
      background: 'gradient-categories',
      backgroundImage: '/images/biff01_imagine_woman_doing_gentle_yoga_while_baby_plays_on_m_f02d29cf-d33c-474c-bc39-c589f0768d8d_1.png'
    }
  },
  {
    id: 5,
    type: 'self-assessment',
    content: {
      title: 'Identifying Your Current Activity Pattern',
      subtitle: 'Let\'s honestly assess your current activity levels',
      categories: [
        {
          title: 'PLEASURE ACTIVITIES',
          questions: [
            'When did you last do something purely for enjoyment?',
            'What small pleasures have you abandoned since becoming a mom?',
            'What used to bring you joy that feels impossible now?'
          ],
          icon: '💖'
        },
        {
          title: 'ACCOMPLISHMENT ACTIVITIES',
          questions: [
            'Beyond baby care, what gives you a sense of achievement?',
            'What skills or interests have you neglected?',
            'What small wins could you celebrate?'
          ],
          icon: '🏆'
        },
        {
          title: 'CONNECTION ACTIVITIES',
          questions: [
            'How often do you have meaningful conversations?',
            'When did you last feel truly seen and understood?',
            'What relationships need attention?'
          ],
          icon: '🤝'
        },
        {
          title: 'MEANING ACTIVITIES',
          questions: [
            'What matters most to you beyond daily survival?',
            'How are you living according to your values?',
            'What legacy do you want to create?'
          ],
          icon: '⭐'
        }
      ],
      realityCheck: 'If you\'re struggling to answer these questions, that\'s information, not judgment. Early motherhood often involves temporary contraction of activities. This is normal and survivable.',
      assessment: {
        title: 'Most new moms are:',
        levels: [
          'Low on pleasure (survival mode)',
          'Medium on accomplishment (but only baby-related)',
          'Low on connection (isolation common)',
          'Very low on meaning (no bandwidth for bigger picture)'
        ]
      },
      insight: 'Knowing where you are helps you know where to focus.',
      background: 'gradient-assessment',
      backgroundImage: '/images/biff01_imagine_woman_writing_in_journal_therapy_workbook_peac_242c4d8e-9b44-46fd-9453-babbeae35f90_2.png'
    }
  },
  {
    id: 6,
    type: 'barriers-solutions',
    content: {
      title: 'Barriers to Activation and Gentle Solutions',
      subtitle: 'Common barriers and realistic solutions',
      barriers: [
        {
          barrier: 'I don\'t have time',
          solution: 'Start with 5-minute activities',
          examples: [
            '5-minute dance session',
            '5-minute call to a friend',
            '5-minute creative activity',
            '5-minute nature observation'
          ],
          icon: '⏰'
        },
        {
          barrier: 'I don\'t have energy',
          solution: 'Choose low-energy, high-reward activities',
          examples: [
            'Listening to favorite music',
            'Looking at beautiful images',
            'Gentle stretching',
            'Texting a supportive friend'
          ],
          icon: '🔋'
        },
        {
          barrier: 'I feel guilty doing things for myself',
          solution: 'Reframe self-care as family care',
          examples: [
            'My wellbeing benefits my family',
            'I\'m modeling self-care for my children',
            'I can give more when my cup isn\'t empty'
          ],
          icon: '💔'
        },
        {
          barrier: 'Nothing sounds appealing',
          solution: 'Start with previously enjoyed activities',
          examples: [
            'Do them whether you feel like it or not',
            'Start smaller than feels necessary',
            'Trust that enjoyment may return gradually'
          ],
          icon: '😔'
        },
        {
          barrier: 'I should be focused on my baby',
          solution: 'Include baby when possible',
          examples: [
            'Dance with baby',
            'Nature walks with stroller',
            'FaceTime friends while baby plays',
            'Creative activities during baby\'s awake time'
          ],
          icon: '👶'
        }
      ],
      wisdom: 'You don\'t need to feel motivated to take action. Action creates motivation, not the other way around.',
      background: 'gradient-solutions',
      backgroundImage: '/images/biff01_imagine_supportive_womens_group_therapy_session_circle_41bd705b-5dd8-4957-a199-b2fa0530b46f_3.png'
    }
  },
  {
    id: 7,
    type: 'activation-plan',
    content: {
      title: 'Starting Your Activation Practice',
      subtitle: 'This week\'s gentle activation plan',
      phases: [
        {
          phase: 'DAY 1-2: AWARENESS',
          icon: '👁️',
          activities: [
            'Simply notice what activities you do beyond baby care',
            'Track your mood throughout the day (1-10 scale)',
            'Note any correlation between activities and mood'
          ]
        },
        {
          phase: 'DAY 3-4: TINY EXPERIMENTS',
          icon: '🔬',
          activities: [
            'Choose ONE 5-minute pleasure activity daily',
            'Choose ONE small accomplishment activity',
            'Notice any shifts in mood or energy'
          ]
        },
        {
          phase: 'DAY 5-7: GRADUAL EXPANSION',
          icon: '🌱',
          activities: [
            'Add ONE connection activity',
            'Add ONE meaning-based activity',
            'Continue tracking mood and activities'
          ]
        }
      ],
      guideline: 'Choose activities that feel 60% doable, not 100% exciting. We\'re rebuilding capacity, not forcing enthusiasm.',
      examples: [
        'Put on favorite song while feeding baby',
        'Send one appreciative text to a friend',
        'Organize one small space',
        'Step outside for three deep breaths'
      ],
      commitment: 'What ONE tiny activity will you commit to trying this week?',
      background: 'gradient-plan',
      backgroundImage: '/images/biff01_imagine_woman_on_laptop_in_cozy_home_setting_having_vi_65b5942f-d2fb-4103-84e6-722269d37e3b_2.png'
    }
  },
  {
    id: 8,
    type: 'neuroscience-insight',
    content: {
      title: 'The Science of Small Actions',
      subtitle: 'Why tiny changes create big shifts',
      brainFacts: [
        {
          fact: 'Behavioral activation changes brain chemistry',
          detail: 'Even 5 minutes of pleasant activity releases dopamine'
        },
        {
          fact: 'Action strengthens reward pathways',
          detail: 'Each positive activity makes the next one easier'
        },
        {
          fact: 'Movement creates energy',
          detail: 'Physical activity generates, not depletes, energy'
        },
        {
          fact: 'Connection regulates nervous system',
          detail: 'Social activities calm stress response'
        }
      ],
      research: 'Studies show behavioral activation is as effective as medication for mild to moderate depression - and the effects last longer.',
      hope: 'Your brain is designed to respond to positive actions. Even when you don\'t feel like it, your neurobiology will support you.',
      practice: 'Trust the process. Your brain will catch up with your actions.',
      background: 'gradient-science',
      backgroundImage: '/images/biff01_imagine_woman_in_meditation_pose_serene_environment_br_43b6047c-916a-43b2-afc2-5449ec040f7c_1.png'
    }
  },
  {
    id: 9,
    type: 'week-practice',
    content: {
      title: 'Your Week 3 Practice Menu',
      subtitle: 'Choose what resonates with you',
      practices: [
        {
          title: 'Activity-Mood Tracking',
          description: 'Notice the connection between what you do and how you feel',
          duration: 'Throughout day',
          icon: '📊'
        },
        {
          title: 'Daily Micro-Activation',
          description: 'One 5-minute activity from any category',
          duration: '5 minutes',
          icon: '⚡'
        },
        {
          title: 'Pleasure Prescription',
          description: 'One purely enjoyable activity, no matter how small',
          duration: '5-15 minutes',
          icon: '💖'
        },
        {
          title: 'Connection Check-in',
          description: 'Reach out to one person who energizes you',
          duration: '5-10 minutes',
          icon: '🤝'
        },
        {
          title: 'Evening Reflection',
          description: 'What activities helped today? What could help tomorrow?',
          duration: '3 minutes',
          icon: '🌙'
        }
      ],
      reminder: 'Start with just one practice. Success breeds success.',
      encouragement: 'Every small action is a vote for the life you want to create.',
      background: 'gradient-practice',
      backgroundImage: '/images/biff01_imagine_woman_writing_in_journal_therapy_workbook_peac_7f6a2636-e20e-44c3-9edf-8de89e48ffc7_2.png'
    }
  },
  {
    id: 10,
    type: 'bridge-forward',
    content: {
      title: 'What\'s Coming Next',
      subtitle: 'In our next lesson: Rediscovering Joy in Motherhood',
      preview: 'We dive deeper into cultivating joy - not the Instagram version, but real joy that bubbles up from within.',
      topics: [
        'The difference between happiness and joy',
        'Micro-moments of pleasure',
        'Joy as medicine, not luxury',
        'Creating a sustainable joy practice'
      ],
      reminder: 'You\'re not trying to return to your pre-baby activity level. You\'re creating a new, sustainable rhythm that honors both your motherhood and your personhood.',
      truth: 'You\'re not just surviving anymore - you\'re beginning to thrive.',
      closing: 'Your future self will thank you for every tiny step you take today.',
      background: 'gradient-sage-bloom',
      backgroundImage: '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__fe9419f0-6fe7-4ed9-9888-c062989a9600_1.png'
    }
  }
];

export default function Week3Lesson1Page() {
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
      'gradient-activation': 'bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100',
      'gradient-wisdom': 'bg-gradient-to-br from-indigo-100 via-purple-50 to-violet-100',
      'gradient-cycles': 'bg-gradient-to-br from-red-100 via-orange-50 to-yellow-100',
      'gradient-categories': 'bg-gradient-to-br from-emerald-100 via-green-50 to-teal-100',
      'gradient-assessment': 'bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100',
      'gradient-solutions': 'bg-gradient-to-br from-pink-100 via-rose-50 to-red-100',
      'gradient-plan': 'bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100',
      'gradient-science': 'bg-gradient-to-br from-cyan-100 via-blue-50 to-indigo-100',
      'gradient-practice': 'bg-gradient-to-br from-violet-100 via-purple-50 to-indigo-100',
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
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-900/70 via-orange-800/50 to-yellow-700/40" />
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
                <Activity className="w-16 h-16 mx-auto text-white/60" />
              </motion.div>
            </div>
          </div>
        );

      case 'fundamental-truth':
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
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/80 via-purple-50/80 to-violet-100/80" />
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
                  <p className="text-2xl text-slate-700 leading-relaxed mb-8">
                    {slide.content.message}
                  </p>
                  <div className="bg-indigo-100 rounded-2xl p-8">
                    <p className="text-3xl font-playfair text-indigo-800 font-bold text-center">
                      {slide.content.truth}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                >
                  <p className="text-xl text-slate-700 mb-6">
                    {slide.content.clarification}
                  </p>
                  <div className="bg-violet-50 rounded-xl p-6 border-l-4 border-violet-400">
                    <Sparkles className="w-8 h-8 text-violet-600 mb-3" />
                    <p className="text-lg text-violet-800 italic">
                      {slide.content.wisdom}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        );

      case 'activity-mood-cycle':
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
                <div className="absolute inset-0 bg-gradient-to-br from-red-100/80 via-orange-50/80 to-yellow-100/80" />
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
                {/* Downward Spiral */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                >
                  <h3 className="text-2xl font-bold text-red-800 mb-6">{slide.content.downwardSpiral.title}</h3>
                  <div className="space-y-3 mb-6">
                    {slide.content.downwardSpiral.steps.map((step: string, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <p className="text-slate-700">{step}</p>
                        {index < slide.content.downwardSpiral.steps.length - 1 && (
                          <span className="text-red-400">↓</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <h4 className="font-bold text-slate-800 mb-3">Why this happens:</h4>
                  <div className="space-y-2">
                    {slide.content.downwardSpiral.reasons.map((reason: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <p className="text-sm text-slate-700">{reason}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Upward Spiral */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                >
                  <h3 className="text-2xl font-bold text-green-800 mb-6">{slide.content.upwardSpiral.title}</h3>
                  <div className="space-y-3">
                    {slide.content.upwardSpiral.steps.map((step: string, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <p className="text-slate-700">{step}</p>
                        {index < slide.content.upwardSpiral.steps.length - 1 && (
                          <span className="text-green-400">↑</span>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 }}
                  className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-3xl p-8 shadow-xl"
                >
                  <Brain className="w-12 h-12 text-blue-600 mb-4 mx-auto" />
                  <h3 className="text-xl font-bold text-blue-800 mb-3 text-center">Neuroscience Insight</h3>
                  <p className="text-lg text-slate-700 text-center">
                    {slide.content.neuroscience}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="grid md:grid-cols-2 gap-6"
                >
                  <div className="bg-amber-50 rounded-2xl p-6 border-l-4 border-amber-400">
                    <Sparkles className="w-8 h-8 text-amber-600 mb-3" />
                    <p className="text-amber-800">{slide.content.hope}</p>
                  </div>
                  <div className="bg-teal-50 rounded-2xl p-6 border-l-4 border-teal-400">
                    <Target className="w-8 h-8 text-teal-600 mb-3" />
                    <p className="text-teal-800">{slide.content.goal}</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        );

      case 'activity-categories':
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
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/80 via-green-50/80 to-teal-100/80" />
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
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">{category.title}</h3>
                      <p className="text-sm text-emerald-600 italic">{category.subtitle}</p>
                    </div>
                    
                    <div className="space-y-3">
                      {category.activities.map((activity: string, activityIndex: number) => (
                        <motion.div
                          key={activityIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.2 + activityIndex * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <Heart className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />
                          <p className="text-slate-700 text-sm">{activity}</p>
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
                className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-3xl p-8 shadow-xl text-center border-l-8 border-green-400"
              >
                <Shield className="w-16 h-16 mx-auto text-green-600 mb-4" />
                <p className="text-2xl font-bold text-green-800">
                  {slide.content.insight}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'self-assessment':
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
                {slide.content.categories.map((category: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.2 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl"
                  >
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-3">{category.icon}</div>
                      <h3 className="text-xl font-bold text-slate-800">{category.title}</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {category.questions.map((question: string, questionIndex: number) => (
                        <motion.div
                          key={questionIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.2 + questionIndex * 0.1 }}
                          className="p-3 bg-indigo-50 rounded-xl"
                        >
                          <p className="text-slate-700 italic text-sm">{question}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl mb-8"
              >
                <p className="text-xl text-slate-700 text-center mb-6">
                  {slide.content.realityCheck}
                </p>
                
                <div className="bg-blue-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-blue-800 mb-4">{slide.content.assessment.title}</h3>
                  <div className="space-y-2">
                    {slide.content.assessment.levels.map((level: string, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-blue-500">•</span>
                        <p className="text-slate-700">{level}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="text-center bg-gradient-to-r from-indigo-100 to-purple-100 rounded-3xl p-6 shadow-xl"
              >
                <p className="text-2xl font-bold text-indigo-800">
                  {slide.content.insight}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'barriers-solutions':
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
                <div className="absolute inset-0 bg-gradient-to-br from-pink-100/80 via-rose-50/80 to-red-100/80" />
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
                {slide.content.barriers.map((item: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-red-50 p-6 rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="text-3xl">{item.icon}</div>
                          <h3 className="text-xl font-bold text-red-800">Barrier</h3>
                        </div>
                        <p className="text-lg text-red-700 italic">"{item.barrier}"</p>
                      </div>
                      
                      <div className="bg-green-50 p-6 rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                          <Sparkles className="w-8 h-8 text-green-600" />
                          <h3 className="text-xl font-bold text-green-800">Solution</h3>
                        </div>
                        <p className="text-green-700 font-semibold mb-3">{item.solution}</p>
                        <div className="space-y-2">
                          {item.examples.map((example: string, exampleIndex: number) => (
                            <div key={exampleIndex} className="flex items-start gap-2">
                              <span className="text-green-500 mt-1">•</span>
                              <p className="text-sm text-green-700">{example}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-3xl p-8 shadow-xl text-center"
              >
                <Brain className="w-16 h-16 mx-auto text-pink-600 mb-4" />
                <p className="text-2xl font-bold text-pink-800">
                  {slide.content.wisdom}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'activation-plan':
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
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/80 via-amber-50/80 to-orange-100/80" />
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

              <div className="space-y-8 mb-12">
                {slide.content.phases.map((phase: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.2 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-4xl">{phase.icon}</div>
                      <h3 className="text-2xl font-bold text-amber-800">{phase.phase}</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {phase.activities.map((activity: string, activityIndex: number) => (
                        <motion.div
                          key={activityIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.2 + activityIndex * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <Sunrise className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                          <p className="text-slate-700">{activity}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl mb-8"
              >
                <p className="text-xl text-orange-800 font-semibold text-center mb-6">
                  {slide.content.guideline}
                </p>
                
                <div className="bg-amber-50 rounded-2xl p-6">
                  <h4 className="font-bold text-amber-800 mb-4">Examples:</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {slide.content.examples.map((example: string, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <Coffee className="w-5 h-5 text-amber-600 flex-shrink-0" />
                        <p className="text-slate-700">{example}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-3xl p-8 shadow-xl text-center"
              >
                <Target className="w-12 h-12 mx-auto text-orange-600 mb-4" />
                <p className="text-2xl font-bold text-orange-800">
                  {slide.content.commitment}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'neuroscience-insight':
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

              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {slide.content.brainFacts.map((item: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl"
                  >
                    <Brain className="w-10 h-10 text-blue-600 mb-4" />
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{item.fact}</h3>
                    <p className="text-slate-700">{item.detail}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-3xl p-8 shadow-xl mb-8"
              >
                <p className="text-xl text-blue-800 text-center mb-6">
                  {slide.content.research}
                </p>
                <div className="bg-white/60 rounded-2xl p-6">
                  <p className="text-lg text-indigo-800 font-semibold text-center mb-3">
                    {slide.content.hope}
                  </p>
                  <p className="text-indigo-700 text-center italic">
                    {slide.content.practice}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        );

      case 'week-practice':
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

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 }}
                  className="bg-gradient-to-r from-violet-100 to-purple-100 rounded-3xl p-6 shadow-xl text-center"
                >
                  <p className="text-xl font-bold text-violet-800 mb-2">
                    {slide.content.reminder}
                  </p>
                  <p className="text-lg text-purple-700">
                    {slide.content.encouragement}
                  </p>
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
                        <TreePine className="w-5 h-5 text-teal-600 flex-shrink-0" />
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
                    href="/course/week3/lesson2"
                    className="inline-block bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-teal-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Continue to Lesson 2 →
                  </Link>
                  <p className="text-white/80 text-sm">
                    Rediscovering Joy in Motherhood
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
                <h3 className="text-2xl font-bold text-slate-800">Week 3 Lesson 1</h3>
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
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
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
                    ? 'w-12 bg-gradient-to-r from-amber-500 to-orange-500'
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