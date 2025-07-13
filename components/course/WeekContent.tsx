'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { PlayCircle, FileText, Headphones, Users } from 'lucide-react';
import { useCourseContent } from '@/lib/hooks/useCourseContent';
import MeditationPlayer from '@/components/course/MeditationPlayer';

interface WeekContentProps {
  courseSlug: string;
  weekNumber: number;
}

export default function WeekContent({ courseSlug, weekNumber }: WeekContentProps) {
  const { course, module, loading, error } = useCourseContent(courseSlug, weekNumber);

  // Get meditation details for each week
  const getMeditationDetails = (weekNum: number) => {
    const meditations = {
      1: { title: "Grounding Practice for New Moms", duration: "8:47" },
      2: { title: "Self-Compassion Break", duration: "10:00" },
      3: { title: "Loving-Kindness for Connection", duration: "12:00" },
      4: { title: "Anxiety Relief Body Scan", duration: "10:00" },
      5: { title: "Identity Integration Meditation", duration: "11:00" },
      6: { title: "Gratitude & Growth Celebration", duration: "10:00" }
    };
    return meditations[weekNum as keyof typeof meditations] || { title: "Weekly Meditation", duration: "10:00" };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bloompink"></div>
      </div>
    );
  }

  if (error || !module || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Content not found'}</p>
          <Link href="/my-courses" className="text-bloompink hover:underline">
            Back to My Courses
          </Link>
        </div>
      </div>
    );
  }

  const lessons = module.course_lessons || [];

  // Week-specific resources based on master course document
  const getWeekResources = (weekNum: number) => {
    const weekResources: Record<number, any[]> = {
      1: [
        {
          icon: FileText,
          title: 'Week 1 Workbook',
          description: 'Emotional Awareness Journal & "Normal vs. Concerning" Checklist',
          link: '/resources/week1-workbook.pdf'
        },
        {
          icon: Headphones,
          title: 'Grounding Meditation',
          description: 'Grounding Meditation for New Moms (8 min)',
          link: '/resources/week1-meditation.mp3'
        },
        {
          icon: Users,
          title: 'Community Forum',
          description: 'Connect with other moms in Week 1',
          link: '/community/week1'
        }
      ],
      2: [
        {
          icon: FileText,
          title: 'Week 2 Workbook',
          description: 'Self-Compassion Exercises & Personalized Coping Cards',
          link: '/resources/week2-workbook.pdf'
        },
        {
          icon: Headphones,
          title: 'Self-Compassion Break Meditation',
          description: 'Dr. Kristin Neff\'s self-compassion protocol for mothers (10 min)',
          link: '/resources/week2-meditation.mp3'
        },
        {
          icon: Users,
          title: 'Community Forum',
          description: 'Share your self-compassion journey',
          link: '/community/week2'
        }
      ],
      3: [
        {
          icon: FileText,
          title: 'Week 3 Workbook',
          description: 'Support Network Mapping & Communication Scripts',
          link: '/resources/week3-workbook.pdf'
        },
        {
          icon: Headphones,
          title: 'Connection Meditation',
          description: 'Loving-Kindness Meditation for Connection (12 min)',
          link: '/resources/week3-meditation.mp3'
        },
        {
          icon: Users,
          title: 'Community Forum',
          description: 'Building your support ecosystem',
          link: '/community/week3'
        }
      ],
      4: [
        {
          icon: FileText,
          title: 'Week 4 Workbook',
          description: 'Anxiety Trigger Log & Calm-Down Strategy Cards',
          link: '/resources/week4-workbook.pdf'
        },
        {
          icon: Headphones,
          title: 'Anxiety Relief Meditation',
          description: 'Anxiety Relief Body Scan (10 min)',
          link: '/resources/week4-meditation.mp3'
        },
        {
          icon: Users,
          title: 'Community Forum',
          description: 'Managing anxiety together',
          link: '/community/week4'
        }
      ],
      5: [
        {
          icon: FileText,
          title: 'Week 5 Workbook',
          description: 'Identity Mapping & Values Clarification Worksheet',
          link: '/resources/week5-workbook.pdf'
        },
        {
          icon: Headphones,
          title: 'Identity Integration Meditation',
          description: 'Identity Integration Meditation (11 min)',
          link: '/resources/week5-meditation.mp3'
        },
        {
          icon: Users,
          title: 'Community Forum',
          description: 'Exploring identity and matrescence',
          link: '/community/week5'
        }
      ],
      6: [
        {
          icon: FileText,
          title: 'Week 6 Workbook',
          description: 'Wellness Plan Template & Letter to Future Self',
          link: '/resources/week6-workbook.pdf'
        },
        {
          icon: Headphones,
          title: 'Gratitude & Growth Meditation',
          description: 'Gratitude & Growth Meditation (10 min)',
          link: '/resources/week6-meditation.mp3'
        },
        {
          icon: Users,
          title: 'Community Forum',
          description: 'Celebrating your journey',
          link: '/community/week6'
        }
      ]
    };
    
    return weekResources[weekNum] || [
      {
        icon: FileText,
        title: `Week ${weekNum} Workbook`,
        description: 'Course materials and exercises',
        link: `/resources/week${weekNum}-workbook.pdf`
      },
      {
        icon: Headphones,
        title: 'Guided Meditation',
        description: 'Weekly meditation practice',
        link: `/resources/week${weekNum}-meditation.mp3`
      },
      {
        icon: Users,
        title: 'Community Forum',
        description: 'Connect with other moms',
        link: `/community/week${weekNum}`
      }
    ];
  };
  
  const resources = getWeekResources(weekNumber);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-bloom-pink-50 relative overflow-hidden">
      {/* Modern gradient shapes background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-bloom-pink-light rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 relative z-10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link 
                href="/wellness-hub"
                className="text-bloom-dark/70 hover:text-bloom-dark mb-2 inline-flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to My Growth Studio
              </Link>
              <h1 className="text-3xl font-playfair text-bloom-dark">
                Week {module.week_number}: {module.title}
              </h1>
              <p className="text-bloom-dark/70 mt-2">{module.description}</p>
              
              {/* Learning Objectives */}
              {module.objectives && module.objectives.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                  <h3 className="font-semibold mb-2 text-bloom-dark flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Learning Objectives:
                  </h3>
                  <ul className="list-disc list-inside text-bloom-dark/70 space-y-1 ml-7">
                    {module.objectives.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lessons */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-6">Lessons</h2>
            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={lesson.is_published 
                      ? `/course/${courseSlug}/week/${weekNumber}/lesson/${lesson.lesson_number}` 
                      : '#'}
                    className={`block bg-white border border-gray-200 rounded-xl shadow-sm p-6 transition-all group ${
                      lesson.is_published 
                        ? 'hover:shadow-lg hover:-translate-y-1 hover:border-blue-200 cursor-pointer' 
                        : 'opacity-70 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full transition-colors ${
                        lesson.is_published 
                          ? 'bg-blue-100 group-hover:bg-blue-200' 
                          : 'bg-gray-100'
                      }`}>
                        <PlayCircle className={`w-6 h-6 ${
                          lesson.is_published 
                            ? 'text-blue-600' 
                            : 'text-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold mb-1">
                              Lesson {lesson.lesson_number}: {lesson.title}
                            </h3>
                            <p className="text-bloom-dark/70 mb-3">
                              {lesson.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-bloom-dark/60">
                              <span>{lesson.video_duration_minutes || 0} minutes</span>
                              {lesson.slides_html && (
                                <>
                                  <span>•</span>
                                  <span>Includes slides</span>
                                </>
                              )}
                              {lesson.is_published && (
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                  Available Now
                                </span>
                              )}
                            </div>
                          </div>
                          {!lesson.is_published && (
                            <span className="bg-bloom-pink-light text-bloom-pink px-3 py-1 rounded-full text-sm">
                              Coming Soon
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Week {weekNumber} Resources</h2>
            <div className="space-y-4">
              {resources.map((resource, index) => (
                <motion.div
                  key={resource.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {resource.title === 'Guided Meditation' ? (
                    <MeditationPlayer
                      audioUrl={`https://utetcmirepwdxbtrcczv.supabase.co/storage/v1/object/public/meditations/week${weekNumber}-meditation.mp3`}
                      title={getMeditationDetails(weekNumber).title}
                      duration={getMeditationDetails(weekNumber).duration}
                      weekNumber={weekNumber}
                    />
                  ) : (
                    <Link
                      href={resource.link}
                      className="block bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-lg hover:-translate-y-1 hover:border-blue-200 transition-all duration-300 group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-bloom-pink-light rounded-full group-hover:bg-bloom-pink/20 transition-colors">
                          <resource.icon className="w-6 h-6 text-bloom-pink group-hover:text-bloom-pink-dark transition-colors" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">{resource.title}</h3>
                          <p className="text-sm text-bloom-dark/70">{resource.description}</p>
                        </div>
                      </div>
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Progress Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-2">Your Progress</h3>
              <div className="mb-4">
                <div className="bg-white/20 rounded-full h-3 mb-2">
                  <div className="bg-white rounded-full h-3 w-0 transition-all"></div>
                </div>
                <p className="text-sm opacity-90">0 of {lessons.length} lessons completed</p>
              </div>
              <p className="text-sm opacity-80">
                Complete all lessons to unlock your Week {weekNumber} certificate!
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}