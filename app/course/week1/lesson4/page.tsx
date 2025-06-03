'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Menu, X, Home, Heart, Users, Settings, CheckCircle, Star, Target, Shield } from 'lucide-react';

// Beautiful slide data that matches the comprehensive course content
const slides = [
  {
    id: 1,
    type: 'hero',
    content: {
      title: 'Building Your Foundation',
      subtitle: 'The Four Pillars of Thriving',
      description: 'We\'ve explored your physical reality, emotional landscape, and now we\'re moving from understanding to designing. Today we architect your foundation for thriving.',
      background: 'gradient-foundation',
      backgroundImage: '/images/biff01_imagine_confident_single_mother_holding_baby_standing__b3179601-8cbf-4af3-9b29-bedcbc4946a3_3.png',
      overlay: true
    }
  },
  {
    id: 2,
    type: 'transition-moment',
    content: {
      title: 'From Surviving to Designing',
      message: 'You\'ve been in survival mode - and rightfully so. But starting today, we begin building something sustainable.',
      insights: [
        'Not a perfect life, but a supported one',
        'Not a life without struggle, but one with resources for resilience',
        'Not optimization, but foundation'
      ],
      declaration: 'Today we architect your foundation for thriving.',
      background: 'gradient-transition',
      backgroundImage: '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__398f4fdc-0cf7-49c6-9999-2bad6ee68990_0.png'
    }
  },
  {
    id: 3,
    type: 'four-pillars',
    content: {
      title: 'The Four Pillars Framework',
      subtitle: 'Your holistic wellness foundation',
      pillars: [
        {
          number: 1,
          title: 'SOMATIC WELLNESS',
          subtitle: 'Your Body-Mind',
          elements: [
            'Physical recovery and energy management',
            'Nervous system regulation',
            'Embodied self-care practices',
            'Medical and therapeutic support'
          ],
          icon: '🌿',
          color: 'green'
        },
        {
          number: 2,
          title: 'EMOTIONAL WELLNESS',
          subtitle: 'Your Inner World',
          elements: [
            'Feeling processing and integration',
            'Self-compassion practices',
            'Joy cultivation and meaning-making',
            'Professional mental health support'
          ],
          icon: '💝',
          color: 'pink'
        },
        {
          number: 3,
          title: 'RELATIONAL WELLNESS',
          subtitle: 'Your Connections',
          elements: [
            'Partnership dynamics and communication',
            'Family system navigation',
            'Friendship and community building',
            'Boundaries and reciprocity'
          ],
          icon: '🤝',
          color: 'blue'
        },
        {
          number: 4,
          title: 'SYSTEMIC WELLNESS',
          subtitle: 'Your Environment',
          elements: [
            'Practical support systems',
            'Financial security and planning',
            'Household management',
            'Childcare and backup plans'
          ],
          icon: '🏠',
          color: 'purple'
        }
      ],
      systemsThinking: 'When one pillar is weak, the others compensate - but become overloaded. Our goal is steady, sustainable support across all four.',
      background: 'gradient-pillars',
      backgroundImage: '/images/biff01_imagine_cozy_therapy_office_comfortable_armchair_warm__94d6aae4-5275-4cd2-82da-84152a031c82_0.png'
    }
  },
  {
    id: 4,
    type: 'pillar-assessment',
    content: {
      title: 'Pillar Assessment',
      subtitle: 'Where you are now (1-10 scale)',
      assessments: [
        {
          pillar: 'Somatic Wellness',
          questions: [
            'How supported is your physical recovery?',
            'How regulated is your nervous system?', 
            'How sustainable is your energy management?'
          ],
          color: 'green',
          icon: '🌿'
        },
        {
          pillar: 'Emotional Wellness',
          questions: [
            'How well are you processing feelings?',
            'How kind is your inner dialogue?',
            'How connected are you to joy and meaning?'
          ],
          color: 'pink',
          icon: '💝'
        },
        {
          pillar: 'Relational Wellness',
          questions: [
            'How supported do you feel in your relationships?',
            'How clear are your boundaries?',
            'How much reciprocity exists in your connections?'
          ],
          color: 'blue',
          icon: '🤝'
        },
        {
          pillar: 'Systemic Wellness',
          questions: [
            'How much practical support do you have?',
            'How secure do you feel about logistics?',
            'How manageable is your daily life?'
          ],
          color: 'purple',
          icon: '🏠'
        }
      ],
      wisdom: 'Most new mothers score low across multiple pillars. This isn\'t failure - it\'s information. We\'re not aiming for 10s. We\'re aiming for enough support to breathe and grow.',
      background: 'gradient-assessment',
      backgroundImage: '/images/biff01_imagine_woman_writing_in_journal_therapy_workbook_peac_7f6a2636-e20e-44c3-9edf-8de89e48ffc7_0.png'
    }
  },
  {
    id: 5,
    type: 'mvw-plan',
    content: {
      title: 'Minimum Viable Wellness Plan',
      subtitle: 'The absolute basics for daily functioning',
      daily: {
        title: 'Daily Non-Negotiables (Choose 3)',
        options: [
          'Hydration tracking (water bottle always with you)',
          'One nourishing meal (even if someone else makes it)',
          '10 minutes outside (even if just sitting on porch)',
          'One supportive interaction (text counts)',
          'Basic hygiene (shower OR face wash)',
          'Three conscious breaths when triggered',
          'One self-compassion phrase',
          'Ask for one specific help'
        ]
      },
      weekly: {
        title: 'Weekly Essentials (Choose 2)',
        options: [
          'One longer rest period',
          'One joy activity (even 15 minutes)',
          'One administrative task completed',
          'One relationship tending conversation',
          'One boundary set or honored'
        ]
      },
      principle: 'This isn\'t about optimization. It\'s about creating minimum conditions for your nervous system to stay regulated and your soul to stay connected.',
      background: 'gradient-mvw',
      backgroundImage: '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__1c12cc3c-cebd-47e2-ad9b-66b9bbca6480_0.png'
    }
  },
  {
    id: 6,
    type: 'support-ecosystem',
    content: {
      title: 'Building Your Support Ecosystem',
      subtitle: 'Create your comprehensive support map',
      supportTypes: [
        {
          title: 'Immediate Support',
          purpose: 'For today\'s needs',
          questions: [
            'Who can you text right now if overwhelmed?',
            'Who can come over within 2 hours if needed?',
            'Who can take baby for 30 minutes so you can rest?'
          ],
          icon: '🆘',
          color: 'red'
        },
        {
          title: 'Ongoing Support',
          purpose: 'For weekly needs',
          questions: [
            'Who can help with groceries/meals?',
            'Who can provide regular emotional check-ins?',
            'What services can you hire/ask for help with?'
          ],
          icon: '🔄',
          color: 'blue'
        },
        {
          title: 'Professional Support',
          purpose: 'For specialized needs',
          questions: [
            'Primary care provider',
            'Mental health therapist',
            'Lactation consultant (if breastfeeding)',
            'Pelvic floor physical therapist'
          ],
          icon: '👩‍⚕️',
          color: 'green'
        },
        {
          title: 'Crisis Support',
          purpose: 'For emergency needs',
          questions: [
            'Mental health crisis line',
            'Postpartum Support International',
            'Emergency medical care',
            'Trusted person who can take baby immediately'
          ],
          icon: '🚨',
          color: 'orange'
        }
      ],
      actionStep: 'Fill in at least one name/resource in each category. Having the map reduces panic when needs arise.',
      background: 'gradient-support',
      backgroundImage: '/images/biff01_imagine_supportive_womens_group_therapy_session_circle_41bd705b-5dd8-4957-a199-b2fa0530b46f_3.png'
    }
  },
  {
    id: 7,
    type: 'week-integration',
    content: {
      title: 'Week 1 Integration Ritual',
      subtitle: 'Closing with intention',
      accomplishments: [
        '✓ You showed up for learning',
        '✓ You gained language for your experience',
        '✓ You created initial support maps',
        '✓ You practiced self-compassion',
        '✓ You\'re building awareness'
      ],
      reflections: [
        'What\'s one insight that shifted something for you?',
        'What\'s one practice you want to continue?',
        'What\'s one support you\'re ready to reach for?'
      ],
      intentions: [
        'Next week, I will focus on...',
        'I give myself permission to...',
        'I commit to practicing...'
      ],
      background: 'gradient-integration',
      backgroundImage: '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__72d992a9-06a2-4aaa-b638-c60672b45c5f_3.png'
    }
  },
  {
    id: 8,
    type: 'week2-preview',
    content: {
      title: 'What\'s Coming in Week 2',
      subtitle: 'Cognitive Tools & Thought Patterns',
      preview: 'Next week, we dive deeper into working with difficult thoughts and creating cognitive flexibility. We\'ll learn tools from CBT and ACT to help you relate differently to worry, self-criticism, and catastrophic thinking.',
      topics: [
        'Understanding thought patterns vs. reality',
        'Cognitive defusion techniques',
        'The anxiety spiral and how to interrupt it',
        'Building mental flexibility and resilience'
      ],
      encouragement: 'But for now, rest in what you\'ve accomplished. You\'ve built the foundation. Everything else is building upon this solid base.',
      background: 'gradient-preview',
      backgroundImage: '/images/biff01_imagine_woman_in_meditation_pose_serene_environment_br_1f66e17b-a951-4d9f-b895-127fabc89208_3.png'
    }
  },
  {
    id: 9,
    type: 'closing-blessing',
    content: {
      title: 'Your Foundation is Strong',
      blessing: [
        'May you be gentle with yourself this week.',
        'May you reach for support when you need it.',
        'May you remember that healing isn\'t linear.',
        'And may you trust that you\'re exactly where you need to be.'
      ],
      closing: 'See you next week, warrior. You\'re doing beautifully.',
      background: 'gradient-sage-bloom',
      backgroundImage: '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__fe9419f0-6fe7-4ed9-9888-c062989a9600_1.png'
    }
  }
];

