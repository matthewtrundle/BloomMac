'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useCart } from '@/lib/cart/cart-context';
import AddToCartButton from '@/components/ui/AddToCartButton';

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
  const [activeView, setActiveView] = useState<'overview' | 'courses' | 'resources' | 'achievements' | 'settings'>('overview');
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcomeAnimation(false), 3000);
    return () => clearTimeout(timer);
  }, []);

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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-bloom-pink-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
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

  // Available courses data
  const availableCourses = [
    {
      id: 'postpartum-wellness-foundations',
      title: 'Postpartum Wellness Foundations',
      subtitle: 'Your 6-Week Journey to Emotional Balance',
      description: 'A comprehensive self-paced program designed to help new mothers navigate the emotional challenges of postpartum life.',
      duration: '6 weeks',
      lessons: 25,
      price: 197,
      originalPrice: 297,
      image: '/images/optimized/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__1c12cc3c-cebd-47e2-ad9b-66b9bbca6480_0.webp',
      color: 'blue'
    },
    {
      id: 'anxiety-management-new-moms',
      title: 'Anxiety Management for New Moms',
      subtitle: 'Practical Tools for Peace of Mind',
      description: 'Learn evidence-based techniques to manage postpartum anxiety and worry.',
      duration: '4 weeks',
      lessons: 16,
      price: 127,
      image: '/images/optimized/biff01_imagine_woman_in_meditation_pose_serene_environment_br_1f66e17b-a951-4d9f-b895-127fabc89208_1.webp',
      color: 'purple'
    },
    {
      id: 'partner-support-bootcamp',
      title: 'Partner Support Bootcamp',
      subtitle: 'For Partners Who Want to Help',
      description: 'Equip partners with the knowledge and skills to provide meaningful support.',
      duration: '2 weeks',
      lessons: 8,
      price: 97,
      image: '/images/optimized/biff01_imagine_mixed-race_parents_with_newborn_tender_family__1caa7f06-30ca-47c7-a1cd-038dc0cea487_1.webp',
      color: 'green'
    }
  ];

  // Filter out already enrolled courses
  const enrolledCourseIds = enrolledCourses.map(c => c.id);
  const notEnrolledCourses = availableCourses.filter(c => !enrolledCourseIds.includes(c.id));

  // Service offerings
  const serviceOfferings = [
    {
      id: 'free-consultation',
      title: 'Free 15-Minute Consultation',
      subtitle: 'Get Started with a Complimentary Call',
      description: 'Connect with Dr. Jana to discuss your needs and explore how we can support your wellness journey.',
      price: 0,
      duration: '15 minutes',
      image: '/images/optimized/biff01_counseling_session_warm_therapy_office_natural_light_co_6f0f8f67-2ad2-4c02-8c0f-d0f088c73c4f_2.webp',
      buttonText: 'Book Free Call',
      href: '/book',
      color: 'green'
    },
    {
      id: 'one-hour-session',
      title: '1-Hour Session with Dr. Jana',
      subtitle: 'Personalized Therapeutic Support',
      description: 'Deep dive into your specific challenges with expert guidance tailored to your unique situation.',
      price: 175,
      duration: '60 minutes',
      image: '/images/optimized/Team/Jana Rundle.webp',
      buttonText: 'Schedule Session',
      href: '/book',
      color: 'blue'
    },
    {
      id: 'workbook-review',
      title: 'Workbook Review & Follow-Up',
      subtitle: 'Personalized Course Support',
      description: 'Review your course workbook with Dr. Jana and get personalized feedback and guidance.',
      price: 97,
      duration: '30 minutes',
      image: '/images/optimized/biff01_online_education_laptop_woman_studying_modern_home_wa_c991ba6e-df5f-418e-9e03-e74c5e8d2ff6_0.webp',
      buttonText: 'Book Review',
      href: '/book',
      color: 'purple'
    }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-bloom-pink-50 relative overflow-hidden">
        {/* Modern gradient shapes background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-bloom-pink-light rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Welcome Animation */}
        {showWelcomeAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/90 backdrop-blur-lg z-50 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-400 to-bloom-pink rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl font-playfair text-bloom-dark mb-2"
              >
                Welcome to Your Growth Studio
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-bloom-dark/70"
              >
                {profile?.first_name ? `Hello, ${profile.first_name}!` : 'Loading your personalized experience...'}
              </motion.p>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 relative z-10">
          <div className="container mx-auto px-6 py-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl md:text-5xl font-playfair text-bloom-dark mb-2">
                    My Growth Studio
                  </h1>
                  <p className="text-xl text-bloom-dark/80">
                    {getPersonalizedMessage().greeting} {getPersonalizedMessage().subtitle}
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-4">
                  <Link
                    href="/profile/edit"
                    className="p-2 rounded-lg hover:bg-blue-50 transition-colors"
                    title="Edit Profile"
                  >
                    <svg className="w-5 h-5 text-bloom-dark/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </Link>
                  <button
                    onClick={async () => {
                      try {
                        await fetch('/api/auth/signout', { method: 'POST' });
                        window.location.href = '/';
                      } catch (error) {
                        console.error('Error signing out:', error);
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-bloom-dark/70 hover:text-bloom-dark transition-colors rounded-lg hover:bg-blue-50"
                    title="Sign Out"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/50 backdrop-blur-sm border-b border-gray-100 relative z-10">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex overflow-x-auto">
                <button
                  onClick={() => setActiveView('overview')}
                  className={`px-6 py-4 font-medium transition-all duration-200 border-b-2 ${
                    activeView === 'overview'
                      ? 'text-blue-600 border-blue-600'
                      : 'text-bloom-dark/60 border-transparent hover:text-bloom-dark'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveView('courses')}
                  className={`px-6 py-4 font-medium transition-all duration-200 border-b-2 ${
                    activeView === 'courses'
                      ? 'text-blue-600 border-blue-600'
                      : 'text-bloom-dark/60 border-transparent hover:text-bloom-dark'
                  }`}
                >
                  My Courses
                </button>
                <button
                  onClick={() => setActiveView('resources')}
                  className={`px-6 py-4 font-medium transition-all duration-200 border-b-2 ${
                    activeView === 'resources'
                      ? 'text-blue-600 border-blue-600'
                      : 'text-bloom-dark/60 border-transparent hover:text-bloom-dark'
                  }`}
                >
                  Resources
                </button>
                <button
                  onClick={() => setActiveView('achievements')}
                  className={`px-6 py-4 font-medium transition-all duration-200 border-b-2 ${
                    activeView === 'achievements'
                      ? 'text-blue-600 border-blue-600'
                      : 'text-bloom-dark/60 border-transparent hover:text-bloom-dark'
                  }`}
                >
                  Achievements
                </button>
                <button
                  onClick={() => setActiveView('settings')}
                  className={`px-6 py-4 font-medium transition-all duration-200 border-b-2 ${
                    activeView === 'settings'
                      ? 'text-blue-600 border-blue-600'
                      : 'text-bloom-dark/60 border-transparent hover:text-bloom-dark'
                  }`}
                >
                  Settings
                </button>
                
                {/* Mobile Logout Button */}
                <button
                  onClick={async () => {
                    try {
                      await fetch('/api/auth/signout', { method: 'POST' });
                      window.location.href = '/';
                    } catch (error) {
                      console.error('Error signing out:', error);
                    }
                  }}
                  className="md:hidden px-6 py-4 font-medium text-red-600 hover:text-red-700 transition-all duration-200 border-b-2 border-transparent hover:border-red-200"
                >
                  Sign Out
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
                {/* Featured Course Hero */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8"
                >
                  <div className="bg-gradient-to-br from-white to-blue-50/30 border border-blue-100 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                      <div className="p-8">
                        <span className="inline-block px-3 py-1 bg-bloom-pink/10 text-bloom-pink rounded-full text-sm font-medium mb-4">
                          Featured Course
                        </span>
                        <h2 className="text-3xl font-playfair text-bloom-dark mb-4">
                          Postpartum Wellness Foundations
                        </h2>
                        <p className="text-bloom-dark/70 mb-6 leading-relaxed">
                          A comprehensive 6-week program designed specifically for new mothers navigating the fourth trimester. Learn evidence-based strategies for managing stress, building support networks, and thriving in motherhood.
                        </p>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-bloom-dark">4.5 hours</p>
                              <p className="text-xs text-bloom-dark/60">of video content</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-bloom-pink-light rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-bloom-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-bloom-dark">25 lessons</p>
                              <p className="text-xs text-bloom-dark/60">with workbooks</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Link 
                            href="/courses/postpartum-wellness-foundations"
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
                          >
                            Learn More
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </Link>
                          {enrolledCourses.length > 0 && enrolledCourses[0].id === 'postpartum-wellness-foundations' && (
                            <Link 
                              href="/course/week1"
                              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-bloom-pink to-bloom-pink-dark text-white rounded-full hover:from-bloom-pink-dark hover:to-bloom-pink transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                              Continue Course
                              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </Link>
                          )}
                        </div>
                      </div>
                      <div className="relative h-full min-h-[400px]">
                        <Image
                          src="/images/optimized/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__1c12cc3c-cebd-47e2-ad9b-66b9bbca6480_0.webp"
                          alt="Peaceful mother and baby"
                          width={600}
                          height={400}
                          className="w-full h-full object-cover"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Progress Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    onClick={() => setActiveView('courses')}
                    className="bg-white rounded-xl shadow-sm p-6 text-center cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all group"
                  >
                    <div className="text-3xl font-bold text-blue-600 mb-1 group-hover:text-blue-700">{activeCoursesCount}</div>
                    <div className="text-sm text-bloom-dark/60">Active Courses</div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="bg-white rounded-xl shadow-sm p-6 text-center"
                  >
                    <div className="text-3xl font-bold text-bloom-pink mb-1">{totalLessonsCompleted}</div>
                    <div className="text-sm text-bloom-dark/60">Lessons Completed</div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="bg-white rounded-xl shadow-sm p-6 text-center"
                  >
                    <div className="text-3xl font-bold text-purple-600 mb-1">{achievements.length}</div>
                    <div className="text-sm text-bloom-dark/60">Achievements</div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="bg-white rounded-xl shadow-sm p-6 text-center"
                  >
                    <div className="text-3xl font-bold text-green-600 mb-1">{profile?.total_stars || 0}</div>
                    <div className="text-sm text-bloom-dark/60">Stars Earned</div>
                  </motion.div>
                </div>

                {/* Continue Learning */}
                {courseToContinue && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="bg-gradient-to-r from-blue-50 to-bloom-pink-50 rounded-2xl p-6"
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
                              className="h-full bg-gradient-to-r from-blue-500 to-bloom-pink"
                              style={{ width: `${courseToContinue.progress}%` }}
                            />
                          </div>
                        </div>
                        <Link
                          href="/course/week1"
                          className="ml-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
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

                {/* Available Courses Section - More Prominent */}
                {notEnrolledCourses.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-semibold text-bloom-dark">Expand Your Journey</h2>
                        <p className="text-bloom-dark/60 mt-1">Discover courses designed for your wellness journey</p>
                      </div>
                      <Link 
                        href="/courses"
                        className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                      >
                        View All Courses
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      {notEnrolledCourses.map((course, index) => (
                        <motion.div
                          key={course.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                          className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                        >
                          <div className="relative h-48 overflow-hidden">
                            <Image
                              src={course.image}
                              alt={course.title}
                              width={400}
                              height={200}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-4 left-4 right-4">
                              <span className="text-white/90 text-sm">{course.duration} • {course.lessons} lessons</span>
                            </div>
                          </div>
                          
                          <div className="p-6">
                            <h3 className="text-xl font-semibold text-bloom-dark mb-2">{course.title}</h3>
                            <p className="text-sm text-bloom-dark/70 mb-4 line-clamp-2">{course.description}</p>
                            
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-bloom-pink">${course.price}</span>
                                {course.originalPrice && (
                                  <span className="text-sm text-bloom-dark/40 line-through">${course.originalPrice}</span>
                                )}
                              </div>
                              {course.originalPrice && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                  Save ${course.originalPrice - course.price}
                                </span>
                              )}
                            </div>

                            <div className="space-y-2">
                              <AddToCartButton
                                courseId={course.id}
                                courseName={course.title}
                                price={course.price * 100}
                                description={course.description}
                                image={course.image}
                                size="sm"
                                variant="primary"
                                className="w-full"
                              />
                              <Link
                                href={`/courses/${course.id}`}
                                className="w-full block text-center px-3 py-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                              >
                                View Details →
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Personal Support Services */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-bloom-dark">Personal Support Options</h2>
                      <p className="text-bloom-dark/60 mt-1">Get personalized guidance with Dr. Jana</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {serviceOfferings.map((service, index) => (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={service.image}
                            alt={service.title}
                            width={400}
                            height={200}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          <div className="absolute top-4 right-4">
                            {service.price === 0 ? (
                              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                FREE
                              </span>
                            ) : (
                              <span className="bg-white/90 backdrop-blur-sm text-bloom-dark px-3 py-1 rounded-full text-sm font-medium">
                                ${service.price}
                              </span>
                            )}
                          </div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <span className="text-white/90 text-sm">
                              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {service.duration}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-bloom-dark mb-1">{service.title}</h3>
                          <p className="text-sm text-bloom-pink font-medium mb-3">{service.subtitle}</p>
                          <p className="text-sm text-bloom-dark/70 mb-4 line-clamp-3">{service.description}</p>
                          
                          <Link
                            href={service.href}
                            className={`
                              w-full block text-center px-4 py-3 rounded-lg font-medium transition-all duration-300
                              ${service.price === 0 
                                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700' 
                                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                              }
                            `}
                          >
                            {service.buttonText}
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.2 }}
                  className="space-y-4"
                >
                  <h2 className="text-xl font-semibold text-bloom-dark">Quick Links</h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    <a
                      href="https://discord.gg/bloommoms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                          <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.865-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-bloom-dark">Join Our Community</h3>
                          <p className="text-sm text-bloom-dark/60">Connect on Discord</p>
                        </div>
                      </div>
                    </a>

                    <Link
                      href="/resources"
                      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-bloom-pink-light rounded-lg flex items-center justify-center group-hover:bg-bloom-pink/20 transition-colors">
                          <svg className="w-6 h-6 text-bloom-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-bloom-dark">Free Resources</h3>
                          <p className="text-sm text-bloom-dark/60">Downloads & worksheets</p>
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/book"
                      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-bloom-dark">Book 1-on-1 Session</h3>
                          <p className="text-sm text-bloom-dark/60">Personal support</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </motion.div>
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
                          <div className="h-64 md:h-full bg-gradient-to-br from-blue-50 to-bloom-pink-50 flex items-center justify-center">
                            <svg className="w-20 h-20 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                              <span className="font-medium text-blue-600">{course.progress}%</span>
                            </div>
                            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-blue-500 to-bloom-pink"
                                initial={{ width: 0 }}
                                animate={{ width: `${course.progress}%` }}
                                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                              />
                            </div>
                          </div>

                          <div className="flex gap-4">
                            <Link
                              href="/course/week1"
                              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                              {course.progress === 100 ? 'Review Course' : 'Continue Learning'}
                            </Link>
                            <Link
                              href={`/courses/${course.id}`}
                              className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
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
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      href="/course/week1"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Start Course
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
                    className="border border-blue-200 rounded-lg p-6 hover:border-blue-400 transition-colors"
                  >
                    <h3 className="font-semibold text-bloom-dark mb-2">Free Resources</h3>
                    <p className="text-sm text-bloom-dark/60">Access our library of guides and worksheets</p>
                  </Link>
                  <Link
                    href="/resources/meditations"
                    className="border border-bloom-pink-light rounded-lg p-6 hover:border-bloom-pink transition-colors"
                  >
                    <h3 className="font-semibold text-bloom-dark mb-2">Guided Meditations</h3>
                    <p className="text-sm text-bloom-dark/60">Calming audio sessions for new mothers</p>
                  </Link>
                </div>
              </div>
            )}

            {activeView === 'achievements' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-bloom-dark mb-6">Your Achievements</h2>
                {achievements.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{achievement.icon}</div>
                          <div>
                            <h4 className="font-semibold text-amber-800">{achievement.name}</h4>
                            <p className="text-sm text-amber-700">{achievement.description}</p>
                            <p className="text-xs text-amber-600 mt-1">+{achievement.points} points</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-bloom-dark/60">Complete lessons and courses to earn achievements!</p>
                )}
              </div>
            )}

            {activeView === 'settings' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-bloom-dark mb-6">Account Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-bloom-dark mb-3">Profile Information</h3>
                    <Link
                      href="/profile/edit"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Edit Profile
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                  </div>

                  <div>
                    <h3 className="font-semibold text-bloom-dark mb-3">Newsletter Preferences</h3>
                    <Link
                      href="/profile/newsletter"
                      className="text-blue-600 hover:text-blue-700 underline"
                    >
                      Manage email subscriptions
                    </Link>
                  </div>

                  <div>
                    <h3 className="font-semibold text-bloom-dark mb-3">Privacy & Security</h3>
                    <Link
                      href="/privacy"
                      className="text-blue-600 hover:text-blue-700 underline"
                    >
                      View privacy policy
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}