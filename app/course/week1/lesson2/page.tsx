'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Menu, X, Heart, Clock, AlertTriangle, Shield, Sparkles } from 'lucide-react';

// Beautiful slide data that matches the comprehensive course content
const slides = [
  {
    id: 1,
    type: 'hero',
    content: {
      title: 'Your Body\'s Wisdom',
      subtitle: 'Recovery Reimagined',
      description: 'Today we\'re having the conversation about postpartum recovery that you deserved to have before you gave birth - but probably didn\'t get.',
      background: 'gradient-healing',
      backgroundImage: '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__1142a756-4014-4606-aced-81dd4005e812_0.png',
      overlay: true
    }
  },
  {
    id: 2,
    type: 'warrior-greeting',
    content: {
      title: 'Welcome Back, Warrior',
      message: 'We\'re going to talk about bleeding, sweating, leaking, pain, and yes, that first terrifying postpartum bowel movement.',
      reframe: 'But more than that, we\'re going to talk about your body\'s incredible wisdom.',
      truth: 'Everything you\'re experiencing - the discomfort, the strangeness, the not-feeling-like-yourself - isn\'t your body failing. It\'s your body succeeding at one of the most complex biological processes imaginable.',
      background: 'warm-earth',
      backgroundImage: '/images/biff01_imagine_exhausted_but_loving_mother_with_twins_double__b2ac5580-9b28-4752-a4b3-c61a524b828d_2.png'
    }
  },
  {
    id: 3,
    type: 'recovery-timeline',
    content: {
      title: 'The First 6 Weeks: Minute by Minute Honesty',
      subtitle: 'Let\'s talk about what\'s REALLY happening',
      phases: [
        {
          title: 'Weeks 1-2: The Immediate Aftermath',
          items: [
            'Lochia (bleeding) - your uterus shedding its pregnancy lining, like the world\'s longest period',
            'Night sweats that soak your sheets - your body releasing 40+ pounds of extra fluid',
            'Afterpains during nursing - your uterus contracting back to size',
            'Perineal/incision pain - your tissues healing from trauma',
            'Breast engorgement - your body learning to calibrate milk production',
            'Emotional lability - hormones dropping faster than a roller coaster'
          ]
        },
        {
          title: 'Weeks 3-4: The Fog',
          items: [
            'Continued bleeding (normal until 6-8 weeks)',
            'Bone-deep fatigue that sleep doesn\'t fix',
            'Hair starting to shed (you\'ll find it everywhere)',
            '\'Mom brain\' - actually your brain conserving energy for survival tasks',
            'Everything feeling surreal'
          ]
        },
        {
          title: 'Weeks 5-6: False Finish Line',
          items: [
            'Bleeding usually stopping',
            'Energy tiny bit better',
            'Pressure to \'be back to normal\'',
            'Reality: You\'re maybe 30% recovered'
          ]
        }
      ],
      truthBomb: 'The \'6-week clearance\' is about infection risk, not full healing. Your body needs 12-18 months to fully recover.',
      background: 'gradient-timeline',
      backgroundImage: '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__ca82a7b6-001d-4c7b-b403-35ee7f2d1300_2.png'
    }
  },
  {
    id: 4,
    type: 'hidden-recovery',
    content: {
      title: 'The Hidden Recovery',
      subtitle: 'What they don\'t tell you - healing happens in layers',
      phases: [
        {
          title: 'Months 2-6',
          icon: '🔄',
          items: [
            'Core and pelvic floor rebuilding (literal reconstruction)',
            'Hormonal fluctuations (especially if breastfeeding)',
            'Hair loss peak (month 3-4) - completely normal',
            'Sleep debt accumulation affecting everything',
            'Joint laxity from relaxin hormone',
            'Emotional integration of birth experience'
          ]
        },
        {
          title: 'Months 6-12',
          icon: '🌱',
          items: [
            'Gradual energy return',
            'New body equilibrium',
            'Hormonal stabilization',
            'Hair regrowth',
            'Relationship to body evolving'
          ]
        }
      ],
      permission: 'Your body isn\'t broken or slow. It\'s doing exactly what it needs to do. Healing happens in layers, not timelines.',
      background: 'gradient-iceberg',
      backgroundImage: '/images/biff01_imagine_mother_doing_gentle_yoga_while_baby_plays_on_m_f02d29cf-d33c-474c-bc39-c589f0768d8d_1.png'
    }
  },
  {
    id: 5,
    type: 'warning-signs',
    content: {
      title: 'When to Get Help',
      subtitle: 'Your intuition is your best guide',
      immediate: {
        title: 'Immediate (call now)',
        urgency: 'emergency',
        items: [
          'Heavy bleeding (pad per hour for 2+ hours)',
          'Fever over 100.4°F',
          'Severe headache with vision changes',
          'Difficulty breathing',
          'Thoughts of harm to self or baby',
          'Severe abdominal pain'
        ]
      },
      soon: {
        title: 'Soon (within 24 hours)',
        urgency: 'urgent',
        items: [
          'Foul-smelling discharge',
          'Red streaks from breast',
          'Unable to urinate',
          'Severe mood changes',
          'Any gut feeling that something\'s wrong'
        ]
      },
      empowerment: 'You know your body better than anyone. Trust yourself. Healthcare providers WANT you to call.',
      background: 'gradient-safety',
      backgroundImage: '/images/biff01_imagine_warm_modern_therapy_office_two_women_in_conver_1b19f253-c5eb-4b43-b05c-cabfbbf7c66b_3.png'
    }
  },
  {
    id: 6,
    type: 'rest-method',
    content: {
      title: 'Supporting Your Recovery',
      subtitle: 'The R.E.S.T. Method',
      methods: [
        {
          letter: 'R',
          title: 'RADICAL REST',
          description: 'Not just sleep (though that too). Rest from:',
          items: [
            'Decision-making when possible',
            'Social obligations',
            'Productivity pressure',
            'Comparison to others'
          ],
          icon: '💤',
          color: 'purple'
        },
        {
          letter: 'E',
          title: 'EMOTIONAL SUPPORT',
          description: 'Your feelings need tending too:',
          items: [
            'Professional counseling if needed',
            'Support groups with other mothers',
            'Friends who listen without judgment',
            'Family who understand boundaries'
          ],
          icon: '🤗',
          color: 'pink'
        },
        {
          letter: 'S',
          title: 'SOMATIC CARE',
          description: 'Your body needs gentle attention:',
          items: [
            'Warm baths for healing',
            'Gentle movement when ready',
            'Nutritious foods when possible',
            'Touch that feels good (massage, etc.)'
          ],
          icon: '🌿',
          color: 'green'
        },
        {
          letter: 'T',
          title: 'TIME PATIENCE',
          description: 'Healing happens on its own timeline:',
          items: [
            'Release timelines and expectations',
            'Honor your unique process',
            'Celebrate small improvements',
            'Trust your body\'s wisdom'
          ],
          icon: '⏰',
          color: 'blue'
        }
      ],
      background: 'gradient-rest',
      backgroundImage: '/images/biff01_imagine_woman_doing_morning_skincare_routine_bathroom__ee80f468-185d-4a1e-bc41-4400f6cec9b8_0.png'
    }
  },
  {
    id: 7,
    type: 'body-appreciation',
    content: {
      title: 'Your Body Deserves Reverence',
      subtitle: 'A moment of appreciation for what you\'ve accomplished',
      accomplishments: [
        'You grew a human being from two microscopic cells',
        'Your heart pumped 50% more blood for months',
        'Your organs literally shifted to make room for life',
        'You delivered a baby through your body',
        'You\'re now sustaining another life (if breastfeeding)',
        'You\'re healing while functioning as a mother'
      ],
      truth: 'Your body is not broken. Your body is not slow. Your body is extraordinary.',
      appreciation: 'Today, instead of criticizing your body, try thanking it.',
      background: 'gradient-reverence',
      backgroundImage: '/images/biff01_imagine_confident_single_mother_holding_baby_standing__b3179601-8cbf-4af3-9b29-bedcbc4946a3_0.png'
    }
  },
  {
    id: 8,
    type: 'practice-medicine',
    content: {
      title: 'Your Medicine This Week',
      subtitle: 'Body appreciation practice',
      practice: {
        name: 'The Body Gratitude Practice',
        frequency: 'Once daily',
        instruction: 'Each morning, place your hands on different parts of your body and say:',
        words: [
          'Thank you, hands, for holding my baby',
          'Thank you, arms, for your strength',
          'Thank you, heart, for beating for two',
          'Thank you, body, for creating life'
        ]
      },
      science: 'Gratitude practices rewire your brain toward appreciation rather than criticism. Touch releases oxytocin and reduces cortisol.',
      truth: 'This is nervous system healing through self-compassion.',
      background: 'gradient-gratitude',
      backgroundImage: '/images/Services/Hopeful Hands.png'
    }
  },
  {
    id: 9,
    type: 'bridge-forward',
    content: {
      title: 'What\'s Coming Next',
      subtitle: 'In our next lesson: Emotions and Feelings',
      preview: 'We\'ll explore the emotional landscape of early motherhood. The rage, the grief, the overwhelm, the unexpected moments of pure love - and how to navigate it all with wisdom and self-compassion.',
      reminder: 'Remember: Your body is wise. Your healing is happening. Your timeline is perfect.',
      closing: 'Rest well, warrior.',
      background: 'gradient-sage-bloom',
      backgroundImage: '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__50517b23-5b36-4135-b2d1-db7a7c23ff79_1.png'
    }
  }
];

