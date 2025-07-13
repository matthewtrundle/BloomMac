'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useCourseContent } from '@/lib/hooks/useCourseContent';
import Button from '@/components/ui/Button';
import NewsletterSignup from '@/components/ui/NewsletterSignup';
import CoursePurchaseButton from '@/components/ui/CoursePurchaseButton';

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;
  const { course, modules, loading, error } = useCourseContent(courseId);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedWeek, setExpandedWeek] = useState<number | null>(0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !course) {
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

  // Calculate totals from modules
  const totalLessons = modules?.reduce((sum, module) => sum + (module.course_lessons?.length || 0), 0) || 0;
  const totalModules = modules?.length || 0;

  // For now, use hardcoded course metadata since it's not in the database
  const courseMetadata: Record<string, any> = {
    'postpartum-wellness-foundations': {
      subtitle: 'Navigate your fourth trimester with confidence and support',
      longDescription: `Are you struggling to recognize yourself in the mirror? Feeling overwhelmed by the demands of motherhood while battling anxiety, mood swings, or a sense of loss? You're not alone, and you don't have to navigate this journey by yourself.

This transformative 6-week program combines evidence-based therapeutic techniques with practical strategies specifically designed for the unique challenges of postpartum life. Created by Dr. Jana Rundle, a licensed psychologist specializing in maternal mental health, this course provides the support and tools you need to thrive, not just survive.`,
      duration: '6 weeks',
      price: 297,
      originalPrice: 397,
      image: '/images/optimized/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__1c12cc3c-cebd-47e2-ad9b-66b9bbca6480_0.webp',
      instructor: {
        name: 'Dr. Jana Rundle',
        credentials: 'Licensed Psychologist, Certified Perinatal Mental Health Specialist',
        image: '/images/Team/Jana Rundle.jpg'
      },
      features: [
        {
          icon: '🎥',
          title: 'Video Lessons',
          description: '25 bite-sized video lessons (10-15 minutes each)'
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
        }
      ],
      bonuses: [
        'Emergency Coping Cards (printable)',
        'Partner Communication Guide',
        'Postpartum Meal Planning Template',
        'Sleep Optimization Checklist',
        'Return-to-Work Transition Guide'
      ],
      outcomes: [
        'Understand what\'s normal in the fourth trimester',
        'Develop healthy coping strategies for stress and overwhelm',
        'Build a strong support network',
        'Improve your sleep and self-care routines',
        'Enhance communication with your partner',
        'Increase confidence in your mothering abilities'
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
    }
  };

  const metadata = courseMetadata[courseId] || {};

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Professional */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50/10 via-white to-bloom-pink-50/10 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-bloom-pink-50/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50/20 rounded-full blur-3xl"></div>
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
              <div className="w-24 h-0.5 bg-bloom-pink mx-auto mb-6"></div>
              
              <p className="text-xl text-bloom-dark/80 mb-8">{metadata.subtitle || course.description}</p>
              
              <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{metadata.duration || '6 weeks'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>{totalModules} modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>{totalLessons} lessons</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-bloom-pink">${metadata.price || 297}</span>
                  {metadata.originalPrice && (
                    <span className="text-xl text-bloom-dark/40 line-through">${metadata.originalPrice}</span>
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
                    ? 'text-blue-600 border-blue-600' 
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
                    {metadata.longDescription ? 
                      metadata.longDescription.split('\n\n').map((paragraph: string, index: number) => (
                        <p key={index} className="mb-4">{paragraph}</p>
                      ))
                      : <p>{course.description}</p>
                    }
                  </div>
                  
                  {metadata.features && (
                    <>
                      <h3 className="text-2xl font-playfair mt-12 mb-6">What's Included</h3>
                      <div className="grid sm:grid-cols-2 gap-6">
                        {metadata.features.map((feature: any, index: number) => (
                          <div key={index} className="flex gap-4">
                            <div className="text-3xl">{feature.icon}</div>
                            <div>
                              <h4 className="font-semibold mb-1">{feature.title}</h4>
                              <p className="text-sm text-bloom-dark/70">{feature.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {metadata.outcomes && (
                    <>
                      <h3 className="text-2xl font-playfair mt-12 mb-6">What You'll Learn</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {metadata.outcomes.map((outcome: string, index: number) => (
                          <div key={index} className="flex items-start gap-3">
                            <svg className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-bloom-dark">{outcome}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {metadata.bonuses && (
                    <>
                      <h3 className="text-2xl font-playfair mt-12 mb-6">Bonus Materials</h3>
                      <ul className="space-y-2">
                        {metadata.bonuses.map((bonus: string, index: number) => (
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
                  <div className="bg-gradient-to-br from-white to-blue-50/20 rounded-xl shadow-xl border border-blue-100 p-6 sticky top-24">
                    <div className="text-center mb-6">
                      <div className="flex items-baseline gap-2 justify-center mb-4">
                        <span className="text-4xl font-bold text-bloom-pink">${metadata.price || 297}</span>
                        {metadata.originalPrice && (
                          <span className="text-xl text-bloom-dark/40 line-through">${metadata.originalPrice}</span>
                        )}
                      </div>
                      <div className="w-full">
                        <button
                          disabled
                          className="w-full py-3 rounded-lg font-medium bg-gray-100 text-gray-500 cursor-not-allowed mb-4"
                        >
                          Coming Soon
                        </button>
                        <p className="text-xs text-center text-bloom-dark/60">
                          Launching July 2025
                        </p>
                      </div>
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
              
              {/* Professional divider */}
              <div className="w-24 h-0.5 bg-bloom-pink mx-auto mb-8"></div>
              
              <div className="max-w-3xl mx-auto">
                {modules && modules.map((module, index) => (
                  <div key={module.id} className="mb-4">
                    <button
                      onClick={() => setExpandedWeek(expandedWeek === index ? null : index)}
                      className="w-full bg-gradient-to-br from-white to-blue-50/20 border border-blue-100 rounded-lg shadow-soft p-6 text-left hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-lg">Week {module.week_number}: {module.title}</h3>
                          <p className="text-sm text-bloom-dark/60 mt-1">{module.course_lessons?.length || 0} lessons</p>
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
                    
                    {expandedWeek === index && module.course_lessons && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-blue-50 rounded-b-lg px-6 py-4 mt-2"
                      >
                        <ul className="space-y-3">
                          {module.course_lessons.map((lesson) => (
                            <li key={lesson.id} className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-sm font-medium text-blue-600">{lesson.lesson_number}</span>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-bloom-dark">{lesson.title}</h4>
                                <p className="text-sm text-bloom-dark/70 mt-1">{lesson.description}</p>
                                {lesson.video_duration_minutes && (
                                  <p className="text-xs text-bloom-dark/50 mt-1">{lesson.video_duration_minutes} minutes</p>
                                )}
                              </div>
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
          {activeTab === 'instructor' && metadata.instructor && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-gradient-to-br from-white to-blue-50/20 border border-blue-100 rounded-xl shadow-soft p-8 md:p-12">
                <div className="grid md:grid-cols-3 gap-8 items-center">
                  <div className="md:col-span-1">
                    <Image
                      src={metadata.instructor.image}
                      alt={metadata.instructor.name}
                      width={300}
                      height={300}
                      className="rounded-xl shadow-lg mx-auto"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <h2 className="text-3xl font-playfair mb-2">{metadata.instructor.name}</h2>
                    <p className="text-bloom-dark/70 mb-6">{metadata.instructor.credentials}</p>
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

      {/* FAQ Section */}
      {metadata.faq && (
        <section className="py-16 bg-gradient-to-b from-white to-blue-50/10 relative overflow-hidden">
          <div className="container mx-auto px-6 max-w-3xl relative z-10">
            <h2 className="text-3xl font-playfair text-center mb-6">Frequently Asked Questions</h2>
            
            {/* Professional divider */}
            <div className="w-24 h-0.5 bg-bloom-pink mx-auto mb-8"></div>
            <div className="space-y-4">
              {metadata.faq.map((item: any, index: number) => (
                <motion.details 
                  key={index} 
                  className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 group hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <summary className="font-semibold cursor-pointer flex justify-between items-center text-bloom-dark group-hover:text-blue-600 transition-colors">
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50/10 to-bloom-pink-50/10 relative overflow-hidden">
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-bloom-pink to-pink-400 rounded-2xl p-12 text-white shadow-2xl">
            <h2 className="text-4xl font-playfair mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join hundreds of moms who have found their path to wellness
            </p>
            <div className="flex items-baseline gap-2 justify-center mb-8">
              <span className="text-5xl font-bold">${metadata.price || 297}</span>
              {metadata.originalPrice && (
                <span className="text-2xl opacity-70 line-through">${metadata.originalPrice}</span>
              )}
            </div>
            <div>
              <button
                disabled
                className="px-8 py-3 rounded-lg font-medium bg-white/20 text-white border border-white/30 cursor-not-allowed"
              >
                Coming Soon
              </button>
              <p className="text-sm mt-2 opacity-70">
                Launching July 2025
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-blue-50">
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