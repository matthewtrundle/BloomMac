'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  postpartum_date?: string;
  number_of_children?: number;
  total_stars?: number;
}

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
  nextLesson?: {
    number: number;
    title: string;
  };
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
  points: number;
}

export default function MyGrowthStudioPage() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<CourseProgress[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'overview' | 'courses' | 'resources' | 'achievements'>('overview');

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      const [profileResponse, coursesResponse, achievementsResponse] = await Promise.all([
        fetch('/api/profile/get', { 
          headers: { 'Authorization': `Bearer ${user.access_token || ''}` }
        }),
        fetch('/api/courses/all-progress', {
          headers: { 'Authorization': `Bearer ${user.access_token || ''}` }
        }),
        fetch('/api/achievements/get', {
          headers: { 'Authorization': `Bearer ${user.access_token || ''}` }
        })
      ]);

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setProfile(profileData.profile);
      }

      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json();
        const enrolled = coursesData.courses.filter((c: CourseProgress) => c.isEnrolled);
        setEnrolledCourses(enrolled);
      }

      if (achievementsResponse.ok) {
        const achievementsData = await achievementsResponse.json();
        setAchievements(achievementsData.achievements || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getPersonalizedMessage = () => {
    const firstName = profile?.first_name || user?.user_metadata?.first_name || 'Beautiful';
    return {
      greeting: `${getGreeting()}, ${firstName}!`,
      subtitle: 'Welcome to your personal growth and wellness sanctuary'
    };
  };

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

  const totalLessonsCompleted = enrolledCourses.reduce((sum, course) => sum + course.lessonsCompleted, 0);
  const activeCoursesCount = enrolledCourses.length;
  const averageProgress = activeCoursesCount > 0
    ? Math.round(enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / activeCoursesCount)
    : 0;

  // Get next lesson to continue
  const courseToContinue = enrolledCourses
    .filter(course => course.progress < 100 && course.lastActivity)
    .sort((a, b) => new Date(b.lastActivity!).getTime() - new Date(a.lastActivity!).getTime())[0];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-bloom-sage/10">
          <div className="container mx-auto px-6 py-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-playfair text-bloom-dark mb-2">
                    My Growth Studio
                  </h1>
                  <p className="text-lg text-bloom-dark/70">
                    {getPersonalizedMessage().greeting} {getPersonalizedMessage().subtitle}
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-4">
                  <Link
                    href="/profile/edit"
                    className="p-2 rounded-lg hover:bg-bloom-sage-50 transition-colors"
                  >
                    <svg className="w-5 h-5 text-bloom-dark/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/50 backdrop-blur-sm border-b border-bloom-sage/10">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex overflow-x-auto">
                <button
                  onClick={() => setActiveView('overview')}
                  className={`px-6 py-4 font-medium transition-all duration-200 border-b-2 ${
                    activeView === 'overview'
                      ? 'text-bloom-sage border-bloom-sage'
                      : 'text-bloom-dark/60 border-transparent hover:text-bloom-dark'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveView('courses')}
                  className={`px-6 py-4 font-medium transition-all duration-200 border-b-2 ${
                    activeView === 'courses'
                      ? 'text-bloom-sage border-bloom-sage'
                      : 'text-bloom-dark/60 border-transparent hover:text-bloom-dark'
                  }`}
                >
                  My Courses
                </button>
                <button
                  onClick={() => setActiveView('resources')}
                  className={`px-6 py-4 font-medium transition-all duration-200 border-b-2 ${
                    activeView === 'resources'
                      ? 'text-bloom-sage border-bloom-sage'
                      : 'text-bloom-dark/60 border-transparent hover:text-bloom-dark'
                  }`}
                >
                  Resources
                </button>
                <button
                  onClick={() => setActiveView('achievements')}
                  className={`px-6 py-4 font-medium transition-all duration-200 border-b-2 ${
                    activeView === 'achievements'
                      ? 'text-bloom-sage border-bloom-sage'
                      : 'text-bloom-dark/60 border-transparent hover:text-bloom-dark'
                  }`}
                >
                  Achievements
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {activeView === 'overview' && (
              <div className="space-y-8">
                {/* Progress Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-xl shadow-sm p-6 text-center"
                  >
                    <div className="text-3xl font-bold text-bloom-sage mb-1">{activeCoursesCount}</div>
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
                    <div className="text-3xl font-bold text-bloom-accent mb-1">{achievements.length}</div>
                    <div className="text-sm text-bloom-dark/60">Achievements</div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="bg-white rounded-xl shadow-sm p-6 text-center"
                  >
                    <div className="text-3xl font-bold text-purple-600 mb-1">{profile?.total_stars || 0}</div>
                    <div className="text-sm text-bloom-dark/60">Stars Earned</div>
                  </motion.div>
                </div>

                {/* Continue Learning */}
                {courseToContinue && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="bg-gradient-to-r from-bloom-sage/10 to-bloompink/10 rounded-2xl p-6"
                  >
                    <h2 className="text-xl font-semibold text-bloom-dark mb-4">Continue Where You Left Off</h2>
                    <div className="bg-white rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-bloom-dark mb-2">{courseToContinue.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-bloom-dark/60 mb-4">
                            <span>{courseToContinue.lessonsCompleted} of {courseToContinue.totalLessons} lessons completed</span>
                            <span>•</span>
                            <span>{courseToContinue.progress}% complete</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                            <div 
                              className="h-full bg-gradient-to-r from-bloom-sage to-bloompink"
                              style={{ width: `${courseToContinue.progress}%` }}
                            />
                          </div>
                        </div>
                        <Link
                          href={`/learn/${courseToContinue.id}`}
                          className="ml-6 px-6 py-3 bg-bloom-sage text-white rounded-lg hover:bg-bloom-sage/90 transition-colors font-medium"
                        >
                          Continue Learning
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Recent Achievements */}
                {achievements.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                    className="bg-white rounded-2xl shadow-sm p-6"
                  >
                    <h2 className="text-xl font-semibold text-bloom-dark mb-4">Recent Achievements</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                      {achievements.slice(0, 3).map((achievement, index) => (
                        <motion.div
                          key={achievement.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                          className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{achievement.icon}</div>
                            <div>
                              <h4 className="font-semibold text-amber-800">{achievement.name}</h4>
                              <p className="text-sm text-amber-700">{achievement.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Link
                    href="/courses"
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-bloom-sage/10 rounded-lg flex items-center justify-center group-hover:bg-bloom-sage/20 transition-colors">
                        <svg className="w-6 h-6 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-bloom-dark">Browse Courses</h3>
                        <p className="text-sm text-bloom-dark/60">Explore new learning paths</p>
                      </div>
                    </div>
                  </Link>

                  <Link
                    href="/resources"
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-bloompink/10 rounded-lg flex items-center justify-center group-hover:bg-bloompink/20 transition-colors">
                        <svg className="w-6 h-6 text-bloompink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-bloom-dark">Free Resources</h3>
                        <p className="text-sm text-bloom-dark/60">Guides, worksheets & tools</p>
                      </div>
                    </div>
                  </Link>

                  <Link
                    href="/community"
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-bloom-accent/10 rounded-lg flex items-center justify-center group-hover:bg-bloom-accent/20 transition-colors">
                        <svg className="w-6 h-6 text-bloom-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-bloom-dark">Community</h3>
                        <p className="text-sm text-bloom-dark/60">Connect with other moms</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )}

            {activeView === 'courses' && (
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
                          <h2 className="text-2xl font-semibold text-bloom-dark mb-2">
                            {course.title}
                          </h2>
                          <p className="text-bloom-dark/70 mb-6">
                            {course.description}
                          </p>

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

                          <div className="flex gap-4">
                            <Link
                              href={`/learn/${course.id}`}
                              className="px-6 py-3 bg-bloom-sage text-white rounded-lg hover:bg-bloom-sage/90 transition-colors font-medium"
                            >
                              {course.progress === 100 ? 'Review Course' : 'Continue Learning'}
                            </Link>
                            <Link
                              href={`/courses/${course.id}`}
                              className="px-6 py-3 border-2 border-bloom-sage text-bloom-sage rounded-lg hover:bg-bloom-sage-50 transition-colors font-medium"
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
                      Start Your Learning Journey
                    </h2>
                    <p className="text-bloom-dark/70 mb-6 max-w-md mx-auto">
                      Explore our courses designed specifically for your postpartum wellness journey.
                    </p>
                    <Link
                      href="/courses"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-bloom-sage text-white rounded-lg hover:bg-bloom-sage/90 transition-colors font-medium"
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

            {activeView === 'resources' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-bloom-dark mb-6">Resource Library</h2>
                <p className="text-bloom-dark/70 mb-8">
                  Download worksheets, access guided meditations, and explore tools designed to support your wellness journey.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <Link
                    href="/resources"
                    className="border border-bloom-sage/20 rounded-lg p-6 hover:border-bloom-sage/40 transition-colors"
                  >
                    <h3 className="font-semibold text-bloom-dark mb-2">Free Resources</h3>
                    <p className="text-sm text-bloom-dark/60">Access our collection of free guides and worksheets</p>
                  </Link>
                  <div className="border border-gray-200 rounded-lg p-6 opacity-50">
                    <h3 className="font-semibold text-bloom-dark mb-2">Course Materials</h3>
                    <p className="text-sm text-bloom-dark/60">Coming soon: Download materials from your enrolled courses</p>
                  </div>
                </div>
              </div>
            )}

            {activeView === 'achievements' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-semibold text-bloom-dark mb-6">Your Achievements</h2>
                  {achievements.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {achievements.map((achievement, index) => (
                        <motion.div
                          key={achievement.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-6"
                        >
                          <div className="text-center">
                            <div className="text-4xl mb-3">{achievement.icon}</div>
                            <h3 className="font-semibold text-amber-800 mb-1">{achievement.name}</h3>
                            <p className="text-sm text-amber-700 mb-2">{achievement.description}</p>
                            <p className="text-xs text-amber-600">+{achievement.points} stars</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-bloom-dark/60">
                        Complete lessons and reach milestones to earn achievements!
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-r from-bloom-sage-50 to-bloompink-50 rounded-2xl p-8">
                  <h3 className="text-xl font-semibold text-bloom-dark mb-4">Total Stars Earned</h3>
                  <div className="flex items-center gap-3">
                    <div className="text-5xl">⭐</div>
                    <div className="text-4xl font-bold text-bloom-dark">{profile?.total_stars || 0}</div>
                  </div>
                  <p className="text-bloom-dark/70 mt-4">
                    Keep learning and growing to earn more stars and unlock new achievements!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}