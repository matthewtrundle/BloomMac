'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Menu, X, Heart, Brain, Palette, Shield, Lightbulb, Eye, Users, Home } from 'lucide-react';

// Beautiful slide data that matches the comprehensive course content
const slides = [
  {
    id: 1,
    type: 'hero',
    content: {
      title: 'Emotional Alchemy',
      subtitle: 'Transforming Difficult Feelings',
      description: 'Today we dive into the emotional ocean of early motherhood. Not to fix your feelings, but to understand them as messengers of your psyche\'s wisdom.',
      background: 'gradient-emotional',
      backgroundImage: '/images/biff01_imagine_woman_in_meditation_pose_serene_environment_br_1f66e17b-a951-4d9f-b895-127fabc89208_1.png',
      overlay: true
    }
  },
  {
    id: 2,
    type: 'permission-to-feel',
    content: {
      title: 'Permission to Feel Everything',
      message: 'If you cried yesterday, you\'re in perfect company. If you felt rage, confusion, or numbness - also perfect company. If you felt joy and guilt about feeling joy - you belong here too.',
      truth: 'In my 15 years as a perinatal psychologist, I\'ve learned this: There are no wrong feelings in the fourth trimester.',
      foundational: 'Every emotion you\'re experiencing is either:',
      points: [
        'A normal response to extraordinary change, or',
        'Information about what you need'
      ],
      declaration: 'Today, we become emotion scientists together.',
      background: 'gradient-rainbow',
      backgroundImage: '/images/biff01_imagine_supportive_womens_group_therapy_session_circle_41bd705b-5dd8-4957-a199-b2fa0530b46f_3.png'
    }
  },
  {
    id: 3,
    type: 'brain-transformation',
    content: {
      title: 'Your Changing Brain',
      subtitle: 'The neuroscience of motherhood',
      transformations: [
        {
          region: 'Amygdala (fear center)',
          change: '20% larger, hypervigilant',
          meaning: 'Your anxiety is your amygdala doing its job'
        },
        {
          region: 'Prefrontal cortex',
          change: 'Temporarily reduced',
          meaning: 'Your forgetfulness is brain prioritizing survival tasks'
        },
        {
          region: 'Insula',
          change: 'Enhanced for reading cues',
          meaning: 'Your emotional intensity helps you read your baby'
        },
        {
          region: 'Dopamine pathways',
          change: 'Rewiring for attachment',
          meaning: 'Your brain is learning to love in new ways'
        }
      ],
      hormones: [
        'Estrogen and progesterone: Dropped 90% (imagine going off antidepressants overnight)',
        'Prolactin: Surging (affects mood and anxiety)',
        'Oxytocin: Fluctuating (bonding and contractions)',
        'Cortisol: Often elevated (stress response)'
      ],
      insight: 'You\'re not losing your mind. You\'re gaining a mother\'s mind.',
      revolutionary: 'Your emotional intensity is FUNCTIONAL.',
      background: 'gradient-neural',
      backgroundImage: '/images/biff01_imagine_woman_in_meditation_pose_serene_environment_br_43b6047c-916a-43b2-afc2-5449ec040f7c_1.png'
    }
  },
  {
    id: 4,
    type: 'feeling-spectrum',
    content: {
      title: 'The Feeling Spectrum',
      subtitle: 'Normalizing the \'abnormal\'',
      emotionPairs: [
        {
          title: 'Love & Terror (simultaneously)',
          emotions: [
            'Fierce love that feels overwhelming',
            'Fear something will happen to baby',
            'Protective rage at the world'
          ],
          color: 'red'
        },
        {
          title: 'Grief & Joy (coexisting)',
          emotions: [
            'Mourning your previous life',
            'Celebrating your baby',
            'Missing who you were',
            'Discovering who you\'re becoming'
          ],
          color: 'blue'
        },
        {
          title: 'Rage & Guilt (cycling)',
          emotions: [
            'Anger at lack of support',
            'Rage at your partner\'s freedom',
            'Guilt about feeling angry',
            'Resentment about sacrifice'
          ],
          color: 'orange'
        },
        {
          title: 'Numbness & Overwhelm (alternating)',
          emotions: [
            'Feeling nothing despite \'should\' feeling everything',
            'Emotional flooding from hormones',
            'Dissociation as protection'
          ],
          color: 'purple'
        }
      ],
      validation: 'If you\'re feeling ALL of these in one day - or one hour - you\'re not unstable. You\'re human experiencing the most complex emotional transition possible.',
      background: 'gradient-spectrum',
      backgroundImage: '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__7deac91b-3809-41a0-bb6f-16208062f916_3.png'
    }
  },
  {
    id: 5,
    type: 'hidden-feelings',
    content: {
      title: 'The Hidden Feelings',
      subtitle: 'Breaking the silence',
      categories: [
        {
          title: 'Regret',
          icon: '💔',
          thoughts: [
            'Sometimes I wish I hadn\'t had a baby',
            'I want my old life back',
            'I don\'t know if I\'m cut out for this'
          ]
        },
        {
          title: 'Resentment',
          icon: '😤',
          thoughts: [
            'Everyone else\'s life stayed the same',
            'My partner doesn\'t understand',
            'I feel like I\'ve lost myself'
          ]
        },
        {
          title: 'Fear of Not Loving Enough',
          icon: '😰',
          thoughts: [
            'I don\'t feel the instant bond I expected',
            'What if I\'m not a natural mother?',
            'Am I damaging my baby by feeling this way?'
          ]
        },
        {
          title: 'Intrusive Thoughts',
          icon: '⚡',
          thoughts: [
            'What if I drop the baby?',
            'What if I hurt my baby?',
            'What if something terrible happens?'
          ]
        }
      ],
      clinicalWisdom: 'These thoughts occur in 40-80% of new mothers. They\'re not predictions. They\'re your hypervigilant brain checking for dangers.',
      truth: 'Having these thoughts doesn\'t make you a bad mother. It makes you a mother whose brain is working overtime to protect your child.',
      whenToWorry: [
        'Persistent and distressing',
        'Accompanied by urges to act',
        'Preventing you from caring for baby',
        'Making you avoid being alone with baby'
      ],
      background: 'gradient-safety',
      backgroundImage: '/images/biff01_imagine_warm_modern_therapy_office_two_women_in_conver_1b19f253-c5eb-4b43-b05c-cabfbbf7c66b_3.png'
    }
  },
  {
    id: 6,
    type: 'pause-method',
    content: {
      title: 'The P.A.U.S.E. Method',
      subtitle: 'Emotional regulation for overwhelming moments',
      steps: [
        {
          letter: 'P',
          title: 'PAUSE & NOTICE',
          description: 'Create space to observe what\'s happening',
          prompts: [
            '"I notice I\'m feeling..." (Name it specifically)',
            '"I notice this in my body..." (Where do you feel it?)',
            '"I notice my thoughts are..." (Racing? Catastrophizing?)'
          ],
          icon: '⏸️',
          color: 'blue'
        },
        {
          letter: 'A',
          title: 'ACKNOWLEDGE & VALIDATE',
          description: 'Offer yourself compassion',
          prompts: [
            '"Of course I\'m feeling this - look at what I\'m navigating"',
            '"This feeling makes sense given..."',
            '"All parts of me are welcome here"'
          ],
          icon: '🤗',
          color: 'green'
        },
        {
          letter: 'U',
          title: 'UNDERSTAND THE MESSAGE',
          description: 'Listen to what your emotion is telling you',
          prompts: [
            '"What is this feeling trying to tell me?"',
            '"What do I need right now?"',
            '"How can I honor this feeling without being overwhelmed by it?"'
          ],
          icon: '💡',
          color: 'yellow'
        },
        {
          letter: 'S',
          title: 'SOOTHE YOUR NERVOUS SYSTEM',
          description: 'Use tools to regulate and calm',
          prompts: [
            'Box breathing (4-4-4-4)',
            'Cold water on wrists',
            'Humming or singing',
            'Progressive muscle relaxation',
            'Call a supportive person'
          ],
          icon: '🌿',
          color: 'purple'
        },
        {
          letter: 'E',
          title: 'ENGAGE WISE ACTION',
          description: 'Take one small, helpful step',
          prompts: [
            '"What\'s one tiny step I can take right now?"',
            '"Who can I reach out to?"',
            '"What boundary do I need to set?"'
          ],
          icon: '⚡',
          color: 'orange'
        }
      ],
      background: 'gradient-pause',
      backgroundImage: '/images/biff01_imagine_woman_writing_in_journal_therapy_workbook_peac_7f6a2636-e20e-44c3-9edf-8de89e48ffc7_0.png'
    }
  },
  {
    id: 7,
    type: 'emotional-care-menu',
    content: {
      title: 'Daily Emotional Alchemy Practices',
      subtitle: 'Your emotional care menu (choose 2-3)',
      practices: [
        {
          title: 'Morning Attunement',
          duration: '2 minutes',
          steps: [
            'Hand on heart, three breaths',
            '"What am I feeling right now?"',
            '"What do I need today?"'
          ],
          icon: '🌅'
        },
        {
          title: 'Emotion Naming',
          duration: 'Throughout day',
          steps: [
            'Every strong feeling: "I\'m noticing anxiety"',
            'No judgment, just observation',
            'Track patterns in your phone'
          ],
          icon: '🏷️'
        },
        {
          title: 'Bedtime Release',
          duration: '5 minutes',
          steps: [
            'What feelings am I carrying that aren\'t mine?',
            'What do I need to let go of from today?',
            'Write it down or speak it aloud'
          ],
          icon: '🌙'
        },
        {
          title: 'Weekly Emotional Inventory',
          duration: '10 minutes',
          steps: [
            'What patterns am I noticing?',
            'Which feelings need more attention?',
            'What support do I need?'
          ],
          icon: '📊'
        }
      ],
      revolutionaryReframe: 'You\'re not managing emotions - you\'re alchemizing them. Turning difficult feelings into wisdom, isolation into connection, confusion into clarity.',
      background: 'gradient-alchemy',
      backgroundImage: '/images/biff01_imagine_woman_writing_in_journal_therapy_workbook_peac_7f6a2636-e20e-44c3-9edf-8de89e48ffc7_2.png'
    }
  },
  {
    id: 8,
    type: 'support-network',
    content: {
      title: 'Creating Your Emotional Support Network',
      subtitle: 'Map your emotional support team',
      supportTypes: [
        {
          title: 'Immediate Comfort',
          purpose: 'For crisis moments',
          questions: [
            'Who can you call at 2am?',
            'Who listens without giving advice?',
            'Who can sit with you in the dark?'
          ],
          icon: '🆘',
          color: 'red'
        },
        {
          title: 'Practical Support',
          purpose: 'For daily overwhelm',
          questions: [
            'Who can bring food?',
            'Who can hold baby while you shower?',
            'Who can help with household tasks?'
          ],
          icon: '🛠️',
          color: 'blue'
        },
        {
          title: 'Professional Support',
          purpose: 'For deeper healing',
          questions: [
            'Therapist specializing in perinatal mental health',
            'Support groups (virtual or in-person)',
            'Psychiatric care if needed'
          ],
          icon: '👩‍⚕️',
          color: 'green'
        },
        {
          title: 'Joy Partners',
          purpose: 'For reconnection',
          questions: [
            'Who makes you laugh?',
            'Who helps you remember who you are beyond \'mom\'?',
            'Who celebrates your wins?'
          ],
          icon: '🎉',
          color: 'yellow'
        }
      ],
      actionStep: 'Write down one name in each category. Even if you\'re not ready to reach out, having the list reduces panic.',
      background: 'gradient-connection',
      backgroundImage: '/images/biff01_imagine_supportive_womens_group_therapy_session_circle_41bd705b-5dd8-4957-a199-b2fa0530b46f_3.png'
    }
  },
  {
    id: 9,
    type: 'weather-report',
    content: {
      title: 'Your Medicine This Week',
      subtitle: 'The Feeling Weather Report',
      practice: {
        name: 'The Feeling Weather Report',
        frequency: 'Each evening',
        instruction: 'Ask yourself:',
        question: '"What was the weather in my emotional world today?"',
        examples: [
          'Stormy? Sunny? Foggy?',
          'Mixed conditions?',
          'Partly cloudy with chance of tears?',
          'Bright with unexpected rainbow moments?'
        ]
      },
      approach: 'No judgment. Just meteorology of the heart.',
      science: 'This practice builds emotional awareness without judgment, helping you track patterns and normalize the full range of human feelings.',
      truth: 'Weather changes. Feelings change. You are the sky, not the storm.',
      background: 'gradient-weather',
      backgroundImage: '/images/biff01_imagine_woman_walking_in_nature_path_trees_and_flowers_dc53f2ba-0c3a-4b5a-a758-62679e547b70_1.png'
    }
  },
  {
    id: 10,
    type: 'bridge-forward',
    content: {
      title: 'What\'s Coming Next',
      subtitle: 'In our next lesson: Building Your Foundation',
      preview: 'We begin rebuilding - creating sustainable joy and meaning in your new life. We\'ll explore the Four Pillars of Thriving and design your Minimum Viable Wellness plan.',
      blessing: 'Your feelings are not too much. They\'re not wrong. They\'re not a problem to be solved.',
      truth: 'They\'re the language of your soul navigating the most profound transformation of your life.',
      reminder: 'Until then, be gentle with your precious heart.',
      background: 'gradient-sage-bloom',
      backgroundImage: '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__fe9419f0-6fe7-4ed9-9888-c062989a9600_1.png'
    }
  }
];

