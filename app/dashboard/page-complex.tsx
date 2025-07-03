'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getUserAchievements, ACHIEVEMENTS } from '@/lib/achievements';
import { getCourseStats, getNextLesson } from '@/lib/course-progress';
import AppointmentScheduler from '@/components/appointments/AppointmentScheduler';
import WorkbookProgress from '@/components/dashboard/WorkbookProgress';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  postpartum_date?: string;
  number_of_children?: number;
  total_stars?: number;
}

interface CourseEnrollment {
  course_id: string;
  enrollment_date: string;
  progress_percentage: number;
  last_accessed?: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
  points: number;
}

interface CourseProgress {
  weeksCompleted: number;
  lessonsCompleted: number;
  totalLessons: number;
  completionPercentage: number;
  nextLesson: { weekNumber: number; lessonNumber: number };
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [courseProgress, setCourseProgress] = useState<CourseProgress | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      setError(null);
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        // Profile is critical, but don't fail entirely
      }
      
      if (profileData) {
        setProfile(profileData);
      }

      // Fetch course enrollments
      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from('course_enrollments')
        .select('*')
        .eq('user_id', user.id);

      if (enrollmentError) {
        console.error('Enrollment fetch error:', enrollmentError);
        // Continue - enrollments are optional
      }
      
      if (enrollmentData) {
        setEnrollments(enrollmentData);
      }

      // Fetch achievements
      const achievementsResult = await getUserAchievements(user.id);
      if (achievementsResult.success) {
        setAchievements(achievementsResult.achievements || []);
      }

      // Fetch course progress if enrolled
      if (enrollmentData && enrollmentData.length > 0) {
        const courseId = enrollmentData[0].course_id;
        const stats = await getCourseStats(user.id, courseId);
        const nextLesson = await getNextLesson(user.id, courseId);
        
        if (stats) {
          setCourseProgress({
            weeksCompleted: stats.weeksCompleted,
            lessonsCompleted: stats.lessonsCompleted,
            totalLessons: stats.totalLessons,
            completionPercentage: stats.completionPercentage,
            nextLesson
          });
        }
      }

      // Fetch appointments
      const { data: appointmentData } = await supabase
        .from('appointment_data')
        .select('*')
        .eq('user_id', user.id)
        .order('appointment_date', { ascending: false });

      if (appointmentData) {
        setAppointments(appointmentData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Unable to load dashboard data. Please try refreshing.');
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

  const getDaysSincePostpartum = () => {
    if (!profile?.postpartum_date) return null;
    try {
      const postpartumDate = new Date(profile.postpartum_date);
      // Check if date is valid
      if (isNaN(postpartumDate.getTime())) return null;
      
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - postpartumDate.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch (error) {
      console.error('Error calculating days since postpartum:', error);
      return null;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bloom-sage mx-auto"></div>
          <p className="mt-4 text-bloom-dark/60">Loading your wellness hub...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-bloom-dark mb-2">Dashboard Error</h2>
          <p className="text-bloom-gray-600 mb-6">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchUserData();
            }}
            className="w-full px-6 py-3 bg-bloom-sage text-white rounded-lg hover:bg-bloom-sage/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50">
      {/* Dashboard Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-bloom-sage/10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-playfair text-bloom-dark">
                {getGreeting()}, {profile?.first_name || 'Beautiful'}
              </h1>
              <p className="text-bloom-dark/60 mt-1">
                {getDaysSincePostpartum() !== null && (
                  <>Day {getDaysSincePostpartum()} of your journey • </>
                )}
                Let's nurture your wellness today
              </p>
            </div>
            
            {/* Quick Mood Check */}
            <div className="hidden md:block">
              <button className="px-4 py-2 bg-bloom-sage/10 hover:bg-bloom-sage/20 rounded-lg transition-colors">
                <span className="text-sm text-bloom-dark/80">How are you feeling today?</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Focus */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-bloom-dark mb-4 flex items-center gap-2">
                <span className="text-2xl">✨</span>
                Today's Focus
              </h2>
              <div className="bg-gradient-to-r from-bloom-sage-50 to-bloom-pink-50 rounded-xl p-6">
                <p className="text-bloom-dark/80 mb-4">
                  You're doing an amazing job. Remember, progress isn't always linear, and that's perfectly okay.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/resources"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-bloom-sage-50 rounded-lg transition-colors text-sm font-medium text-bloom-dark"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Browse Resources
                  </Link>
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-bloom-sage-50 rounded-lg transition-colors text-sm font-medium text-bloom-dark">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Take a Self-Care Moment
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Active Courses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-bloom-dark mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="text-2xl">📚</span>
                  Your Courses
                </span>
                <Link 
                  href="/courses"
                  className="text-sm text-bloom-sage hover:underline"
                >
                  Browse All
                </Link>
              </h2>
              
              {enrollments.length > 0 ? (
                <div className="space-y-4">
                  {enrollments.map((enrollment) => (
                    <div key={enrollment.course_id} className="border border-bloom-sage/20 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-bloom-dark">Postpartum Wellness Foundations</h3>
                        <span className="text-sm text-bloom-dark/60">
                          {courseProgress?.completionPercentage || 0}% complete
                        </span>
                      </div>
                      <div className="w-full bg-bloom-sage/10 rounded-full h-2 mb-3">
                        <div 
                          className="bg-bloom-sage rounded-full h-2 transition-all duration-500"
                          style={{ width: `${courseProgress?.completionPercentage || 0}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-bloom-dark/60">
                          {courseProgress && (
                            <>Week {courseProgress.nextLesson.weekNumber}, Lesson {courseProgress.nextLesson.lessonNumber}</>
                          )}
                        </div>
                        <Link
                          href={courseProgress ? `/course/week${courseProgress.nextLesson.weekNumber}/lesson${courseProgress.nextLesson.lessonNumber}` : '/course/week1/lesson1'}
                          className="text-sm text-bloom-sage hover:underline"
                        >
                          Continue Learning →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-bloom-dark/60 mb-4">You haven't enrolled in any courses yet</p>
                  <Link
                    href="/courses"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-bloom-sage text-white rounded-lg hover:bg-bloom-sage/90 transition-colors"
                  >
                    Explore Courses
                  </Link>
                </div>
              )}
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-bloom-dark mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  Your Stars
                </span>
                <span className="text-sm text-bloom-sage">
                  {profile?.total_stars || 0} total stars
                </span>
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                      <span className="text-2xl">{achievement.icon}</span>
                    </div>
                    <p className="text-xs text-bloom-dark/60">{achievement.name}</p>
                  </div>
                ))}
                {achievements.length === 0 && (
                  <div className="col-span-full text-center py-4">
                    <p className="text-bloom-dark/60 text-sm">Complete activities to earn stars!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Workbook Progress */}
            {enrollments.length > 0 && enrollments[0]?.course_id && user && (
              <WorkbookProgress 
                userId={user.id} 
                courseId={enrollments[0].course_id}
              />
            )}
            {/* Upcoming Appointment */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-bloom-dark mb-4">Next Appointment</h3>
              {appointments.filter(apt => new Date(apt.appointment_date) > new Date() && apt.status === 'scheduled').length > 0 ? (
                <div>
                  {appointments
                    .filter(apt => new Date(apt.appointment_date) > new Date() && apt.status === 'scheduled')
                    .slice(0, 1)
                    .map((apt) => {
                      const date = new Date(apt.appointment_date);
                      return (
                        <div key={apt.id}>
                          <div className="mb-4">
                            <p className="font-medium text-bloom-dark">
                              {apt.appointment_type.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                            </p>
                            <p className="text-sm text-bloom-dark/60 mt-1">
                              {date.toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                            <p className="text-sm text-bloom-dark/60">
                              {date.toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <Link
                            href="/appointments"
                            className="inline-block w-full text-center px-6 py-2 bg-bloom-sage text-white rounded-lg hover:bg-bloom-sage/90 transition-colors text-sm"
                          >
                            View Details
                          </Link>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-bloom-dark/60 mb-4">No upcoming appointments</p>
                  <Link
                    href="/appointments"
                    className="inline-block px-6 py-2 bg-bloompink text-white rounded-lg hover:bg-bloompink/90 transition-colors text-sm"
                  >
                    Book a Session
                  </Link>
                </div>
              )}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-bloom-dark mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/resources"
                  className="flex items-center gap-3 p-3 hover:bg-bloom-sage-50 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-bloom-sage/10 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-bloom-dark">Browse Resources</span>
                </Link>
                
                <Link
                  href="/book"
                  className="flex items-center gap-3 p-3 hover:bg-bloom-sage-50 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-bloompink/10 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-bloompink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-bloom-dark">Book Appointment</span>
                </Link>
                
                <Link
                  href="/support"
                  className="flex items-center gap-3 p-3 hover:bg-bloom-sage-50 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-bloom-accent/10 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-bloom-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-bloom-dark">Get Support</span>
                </Link>
                
                <button
                  className="flex items-center gap-3 p-3 hover:bg-bloom-sage-50 rounded-lg transition-colors w-full text-left"
                >
                  <div className="w-10 h-10 bg-bloom-sage/10 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-bloom-dark">Take a Break</span>
                </button>
              </div>
            </motion.div>

            {/* Wellness Tip */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-bloom-sage-50 to-bloom-pink-50 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-bloom-dark mb-3">Today's Reminder</h3>
              <p className="text-sm text-bloom-dark/80 leading-relaxed">
                "You don't have to be perfect. You just have to be present. Your baby doesn't need a perfect mother - they need you."
              </p>
              <p className="text-xs text-bloom-dark/60 mt-3">- Dr. Jana Rundle</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}