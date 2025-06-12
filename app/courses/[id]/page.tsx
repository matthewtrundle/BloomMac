'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import NewsletterSignup from '@/components/ui/NewsletterSignup';
import CoursePurchaseButton from '@/components/ui/CoursePurchaseButton';

// Course data would normally come from a database
const courseData: Record<string, any> = {
  'postpartum-wellness-foundations': {
    id: 'postpartum-wellness-foundations',
    title: 'Postpartum Wellness Foundations',
    subtitle: 'Your 6-Week Journey to Emotional Balance',
    description: 'A comprehensive self-paced program designed to help new mothers navigate the emotional challenges of postpartum life with confidence and clarity.',
    longDescription: `Are you struggling to recognize yourself in the mirror? Feeling overwhelmed by the demands of motherhood while battling anxiety, mood swings, or a sense of loss? You're not alone, and you don't have to navigate this journey by yourself.

This transformative 6-week program combines evidence-based therapeutic techniques with practical strategies specifically designed for the unique challenges of postpartum life. Created by Dr. Jana Rundle, a licensed psychologist specializing in maternal mental health, this course provides the support and tools you need to thrive, not just survive.`,
    duration: '6 weeks',
    modules: 6,
    totalLessons: 24,
    price: 197,
    originalPrice: 297,
    image: '/images/optimized/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__1c12cc3c-cebd-47e2-ad9b-66b9bbca6480_0.webp',
    instructor: {
      name: 'Dr. Jana Rundle',
      credentials: 'Licensed Clinical Psychologist, Certified Perinatal Mental Health Specialist',
      image: '/images/optimized/Team/Jana Rundle.webp'
    },
    curriculum: [
      {
        week: 1,
        title: 'Understanding Your Postpartum Experience',
        lessons: [
          'The reality of postpartum emotions',
          'Differentiating baby blues, anxiety, and depression',
          'Creating your emotional baseline',
          'Building your support network map'
        ]
      },
      {
        week: 2,
        title: 'Managing Overwhelming Emotions',
        lessons: [
          'Emotional regulation techniques',
          'Coping with mom rage and irritability',
          'Processing grief and loss',
          'Mindfulness for busy moms'
        ]
      },
      {
        week: 3,
        title: 'Anxiety & Worry Management',
        lessons: [
          'Understanding postpartum anxiety',
          'Breaking the worry cycle',
          'Sleep strategies for anxious minds',
          'Creating calm in chaos'
        ]
      },
      {
        week: 4,
        title: 'Self-Care That Actually Works',
        lessons: [
          'Redefining self-care for moms',
          '5-minute self-care practices',
          'Setting boundaries without guilt',
          'Asking for and accepting help'
        ]
      },
      {
        week: 5,
        title: 'Strengthening Relationships',
        lessons: [
          'Communicating your needs',
          'Navigating partner relationships',
          'Building the mother-baby bond',
          'Managing family dynamics'
        ]
      },
      {
        week: 6,
        title: 'Building Your New Identity',
        lessons: [
          'Integrating motherhood with self',
          'Rediscovering joy and purpose',
          'Creating sustainable routines',
          'Planning your continued growth'
        ]
      }
    ],
    features: [
      {
        icon: '🎥',
        title: 'Video Lessons',
        description: '24 bite-sized video lessons (10-15 minutes each)'
      },
      {
        icon: '📚',
        title: 'Workbooks',
        description: 'Downloadable PDF workbooks for each module'
      },
      {
        icon: '🎧',
        title: 'Audio Content',
        description: 'Guided meditations and exercises for on-the-go'
      },
      {
        icon: '💬',
        title: 'Live Q&As',
        description: 'Monthly live Q&A sessions with Dr. Jana'
      },
      {
        icon: '🏆',
        title: 'Certificate',
        description: 'Certificate of completion for your journey'
      }
    ],
    bonuses: [
      'Emergency Coping Cards (printable)',
      'Partner Communication Guide',
      'Postpartum Meal Planning Template',
      'Sleep Optimization Checklist',
      'Return-to-Work Transition Guide'
    ],
    testimonials: [
      {
        name: 'Sarah M.',
        text: 'This course saved my sanity. I went from crying every day to actually enjoying time with my baby.',
        rating: 5
      },
      {
        name: 'Jennifer K.',
        text: 'The community aspect was invaluable. Knowing other moms were going through the same thing made me feel less alone.',
        rating: 5
      },
      {
        name: 'Maria L.',
        text: 'Dr. Jana\'s approach is so compassionate and practical. The techniques actually work in real mom life!',
        rating: 5
      }
    ],
    faq: [
      {
        question: 'When does the course start?',
        answer: 'The course is self-paced, so you can start immediately after enrollment. New content is released weekly, but you can work through it at your own speed.'
      },
      {
        question: 'What if I can\'t keep up with the weekly schedule?',
        answer: 'No worries! You have lifetime access. Many moms take 8-12 weeks to complete the course, and that\'s perfectly fine.'
      },
      {
        question: 'Is this a replacement for therapy?',
        answer: 'This course provides educational content and coping strategies but is not a replacement for individual therapy. If you\'re experiencing severe symptoms, please seek professional help.'
      },
      {
        question: 'Can my partner access the course too?',
        answer: 'Yes! We encourage partners to watch the videos together. The Partner Communication Guide is specifically designed for this.'
      }
    ]
  },
  'anxiety-management-new-moms': {
    id: 'anxiety-management-new-moms',
    title: 'Anxiety Management for New Moms',
    subtitle: 'Practical Tools for Peace of Mind',
    description: 'Learn evidence-based techniques to manage postpartum anxiety and worry, specifically designed for the unique challenges of new motherhood.',
    longDescription: `Constant worry keeping you up at night? Racing thoughts about your baby's safety? Feeling on edge and unable to relax? Postpartum anxiety affects up to 20% of new mothers, yet it's often overlooked.

This focused 4-week program teaches you practical, evidence-based techniques to manage anxiety while caring for your baby. Each technique is designed to be used in real-time, during feedings, diaper changes, or those 3 AM worry sessions.`,
    duration: '4 weeks',
    modules: 4,
    totalLessons: 16,
    price: 127,
    image: '/images/optimized/biff01_imagine_woman_in_meditation_pose_serene_environment_br_1f66e17b-a951-4d9f-b895-127fabc89208_1.webp',
    instructor: {
      name: 'Dr. Jana Rundle',
      credentials: 'Licensed Clinical Psychologist, Certified Perinatal Mental Health Specialist',
      image: '/images/optimized/Team/Jana Rundle.webp'
    },
    curriculum: [
      {
        week: 1,
        title: 'Understanding Postpartum Anxiety',
        lessons: [
          'What is postpartum anxiety?',
          'Physical symptoms and triggers',
          'Creating your anxiety profile',
          'Introduction to CBT techniques'
        ]
      },
      {
        week: 2,
        title: 'Calming Techniques That Work',
        lessons: [
          'Breathing exercises for instant relief',
          'Progressive muscle relaxation',
          'Grounding techniques for panic',
          'Creating your calm toolkit'
        ]
      },
      {
        week: 3,
        title: 'Changing Anxious Thoughts',
        lessons: [
          'Identifying worry patterns',
          'Challenging catastrophic thinking',
          'Building realistic perspectives',
          'Worry time technique'
        ]
      },
      {
        week: 4,
        title: 'Building Long-Term Resilience',
        lessons: [
          'Sleep strategies for anxious moms',
          'Nutrition and anxiety connection',
          'Exercise as anxiety medicine',
          'Maintaining your progress'
        ]
      }
    ],
    features: [
      {
        icon: '🎥',
        title: 'Video Lessons',
        description: '16 focused video lessons (10 minutes each)'
      },
      {
        icon: '📱',
        title: 'Mobile App',
        description: 'Quick-access anxiety tools on your phone'
      },
      {
        icon: '📊',
        title: 'Tracking Tools',
        description: 'Anxiety tracking worksheets and apps'
      },
      {
        icon: '🆘',
        title: 'Emergency Cards',
        description: 'Printable coping cards for panic moments'
      }
    ],
    testimonials: [
      {
        name: 'Jessica L.',
        text: 'The breathing techniques literally saved me during night feedings. I can actually calm myself down now.',
        rating: 5
      },
      {
        name: 'Amanda R.',
        text: 'I love that the lessons are short. I could actually finish them during nap time!',
        rating: 5
      }
    ]
  },
  'partner-support-bootcamp': {
    id: 'partner-support-bootcamp',
    title: 'Partner Support Bootcamp',
    subtitle: 'For Partners Who Want to Help',
    description: 'Equip partners with the knowledge and skills to provide meaningful support during the postpartum period.',
    longDescription: `Watching your partner struggle with postpartum challenges can leave you feeling helpless and frustrated. You want to help, but don't know how. This bootcamp gives you the practical tools and understanding you need to be the supportive partner she needs.

In just 2 weeks, you'll learn to recognize warning signs, communicate effectively, and provide practical support that actually makes a difference.`,
    duration: '2 weeks',
    modules: 4,
    totalLessons: 8,
    price: 97,
    image: '/images/optimized/biff01_imagine_mixed-race_parents_with_newborn_tender_family__1caa7f06-30ca-47c7-a1cd-038dc0cea487_1.webp',
    instructor: {
      name: 'Dr. Jana Rundle',
      credentials: 'Licensed Clinical Psychologist, Certified Perinatal Mental Health Specialist',
      image: '/images/optimized/Team/Jana Rundle.webp'
    },
    curriculum: [
      {
        week: 1,
        title: 'Understanding the Postpartum Experience',
        lessons: [
          'What\'s really happening hormonally and emotionally',
          'Recognizing warning signs',
          'Common partner mistakes and how to avoid them',
          'Creating a supportive environment'
        ]
      },
      {
        week: 2,
        title: 'Practical Support Strategies',
        lessons: [
          'Communication that helps (not hurts)',
          'Taking initiative without being asked',
          'Managing your own emotions',
          'When and how to seek professional help'
        ]
      }
    ],
    features: [
      {
        icon: '🎥',
        title: 'Video Lessons',
        description: '8 straight-to-the-point videos (15 minutes each)'
      },
      {
        icon: '📝',
        title: 'Action Plans',
        description: 'Weekly support action plans'
      },
      {
        icon: '💬',
        title: 'Scripts',
        description: 'What to say (and not say) templates'
      },
      {
        icon: '📋',
        title: 'Checklists',
        description: 'Daily support task checklists'
      }
    ],
    testimonials: [
      {
        name: 'Mike T.',
        text: 'I finally understood what my wife was going through. The communication scripts were game-changers.',
        rating: 5
      },
      {
        name: 'David S.',
        text: 'Short, practical, and actually helpful. I wish I had this with our first baby.',
        rating: 5
      }
    ]
  }
};

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;
  const course = courseData[courseId];
  
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedWeek, setExpandedWeek] = useState<number | null>(0);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Course not found</h1>
          <Link href="/courses" className="text-bloompink hover:underline">
            View all courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50">
      {/* Hero Section - Professional */}
      <section className="relative py-20 overflow-hidden">
        
        <div className="absolute inset-0 opacity-10">
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-playfair mb-4">
                {course.title}
              </h1>
              
              {/* Professional divider */}
              <div className="w-24 h-0.5 bg-[#f8b5c4] mx-auto mb-6"></div>
              
              <p className="text-xl text-bloom-dark/80 mb-8">{course.subtitle}</p>
              
              <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>{course.modules} modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>{course.totalLessons} lessons</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-bloompink">${course.price}</span>
                  {course.originalPrice && (
                    <span className="text-xl text-bloom-dark/40 line-through">${course.originalPrice}</span>
                  )}
                </div>
                <div>
                  <button
                    disabled
                    className="px-8 py-3 rounded-lg font-medium bg-gray-100 text-gray-500 cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                  <p className="text-xs text-center mt-2 text-bloom-dark/60">
                    Launching July 2025
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex justify-center space-x-8 py-4">
            {['overview', 'curriculum', 'instructor'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`capitalize font-medium pb-2 border-b-2 transition-colors ${
                  activeTab === tab 
                    ? 'text-bloompink border-bloompink' 
                    : 'text-bloom-dark/60 border-transparent hover:text-bloom-dark'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                  <h2 className="text-3xl font-playfair mb-6">About This Course</h2>
                  <div className="prose prose-lg text-bloom-dark/80">
                    {course.longDescription.split('\n\n').map((paragraph: string, index: number) => (
                      <p key={index} className="mb-4">{paragraph}</p>
                    ))}
                  </div>
                  
                  <h3 className="text-2xl font-playfair mt-12 mb-6">What's Included</h3>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {course.features.map((feature: any, index: number) => (
                      <div key={index} className="flex gap-4">
                        <div className="text-3xl">{feature.icon}</div>
                        <div>
                          <h4 className="font-semibold mb-1">{feature.title}</h4>
                          <p className="text-sm text-bloom-dark/70">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {course.bonuses && (
                    <>
                      <h3 className="text-2xl font-playfair mt-12 mb-6">Bonus Materials</h3>
                      <ul className="space-y-2">
                        {course.bonuses.map((bonus: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>{bonus}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
                
                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="bg-gradient-to-br from-white to-bloom-sage-50/20 rounded-xl shadow-xl border border-bloom-sage/10 p-6 sticky top-24">
                    <div className="text-center mb-6">
                      <div className="flex items-baseline gap-2 justify-center mb-4">
                        <span className="text-4xl font-bold text-bloompink">${course.price}</span>
                        {course.originalPrice && (
                          <span className="text-xl text-bloom-dark/40 line-through">${course.originalPrice}</span>
                        )}
                      </div>
                      <Button 
                        href={`/checkout?course=${course.id}`} 
                        variant={course.id === 'partner-support-bootcamp' ? 'outline' : 'pink'} 
                        size="lg" 
                        className="w-full mb-4"
                      >
                        Enroll Now
                      </Button>
                    </div>
                    
                    <div className="border-t pt-6">
                      <h4 className="font-semibold mb-4">This course includes:</h4>
                      <ul className="space-y-3 text-sm">
                        <li className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Lifetime access
                        </li>
                        <li className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Mobile access
                        </li>
                        <li className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Certificate of completion
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Curriculum Tab */}
          {activeTab === 'curriculum' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-playfair mb-6 text-center">Course Curriculum</h2>
              
              {/* Decorative flower divider */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-bloom-sage/30 rounded-full"></div>
                <Image 
                  src="/images/flower no stem.svg" 
                  alt="" 
                  width={20} 
                  height={20} 
                  className="opacity-50"
                />
                <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-bloom-sage/30 rounded-full"></div>
              </div>
              
              <div className="max-w-3xl mx-auto">
                {course.curriculum.map((week: any, index: number) => (
                  <div key={index} className="mb-4">
                    <button
                      onClick={() => setExpandedWeek(expandedWeek === index ? null : index)}
                      className="w-full bg-gradient-to-br from-white to-bloom-sage-50/20 border border-bloom-sage/10 rounded-lg shadow-soft p-6 text-left hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-lg">Week {week.week}: {week.title}</h3>
                          <p className="text-sm text-bloom-dark/60 mt-1">{week.lessons.length} lessons</p>
                        </div>
                        <svg 
                          className={`w-5 h-5 transition-transform ${expandedWeek === index ? 'rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    
                    {expandedWeek === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-bloom-sage-50 rounded-b-lg px-6 py-4 mt-2"
                      >
                        <ul className="space-y-2">
                          {week.lessons.map((lesson: string, lessonIndex: number) => (
                            <li key={lessonIndex} className="flex items-start gap-2">
                              <svg className="w-5 h-5 text-bloom-sage mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              <span className="text-sm">{lesson}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Instructor Tab */}
          {activeTab === 'instructor' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-gradient-to-br from-white to-bloom-sage-50/20 border border-bloom-sage/10 rounded-xl shadow-soft p-8 md:p-12">
                <div className="grid md:grid-cols-3 gap-8 items-center">
                  <div className="md:col-span-1">
                    <Image
                      src={course.instructor.image}
                      alt={course.instructor.name}
                      width={300}
                      height={300}
                      className="rounded-xl shadow-lg mx-auto"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <h2 className="text-3xl font-playfair mb-2">{course.instructor.name}</h2>
                    <p className="text-bloom-dark/70 mb-6">{course.instructor.credentials}</p>
                    <div className="prose prose-lg text-bloom-dark/80">
                      <p>
                        Dr. Jana Rundle is a licensed clinical psychologist specializing in maternal mental health. 
                        With over 15 years of experience, she has helped hundreds of mothers navigate the challenges 
                        of postpartum life.
                      </p>
                      <p>
                        Her approach combines evidence-based therapeutic techniques with practical, real-world strategies 
                        that work for busy moms. She believes every mother deserves support and has created these courses 
                        to make quality mental health resources accessible to all.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </section>

      {/* FAQ Section with Garden Theme */}
      {course.faq && (
        <section className="py-16 bg-white/80 relative overflow-hidden">
          {/* Decorative vine pattern */}
          <svg className="absolute right-0 top-0 h-full w-32 opacity-5" viewBox="0 0 100 500" preserveAspectRatio="none">
            <path d="M50,0 Q70,50 50,100 T50,200 T50,300 T50,400 T50,500" 
                  stroke="currentColor" strokeWidth="2" fill="none" className="text-bloom-sage"/>
          </svg>
          
          <div className="container mx-auto px-6 max-w-3xl relative z-10">
            <h2 className="text-3xl font-playfair text-center mb-6">Frequently Asked Questions</h2>
            
            {/* Decorative flower divider */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-bloom-sage/30 rounded-full"></div>
              <Image 
                src="/images/flower no stem.svg" 
                alt="" 
                width={20} 
                height={20} 
                className="opacity-50"
              />
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-bloom-sage/30 rounded-full"></div>
            </div>
            <div className="space-y-4">
              {course.faq.map((item: any, index: number) => (
                <motion.details 
                  key={index} 
                  className="bg-gradient-to-br from-white to-bloom-sage-50/20 border border-bloom-sage/10 p-6 rounded-xl shadow-soft group hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <summary className="font-semibold cursor-pointer flex justify-between items-center text-bloom-dark group-hover:text-bloompink transition-colors">
                    {item.question}
                    <svg className="w-5 h-5 text-bloom-dark/40 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-4 text-bloom-dark/70">{item.answer}</p>
                </motion.details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section with Garden Theme */}
      <section className="py-20 relative overflow-hidden">
        {/* Animated garden elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 25, repeat: Infinity }}
            className="absolute top-10 right-10 text-6xl opacity-10"
          >
            🌻
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Infinity, delay: 8 }}
            className="absolute bottom-20 left-20 text-5xl opacity-10"
          >
            🌿
          </motion.div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-bloompink to-pink-400 rounded-2xl p-12 text-white shadow-2xl">
            <h2 className="text-4xl font-playfair mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl mb-8 opacity-90">
              {course.id === 'partner-support-bootcamp' 
                ? 'Join hundreds of partners who have found their path to wellness'
                : 'Join hundreds of moms who have found their path to wellness'
              }
            </p>
            <div className="flex items-baseline gap-2 justify-center mb-8">
              <span className="text-5xl font-bold">${course.price}</span>
              {course.originalPrice && (
                <span className="text-2xl opacity-70 line-through">${course.originalPrice}</span>
              )}
            </div>
            <Button 
              href={`/checkout?course=${course.id}`} 
              variant={course.id === 'partner-support-bootcamp' ? 'outline-white' : 'white'} 
              size="lg"
            >
              Enroll Now
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-bloom-sage-50">
        <div className="container mx-auto px-6">
          <NewsletterSignup 
            variant="banner"
            source="course_detail"
            className="max-w-4xl mx-auto"
          />
        </div>
      </section>
    </div>
  );
}