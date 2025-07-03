'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

interface Lesson {
  number: number;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
  progress: number;
}

export default function BecomingMomLessonsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      number: 1,
      title: "You're Not Alone",
      description: "Understanding the universality of the postpartum experience",
      duration: "10 min",
      completed: false,
      progress: 0
    },
    {
      number: 2,
      title: "Your Body, Your Mind",
      description: "The science behind postpartum changes",
      duration: "10 min",
      completed: false,
      progress: 0
    },
    {
      number: 3,
      title: "Building Your Village",
      description: "Creating and accepting support",
      duration: "10 min",
      completed: false,
      progress: 0
    },
    {
      number: 4,
      title: "Your Path Forward",
      description: "Next steps and resources for continued growth",
      duration: "10 min",
      completed: false,
      progress: 0
    }
  ]);
  const [loading, setLoading] = useState(true);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=/courses/becoming-mom/lessons');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchProgress();
    }
  }, [user]);

  const fetchProgress = async () => {
    try {
      const response = await fetch('/api/courses/becoming-mom/progress', {
        headers: {
          'Authorization': `Bearer ${user?.access_token || ''}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Update lesson progress
          const updatedLessons = lessons.map(lesson => {
            const progressData = data.progress.find((p: any) => p.lesson_id === `lesson-${lesson.number}`);
            return {
              ...lesson,
              completed: progressData?.completed || false,
              progress: progressData?.progress_percentage || 0
            };
          });
          setLessons(updatedLessons);
          setOverallProgress(data.overallProgress);
        }
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bloom-sage mx-auto"></div>
          <p className="mt-4 text-bloom-dark/60">Loading your lessons...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-bloom-sage/10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/courses/becoming-mom"
                className="text-bloom-dark/60 hover:text-bloom-dark transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-2xl font-playfair text-bloom-dark">Becoming Mom</h1>
                <p className="text-sm text-bloom-dark/60">Your Introduction to Postpartum Wellness</p>
              </div>
            </div>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-bloom-sage-50 text-bloom-sage rounded-lg hover:bg-bloom-sage-100 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <section className="py-8 bg-white/50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-bloom-sage/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-bloom-dark">Your Progress</h2>
                <span className="text-sm font-medium text-bloom-sage bg-bloom-sage/10 px-3 py-1 rounded-full">
                  {overallProgress}% Complete
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-bloom-sage to-bloompink"
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <p className="text-sm text-bloom-dark/60 mt-2">
                {lessons.filter(l => l.completed).length} of {lessons.length} lessons completed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lessons List */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {lessons.map((lesson, index) => (
              <motion.div
                key={lesson.number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${
                  lesson.completed ? 'ring-2 ring-green-400' : ''
                }`}>
                  <div className="flex items-stretch">
                    {/* Lesson Number */}
                    <div className={`w-24 flex items-center justify-center ${
                      lesson.completed 
                        ? 'bg-gradient-to-br from-green-400 to-green-500' 
                        : 'bg-gradient-to-br from-bloom-sage to-bloom-sage/80'
                    }`}>
                      <div className="text-white text-center">
                        <div className="text-3xl font-bold">{lesson.number}</div>
                        <div className="text-xs uppercase tracking-wider">Lesson</div>
                      </div>
                    </div>

                    {/* Lesson Content */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-bloom-dark mb-2">
                            {lesson.title}
                            {lesson.completed && (
                              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Completed
                              </span>
                            )}
                          </h3>
                          <p className="text-bloom-dark/70 mb-4">{lesson.description}</p>
                          
                          <div className="flex items-center gap-6 text-sm text-bloom-dark/60">
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{lesson.duration}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              <span>Video lesson</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span>Workbook</span>
                            </div>
                          </div>

                          {lesson.progress > 0 && !lesson.completed && (
                            <div className="mt-4">
                              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-bloom-sage to-bloompink"
                                  style={{ width: `${lesson.progress}%` }}
                                />
                              </div>
                              <p className="text-xs text-bloom-dark/60 mt-1">{lesson.progress}% complete</p>
                            </div>
                          )}
                        </div>

                        {/* Action Button */}
                        <div className="ml-6 flex flex-col gap-2">
                          <Link
                            href={`/courses/becoming-mom/lessons/${lesson.number}`}
                            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 text-center ${
                              lesson.completed
                                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                : lesson.progress > 0
                                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                                : 'bg-bloom-sage text-white hover:bg-bloom-sage/90'
                            }`}
                          >
                            {lesson.completed ? 'Review' : lesson.progress > 0 ? 'Continue' : 'Start'}
                          </Link>
                          <Link
                            href={`/courses/becoming-mom/lessons/${lesson.number}/workbook`}
                            className="px-6 py-2 border border-bloom-sage text-bloom-sage rounded-lg hover:bg-bloom-sage/5 transition-colors text-sm text-center"
                          >
                            Workbook
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Resources Section */}
          <div className="max-w-4xl mx-auto mt-12">
            <div className="bg-bloom-sage-50/30 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-bloom-dark mb-4">Course Resources</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <a 
                  href="/resources/becoming-mom/self-care-guide.pdf"
                  className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                >
                  <span className="text-2xl">❤️</span>
                  <div>
                    <h4 className="font-medium text-bloom-dark">Quick Self-Care Guide</h4>
                    <p className="text-sm text-bloom-dark/60">5-minute activities for busy moms</p>
                  </div>
                </a>
                <a 
                  href="/resources/becoming-mom/support-worksheet.pdf"
                  className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                >
                  <span className="text-2xl">👥</span>
                  <div>
                    <h4 className="font-medium text-bloom-dark">Support Network Worksheet</h4>
                    <p className="text-sm text-bloom-dark/60">Map your support system</p>
                  </div>
                </a>
                <a 
                  href="/resources/becoming-mom/warning-signs.pdf"
                  className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                >
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <h4 className="font-medium text-bloom-dark">Warning Signs Checklist</h4>
                    <p className="text-sm text-bloom-dark/60">Know when to seek help</p>
                  </div>
                </a>
                <a 
                  href="/resources/becoming-mom/partner-guide.pdf"
                  className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                >
                  <span className="text-2xl">💬</span>
                  <div>
                    <h4 className="font-medium text-bloom-dark">Partner Communication Guide</h4>
                    <p className="text-sm text-bloom-dark/60">Scripts for conversations</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}