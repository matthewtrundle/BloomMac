'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, PlayCircle, FileText, Clock, Lock, CheckCircle, ChevronRight, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCourseContent } from '@/lib/hooks/useCourseContent';

export default function WeekOverviewPage() {
  const params = useParams();
  const courseSlug = params.courseSlug as string;
  const weekNumber = parseInt(params.weekNumber as string);
  
  const { course, module, loading, error } = useCourseContent(courseSlug, weekNumber);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading week content...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !module || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600">Failed to load week content</p>
            <Link href="/my-courses" className="mt-4 inline-flex items-center text-pink-600 hover:text-pink-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to My Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const lessons = module.course_lessons || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link 
              href="/my-courses"
              className="inline-flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Course
            </Link>
            
            <div className="text-center">
              <h1 className="text-3xl font-playfair font-bold text-gray-800">
                Week {weekNumber}: {module.title}
              </h1>
              <p className="text-gray-600 mt-2">{course.title}</p>
            </div>
            
            <div className="w-32"></div>
          </div>
        </div>
      </div>

      {/* Week Description */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-8 mb-8"
          >
            <h2 className="text-2xl font-semibold mb-4">Week Overview</h2>
            <p className="text-gray-700 leading-relaxed">{module.description}</p>
            
            {module.objectives && module.objectives.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Learning Objectives</h3>
                <ul className="space-y-2">
                  {module.objectives.map((objective: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>

          {/* Lessons */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Lessons</h2>
            {lessons.map((lesson: any, index: number) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/course/${courseSlug}/week/${weekNumber}/lesson/${lesson.lesson_number}`}
                  className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-sm font-semibold text-pink-600">
                            Lesson {lesson.lesson_number}
                          </span>
                          {lesson.video_duration_minutes && (
                            <span className="flex items-center gap-1 text-sm text-gray-500">
                              <Clock className="w-4 h-4" />
                              {lesson.video_duration_minutes} min
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {lesson.title}
                        </h3>
                        
                        {lesson.description && (
                          <p className="text-gray-600 line-clamp-2">
                            {lesson.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 mt-4">
                          {lesson.video_url && (
                            <span className="flex items-center gap-2 text-sm text-gray-500">
                              <PlayCircle className="w-4 h-4" />
                              Video
                            </span>
                          )}
                          {lesson.slides_html && (
                            <span className="flex items-center gap-2 text-sm text-gray-500">
                              <FileText className="w-4 h-4" />
                              Slides
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="ml-6">
                        {lesson.is_preview ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            Free Preview
                          </span>
                        ) : lesson.is_published ? (
                          <ChevronRight className="w-6 h-6 text-gray-400" />
                        ) : (
                          <Lock className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Week Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-8"
          >
            <h3 className="text-xl font-semibold mb-4">Week {weekNumber} Resources</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="#" className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                <FileText className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                <span className="text-sm font-medium">Workbook</span>
              </Link>
              <Link href="#" className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                <PlayCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <span className="text-sm font-medium">Guided Meditation</span>
              </Link>
              <Link href="#" className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                <Users className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <span className="text-sm font-medium">Community Forum</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}