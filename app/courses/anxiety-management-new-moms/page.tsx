import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import CourseWaitlist from '@/components/ui/CourseWaitlist';

export const metadata: Metadata = {
  title: 'Anxiety Management for New Moms Course | Bloom Psychology',
  description: 'Learn evidence-based techniques to manage postpartum anxiety and worry. 4-week self-paced program with practical tools for peace of mind.',
  keywords: [
    'postpartum anxiety course',
    'new mom anxiety help',
    'anxiety management techniques',
    'maternal anxiety support',
    'online anxiety therapy',
    'postpartum mental health'
  ],
};

// Complete course data with detailed curriculum
const course = {
  id: 'anxiety-management-new-moms',
  title: 'Anxiety Management for New Moms',
  subtitle: 'Practical Tools for Peace of Mind',
  description: 'Learn evidence-based techniques to manage postpartum anxiety and worry, specifically designed for the unique challenges of new motherhood.',
  longDescription: `
    Racing thoughts keeping you up at night? Constant worry about your baby's safety? Physical symptoms like racing heart or shortness of breath? 
    You're not alone. Postpartum anxiety affects up to 20% of new mothers, yet it's often overlooked and undertreated.

    This focused 4-week program teaches you practical, evidence-based techniques to manage anxiety while caring for your baby. 
    Each technique is designed to be used in real-time - during feedings, diaper changes, or those 3 AM worry sessions. 
    Learn to reclaim your peace of mind and enjoy motherhood.
  `,
  price: 127,
  originalPrice: 197,
  duration: '4 weeks',
  totalLessons: 16,
  totalHours: 2.5,
  instructor: {
    name: 'Dr. Jana Rundle',
    credentials: 'Licensed Psychologist, Certified Perinatal Mental Health Specialist',
    image: '/images/Team/Jana Rundle.jpg'
  },
  features: [
    '16 focused video lessons (8-12 minutes each)',
    'Downloadable anxiety tracking worksheets',
    'Quick relief technique cards for your phone',
    'Progressive audio relaxation exercises'
  ],
  outcomes: [
    'Recognize and understand your anxiety patterns',
    'Master breathing techniques for instant calm',
    'Challenge and change anxious thought patterns',
    'Build long-term resilience and coping strategies',
    'Sleep better despite racing thoughts',
    'Feel more confident in your mothering abilities'
  ],
  bonusMaterials: [
    'Anxiety Emergency Toolkit (printable cards)',
    'Partner Communication Guide for Anxiety',
    'Sleep Hygiene Checklist for Anxious Minds',
    'Nutrition Guide for Anxiety Management'
  ],
  curriculum: [
    {
      week: 1,
      title: 'Understanding Postpartum Anxiety',
      description: 'Learn what postpartum anxiety really is and how it affects new mothers differently than general anxiety.',
      lessons: [
        {
          number: 1,
          title: 'What is Postpartum Anxiety?',
          duration: '10 min',
          type: 'video',
          description: 'Understanding the difference between normal new parent worry and postpartum anxiety.'
        },
        {
          number: 2,
          title: 'Physical Symptoms and Triggers',
          duration: '12 min',
          type: 'video',
          description: 'Recognizing how anxiety shows up in your body and identifying your personal triggers.'
        },
        {
          number: 3,
          title: 'The Anxiety-Sleep Cycle',
          duration: '9 min',
          type: 'video',
          description: 'How anxiety disrupts sleep and creates a vicious cycle of exhaustion and worry.'
        },
        {
          number: 4,
          title: 'Creating Your Anxiety Profile',
          duration: '8 min',
          type: 'video',
          description: 'Mapping your unique anxiety patterns to create targeted strategies.'
        }
      ],
      workbook: 'Week 1 Workbook: Anxiety Assessment & Pattern Recognition',
      meditation: 'Basic Grounding Meditation for New Moms (10 min)'
    },
    {
      week: 2,
      title: 'Calming Techniques That Work',
      description: 'Master proven techniques that can be used anytime, anywhere to calm your nervous system.',
      lessons: [
        {
          number: 5,
          title: 'The Power of Breath',
          duration: '11 min',
          type: 'video',
          description: 'Learn 4-7-8 breathing and other techniques that work during feeding, pumping, or baby care.'
        },
        {
          number: 6,
          title: 'Progressive Muscle Relaxation',
          duration: '15 min',
          type: 'video',
          description: 'Release physical tension with this adapted technique perfect for tired new moms.'
        },
        {
          number: 7,
          title: 'Grounding Techniques for Panic',
          duration: '8 min',
          type: 'video',
          description: 'The 5-4-3-2-1 technique and other grounding methods for when anxiety peaks.'
        },
        {
          number: 8,
          title: 'Creating Your Calm Toolkit',
          duration: '10 min',
          type: 'video',
          description: 'Build a personalized collection of techniques that work for your lifestyle.'
        }
      ],
      workbook: 'Week 2 Workbook: Technique Practice Guide & Emergency Cards',
      meditation: 'Quick Calm Meditation for Overwhelming Moments (8 min)'
    },
    {
      week: 3,
      title: 'Changing Anxious Thoughts',
      description: 'Learn cognitive techniques to challenge catastrophic thinking and build realistic perspectives.',
      lessons: [
        {
          number: 9,
          title: 'Catching Anxious Thoughts',
          duration: '12 min',
          type: 'video',
          description: 'How to notice and identify the thoughts that fuel your anxiety.'
        },
        {
          number: 10,
          title: 'The Worry Window Technique',
          duration: '9 min',
          type: 'video',
          description: 'Contain your worrying to specific times instead of letting it consume your day.'
        },
        {
          number: 11,
          title: 'Fact vs. Fear Checking',
          duration: '11 min',
          type: 'video',
          description: 'Challenge catastrophic thoughts with evidence-based reality checking.'
        },
        {
          number: 12,
          title: 'Building Balanced Thoughts',
          duration: '10 min',
          type: 'video',
          description: 'Replace anxious thoughts with realistic, balanced perspectives.'
        }
      ],
      workbook: 'Week 3 Workbook: Thought Challenge Worksheets & Perspective Building',
      meditation: 'Loving-Kindness Meditation for Self-Compassion (12 min)'
    },
    {
      week: 4,
      title: 'Building Long-Term Resilience',
      description: 'Create sustainable practices for managing anxiety and preventing future episodes.',
      lessons: [
        {
          number: 13,
          title: 'Sleep Strategies for Anxious Minds',
          duration: '14 min',
          type: 'video',
          description: 'Improve sleep quality and break the anxiety-insomnia cycle.'
        },
        {
          number: 14,
          title: 'Nutrition and Anxiety Connection',
          duration: '10 min',
          type: 'video',
          description: 'Foods that help or hurt anxiety, plus practical eating strategies for busy moms.'
        },
        {
          number: 15,
          title: 'Movement as Medicine',
          duration: '8 min',
          type: 'video',
          description: 'Simple exercises and movement that reduce anxiety without requiring gym time.'
        },
        {
          number: 16,
          title: 'Your Anxiety Action Plan',
          duration: '12 min',
          type: 'video',
          description: 'Create a personalized plan for maintaining your progress and handling setbacks.'
        }
      ],
      workbook: 'Week 4 Workbook: Personal Action Plan & Maintenance Strategies',
      meditation: 'Body Scan for Deep Relaxation (15 min)'
    }
  ]
};

export default function AnxietyManagementCoursePage() {
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
                src="/images/optimized/biff01_imagine_woman_in_meditation_pose_serene_environment_br_1f66e17b-a951-4d9f-b895-127fabc89208_1.webp"
                alt="Peaceful woman in meditation representing anxiety relief"
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
            
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
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
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
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
            
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
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
                  Dr. Jana specializes in postpartum anxiety and has helped hundreds of mothers find peace and confidence. 
                  She understands that anxiety can make you feel like you're failing as a mother, when in reality, 
                  you're a caring parent who deserves support and practical tools that actually work in real life.
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
                courseId="anxiety-management-new-moms"
                courseName="Anxiety Management for New Moms"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}