export default function Lesson4Page() {
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
      'gradient-foundation': 'bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100',
      'gradient-transition': 'bg-gradient-to-br from-amber-100 via-orange-50 to-red-100',
      'gradient-pillars': 'bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100',
      'gradient-assessment': 'bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100',
      'gradient-mvw': 'bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100',
      'gradient-support': 'bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100',
      'gradient-integration': 'bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100',
      'gradient-preview': 'bg-gradient-to-br from-cyan-100 via-blue-50 to-indigo-100',
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
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/70 via-teal-800/50 to-cyan-700/40" />
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
                <Home className="w-16 h-16 mx-auto text-white/60" />
              </motion.div>
            </div>
          </div>
        );

      case 'transition-moment':
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
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100/80 via-orange-50/80 to-red-100/80" />
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
                        <CheckCircle className="w-6 h-6 text-emerald-500 mt-1 flex-shrink-0" />
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
                  <p className="text-3xl font-playfair text-emerald-800 italic">
                    {slide.content.declaration}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        );

      case 'four-pillars':
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
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/80 via-purple-50/80 to-pink-100/80" />
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
                {slide.content.pillars.map((pillar: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.2 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                  >
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">{pillar.number}</span>
                      </div>
                      <div className="text-5xl mb-2">{pillar.icon}</div>
                      <h3 className="text-2xl font-bold text-slate-800">{pillar.title}</h3>
                      <p className="text-lg text-slate-600 italic">{pillar.subtitle}</p>
                    </div>
                    
                    <div className="space-y-3">
                      {pillar.elements.map((element: string, elementIndex: number) => (
                        <motion.div
                          key={elementIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.2 + elementIndex * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <span className="text-indigo-500 text-xl mt-1">•</span>
                          <p className="text-slate-700">{element}</p>
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
                <Settings className="w-16 h-16 mx-auto text-purple-600 mb-4" />
                <p className="text-2xl font-bold text-purple-800">
                  {slide.content.systemsThinking}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'pillar-assessment':
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

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {slide.content.assessments.map((assessment: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.2 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                  >
                    <div className="text-center mb-6">
                      <div className="text-5xl mb-4">{assessment.icon}</div>
                      <h3 className="text-2xl font-bold text-slate-800">{assessment.pillar}</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {assessment.questions.map((question: string, questionIndex: number) => (
                        <motion.div
                          key={questionIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.2 + questionIndex * 0.1 }}
                          className="p-4 bg-gray-50 rounded-xl"
                        >
                          <p className="text-slate-700 mb-3">{question}</p>
                          <div className="flex items-center gap-2">
                            {[1,2,3,4,5,6,7,8,9,10].map(num => (
                              <div key={num} className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs text-gray-500">
                                {num}
                              </div>
                            ))}
                          </div>
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
                className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-3xl p-8 shadow-xl text-center border-l-8 border-blue-400"
              >
                <Shield className="w-16 h-16 mx-auto text-blue-600 mb-4" />
                <p className="text-2xl font-bold text-blue-800">
                  {slide.content.wisdom}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'mvw-plan':
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
                <p className="text-2xl text-slate-600">
                  {slide.content.subtitle}
                </p>
              </motion.div>

              <div className="space-y-8 mb-12">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                >
                  <h3 className="text-2xl font-bold text-emerald-800 mb-6 flex items-center gap-3">
                    <Target className="w-8 h-8" />
                    {slide.content.daily.title}
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {slide.content.daily.options.map((option: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-emerald-50 transition-colors"
                      >
                        <div className="w-5 h-5 border-2 border-emerald-400 rounded mt-1 flex-shrink-0"></div>
                        <p className="text-slate-700">{option}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                >
                  <h3 className="text-2xl font-bold text-teal-800 mb-6 flex items-center gap-3">
                    <Star className="w-8 h-8" />
                    {slide.content.weekly.title}
                  </h3>
                  
                  <div className="space-y-3">
                    {slide.content.weekly.options.map((option: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-teal-50 transition-colors"
                      >
                        <div className="w-5 h-5 border-2 border-teal-400 rounded mt-1 flex-shrink-0"></div>
                        <p className="text-slate-700">{option}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-3xl p-8 shadow-xl text-center border-l-8 border-emerald-400"
              >
                <Heart className="w-16 h-16 mx-auto text-emerald-600 mb-4" />
                <p className="text-2xl font-bold text-emerald-800">
                  {slide.content.principle}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'support-ecosystem':
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

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {slide.content.supportTypes.map((type: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.2 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                  >
                    <div className="text-center mb-6">
                      <div className="text-5xl mb-4">{type.icon}</div>
                      <h3 className="text-2xl font-bold text-slate-800">{type.title}</h3>
                      <p className="text-sm text-rose-600 italic">{type.purpose}</p>
                    </div>
                    
                    <div className="space-y-3">
                      {type.questions.map((question: string, questionIndex: number) => (
                        <motion.div
                          key={questionIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.2 + questionIndex * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <Users className="w-5 h-5 text-rose-500 mt-1 flex-shrink-0" />
                          <p className="text-slate-700">{question}</p>
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
                <Home className="w-16 h-16 mx-auto text-green-600 mb-4" />
                <p className="text-2xl font-bold text-green-800">
                  {slide.content.actionStep}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'week-integration':
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
                  <h3 className="text-2xl font-bold text-amber-800 mb-6">Your Week 1 Accomplishments</h3>
                  <div className="space-y-3">
                    {slide.content.accomplishments.map((accomplishment: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="text-lg text-slate-700"
                      >
                        {accomplishment}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                  >
                    <h3 className="text-xl font-bold text-orange-800 mb-4">Reflection Questions</h3>
                    <div className="space-y-3">
                      {slide.content.reflections.map((reflection: string, index: number) => (
                        <div key={index} className="text-slate-700">
                          • {reflection}
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                  >
                    <h3 className="text-xl font-bold text-yellow-800 mb-4">Setting Intentions</h3>
                    <div className="space-y-3">
                      {slide.content.intentions.map((intention: string, index: number) => (
                        <div key={index} className="text-slate-700">
                          • {intention}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'week2-preview':
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

            <div className="relative z-10 max-w-5xl mx-auto text-center">
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
                <p className="text-xl text-slate-700 leading-relaxed mb-8">
                  {slide.content.preview}
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  {slide.content.topics.map((topic: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + index * 0.2 }}
                      className="flex items-start gap-3 p-4 bg-cyan-50 rounded-xl"
                    >
                      <CheckCircle className="w-5 h-5 text-cyan-600 mt-1 flex-shrink-0" />
                      <p className="text-slate-700">{topic}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg"
              >
                <p className="text-xl text-slate-700 italic">
                  {slide.content.encouragement}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'closing-blessing':
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
                <h1 className="text-5xl md:text-6xl font-playfair text-white mb-12">
                  {slide.content.title}
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl mb-12"
              >
                <div className="space-y-6">
                  {slide.content.blessing.map((line: string, index: number) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + index * 0.3 }}
                      className="text-xl text-slate-700 leading-relaxed"
                    >
                      {line}
                    </motion.p>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5 }}
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
                  transition={{ delay: 3.5 }}
                  className="mt-8 space-y-4"
                >
                  <Link
                    href="/learn/postpartum-wellness-foundations"
                    className="inline-block bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-teal-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Continue to Week 1 Workbook →
                  </Link>
                  <p className="text-white/80 text-sm">
                    Complete your reflections and exercises
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 4 }}
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
            href="/course/week1"
            className="text-white/80 hover:text-white bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Week 1
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="text-white/80 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-lg">
              Lesson 4: {currentSlide + 1} / {slides.length}
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
                <h3 className="text-2xl font-bold text-slate-800">Lesson 4 Navigation</h3>
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
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
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
                    ? 'w-12 bg-gradient-to-r from-emerald-500 to-teal-500'
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