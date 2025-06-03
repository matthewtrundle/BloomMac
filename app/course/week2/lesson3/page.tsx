'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Menu, X, Users, Search, RefreshCw, Heart, Shield, Star, Compass, Layers, Lightbulb, Target, Sparkles } from 'lucide-react';

// Beautiful slide data that matches the comprehensive course content
const slides = [
  {
    id: 1,
    type: 'hero',
    content: {
      title: 'Core Beliefs & Identity Shifts',
      subtitle: 'Beneath the Surface Thoughts',
      description: 'We\'ve worked with individual thoughts. Now we go deeper - to the core beliefs that drive those thoughts.',
      background: 'gradient-identity',
      backgroundImage: '/images/biff01_imagine_woman_embracing_younger_version_of_herself_hea_0c73435d-95f6-4abf-8c0d-f85d450da73b_3.png',
      overlay: true
    }
  },
  {
    id: 2,
    type: 'iceberg-metaphor',
    content: {
      title: 'The Iceberg of Your Mind',
      subtitle: 'Core beliefs are like the operating system of your mind',
      definition: 'Core beliefs are often unconscious assumptions about yourself, others, and the world that were formed early in life.',
      examples: [
        {
          surface: 'I should know how to do this',
          core: 'I must be competent to be worthy of love'
        },
        {
          surface: 'I\'m burdening everyone',
          core: 'My needs are too much for others'
        }
      ],
      activation: 'Becoming a mother activates every core belief you have about:',
      areas: [
        'Your worthiness',
        'Your capability', 
        'Your lovability',
        'Your safety in the world'
      ],
      declaration: 'Today we make the unconscious conscious.',
      background: 'gradient-iceberg',
      backgroundImage: '/images/biff01_imagine_woman_writing_in_journal_therapy_workbook_peac_242c4d8e-9b44-46fd-9453-babbeae35f90_2.png'
    }
  },
  {
    id: 3,
    type: 'belief-categories',
    content: {
      title: 'Identifying Your Core Beliefs',
      subtitle: 'Common postpartum core belief activations',
      categories: [
        {
          title: 'Worthiness Beliefs',
          icon: '💎',
          beliefs: [
            'I\'m only valuable if I\'m perfect',
            'I don\'t deserve help unless I\'m completely overwhelmed',
            'My worth depends on being needed',
            'I must earn love through sacrifice'
          ],
          color: 'purple'
        },
        {
          title: 'Capability Beliefs',
          icon: '💪',
          beliefs: [
            'I should be able to handle everything myself',
            'Asking for help means I\'m weak',
            'If it\'s hard, I\'m doing it wrong',
            'Good mothers know instinctively what to do'
          ],
          color: 'blue'
        },
        {
          title: 'Safety Beliefs',
          icon: '🛡️',
          beliefs: [
            'The world is dangerous and I must be hypervigilant',
            'Something bad will happen if I\'m not perfect',
            'I can\'t trust others to care for my baby properly',
            'Relaxing means I\'m being irresponsible'
          ],
          color: 'red'
        },
        {
          title: 'Connection Beliefs',
          icon: '🤝',
          beliefs: [
            'I\'m different from other mothers',
            'I don\'t fit in anywhere',
            'Everyone else has it figured out',
            'I\'m alone in this struggle'
          ],
          color: 'green'
        }
      ],
      reflection: 'Which of these feel familiar? Notice without judgment - these beliefs often served you once but may not serve you now.',
      background: 'gradient-beliefs',
      backgroundImage: '/images/biff01_imagine_woman_writing_in_journal_therapy_workbook_peac_7f6a2636-e20e-44c3-9edf-8de89e48ffc7_0.png'
    }
  },
  {
    id: 4,
    type: 'belief-archaeology',
    content: {
      title: 'The Archaeology of Beliefs',
      subtitle: 'Where your core beliefs come from',
      origins: [
        {
          type: 'Childhood Messages',
          icon: '👶',
          examples: [
            'Spoken: "Good girls don\'t ask for help"',
            'Unspoken: Parent overwhelmed, child learns "I\'m too much"',
            'Cultural: "Mothers should sacrifice everything for children"'
          ]
        },
        {
          type: 'Past Experiences',
          icon: '📚',
          examples: [
            'Trauma: "I must be hypervigilant to be safe"',
            'Rejection: "I must be perfect to be loved"',
            'Criticism: "I\'m not good enough as I am"'
          ]
        },
        {
          type: 'Societal Programming',
          icon: '🌍',
          examples: [
            '"Motherhood should be natural and joyful"',
            '"Strong women don\'t struggle"',
            '"You should be grateful for what you have"'
          ]
        }
      ],
      reframe: 'These beliefs aren\'t character flaws. They were adaptive responses to your environment. A child who learned "I must be perfect to be safe" was responding intelligently to their situation.',
      question: 'The question now is: Do these beliefs serve your current reality?',
      gentleInquiry: [
        'What did you learn about mothers/motherhood growing up?',
        'What messages did you receive about asking for help?',
        'How was struggle or difficulty handled in your family?',
        'What beliefs about worthiness did you absorb?'
      ],
      note: 'No need to analyze deeply - just notice what arises.',
      background: 'gradient-archaeology',
      backgroundImage: '/images/biff01_imagine_warm_modern_therapy_office_two_women_in_conver_1b19f253-c5eb-4b43-b05c-cabfbbf7c66b_3.png'
    }
  },
  {
    id: 5,
    type: 'belief-update-process',
    content: {
      title: 'Challenging and Updating Core Beliefs',
      subtitle: 'We don\'t eliminate core beliefs - we update them',
      examples: [
        {
          old: 'I must be perfect to be worthy of love',
          updated: 'I am worthy of love especially when I\'m imperfect and learning'
        },
        {
          old: 'I should be able to handle everything myself',
          updated: 'Accepting help is how I can be my best self for my family'
        },
        {
          old: 'Good mothers don\'t struggle',
          updated: 'Good mothers are human and seek support when needed'
        }
      ],
      process: [
        {
          step: 1,
          title: 'IDENTIFY THE OLD BELIEF',
          question: 'What core belief is driving this thought pattern?'
        },
        {
          step: 2,
          title: 'EXAMINE THE EVIDENCE',
          questions: [
            'Is this belief absolutely true?',
            'What evidence contradicts this belief?',
            'How has this belief helped and hurt me?'
          ]
        },
        {
          step: 3,
          title: 'CONSIDER THE ORIGIN',
          questions: [
            'Where did I learn this belief?',
            'Was it helpful in that context?',
            'Is it helpful in my current context?'
          ]
        },
        {
          step: 4,
          title: 'CRAFT AN UPDATED BELIEF',
          questions: [
            'What would be a more helpful, accurate belief?',
            'What would I want my daughter to believe?',
            'What belief would serve my wholeness?'
          ]
        },
        {
          step: 5,
          title: 'PRACTICE THE NEW BELIEF',
          questions: [
            'How can I live this new belief today?',
            'What actions align with this new belief?',
            'How can I remind myself of this new truth?'
          ]
        }
      ],
      background: 'gradient-update',
      backgroundImage: '/images/biff01_imagine_woman_on_laptop_in_cozy_home_setting_having_vi_65b5942f-d2fb-4103-84e6-722269d37e3b_2.png'
    }
  },
  {
    id: 6,
    type: 'identity-integration',
    content: {
      title: 'Motherhood Identity Integration',
      subtitle: 'Becoming a mother involves identity reorganization',
      identities: [
        {
          title: 'Who You Were',
          aspects: [
            'Individual with your own needs, goals, rhythms',
            'Person with established sense of self',
            'Someone with freedom and autonomy'
          ],
          color: 'blue'
        },
        {
          title: 'Who You\'re Becoming',
          aspects: [
            'Caregiver responsible for another\'s wellbeing',
            'Person learning entirely new skills',
            'Someone whose life is interconnected with another\'s'
          ],
          color: 'green'
        }
      ],
      challenge: 'How do you honor both - your individual self AND your mother self?',
      reframe: 'You\'re not losing yourself. You\'re expanding yourself.',
      bothAndStatements: [
        'I can be a loving mother AND have my own needs',
        'I can prioritize my baby AND prioritize my wellbeing',
        'I can be grateful for my child AND grieve my old life',
        'I can love motherhood AND find it difficult',
        'I can be a good mother AND be imperfect',
        'I can be strong AND need support'
      ],
      exercise: [
        'Before becoming a mother, I was...',
        'As a mother, I am becoming...',
        'I want to integrate these parts by...'
      ],
      truth: 'Both versions of you are valid. Both deserve honoring.',
      background: 'gradient-integration',
      backgroundImage: '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__1c12cc3c-cebd-47e2-ad9b-66b9bbca6480_0.png'
    }
  },
  {
    id: 7,
    type: 'empowering-beliefs',
    content: {
      title: 'Creating New Empowering Beliefs',
      subtitle: 'Let\'s plant new beliefs that serve your flourishing',
      categories: [
        {
          title: 'Motherhood Empowerment Beliefs',
          beliefs: [
            'Learning to be a mother is one of life\'s greatest growth opportunities',
            'My struggles make me more compassionate, not less worthy',
            'Asking for help models healthy interdependence for my child',
            'My wellbeing and my baby\'s wellbeing are interconnected',
            'I can trust my instincts while also seeking guidance',
            'Motherhood is a practice, not a performance'
          ],
          color: 'purple'
        },
        {
          title: 'Personal Worth Beliefs',
          beliefs: [
            'I am inherently worthy, regardless of my performance',
            'My value doesn\'t depend on being perfect',
            'I deserve care, support, and gentleness',
            'My needs matter and deserve attention'
          ],
          color: 'pink'
        },
        {
          title: 'Capability Beliefs',
          beliefs: [
            'I am learning and growing every day',
            'I have inner wisdom I can trust',
            'I can figure things out with support',
            'Mistakes are information, not failures'
          ],
          color: 'blue'
        }
      ],
      practice: 'Choose 3 beliefs that resonate most deeply. Write them in your own words. Say them with your hand on your heart. Notice any resistance - that\'s normal. Commit to reminding yourself of these truths daily.',
      background: 'gradient-empowerment',
      backgroundImage: '/images/biff01_imagine_confident_single_mother_holding_baby_standing__b3179601-8cbf-4af3-9b29-bedcbc4946a3_3.png'
    }
  },
  {
    id: 8,
    type: 'belief-affirmations',
    content: {
      title: 'Belief Affirmation Practice',
      subtitle: 'Rewiring your mind with new truth',
      instructions: [
        'Choose your 3 most resonant empowering beliefs',
        'Write them in your own words',
        'Place your hand on your heart',
        'Say each belief slowly and with intention',
        'Notice any resistance - that\'s your old programming',
        'Commit to daily repetition'
      ],
      examples: [
        {
          belief: 'I am worthy of love and support exactly as I am',
          practice: 'Say this while looking in the mirror each morning'
        },
        {
          belief: 'My struggles are making me stronger and more compassionate',
          practice: 'Repeat during difficult moments'
        },
        {
          belief: 'I can be an amazing mother while still honoring my own needs',
          practice: 'Use when feeling guilty about self-care'
        }
      ],
      science: 'Neuroplasticity research shows that repeated affirmations literally rewire neural pathways. You\'re not just thinking positive thoughts - you\'re rebuilding your brain.',
      timing: [
        'Morning: Set intention for the day',
        'Midday: Redirect difficult moments',
        'Evening: Reinforce new patterns before sleep'
      ],
      background: 'gradient-affirmations',
      backgroundImage: '/images/biff01_imagine_woman_in_meditation_pose_serene_environment_br_1f66e17b-a951-4d9f-b895-127fabc89208_1.png'
    }
  },
  {
    id: 9,
    type: 'weekly-practices',
    content: {
      title: 'Your Week 2 Belief Practices',
      subtitle: 'Sustainable practices for belief transformation',
      practices: [
        {
          title: 'Daily Belief Awareness',
          duration: 'Throughout day',
          description: 'Ask: "What belief is driving this thought?"',
          icon: '🔍',
          frequency: 'Whenever you notice self-criticism or anxiety'
        },
        {
          title: 'Weekly Belief Update',
          duration: '15 minutes',
          description: 'Choose one belief to gently challenge and update',
          icon: '🔄',
          frequency: 'Every Sunday evening'
        },
        {
          title: 'Identity Integration Journaling',
          duration: '10 minutes',
          description: 'Honor all parts of yourself - mother and individual',
          icon: '📖',
          frequency: '3 times per week'
        },
        {
          title: 'New Belief Affirmations',
          duration: '5 minutes',
          description: 'Practice your 3 empowering beliefs',
          icon: '✨',
          frequency: 'Daily - morning, midday, evening'
        },
        {
          title: 'Compassionate Self-Talk Check',
          duration: '2 minutes',
          description: 'Notice your inner voice and adjust if needed',
          icon: '💭',
          frequency: 'Multiple times daily'
        }
      ],
      reminder: 'Start with just one practice. Consistency matters more than perfection.',
      background: 'gradient-practices',
      backgroundImage: '/images/biff01_imagine_woman_writing_in_journal_therapy_workbook_peac_7f6a2636-e20e-44c3-9edf-8de89e48ffc7_2.png'
    }
  },
  {
    id: 10,
    type: 'future-visioning',
    content: {
      title: 'Future Self Visioning',
      subtitle: 'Imagine yourself 6 months from now, living from these new beliefs',
      questions: [
        'How do you treat yourself?',
        'How do you ask for support?',
        'How do you handle challenges?',
        'What does self-compassion look like?',
        'How do you respond to setbacks?',
        'What boundaries do you maintain?',
        'How do you celebrate your progress?'
      ],
      guidance: 'This isn\'t fantasy - this is practicing your future self. Your brain doesn\'t distinguish between vividly imagined experiences and real ones. You\'re literally programming your neural pathways.',
      visualization: [
        'Close your eyes and breathe deeply',
        'Imagine yourself 6 months from now',
        'See yourself living from your new empowering beliefs',
        'Notice how you move through your day',
        'Feel the confidence and self-compassion',
        'Observe how you interact with others',
        'Experience the peace of honoring all parts of yourself'
      ],
      anchor: 'Take one specific image from this vision and use it as your daily anchor. When old beliefs surface, return to this future self.',
      background: 'gradient-vision',
      backgroundImage: '/images/biff01_imagine_woman_walking_in_nature_path_trees_and_flowers_dc53f2ba-0c3a-4b5a-a758-62679e547b70_1.png'
    }
  },
  {
    id: 11,
    type: 'bridge-forward',
    content: {
      title: 'What\'s Coming Next',
      subtitle: 'In our next lesson: Cognitive Wellness Integration',
      preview: 'We put it all together - creating sustainable cognitive wellness practices. You\'ll learn to integrate everything from this week into a personalized system for lifelong mental wellness.',
      reminder: 'You\'re not just changing thoughts - you\'re updating the blueprint of your mind.',
      encouragement: 'Every belief you question, every pattern you update, every moment of self-compassion - you\'re literally rewiring your brain for greater peace and joy.',
      truth: 'The mother you\'re becoming is not just surviving - she\'s thriving with wisdom, compassion, and strength.',
      closing: 'You\'re not just healing yourself. You\'re breaking generational patterns and modeling wholeness for your child.',
      background: 'gradient-sage-bloom',
      backgroundImage: '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__fe9419f0-6fe7-4ed9-9888-c062989a9600_1.png'
    }
  }
];

