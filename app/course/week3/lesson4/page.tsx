'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Menu, X, Zap, Clock, Repeat, Building, Battery, Flower2, Target, Heart, Compass, Shield, CheckCircle, ArrowRight, Star, Sun, Moon } from 'lucide-react';
import CourseAuthWrapper from '@/components/CourseAuthWrapper';

// Beautiful slide data that matches the comprehensive course content
const slides = [
  {
    id: 1,
    type: 'hero',
    content: {
      title: 'Sustainable Habits for Ongoing Vitality',
      subtitle: 'From Inspiration to Integration',
      description: 'The difference between transformation and inspiration is daily practice. Today we create a realistic, flexible system for maintaining vitality that grows with you as your children grow.',
      background: 'gradient-sustainability',
      backgroundImage: '/images/biff01_imagine_woman_in_meditation_pose_serene_environment_br_43b6047c-916a-43b2-afc2-5449ec040f7c_1.png',
      overlay: true
    }
  },
  {
    id: 2,
    type: 'inspiration-to-integration',
    content: {
      title: 'From Inspiration to Integration',
      subtitle: 'Making transformation sustainable',
      distinction: 'Anyone can feel motivated for a week. The mothers who thrive long-term are those who build systems that support their wellbeing automatically.',
      principles: [
        "We're not creating a perfect life - we're creating a sustainable life",
        "One that can weather sick days, growth spurts, teething, and chaos",
        "Systems that work even when motivation is low",
        "Habits that grow with you as your children grow"
      ],
      goal: 'By the end of today, you\'ll have a realistic, flexible system for maintaining vitality that adapts to the beautiful unpredictability of motherhood.',
      background: 'gradient-integration',
      backgroundImage: '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__50517b23-5b36-4135-b2d1-db7a7c23ff79_1.png'
    }
  },
  {
    id: 3,
    type: 'mom-friendly-habits',
    content: {
      title: 'Habit Formation for Exhausted Moms',
      subtitle: 'Traditional advice doesn\'t work for new mothers',
      traditionalVsMom: [
        {
          traditional: '21 days makes a habit',
          momReality: 'Some days you can\'t remember what day it is',
          icon: '📅'
        },
        {
          traditional: 'Start with big changes',
          momReality: 'You have 30 seconds of mental energy',
          icon: '⚡'
        },
        {
          traditional: 'Be consistent every day',
          momReality: 'Every day is different with babies',
          icon: '🔄'
        }
      ],
      momFriendlyPrinciples: [
        {
          title: 'MICRO-HABITS RULE',
          points: [
            'Start smaller than feels meaningful',
            'Make it impossible to fail',
            'Build consistency before intensity'
          ],
          icon: '🔬'
        },
        {
          title: 'FLEXIBILITY IS KEY',
          points: [
            'Plan for interruptions',
            'Create multiple versions (2-min, 5-min, 15-min)',
            'Focus on frequency, not perfection'
          ],
          icon: '🤸'
        },
        {
          title: 'STACK WITH EXISTING ROUTINES',
          points: [
            'Attach new habits to established behaviors',
            'Use baby\'s schedule as anchors',
            'Leverage transition moments'
          ],
          icon: '🔗'
        },
        {
          title: 'SELF-COMPASSION IS NON-NEGOTIABLE',
          points: [
            'Expect interruptions and restarts',
            'Celebrate any effort',
            'Focus on progress, not perfection'
          ],
          icon: '💝'
        }
      ],
      brainScience: 'Your sleep-deprived brain needs extra simplicity, clear environmental cues, immediate rewards, and flexible implementation. We\'re working with your brain, not against it.',
      background: 'gradient-brain-friendly',
      backgroundImage: '/images/biff01_imagine_woman_doing_morning_skincare_routine_bathroom__ee80f468-185d-4a1e-bc41-4400f6cec9b8_0.png'
    }
  },
  {
    id: 4,
    type: 'four-pillars',
    content: {
      title: 'The Four Pillars of Sustainable Vitality',
      subtitle: 'Your comprehensive system for ongoing wellbeing',
      pillars: [
        {
          title: 'ENERGY MANAGEMENT',
          icon: '⚡',
          color: 'amber',
          dailyHabits: [
            'Morning: 3 deep breaths before getting out of bed',
            'Midday: 5-minute rest or energizing activity',
            'Evening: One thing that restores you'
          ],
          weeklyPractices: [
            'One longer rest period',
            'One energizing activity you love',
            'Energy audit and adjustment'
          ]
        },
        {
          title: 'JOY CULTIVATION',
          icon: '🌸',
          color: 'pink',
          dailyHabits: [
            'Notice one beautiful thing',
            'Express gratitude for one small pleasure',
            'Smile at your baby intentionally'
          ],
          weeklyPractices: [
            'Plan one thing to look forward to',
            'Connect with someone who makes you laugh',
            'Do something creative or playful'
          ]
        },
        {
          title: 'VALUES ALIGNMENT',
          icon: '🧭',
          color: 'purple',
          dailyHabits: [
            'Set one intention based on your values',
            'Make one choice that honors what matters to you',
            'End day reflecting on values lived'
          ],
          weeklyPractices: [
            'Values check-in and course correction',
            'Plan one meaningful activity',
            'Connect with your larger purpose'
          ]
        },
        {
          title: 'CONNECTION MAINTENANCE',
          icon: '💕',
          color: 'rose',
          dailyHabits: [
            'One genuine interaction with your partner',
            'One moment of presence with your baby',
            'One connection with the outside world'
          ],
          weeklyPractices: [
            'One meaningful conversation',
            'One activity that connects you to community',
            'One act of service or kindness'
          ]
        }
      ],
      integrationTip: 'You don\'t need to do all of these - choose 1-2 from each pillar that feel most essential right now.',
      background: 'gradient-pillars',
      backgroundImage: '/images/biff01_imagine_cozy_therapy_office_comfortable_armchair_warm__b76c10ee-01e1-4a2a-8894-42d53f2a1be5_2.png'
    }
  },
  {
    id: 5,
    type: 'personal-routine',
    content: {
      title: 'Creating Your Personal Vitality Routine',
      subtitle: 'Design your sustainable, customizable system',
      routineStructure: [
        {
          time: 'MORNING VITALITY SEQUENCE',
          duration: '5-10 minutes',
          when: 'Before baby wakes or while baby feeds',
          structure: '1 energy practice + 1 intention setting',
          examples: [
            '3 breaths + gratitude thought',
            'Gentle stretches + values intention',
            'Favorite music + joy noticing'
          ]
        },
        {
          time: 'MIDDAY RESET',
          duration: '2-5 minutes',
          when: 'During baby\'s nap or independent play',
          structure: '1 restoration practice + 1 connection',
          examples: [
            'Quick walk + text to friend',
            'Drink tea mindfully + check-in with body',
            'Creative moment + appreciate baby'
          ]
        },
        {
          time: 'EVENING INTEGRATION',
          duration: '5-10 minutes',
          when: 'After baby\'s bedtime or before your sleep',
          structure: '1 reflection practice + 1 preparation for tomorrow',
          examples: [
            'Gratitude journaling + intention for tomorrow',
            'Partner check-in + self-appreciation',
            'Beauty moment + values reflection'
          ]
        },
        {
          time: 'WEEKLY VITALITY PLANNING',
          duration: '10-15 minutes',
          when: 'Sunday evening or whenever feels right',
          structure: 'Review week + plan ahead + adjust routines',
          examples: [
            'What worked well this week?',
            'What needs adjustment?',
            'What do I want to focus on next week?'
          ]
        }
      ],
      customizationQuestions: [
        'What time of day do you have most energy?',
        'What existing routines could you attach habits to?',
        'What activities consistently make you feel better?',
        'What obstacles typically derail your self-care?',
        'How can you design around those obstacles?'
      ],
      flexibilityVersions: [
        {
          mode: 'Crisis Mode',
          duration: '30 seconds each',
          description: 'For overwhelming days'
        },
        {
          mode: 'Normal Mode',
          duration: '2-5 minutes each',
          description: 'For typical days'
        },
        {
          mode: 'Expansion Mode',
          duration: '10+ minutes each',
          description: 'For days with more capacity'
        }
      ],
      tip: 'Use whichever version fits your current capacity.',
      background: 'gradient-routine',
      backgroundImage: '/images/biff01_imagine_woman_writing_in_journal_therapy_workbook_peac_7f6a2636-e20e-44c3-9edf-8de89e48ffc7_0.png'
    }
  },
  {
    id: 6,
    type: 'habit-troubleshooting',
    content: {
      title: 'Habit Troubleshooting and Maintenance',
      subtitle: 'Solutions for common challenges',
      challenges: [
        {
          challenge: 'I keep forgetting',
          solutions: [
            'Set phone reminders',
            'Use visual cues (sticky notes)',
            'Stack with baby care routines',
            'Ask partner to remind you'
          ],
          icon: '🧠'
        },
        {
          challenge: 'I don\'t have time',
          solutions: [
            'Make habits smaller',
            'Combine with existing activities',
            'Use transition moments',
            'Remember: 30 seconds counts'
          ],
          icon: '⏰'
        },
        {
          challenge: 'I lose motivation',
          solutions: [
            'Focus on systems, not motivation',
            'Celebrate tiny wins',
            'Connect habits to values',
            'Find accountability partner'
          ],
          icon: '💪'
        },
        {
          challenge: 'Life keeps disrupting my routine',
          solutions: [
            'Build flexibility into system',
            'Plan for common disruptions',
            'Have backup mini-versions',
            'Restart without judgment'
          ],
          icon: '🌪️'
        },
        {
          challenge: 'I feel guilty taking time for myself',
          solutions: [
            'Reframe as modeling for children',
            'Remember: your wellbeing serves family',
            'Start with habits that include baby',
            'Work on underlying beliefs about worthiness'
          ],
          icon: '💝'
        }
      ],
      maintenanceStrategies: [
        'Weekly habit review and adjustment',
        'Monthly routine evaluation',
        'Seasonal routine updates',
        'Annual vitality planning'
      ],
      growthMindset: 'Your vitality routine will evolve as your children grow. What matters is maintaining the practice of intentionally caring for your wellbeing.',
      background: 'gradient-troubleshooting',
      backgroundImage: '/images/biff01_imagine_supportive_womens_group_therapy_session_circle_41bd705b-5dd8-4957-a199-b2fa0530b46f_3.png'
    }
  },
  {
    id: 7,
    type: 'systems-vs-motivation',
    content: {
      title: 'Systems vs. Motivation',
      subtitle: 'Why systems win every time',
      motivationProblems: [
        'Motivation is inconsistent',
        'Motivation depends on how you feel',
        'Motivation requires mental energy',
        'Motivation fades after initial excitement'
      ],
      systemsAdvantages: [
        'Systems work regardless of mood',
        'Systems become automatic',
        'Systems require less decision-making',
        'Systems compound over time'
      ],
      systemDesignPrinciples: [
        {
          principle: 'ENVIRONMENT DESIGN',
          description: 'Make good choices easier than bad choices',
          examples: [
            'Keep water bottle by bedside',
            'Lay out workout clothes',
            'Keep journal next to bed',
            'Put phone charger away from bedroom'
          ]
        },
        {
          principle: 'IMPLEMENTATION INTENTIONS',
          description: 'If-then planning removes decision fatigue',
          examples: [
            'If baby goes down for nap, then I take 3 deep breaths',
            'If I feel overwhelmed, then I step outside',
            'If baby is crying, then I check my breathing first',
            'If partner comes home, then we share one good thing'
          ]
        },
        {
          principle: 'HABIT STACKING',
          description: 'Attach new habits to established routines',
          examples: [
            'After I pour coffee, I set daily intention',
            'After I change baby\'s diaper, I notice one thing I\'m grateful for',
            'After I put baby down, I do one stretch',
            'After I brush teeth, I appreciate one thing about my body'
          ]
        }
      ],
      systemSuccess: 'When you build good systems, you don\'t need willpower. The system carries you.',
      background: 'gradient-systems',
      backgroundImage: '/images/biff01_imagine_calming_therapy_office_waiting_room_comfortabl_c7ddc6f2-21ca-462c-9f36-f7e006d516f8_0.png'
    }
  },
  {
    id: 8,
    type: 'week3-accomplishments',
    content: {
      title: 'Your Week 3 Accomplishments',
      subtitle: 'Celebrating how far you\'ve come',
      accomplishments: [
        {
          achievement: 'You understand the activity-mood connection',
          description: 'You know that mood follows action more than action follows mood',
          icon: '🔄'
        },
        {
          achievement: 'You\'ve reconnected with sources of joy',
          description: 'You can find micro-moments of pleasure even in difficult days',
          icon: '✨'
        },
        {
          achievement: 'You\'ve clarified your core values',
          description: 'You know what matters most and how to live from those truths',
          icon: '🧭'
        },
        {
          achievement: 'You\'ve designed a sustainable vitality routine',
          description: 'You have a flexible system that grows with you',
          icon: '🏗️'
        }
      ],
      transformation: [
        'From surviving to beginning to thrive',
        'From depleted to seeking vitality',
        'From disconnected to values-aligned',
        'From reactive to intentional'
      ],
      appreciationPrompt: 'Take a moment to appreciate this profound shift. You\'re not the same person who started this course.',
      background: 'gradient-accomplishments',
      backgroundImage: '/images/biff01_imagine_confident_single_mother_holding_baby_standing__b3179601-8cbf-4af3-9b29-bedcbc4946a3_0.png'
    }
  },
  {
    id: 9,
    type: 'future-visioning',
    content: {
      title: 'Future Visioning Exercise',
      subtitle: 'Imagine yourself 6 months from now',
      visionPrompt: 'Close your eyes and imagine yourself 6 months from now, living this vitality routine consistently...',
      visionQuestions: [
        'How do you start your days?',
        'How do you navigate challenges?',
        'How do you connect with joy and meaning?',
        'How do you model wellbeing for your family?',
        'What does your energy feel like?',
        'How do you respond to stress?',
        'What has become automatic?',
        'How has your relationship with yourself changed?'
      ],
      realityCheck: 'This isn\'t fantasy - this is your emerging reality.',
      embodiment: [
        'You wake up with intention, not just obligation',
        'You move through your day with more presence',
        'You respond to challenges from a place of groundedness',
        'You model sustainable self-care for your children',
        'You trust your ability to care for yourself',
        'You experience regular moments of joy and gratitude',
        'You make decisions aligned with your values',
        'You have systems that support your wellbeing automatically'
      ],
      bridge: 'Every small choice you make today is creating this future.',
      background: 'gradient-future',
      backgroundImage: '/images/biff01_imagine_woman_walking_in_nature_path_trees_and_flowers_dc53f2ba-0c3a-4b5a-a758-62679e547b70_1.png'
    }
  },
  {
    id: 10,
    type: 'commitment-ceremony',
    content: {
      title: 'Commitment to Vitality',
      subtitle: 'Your sacred promise to yourself',
      instruction: 'Place your hand on your heart and speak this commitment aloud:',
      commitment: 'I commit to honoring my vitality. I commit to small, consistent actions that support my wellbeing. I commit to believing that my flourishing serves everyone I love.',
      practices: [
        'Daily micro-habits for energy, joy, values, and connection',
        'Weekly planning and adjustment',
        'Monthly routine evaluation',
        'Seasonal vitality updates',
        'Self-compassion when I fall off track'
      ],
      reminder: 'This commitment isn\'t about perfection. It\'s about intention and return.',
      witnessing: 'Your future self witnesses this commitment. Your children witness this commitment. Your partner witnesses this commitment. You are choosing to model what it looks like to care for yourself sustainably.',
      background: 'gradient-commitment',
      backgroundImage: '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__1c12cc3c-cebd-47e2-ad9b-66b9bbca6480_0.png'
    }
  },
  {
    id: 11,
    type: 'bridge-forward',
    content: {
      title: 'Looking Ahead to Week 4',
      subtitle: 'Relationships & Communication',
      preview: 'Next week we focus on the relationships that sustain us - with our partners, families, friends, and communities. You\'ll learn to communicate your needs, set boundaries, and create the support system you deserve.',
      topics: [
        'Communicating needs without guilt or resentment',
        'Building support systems that actually support',
        'Navigating family dynamics and expectations',
        'Creating authentic friendships in motherhood'
      ],
      connectionToWeek3: 'The vitality practices you\'ve built this week will give you the energy and clarity to show up authentically in your relationships.',
      truth: 'Sustainable wellbeing isn\'t a solo journey. It happens in relationship.',
      closing: 'You\'ve built the foundation. Now let\'s build the village.',
      background: 'gradient-sage-bloom',
      backgroundImage: '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__fe9419f0-6fe7-4ed9-9888-c062989a9600_1.png'
    }
  },
  {
    id: 12,
    type: 'final-integration',
    content: {
      title: 'You Are Not Just Surviving',
      subtitle: 'You are learning to thrive',
      celebration: 'For now, celebrate this profound truth:',
      truth: 'You are not just surviving motherhood. You are learning to thrive within it.',
      reminder: [
        'Your vitality is a gift to the world',
        'Your wellbeing serves your family',
        'Your daily choices are creating your future',
        'Your commitment to yourself matters'
      ],
      finalWisdom: 'The mother you are becoming is not the mother you were yesterday. With each conscious choice, each moment of self-care, each alignment with your values, you are evolving.',
      blessing: 'May you trust the process. May you honor your journey. May you remember that your flourishing is not selfish - it is sacred.',
      nextStep: 'Continue to Week 4: Relationships & Communication',
      background: 'gradient-blessing',
      backgroundImage: '/images/biff01_imagine_mixed-race_parents_with_newborn_tender_family__1caa7f06-30ca-47c7-a1cd-038dc0cea487_1.png'
    }
  }
];

