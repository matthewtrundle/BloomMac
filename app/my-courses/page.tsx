'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface CourseProgress {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  totalLessons: number;
  duration: string;
  price: number;
  isFree?: boolean;
  isEnrolled: boolean;
  progress: number;
  lessonsCompleted: number;
  lastActivity: string | null;
  image?: string;
  nextLesson?: {
    number: number;
    title: string;
  };
}

interface WorkbookStatus {
  weekNumber: number;
  totalQuestions: number;
  answeredQuestions: number;
  isDraft: boolean;
  isSubmitted: boolean;
  completionPercentage: number;
}

interface CourseWorkbook {
  courseId: string;
  courseName: string;
  workbooks: WorkbookStatus[];
}

interface RecentActivity {
  id: string;
  type: 'lesson_completed' | 'workbook_submitted' | 'course_enrolled' | 'achievement_earned';
  courseId?: string;
  courseName?: string;
  description: string;
  timestamp: string;
  icon: string;
}

export default function MyCoursesPage() {
  const { user, loading: authLoading } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<CourseProgress[]>([]);
  const [courseWorkbooks, setCourseWorkbooks] = useState<CourseWorkbook[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'courses' | 'workbooks' | 'activity'>('courses');

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch all data in parallel
      const [coursesResponse, workbooksResponse] = await Promise.all([
        fetch('/api/courses/all-progress', {
          headers: { 'Authorization': `Bearer ${user.access_token || ''}` }
        }),
        fetch('/api/workbook/enrolled', {
          headers: { 'Authorization': `Bearer ${user.access_token || ''}` }
        })
      ]);

      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json();
        const enrolled = coursesData.courses.filter((c: CourseProgress) => c.isEnrolled);
        setEnrolledCourses(enrolled);
        
        // Generate recent activity from course data
        generateRecentActivity(enrolled);
      }

      if (workbooksResponse.ok) {
        const workbooksData = await workbooksResponse.json();
        setCourseWorkbooks(workbooksData.courses || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecentActivity = (courses: CourseProgress[]) => {
    const activities: RecentActivity[] = [];
    
    courses.forEach(course => {
      if (course.lastActivity) {
        activities.push({
          id: `${course.id}-activity`,
          type: 'lesson_completed',
          courseId: course.id,
          courseName: course.title,
          description: `Progress in ${course.title}`,
          timestamp: course.lastActivity,
          icon: '📚'
        });
      }
    });

    // Sort by timestamp
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setRecentActivity(activities.slice(0, 10));
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffInMs = now.getTime() - then.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const totalLessonsCompleted = enrolledCourses.reduce((sum, course) => sum + course.lessonsCompleted, 0);
  const totalWorkbooksCompleted = courseWorkbooks.reduce((sum, course) => 
    sum + course.workbooks.filter(w => w.isSubmitted).length, 0
  );
  const averageProgress = enrolledCourses.length > 0
    ? Math.round(enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / enrolledCourses.length)
    : 0;

  if (authLoading || loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bloom-sage mx-auto"></div>
            <p className="mt-4 text-bloom-dark/60">Loading your Growth Studio...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-bloom-sage/10">
          <div className="container mx-auto px-6 py-8">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-3xl font-playfair text-bloom-dark mb-2">
                My Growth Studio
              </h1>
              <p className="text-lg text-bloom-dark/70">
                Welcome back, {user?.user_metadata?.first_name || 'Beautiful Mama'}! Continue your wellness education.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <section className="py-8">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-xl shadow-sm p-6 text-center"
                >
                  <div className="text-3xl font-bold text-bloom-sage mb-1">{enrolledCourses.length}</div>
                  <div className="text-sm text-bloom-dark/60">Active Courses</div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="bg-white rounded-xl shadow-sm p-6 text-center"
                >
                  <div className="text-3xl font-bold text-bloompink mb-1">{totalLessonsCompleted}</div>
                  <div className="text-sm text-bloom-dark/60">Lessons Completed</div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="bg-white rounded-xl shadow-sm p-6 text-center"
                >
                  <div className="text-3xl font-bold text-bloom-accent mb-1">{totalWorkbooksCompleted}</div>
                  <div className="text-sm text-bloom-dark/60">Workbooks Done</div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="bg-white rounded-xl shadow-sm p-6 text-center"
                >
                  <div className="text-3xl font-bold text-purple-600 mb-1">{averageProgress}%</div>
                  <div className="text-sm text-bloom-dark/60">Avg Progress</div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="py-4">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex space-x-1 bg-white/50 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('courses')}
                  className={`flex-1 py-3 px-4 rounded-md transition-all duration-200 font-medium ${
                    activeTab === 'courses'
                      ? 'bg-white text-bloom-dark shadow-sm'
                      : 'text-bloom-dark/60 hover:text-bloom-dark'
                  }`}
                >
                  Courses
                </button>
                <button
                  onClick={() => setActiveTab('workbooks')}
                  className={`flex-1 py-3 px-4 rounded-md transition-all duration-200 font-medium ${
                    activeTab === 'workbooks'
                      ? 'bg-white text-bloom-dark shadow-sm'
                      : 'text-bloom-dark/60 hover:text-bloom-dark'
                  }`}
                >
                  Workbooks
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`flex-1 py-3 px-4 rounded-md transition-all duration-200 font-medium ${
                    activeTab === 'activity'
                      ? 'bg-white text-bloom-dark shadow-sm'
                      : 'text-bloom-dark/60 hover:text-bloom-dark'
                  }`}
                >
                  Recent Activity
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8 pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              {activeTab === 'courses' && (
                <div className="space-y-6">
                  {enrolledCourses.length > 0 ? (
                    enrolledCourses.map((course, index) => (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden"
                      >
                        <div className="md:flex">
                          <div className="md:w-1/3 relative">
                            <div className="h-64 md:h-full bg-gradient-to-br from-bloom-sage-50 to-bloom-pink-50 flex items-center justify-center">
                              <svg className="w-20 h-20 text-bloom-sage/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            </div>
                            {course.progress === 100 && (
                              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                Complete!
                              </div>
                            )}
                          </div>
                          
                          <div className="md:w-2/3 p-8">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h2 className="text-2xl font-semibold text-bloom-dark mb-2">
                                  {course.title}
                                </h2>
                                <p className="text-bloom-dark/70 mb-4">
                                  {course.description}
                                </p>
                              </div>
                              {course.isFree && (
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                  FREE
                                </span>
                              )}
                            </div>

                            {/* Progress Info */}
                            <div className="mb-6">
                              <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-bloom-dark/60">
                                  {course.lessonsCompleted} of {course.totalLessons} lessons completed
                                </span>
                                <span className="font-medium text-bloom-sage">{course.progress}%</span>
                              </div>
                              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-gradient-to-r from-bloom-sage to-bloompink"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${course.progress}%` }}
                                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                                />
                              </div>
                            </div>

                            {/* Course Stats */}
                            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                              <div className="bg-bloom-sage-50/30 rounded-lg p-3">
                                <div className="text-lg font-semibold text-bloom-dark">{course.duration}</div>
                                <div className="text-xs text-bloom-dark/60">Duration</div>
                              </div>
                              <div className="bg-bloom-sage-50/30 rounded-lg p-3">
                                <div className="text-lg font-semibold text-bloom-dark">{course.totalLessons}</div>
                                <div className="text-xs text-bloom-dark/60">Total Lessons</div>
                              </div>
                              <div className="bg-bloom-sage-50/30 rounded-lg p-3">
                                <div className="text-lg font-semibold text-bloom-dark">
                                  {course.lastActivity ? getTimeAgo(course.lastActivity) : 'Not started'}
                                </div>
                                <div className="text-xs text-bloom-dark/60">Last Activity</div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4">
                              <Link
                                href={`/learn/${course.id}`}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-bloom-sage text-white rounded-lg hover:bg-bloom-sage/90 transition-colors font-medium"
                              >
                                {course.progress === 100 ? 'Review Course' : 'Continue Learning'}
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                              </Link>
                              <Link
                                href={`/courses/${course.id}`}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-bloom-sage text-bloom-sage rounded-lg hover:bg-bloom-sage-50 transition-colors font-medium"
                              >
                                Course Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                      <div className="w-20 h-20 bg-bloom-sage-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-semibold text-bloom-dark mb-4">
                        No Courses Yet
                      </h2>
                      <p className="text-bloom-dark/70 mb-6 max-w-md mx-auto">
                        Start your wellness journey today! We have a free introductory course to help you get started.
                      </p>
                      <Link
                        href="/courses"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-bloompink text-white rounded-lg hover:bg-bloompink/90 transition-colors font-medium"
                      >
                        Browse Courses
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'workbooks' && (
                <div className="space-y-6">
                  {courseWorkbooks.length > 0 ? (
                    courseWorkbooks.map((course, courseIndex) => (
                      <motion.div
                        key={course.courseId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: courseIndex * 0.1 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                      >
                        <h3 className="text-xl font-semibold text-bloom-dark mb-4">
                          {course.courseName} Workbooks
                        </h3>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          {course.workbooks.map((workbook, index) => (
                            <motion.div
                              key={workbook.weekNumber}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: courseIndex * 0.1 + index * 0.05 }}
                              className={`border rounded-lg p-4 ${
                                workbook.isSubmitted 
                                  ? 'bg-green-50 border-green-200'
                                  : workbook.isDraft
                                  ? 'bg-yellow-50 border-yellow-200'
                                  : 'bg-gray-50 border-gray-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                    workbook.isSubmitted
                                      ? 'bg-green-100'
                                      : workbook.isDraft
                                      ? 'bg-yellow-100'
                                      : 'bg-gray-100'
                                  }`}>
                                    {workbook.isSubmitted ? (
                                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                    ) : workbook.isDraft ? (
                                      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                    ) : (
                                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-bloom-dark">
                                      Week ${workbook.weekNumber}
                                    </h4>
                                    <p className="text-sm text-bloom-dark/60">
                                      {workbook.isSubmitted ? 'Submitted' : workbook.isDraft ? 'In Progress' : 'Not Started'}
                                    </p>
                                  </div>
                                </div>
                                <Link
                                  href={`/workbook/${course.courseId}/week${workbook.weekNumber}`}
                                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                    workbook.isSubmitted
                                      ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                      : 'bg-bloom-sage text-white hover:bg-bloom-sage/90'
                                  }`}
                                >
                                  {workbook.isSubmitted ? 'Review' : 'Open'}
                                </Link>
                              </div>
                              
                              {!workbook.isSubmitted && workbook.answeredQuestions > 0 && (
                                <div className="mt-3">
                                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-bloom-sage to-bloompink"
                                      style={{ width: `${workbook.completionPercentage}%` }}
                                    />
                                  </div>
                                  <p className="text-xs text-bloom-dark/60 mt-1">
                                    {workbook.completionPercentage}% complete
                                  </p>
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                      <p className="text-bloom-dark/70">
                        Workbooks will appear here when you enroll in courses.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-bloom-dark mb-6">Recent Activity</h3>
                  
                  {recentActivity.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="flex items-center gap-4 p-4 bg-bloom-sage-50/30 rounded-lg"
                        >
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-lg">{activity.icon}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-bloom-dark font-medium">{activity.description}</p>
                            <p className="text-sm text-bloom-dark/60">{getTimeAgo(activity.timestamp)}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-bloom-dark/60 py-8">
                      Your learning activity will appear here as you progress through courses.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="py-12 bg-bloom-sage-50/30">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-2xl font-semibold text-bloom-dark mb-4">
                Need Help with Your Courses?
              </h3>
              <p className="text-bloom-dark/70 mb-6">
                If you're having trouble accessing content or have questions about your learning journey, we're here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-bloom-sage text-white rounded-lg hover:bg-bloom-sage/90 transition-colors font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Support
                </Link>
                <Link
                  href="/faq"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-bloom-sage text-bloom-sage rounded-lg hover:bg-bloom-sage-50 transition-colors font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  View FAQs
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}