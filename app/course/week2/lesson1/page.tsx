'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Menu, X, Brain, Eye, Cloud, Lightbulb, Heart, Shield, Target } from 'lucide-react';

// Beautiful slide data that matches the comprehensive course content
const slides = [
  {
    id: 1,
    type: 'hero',
    content: {
      title: 'The Postpartum Mind',
      subtitle: 'Understanding Your Thoughts',
      description: 'This week we\'re diving into the landscape of your mind - not to judge what we find there, but to understand it with compassion.',
      background: 'gradient-cognitive',
      backgroundImage: '/images/biff01_imagine_woman_in_meditation_pose_serene_environment_br_1f66e17b-a951-4d9f-b895-127fabc89208_3.png',
      overlay: true
    }
  },
  {
    id: 2,
    type: 'welcome-chaos',
    content: {
      title: 'Normalizing the Mental Chaos',
      message: 'If your thoughts feel chaotic, repetitive, or scary right now - that\'s not a personal failing. That\'s a nervous system responding to massive change while running on minimal sleep.',
      insights: [
        'Your postpartum brain is DESIGNED to be hypervigilant right now',
        'The same neurobiology that keeps your baby safe can make your mind feel like a tornado',
        'Today we learn to dance with this tornado instead of fighting it'
      ],
      clinicalWisdom: 'You cannot think your way out of a dysregulated nervous system. But you can change your relationship to your thoughts - and that changes everything.',
      background: 'gradient-storm',
      backgroundImage: '/images/biff01_imagine_woman_on_laptop_in_cozy_home_setting_having_vi_65b5942f-d2fb-4103-84e6-722269d37e3b_0.png'
    }
  },
  {
    id: 3,
    type: 'thought-patterns',
    content: {
      title: 'The Postpartum Cognitive Storm',
      subtitle: 'Let\'s normalize what\'s happening in your mind',
      patterns: [
        {
          title: 'Hypervigilance Thoughts',
          icon: '👁️',
          thoughts: [
            'Is the baby breathing?',
            'Did I lock the door?',
            'What if something happens to baby while I sleep?',
            'Am I doing everything wrong?'
          ],
          color: 'red'
        },
        {
          title: 'Comparison & Judgment',
          icon: '⚖️',
          thoughts: [
            'Other moms seem to have it together',
            'I should be enjoying this more',
            'I\'m not as good at this as I thought I\'d be',
            'Everyone else looks so happy on social media'
          ],
          color: 'orange'
        },
        {
          title: 'Catastrophic Thinking',
          icon: '🌪️',
          thoughts: [
            'I\'ll never feel like myself again',
            'I\'ve ruined my life',
            'What if I never bond with my baby?',
            'I can\'t do this'
          ],
          color: 'purple'
        },
        {
          title: 'Perfectionism Thoughts',
          icon: '✨',
          thoughts: [
            'I should be grateful for everything',
            'Good mothers don\'t feel this way',
            'I need to be strong for everyone',
            'I can\'t ask for help'
          ],
          color: 'blue'
        }
      ],
      validation: 'If you recognize these thoughts - welcome to the club. These aren\'t character flaws. They\'re predictable patterns of a brain trying to manage the unmanageable.',
      background: 'gradient-patterns',
      backgroundImage: '/images/biff01_imagine_woman_writing_in_journal_therapy_workbook_peac_7f6a2636-e20e-44c3-9edf-8de89e48ffc7_0.png'
    }
  },
  {
    id: 4,
    type: 'neuroscience',
    content: {
      title: 'The Neuroscience of Postpartum Thinking',
      subtitle: 'Your thinking patterns right now are shaped by biology',
      categories: [
        {
          title: 'Hormonal Influences',
          icon: '🧬',
          items: [
            'Low estrogen: Affects mood regulation and memory',
            'Fluctuating progesterone: Impacts anxiety and sleep',
            'Elevated cortisol: Keeps threat-detection system active',
            'Oxytocin surges: Intensify emotional responses'
          ]
        },
        {
          title: 'Neural Network Changes',
          icon: '🧠',
          items: [
            'Default Mode Network: More active (more rumination)',
            'Salience Network: Hyperactive (everything feels urgent)',
            'Executive Control: Temporarily reduced (harder to focus)'
          ]
        },
        {
          title: 'Sleep Deprivation Effects',
          icon: '😴',
          items: [
            'Reduced prefrontal cortex function',
            'Increased emotional reactivity',
            'Impaired cognitive flexibility',
            'Heightened stress response'
          ]
        }
      ],
      reframes: [
        'Your "anxious thoughts" are your brain trying to predict and prevent every possible threat to your baby. It\'s love expressed through worry.',
        'Your "negative thoughts" are your psyche processing grief and identity change.',
        'Your "racing thoughts" are your mind trying to solve the unsolvable puzzle of perfect motherhood.',
        'None of this is wrong. All of it makes sense.'
      ],
      background: 'gradient-science',
      backgroundImage: '/images/biff01_imagine_woman_in_meditation_pose_serene_environment_br_43b6047c-916a-43b2-afc2-5449ec040f7c_1.png'
    }
  },
  {
    id: 5,
    type: 'thoughts-vs-truth',
    content: {
      title: 'Thoughts vs. Truth',
      subtitle: 'The Fundamental Distinction',
      revolutionary: 'THOUGHTS ARE NOT FACTS.',
      thoughtsAre: [
        'Mental events, like weather patterns in your mind',
        'Influenced by hormones, sleep, and stress',
        'Often outdated programming from past experiences',
        'Your brain\'s attempt to make sense of complexity',
        'Sometimes helpful, sometimes not'
      ],
      truthsAre: [
        'You are learning something completely new',
        'You are doing your best with your current resources',
        'Your baby is lucky to have you',
        'Struggling doesn\'t mean failing',
        'Getting help is strength, not weakness'
      ],
      practice: {
        instruction: 'Next time you notice a difficult thought, try:',
        before: '"I am a terrible mother"',
        after: '"I\'m having the thought that I\'m a terrible mother"',
        note: 'Feel the difference? The first creates space. The second creates suffering.'
      },
      background: 'gradient-truth',
      backgroundImage: '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__1c12cc3c-cebd-47e2-ad9b-66b9bbca6480_2.png'
    }
  },
  {
    id: 6,
    type: 'observer-self',
    content: {
      title: 'The Observer Self',
      subtitle: 'Meeting Your Wise Witness',
      introduction: 'Inside you is a part that can observe your thoughts without being overwhelmed by them. We call this the Observer Self or Wise Witness.',
      qualities: [
        'Notices thoughts without judging them',
        'Stays calm even when thoughts are chaotic',
        'Knows the difference between thinking and being',
        'Can choose which thoughts deserve attention',
        'Holds compassion for all parts of your experience'
      ],
      practice: {
        title: 'Cultivating the Observer (Practice)',
        steps: [
          'Notice you\'re thinking: "Oh, I\'m thinking right now"',
          'Name the type of thought: "Worry thought" or "Criticism thought"',
          'Thank your mind: "Thanks, mind, for trying to protect me"',
          'Choose your response: "Is this thought helpful right now?"'
        ]
      },
      guidedPractice: [
        'Bring to mind a recent worry about your baby...',
        'Now step back and observe that thought...',
        'Notice: You are not the thought. You are the one observing the thought.',
        'You are the sky, not the weather.'
      ],
      background: 'gradient-observer',
      backgroundImage: '/images/biff01_imagine_woman_walking_in_nature_path_trees_and_flowers_dc53f2ba-0c3a-4b5a-a758-62679e547b70_1.png'
    }
  },
  {
    id: 7,
    type: 'cognitive-toolkit',
    content: {
      title: 'Your Cognitive Toolkit for Week 2',
      subtitle: 'Simple, practical tools for thought awareness',
      practices: [
        {
          title: 'Daily Thought Noticing',
          duration: '2 minutes',
          steps: [
            'Set phone reminders 3x daily',
            'Simply notice: "What thoughts are here right now?"',
            'No judgment, just awareness',
            'Record patterns in your phone'
          ],
          icon: '⏰'
        },
        {
          title: 'Thought Labeling Practice',
          duration: 'Throughout day',
          steps: [
            'Worry thoughts: "Thanks, mind, for being cautious"',
            'Criticism thoughts: "Thanks, mind, for trying to motivate me"',
            'Comparison thoughts: "Thanks, mind, for trying to help me fit in"'
          ],
          icon: '🏷️'
        },
        {
          title: 'The 5-Minute Thought Download',
          duration: '5 minutes evening',
          steps: [
            'Every evening, write thoughts for 5 minutes',
            'Stream of consciousness, no editing',
            'Notice what shows up repeatedly',
            'Then close the notebook - thoughts have been heard'
          ],
          icon: '📝'
        }
      ],
      assignment: 'Choose ONE practice to commit to this week. Consistency matters more than perfection.',
      background: 'gradient-toolkit',
      backgroundImage: '/images/biff01_imagine_woman_writing_in_journal_therapy_workbook_peac_7f6a2636-e20e-44c3-9edf-8de89e48ffc7_2.png'
    }
  },
  {
    id: 8,
    type: 'bridge-forward',
    content: {
      title: 'What\'s Coming Next',
      subtitle: 'In our next lesson: Cognitive Defusion',
      preview: 'We learn specific techniques for unhooking from difficult thoughts and creating space between you and your mental patterns.',
      reminder: 'The goal isn\'t to stop difficult thoughts. It\'s to change your relationship with them.',
      nextLesson: 'Next lesson: We learn specific techniques for challenging unhelpful thought patterns.',
      encouragement: 'For now, practice being curious about your thoughts instead of scared of them. They\'re not your enemy - they\'re information.',
      closing: 'You\'re doing beautifully, observer mama.',
      background: 'gradient-sage-bloom',
      backgroundImage: '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__fe9419f0-6fe7-4ed9-9888-c062989a9600_1.png'
    }
  }
];