function Week3Lesson4Content() {
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
      'gradient-sustainability': 'bg-gradient-to-br from-emerald-100 via-teal-50 to-green-100',
      'gradient-integration': 'bg-gradient-to-br from-cyan-100 via-blue-50 to-indigo-100',
      'gradient-brain-friendly': 'bg-gradient-to-br from-purple-100 via-violet-50 to-indigo-100',
      'gradient-pillars': 'bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100',
      'gradient-routine': 'bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100',
      'gradient-troubleshooting': 'bg-gradient-to-br from-red-100 via-rose-50 to-pink-100',
      'gradient-systems': 'bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100',
      'gradient-accomplishments': 'bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100',
      'gradient-future': 'bg-gradient-to-br from-violet-100 via-purple-50 to-indigo-100',
      'gradient-commitment': 'bg-gradient-to-br from-pink-100 via-rose-50 to-red-100',
      'gradient-blessing': 'bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100',
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
                <Building className="w-16 h-16 mx-auto text-white/60" />
              </motion.div>
            </div>
          </div>
        );

      case 'inspiration-to-integration':
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
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-xl text-center"
                >
                  <p className="text-2xl text-slate-700 leading-relaxed mb-8">
                    {slide.content.distinction}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                >
                  <h3 className="text-2xl font-bold text-cyan-800 mb-6 text-center">Sustainability Principles</h3>
                  <div className="space-y-4">
                    {slide.content.principles.map((principle: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <Building className="w-6 h-6 text-cyan-500 mt-1 flex-shrink-0" />
                        <p className="text-lg text-slate-700">{principle}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 }}
                  className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-3xl p-8 shadow-xl text-center"
                >
                  <p className="text-2xl font-playfair text-cyan-800 font-bold">
                    {slide.content.goal}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        );

      case 'mom-friendly-habits':
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

              <div className="space-y-12">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                >
                  <h3 className="text-2xl font-bold text-purple-800 mb-6 text-center">Traditional vs. Mom Reality</h3>
                  <div className="space-y-6">
                    {slide.content.traditionalVsMom.map((item: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="grid md:grid-cols-3 gap-4 items-center"
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-2">{item.icon}</div>
                        </div>
                        <div className="bg-red-50 p-4 rounded-xl">
                          <p className="text-red-800 font-semibold">Traditional: {item.traditional}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-xl">
                          <p className="text-green-800 font-semibold">Mom Reality: {item.momReality}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6">
                  {slide.content.momFriendlyPrinciples.map((principle: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + index * 0.1 }}
                      className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="text-3xl">{principle.icon}</div>
                        <h4 className="text-lg font-bold text-slate-800">{principle.title}</h4>
                      </div>
                      <div className="space-y-2">
                        {principle.points.map((point: string, pointIndex: number) => (
                          <div key={pointIndex} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-purple-500 mt-1 flex-shrink-0" />
                            <p className="text-sm text-slate-700">{point}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                  className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-3xl p-8 shadow-xl text-center border-l-8 border-purple-400"
                >
                  <Zap className="w-12 h-12 mx-auto text-purple-600 mb-4" />
                  <p className="text-xl text-purple-800">
                    {slide.content.brainScience}
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
                {slide.content.pillars.map((pillar: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.2 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
                  >
                    <div className="text-center mb-6">
                      <div className="text-5xl mb-4">{pillar.icon}</div>
                      <h3 className="text-2xl font-bold text-slate-800">{pillar.title}</h3>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-bold text-amber-800 mb-3">Daily Habits:</h4>
                        <div className="space-y-2">
                          {pillar.dailyHabits.map((habit: string, habitIndex: number) => (
                            <div key={habitIndex} className="flex items-start gap-2">
                              <Sun className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
                              <p className="text-sm text-slate-700">{habit}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-orange-800 mb-3">Weekly Practices:</h4>
                        <div className="space-y-2">
                          {pillar.weeklyPractices.map((practice: string, practiceIndex: number) => (
                            <div key={practiceIndex} className="flex items-start gap-2">
                              <Star className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                              <p className="text-sm text-slate-700">{practice}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="text-center bg-gradient-to-r from-amber-100 to-orange-100 rounded-3xl p-6 shadow-xl"
              >
                <Target className="w-12 h-12 mx-auto text-amber-600 mb-4" />
                <p className="text-xl text-amber-800">
                  {slide.content.integrationTip}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'personal-routine':
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
                {slide.content.routineStructure.map((routine: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl"
                  >
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="bg-rose-50 p-4 rounded-xl">
                        <h3 className="text-lg font-bold text-rose-800 mb-2">{routine.time}</h3>
                        <p className="text-sm text-rose-600">{routine.duration}</p>
                        <p className="text-xs text-slate-600 mt-2">{routine.when}</p>
                      </div>
                      
                      <div className="bg-pink-50 p-4 rounded-xl">
                        <h4 className="font-bold text-pink-800 mb-2">Structure:</h4>
                        <p className="text-sm text-pink-700">{routine.structure}</p>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-xl">
                        <h4 className="font-bold text-purple-800 mb-2">Examples:</h4>
                        <div className="space-y-1">
                          {routine.examples.map((example: string, exampleIndex: number) => (
                            <p key={exampleIndex} className="text-xs text-purple-700">• {example}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl"
                >
                  <h3 className="text-xl font-bold text-rose-800 mb-4">Customization Questions:</h3>
                  <div className="space-y-2">
                    {slide.content.customizationQuestions.map((question: string, index: number) => (
                      <p key={index} className="text-sm text-slate-700">• {question}</p>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                  className="bg-gradient-to-r from-rose-100 to-pink-100 rounded-3xl p-6 shadow-xl"
                >
                  <h3 className="text-xl font-bold text-pink-800 mb-4">Flexibility Versions:</h3>
                  <div className="space-y-3">
                    {slide.content.flexibilityVersions.map((version: any, index: number) => (
                      <div key={index} className="bg-white/60 p-3 rounded-xl">
                        <h4 className="font-bold text-pink-700">{version.mode}</h4>
                        <p className="text-sm text-slate-700">{version.duration}</p>
                        <p className="text-xs text-slate-600">{version.description}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-pink-800 mt-4 italic">{slide.content.tip}</p>
                </motion.div>
              </div>
            </div>
          </div>
        );

      case 'habit-troubleshooting':
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
                {slide.content.challenges.map((challenge: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl"
                  >
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{challenge.icon}</div>
                        <h3 className="text-lg font-bold text-slate-800">"{challenge.challenge}"</h3>
                      </div>
                      
                      <div className="md:col-span-2 bg-green-50 p-4 rounded-xl">
                        <h4 className="font-bold text-green-800 mb-3">Solutions:</h4>
                        <div className="space-y-2">
                          {challenge.solutions.map((solution: string, solutionIndex: number) => (
                            <div key={solutionIndex} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                              <p className="text-sm text-green-700">{solution}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl"
                >
                  <h3 className="text-xl font-bold text-red-800 mb-4">Maintenance Strategies:</h3>
                  <div className="space-y-2">
                    {slide.content.maintenanceStrategies.map((strategy: string, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <Repeat className="w-4 h-4 text-red-500" />
                        <p className="text-slate-700">{strategy}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 }}
                  className="bg-gradient-to-r from-red-100 to-rose-100 rounded-3xl p-6 shadow-xl"
                >
                  <Shield className="w-12 h-12 text-red-600 mb-4" />
                  <p className="text-red-800 font-bold mb-2">Growth Mindset:</p>
                  <p className="text-slate-700">{slide.content.growthMindset}</p>
                </motion.div>
              </div>
            </div>
          </div>
        );

      case 'systems-vs-motivation':
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
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-red-50 rounded-3xl p-8 shadow-xl"
                >
                  <h3 className="text-2xl font-bold text-red-800 mb-6 text-center">Motivation Problems</h3>
                  <div className="space-y-3">
                    {slide.content.motivationProblems.map((problem: string, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <X className="w-5 h-5 text-red-500" />
                        <p className="text-red-700">{problem}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-green-50 rounded-3xl p-8 shadow-xl"
                >
                  <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">Systems Advantages</h3>
                  <div className="space-y-3">
                    {slide.content.systemsAdvantages.map((advantage: string, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <p className="text-green-700">{advantage}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <div className="space-y-8">
                {slide.content.systemDesignPrinciples.map((principle: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.2 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl"
                  >
                    <h3 className="text-xl font-bold text-blue-800 mb-4">{principle.principle}</h3>
                    <p className="text-slate-700 mb-4">{principle.description}</p>
                    <div className="grid md:grid-cols-2 gap-3">
                      {principle.examples.map((example: string, exampleIndex: number) => (
                        <div key={exampleIndex} className="bg-blue-50 p-3 rounded-xl">
                          <p className="text-sm text-blue-700">{example}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="text-center bg-gradient-to-r from-blue-100 to-indigo-100 rounded-3xl p-8 shadow-xl mt-8"
              >
                <Battery className="w-16 h-16 mx-auto text-blue-600 mb-4" />
                <p className="text-2xl font-bold text-blue-800">
                  {slide.content.systemSuccess}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'week3-accomplishments':
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
                {slide.content.accomplishments.map((accomplishment: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.2 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{accomplishment.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 mb-3">
                          ✓ {accomplishment.achievement}
                        </h3>
                        <p className="text-slate-700">{accomplishment.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-3xl p-8 shadow-xl"
              >
                <h3 className="text-2xl font-bold text-emerald-800 mb-6 text-center">Your Transformation Journey</h3>
                <div className="space-y-4">
                  {slide.content.transformation.map((transform: string, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <ArrowRight className="w-5 h-5 text-emerald-600" />
                      <p className="text-lg text-emerald-700">{transform}</p>
                    </div>
                  ))}
                </div>
                <p className="text-center text-xl font-playfair text-emerald-800 mt-8 italic">
                  {slide.content.appreciationPrompt}
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

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl mb-12 text-center"
              >
                <p className="text-xl text-violet-800 mb-8 italic">
                  {slide.content.visionPrompt}
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {slide.content.visionQuestions.map((question: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="p-4 bg-violet-50 rounded-xl"
                    >
                      <p className="text-violet-700">{question}</p>
                    </motion.div>
                  ))}
                </div>

                <p className="text-2xl font-playfair text-violet-800 font-bold mt-8">
                  {slide.content.realityCheck}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                className="bg-gradient-to-r from-violet-100 to-indigo-100 rounded-3xl p-8 shadow-xl"
              >
                <h3 className="text-2xl font-bold text-violet-800 mb-6 text-center">Your Future Self</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {slide.content.embodiment.map((embodiment: string, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-violet-600 flex-shrink-0" />
                      <p className="text-slate-700">{embodiment}</p>
                    </div>
                  ))}
                </div>
                <p className="text-center text-xl font-bold text-violet-800 mt-8">
                  {slide.content.bridge}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'commitment-ceremony':
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
                <p className="text-xl text-pink-800 mb-8">
                  {slide.content.instruction}
                </p>
                <div className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-2xl p-8 mb-8">
                  <Heart className="w-16 h-16 mx-auto text-pink-600 mb-6" />
                  <p className="text-2xl font-playfair text-pink-800 italic leading-relaxed">
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
                <h3 className="text-xl font-bold text-red-800 mb-4">This Commitment Includes:</h3>
                <div className="space-y-2">
                  {slide.content.practices.map((practice: string, index: number) => (
                    <div key={index} className="flex items-center gap-3 justify-center">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <p className="text-slate-700">{practice}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3 }}
                className="space-y-6"
              >
                <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl p-6 shadow-lg">
                  <p className="text-lg text-red-800 mb-4">
                    {slide.content.reminder}
                  </p>
                  <p className="text-xl font-playfair text-red-800">
                    {slide.content.witnessing}
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
                <p className="text-xl text-slate-700 leading-relaxed mb-8">
                  {slide.content.preview}
                </p>
                
                <div className="bg-teal-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-teal-800 mb-4">Topics include:</h3>
                  <div className="space-y-2">
                    {slide.content.topics.map((topic: string, index: number) => (
                      <div key={index} className="flex items-center gap-3">
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
                transition={{ delay: 1 }}
                className="space-y-8"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                  <p className="text-xl text-slate-700 mb-4">
                    {slide.content.connectionToWeek3}
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
                    href="/course/week4"
                    className="inline-block bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-teal-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Continue to Week 4 →
                  </Link>
                  <p className="text-white/80 text-sm">
                    Relationships & Communication
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

      case 'final-integration':
        return (
          <div className="relative min-h-screen flex items-center justify-center px-8 py-16 overflow-hidden">
            {/* Background */}
            {slide.content.backgroundImage && (
              <div className="absolute inset-0">
                <Image
                  src={slide.content.backgroundImage}
                  alt="Background"
                  fill
                  className="object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100/80 via-yellow-50/80 to-orange-100/80" />
              </div>
            )}

            <div className="relative z-10 max-w-6xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16"
              >
                <h1 className="text-5xl md:text-7xl font-playfair text-slate-800 mb-6">
                  {slide.content.title}
                </h1>
                <p className="text-3xl md:text-4xl text-slate-600 font-light">
                  {slide.content.subtitle}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl mb-12"
              >
                <p className="text-2xl text-amber-800 mb-8">
                  {slide.content.celebration}
                </p>
                
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-8 mb-8">
                  <Flower2 className="w-20 h-20 mx-auto text-amber-600 mb-6" />
                  <p className="text-4xl font-playfair text-amber-800 font-bold leading-relaxed">
                    {slide.content.truth}
                  </p>
                </div>

                <div className="space-y-4">
                  {slide.content.reminder.map((reminder: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + index * 0.1 }}
                      className="flex items-center gap-4 justify-center"
                    >
                      <Star className="w-6 h-6 text-amber-500" />
                      <p className="text-xl text-slate-700">{reminder}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="space-y-8"
              >
                <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl p-8 shadow-lg">
                  <p className="text-xl text-orange-800 mb-4">
                    {slide.content.finalWisdom}
                  </p>
                  <p className="text-2xl font-playfair text-orange-800 italic">
                    {slide.content.blessing}
                  </p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 }}
                  className="mt-8"
                >
                  <Link
                    href="/course/week4"
                    className="inline-block bg-gradient-to-r from-amber-600 to-orange-600 text-white px-10 py-5 rounded-xl font-semibold text-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {slide.content.nextStep}
                  </Link>
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
                <h3 className="text-2xl font-bold text-slate-800">Week 3 Lesson 4</h3>
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

export default function Week3Lesson4Page() {
  return (
    <CourseAuthWrapper courseSlug="postpartum-wellness-foundations">
      <Week3Lesson4Content />
    </CourseAuthWrapper>
  );
}