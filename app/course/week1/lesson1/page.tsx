'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Menu, X, Heart, Users, Brain, Timer } from 'lucide-react';

// Beautiful slide data that matches the comprehensive course content
const slides = [
  {
    id: 1,
    type: 'hero',
    content: {
      title: 'Welcome to Your Fourth Trimester',
      subtitle: 'A Sacred Space for Your Becoming',
      description: 'Before we begin, honor yourself. You are here, investing in your mental health during one of life\'s most challenging transitions. That isn\'t just courage - that\'s profound wisdom.',
      background: 'gradient-sage-bloom',
      backgroundImage: '/images/optimized/Hero/herooptimzed.webp',
      overlay: true
    }
  },
  {
    id: 2,
    type: 'greeting',
    content: {
      title: 'Hello, Beautiful Mama',
      message: 'I\'m Dr. Jana, and what you\'re experiencing right now - the overwhelm, the uncertainty, maybe even the numbness - it\'s not a flaw in your character.',
      insight: 'It\'s your nervous system responding to the most significant biological and psychological transformation a human can experience.',
      background: 'warm-cream',
      image: '/images/Team/Jana Rundle.jpg'
    }
  },
  {
    id: 3,
    type: 'container-setting',
    content: {
      title: 'Our Sacred Container',
      subtitle: 'The boundaries that keep this space safe',
      thisIs: [
        'Trauma-informed and attachment-focused',
        'Based on 15+ years of clinical research', 
        'A place where ALL parts of you are welcomed',
        'Designed for your nervous system\'s current capacity',
        'Your permission slip to prioritize yourself'
      ],
      thisIsNot: [
        'A substitute for crisis intervention or medical care',
        'A place for toxic positivity or \'just think positive\'',
        'Somewhere you need to perform or be \'grateful enough\''
      ],
      background: 'white',
      backgroundPattern: true
    }
  },
  {
    id: 4,
    type: 'reframe-science',
    content: {
      title: 'The Truth About Your Fourth Trimester',
      subtitle: 'What neuroscience tells us',
      revelation: 'Society tells us the fourth trimester is \'just\' the first three months. But neuroscience tells us a different story.',
      facts: [
        'Your brain is literally rewiring itself - growing new neural pathways',
        'Your gray matter is reorganizing for vigilance, empathy, and connection', 
        'Your amygdala is hyperactive - not because you\'re anxious, but because you\'re evolutionarily designed to protect',
        'You\'re experiencing the largest hormonal shift in human biology'
      ],
      truth: 'You\'re not broken. You\'re BECOMING.',
      background: 'gradient-neural',
      backgroundImage: '/images/biff01_imagine_woman_in_meditation_pose_serene_environment_br_1f66e17b-a951-4d9f-b895-127fabc89208_3.png'
    }
  },
  {
    id: 5,
    type: 'transformation-reality',
    content: {
      title: 'What You\'re Really Navigating',
      subtitle: 'All of this. Simultaneously.',
      challenges: [
        { icon: '🧠', title: 'Identity Death & Rebirth', desc: 'Matrescence - becoming a mother' },
        { icon: '🌊', title: 'Massive Hormonal Shifts', desc: 'Larger than puberty and menopause combined' },
        { icon: '💤', title: 'Sleep Deprivation', desc: 'That would be considered torture in other contexts' },
        { icon: '🔗', title: 'Attachment Reorganization', desc: 'With everyone in your life' },
        { icon: '🏥', title: 'Physical Recovery', desc: 'From what\'s essentially an endurance event' },
        { icon: '👶', title: 'Keeping Human Alive', desc: 'While you\'re learning everything' }
      ],
      validation: 'When you think about it this way - your resilience is actually extraordinary.',
      background: 'gradient-ocean',
      backgroundImage: '/images/biff01_imagine_exhausted_but_loving_mother_with_twins_double__b2ac5580-9b28-4752-a4b3-c61a524b828d_2.png'
    }
  },
  {
    id: 6,
    type: 'community-stats',
    content: {
      title: 'Your Invisible Community',
      subtitle: 'Not as statistics - as your neighbors, sisters, friends',
      stats: [
        { 
          number: '80%', 
          text: 'experience baby blues',
          visual: 'That\'s 4 out of every 5 moms you see at Target'
        },
        { 
          number: '20%', 
          text: 'develop postpartum depression',
          visual: 'That\'s your neighbor, your sister, your friend'
        },
        { 
          number: '15%', 
          text: 'experience postpartum anxiety',
          visual: 'Including high-achieving, \'together\' women'
        },
        { 
          number: '40%', 
          text: 'report intrusive thoughts',
          visual: 'Most too ashamed to tell anyone'
        }
      ],
      reframe: 'Struggling is NORMAL. It\'s not a bug in the system - it\'s a feature.',
      truth: 'The problem isn\'t you. The problem is a culture that expects you to \'bounce back\' from an experience that\'s meant to fundamentally change you.',
      background: 'gradient-community',
      backgroundImage: '/images/biff01_imagine_supportive_womens_group_therapy_session_circle_41bd705b-5dd8-4957-a199-b2fa0530b46f_3.png'
    }
  },
  {
    id: 7,
    type: 'rights-manifesto',
    content: {
      title: 'Your Fourth Trimester Rights',
      subtitle: 'Not just nice ideas - therapeutic prescriptions for your healing',
      rights: [
        'Feel whatever you feel without justification',
        'Ask for help as many times as you need it',
        'Prioritize your mental health as much as baby\'s physical health',
        'Grieve who you were before becoming a mother',
        'Change your mind about parenting choices',
        'Have needs that exist beyond your baby\'s needs',
        'Define successful motherhood on YOUR terms',
        'Take up space, be imperfect, and still be worthy of love'
      ],
      embodiment: 'As you read each one, notice which ones your body resists. That\'s where your healing work begins.',
      background: 'gradient-rights',
      backgroundImage: '/images/biff01_imagine_confident_single_mother_holding_baby_standing__b3179601-8cbf-4af3-9b29-bedcbc4946a3_3.png'
    }
  },
  {
    id: 8,
    type: 'practice-medicine',
    content: {
      title: 'Your Medicine This Week',
      subtitle: 'Not homework - medicine for your nervous system',
      practice: {
        name: 'The "Enough" Practice',
        frequency: '3 times daily',
        instruction: 'Place both hands on your heart and say:',
        words: [
          'I am learning, and that\'s enough.',
          'I am trying, and that\'s enough.',
          'I am here, and that\'s enough.'
        ]
      },
      science: 'This isn\'t positive thinking. This is nervous system regulation. Your touch releases oxytocin. Your voice speaking kindness rewires your internal dialogue.',
      truth: 'This is neuroscience-backed self-compassion.',
      background: 'gradient-heart',
      backgroundImage: '/images/Services/Hopeful Hands.png'
    }
  },
  {
    id: 9,
    type: 'bridge-forward',
    content: {
      title: 'What\'s Coming Next',
      subtitle: 'In our next lesson: Your Body\'s Wisdom',
      preview: 'We\'ll explore what\'s happening in your body during recovery. Not the sanitized version you got at your six-week checkup, but the real, nuanced truth that helps you understand why healing takes time.',
      reminder: 'Remember: This is YOUR journey. You can pause, rewind, cry, or celebrate. All of it is part of your becoming.',
      closing: 'See you soon, brave one.',
      background: 'gradient-sage-bloom',
      backgroundImage: '/images/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__1c12cc3c-cebd-47e2-ad9b-66b9bbca6480_2.png'
    }
  }
];