export default function Lesson3Page() {
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
      'gradient-emotional': 'bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100',
      'gradient-rainbow': 'bg-gradient-to-br from-red-100 via-yellow-50 to-blue-100',
      'gradient-neural': 'bg-gradient-to-br from-cyan-100 via-blue-50 to-indigo-100',
      'gradient-spectrum': 'bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100',
      'gradient-safety': 'bg-gradient-to-br from-green-100 via-emerald-50 to-teal-50',
      'gradient-pause': 'bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100',
      'gradient-alchemy': 'bg-gradient-to-br from-amber-100 via-orange-50 to-red-100',
      'gradient-connection': 'bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100',
      'gradient-weather': 'bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100',
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
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/70 via-purple-800/50 to-pink-700/40" />
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
                <Palette className="w-16 h-16 mx-auto text-white/60" />
              </motion.div>
            </div>
          </div>
        );

      case 'permission-to-feel':
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
                <div className="absolute inset-0 bg-gradient-to-br from-red-100/80 via-yellow-50/80 to-blue-100/80" />
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
                  <p className="text-2xl text-slate-700 leading-relaxed mb-6">
                    {slide.content.message}
                  </p>
                  <p className="text-2xl text-indigo-700 font-semibold">
                    {slide.content.truth}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-10 shadow-xl"
                >
                  <p className="text-xl text-slate-700 leading-relaxed mb-4">
                    {slide.content.foundational}
                  </p>
                  <div className="space-y-3">
                    {slide.content.points.map((point: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <span className="text-indigo-500 text-xl mt-1">•</span>
                        <p className="text-lg text-slate-700">{point}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 }}
                  className="text-center bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                >
                  <p className="text-3xl font-playfair text-purple-800 italic">
                    {slide.content.declaration}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        );

      case 'brain-transformation':
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

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {slide.content.transformations.map((transformation: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <Brain className="w-12 h-12 text-cyan-600" />
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">{transformation.region}</h3>
                        <p className="text-sm text-cyan-600">{transformation.change}</p>
                      </div>
                    </div>
                    <p className="text-lg text-slate-700 italic">
                      {transformation.meaning}
                    </p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-3xl p-8 shadow-xl mb-8"
              >
                <h3 className="text-2xl font-bold text-blue-800 mb-4">Hormonal Reality:</h3>
                <div className="space-y-3">
                  {slide.content.hormones.map((hormone: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <span className="text-blue-500 text-xl mt-1">•</span>
                      <p className="text-slate-700">{hormone}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 }}
                className="text-center space-y-4"
              >
                <p className="text-3xl font-playfair text-cyan-800 font-bold">
                  {slide.content.insight}
                </p>
                <p className="text-2xl text-indigo-700 italic">
                  {slide.content.revolutionary}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'feeling-spectrum':
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
                <div className="absolute inset-0 bg-gradient-to-br from-pink-100/80 via-purple-50/80 to-indigo-100/80" />
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
                {slide.content.emotionPairs.map((pair: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.2 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                  >
                    <h3 className="text-2xl font-bold text-slate-800 mb-6">
                      {pair.title}
                    </h3>
                    
                    <div className="space-y-3">
                      {pair.emotions.map((emotion: string, emotionIndex: number) => (
                        <motion.div
                          key={emotionIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.2 + emotionIndex * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <Heart className="w-5 h-5 text-pink-500 mt-1 flex-shrink-0" />
                          <p className="text-slate-700">{emotion}</p>
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
                <div className="text-6xl mb-4">🌈</div>
                <p className="text-2xl font-bold text-purple-800">
                  {slide.content.validation}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'hidden-feelings':
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
                <div className="absolute inset-0 bg-gradient-to-br from-green-100/80 via-emerald-50/80 to-teal-50/80" />
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
                      <div className="text-6xl mb-4">{category.icon}</div>
                      <h3 className="text-2xl font-bold text-slate-800">{category.title}</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {category.thoughts.map((thought: string, thoughtIndex: number) => (
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
                className="space-y-6"
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl text-center">
                  <p className="text-xl text-slate-700 mb-4">
                    {slide.content.clinicalWisdom}
                  </p>
                  <p className="text-2xl font-bold text-green-800">
                    {slide.content.truth}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-red-100 to-orange-100 rounded-3xl p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
                    <Shield className="w-6 h-6" />
                    When to seek help:
                  </h3>
                  <div className="space-y-2">
                    {slide.content.whenToWorry.map((sign: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <span className="text-red-500 text-xl mt-1">•</span>
                        <p className="text-slate-700">{sign}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        );

      case 'pause-method':
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

              <div className="space-y-8">
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
                          {step.prompts.map((prompt: string, promptIndex: number) => (
                            <motion.div
                              key={promptIndex}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 + index * 0.2 + promptIndex * 0.1 }}
                              className="flex items-start gap-3"
                            >
                              <Lightbulb className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                              <p className="text-slate-700 italic">{prompt}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'emotional-care-menu':
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

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {slide.content.practices.map((practice: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.2 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                  >
                    <div className="text-center mb-6">
                      <div className="text-5xl mb-4">{practice.icon}</div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">{practice.title}</h3>
                      <p className="text-sm text-amber-600 font-semibold">{practice.duration}</p>
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
                          <span className="text-amber-500 text-xl mt-1">•</span>
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
                className="bg-gradient-to-r from-orange-100 to-red-100 rounded-3xl p-8 shadow-xl text-center"
              >
                <div className="text-6xl mb-4">⚗️</div>
                <p className="text-2xl font-bold text-orange-800">
                  {slide.content.revolutionaryReframe}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'support-network':
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
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">{type.title}</h3>
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

      case 'weather-report':
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
                  <h2 className="text-3xl font-bold text-sky-800 mb-4">
                    {slide.content.practice.name}
                  </h2>
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <Eye className="w-8 h-8 text-sky-600" />
                    <span className="text-xl text-slate-600">
                      {slide.content.practice.frequency}
                    </span>
                  </div>
                  <p className="text-xl text-slate-700 mb-8">
                    {slide.content.practice.instruction}
                  </p>
                  <div className="text-3xl font-playfair text-sky-800 italic p-6 bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl mb-8">
                    "{slide.content.practice.question}"
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {slide.content.practice.examples.map((example: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + index * 0.2 }}
                      className="text-xl text-sky-700 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl"
                    >
                      {example}
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="text-6xl mb-6"
                >
                  🌤️
                </motion.div>

                <p className="text-xl text-slate-600 italic mb-4">
                  {slide.content.approach}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5 }}
                className="space-y-6"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                  <p className="text-lg text-slate-700 mb-4">
                    {slide.content.science}
                  </p>
                  <p className="text-2xl font-bold text-sky-800">
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
                  <p className="text-2xl font-playfair text-teal-800 mb-4">
                    {slide.content.blessing}
                  </p>
                  <p className="text-xl text-slate-700 mb-4">
                    {slide.content.truth}
                  </p>
                  <p className="text-xl text-slate-600 italic">
                    {slide.content.reminder}
                  </p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8 }}
                  className="mt-8 space-y-4"
                >
                  <Link
                    href="/course/week1/lesson4"
                    className="inline-block bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-teal-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Continue to Lesson 4 →
                  </Link>
                  <p className="text-white/80 text-sm">
                    Building Your Foundation
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
                <h3 className="text-2xl font-bold text-slate-800">Lesson 3 Navigation</h3>
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