export default function Lesson2Page() {
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
      'gradient-healing': 'bg-gradient-to-br from-emerald-100 via-teal-50 to-green-50',
      'warm-earth': 'bg-gradient-to-br from-amber-100 via-orange-50 to-red-50',
      'gradient-timeline': 'bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-50',
      'gradient-iceberg': 'bg-gradient-to-br from-cyan-100 via-blue-50 to-indigo-50',
      'gradient-safety': 'bg-gradient-to-br from-rose-100 via-pink-50 to-red-50',
      'gradient-rest': 'bg-gradient-to-br from-violet-100 via-purple-50 to-indigo-50',
      'gradient-reverence': 'bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-50',
      'gradient-gratitude': 'bg-gradient-to-br from-pink-100 via-rose-50 to-red-50',
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
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/70 via-teal-800/50 to-green-700/40" />
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
                <Sparkles className="w-16 h-16 mx-auto text-white/60" />
              </motion.div>
            </div>
          </div>
        );

      case 'warrior-greeting':
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
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100/80 via-orange-50/80 to-red-50/80" />
              </div>
            )}

            <div className="relative z-10 max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
              >
                <h1 className="text-5xl md:text-7xl font-playfair text-slate-800 mb-8">
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
                  <p className="text-2xl text-slate-700 leading-relaxed mb-6">
                    {slide.content.message}
                  </p>
                  <p className="text-2xl text-amber-700 font-semibold italic">
                    {slide.content.reframe}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-10 shadow-xl border-l-8 border-amber-400"
                >
                  <p className="text-xl text-slate-700 leading-relaxed">
                    {slide.content.truth}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        );

      case 'recovery-timeline':
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
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/80 via-indigo-50/80 to-purple-50/80" />
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

              <div className="space-y-8 mb-16">
                {slide.content.phases.map((phase: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.2 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {index + 1}
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800">{phase.title}</h3>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      {phase.items.map((item: string, itemIndex: number) => (
                        <motion.div
                          key={itemIndex}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + index * 0.2 + itemIndex * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <Clock className="w-5 h-5 text-indigo-500 mt-1 flex-shrink-0" />
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
                className="bg-gradient-to-r from-red-100 to-pink-100 rounded-3xl p-8 shadow-xl text-center"
              >
                <div className="text-6xl mb-4">💡</div>
                <p className="text-2xl font-bold text-red-800">
                  {slide.content.truthBomb}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'hidden-recovery':
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
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/80 via-blue-50/80 to-indigo-50/80" />
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

              <div className="grid md:grid-cols-2 gap-8 mb-16">
                {slide.content.phases.map((phase: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.2 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                  >
                    <div className="text-center mb-6">
                      <div className="text-6xl mb-4">{phase.icon}</div>
                      <h3 className="text-2xl font-bold text-slate-800">{phase.title}</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {phase.items.map((item: string, itemIndex: number) => (
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
                transition={{ delay: 1.2 }}
                className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-3xl p-8 shadow-xl text-center border-l-8 border-cyan-400"
              >
                <p className="text-2xl font-playfair text-cyan-800 italic">
                  {slide.content.permission}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'warning-signs':
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
                <div className="absolute inset-0 bg-gradient-to-br from-rose-100/80 via-pink-50/80 to-red-50/80" />
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

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-l-8 border-red-500"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <AlertTriangle className="w-12 h-12 text-red-500" />
                    <h3 className="text-2xl font-bold text-red-800">{slide.content.immediate.title}</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {slide.content.immediate.items.map((item: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <span className="text-red-500 text-xl mt-1">•</span>
                        <p className="text-slate-700 font-medium">{item}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-l-8 border-orange-500"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <Clock className="w-12 h-12 text-orange-500" />
                    <h3 className="text-2xl font-bold text-orange-800">{slide.content.soon.title}</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {slide.content.soon.items.map((item: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <span className="text-orange-500 text-xl mt-1">•</span>
                        <p className="text-slate-700 font-medium">{item}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 shadow-xl text-center border-l-8 border-green-400"
              >
                <Shield className="w-16 h-16 mx-auto text-green-600 mb-4" />
                <p className="text-2xl font-bold text-green-800">
                  {slide.content.empowerment}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'rest-method':
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
                <div className="absolute inset-0 bg-gradient-to-br from-violet-100/80 via-purple-50/80 to-indigo-50/80" />
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

              <div className="grid md:grid-cols-2 gap-8">
                {slide.content.methods.map((method: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.2 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                  >
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">{method.letter}</span>
                      </div>
                      <div className="text-4xl mb-2">{method.icon}</div>
                      <h3 className="text-2xl font-bold text-slate-800">{method.title}</h3>
                      <p className="text-lg text-slate-600 mt-2">{method.description}</p>
                    </div>
                    
                    <div className="space-y-3">
                      {method.items.map((item: string, itemIndex: number) => (
                        <motion.div
                          key={itemIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.2 + itemIndex * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <span className="text-violet-500 text-xl mt-1">•</span>
                          <p className="text-slate-700">{item}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'body-appreciation':
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
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/80 via-amber-50/80 to-orange-50/80" />
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

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl mb-12"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  {slide.content.accomplishments.map((accomplishment: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-xl hover:bg-amber-50 transition-colors"
                    >
                      <Sparkles className="w-6 h-6 text-amber-500 mt-1 flex-shrink-0" />
                      <p className="text-lg text-slate-700">{accomplishment}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="text-center space-y-8"
              >
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-3xl p-8 shadow-xl">
                  <p className="text-3xl font-playfair text-amber-800 font-bold mb-4">
                    {slide.content.truth}
                  </p>
                  <p className="text-xl text-slate-700">
                    {slide.content.appreciation}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        );

      case 'practice-medicine':
        return (
          <div className="relative min-h-screen flex items-center justify-center px-8 py-16 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-rose-50 to-red-50" />
            {slide.content.backgroundImage && (
              <div className="absolute inset-0">
                <Image
                  src={slide.content.backgroundImage}
                  alt="Background"
                  fill
                  className="object-cover opacity-20"
                />
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
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-pink-800 mb-4">
                    {slide.content.practice.name}
                  </h2>
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <Heart className="w-8 h-8 text-pink-600" />
                    <span className="text-xl text-slate-600">
                      {slide.content.practice.frequency}
                    </span>
                  </div>
                  <p className="text-xl text-slate-700 mb-8">
                    {slide.content.practice.instruction}
                  </p>
                </div>

                <div className="space-y-6">
                  {slide.content.practice.words.map((word: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + index * 0.3 }}
                      className="text-2xl md:text-3xl font-playfair text-pink-800 italic p-6 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl"
                    >
                      "{word}"
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5 }}
                  className="mt-12 text-6xl"
                >
                  🙏
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3 }}
                className="space-y-6"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                  <p className="text-xl text-slate-700 mb-4">
                    {slide.content.science}
                  </p>
                  <p className="text-2xl font-bold text-pink-800">
                    {slide.content.truth}
                  </p>
                </div>
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
                <p className="text-xl text-slate-700 leading-relaxed">
                  {slide.content.preview}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="space-y-8"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                  <p className="text-xl text-slate-700 italic mb-4">
                    {slide.content.reminder}
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
                    href="/course/week1/lesson3"
                    className="inline-block bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-teal-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Continue to Lesson 3 →
                  </Link>
                  <p className="text-white/80 text-sm">
                    Emotional Alchemy - Transforming Difficult Feelings
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
            href="/course/week1"
            className="text-white/80 hover:text-white bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Week 1
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
                <h3 className="text-2xl font-bold text-slate-800">Lesson 2 Navigation</h3>
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