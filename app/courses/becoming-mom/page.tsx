'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';

export default function BecomingMomCoursePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      checkEnrollment();
    }
  }, [user]);

  const checkEnrollment = async () => {
    try {
      const response = await fetch('/api/courses/becoming-mom', {
        headers: {
          'Authorization': `Bearer ${user?.access_token || ''}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setIsEnrolled(data.isEnrolled);
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      router.push('/auth/signup?redirect=/courses/becoming-mom');
      return;
    }

    setEnrolling(true);
    setError(null);

    try {
      const response = await fetch('/api/courses/becoming-mom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access_token || ''}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setIsEnrolled(true);
        router.push('/courses/becoming-mom/lessons');
      } else {
        setError(data.error || 'Failed to enroll');
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  const lessons = [
    {
      number: 1,
      title: "You're Not Alone",
      description: "Understanding the universality of the postpartum experience",
      duration: "10 min"
    },
    {
      number: 2,
      title: "Your Body, Your Mind",
      description: "The science behind postpartum changes",
      duration: "10 min"
    },
    {
      number: 3,
      title: "Building Your Village",
      description: "Creating and accepting support",
      duration: "10 min"
    },
    {
      number: 4,
      title: "Your Path Forward",
      description: "Next steps and resources for continued growth",
      duration: "10 min"
    }
  ];

  const resources = [
    {
      title: "Quick Self-Care Guide",
      description: "5-minute self-care activities for busy moms",
      icon: "❤️"
    },
    {
      title: "Support Network Worksheet",
      description: "Map out your support system and identify gaps",
      icon: "👥"
    },
    {
      title: "Warning Signs Checklist",
      description: "Know when to seek professional help",
      icon: "⚠️"
    },
    {
      title: "Partner Communication Guide",
      description: "Scripts for difficult conversations",
      icon: "💬"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            {/* Back to Courses */}
            <Link 
              href="/courses"
              className="inline-flex items-center gap-2 text-bloom-dark/60 hover:text-bloom-dark mb-8 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Courses
            </Link>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  FREE COURSE
                </div>
                
                <h1 className="text-5xl font-playfair mb-4">
                  <span className="text-bloom-dark">Becoming Mom:</span>
                  <br />
                  <span className="text-bloompink">Your Introduction to Postpartum Wellness</span>
                </h1>
                
                <p className="text-xl text-bloom-dark/80 mb-8">
                  A gentle introduction to understanding and navigating the emotional journey of new motherhood. 
                  Perfect for expecting mothers or those in their first year postpartum.
                </p>

                <div className="flex flex-wrap gap-6 mb-8 text-bloom-dark/70">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>40 minutes total</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>4 video lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Workbook included</span>
                  </div>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  {isEnrolled ? (
                    <Link
                      href="/courses/becoming-mom/lessons"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-bloom-sage text-white rounded-lg hover:bg-bloom-sage/90 transition-colors text-lg font-medium"
                    >
                      Continue to Lessons
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {enrolling ? 'Enrolling...' : 'Start Free Course'}
                      {!enrolling && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      )}
                    </button>
                  )}
                  
                  {!user && !authLoading && (
                    <p className="text-sm text-bloom-dark/60">
                      Already have an account? 
                      <Link href="/auth/login" className="text-bloom-sage hover:underline ml-1">
                        Sign in
                      </Link>
                    </p>
                  )}
                </div>
              </div>

              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/optimized/biff01_Mother_holding_baby_looking_out_window_at_sunrise_hope_7f2de060-da80-41fa-8c95-705189ef01be_1.webp"
                    alt="Mother holding baby looking out window"
                    width={600}
                    height={400}
                    className="w-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-20 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-playfair text-center mb-12">What You'll Learn</h2>
            
            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <motion.div
                  key={lesson.number}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-r from-bloom-sage-50/30 to-transparent rounded-xl p-6 border border-bloom-sage/10"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-bloom-sage/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-bloom-sage font-semibold">{lesson.number}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-bloom-dark mb-2">{lesson.title}</h3>
                      <p className="text-bloom-dark/70">{lesson.description}</p>
                    </div>
                    <span className="text-sm text-bloom-dark/50">{lesson.duration}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Resources Included */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-playfair text-center mb-12">Resources Included</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {resources.map((resource, index) => (
                <motion.div
                  key={resource.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{resource.icon}</span>
                    <div>
                      <h3 className="font-semibold text-bloom-dark mb-1">{resource.title}</h3>
                      <p className="text-sm text-bloom-dark/70">{resource.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Perfect For Section */}
      <section className="py-20 bg-bloom-sage-50/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl font-playfair mb-12">This Course is Perfect For You If...</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-bloom-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">You're Expecting</h3>
                <p className="text-sm text-bloom-dark/70">Prepare for the emotional journey ahead</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-bloom-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">You're a New Mom</h3>
                <p className="text-sm text-bloom-dark/70">Navigate your first year with confidence</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-bloom-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">You're Curious</h3>
                <p className="text-sm text-bloom-dark/70">Learn more about our approach to wellness</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl font-playfair mb-6">Ready to Begin?</h2>
            <p className="text-xl text-bloom-dark/80 mb-8">
              Take the first step in your postpartum wellness journey. 
              No commitment, no credit card, just support when you need it.
            </p>
            
            {isEnrolled ? (
              <Link
                href="/courses/becoming-mom/lessons"
                className="inline-flex items-center gap-2 px-8 py-4 bg-bloom-sage text-white rounded-lg hover:bg-bloom-sage/90 transition-colors text-lg font-medium"
              >
                Go to Lessons
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {enrolling ? 'Enrolling...' : 'Start Your Free Course Now'}
                {!enrolling && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                )}
              </button>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}