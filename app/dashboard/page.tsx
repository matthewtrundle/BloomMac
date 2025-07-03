'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Toast, { ToastMessage } from '@/components/ui/Toast';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  postpartum_date?: string;
  number_of_children?: number;
  phone?: string;
  emergency_contact_name?: string;
  total_stars?: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
  points: number;
}

interface WorkbookStatus {
  weekNumber: number;
  totalQuestions: number;
  answeredQuestions: number;
  isDraft: boolean;
  isSubmitted: boolean;
  lastUpdated?: string;
  completionPercentage: number;
}

interface CourseWorkbook {
  courseId: string;
  courseName: string;
  workbooks: WorkbookStatus[];
}

interface CourseStats {
  weeksStarted: number;
  weeksCompleted: number;
  lessonsCompleted: number;
  totalLessons: number;
  completionPercentage: number;
  totalTimeSpentMinutes: number;
  lastActivity: string;
  courseCompleted: boolean;
}

interface CourseProgress {
  id: string;
  title: string;
  subtitle: string;
  totalLessons: number;
  duration: string;
  price: number;
  isFree?: boolean;
  isEnrolled: boolean;
  progress: number;
  lessonsCompleted: number;
  lastActivity: string | null;
}

interface UpcomingAppointment {
  id: string;
  appointment_date: string;
  appointment_type: string;
  status: string;
  payment_status: string;
  confirmation_received: boolean;
}

