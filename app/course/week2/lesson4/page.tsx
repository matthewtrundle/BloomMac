'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Menu, X, Brain, Heart, Shield, Compass, Sparkles, Target, Gift, Layers, TreePine, Infinity } from 'lucide-react';
import CourseAuthWrapper from '@/components/CourseAuthWrapper';

// Beautiful slide data that matches the comprehensive course content
const slides = [
  {
    id: 1,
    type: 'hero',
    content: {
      title: 'Cognitive Wellness Integration',
      subtitle: 'From Skills to Lifestyle',
      description: 'We\'ve learned to observe thoughts, defuse from unhelpful ones, and update core beliefs. Now we integrate these skills into sustainable daily practices.',
      background: 'gradient-integration',
      backgroundImage: '/images/biff01_imagine_woman_in_meditation_pose_serene_environment_br_1f66e17b-a951-4d9f-b895-127fabc89208_3.png',
      overlay: true
    }
  },
  {
    id: 2,
    type: 'transformation-checkpoint',
    content: {
      title: 'Transformation Checkpoint',
      subtitle: 'Take a moment to notice',
      question: 'How has your relationship with your thoughts shifted this week?',
      reflection: 'Even small changes matter. Every moment of awareness, every defusion practice, every belief update - you\'re rewiring your brain.',
      insights: [
        'You\'ve learned thoughts aren\'t facts',
        'You\'ve practiced unhooking from difficult patterns',
        'You\'ve begun updating core beliefs',
        'You\'ve honored both parts of your identity'
      ],
      affirmation: 'Cognitive wellness isn\'t about perfect thinking - it\'s about flexible, compassionate thinking.',
      background: 'gradient-checkpoint',
      backgroundImage: '/images/biff01_imagine_woman_writing_in_journal_therapy_workbook_peac_7f6a2636-e20e-44c3-9edf-8de89e48ffc7_0.png'
    }
  },
  {
    id: 3,
    type: 'four-pillars',
    content: {
      title: 'The Cognitive Wellness Framework',
      subtitle: 'Your cognitive wellness rests on four pillars',
      pillars: [
        {
          number: 1,
          title: 'AWARENESS',
          subtitle: 'The Foundation',
          points: [
            'Noticing thoughts without being consumed by them',
            'Recognizing patterns and triggers',
            'Understanding the difference between thoughts and truth'
          ],
          icon: '👁️',
          color: 'blue'
        },
        {
          number: 2,
          title: 'DEFUSION',
          subtitle: 'The Liberation',
          points: [
            'Unhooking from unhelpful thoughts',
            'Creating space between you and your thinking',
            'Holding thoughts lightly'
          ],
          icon: '🔓',
          color: 'green'
        },
        {
          number: 3,
          title: 'FLEXIBILITY',
          subtitle: 'The Adaptation',
          points: [
            'Seeing situations from multiple perspectives',
            'Updating beliefs that no longer serve',
            'Responding rather than reacting'
          ],
          icon: '🌊',
          color: 'purple'
        },
        {
          number: 4,
          title: 'SELF-COMPASSION',
          subtitle: 'The Integration',
          points: [
            'Speaking to yourself with kindness',
            'Treating yourself as you would a good friend',
            'Accepting imperfection as human'
          ],
          icon: '💗',
          color: 'pink'
        }
      ],
      insight: 'These aren\'t separate skills - they work together as a unified approach to mental wellness.',
      background: 'gradient-pillars',
      backgroundImage: '/images/biff01_imagine_woman_walking_in_nature_path_trees_and_flowers_dc53f2ba-0c3a-4b5a-a758-62679e547b70_1.png'
    }
  },
  {
    id: 4,
    type: 'personal-toolkit',
    content: {
      title: 'Creating Your Personal Cognitive Toolkit',
      subtitle: 'Build your personalized cognitive toolkit',
      categories: [
        {
          title: 'For Anxious Thoughts',
          icon: '😰',
          tools: [
            'Grounding techniques (5-4-3-2-1 sensory)',
            'Probability check ("How likely is this really?")',
            'Worst/best/most likely scenario',
            '"What would I tell a friend?" perspective'
          ],
          color: 'yellow'
        },
        {
          title: 'For Self-Critical Thoughts',
          icon: '💔',
          tools: [
            'Self-compassion break',
            '"What would someone who loves me say?"',
            'Evidence for and against the criticism',
            'Reframe as learning opportunity'
          ],
          color: 'red'
        },
        {
          title: 'For Overwhelming Thoughts',
          icon: '🌪️',
          tools: [
            'Thought downloading (brain dump on paper)',
            'Priority sorting (urgent vs. important)',
            'One-thing focus ("What\'s the next right step?")',
            'Support activation ("Who can help with this?")'
          ],
          color: 'blue'
        },
        {
          title: 'For Catastrophic Thoughts',
          icon: '⚡',
          tools: [
            'Present moment anchoring',
            'Fact vs. fear distinction',
            'Coping statement preparation',
            'Support system reminder'
          ],
          color: 'purple'
        }
      ],
      personalization: 'Which tools resonate most with you? What would you add? Create your own toolkit.',
      background: 'gradient-toolkit',
      backgroundImage: '/images/biff01_imagine_woman_on_laptop_in_cozy_home_setting_having_vi_65b5942f-d2fb-4103-84e6-722269d37e3b_2.png'
    }
  },
  {
    id: 5,
    type: 'daily-routine',
    content: {
      title: 'The Daily Cognitive Wellness Routine',
      subtitle: 'Your sustainable daily practice',
      routines: [
        {
          time: 'MORNING MIND SET',
          duration: '3 minutes',
          practices: [
            '3 deep breaths to center',
            'Intention for the day: "How do I want to relate to my thoughts today?"',
            'One empowering belief affirmation'
          ],
          icon: '🌅',
          color: 'orange'
        },
        {
          time: 'MIDDAY CHECK-IN',
          duration: '2 minutes',
          practices: [
            'Thought awareness: "What\'s happening in my mind right now?"',
            'Quick defusion if needed',
            'Self-compassion moment'
          ],
          icon: '☀️',
          color: 'yellow'
        },
        {
          time: 'EVENING INTEGRATION',
          duration: '5 minutes',
          practices: [
            'Thought download: What thoughts showed up today?',
            'Celebration: What cognitive tools did I use well?',
            'Learning: What would I do differently tomorrow?',
            'Gratitude: What am I appreciating about my mind today?'
          ],
          icon: '🌙',
          color: 'indigo'
        },
        {
          time: 'WEEKLY REFLECTION',
          duration: '10 minutes',
          practices: [
            'Pattern recognition: What thought patterns am I noticing?',
            'Belief updates: Any core beliefs needing updating?',
            'Tool effectiveness: What\'s working best for me?',
            'Support assessment: Do I need additional resources?'
          ],
          icon: '📊',
          color: 'purple'
        }
      ],
      principle: 'Consistency matters more than perfection. Even 30 seconds of mindful thought observation creates change.',
      background: 'gradient-routine',
      backgroundImage: '/images/biff01_imagine_woman_writing_in_journal_therapy_workbook_peac_7f6a2636-e20e-44c3-9edf-8de89e48ffc7_2.png'
    }
  },
  {
    id: 6,
    type: 'relationships',
    content: {
      title: 'Cognitive Wellness in Relationships',
      subtitle: 'Your cognitive wellness affects all your relationships',
      relationships: [
        {
          title: 'WITH YOUR PARTNER',
          icon: '💑',
          practices: [
            'Notice when you\'re mind-reading their thoughts',
            'Share your thought patterns instead of expecting them to guess',
            'Use cognitive flexibility during conflicts',
            'Practice self-compassion instead of defensive reactions'
          ]
        },
        {
          title: 'WITH YOUR BABY',
          icon: '👶',
          practices: [
            'Recognize anxious thoughts vs. intuitive concerns',
            'Practice present-moment awareness during care',
            'Defuse from perfectionist parenting thoughts',
            'Celebrate small moments instead of worrying about outcomes'
          ]
        },
        {
          title: 'WITH FAMILY/FRIENDS',
          icon: '👨‍👩‍👧‍👦',
          practices: [
            'Challenge assumptions about what others think',
            'Set boundaries from empowered beliefs',
            'Communicate needs clearly instead of expecting mind-reading',
            'Practice perspective-taking during difficult interactions'
          ]
        },
        {
          title: 'WITH HEALTHCARE PROVIDERS',
          icon: '👩‍⚕️',
          practices: [
            'Distinguish between helpful caution and anxious catastrophizing',
            'Advocate for yourself from empowered beliefs',
            'Ask questions without shame or self-criticism',
            'Trust your observations while being open to guidance'
          ]
        }
      ],
      insight: 'When you change your relationship with your thoughts, you change your relationships with others.',
      background: 'gradient-relationships',
      backgroundImage: '/images/biff01_imagine_supportive_womens_group_therapy_session_circle_41bd705b-5dd8-4957-a199-b2fa0530b46f_3.png'
    }
  },
  {
    id: 7,
    type: 'resilience-building',
    content: {
      title: 'Building Long-term Cognitive Resilience',
      subtitle: 'Cognitive resilience grows through practice',
      pathways: [
        {
          title: 'REGULAR PRACTICE',
          icon: '🔄',
          elements: [
            'Daily awareness building',
            'Consistent defusion techniques',
            'Ongoing belief updating',
            'Continuous self-compassion cultivation'
          ]
        },
        {
          title: 'PROFESSIONAL SUPPORT',
          icon: '🤝',
          elements: [
            'Seeking professional guidance when needed',
            'Working with trained therapists',
            'Learning from expert perspectives',
            'Building therapeutic relationships'
          ]
        },
        {
          title: 'ONGOING LEARNING',
          icon: '📚',
          elements: [
            'Reading about cognitive wellness',
            'Attending workshops or therapy',
            'Practicing new techniques',
            'Staying curious about your mind'
          ]
        },
        {
          title: 'ADAPTATION',
          icon: '🌱',
          elements: [
            'Adjusting tools as life changes',
            'Updating beliefs as you grow',
            'Modifying practices for different life phases',
            'Remaining flexible in your approach'
          ]
        }
      ],
      vision: 'Imagine having a wise, compassionate relationship with your mind for life. Every practice now builds toward that future.',
      background: 'gradient-resilience',
      backgroundImage: '/images/biff01_imagine_woman_in_meditation_pose_serene_environment_br_43b6047c-916a-43b2-afc2-5449ec040f7c_1.png'
    }
  },
  {
    id: 8,
    type: 'integration-practice',
    content: {
      title: 'This Week\'s Integration Practice',
      subtitle: 'Bringing it all together',
      practice: {
        title: 'Choose Your Core Three',
        instruction: 'Select 3 cognitive tools that felt most helpful this week',
        categories: [
          {
            category: 'Awareness Tools',
            options: [
              'Thought noticing practice',
              'Observer self cultivation',
              'Pattern recognition'
            ]
          },
          {
            category: 'Defusion Tools',
            options: [
              'Labeling thoughts',
              'Thank you method',
              'RAIN practice'
            ]
          },
          {
            category: 'Belief Tools',
            options: [
              'Belief updating process',
              'Empowering affirmations',
              'Identity integration'
            ]
          },
          {
            category: 'Compassion Tools',
            options: [
              'Self-compassion breaks',
              'Kind inner voice',
              'Friend perspective'
            ]
          }
        ]
      },
      commitment: 'Commit to using these three tools consistently this week. Master a few rather than trying all.',
      reminder: 'Progress, not perfection. Every small practice creates lasting change.',
      background: 'gradient-practice',
      backgroundImage: '/images/biff01_imagine_woman_writing_in_journal_therapy_workbook_peac_242c4d8e-9b44-46fd-9453-babbeae35f90_2.png'
    }
  },
  {
    id: 9,
    type: 'week-accomplishments',
    content: {
      title: 'Celebrating Your Week 2 Accomplishments',
      subtitle: 'Look how far you\'ve come',
      accomplishments: [
        'You\'ve learned to observe thoughts without being overwhelmed',
        'You\'ve practiced unhooking from unhelpful thinking',
        'You\'ve examined and updated core beliefs',
        'You\'ve built a personalized cognitive toolkit'
      ],
      skills: [
        {
          skill: 'Thought Awareness',
          icon: '👁️',
          mastery: 'You can now notice thoughts as mental events, not truths'
        },
        {
          skill: 'Cognitive Defusion',
          icon: '🔓',
          mastery: 'You have techniques to create space from difficult thoughts'
        },
        {
          skill: 'Belief Flexibility',
          icon: '🌊',
          mastery: 'You can identify and update limiting beliefs'
        },
        {
          skill: 'Self-Compassion',
          icon: '💗',
          mastery: 'You\'re learning to be your own wise friend'
        }
      ],
      affirmation: 'You have everything you need to work skillfully with your mind.',
      background: 'gradient-celebration',
      backgroundImage: '/images/biff01_imagine_confident_single_mother_holding_baby_standing__b3179601-8cbf-4af3-9b29-bedcbc4946a3_0.png'
    }
  },
  {
    id: 10,
    type: 'bridge-to-week3',
    content: {
      title: 'Bridge to Week 3',
      subtitle: 'From Mind to Action',
      preview: 'Next week we move from working with thoughts to working with actions. We\'ll learn how to rebuild joy, meaning, and vitality in your daily life through behavioral activation.',
      weekThreeTopics: [
        'Understanding the depression-inactivity cycle',
        'Values-based activity planning',
        'Pleasure and mastery scheduling',
        'Building momentum through small wins'
      ],
      teaser: 'You\'ll discover how small, intentional actions can dramatically shift your mood and energy - even when motivation is low.',
      wisdom: 'Your thoughts are not your enemy. Your mind is not broken. You\'re learning to dance with both the storms and the sunshine in your mental weather.',
      closing: 'Rest in this truth: You\'re not just surviving. You\'re building a foundation for lifelong mental wellness.',
      background: 'gradient-bridge',
      backgroundImage: '/images/biff01_imagine_woman_walking_in_nature_path_trees_and_flowers_dc53f2ba-0c3a-4b5a-a758-62679e547b70_1.png'
    }
  },
  {
    id: 11,
    type: 'final-blessing',
    content: {
      title: 'Until Next Week',
      subtitle: 'A blessing for your cognitive journey',
      blessing: [
        'May you meet your thoughts with curiosity instead of fear.',
        'May you hold your beliefs lightly, updating them with wisdom.',
        'May you speak to yourself as you would to someone you love.',
        'May you remember: every moment of awareness is a victory.'
      ],
      finalThought: 'You\'re not just changing your mind. You\'re changing your life. And through you, you\'re changing the world your child will grow up in.',
      signature: 'See you next week, cognitive warrior. 🌟',
      callToAction: {
        text: 'Begin Week 3: Behavioral Activation',
        link: '/course/week3'
      },
      background: 'gradient-sage-bloom',
      backgroundImage: '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__fe9419f0-6fe7-4ed9-9888-c062989a9600_1.png'
    }
  }
];