export default function Week2Lesson1Page() {
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
      'gradient-cognitive': 'bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100',
      'gradient-storm': 'bg-gradient-to-br from-gray-100 via-slate-50 to-blue-100',
      'gradient-patterns': 'bg-gradient-to-br from-orange-100 via-red-50 to-pink-100',
      'gradient-science': 'bg-gradient-to-br from-cyan-100 via-blue-50 to-indigo-100',
      'gradient-truth': 'bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100',
      'gradient-observer': 'bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100',
      'gradient-toolkit': 'bg-gradient-to-br from-purple-100 via-violet-50 to-indigo-100',
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
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/70 via-purple-800/50 to-blue-700/40" />
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
                <Brain className="w-16 h-16 mx-auto text-white/60" />
              </motion.div>
            </div>
          </div>
        );

      case 'welcome-chaos':
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
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100/80 via-slate-50/80 to-blue-100/80" />
              </div>
            )}

            <div className="relative z-10 max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
              >
                <h1 className="text-5xl md:text-6xl font-playfair text-slate-800 mb-8">
                  {slide.content.title}
                </h1>
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
                  
                  <div className="space-y-4">
                    {slide.content.insights.map((insight: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <Lightbulb className="w-6 h-6 text-yellow-500 mt-1 flex-shrink-0" />
                        <p className="text-lg text-slate-700">{insight}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                  className="text-center bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                >
                  <Shield className="w-16 h-16 mx-auto text-blue-600 mb-4" />
                  <p className="text-xl font-bold text-blue-800 italic">
                    {slide.content.clinicalWisdom}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        );

      case 'thought-patterns':
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
                <div className="absolute inset-0 bg-gradient-to-br from-orange-100/80 via-red-50/80 to-pink-100/80" />
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
                {slide.content.patterns.map((pattern: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.2 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                  >
                    <div className="text-center mb-6">
                      <div className="text-5xl mb-4">{pattern.icon}</div>
                      <h3 className="text-2xl font-bold text-slate-800">{pattern.title}</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {pattern.thoughts.map((thought: string, thoughtIndex: number) => (
                        <motion.div
                          key={thoughtIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.2 + thoughtIndex * 0.1 }}
                          className="p-3 bg-gray-50 rounded-xl italic text-slate-700"
                        >
                          "{thought}"
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
                className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-8 shadow-xl text-center"
              >
                <Heart className="w-16 h-16 mx-auto text-purple-600 mb-4" />
                <p className="text-2xl font-bold text-purple-800">
                  {slide.content.validation}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'neuroscience':
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

              <div className="space-y-8 mb-12">
                {slide.content.categories.map((category: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.2 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-4xl">{category.icon}</div>
                      <h3 className="text-2xl font-bold text-slate-800">{category.title}</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {category.items.map((item: string, itemIndex: number) => (
                        <motion.div
                          key={itemIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.2 + itemIndex * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <span className="text-cyan-500 text-xl mt-1">•</span>
                          <p className="text-slate-700">{item}</p>
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
                className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-3xl p-8 shadow-xl"
              >
                <h3 className="text-2xl font-bold text-blue-800 mb-6 text-center">Reframes for Healing</h3>
                <div className="space-y-4">
                  {slide.content.reframes.map((reframe: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.7 + index * 0.1 }}
                      className="text-lg text-slate-700 italic text-center"
                    >
                      {reframe}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        );

      case 'thoughts-vs-truth':
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
                <div className="text-4xl font-bold text-emerald-800 bg-white/90 rounded-2xl p-6 inline-block">
                  {slide.content.revolutionary}
                </div>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                >
                  <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    <Cloud className="w-8 h-8 text-gray-500" />
                    Thoughts Are:
                  </h3>
                  <div className="space-y-3">
                    {slide.content.thoughtsAre.map((item: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <span className="text-gray-500 text-xl mt-1">•</span>
                        <p className="text-slate-700">{item}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                >
                  <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    <Shield className="w-8 h-8 text-emerald-600" />
                    Truths Are:
                  </h3>
                  <div className="space-y-3">
                    {slide.content.truthsAre.map((item: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 + index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <span className="text-emerald-500 text-xl mt-1">•</span>
                        <p className="text-slate-700">{item}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 }}
                className="bg-gradient-to-r from-teal-100 to-emerald-100 rounded-3xl p-8 shadow-xl text-center"
              >
                <Target className="w-16 h-16 mx-auto text-teal-600 mb-4" />
                <h3 className="text-2xl font-bold text-teal-800 mb-4">{slide.content.practice.instruction}</h3>
                <div className="space-y-4">
                  <div className="bg-red-100 p-4 rounded-xl">
                    <p className="text-lg text-red-800 font-semibold">{slide.content.practice.before}</p>
                  </div>
                  <div className="text-2xl text-teal-700">↓</div>
                  <div className="bg-green-100 p-4 rounded-xl">
                    <p className="text-lg text-green-800 font-semibold">{slide.content.practice.after}</p>
                  </div>
                  <p className="text-lg text-slate-700 italic mt-6">{slide.content.practice.note}</p>
                </div>
              </motion.div>
            </div>
          </div>
        );

      case 'observer-self':
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
                <p className="text-2xl text-slate-600 mb-8">
                  {slide.content.subtitle}
                </p>
                <p className="text-xl text-slate-700 leading-relaxed max-w-4xl mx-auto">
                  {slide.content.introduction}
                </p>
              </motion.div>

              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                >
                  <h3 className="text-2xl font-bold text-amber-800 mb-6 flex items-center gap-3">
                    <Eye className="w-8 h-8" />
                    Your Observer Self:
                  </h3>
                  <div className="space-y-3">
                    {slide.content.qualities.map((quality: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <span className="text-amber-500 text-xl mt-1">•</span>
                        <p className="text-slate-700">{quality}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                >
                  <h3 className="text-2xl font-bold text-orange-800 mb-6">{slide.content.practice.title}</h3>
                  <div className="space-y-4">
                    {slide.content.practice.steps.map((step: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 + index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
                          {index + 1}
                        </div>
                        <p className="text-slate-700">{step}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5 }}
                  className="bg-gradient-to-r from-yellow-100 to-amber-100 rounded-3xl p-8 shadow-xl text-center"
                >
                  <h3 className="text-2xl font-bold text-yellow-800 mb-6">Guided Practice</h3>
                  <div className="space-y-4">
                    {slide.content.guidedPractice.map((instruction: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.7 + index * 0.2 }}
                        className="text-lg text-slate-700 italic"
                      >
                        {instruction}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        );

      case 'cognitive-toolkit':
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

              <div className="space-y-8 mb-12">
                {slide.content.practices.map((practice: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.2 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-4xl">{practice.icon}</div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800">{practice.title}</h3>
                        <p className="text-sm text-purple-600 font-semibold">{practice.duration}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {practice.steps.map((step: string, stepIndex: number) => (
                        <motion.div
                          key={stepIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.2 + stepIndex * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <span className="text-purple-500 text-xl mt-1">•</span>
                          <p className="text-slate-700">{step}</p>
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
                className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-3xl p-8 shadow-xl text-center border-l-8 border-purple-400"
              >
                <Target className="w-16 h-16 mx-auto text-purple-600 mb-4" />
                <p className="text-2xl font-bold text-purple-800">
                  {slide.content.assignment}
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
                  {slide.content.nextLesson}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="space-y-8"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                  <p className="text-xl text-slate-700 mb-4">
                    {slide.content.encouragement}
                  </p>
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
                    href="/course/week2/lesson2"
                    className="inline-block bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-teal-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Continue to Lesson 2 →
                  </Link>
                  <p className="text-white/80 text-sm">
                    Cognitive Defusion - Unhooking from Difficult Thoughts
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
                <h3 className="text-2xl font-bold text-slate-800">Week 2 Lesson 1</h3>
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