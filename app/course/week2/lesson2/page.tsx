'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Menu, X, Unlink, Zap, Music, MessageCircle, Brain, Eye, Lightbulb, Target, Layers } from 'lucide-react';

// Beautiful slide data that matches the comprehensive course content
const slides = [
  {
    id: 1,
    type: 'hero',
    content: {
      title: 'Cognitive Defusion',
      subtitle: 'Unhooking from Difficult Thoughts',
      description: 'Last lesson we learned to observe thoughts. Today we learn to unhook from the ones that hurt.',
      background: 'gradient-defusion',
      backgroundImage: '/images/biff01_imagine_woman_stepping_through_doorway_from_dark_to_li_a0dd90d9-93fe-4093-bb13-8292822c7efd_1.png',
      overlay: true
    }
  },
  {
    id: 2,
    type: 'fusion-vs-freedom',
    content: {
      title: 'From Fusion to Freedom',
      subtitle: 'Understanding cognitive fusion',
      definition: 'Cognitive fusion is when we\'re so tangled up in our thoughts that we can\'t see they\'re just thoughts. It\'s like being inside a fishbowl instead of looking at the fishbowl from outside.',
      examples: [
        {
          fused: 'I\'m a bad mother',
          defused: 'I\'m having the thought that I\'m a bad mother',
          type: 'judgment'
        },
        {
          fused: 'This is too hard',
          defused: 'I notice my mind saying this is too hard',
          type: 'overwhelm'
        },
        {
          fused: 'I\'ll never get better at this',
          defused: 'My mind is telling the story that I\'ll never improve',
          type: 'prediction'
        }
      ],
      truth: 'Defusion creates space. Space creates choice. Choice creates freedom.',
      background: 'gradient-liberation',
      backgroundImage: '/images/biff01_imagine_woman_surrounded_by_swirling_soft_colors_repre_1753025f-240b-48a0-ba54-d8909143a0e3_1.png'
    }
  },
  {
    id: 3,
    type: 'cognitive-distortions',
    content: {
      title: 'The Top 5 Postpartum Cognitive Distortions',
      subtitle: 'Let\'s name the most common thinking traps',
      distortions: [
        {
          title: 'All-or-Nothing Thinking',
          icon: '⚖️',
          examples: [
            'If I\'m not perfect, I\'m a failure',
            'Either I\'m a good mom or a bad mom',
            'I should be able to handle everything'
          ],
          color: 'red'
        },
        {
          title: 'Mind Reading',
          icon: '🔮',
          examples: [
            'My partner thinks I\'m incompetent',
            'Other moms judge my parenting',
            'The pediatrician thinks I\'m overreacting'
          ],
          color: 'purple'
        },
        {
          title: 'Fortune Telling',
          icon: '🌪️',
          examples: [
            'I\'ll never enjoy motherhood',
            'My baby will be damaged by my struggles',
            'I\'ll always feel this overwhelmed'
          ],
          color: 'blue'
        },
        {
          title: 'Emotional Reasoning',
          icon: '💭',
          examples: [
            'I feel guilty, so I must be doing something wrong',
            'I feel anxious, so something bad will happen',
            'I don\'t feel bonded, so I\'m a bad mother'
          ],
          color: 'orange'
        },
        {
          title: 'Should Statements',
          icon: '📏',
          examples: [
            'I should be grateful all the time',
            'I shouldn\'t need this much help',
            'I should know how to do this naturally'
          ],
          color: 'green'
        }
      ],
      insight: 'These aren\'t personal flaws - they\'re universal human thinking patterns amplified by stress, hormones, and sleep deprivation.',
      background: 'gradient-distortions',
      backgroundImage: '/images/biff01_imagine_woman_writing_in_journal_therapy_workbook_peac_242c4d8e-9b44-46fd-9453-babbeae35f90_2.png'
    }
  },
  {
    id: 4,
    type: 'defusion-techniques',
    content: {
      title: 'Defusion Techniques',
      subtitle: 'The Liberation Toolkit - proven techniques to unhook from difficult thoughts',
      techniques: [
        {
          title: 'The Labeling Method',
          icon: '🏷️',
          description: 'Name the thought type instead of believing the content',
          example: {
            instead: 'I\'m terrible at this',
            try: 'I\'m having a self-criticism thought'
          }
        },
        {
          title: 'The Singing Method',
          icon: '🎵',
          description: 'Sing your harsh thought to "Happy Birthday"',
          example: {
            instead: 'I\'m a terrible mother',
            try: 'Sing "I\'m-a-ter-ri-ble-moth-er" to the tune - Hard to take seriously!'
          }
        },
        {
          title: 'The Silly Voice Method',
          icon: '🎭',
          description: 'Say your thought in Mickey Mouse or Darth Vader voice',
          example: {
            instead: 'Everything is going wrong',
            try: 'Changes the emotional charge instantly'
          }
        },
        {
          title: 'The Thank You Method',
          icon: '🙏',
          description: 'Thank your mind for trying to help',
          example: {
            instead: 'Fighting the thought',
            try: 'Thank you, mind, for that thought. Thanks for trying to protect me.'
          }
        },
        {
          title: 'The Computer Metaphor',
          icon: '💻',
          description: 'See thoughts as software programs running',
          example: {
            instead: 'I\'m a bad mother',
            try: 'My mind is running the "Bad Mother" program again'
          }
        },
        {
          title: 'The Historical Perspective',
          icon: '📚',
          description: 'Recognize familiar thought patterns',
          example: {
            instead: 'Taking thoughts at face value',
            try: 'This thought has a history - whose voice does this sound like?'
          }
        }
      ],
      practice: 'Think of a recent difficult thought... Now try 2-3 techniques with it. Notice what shifts.',
      background: 'gradient-techniques',
      backgroundImage: '/images/biff01_imagine_woman_laughing_genuinely_flowers_blooming_arou_704b8215-9303-4169-9427-9a193dd4a16c_1.png'
    }
  },
  {
    id: 5,
    type: 'rain-method',
    content: {
      title: 'The RAIN Method',
      subtitle: 'For when thoughts trigger strong emotions',
      steps: [
        {
          letter: 'R',
          title: 'RECOGNIZE',
          description: 'Notice what\'s happening without judgment',
          questions: [
            'What am I feeling right now?',
            'What thoughts are present?',
            'What\'s happening in my body?'
          ],
          icon: '👁️',
          color: 'blue'
        },
        {
          letter: 'A',
          title: 'ALLOW',
          description: 'Make space for the experience',
          questions: [
            'Can I let this be here without fixing it?',
            'What if I didn\'t resist this feeling?',
            'Can I make space for this experience?'
          ],
          icon: '🤲',
          color: 'green'
        },
        {
          letter: 'I',
          title: 'INVESTIGATE WITH KINDNESS',
          description: 'Explore with compassion',
          questions: [
            'What does this feeling need?',
            'What would I say to a friend feeling this?',
            'Where do I feel this in my body?'
          ],
          icon: '💝',
          color: 'pink'
        },
        {
          letter: 'N',
          title: 'NON-IDENTIFICATION',
          description: 'Remember you are not your thoughts',
          questions: [
            'I am not this thought or feeling',
            'This is a temporary experience passing through me',
            'I am the sky, not the weather'
          ],
          icon: '☁️',
          color: 'purple'
        }
      ],
      wisdom: 'You can feel difficult things without being destroyed by them.',
      background: 'gradient-rain',
      backgroundImage: '/images/biff01_imagine_woman_sitting_peacefully_by_window_rain_outsid_9065dec9-2e4b-4529-ae40-3c7e29adfaf4_1.png'
    }
  },
  {
    id: 6,
    type: 'personal-defusion',
    content: {
      title: 'Creating Your Personal Defusion Phrases',
      subtitle: 'Develop your own defusion language',
      categories: [
        {
          title: 'For Anxiety Thoughts',
          icon: '🛡️',
          phrases: [
            'My protective system is very active today',
            'My mind is working hard to keep us safe',
            'This is my hypervigilant brain doing its job'
          ],
          color: 'yellow'
        },
        {
          title: 'For Self-Criticism',
          icon: '💔',
          phrases: [
            'My inner critic is loud today',
            'This is leftover programming from childhood',
            'My perfectionist part is afraid'
          ],
          color: 'red'
        },
        {
          title: 'For Catastrophic Thoughts',
          icon: '🌪️',
          phrases: [
            'My mind is playing the disaster movie again',
            'This is my brain trying to prepare for everything',
            'What if... thoughts are visiting'
          ],
          color: 'purple'
        },
        {
          title: 'For Comparison Thoughts',
          icon: '🪞',
          phrases: [
            'My comparison mind is online',
            'I\'m measuring my insides against their outsides',
            'Everyone\'s just doing their best'
          ],
          color: 'blue'
        }
      ],
      exercise: 'What phrases resonate with you? What language feels gentle and effective? Create 3 personal defusion phrases for your most common difficult thoughts.',
      background: 'gradient-personal',
      backgroundImage: '/images/biff01_imagine_woman_embracing_younger_version_of_herself_hea_0c73435d-95f6-4abf-8c0d-f85d450da73b_3.png'
    }
  },
  {
    id: 7,
    type: 'cognitive-flexibility',
    content: {
      title: 'The Cognitive Flexibility Practice',
      subtitle: 'The ability to see situations from multiple angles',
      practice: {
        title: 'The Three Perspectives Practice',
        perspectives: [
          {
            title: 'The Stressed Perspective',
            subtitle: 'How it feels in the moment',
            example: 'This is impossible, I can\'t handle this',
            icon: '😰',
            color: 'red'
          },
          {
            title: 'The Wise Friend Perspective',
            subtitle: 'What you\'d tell a friend',
            example: 'You\'re learning something incredibly difficult. Of course you\'re struggling. This is temporary.',
            icon: '🤗',
            color: 'green'
          },
          {
            title: 'The Future Self Perspective',
            subtitle: 'Looking back in 5 years',
            example: 'I remember how hard those early months were. I was doing the best I could. I\'m proud of how I persevered.',
            icon: '🔮',
            color: 'blue'
          }
        ]
      },
      dailyQuestions: [
        'What would I tell my best friend in this situation?',
        'How might I see this differently in a year?',
        'What would someone who loves me say right now?',
        'What information am I missing?',
        'What assumptions am I making?'
      ],
      wisdom: 'Perspective-taking is a muscle. The more you use it, the stronger it gets.',
      background: 'gradient-flexibility',
      backgroundImage: '/images/biff01_imagine_woman_at_crossroads_between_two_paths_one_show_6996af64-c265-4cfb-9603-a2d860953213_1.png'
    }
  },
  {
    id: 8,
    type: 'practice-menu',
    content: {
      title: 'Your Week 2 Practice Menu',
      subtitle: 'Choose 2-3 practices that resonate with you',
      practices: [
        {
          title: 'Daily Thought Defusion',
          description: 'Use your favorite technique when difficult thoughts arise',
          duration: 'As needed',
          icon: '🔗'
        },
        {
          title: 'RAIN Practice',
          description: 'Use when emotions are intense or overwhelming',
          duration: '5-10 minutes',
          icon: '🌧️'
        },
        {
          title: 'Three Perspectives Practice',
          description: 'Apply to stuck situations or recurring worries',
          duration: '5 minutes',
          icon: '👁️'
        },
        {
          title: 'Evening Thought Download',
          description: 'Stream of consciousness writing with compassionate review',
          duration: '10 minutes',
          icon: '📝'
        },
        {
          title: 'Personal Defusion Phrase Development',
          description: 'Create and refine your own gentle defusion language',
          duration: '15 minutes',
          icon: '💬'
        }
      ],
      reminder: 'The goal isn\'t to eliminate difficult thoughts. It\'s to hold them lightly instead of being held captive by them.',
      background: 'gradient-practice',
      backgroundImage: '/images/biff01_imagine_woman_writing_in_journal_therapy_workbook_peac_7f6a2636-e20e-44c3-9edf-8de89e48ffc7_2.png'
    }
  },
  {
    id: 9,
    type: 'bridge-forward',
    content: {
      title: 'What\'s Coming Next',
      subtitle: 'In our next lesson: Core Beliefs & Identity Shifts',
      preview: 'We move from individual thoughts to thought patterns and core beliefs. We\'ll explore how becoming a mother shifts your fundamental sense of self and learn to navigate this profound identity transformation.',
      reminder: 'You\'re rewiring your brain with every practice. That\'s not metaphor - that\'s neuroscience.',
      encouragement: 'Remember: The goal isn\'t to eliminate difficult thoughts. It\'s to hold them lightly instead of being held captive by them.',
      closing: 'You\'re becoming more free with every defusion practice, thoughtful warrior.',
      background: 'gradient-sage-bloom',
      backgroundImage: '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__fe9419f0-6fe7-4ed9-9888-c062989a9600_1.png'
    }
  }
];

