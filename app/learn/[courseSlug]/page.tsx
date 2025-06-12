'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, Clock, Users, Award, PlayCircle, Lock } from 'lucide-react';
import { useCourseContent } from '@/lib/hooks/useCourseContent';
import { useParams } from 'next/navigation';

export default function CourseOverviewPage() {
  const params = useParams();
  const courseSlug = params.courseSlug as string;
  const { course, modules, loading, error } = useCourseContent(courseSlug);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bloompink"></div>
      </div>
    );
  }

  if (error || !course || !modules) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Course not found'}</p>
          <Link href="/my-courses" className="text-bloompink hover:underline">
            Back to My Courses
          </Link>
        </div>
      </div>
    );
  }

  const totalLessons = modules.reduce((acc, mod) => acc + (mod.course_lessons?.length || 0), 0);
  const totalDuration = modules.reduce((acc, mod) => {
    const modDuration = mod.course_lessons?.reduce((lessonAcc, lesson) => 
      lessonAcc + (lesson.video_duration_minutes || 0), 0) || 0;
    return acc + modDuration;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-bloom-sage to-bloom-sage-dark text-white py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <h1 className="text-4xl md:text-5xl font-playfair mb-4">{course.title}</h1>
            <p className="text-xl opacity-90 mb-8">{course.description}</p>
            
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>{modules.length} Weeks</span>
              </div>
              <div className="flex items-center gap-2">
                <PlayCircle className="w-5 h-5" />
                <span>{totalLessons} Lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{Math.round(totalDuration / 60)} Hours</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span>Certificate Included</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Course Modules */}
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-playfair mb-8">Course Curriculum</h2>
        
        <div className="space-y-6">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-soft overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">
                      Week {module.week_number}: {module.title}
                    </h3>
                    <p className="text-gray-600">{module.description}</p>
                  </div>
                  
                  {module.is_published ? (
                    <Link
                      href={`/course/week${module.week_number}`}
                      className="btn-primary text-sm"
                    >
                      Start Week
                    </Link>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-400">
                      <Lock className="w-4 h-4" />
                      <span className="text-sm">Coming Soon</span>
                    </div>
                  )}
                </div>

                {/* Lessons Preview */}
                {module.course_lessons && module.course_lessons.length > 0 && (
                  <div className="border-t pt-4 mt-4">
                    <div className="grid md:grid-cols-2 gap-3">
                      {module.course_lessons.map((lesson) => (
                        <div 
                          key={lesson.id}
                          className="flex items-center gap-3 text-sm"
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            lesson.is_published ? 'bg-bloom-sage-100' : 'bg-gray-100'
                          }`}>
                            <span className="text-xs font-medium">
                              {lesson.lesson_number}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className={lesson.is_published ? '' : 'text-gray-400'}>
                              {lesson.title}
                            </p>
                            {lesson.video_duration_minutes && (
                              <p className="text-xs text-gray-500">
                                {lesson.video_duration_minutes} min
                              </p>
                            )}
                          </div>
                          {lesson.is_preview && lesson.is_published && (
                            <span className="bg-bloom-pink-light text-bloom-pink text-xs px-2 py-1 rounded-full">
                              Free Preview
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Course Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 bg-gradient-to-br from-bloom-sage-50 to-white rounded-xl p-8"
        >
          <h3 className="text-2xl font-semibold mb-6">What's Included</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-bloom-sage-100 rounded-full">
                <PlayCircle className="w-6 h-6 text-bloom-sage" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Video Lessons</h4>
                <p className="text-sm text-gray-600">
                  Expert-led video content for each lesson
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-3 bg-bloom-sage-100 rounded-full">
                <BookOpen className="w-6 h-6 text-bloom-sage" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Workbooks</h4>
                <p className="text-sm text-gray-600">
                  Downloadable exercises and reflections
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-3 bg-bloom-sage-100 rounded-full">
                <Users className="w-6 h-6 text-bloom-sage" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Community Support</h4>
                <p className="text-sm text-gray-600">
                  Connect with other course participants
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}