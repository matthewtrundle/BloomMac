import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import CourseWaitlist from '@/components/ui/CourseWaitlist';

export const metadata: Metadata = {
  title: 'Postpartum Wellness Foundations Course | Bloom Psychology',
  description: 'A comprehensive 6-week program for new mothers navigating the fourth trimester. Evidence-based support with video lessons, workbooks, and community.',
  keywords: [
    'postpartum course',
    'new mother support',
    'fourth trimester help',
    'postpartum wellness',
    'maternal mental health course',
    'online postpartum therapy'
  ],
};

// Complete course data with detailed curriculum
const course = {
  id: 'postpartum-wellness-foundations',
  title: 'Postpartum Wellness Foundations',
  subtitle: 'Navigate your fourth trimester with confidence and support',
  description: 'A comprehensive 6-week program designed specifically for new mothers navigating the challenges of postpartum life.',
  longDescription: `
    This evidence-based course provides practical tools and emotional support for mothers in their fourth trimester. 
    Learn to understand normal postpartum changes, develop healthy coping strategies, build strong support networks, 
    and increase your confidence in mothering.
  `,
  price: 297,
  originalPrice: 397,
  duration: '6 weeks',
  totalLessons: 24,
  totalHours: 4.5,
  instructor: {
    name: 'Dr. Jana Rundle',
    credentials: 'Licensed Psychologist, Certified Perinatal Mental Health Specialist',
    image: '/images/Team/Jana Rundle.jpg'
  },
  features: [
    '24 bite-sized video lessons (10-15 minutes each)',
    'Downloadable PDF workbooks for each module',
    'Guided meditations and exercises for on-the-go'
  ],
  outcomes: [
    'Understand what\'s normal in the fourth trimester',
    'Develop healthy coping strategies for stress and overwhelm',
    'Build a strong support network',
    'Improve your sleep and self-care routines',
    'Enhance communication with your partner',
    'Increase confidence in your mothering abilities'
  ],
  bonusMaterials: [
    'Emergency Coping Cards (printable)',
    'Partner Communication Guide',
    'Postpartum Meal Planning Template',
    'Sleep Optimization Checklist',
    'Return-to-Work Transition Guide'
  ],
  curriculum: [
    {
      week: 1,
      title: 'Understanding Postpartum Emotions',
      description: 'Learn what\'s normal in the postpartum period and gain clarity about your emotional experience.',
      lessons: [
        {
          number: 1,
          title: 'Welcome to Your Postpartum Journey',
          duration: '12 min',
          type: 'video',
          description: 'Understanding this life transition and setting realistic expectations.'
        },
        {
          number: 2,
          title: 'What\'s Normal vs. What\'s Not',
          duration: '14 min',
          type: 'video',
          description: 'Recognizing typical postpartum emotions and when to seek additional support.'
        },
        {
          number: 3,
          title: 'The Science of Postpartum Changes',
          duration: '11 min',
          type: 'video',
          description: 'How your body and brain are adjusting to this new phase of life.'
        },
        {
          number: 4,
          title: 'Honoring Your Experience',
          duration: '13 min',
          type: 'video',
          description: 'Validating your feelings and learning to trust your intuition.'
        }
      ],
      workbook: 'Week 1 Workbook: Emotional Awareness & Self-Assessment',
      meditation: 'Grounding Meditation for New Moms (8 min)'
    },
    {
      week: 2,
      title: 'Building Coping Strategies',
      description: 'Develop practical tools to manage stress, overwhelm, and difficult emotions.',
      lessons: [
        {
          number: 5,
          title: 'Stress Management Essentials',
          duration: '15 min',
          type: 'video',
          description: 'Simple techniques you can use anytime, anywhere to calm your nervous system.'
        },
        {
          number: 6,
          title: 'Emotional Regulation Tools',
          duration: '12 min',
          type: 'video',
          description: 'Practical strategies for managing big emotions when they arise.'
        },
        {
          number: 7,
          title: 'Mindfulness for Busy Moms',
          duration: '13 min',
          type: 'video',
          description: 'Quick mindfulness practices that fit into your daily routine.'
        },
        {
          number: 8,
          title: 'Creating Your Coping Toolkit',
          duration: '11 min',
          type: 'video',
          description: 'Building a personalized set of go-to strategies for difficult moments.'
        }
      ],
      workbook: 'Week 2 Workbook: Your Personal Coping Strategy Guide',
      meditation: 'Quick Calm Meditation for Overwhelming Moments (10 min)'
    },
    {
      week: 3,
      title: 'Creating Self-Care Routines',
      description: 'Design realistic self-care practices that actually fit into your life as a new mom.',
      lessons: [
        {
          number: 9,
          title: 'Redefining Self-Care',
          duration: '14 min',
          type: 'video',
          description: 'What self-care really looks like when you have a baby.'
        },
        {
          number: 10,
          title: 'Micro Self-Care Moments',
          duration: '12 min',
          type: 'video',
          description: 'Tiny acts of care you can do throughout your day.'
        },
        {
          number: 11,
          title: 'Physical Wellness Basics',
          duration: '13 min',
          type: 'video',
          description: 'Simple ways to support your body while caring for your baby.'
        },
        {
          number: 12,
          title: 'Building Sustainable Routines',
          duration: '11 min',
          type: 'video',
          description: 'Creating flexible self-care practices that work with your schedule.'
        }
      ],
      workbook: 'Week 3 Workbook: Your Personalized Self-Care Plan',
      meditation: 'Self-Compassion Meditation (12 min)'
    },
    {
      week: 4,
      title: 'Strengthening the Mother-Baby Bond',
      description: 'Build confidence in your relationship with your baby and trust your maternal instincts.',
      lessons: [
        {
          number: 13,
          title: 'Understanding Attachment',
          duration: '15 min',
          type: 'video',
          description: 'How bonding really works and why it\'s okay if it takes time.'
        },
        {
          number: 14,
          title: 'Reading Your Baby\'s Cues',
          duration: '12 min',
          type: 'video',
          description: 'Learning to understand and respond to your baby\'s needs.'
        },
        {
          number: 15,
          title: 'Building Confidence as a Mother',
          duration: '10 min',
          type: 'video',
          description: 'Trusting yourself and developing your unique parenting style.'
        },
        {
          number: 16,
          title: 'Creating Special Moments',
          duration: '13 min',
          type: 'video',
          description: 'Simple ways to connect with your baby throughout the day.'
        }
      ],
      workbook: 'Week 4 Workbook: Bonding Activities & Confidence Building',
      meditation: 'Mother-Baby Connection Meditation (9 min)'
    },
    {
      week: 5,
      title: 'Support Systems & Communication',
      description: 'Learn to ask for help and build the support network you need.',
      lessons: [
        {
          number: 17,
          title: 'Communicating Your Needs',
          duration: '14 min',
          type: 'video',
          description: 'How to express what you need from your partner, family, and friends.'
        },
        {
          number: 18,
          title: 'Asking for Help',
          duration: '11 min',
          type: 'video',
          description: 'Overcoming barriers to seeking and accepting support.'
        },
        {
          number: 19,
          title: 'Building Your Village',
          duration: '15 min',
          type: 'video',
          description: 'Finding and connecting with other new moms and support resources.'
        },
        {
          number: 20,
          title: 'Setting Healthy Boundaries',
          duration: '12 min',
          type: 'video',
          description: 'Protecting your energy and time while maintaining relationships.'
        }
      ],
      workbook: 'Week 5 Workbook: Support Network Mapping & Communication Scripts',
      meditation: 'Boundary Setting Meditation (8 min)'
    },
    {
      week: 6,
      title: 'Moving Forward with Confidence',
      description: 'Create a sustainable plan for ongoing wellness and continued growth.',
      lessons: [
        {
          number: 21,
          title: 'Celebrating Your Progress',
          duration: '13 min',
          type: 'video',
          description: 'Recognizing how far you\'ve come and building on your strengths.'
        },
        {
          number: 22,
          title: 'Planning for Challenges',
          duration: '14 min',
          type: 'video',
          description: 'Preparing for difficult days and knowing when to seek additional help.'
        },
        {
          number: 23,
          title: 'Long-term Wellness Strategies',
          duration: '12 min',
          type: 'video',
          description: 'Creating habits that will support you beyond the postpartum period.'
        },
        {
          number: 24,
          title: 'Your Continued Journey',
          duration: '15 min',
          type: 'video',
          description: 'Planning for ongoing growth and maintaining your wellness practices.'
        }
      ],
      workbook: 'Week 6 Workbook: Your Personal Wellness Action Plan',
      meditation: 'Confidence & Gratitude Meditation (10 min)'
    }
  ]
};

export default function PostpartumWellnessFoundationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50 relative overflow-hidden">
      {/* Garden lattice pattern background */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="wellness-lattice" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M0,5 L10,5 M5,0 L5,10" stroke="currentColor" strokeWidth="0.5" className="text-bloom-sage"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#wellness-lattice)" />
        </svg>
      </div>
      
      {/* Floating garden elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-3 h-3 bg-pink-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-32 left-20 w-2 h-2 bg-bloom-sage/30 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-yellow-300 rounded-full opacity-15 animate-pulse"></div>
      </div>
      {/* Hero Section with Garden Theme */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-bloom-pink-50/30 via-transparent to-bloom-sage-50/20"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <Link 
                href="/courses"
                className="inline-flex items-center text-bloom-dark/60 hover:text-bloom-dark mb-6 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Courses
              </Link>
              
              <h1 className="text-4xl md:text-5xl font-playfair text-bloom-dark mb-4">
                {course.title}
              </h1>
              
              {/* Decorative flower divider */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-bloom-sage/30 rounded-full"></div>
                <Image 
                  src="/images/flower no stem.svg" 
                  alt="" 
                  width={24} 
                  height={24} 
                  className="opacity-50"
                />
                <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-bloom-sage/30 rounded-full"></div>
              </div>
              
              <p className="text-xl text-bloom-dark/80 mb-6">
                {course.subtitle}
              </p>
              <p className="text-lg text-bloom-dark/70 mb-8">
                {course.description}
              </p>
              
              {/* Course Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-2xl font-bold text-bloompink">{course.totalLessons}</div>
                  <div className="text-sm text-bloom-dark/70">Video Lessons</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-2xl font-bold text-bloom-sage">{course.totalHours}h</div>
                  <div className="text-sm text-bloom-dark/70">Total Content</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-2xl font-bold text-bloom-cream-dark">{course.duration}</div>
                  <div className="text-sm text-bloom-dark/70">Duration</div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gradient-to-br from-white to-bloom-sage-50/20 border border-bloom-sage/10 p-6 rounded-xl shadow-soft mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-bold text-bloom-dark">${course.price}</span>
                  <span className="text-xl text-bloom-dark/50 line-through">${course.originalPrice}</span>
                  <span className="bg-bloompink text-white px-3 py-1 rounded-full text-sm font-medium">
                    Save ${course.originalPrice - course.price}
                  </span>
                </div>
                <button
                  disabled
                  className="w-full bg-gray-100 text-gray-500 py-4 px-6 rounded-full font-medium text-lg cursor-not-allowed"
                >
                  Coming Soon - July 2025
                </button>
                <p className="text-xs text-center mt-2 text-bloom-dark/60">
                  Join the waitlist below for early access
                </p>
              </div>
            </div>
            
            <div className="relative">
              <Image
                src="/images/optimized/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__1c12cc3c-cebd-47e2-ad9b-66b9bbca6480_0.webp"
                alt="Peaceful mother and baby representing postpartum wellness"
                width={600}
                height={500}
                className="rounded-2xl shadow-xl w-full h-auto"
                priority
              />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-bloom-sage/20 rounded-full blur-2xl"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-bloompink/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-12">
              What's Included
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {course.features.map((feature, index) => (
                <div key={index} className="bg-gradient-to-br from-white to-bloom-sage-50/20 border border-bloom-sage/10 p-6 rounded-xl shadow-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-bloom-sage mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-bloom-dark">{feature}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Complete Curriculum */}
      <section className="py-20 px-4 bg-white/80 backdrop-blur-sm relative z-10">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-12">
              Complete Curriculum
            </h2>
            
            <div className="space-y-6">
              {course.curriculum.map((week, weekIndex) => (
                <div key={week.week} className="bg-gradient-to-br from-white to-bloom-sage-50/20 border border-bloom-sage/10 rounded-2xl shadow-soft overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="bg-gradient-to-r from-bloompink to-bloom-pink-dark p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">
                          Week {week.week}: {week.title}
                        </h3>
                        <p className="text-white/90 text-sm">{week.description}</p>
                      </div>
                      <div className="text-white/80 text-sm">
                        {week.lessons.length} lessons
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {/* Lessons */}
                    <div className="space-y-3 mb-6">
                      {week.lessons.map((lesson) => (
                        <div key={lesson.number} className="flex items-start gap-4 p-3 rounded-lg hover:bg-bloom-sage-50/30 transition-all duration-300 group cursor-pointer">
                          <div className="w-8 h-8 bg-bloom-sage-50 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-bloom-sage-100 transition-colors">
                            <svg className="w-4 h-4 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1M9 7l3 3 3-3" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-bloom-dark">{lesson.title}</h4>
                              <span className="text-sm text-bloom-dark/60">{lesson.duration}</span>
                            </div>
                            <p className="text-sm text-bloom-dark/70">{lesson.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Week Materials */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-bloom-cream-50/50 rounded-lg">
                        <svg className="w-5 h-5 text-bloom-cream-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm font-medium text-bloom-dark">{week.workbook}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-bloom-sage-50/50 rounded-lg">
                        <svg className="w-5 h-5 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                        <span className="text-sm font-medium text-bloom-dark">{week.meditation}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Learning Outcomes */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-12">
              What You'll Learn
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {course.outcomes.map((outcome, index) => (
                <div key={index} className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-bloompink mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-bloom-dark">{outcome}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bonus Materials */}
      <section className="py-20 px-4 bg-gradient-to-br from-bloom-sage-50/30 to-white relative z-10">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-12">
              Bonus Materials
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {course.bonusMaterials.map((material, index) => (
                <div key={index} className="bg-gradient-to-br from-white to-bloom-sage-50/20 border border-bloom-sage/10 p-6 rounded-xl shadow-soft border-l-4 border-bloompink hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-bloompink mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-bloom-dark mb-1">{material}</h3>
                      <p className="text-sm text-bloom-dark/70">Instant download included</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Instructor */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-playfair text-center text-bloom-dark mb-12">
              Meet Your Instructor
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <Image
                  src={course.instructor.image}
                  alt={course.instructor.name}
                  width={400}
                  height={500}
                  className="rounded-2xl shadow-xl w-full h-auto"
                />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-bloom-dark mb-2">
                  {course.instructor.name}
                </h3>
                <p className="text-bloom-dark/70 mb-6">
                  {course.instructor.credentials}
                </p>
                <p className="text-bloom-dark/80 leading-relaxed">
                  Dr. Jana specializes in helping mothers navigate the unique challenges of the postpartum period. 
                  With years of experience in maternal mental health, she understands the overwhelming nature of 
                  new motherhood and provides compassionate, evidence-based support to help mothers thrive.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-bloom-pink-50 to-bloom-sage-50 relative z-10">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-playfair text-bloom-dark mb-6">
              Be the First to Know When We Launch
            </h2>
            <p className="text-xl text-bloom-dark/70 mb-8">
              Join the waitlist for early access and special launch pricing.
            </p>
            <div className="max-w-md mx-auto">
              <CourseWaitlist 
                courseId="postpartum-wellness-foundations"
                courseName="Postpartum Wellness Foundations"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}