function Week2Lesson4Content() {
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
      'gradient-integration': 'bg-gradient-to-br from-indigo-100 via-purple-50 to-violet-100',
      'gradient-checkpoint': 'bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100',
      'gradient-pillars': 'bg-gradient-to-br from-cyan-100 via-blue-50 to-indigo-100',
      'gradient-toolkit': 'bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100',
      'gradient-routine': 'bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100',
      'gradient-relationships': 'bg-gradient-to-br from-violet-100 via-purple-50 to-indigo-100',
      'gradient-resilience': 'bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100',
      'gradient-practice': 'bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100',
      'gradient-celebration': 'bg-gradient-to-br from-pink-100 via-rose-50 to-red-100',
      'gradient-bridge': 'bg-gradient-to-br from-teal-100 via-cyan-50 to-blue-100',
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
                <Layers className="w-16 h-16 mx-auto text-white/60" />
              </motion.div>
            </div>
          </div>
        );

      case 'transformation-checkpoint':
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
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-xl text-center"
                >
                  <h2 className="text-3xl font-playfair text-amber-800 mb-4">
                    {slide.content.question}
                  </h2>
                  <p className="text-xl text-slate-700">
                    {slide.content.reflection}
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6">
                  {slide.content.insights.map((insight: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl flex items-center gap-4"
                    >
                      <Sparkles className="w-8 h-8 text-amber-500 flex-shrink-0" />
                      <p className="text-lg text-slate-700">{insight}</p>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 }}
                  className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-3xl p-8 shadow-xl text-center"
                >
                  <p className="text-2xl font-bold text-orange-800">
                    {slide.content.affirmation}
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
                {slide.content.pillars.map((pillar: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.2 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {pillar.number}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800">{pillar.title}</h3>
                        <p className="text-sm text-blue-600 italic">{pillar.subtitle}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {pillar.points.map((point: string, pointIndex: number) => (
                        <motion.div
                          key={pointIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.2 + pointIndex * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <span className="text-blue-500 text-xl mt-1">•</span>
                          <p className="text-slate-700">{point}</p>
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="text-center mt-6 text-4xl">
                      {pillar.icon}
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
                <Brain className="w-16 h-16 mx-auto text-blue-600 mb-4" />
                <p className="text-2xl font-bold text-blue-800">
                  {slide.content.insight}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'personal-toolkit':
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
                      {category.tools.map((tool: string, toolIndex: number) => (
                        <motion.div
                          key={toolIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.2 + toolIndex * 0.1 }}
                          className="p-3 bg-rose-50 rounded-xl flex items-start gap-3"
                        >
                          <Shield className="w-5 h-5 text-rose-500 mt-1 flex-shrink-0" />
                          <p className="text-slate-700">{tool}</p>
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
                className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-3xl p-8 shadow-xl text-center"
              >
                <Target className="w-16 h-16 mx-auto text-pink-600 mb-4" />
                <p className="text-2xl font-bold text-pink-800">
                  {slide.content.personalization}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'daily-routine':
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
                {slide.content.routines.map((routine: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.2 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                  >
                    <div className="text-center mb-6">
                      <div className="text-5xl mb-4">{routine.icon}</div>
                      <h3 className="text-2xl font-bold text-slate-800">{routine.time}</h3>
                      <p className="text-sm text-emerald-600 font-semibold">{routine.duration}</p>
                    </div>
                    
                    <div className="space-y-3">
                      {routine.practices.map((practice: string, practiceIndex: number) => (
                        <motion.div
                          key={practiceIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.2 + practiceIndex * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <Compass className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />
                          <p className="text-slate-700">{practice}</p>
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
                <Infinity className="w-16 h-16 mx-auto text-green-600 mb-4" />
                <p className="text-2xl font-bold text-green-800">
                  {slide.content.principle}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'relationships':
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
                {slide.content.relationships.map((relationship: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.2 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                  >
                    <div className="text-center mb-6">
                      <div className="text-5xl mb-4">{relationship.icon}</div>
                      <h3 className="text-2xl font-bold text-slate-800">{relationship.title}</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {relationship.practices.map((practice: string, practiceIndex: number) => (
                        <motion.div
                          key={practiceIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.2 + practiceIndex * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <Heart className="w-5 h-5 text-violet-500 mt-1 flex-shrink-0" />
                          <p className="text-slate-700">{practice}</p>
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
                className="bg-gradient-to-r from-violet-100 to-purple-100 rounded-3xl p-8 shadow-xl text-center"
              >
                <p className="text-2xl font-bold text-violet-800">
                  {slide.content.insight}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'resilience-building':
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
                {slide.content.pathways.map((pathway: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.2 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                  >
                    <div className="text-center mb-6">
                      <div className="text-5xl mb-4">{pathway.icon}</div>
                      <h3 className="text-2xl font-bold text-slate-800">{pathway.title}</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {pathway.elements.map((element: string, elementIndex: number) => (
                        <motion.div
                          key={elementIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.2 + elementIndex * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <TreePine className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
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
                className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-3xl p-8 shadow-xl text-center"
              >
                <p className="text-2xl font-bold text-blue-800">
                  {slide.content.vision}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'integration-practice':
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
                <div className="absolute inset-0 bg-gradient-to-br from-orange-100/80 via-amber-50/80 to-yellow-100/80" />
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
                transition={{ delay: 0.3 }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-xl mb-12"
              >
                <h2 className="text-3xl font-bold text-amber-800 mb-4 text-center">
                  {slide.content.practice.title}
                </h2>
                <p className="text-xl text-slate-700 text-center mb-8">
                  {slide.content.practice.instruction}
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  {slide.content.practice.categories.map((category: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="bg-amber-50 rounded-xl p-6"
                    >
                      <h4 className="font-bold text-amber-800 mb-4">{category.category}</h4>
                      <div className="space-y-2">
                        {category.options.map((option: string, optionIndex: number) => (
                          <div key={optionIndex} className="flex items-center gap-3">
                            <div className="w-4 h-4 border-2 border-amber-400 rounded"></div>
                            <p className="text-slate-700">{option}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-3xl p-6 shadow-xl text-center"
                >
                  <p className="text-xl font-bold text-orange-800 mb-2">
                    {slide.content.commitment}
                  </p>
                  <p className="text-lg text-amber-700">
                    {slide.content.reminder}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        );

      case 'week-accomplishments':
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
                transition={{ delay: 0.3 }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-xl mb-12"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  {slide.content.accomplishments.map((accomplishment: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <Gift className="w-6 h-6 text-pink-500 flex-shrink-0" />
                      <p className="text-lg text-slate-700">{accomplishment}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {slide.content.skills.map((skill: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-3xl p-6 shadow-xl"
                  >
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">{skill.icon}</div>
                      <h3 className="text-xl font-bold text-rose-800">{skill.skill}</h3>
                    </div>
                    <p className="text-slate-700 text-center italic">
                      {skill.mastery}
                    </p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 }}
                className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-3xl p-8 shadow-xl text-center"
              >
                <Sparkles className="w-16 h-16 mx-auto text-pink-600 mb-4" />
                <p className="text-3xl font-playfair text-rose-800 font-bold">
                  {slide.content.affirmation}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'bridge-to-week3':
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
                <div className="absolute inset-0 bg-gradient-to-br from-teal-100/80 via-cyan-50/80 to-blue-100/80" />
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
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-xl text-center"
                >
                  <p className="text-xl text-slate-700 mb-8">
                    {slide.content.preview}
                  </p>
                  
                  <div className="bg-teal-50 rounded-xl p-6">
                    <h3 className="text-2xl font-bold text-teal-800 mb-4">Week 3 Topics:</h3>
                    <div className="space-y-2">
                      {slide.content.weekThreeTopics.map((topic: string, index: number) => (
                        <div key={index} className="flex items-center gap-3 text-left">
                          <Compass className="w-5 h-5 text-teal-600 flex-shrink-0" />
                          <p className="text-slate-700">{topic}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-3xl p-8 shadow-xl text-center"
                >
                  <p className="text-xl text-blue-800 mb-4">
                    {slide.content.teaser}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 }}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl text-center"
                >
                  <p className="text-2xl font-playfair text-teal-800 mb-4">
                    {slide.content.wisdom}
                  </p>
                  <p className="text-xl text-slate-700">
                    {slide.content.closing}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        );

      case 'final-blessing':
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
                <div className="space-y-4 mb-8">
                  {slide.content.blessing.map((line: string, index: number) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.2 }}
                      className="text-xl text-slate-700"
                    >
                      {line}
                    </motion.p>
                  ))}
                </div>
                
                <p className="text-2xl font-playfair text-teal-800 font-bold">
                  {slide.content.finalThought}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="space-y-8"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                  <p className="text-2xl text-teal-800">
                    {slide.content.signature}
                  </p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 }}
                  className="mt-8 space-y-4"
                >
                  <Link
                    href={slide.content.callToAction.link}
                    className="inline-block bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-teal-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {slide.content.callToAction.text} →
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5 }}
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
                <h3 className="text-2xl font-bold text-slate-800">Week 2 Lesson 4</h3>
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

export default function Week2Lesson4Page() {
  return (
    <CourseAuthWrapper courseSlug="postpartum-wellness-foundations">
      <Week2Lesson4Content />
    </CourseAuthWrapper>
  );
}