export default function SimpleDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [courseWorkbooks, setCourseWorkbooks] = useState<CourseWorkbook[]>([]);
  const [courseStats, setCourseStats] = useState<CourseStats | null>(null);
  const [allCourses, setAllCourses] = useState<CourseProgress[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<UpcomingAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessages, setToastMessages] = useState<ToastMessage[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchBasicData();
    }
  }, [user]);

  const addToast = (type: ToastMessage['type'], message: string) => {
    const id = Date.now().toString();
    setToastMessages(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToastMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const fetchBasicData = async () => {
    if (!user) return;

    try {
      setError(null);
      
      // Fetch all dashboard data in parallel
      const [profileResponse, achievementsResponse, workbookResponse, courseResponse, allCoursesResponse, appointmentsResponse] = await Promise.allSettled([
        fetch('/api/profile/get', {
          headers: { 'Authorization': `Bearer ${user.access_token || ''}` },
        }),
        fetch('/api/achievements/get', {
          headers: { 'Authorization': `Bearer ${user.access_token || ''}` },
        }),
        fetch('/api/workbook/enrolled', {
          headers: { 'Authorization': `Bearer ${user.access_token || ''}` },
        }),
        fetch('/api/course/stats', {
          headers: { 'Authorization': `Bearer ${user.access_token || ''}` },
        }),
        fetch('/api/courses/all-progress', {
          headers: { 'Authorization': `Bearer ${user.access_token || ''}` },
        }),
        fetch('/api/appointments/upcoming', {
          headers: { 'Authorization': `Bearer ${user.access_token || ''}` },
        })
      ]);

      // Handle profile response
      if (profileResponse.status === 'fulfilled' && profileResponse.value.ok) {
        const data = await profileResponse.value.json();
        setProfile(data.profile);
      } else {
        addToast('error', 'Unable to load profile information');
      }

      // Handle achievements response
      if (achievementsResponse.status === 'fulfilled' && achievementsResponse.value.ok) {
        const data = await achievementsResponse.value.json();
        setAchievements(data.achievements || []);
      } else {
        addToast('warning', 'Could not load achievements');
      }

      // Handle workbook response
      if (workbookResponse.status === 'fulfilled' && workbookResponse.value.ok) {
        const data = await workbookResponse.value.json();
        setCourseWorkbooks(data.courses || []);
      } else {
        addToast('warning', 'Could not load workbook data');
      }

      // Handle course response (may not exist yet)
      if (courseResponse.status === 'fulfilled' && courseResponse.value.ok) {
        const data = await courseResponse.value.json();
        setCourseStats(data.stats || null);
      } else {
        // Create default course stats
        setCourseStats({
          weeksStarted: 0,
          weeksCompleted: 0,
          lessonsCompleted: 0,
          totalLessons: 24, // 6 weeks × 4 lessons
          completionPercentage: 0,
          totalTimeSpentMinutes: 0,
          lastActivity: new Date().toISOString(),
          courseCompleted: false,
        });
      }

      // Handle all courses response
      if (allCoursesResponse.status === 'fulfilled' && allCoursesResponse.value.ok) {
        const data = await allCoursesResponse.value.json();
        setAllCourses(data.courses || []);
      }

      // Handle appointments response (may not exist yet)
      if (appointmentsResponse.status === 'fulfilled' && appointmentsResponse.value.ok) {
        const data = await appointmentsResponse.value.json();
        setUpcomingAppointments(data.appointments || []);
      } else {
        // Create mock upcoming appointment for demonstration
        setUpcomingAppointments([]);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Unable to load dashboard data');
      addToast('error', 'Failed to load dashboard data. Please try again.');
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
    const firstName = profile?.first_name || user?.user_metadata?.first_name || 'Mama';
    const numChildren = profile?.number_of_children || 0;
    const daysSince = getDaysSincePostpartum();
    
    if (daysSince !== null) {
      if (daysSince < 40) {
        return {
          greeting: `${getGreeting()}, ${firstName}`,
          subtitle: "You're in the sacred fourth trimester, embracing one of life's most transformative seasons",
          quote: "\"Just as a seed needs time in the dark soil to grow, your body and soul are doing the beautiful work of becoming.\"",
          journeyInfo: `Day ${daysSince} of your postpartum journey • Your body created life, and now it's creating a new version of you`
        };
      } else if (daysSince < 365) {
        return {
          greeting: `${getGreeting()}, ${firstName}`,
          subtitle: "Every day you're growing stronger, wiser, and more beautiful in your motherhood",
          quote: "\"You are not the same woman who entered motherhood. You are braver, more intuitive, and infinitely more capable than you knew.\"",
          journeyInfo: `${Math.floor(daysSince / 30)} months into this incredible journey • You're becoming exactly who you were meant to be`
        };
      }
    }
    
    if (numChildren === 0) {
      return {
        greeting: `${getGreeting()}, ${firstName}`,
        subtitle: "Your heart is preparing for the greatest love story you'll ever know",
        quote: "\"A baby is something you carry inside you for nine months, in your arms for three years, and in your heart until the day you die.\"",
        journeyInfo: "Expecting your first miracle • Your body is creating life, and your heart is expanding in ways you never imagined"
      };
    } else if (numChildren === 1) {
      return {
        greeting: `${getGreeting()}, ${firstName}`,
        subtitle: "You're writing the most important story of your life, one loving moment at a time",
        quote: "\"The moment a child is born, the mother is also born. She never existed before. The woman existed, but the mother, never.\"",
        journeyInfo: `Mama to 1 precious soul • You're learning that the love in your heart multiplies, never divides`
      };
    } else if (numChildren <= 3) {
      return {
        greeting: `${getGreeting()}, incredible ${firstName}`,
        subtitle: "You're orchestrating a beautiful symphony of love, chaos, and endless grace",
        quote: "\"The days are long, but the years are short. You're doing more important work than you realize.\"",
        journeyInfo: `Mama to ${numChildren} amazing children • You're proof that hearts can stretch infinitely without ever breaking`
      };
    } else {
      return {
        greeting: `${getGreeting()}, superhero ${firstName}`,
        subtitle: "You've created a whole world of love, laughter, and little humans who call you their everything",
        quote: "\"You are the heart of your home, the center of your children's universe, and stronger than you'll ever know.\"",
        journeyInfo: `Mama to ${numChildren} incredible children • You're living proof that miracles happen every single day`
      };
    }
    
    // Default fallback
    return {
      greeting: `${getGreeting()}, ${firstName}`,
      subtitle: "Your wellness journey is as unique and beautiful as you are",
      quote: "\"Take care of yourself first. You can't pour from an empty cup.\"",
      journeyInfo: "Welcome to your personal sanctuary of growth and healing"
    };
  };

  const getDaysSincePostpartum = () => {
    if (!profile?.postpartum_date) return null;
    try {
      const postpartumDate = new Date(profile.postpartum_date);
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

  const getProfileCompleteness = () => {
    if (!profile) return 0;
    const fields = [
      profile.first_name,
      profile.last_name,
      profile.phone,
      profile.postpartum_date,
      profile.number_of_children,
      profile.emergency_contact_name
    ];
    const completed = fields.filter(field => field && field.toString().trim()).length;
    return Math.round((completed / fields.length) * 100);
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
          <h2 className="text-xl font-bold text-bloom-dark mb-2">Dashboard Error</h2>
          <p className="text-bloom-gray-600 mb-6">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchBasicData();
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
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50 flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-bloom-sage/10 flex-shrink-0 flex flex-col h-screen">
        {/* Profile Section */}
        <div className="p-6 border-b border-bloom-sage/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-bloom-sage to-bloompink rounded-full flex items-center justify-center text-white font-semibold">
              {profile?.first_name?.[0] || 'M'}
            </div>
            <div>
              <h3 className="font-semibold text-bloom-dark">
                {profile?.first_name || 'Mama'} {profile?.last_name?.[0] || ''}
              </h3>
              <p className="text-xs text-bloom-dark/60">
                {profile && getProfileCompleteness() < 100 ? `${getProfileCompleteness()}% complete` : 'Member'}
              </p>
            </div>
          </div>
          
          {/* Profile Actions */}
          <div className="space-y-2">
            <a 
              href="/profile/edit"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-bloom-sage-50 transition-colors text-sm"
            >
              <svg className="w-4 h-4 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Edit Profile</span>
            </a>
            <a 
              href="/simple-settings"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-bloom-sage-50 transition-colors text-sm"
            >
              <svg className="w-4 h-4 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Settings</span>
            </a>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="p-4">
          <h4 className="text-xs font-semibold text-bloom-dark/40 uppercase tracking-wider mb-3">Quick Actions</h4>
          <nav className="space-y-1">
            <a 
              href="/my-courses"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-bloom-sage-50 transition-colors group"
            >
              <div className="w-8 h-8 bg-bloom-sage/10 rounded-lg flex items-center justify-center group-hover:bg-bloom-sage/20 transition-colors">
                <svg className="w-4 h-4 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium text-bloom-dark">My Courses</span>
                <p className="text-xs text-bloom-dark/60">Continue learning</p>
              </div>
            </a>
            
            <a 
              href="/simple-workbooks"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-bloompink/10 transition-colors group"
            >
              <div className="w-8 h-8 bg-bloompink/10 rounded-lg flex items-center justify-center group-hover:bg-bloompink/20 transition-colors">
                <svg className="w-4 h-4 text-bloompink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium text-bloom-dark">Workbooks</span>
                <p className="text-xs text-bloom-dark/60">Track reflections</p>
              </div>
            </a>
            
            <a 
              href="/simple-appointments"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-bloom-accent/10 transition-colors group"
            >
              <div className="w-8 h-8 bg-bloom-accent/10 rounded-lg flex items-center justify-center group-hover:bg-bloom-accent/20 transition-colors">
                <svg className="w-4 h-4 text-bloom-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium text-bloom-dark">Appointments</span>
                <p className="text-xs text-bloom-dark/60">Schedule sessions</p>
              </div>
            </a>
            
            <a 
              href="/courses"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-50 transition-colors group"
            >
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium text-bloom-dark">Browse Courses</span>
                <p className="text-xs text-bloom-dark/60">Explore options</p>
              </div>
            </a>
          </nav>
        </div>

        {/* Stats Summary */}
        <div className="p-4 mt-auto">
          <div className="bg-gradient-to-r from-bloom-sage-50 to-bloompink-50 rounded-lg p-4">
            <h4 className="text-xs font-semibold text-bloom-dark/60 mb-3">Your Progress</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-bloom-dark/60">Stars Earned</span>
                <span className="text-sm font-semibold text-bloom-dark">{profile?.total_stars || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-bloom-dark/60">Active Courses</span>
                <span className="text-sm font-semibold text-bloom-dark">{allCourses.filter(c => c.isEnrolled).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-bloom-dark/60">Workbooks Done</span>
                <span className="text-sm font-semibold text-bloom-dark">
                  {courseWorkbooks.reduce((total, course) => 
                    total + course.workbooks.filter(w => w.isSubmitted).length, 0
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Dashboard Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-bloom-sage/10">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-3xl font-playfair text-bloom-dark mb-2">
                    {getPersonalizedMessage().greeting}
                    {achievements.length > 0 && (
                      <span className="ml-3 inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-100 to-amber-100 border border-yellow-300 rounded-full text-sm font-medium text-amber-800">
                        <span className="text-lg">{achievements[0]?.icon || '🏆'}</span>
                        <span>{achievements[0]?.name || 'Achiever'}</span>
                      </span>
                    )}
                  </h1>
                  <p className="text-lg text-bloom-dark/70 font-light">
                    {getPersonalizedMessage().subtitle}
                  </p>
                </div>
              </div>
              {/* Sign Out Button */}
              <button
                onClick={async () => {
                  try {
                    await fetch('/api/auth/signout', { method: 'POST' });
                    window.location.href = '/';
                  } catch (error) {
                    console.error('Error signing out:', error);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-bloom-dark/70 hover:text-bloom-dark transition-colors rounded-lg hover:bg-bloom-sage/10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="px-8 py-6">
          {/* Inspirational Quote */}
          <div className="bg-gradient-to-r from-bloom-sage-50 to-bloompink/10 rounded-xl p-4 mb-6">
            <p className="text-bloom-dark/80 italic text-center font-light">
              {getPersonalizedMessage().quote}
            </p>
          </div>
          
          <div className="grid gap-6">
            {/* Your Wellness Journey - Timeline Style */}
            <div className="bg-white rounded-xl shadow-sm border border-bloom-sage/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-bloom-dark">Your Wellness Journey</h2>
                <div className="text-sm text-bloom-dark/60">
                  {profile?.total_stars || 0} ⭐ earned
                </div>
              </div>
              
              {/* Achievement Timeline */}
              <div className="space-y-4 mb-6">
                {achievements.length > 0 ? (
                  achievements.slice(0, 3).map((achievement, index) => (
                    <div key={achievement.id} className="flex items-center gap-4 p-3 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-200 to-amber-300 rounded-full flex items-center justify-center text-lg shadow-sm">
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-amber-800">{achievement.name}</h4>
                        <p className="text-sm text-amber-700">{achievement.description}</p>
                        <p className="text-xs text-amber-600 mt-1">Earned {achievement.earnedAt ? new Date(achievement.earnedAt).toLocaleDateString() : 'recently'} • +{achievement.points} stars</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-bloom-sage-100 to-bloompink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-bloom-dark mb-2">Ready to Begin?</h3>
                    <p className="text-bloom-dark/60 mb-4">Start a course or complete a workbook to unlock your first achievement!</p>
                    <a href="/courses" className="inline-flex items-center gap-2 px-4 py-2 bg-bloom-sage text-white rounded-lg hover:bg-bloom-sage/90 transition-colors text-sm font-medium">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      Start Your Journey
                    </a>
                  </div>
                )}
              </div>
              
              {/* Wellness Pillars - Simplified */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-3 bg-gradient-to-br from-bloom-sage-50 to-bloom-sage-100 rounded-lg border border-bloom-sage-200">
                  <div className="w-8 h-8 bg-bloom-sage rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-bloom-sage">Mindfulness</span>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-bloompink-50 to-bloompink-100 rounded-lg border border-bloompink-200">
                  <div className="w-8 h-8 bg-bloompink rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-bloompink">Recovery</span>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-bloom-accent-50 to-bloom-accent-100 rounded-lg border border-bloom-accent-200">
                  <div className="w-8 h-8 bg-bloom-accent rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-bloom-accent">Community</span>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-purple-700">Growth</span>
                </div>
              </div>
            </div>

          {/* All Courses Progress Section */}
          <div className="bg-white rounded-xl shadow-sm border border-bloom-sage/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-bloom-sage/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-bloom-dark">Your Courses</h3>
              </div>
              <a 
                href="/courses"
                className="text-sm font-medium text-bloom-sage hover:text-bloom-sage/80 transition-colors"
              >
                Browse All →
              </a>
            </div>
            
            <div className="space-y-3">
              {allCourses.map((course) => (
                <div 
                  key={course.id}
                  className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                    course.isEnrolled 
                      ? 'bg-gradient-to-r from-bloom-sage-50/30 to-transparent border-bloom-sage/20' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        course.isEnrolled 
                          ? course.progress === 100 
                            ? 'bg-green-100' 
                            : 'bg-bloom-sage/10'
                          : 'bg-gray-200'
                      }`}>
                        {course.isEnrolled ? (
                          course.progress === 100 ? (
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-6 h-6 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          )
                        ) : (
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-bloom-dark">{course.title}</h4>
                          {course.isFree && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              FREE
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-bloom-dark/60">
                          {course.subtitle} • {course.duration}
                        </p>
                        {course.isEnrolled && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-bloom-dark/60">
                                {course.lessonsCompleted} of {course.totalLessons} lessons
                              </span>
                              <span className="font-medium text-bloom-sage">{course.progress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-bloom-sage to-bloompink transition-all duration-300"
                                style={{ width: `${course.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    <div className="ml-4">
                      {course.isEnrolled ? (
                        <a
                          href="/my-courses"
                          className="px-4 py-2 bg-bloom-sage text-white rounded-lg hover:bg-bloom-sage/90 transition-colors text-sm font-medium"
                        >
                          {course.progress === 100 ? 'Review' : 'Continue'}
                        </a>
                      ) : (
                        <a
                          href={`/courses/${course.id}`}
                          className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                            course.isFree 
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-bloompink text-white hover:bg-bloompink/90'
                          }`}
                        >
                          {course.isFree ? 'Start Free' : `$${course.price}`}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Overall Stats */}
            {allCourses.some(c => c.isEnrolled) && (
              <div className="mt-6 pt-6 border-t border-bloom-sage/10">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-bloom-dark">
                      {allCourses.filter(c => c.isEnrolled).length}
                    </div>
                    <div className="text-xs text-bloom-dark/60">Enrolled</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-bloom-dark">
                      {allCourses.reduce((sum, c) => sum + (c.isEnrolled ? c.lessonsCompleted : 0), 0)}
                    </div>
                    <div className="text-xs text-bloom-dark/60">Lessons Done</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-bloom-dark">
                      {Math.round(
                        allCourses
                          .filter(c => c.isEnrolled)
                          .reduce((sum, c) => sum + c.progress, 0) / 
                        (allCourses.filter(c => c.isEnrolled).length || 1)
                      )}%
                    </div>
                    <div className="text-xs text-bloom-dark/60">Avg Progress</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Appointments Section */}
          <div className="bg-white rounded-xl shadow-sm border border-bloom-sage/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-bloom-accent/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-bloom-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-bloom-dark">Appointments</h3>
              </div>
              <a 
                href="/simple-appointments"
                className="text-sm font-medium text-bloom-accent hover:text-bloom-accent/80 transition-colors"
              >
                View all →
              </a>
            </div>
            
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-bloom-dark">Upcoming Appointments</h4>
                {upcomingAppointments.slice(0, 3).map((appointment) => {
                  const appointmentDate = new Date(appointment.appointment_date);
                  const isToday = appointmentDate.toDateString() === new Date().toDateString();
                  const isTomorrow = appointmentDate.toDateString() === new Date(Date.now() + 24 * 60 * 60 * 1000).toDateString();
                  
                  return (
                    <div 
                      key={appointment.id}
                      className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                        isToday 
                          ? 'bg-blue-50 border-blue-200' 
                          : 'bg-bloom-sage-50 border-bloom-sage-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            isToday ? 'bg-blue-500' : 'bg-bloom-sage'
                          }`}>
                            <span className="text-white text-lg">
                              {isToday ? '🕐' : '📅'}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-bloom-dark">
                              {appointment.appointment_type.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                            </h4>
                            <p className="text-sm text-bloom-dark/60">
                              {isToday ? 'Today' : isTomorrow ? 'Tomorrow' : appointmentDate.toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'short',
                                day: 'numeric'
                              })} at {appointmentDate.toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit'
                              })}
                            </p>
                            {!appointment.confirmation_received && (
                              <p className="text-xs text-orange-600 mt-1">⚠️ Confirmation needed</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            appointment.status === 'scheduled' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {appointment.status}
                          </span>
                          <a
                            href="/simple-appointments"
                            className="px-3 py-1 bg-bloom-sage text-white rounded text-sm hover:bg-bloom-sage/90 transition-colors"
                          >
                            Manage
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {upcomingAppointments.length > 3 && (
                  <div className="text-center pt-2">
                    <a href="/simple-appointments" className="text-bloom-sage hover:text-bloom-sage/80 text-sm underline">
                      View {upcomingAppointments.length - 3} more appointments →
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-gray-400">📅</span>
                </div>
                <h4 className="font-medium text-bloom-dark mb-2">No upcoming appointments</h4>
                <p className="text-bloom-dark/60 text-sm mb-6">
                  Ready to connect with Dr. Jana? Book your session today.
                </p>
                <div className="grid md:grid-cols-3 gap-3 mb-6">
                  <div className="bg-bloom-sage-50 rounded-lg p-3 text-center">
                    <div className="text-lg mb-1">💬</div>
                    <div className="text-xs text-bloom-dark/70">Consultation</div>
                  </div>
                  <div className="bg-bloompink/10 rounded-lg p-3 text-center">
                    <div className="text-lg mb-1">🌱</div>
                    <div className="text-xs text-bloom-dark/70">Follow-up</div>
                  </div>
                  <div className="bg-bloom-accent/10 rounded-lg p-3 text-center">
                    <div className="text-lg mb-1">🎯</div>
                    <div className="text-xs text-bloom-dark/70">Focused Session</div>
                  </div>
                </div>
                <a 
                  href="/simple-appointments"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-bloom-sage text-white rounded-lg hover:bg-bloom-sage/90 transition-colors"
                >
                  <span>📅</span>
                  Book Your First Appointment
                </a>
              </div>
            )}
          </div>

          {/* Workbook Progress Section */}
          {courseWorkbooks.length > 0 && courseWorkbooks.map((course) => (
            <div key={course.courseId} className="bg-white rounded-xl shadow-sm border border-bloom-sage/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-bloompink/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-bloompink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-bloom-dark">{course.courseName} Workbooks</h3>
                    <p className="text-xs text-bloom-dark/60">
                      {course.workbooks.length} weekly workbooks
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium text-bloompink bg-bloompink/10 px-3 py-1 rounded-full">
                  {course.workbooks.filter(w => w.isSubmitted).length} of {course.workbooks.length} done
                </span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-3">
                {course.workbooks.map((workbook) => (
                  <div 
                    key={workbook.weekNumber}
                    className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                      workbook.isSubmitted 
                        ? 'bg-green-50 border-green-200' 
                        : workbook.isDraft 
                        ? 'bg-yellow-50 border-yellow-200'
                        : workbook.answeredQuestions > 0
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm border border-bloom-sage/10">
                          {workbook.isSubmitted ? (
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : workbook.isDraft ? (
                            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : workbook.answeredQuestions > 0 ? (
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-bloom-dark">
                            Week ${workbook.weekNumber}
                          </h4>
                          <p className="text-sm text-bloom-dark/60">
                            {workbook.isSubmitted ? 'Submitted' : 
                             workbook.isDraft ? 'In Progress' : 
                             workbook.answeredQuestions > 0 ? 'Started' : 'Not Started'}
                          </p>
                        </div>
                      </div>
                      <a
                        href="/simple-workbooks"
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          workbook.isSubmitted
                            ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            : 'bg-bloom-sage text-white hover:bg-bloom-sage/90'
                        }`}
                      >
                        {workbook.isSubmitted ? 'Review' : 'Open'}
                      </a>
                    </div>
                    
                    {!workbook.isSubmitted && workbook.answeredQuestions > 0 && (
                      <div className="mt-3">
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-bloom-sage to-bloompink transition-all duration-300"
                            style={{ width: `${workbook.completionPercentage}%` }}
                          />
                        </div>
                        <div className="text-xs text-bloom-dark/60 mt-1">
                          {workbook.completionPercentage}% complete
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Course-Workbook Connection Explanation */}
              <div className="mt-4 p-3 bg-gradient-to-r from-bloom-sage-50/20 to-bloompink-50/20 rounded-lg border border-bloom-sage/10">
                <p className="text-xs text-bloom-dark/70">
                  <span className="font-medium">💡 How it works:</span> Each lesson has reflection prompts • Complete them at your own pace • Your responses help Dr. Jana understand your journey
                </p>
              </div>
            </div>
          ))}

          {/* Enhanced Achievements Section */}
          <div className="bg-white rounded-xl shadow-sm border border-bloom-sage/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-bloom-dark">Achievements</h3>
              </div>
              <span className="text-sm font-medium text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full">
                {profile?.total_stars || achievements.reduce((sum, a) => sum + a.points, 0)} stars
              </span>
            </div>
            
            {achievements.length > 0 ? (
              <div className="space-y-3">
                {achievements.slice(0, 6).map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-xl">{achievement.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-bloom-dark">{achievement.name}</h4>
                      <p className="text-sm text-bloom-dark/60">{achievement.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-bloom-dark">{achievement.points} stars</div>
                      {achievement.earnedAt && (
                        <div className="text-xs text-bloom-dark/60">
                          {new Date(achievement.earnedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {achievements.length > 6 && (
                  <div className="text-center pt-2">
                    <p className="text-bloom-sage text-sm">
                      Showing 6 of {achievements.length} achievements
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl text-gray-400">⭐</span>
                </div>
                <p className="text-bloom-dark/60 text-sm mb-4">Complete activities to earn your first stars!</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-bloom-dark/50">
                  <div>• Complete lessons</div>
                  <div>• Submit workbooks</div>
                  <div>• Attend workshops</div>
                  <div>• Book appointments</div>
                </div>
              </div>
            )}
          </div>


          {/* Your Progress & Next Steps */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-bloom-dark mb-4 flex items-center gap-2">
              <span className="text-xl">📊</span>
              Your Progress & Next Steps
            </h3>
            
            {(() => {
              const enrolledCourses = allCourses.filter(c => c.isEnrolled).length;
              const completedWorkbooks = courseWorkbooks.reduce((total, course) => 
                total + course.workbooks.filter(w => w.isSubmitted).length, 0
              );
              const hasActivity = enrolledCourses > 0 || completedWorkbooks > 0 || achievements.length > 0;
              
              if (!hasActivity) {
                return (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-bloom-sage-100 to-bloompink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-bloom-dark mb-2">Ready to Begin Your Journey?</h4>
                    <p className="text-bloom-dark/60 mb-6">Choose how you'd like to start building your wellness foundation:</p>
                    
                    <div className="grid gap-3 max-w-md mx-auto">
                      <a 
                        href="/courses" 
                        className="flex items-center gap-3 p-3 bg-gradient-to-r from-bloom-sage-50 to-bloom-sage-100 border border-bloom-sage-200 rounded-lg hover:border-bloom-sage-300 transition-all group"
                      >
                        <div className="w-10 h-10 bg-bloom-sage rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-bloom-sage">Start a Course</div>
                          <div className="text-xs text-bloom-dark/60">Self-paced learning</div>
                        </div>
                      </a>
                      
                      <a 
                        href="/book" 
                        className="flex items-center gap-3 p-3 bg-gradient-to-r from-bloompink-50 to-bloompink-100 border border-bloompink-200 rounded-lg hover:border-bloompink-300 transition-all group"
                      >
                        <div className="w-10 h-10 bg-bloompink rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-bloompink">Book a Session</div>
                          <div className="text-xs text-bloom-dark/60">1:1 support</div>
                        </div>
                      </a>
                    </div>
                  </div>
                );
              }
              
              return (
                <div className="space-y-4">
                  {/* Progress Summary */}
                  <div className="bg-gradient-to-r from-bloom-sage-50 to-bloompink/10 rounded-lg p-4">
                    <div className="grid grid-cols-4 gap-3 text-center">
                      <div>
                        <div className="text-2xl font-bold text-bloom-sage">{enrolledCourses}</div>
                        <div className="text-xs text-bloom-dark/60">Active Courses</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-bloompink">{completedWorkbooks}</div>
                        <div className="text-xs text-bloom-dark/60">Workbooks Done</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-bloom-accent">{upcomingAppointments.length}</div>
                        <div className="text-xs text-bloom-dark/60">Upcoming Sessions</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">{profile?.total_stars || 0}</div>
                        <div className="text-xs text-bloom-dark/60">Stars Earned</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <a 
                      href="/my-courses" 
                      className="flex items-center gap-2 p-3 bg-bloom-sage/10 rounded-lg hover:bg-bloom-sage/20 transition-colors"
                    >
                      <svg className="w-4 h-4 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      <span className="text-sm font-medium text-bloom-sage">Continue Learning</span>
                    </a>
                    <a 
                      href="/simple-workbooks" 
                      className="flex items-center gap-2 p-3 bg-bloompink/10 rounded-lg hover:bg-bloompink/20 transition-colors"
                    >
                      <svg className="w-4 h-4 text-bloompink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" />
                      </svg>
                      <span className="text-sm font-medium text-bloompink">Work on Reflection</span>
                    </a>
                  </div>
                </div>
              );
            })()}

          </div>

            {/* Compact Motivational Insight */}
            <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <div className="text-sm text-bloom-dark/80">
                {(() => {
                  const enrolledCourses = allCourses.filter(c => c.isEnrolled);
                  const courseProgress = enrolledCourses.length > 0 
                    ? enrolledCourses.reduce((sum, c) => sum + c.progress, 0) / enrolledCourses.length
                    : 0;
                  const totalWorkbooks = courseWorkbooks.reduce((total, course) => total + course.workbooks.length, 0);
                  const completedWorkbooks = courseWorkbooks.reduce((total, course) => 
                    total + course.workbooks.filter(w => w.isSubmitted).length, 0
                  );
                  const workbookProgress = totalWorkbooks > 0 ? (completedWorkbooks / totalWorkbooks) * 100 : 0;
                  const hasUpcomingAppointments = upcomingAppointments.length > 0;
                  
                  if (courseProgress > 50 && workbookProgress > 50) {
                    return <span>🌟 Incredible progress! Your commitment is showing real results.</span>;
                  } else if (courseProgress > 25) {
                    return <span>📚 Great learning momentum! Consider adding workbook reflections.</span>;
                  } else if (workbookProgress > 25) {
                    return <span>📝 Thoughtful reflections! Pair with course lessons for more growth.</span>;
                  } else if (hasUpcomingAppointments) {
                    return <span>🤝 Great job scheduling! You're taking action toward your goals.</span>;
                  } else {
                    return <span>🌱 Every wellness journey starts with a single step. You're here!</span>;
                  }
                })()}
              </div>
            </div>
          </div>

          </div>
        </div>
      </div>
      
      {/* Toast Notifications */}
      <Toast messages={toastMessages} onRemove={removeToast} />
    </div>
  );
}