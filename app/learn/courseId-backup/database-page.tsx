'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, ChevronRight, ChevronDown, FileText, BookOpen, Award, Clock, CheckCircle } from 'lucide-react';
import { useCourseContent } from '@/lib/hooks/useCourseContent';

interface LessonProgress {
  [key: string]: boolean;
}

export default function CourseLearnDatabasePage() {
  const params = useParams();
  const router = useRouter();
  const courseSlug = params.courseId as string;
  
  // Fetch course and all modules
  const { course, modules, loading, error } = useCourseContent(courseSlug);
  
  const [currentWeekNumber, setCurrentWeekNumber] = useState(1);
  const [currentLessonNumber, setCurrentLessonNumber] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch current module and lesson details
  const { 
    module: currentModule, 
    lesson: currentLesson 
  } = useCourseContent(courseSlug, currentWeekNumber, currentLessonNumber);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('course_auth_token');
    if (!token) {
      router.push('/my-courses');
      return;
    }
    setIsAuthenticated(true);
  }, [router]);

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem(`course_progress_${courseSlug}`);
    if (savedProgress) {
      setLessonProgress(JSON.parse(savedProgress));
    }
  }, [courseSlug]);

  const markLessonComplete = (lessonId: string) => {
    const newProgress = { ...lessonProgress, [lessonId]: true };
    setLessonProgress(newProgress);
    localStorage.setItem(`course_progress_${courseSlug}`, JSON.stringify(newProgress));
  };

  const navigateToLesson = (weekNumber: number, lessonNumber: number) => {
    setCurrentWeekNumber(weekNumber);
    setCurrentLessonNumber(lessonNumber);
  };

  const calculateProgress = () => {
    if (!modules) return 0;
    const totalLessons = modules.reduce((sum, mod) => sum + (mod.course_lessons?.length || 0), 0);
    const completedLessons = Object.keys(lessonProgress).filter(key => lessonProgress[key]).length;
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bloompink mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course content...</p>
        </div>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{course.title}</h1>
                <p className="text-sm text-gray-500">
                  {currentModule && currentLesson && (
                    <>Week {currentWeekNumber}, Lesson {currentLessonNumber}</>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-bloompink h-2 rounded-full transition-all duration-300"
                    style={{ width: `${calculateProgress()}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600">{calculateProgress()}%</span>
              </div>
              <Link
                href="/my-courses"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Exit Course
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-white shadow-lg overflow-hidden`}>
          <div className="p-4 h-[calc(100vh-4rem)] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Course Content</h2>
            
            {modules.map((module) => (
              <div key={module.id} className="mb-4">
                <button
                  onClick={() => setCurrentWeekNumber(module.week_number)}
                  className={`w-full text-left p-3 rounded-lg transition-colors flex items-center justify-between ${
                    currentWeekNumber === module.week_number
                      ? 'bg-bloom-sage-50 text-bloom-sage-dark'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div>
                    <h3 className="font-medium">Week {module.week_number}</h3>
                    <p className="text-sm text-gray-600">{module.title}</p>
                  </div>
                  {currentWeekNumber === module.week_number ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                
                {currentWeekNumber === module.week_number && module.course_lessons && (
                  <div className="mt-2 pl-4 space-y-1">
                    {module.course_lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => navigateToLesson(module.week_number, lesson.lesson_number)}
                        className={`w-full text-left p-2 rounded-md text-sm flex items-center space-x-2 transition-colors ${
                          currentLessonNumber === lesson.lesson_number && currentWeekNumber === module.week_number
                            ? 'bg-bloompink text-white'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {lessonProgress[lesson.id] ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                        <span className="flex-1">{lesson.title}</span>
                        {lesson.video_duration_minutes && (
                          <span className="text-xs opacity-75">{lesson.video_duration_minutes}m</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {currentLesson && currentModule ? (
            <motion.div
              key={currentLesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Lesson Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {currentLesson.title}
                </h2>
                <p className="text-lg text-gray-600">{currentLesson.description}</p>
                <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {currentLesson.video_duration_minutes || 0} minutes
                  </span>
                  <span className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-1" />
                    Week {currentWeekNumber}, Lesson {currentLessonNumber}
                  </span>
                </div>
              </div>

              {/* Video Player Area */}
              {currentLesson.video_url ? (
                <div className="bg-black rounded-lg overflow-hidden mb-8 aspect-video">
                  <video
                    controls
                    className="w-full h-full"
                    src={currentLesson.video_url}
                    onEnded={() => markLessonComplete(currentLesson.id)}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <div className="bg-gray-200 rounded-lg overflow-hidden mb-8 aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Video content coming soon</p>
                  </div>
                </div>
              )}

              {/* Lesson Content Tabs */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="border-b">
                  <nav className="flex space-x-8 px-6">
                    {currentLesson.slides_html && (
                      <button className="py-4 px-1 border-b-2 border-bloompink font-medium text-sm text-bloompink">
                        Slides
                      </button>
                    )}
                    {currentLesson.transcript && (
                      <button className="py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700">
                        Transcript
                      </button>
                    )}
                    <button className="py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700">
                      Resources
                    </button>
                  </nav>
                </div>

                <div className="p-6">
                  {currentLesson.slides_html ? (
                    <div 
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: currentLesson.slides_html }}
                    />
                  ) : (
                    <p className="text-gray-600">No additional content available for this lesson.</p>
                  )}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={() => {
                    // Navigate to previous lesson
                    if (currentLessonNumber > 1) {
                      setCurrentLessonNumber(currentLessonNumber - 1);
                    } else if (currentWeekNumber > 1) {
                      setCurrentWeekNumber(currentWeekNumber - 1);
                      // Set to last lesson of previous week
                      const prevModule = modules.find(m => m.week_number === currentWeekNumber - 1);
                      if (prevModule && prevModule.course_lessons) {
                        setCurrentLessonNumber(prevModule.course_lessons.length);
                      }
                    }
                  }}
                  disabled={currentWeekNumber === 1 && currentLessonNumber === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous Lesson
                </button>

                <button
                  onClick={() => markLessonComplete(currentLesson.id)}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    lessonProgress[currentLesson.id]
                      ? 'bg-green-600 text-white'
                      : 'bg-bloompink text-white hover:bg-bloom-pink-dark'
                  }`}
                >
                  {lessonProgress[currentLesson.id] ? 'Completed' : 'Mark as Complete'}
                </button>

                <button
                  onClick={() => {
                    // Navigate to next lesson
                    const currentModuleLessons = currentModule.course_lessons || [];
                    if (currentLessonNumber < currentModuleLessons.length) {
                      setCurrentLessonNumber(currentLessonNumber + 1);
                    } else if (currentWeekNumber < modules.length) {
                      setCurrentWeekNumber(currentWeekNumber + 1);
                      setCurrentLessonNumber(1);
                    }
                  }}
                  disabled={
                    currentWeekNumber === modules.length && 
                    currentLessonNumber === (currentModule.course_lessons?.length || 0)
                  }
                  className="px-4 py-2 bg-bloom-sage text-white rounded-lg hover:bg-bloom-sage-dark disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Lesson
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Select a lesson from the sidebar to begin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}