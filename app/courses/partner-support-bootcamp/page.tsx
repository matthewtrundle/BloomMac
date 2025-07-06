import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import CourseWaitlist from '@/components/ui/CourseWaitlist';

export const metadata: Metadata = {
  title: 'Partner Support Bootcamp | Bloom Psychology',
  description: 'Equip partners with knowledge and skills to provide meaningful support during the postpartum period. 2-week intensive course for caring partners.',
  keywords: [
    'partner support course',
    'postpartum partner help',
    'supporting new mom',
    'partner communication skills',
    'postpartum family support',
    'dad support course'
  ],
};

// Complete course data with detailed curriculum
const course = {
  id: 'partner-support-bootcamp',
  title: 'Partner Support Bootcamp',
  subtitle: 'For Partners Who Want to Help',
  description: 'Equip partners with the knowledge and skills to provide meaningful support during the postpartum period.',
  longDescription: `
    Watching your partner struggle with postpartum challenges can leave you feeling helpless and confused. You want to help, 
    but everything you try seems to make things worse. You're walking on eggshells, not knowing what to say or do.

    This intensive 2-week bootcamp gives you the practical tools and understanding you need to be the supportive partner 
    she desperately needs. Learn to recognize warning signs, communicate effectively, and provide practical support 
    that actually makes a difference in her recovery and your relationship.
  `,
  price: 97,
  originalPrice: 147,
  duration: '2 weeks',
  totalLessons: 8,
  totalHours: 2,
  instructor: {
    name: 'Dr. Jana Rundle',
    credentials: 'Licensed Psychologist, Certified Perinatal Mental Health Specialist',
    image: '/images/Team/Jana Rundle.jpg'
  },
  features: [
    '8 focused video lessons (12-18 minutes each)',
    'Practical communication scripts and templates',
    'Warning signs checklist and action plans',
    'Daily and weekly support task lists'
  ],
  outcomes: [
    'Recognize signs of postpartum depression and anxiety',
    'Communicate in ways that help, not hurt',
    'Provide practical support without being asked',
    'Know when and how to seek professional help',
    'Support her recovery while caring for yourself',
    'Strengthen your relationship during this transition'
  ],
  bonusMaterials: [
    'Quick Reference Guide (printable)',
    'Emergency Contact List Template',
    'Daily Support Checklist',
    'Partner Self-Care Guide'
  ],
  curriculum: [
    {
      week: 1,
      title: 'Understanding the Postpartum Experience',
      description: 'Learn what your partner is experiencing physically, emotionally, and mentally during the postpartum period.',
      lessons: [
        {
          number: 1,
          title: 'The Fourth Trimester Explained',
          duration: '15 min',
          type: 'video',
          description: 'Understanding the massive physical and emotional changes happening in the postpartum period.'
        },
        {
          number: 2,
          title: 'Normal vs. Concerning Signs',
          duration: '18 min',
          type: 'video',
          description: 'Learn to distinguish between baby blues, postpartum anxiety, depression, and when to worry.'
        },
        {
          number: 3,
          title: 'Why She\'s Not the Same Person',
          duration: '12 min',
          type: 'video',
          description: 'The science behind postpartum brain changes and why personality shifts are normal.'
        },
        {
          number: 4,
          title: 'Common Partner Mistakes',
          duration: '14 min',
          type: 'video',
          description: 'Well-meaning actions that actually make things worse and how to avoid them.'
        }
      ],
      workbook: 'Week 1 Workbook: Understanding Guide & Warning Signs Checklist',
      meditation: 'Self-Compassion Practice for Partners (10 min)'
    },
    {
      week: 2,
      title: 'Practical Support Strategies',
      description: 'Master specific communication techniques and support actions that make a real difference.',
      lessons: [
        {
          number: 5,
          title: 'Communication That Helps',
          duration: '16 min',
          type: 'video',
          description: 'Exact phrases to use and avoid, plus how to listen without trying to fix everything.'
        },
        {
          number: 6,
          title: 'Taking Initiative Without Being Asked',
          duration: '13 min',
          type: 'video',
          description: 'Anticipate needs and provide support before she has to ask for help.'
        },
        {
          number: 7,
          title: 'Supporting Her Recovery',
          duration: '15 min',
          type: 'video',
          description: 'Create an environment that promotes healing and reduces stress.'
        },
        {
          number: 8,
          title: 'When and How to Seek Help',
          duration: '17 min',
          type: 'video',
          description: 'Recognize crisis situations and navigate getting professional support together.'
        }
      ],
      workbook: 'Week 2 Workbook: Action Plans & Communication Scripts',
      meditation: 'Stress Relief for Overwhelmed Partners (8 min)'
    }
  ]
};

export default function PartnerSupportBootcampPage() {
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
                src="/images/optimized/biff01_imagine_mixed-race_parents_with_newborn_tender_family__1caa7f06-30ca-47c7-a1cd-038dc0cea487_1.webp"
                alt="Loving partners with newborn representing family support"
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
                  Dr. Jana understands that partners often feel helpless watching their loved one struggle. 
                  Through years of working with couples during the postpartum period, she's developed practical, 
                  actionable strategies that help partners provide meaningful support while maintaining their own well-being.
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
                courseId="partner-support-bootcamp"
                courseName="Partner Support Bootcamp"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}