export default function Week2Lesson3Page() {
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
      'gradient-identity': 'bg-gradient-to-br from-purple-100 via-indigo-50 to-blue-100',
      'gradient-iceberg': 'bg-gradient-to-br from-cyan-100 via-blue-50 to-indigo-100',
      'gradient-beliefs': 'bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100',
      'gradient-archaeology': 'bg-gradient-to-br from-amber-100 via-orange-50 to-red-100',
      'gradient-update': 'bg-gradient-to-br from-pink-100 via-rose-50 to-red-100',
      'gradient-integration': 'bg-gradient-to-br from-violet-100 via-purple-50 to-indigo-100',
      'gradient-empowerment': 'bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100',
      'gradient-affirmations': 'bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100',
      'gradient-practices': 'bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100',
      'gradient-vision': 'bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100',
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
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-indigo-800/50 to-blue-700/40" />
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
                <Users className="w-16 h-16 mx-auto text-white/60" />
              </motion.div>
            </div>
          </div>
        );

      case 'iceberg-metaphor':
        return (
          <div className="relative min-h-screen flex items-center justify-center px-8 overflow-hidden">
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
                        <div className="bg-blue-100 p-6 rounded-xl">
                          <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                            <Search className="w-5 h-5" />
                            Surface Thought
                          </h4>
                          <p className="text-blue-700 italic">"{example.surface}"</p>
                        </div>
                        <div className="bg-purple-100 p-6 rounded-xl">
                          <h4 className="font-bold text-purple-800 mb-2 flex items-center gap-2">
                            <Compass className="w-5 h-5" />
                            Core Belief
                          </h4>
                          <p className="text-purple-700 italic">"{example.core}"</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 }}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                >
                  <p className="text-xl text-slate-700 mb-4">{slide.content.activation}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {slide.content.areas.map((area: string, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <Heart className="w-5 h-5 text-cyan-500" />
                        <p className="text-slate-700">{area}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5 }}
                  className="text-center bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                >
                  <p className="text-3xl font-playfair text-indigo-800 font-bold">
                    {slide.content.declaration}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        );

      case 'belief-categories':
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
                      {category.beliefs.map((belief: string, beliefIndex: number) => (
                        <motion.div
                          key={beliefIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.2 + beliefIndex * 0.1 }}
                          className="p-3 bg-gray-50 rounded-xl italic text-slate-700"
                        >
                          "{belief}"
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
                className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-3xl p-8 shadow-xl text-center border-l-8 border-emerald-400"
              >
                <Lightbulb className="w-16 h-16 mx-auto text-emerald-600 mb-4" />
                <p className="text-2xl font-bold text-emerald-800">
                  {slide.content.reflection}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'belief-archaeology':
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
                {slide.content.origins.map((origin: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.2 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-4xl">{origin.icon}</div>
                      <h3 className="text-2xl font-bold text-slate-800">{origin.type}</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {origin.examples.map((example: string, exampleIndex: number) => (
                        <motion.div
                          key={exampleIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.2 + exampleIndex * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <span className="text-amber-500 text-xl mt-1">•</span>
                          <p className="text-slate-700">{example}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 }}
                  className="bg-gradient-to-r from-orange-100 to-red-100 rounded-3xl p-8 shadow-xl text-center"
                >
                  <Shield className="w-16 h-16 mx-auto text-orange-600 mb-4" />
                  <p className="text-xl text-orange-800 mb-4">
                    {slide.content.reframe}
                  </p>
                  <p className="text-2xl font-bold text-red-800">
                    {slide.content.question}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5 }}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                >
                  <h3 className="text-2xl font-bold text-amber-800 mb-6 text-center">Gentle Inquiry</h3>
                  <div className="space-y-3">
                    {slide.content.gentleInquiry.map((question: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <Search className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                        <p className="text-slate-700 italic">{question}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-amber-700 mt-6 italic">{slide.content.note}</p>
                </motion.div>
              </div>
            </div>
          </div>
        );

      case 'belief-update-process':
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
                {slide.content.examples.map((example: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.2 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-red-100 p-6 rounded-xl">
                        <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                          <RefreshCw className="w-5 h-5" />
                          Old Belief
                        </h4>
                        <p className="text-red-700 italic">"{example.old}"</p>
                      </div>
                      <div className="bg-green-100 p-6 rounded-xl">
                        <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                          <Star className="w-5 h-5" />
                          Updated Belief
                        </h4>
                        <p className="text-green-700 italic">"{example.updated}"</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
              >
                <h3 className="text-3xl font-bold text-pink-800 mb-8 text-center">The Belief Update Process</h3>
                <div className="space-y-6">
                  {slide.content.process.map((step: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.4 + index * 0.1 }}
                      className="flex items-start gap-4 p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl"
                    >
                      <div className="w-10 h-10 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold">
                        {step.step}
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-lg font-bold text-slate-800 mb-2">{step.title}</h4>
                        {step.question && (
                          <p className="text-slate-700 italic">"{step.question}"</p>
                        )}
                        {step.questions && (
                          <div className="space-y-1">
                            {step.questions.map((question: string, qIndex: number) => (
                              <p key={qIndex} className="text-slate-700 italic">• "{question}"</p>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        );

      case 'identity-integration':
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

              <div className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {slide.content.identities.map((identity: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.2 }}
                      className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                    >
                      <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">
                        {identity.title}
                      </h3>
                      
                      <div className="space-y-3">
                        {identity.aspects.map((aspect: string, aspectIndex: number) => (
                          <motion.div
                            key={aspectIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + index * 0.2 + aspectIndex * 0.1 }}
                            className="flex items-start gap-3"
                          >
                            <Users className="w-5 h-5 text-violet-500 mt-1 flex-shrink-0" />
                            <p className="text-slate-700">{aspect}</p>
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
                  className="bg-gradient-to-r from-violet-100 to-purple-100 rounded-3xl p-8 shadow-xl text-center"
                >
                  <h3 className="text-2xl font-bold text-violet-800 mb-4">{slide.content.challenge}</h3>
                  <p className="text-3xl font-playfair text-purple-800 font-bold">
                    {slide.content.reframe}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 }}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                >
                  <h3 className="text-2xl font-bold text-indigo-800 mb-6 text-center">Both/And Identity Statements</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {slide.content.bothAndStatements.map((statement: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4 + index * 0.1 }}
                        className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl"
                      >
                        <Heart className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                        <p className="text-slate-700">{statement}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.8 }}
                  className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-3xl p-8 shadow-xl"
                >
                  <h3 className="text-2xl font-bold text-purple-800 mb-6 text-center">Identity Integration Practice</h3>
                  <div className="space-y-3">
                    {slide.content.exercise.map((prompt: string, index: number) => (
                      <div key={index} className="text-lg text-slate-700 italic text-center">
                        "{prompt}"
                      </div>
                    ))}
                  </div>
                  <p className="text-2xl font-bold text-indigo-800 text-center mt-6">
                    {slide.content.truth}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        );

      case 'empowering-beliefs':
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
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/80 via-teal-50/80 to-cyan-100/80" />
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
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.2 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                  >
                    <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">
                      {category.title}
                    </h3>
                    
                    <div className="space-y-3">
                      {category.beliefs.map((belief: string, beliefIndex: number) => (
                        <motion.div
                          key={beliefIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.2 + beliefIndex * 0.1 }}
                          className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl"
                        >
                          <Sparkles className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />
                          <p className="text-slate-700 italic">"{belief}"</p>
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
                className="bg-gradient-to-r from-teal-100 to-emerald-100 rounded-3xl p-8 shadow-xl text-center border-l-8 border-teal-400"
              >
                <Target className="w-16 h-16 mx-auto text-teal-600 mb-4" />
                <p className="text-2xl font-bold text-teal-800">
                  {slide.content.practice}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'belief-affirmations':
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

              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                >
                  <h3 className="text-2xl font-bold text-amber-800 mb-6">How to Practice</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {slide.content.instructions.map((instruction: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
                          {index + 1}
                        </div>
                        <p className="text-slate-700">{instruction}</p>
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
                  <h3 className="text-2xl font-bold text-orange-800 mb-6">Examples in Action</h3>
                  <div className="space-y-6">
                    {slide.content.examples.map((example: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 + index * 0.2 }}
                        className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl"
                      >
                        <p className="text-lg font-semibold text-orange-800 mb-2 italic">"{example.belief}"</p>
                        <p className="text-sm text-orange-700">{example.practice}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5 }}
                  className="bg-gradient-to-r from-yellow-100 to-amber-100 rounded-3xl p-8 shadow-xl"
                >
                  <h3 className="text-2xl font-bold text-yellow-800 mb-4 text-center">The Science</h3>
                  <p className="text-lg text-slate-700 mb-6 text-center">{slide.content.science}</p>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    {slide.content.timing.map((time: string, index: number) => (
                      <div key={index} className="text-center p-4 bg-white/60 rounded-xl">
                        <Sparkles className="w-8 h-8 mx-auto text-amber-600 mb-2" />
                        <p className="text-amber-800 font-semibold">{time}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        );

      case 'weekly-practices':
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
                <div className="absolute inset-0 bg-gradient-to-br from-rose-100/80 via-pink-50/80 to-purple-100/80" />
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
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-rose-600 font-semibold">{practice.duration}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-600">{practice.frequency}</span>
                        </div>
                      </div>
                      <div className="w-6 h-6 border-2 border-rose-400 rounded flex-shrink-0"></div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-3xl p-8 shadow-xl text-center border-l-8 border-pink-400"
              >
                <Lightbulb className="w-16 h-16 mx-auto text-pink-600 mb-4" />
                <p className="text-2xl font-bold text-pink-800">
                  {slide.content.reminder}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'future-visioning':
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
                <div className="absolute inset-0 bg-gradient-to-br from-sky-100/80 via-blue-50/80 to-indigo-100/80" />
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

              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                >
                  <h3 className="text-2xl font-bold text-sky-800 mb-6">Reflection Questions</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {slide.content.questions.map((question: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="flex items-start gap-3 p-4 bg-sky-50 rounded-xl"
                      >
                        <Compass className="w-5 h-5 text-sky-500 mt-1 flex-shrink-0" />
                        <p className="text-slate-700 italic">{question}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 }}
                  className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-3xl p-8 shadow-xl"
                >
                  <p className="text-xl text-blue-800 mb-6">{slide.content.guidance}</p>
                  
                  <div className="space-y-3">
                    <h4 className="text-lg font-bold text-indigo-800">Guided Visualization:</h4>
                    {slide.content.visualization.map((step: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.4 + index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
                          {index + 1}
                        </div>
                        <p className="text-slate-700">{step}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 }}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg"
                >
                  <Target className="w-12 h-12 mx-auto text-sky-600 mb-4" />
                  <p className="text-xl font-bold text-sky-800">
                    {slide.content.anchor}
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
                  <p className="text-2xl font-playfair text-teal-800 mb-4">
                    {slide.content.truth}
                  </p>
                  <p className="text-xl text-slate-700">
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
                    href="/course/week2/lesson4"
                    className="inline-block bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-teal-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Continue to Lesson 4 →
                  </Link>
                  <p className="text-white/80 text-sm">
                    Cognitive Wellness Integration
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
                <h3 className="text-2xl font-bold text-slate-800">Week 2 Lesson 3</h3>
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
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
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
                    ? 'w-12 bg-gradient-to-r from-purple-500 to-indigo-500'
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