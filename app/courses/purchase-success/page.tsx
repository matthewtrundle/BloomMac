'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

// Course data
const courseData: Record<string, any> = {
  'postpartum-wellness-foundations': {
    id: 'postpartum-wellness-foundations',
    title: 'Postpartum Wellness Foundations',
    subtitle: 'Your 6-Week Journey to Emotional Balance',
    duration: '6 weeks',
    modules: 6,
    image: '/images/optimized/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__1c12cc3c-cebd-47e2-ad9b-66b9bbca6480_0.webp',
  },
  'anxiety-management-new-moms': {
    id: 'anxiety-management-new-moms',
    title: 'Anxiety Management for New Moms',
    subtitle: 'Practical Tools for Peace of Mind',
    duration: '4 weeks',
    modules: 4,
    image: '/images/optimized/biff01_imagine_woman_in_meditation_pose_serene_environment_br_1f66e17b-a951-4d9f-b895-127fabc89208_1.webp',
  },
  'partner-support-bootcamp': {
    id: 'partner-support-bootcamp',
    title: 'Partner Support Bootcamp',
    subtitle: 'For Partners Who Want to Help',
    duration: '2 weeks',
    modules: 4,
    image: '/images/optimized/biff01_imagine_mixed-race_parents_with_newborn_tender_family__1caa7f06-30ca-47c7-a1cd-038dc0cea487_1.webp',
  }
};

function PurchaseSuccessContent() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('course_id') || searchParams.get('course');
  const sessionId = searchParams.get('session_id');
  const enrollmentId = searchParams.get('enrollment') || sessionId;
  
  const [course, setCourse] = useState<any>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  useEffect(() => {
    if (courseId && courseData[courseId]) {
      setCourse(courseData[courseId]);
    }
  }, [courseId]);

  const checkEmailSteps = () => {
    setIsCheckingEmail(true);
    // Simulate checking email process
    setTimeout(() => {
      setIsCheckingEmail(false);
    }, 2000);
  };

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Purchase confirmation not found</h1>
          <Link href="/courses" className="text-bloompink hover:underline">
            Browse courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50">
      {/* Celebration Header */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="celebration-dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="currentColor" className="text-bloompink" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#celebration-dots)" />
          </svg>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Success Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-playfair mb-6">
              <span className="text-bloom-dark">Welcome to Your </span>
              <span className="text-bloompink">Wellness Journey!</span>
            </h1>
            
            <p className="text-xl text-bloom-dark/80 mb-8">
              🎉 Congratulations! You've successfully enrolled in <strong>{course.title}</strong>
            </p>

            <div className="bg-white rounded-xl shadow-soft p-8 mb-8 max-w-2xl mx-auto">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold mb-1">{course.title}</h3>
                  <p className="text-bloom-dark/70">{course.subtitle}</p>
                  <p className="text-sm text-bloom-dark/50 mt-1">{course.duration} • {course.modules} modules</p>
                </div>
              </div>
              <div className="bg-bloom-sage-50 rounded-lg p-4">
                <p className="text-sm text-bloom-dark/70">
                  <strong>Enrollment ID:</strong> {enrollmentId}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Next Steps Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-playfair text-center mb-12">What Happens Next?</h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-bloompink rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">📧 Check Your Email</h3>
                <p className="text-bloom-dark/70 mb-4">
                  We've sent your login credentials to your email address. This usually arrives within a few minutes.
                </p>
                <button
                  onClick={checkEmailSteps}
                  disabled={isCheckingEmail}
                  className={`text-sm px-4 py-2 rounded-lg transition-colors ${
                    isCheckingEmail 
                      ? 'bg-gray-200 text-gray-500' 
                      : 'bg-bloom-sage-50 text-bloom-sage hover:bg-bloom-sage-100'
                  }`}
                >
                  {isCheckingEmail ? 'Checking...' : 'I checked my email ✓'}
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-bloom-sage rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">🔑 Access Your Portal</h3>
                <p className="text-bloom-dark/70 mb-4">
                  Use your login credentials to access your personal course portal and start your first lesson.
                </p>
                <Link
                  href="/my-courses"
                  className="text-sm px-4 py-2 bg-bloom-sage-50 text-bloom-sage rounded-lg hover:bg-bloom-sage-100 transition-colors inline-block"
                >
                  Go to My Courses →
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-bloom-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">🚀 Begin Your Journey</h3>
                <p className="text-bloom-dark/70 mb-4">
                  Start with Module 1 and progress at your own pace. Remember, you have lifetime access!
                </p>
                <div className="text-sm bg-bloom-accent-50 text-bloom-accent px-4 py-2 rounded-lg">
                  Self-paced learning
                </div>
              </motion.div>
            </div>

            {/* Email Troubleshooting */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg mb-8">
              <h3 className="font-semibold text-yellow-800 mb-2">📱 Don't see the email?</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Check your spam/junk folder</li>
                <li>• Add jana@bloompsychologynorthaustin.com to your contacts</li>
                <li>• Wait a few more minutes - emails can take up to 10 minutes</li>
                <li>• Contact us if you don't receive it within 30 minutes</li>
              </ul>
            </div>

            {/* Course Details */}
            <div className="bg-white rounded-xl shadow-soft p-8 mb-8">
              <h3 className="text-2xl font-playfair mb-6">Your Course Includes:</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-semibold">Video Lessons</h4>
                    <p className="text-sm text-bloom-dark/70">Bite-sized, practical video content</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-semibold">Workbooks & Resources</h4>
                    <p className="text-sm text-bloom-dark/70">Downloadable materials for each module</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-semibold">Lifetime Access</h4>
                    <p className="text-sm text-bloom-dark/70">Revisit materials anytime you need</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Section */}
            <div className="bg-gradient-to-r from-bloompink to-pink-400 rounded-xl p-8 text-white text-center">
              <h3 className="text-2xl font-playfair mb-4">I'm Here to Support You</h3>
              <p className="text-xl mb-6 opacity-90">
                "Remember, taking this step shows incredible strength. You're not just investing in yourself, 
                but in your family's wellbeing too."
              </p>
              <p className="font-medium">– Dr. Jana Rundle</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button href="mailto:jana@bloompsychology.com" variant="white" size="lg">
                  📧 Email Support
                </Button>
                <Button href="/my-courses" variant="outline-white" size="lg">
                  Access My Courses
                </Button>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="text-center mt-12">
              <p className="text-bloom-dark/60 mb-4">
                Ready to start your wellness journey?
              </p>
              <Link
                href="/my-courses"
                className="inline-flex items-center gap-2 bg-bloompink text-white px-8 py-4 rounded-lg font-semibold hover:bg-bloom-pink-dark transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                Go to My Courses
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default function PurchaseSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-8"></div>
              <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto mb-6"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <PurchaseSuccessContent />
    </Suspense>
  );
}