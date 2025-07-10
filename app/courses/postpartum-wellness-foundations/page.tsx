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
  totalLessons: 25,
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
      title: 'Understanding Your Fourth Trimester',
      description: 'Normalizing the postpartum experience through psychoeducation and validation.',
      lessons: [
        {
          number: 1,
          title: 'Welcome to Your Postpartum Journey',
          duration: '12 min',
          type: 'video',
          description: 'Introduces the "fourth trimester" concept and validates the complexity of postpartum adjustment.'
        },
        {
          number: 2,
          title: 'What\'s Normal vs. What\'s Not',
          duration: '14 min',
          type: 'video',
          description: 'Differentiates common postpartum experiences from signs that indicate need for additional support.'
        },
        {
          number: 3,
          title: 'The Science of Postpartum Changes',
          duration: '11 min',
          type: 'video',
          description: 'Explains neurobiological changes, hormones, and physical recovery to reduce self-blame.'
        },
        {
          number: 4,
          title: 'Honoring Your Experience',
          duration: '13 min',
          type: 'video',
          description: 'Validates the full range of emotions including ambivalence, grief, and joy using "both/and" thinking.'
        }
      ],
      workbook: 'Week 1 Workbook: Emotional Awareness Journal & "Normal vs. Concerning" Checklist',
      meditation: 'Grounding Meditation for New Moms (8 min)'
    },
    {
      week: 2,
      title: 'Cultivating Self-Compassion & Building Resilience',
      description: 'Developing psychological tools for emotional regulation and stress management.',
      lessons: [
        {
          number: 5,
          title: 'The Power of Self-Compassion',
          duration: '10 min',
          type: 'video',
          description: 'Based on Dr. Kristin Neff\'s research, learn to treat yourself with kindness.'
        },
        {
          number: 6,
          title: 'Releasing Perfectionism & Embracing "Good Enough"',
          duration: '12 min',
          type: 'video',
          description: 'Explores Winnicott\'s "good enough mother" concept and strategies for realistic standards.'
        },
        {
          number: 7,
          title: 'Stress Management for the Postpartum Nervous System',
          duration: '15 min',
          type: 'video',
          description: 'Evidence-based techniques for calming an overwhelmed nervous system in 30 seconds to 3 minutes.'
        },
        {
          number: 8,
          title: 'Emotional Regulation Through the Window of Tolerance',
          duration: '12 min',
          type: 'video',
          description: 'Dr. Dan Siegel\'s concept for managing hyperarousal and hypoarousal with DBT techniques.'
        },
        {
          number: 9,
          title: 'Creating Your Personalized Coping Toolkit',
          duration: '11 min',
          type: 'video',
          description: 'Build practical strategies tailored to your specific triggers and lifestyle.'
        }
      ],
      workbook: 'Week 2 Workbook: Self-Compassion Exercises & Personalized Coping Cards',
      meditation: 'Self-Compassion Break Meditation (10 min)'
    },
    {
      week: 3,
      title: 'Building Your Support Ecosystem',
      description: 'Creating sustainable support systems and improving key relationships.',
      lessons: [
        {
          number: 10,
          title: 'Mapping Your Support Needs & Resources',
          duration: '12 min',
          type: 'video',
          description: 'Identify specific support types needed and address barriers to asking for help.'
        },
        {
          number: 11,
          title: 'Strengthening Partnership During Transition',
          duration: '10 min',
          type: 'video',
          description: 'Gottman-based communication strategies for navigating relationship changes after baby.'
        },
        {
          number: 12,
          title: 'Setting Boundaries with Extended Family',
          duration: '11 min',
          type: 'video',
          description: 'Diplomatic scripts for common scenarios while honoring cultural considerations.'
        },
        {
          number: 13,
          title: 'Creating Your Village in Modern Times',
          duration: '13 min',
          type: 'video',
          description: 'Building community support through mom groups, online communities, and reciprocal systems.'
        }
      ],
      workbook: 'Week 3 Workbook: Support Network Mapping & Communication Scripts',
      meditation: 'Loving-Kindness Meditation for Connection (12 min)'
    },
    {
      week: 4,
      title: 'Understanding & Managing Postpartum Anxiety',
      description: 'Evidence-based strategies for anxiety and intrusive thoughts.',
      lessons: [
        {
          number: 14,
          title: 'The Anxious Postpartum Brain',
          duration: '11 min',
          type: 'video',
          description: 'Normalizes anxiety as evolutionary adaptation while identifying when it becomes problematic.'
        },
        {
          number: 15,
          title: 'Calming Your Nervous System',
          duration: '9 min',
          type: 'video',
          description: 'Polyvagal theory basics and vagus nerve stimulation techniques for rapid relief.'
        },
        {
          number: 16,
          title: 'Cognitive Strategies for Racing Thoughts',
          duration: '13 min',
          type: 'video',
          description: 'CBT techniques adapted for postpartum including thought challenging and worry time.'
        },
        {
          number: 17,
          title: 'Creating Calm in Chaos',
          duration: '10 min',
          type: 'video',
          description: 'Environmental modifications and routine adjustments to reduce anxiety triggers.'
        }
      ],
      workbook: 'Week 4 Workbook: Anxiety Trigger Log & Calm-Down Strategy Cards',
      meditation: 'Anxiety Relief Body Scan (10 min)'
    },
    {
      week: 5,
      title: 'Identity Integration & Matrescence',
      description: 'Navigating identity transformation and finding yourself within motherhood.',
      lessons: [
        {
          number: 18,
          title: 'Understanding Matrescence - Your Psychological Birth',
          duration: '12 min',
          type: 'video',
          description: 'Dr. Alexandra Sacks\' concept of matrescence as a developmental stage like adolescence.'
        },
        {
          number: 19,
          title: 'Grieving Who You Were',
          duration: '11 min',
          type: 'video',
          description: 'Processing losses of pre-baby self while birthing maternal identity without guilt.'
        },
        {
          number: 20,
          title: 'Integration - Both Mother AND Self',
          duration: '10 min',
          type: 'video',
          description: 'Strategies for maintaining individual identity within motherhood.'
        },
        {
          number: 21,
          title: 'Reconnecting with Your Core Values',
          duration: '13 min',
          type: 'video',
          description: 'ACT principles to identify values and align daily choices with what matters most.'
        }
      ],
      workbook: 'Week 5 Workbook: Identity Mapping & Values Clarification Worksheet',
      meditation: 'Identity Integration Meditation (11 min)'
    },
    {
      week: 6,
      title: 'Sustainable Wellness & Moving Forward',
      description: 'Creating lasting change and preparing for ongoing challenges.',
      lessons: [
        {
          number: 22,
          title: 'Celebrating Your Growth & Resilience',
          duration: '10 min',
          type: 'video',
          description: 'Reflects on journey and identifies strengths developed through adversity.'
        },
        {
          number: 23,
          title: 'Building Your Long-Term Wellness Plan',
          duration: '11 min',
          type: 'video',
          description: 'Creates sustainable self-care framework that evolves with baby\'s development.'
        },
        {
          number: 24,
          title: 'Preparing for Future Challenges',
          duration: '9 min',
          type: 'video',
          description: 'Anticipates common stressors and creates coping plans for long-term thriving.'
        },
        {
          number: 25,
          title: 'Your Continued Journey & Resources',
          duration: '12 min',
          type: 'video',
          description: 'Comprehensive resources and emphasis that seeking help is strength, not weakness.'
        }
      ],
      workbook: 'Week 6 Workbook: Wellness Plan Template & Letter to Future Self',
      meditation: 'Gratitude & Growth Meditation (10 min)'
    }
  ]
};

export default function PostpartumWellnessFoundationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative z-10">
        
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
              
              {/* Professional divider */}
              <div className="w-32 h-0.5 bg-bloom-sage/20 rounded-full mb-6"></div>
              
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