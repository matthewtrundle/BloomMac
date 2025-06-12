'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import CourseAccessGuard from '@/components/auth/CourseAccessGuard';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Loader2, ChevronLeft, ChevronRight, CheckCircle, PlayCircle, FileText, Home, BookOpen } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: string;
  video_url?: string;
  video_script?: string;
  html_slides?: string;
  order_index: number;
}

interface Week {
  id: string;
  week_number: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  weeks: Week[];
}

export default function CourseLearnPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showTranscript, setShowTranscript] = useState(false);
  const [lessonProgress, setLessonProgress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadCourseContent = async () => {
      if (!user) return;

      try {
        // Load course with weeks and lessons
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select(`
            *,
            course_weeks (
              *,
              course_lessons (
                *
              )
            )
          `)
          .eq('id', courseId)
          .single();

        if (courseError) throw courseError;

        // Transform data structure
        const transformedCourse: Course = {
          id: courseData.id,
          title: courseData.title,
          description: courseData.description,
          weeks: courseData.course_weeks
            .sort((a: any, b: any) => a.week_number - b.week_number)
            .map((week: any) => ({
              id: week.id,
              week_number: week.week_number,
              title: week.title,
              description: week.description,
              lessons: week.course_lessons
                .sort((a: any, b: any) => a.order_index - b.order_index)
            }))
        };

        setCourse(transformedCourse);

        // Load user progress
        const { data: progressData } = await supabase
          .from('user_lesson_progress')
          .select('lesson_id, completed')
          .eq('user_id', user.id)
          .eq('completed', true);

        if (progressData) {
          const progress: Record<string, boolean> = {};
          progressData.forEach(item => {
            progress[item.lesson_id] = true;
          });
          setLessonProgress(progress);
        }

        // Set first lesson as current if none selected
        if (transformedCourse.weeks.length > 0 && transformedCourse.weeks[0].lessons.length > 0) {
          setCurrentLesson(transformedCourse.weeks[0].lessons[0]);
        }

      } catch (error) {
        console.error('Error loading course:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCourseContent();
  }, [courseId, user]);

  const markLessonComplete = async (lessonId: string) => {
    if (!user) return;

    try {
      // Check if progress record exists
      const { data: existing } = await supabase
        .from('user_lesson_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .single();

      if (existing) {
        // Update existing record
        await supabase
          .from('user_lesson_progress')
          .update({ completed: true, completed_at: new Date().toISOString() })
          .eq('id', existing.id);
      } else {
        // Create new record
        await supabase
          .from('user_lesson_progress')
          .insert({
            user_id: user.id,
            lesson_id: lessonId,
            course_id: courseId,
            completed: true,
            completed_at: new Date().toISOString()
          });
      }

      setLessonProgress(prev => ({ ...prev, [lessonId]: true }));
    } catch (error) {
      console.error('Error marking lesson complete:', error);
    }
  };

  const getCompletionPercentage = () => {
    if (!course) return 0;
    const totalLessons = course.weeks.reduce((acc, week) => acc + week.lessons.length, 0);
    const completedLessons = Object.values(lessonProgress).filter(Boolean).length;
    return Math.round((completedLessons / totalLessons) * 100);
  };

  if (loading) {
    return (
      <CourseAccessGuard courseId={courseId}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-bloompink mx-auto mb-4" />
            <p className="text-bloom-dark/60">Loading course content...</p>
          </div>
        </div>
      </CourseAccessGuard>
    );
  }

  if (!course) {
    return (
      <CourseAccessGuard courseId={courseId}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4">Course not found</h1>
            <Link href="/my-courses" className="text-bloompink hover:underline">
              Back to My Courses
            </Link>
          </div>
        </div>
      </CourseAccessGuard>
    );
  }

  const currentWeekData = course.weeks[currentWeek];

  return (
    <CourseAccessGuard courseId={courseId} courseName={course.title}>
      <div className="min-h-screen bg-bloom-offwhite flex">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <motion.div 
          initial={{ x: -320 }}
          animate={{ x: sidebarOpen ? 0 : -256 }}
          transition={{ duration: 0.3 }}
          className="w-80 bg-white shadow-lg fixed lg:relative inset-y-0 left-0 z-50 flex-shrink-0"
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0 mr-3">
                <h1 className="font-semibold text-bloom-dark truncate">{course.title}</h1>
                <div className="text-sm text-bloom-dark/60 mt-1">
                  {getCompletionPercentage()}% Complete
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <motion.div 
                    className="bg-bloompink h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${getCompletionPercentage()}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-bloom-sage-50 transition-colors lg:hidden"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4 overflow-y-auto" style={{ height: 'calc(100vh - 200px)' }}>
            {course.weeks.map((week, weekIndex) => (
              <div key={week.id} className="space-y-2">
                <button
                  onClick={() => {
                    setCurrentWeek(weekIndex);
                    if (week.lessons.length > 0) {
                      setCurrentLesson(week.lessons[0]);
                    }
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    currentWeek === weekIndex ? 'bg-bloompink text-white' : 'bg-bloom-sage-50 hover:bg-bloom-sage-100'
                  }`}
                >
                  <div className="font-medium">Week {week.week_number}: {week.title}</div>
                  <div className={`text-sm mt-1 ${currentWeek === weekIndex ? 'text-white/80' : 'text-bloom-dark/60'}`}>
                    {week.lessons.length} lessons
                  </div>
                </button>
                
                {currentWeek === weekIndex && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="ml-4 space-y-1"
                  >
                    {week.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => setCurrentLesson(lesson)}
                        className={`w-full text-left p-2 rounded text-sm transition-colors flex items-start gap-2 ${
                          currentLesson?.id === lesson.id ? 'bg-bloom-pink-50 text-bloompink' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          lessonProgress[lesson.id] ? 'bg-green-500 border-green-500' : 'border-gray-300'
                        }`}>
                          {lessonProgress[lesson.id] && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{lesson.title}</div>
                          <div className="text-xs text-bloom-dark/60">{lesson.duration}</div>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}

            {/* Navigation */}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <Link
                href="/my-courses"
                className="w-full text-center bg-bloom-sage text-white py-2 px-4 rounded-lg hover:bg-bloom-sage-dark transition-colors flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                My Courses
              </Link>
              <Link
                href="/"
                className="w-full text-center bg-bloompink text-white py-2 px-4 rounded-lg hover:bg-bloom-pink-dark transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Main Site
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:ml-0">
          {/* Header */}
          <div className="bg-white shadow-sm border-b border-gray-200 p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-lg hover:bg-bloom-sage-50 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <h1 className="text-2xl font-semibold text-bloom-dark">{currentLesson?.title}</h1>
                </div>
                <p className="text-bloom-dark/60 ml-11">{currentLesson?.description}</p>
              </div>
              <div className="flex items-center gap-3">
                {currentLesson && !lessonProgress[currentLesson.id] && (
                  <button
                    onClick={() => markLessonComplete(currentLesson.id)}
                    className="bg-bloompink text-white px-4 py-2 rounded-lg hover:bg-bloom-pink-dark transition-colors"
                  >
                    Mark Complete
                  </button>
                )}
                {currentLesson && lessonProgress[currentLesson.id] && (
                  <span className="text-green-600 font-medium flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Complete
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6">
            {currentLesson ? (
              <div className="max-w-4xl mx-auto">
                {/* Video/Content Area */}
                <div className="bg-black rounded-lg aspect-video mb-6 flex items-center justify-center">
                  <div className="text-center text-white">
                    <PlayCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">{currentLesson.title}</p>
                    <p className="text-white/80">Video content will be embedded here</p>
                    {currentLesson.video_url && (
                      <p className="text-sm text-white/60 mt-2">Video URL: {currentLesson.video_url}</p>
                    )}
                  </div>
                </div>

                {/* Transcript Toggle */}
                {currentLesson.video_script && (
                  <>
                    <button
                      onClick={() => setShowTranscript(!showTranscript)}
                      className="flex items-center gap-2 text-bloom-dark hover:text-bloompink transition-colors mb-4"
                    >
                      <FileText className="w-5 h-5" />
                      {showTranscript ? 'Hide Script' : 'Show Script'}
                    </button>

                    {showTranscript && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-white rounded-lg p-6 shadow-soft mb-6"
                      >
                        <h3 className="font-semibold text-bloom-dark mb-4">Video Script</h3>
                        <div className="prose prose-sm max-w-none text-bloom-dark/80">
                          <div dangerouslySetInnerHTML={{ __html: currentLesson.video_script }} />
                        </div>
                      </motion.div>
                    )}
                  </>
                )}

                {/* HTML Slides */}
                {currentLesson.html_slides && (
                  <div className="bg-white rounded-lg p-6 shadow-soft">
                    <h3 className="font-semibold text-bloom-dark mb-4">Lesson Materials</h3>
                    <div className="prose prose-sm max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: currentLesson.html_slides }} />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-bloom-dark/60">Select a lesson to begin</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </CourseAccessGuard>
  );
}