export default function Week2Lesson2Page() {
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
      'gradient-defusion': 'bg-gradient-to-br from-purple-100 via-violet-50 to-indigo-100',
      'gradient-liberation': 'bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100',
      'gradient-distortions': 'bg-gradient-to-br from-red-100 via-orange-50 to-yellow-100',
      'gradient-techniques': 'bg-gradient-to-br from-pink-100 via-rose-50 to-red-100',
      'gradient-rain': 'bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100',
      'gradient-personal': 'bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100',
      'gradient-flexibility': 'bg-gradient-to-br from-amber-100 via-orange-50 to-red-100',
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
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-violet-800/50 to-indigo-700/40" />
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
                <Unlink className="w-16 h-16 mx-auto text-white/60" />
              </motion.div>
            </div>
          </div>
        );

      case 'fusion-vs-freedom':
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
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/80 via-teal-50/80 to-cyan-100/80" />
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
                <p className="text-2xl text-slate-600 mb-8">
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
                    {slide.content.definition}
                  </p>
                </motion.div>

                <div className="space-y-6">
                  {slide.content.examples.map((example: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.2 }}
                      className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                    >
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-red-100 p-6 rounded-xl">
                          <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                            <Zap className="w-5 h-5" />
                            Fused (Tangled)
                          </h4>
                          <p className="text-red-700 italic">"{example.fused}"</p>
                        </div>
                        <div className="bg-green-100 p-6 rounded-xl">
                          <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                            <Unlink className="w-5 h-5" />
                            Defused (Free)
                          </h4>
                          <p className="text-green-700 italic">"{example.defused}"</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5 }}
                  className="text-center bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                >
                  <p className="text-3xl font-playfair text-emerald-800 font-bold">
                    {slide.content.truth}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        );

      case 'cognitive-distortions':
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

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {slide.content.distortions.map((distortion: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl"
                  >
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-3">{distortion.icon}</div>
                      <h3 className="text-xl font-bold text-slate-800">{distortion.title}</h3>
                    </div>
                    
                    <div className="space-y-2">
                      {distortion.examples.map((example: string, exampleIndex: number) => (
                        <motion.div
                          key={exampleIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 + exampleIndex * 0.05 }}
                          className="p-3 bg-gray-50 rounded-xl text-sm italic text-slate-700"
                        >
                          "{example}"
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
                className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-3xl p-8 shadow-xl text-center border-l-8 border-orange-400"
              >
                <Lightbulb className="w-16 h-16 mx-auto text-orange-600 mb-4" />
                <p className="text-2xl font-bold text-orange-800">
                  {slide.content.insight}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'defusion-techniques':
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

              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {slide.content.techniques.map((technique: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-3xl">{technique.icon}</div>
                      <h3 className="text-xl font-bold text-slate-800">{technique.title}</h3>
                    </div>
                    
                    <p className="text-slate-700 mb-4">{technique.description}</p>
                    
                    <div className="space-y-3">
                      <div className="bg-red-50 p-3 rounded-xl">
                        <p className="text-sm text-red-800 font-medium">Instead of:</p>
                        <p className="text-red-700 italic">"{technique.example.instead}"</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-xl">
                        <p className="text-sm text-green-800 font-medium">Try:</p>
                        <p className="text-green-700 italic">"{technique.example.try}"</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.8 }}
                className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-3xl p-8 shadow-xl text-center border-l-8 border-pink-400"
              >
                <Target className="w-16 h-16 mx-auto text-pink-600 mb-4" />
                <p className="text-xl font-bold text-pink-800">
                  {slide.content.practice}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'rain-method':
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

              <div className="space-y-8 mb-12">
                {slide.content.steps.map((step: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.2 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                  >
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                          <span className="text-2xl font-bold text-white">{step.letter}</span>
                        </div>
                        <div className="text-4xl text-center">{step.icon}</div>
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">{step.title}</h3>
                        <p className="text-lg text-slate-600 mb-4">{step.description}</p>
                        
                        <div className="space-y-2">
                          {step.questions.map((question: string, questionIndex: number) => (
                            <motion.div
                              key={questionIndex}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 + index * 0.2 + questionIndex * 0.1 }}
                              className="flex items-start gap-3"
                            >
                              <span className="text-blue-500 text-xl mt-1">•</span>
                              <p className="text-slate-700 italic">"{question}"</p>
                            </motion.div>
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
                transition={{ delay: 1.5 }}
                className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-3xl p-8 shadow-xl text-center border-l-8 border-blue-400"
              >
                <div className="text-6xl mb-4">🌈</div>
                <p className="text-2xl font-bold text-blue-800">
                  {slide.content.wisdom}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'personal-defusion':
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
                      {category.phrases.map((phrase: string, phraseIndex: number) => (
                        <motion.div
                          key={phraseIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.2 + phraseIndex * 0.1 }}
                          className="p-4 bg-emerald-50 rounded-xl"
                        >
                          <p className="text-slate-700 italic">"{phrase}"</p>
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
                <MessageCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
                <p className="text-xl font-bold text-green-800">
                  {slide.content.exercise}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'cognitive-flexibility':
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
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100/80 via-orange-50/80 to-red-100/80" />
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
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl text-center"
                >
                  <h3 className="text-3xl font-bold text-amber-800 mb-8">{slide.content.practice.title}</h3>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {slide.content.practice.perspectives.map((perspective: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.2 }}
                        className="p-6 rounded-xl bg-gradient-to-br from-white to-gray-50"
                      >
                        <div className="text-4xl mb-4">{perspective.icon}</div>
                        <h4 className="text-lg font-bold text-slate-800 mb-2">{perspective.title}</h4>
                        <p className="text-sm text-slate-600 mb-4">{perspective.subtitle}</p>
                        <div className="bg-amber-50 p-4 rounded-lg">
                          <p className="text-slate-700 italic text-sm">"{perspective.example}"</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                >
                  <h3 className="text-2xl font-bold text-orange-800 mb-6 text-center">Daily Perspective Questions</h3>
                  <div className="space-y-3">
                    {slide.content.dailyQuestions.map((question: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.4 + index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <Eye className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                        <p className="text-slate-700 italic">{question}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.8 }}
                className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-3xl p-8 shadow-xl text-center border-l-8 border-amber-400"
              >
                <Layers className="w-16 h-16 mx-auto text-amber-600 mb-4" />
                <p className="text-2xl font-bold text-amber-800">
                  {slide.content.wisdom}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'practice-menu':
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
                transition={{ delay: 1.2 }}
                className="bg-gradient-to-r from-violet-100 to-purple-100 rounded-3xl p-8 shadow-xl text-center border-l-8 border-violet-400"
              >
                <Brain className="w-16 h-16 mx-auto text-violet-600 mb-4" />
                <p className="text-2xl font-bold text-violet-800">
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
                <p className="text-xl text-slate-700 leading-relaxed mb-8">
                  {slide.content.reminder}
                </p>
                <p className="text-lg text-slate-600">
                  {slide.content.encouragement}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="space-y-8"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                  <p className="text-2xl font-playfair text-teal-800">
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
                    href="/course/week2/lesson3"
                    className="inline-block bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-teal-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Continue to Lesson 3 →
                  </Link>
                  <p className="text-white/80 text-sm">
                    Core Beliefs & Identity Shifts
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
            href="/course/week2"
            className="text-white/80 hover:text-white bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Week 2
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
                <h3 className="text-2xl font-bold text-slate-800">Week 2 Lesson 2</h3>
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
                        ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg'
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
                    ? 'w-12 bg-gradient-to-r from-purple-500 to-violet-500'
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