export default function Lesson1Page() {
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
      'white': 'bg-white',
      'warm-cream': 'bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50',
      'gradient-sage-bloom': 'bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-50',
      'gradient-neural': 'bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100',
      'gradient-ocean': 'bg-gradient-to-br from-blue-100 via-cyan-50 to-teal-50',
      'gradient-community': 'bg-gradient-to-br from-rose-100 via-pink-50 to-orange-50',
      'gradient-rights': 'bg-gradient-to-br from-purple-100 via-violet-50 to-fuchsia-50',
      'gradient-heart': 'bg-gradient-to-br from-pink-100 via-rose-50 to-red-50'
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
                  <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/30" />
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
                <p className="text-2xl md:text-3xl text-white/90 font-light mb-8">
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

      case 'greeting':
        return (
          <div className="min-h-screen flex items-center justify-center px-8">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <h1 className="text-5xl md:text-7xl font-playfair text-slate-800 leading-tight">
                  {slide.content.title}
                </h1>
                <p className="text-2xl text-slate-600 leading-relaxed">
                  {slide.content.message}
                </p>
                <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-8 rounded-2xl border-l-4 border-rose-300">
                  <p className="text-xl text-slate-700 italic">
                    {slide.content.insight}
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                <div className="relative h-96 w-96 mx-auto rounded-full overflow-hidden shadow-2xl">
                  <Image
                    src={slide.content.image}
                    alt="Dr. Jana"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-rose-400 to-pink-400 rounded-full flex items-center justify-center">
                  <Heart className="w-12 h-12 text-white" />
                </div>
              </motion.div>
            </div>
          </div>
        );

      case 'container-setting':
        return (
          <div className="min-h-screen flex items-center justify-center px-8 py-16">
            <div className="max-w-6xl mx-auto">
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

              <div className="grid md:grid-cols-2 gap-12">
                {/* This Space IS */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 shadow-lg"
                >
                  <h3 className="text-2xl font-bold text-emerald-800 mb-6 flex items-center gap-3">
                    <span className="text-3xl">✓</span>
                    This Space IS
                  </h3>
                  <ul className="space-y-4">
                    {slide.content.thisIs.map((item: string, index: number) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-start gap-3 text-lg text-slate-700"
                      >
                        <span className="text-emerald-500 text-xl mt-1">•</span>
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* This Space is NOT */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl p-8 shadow-lg"
                >
                  <h3 className="text-2xl font-bold text-rose-800 mb-6 flex items-center gap-3">
                    <span className="text-3xl">✗</span>
                    This Space is NOT
                  </h3>
                  <ul className="space-y-4">
                    {slide.content.thisIsNot.map((item: string, index: number) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex items-start gap-3 text-lg text-slate-700"
                      >
                        <span className="text-rose-500 text-xl mt-1">•</span>
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          </div>
        );

      case 'reframe-science':
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
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/80 via-purple-50/80 to-pink-100/80" />
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
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
                  <p className="text-xl text-slate-700 italic">
                    {slide.content.revelation}
                  </p>
                </div>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {slide.content.facts.map((fact: string, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.2 }}
                    className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg"
                  >
                    <Brain className="w-8 h-8 text-indigo-600 mb-3" />
                    <p className="text-lg text-slate-700">{fact}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 }}
                className="text-center"
              >
                <h2 className="text-4xl md:text-5xl font-playfair text-purple-800 font-bold">
                  {slide.content.truth}
                </h2>
              </motion.div>
            </div>
          </div>
        );

      case 'transformation-reality':
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
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/80 via-cyan-50/80 to-teal-50/80" />
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

              <div className="grid md:grid-cols-3 gap-8 mb-16">
                {slide.content.challenges.map((challenge: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg text-center hover:transform hover:scale-105 transition-transform duration-300"
                  >
                    <div className="text-5xl mb-4">{challenge.icon}</div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">
                      {challenge.title}
                    </h3>
                    <p className="text-slate-600">
                      {challenge.desc}
                    </p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                className="text-center bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
              >
                <p className="text-2xl md:text-3xl font-playfair text-teal-800 italic">
                  {slide.content.validation}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'community-stats':
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
                <div className="absolute inset-0 bg-gradient-to-br from-rose-100/80 via-pink-50/80 to-orange-50/80" />
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

              <div className="grid md:grid-cols-2 gap-8 mb-16">
                {slide.content.stats.map((stat: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.2 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl text-center"
                  >
                    <div className="flex items-center justify-center mb-6">
                      <Users className="w-12 h-12 text-rose-500 mr-4" />
                      <span className="text-6xl font-bold text-rose-600">
                        {stat.number}
                      </span>
                    </div>
                    <p className="text-xl font-semibold text-slate-800 mb-3">
                      {stat.text}
                    </p>
                    <p className="text-lg text-slate-600 italic">
                      {stat.visual}
                    </p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="space-y-8"
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl text-center">
                  <p className="text-2xl md:text-3xl font-bold text-orange-800 mb-4">
                    {slide.content.reframe}
                  </p>
                  <p className="text-xl text-slate-700">
                    {slide.content.truth}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        );

      case 'rights-manifesto':
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
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100/80 via-violet-50/80 to-fuchsia-50/80" />
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
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-purple-800 mb-4">
                    You have the RIGHT to:
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {slide.content.rights.map((right: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-xl hover:bg-purple-50 transition-colors"
                    >
                      <Heart className="w-6 h-6 text-purple-500 mt-1 flex-shrink-0" />
                      <p className="text-lg text-slate-700">{right}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 }}
                className="bg-gradient-to-r from-purple-100 to-violet-100 rounded-2xl p-8 text-center"
              >
                <p className="text-xl text-purple-800 italic">
                  {slide.content.embodiment}
                </p>
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
                    <Timer className="w-8 h-8 text-pink-600" />
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
                  🤲
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
                    href="/course/week1/lesson2"
                    className="inline-block bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-teal-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Continue to Lesson 2 →
                  </Link>
                  <p className="text-white/80 text-sm">
                    Your Body's Wisdom - Recovery Reimagined
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
              {currentSlide + 1} / {slides.length}
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
                <h3 className="text-2xl font-bold text-slate-800">Lesson Navigation</h3>
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