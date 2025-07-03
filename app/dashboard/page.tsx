'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

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
  const [workbookStatuses, setWorkbookStatuses] = useState<WorkbookStatus[]>([]);
  const [courseStats, setCourseStats] = useState<CourseStats | null>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<UpcomingAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const fetchBasicData = async () => {
    if (!user) return;

    try {
      setError(null);
      
      // Fetch all dashboard data in parallel
      const [profileResponse, achievementsResponse, workbookResponse, courseResponse, appointmentsResponse] = await Promise.allSettled([
        fetch('/api/profile/get', {
          headers: { 'Authorization': `Bearer ${user.access_token || ''}` },
        }),
        fetch('/api/achievements/get', {
          headers: { 'Authorization': `Bearer ${user.access_token || ''}` },
        }),
        fetch('/api/workbook/status', {
          headers: { 'Authorization': `Bearer ${user.access_token || ''}` },
        }),
        fetch('/api/course/stats', {
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
      }

      // Handle achievements response
      if (achievementsResponse.status === 'fulfilled' && achievementsResponse.value.ok) {
        const data = await achievementsResponse.value.json();
        setAchievements(data.achievements || []);
      }

      // Handle workbook response (may not exist yet)
      if (workbookResponse.status === 'fulfilled' && workbookResponse.value.ok) {
        const data = await workbookResponse.value.json();
        setWorkbookStatuses(data.workbooks || []);
      } else {
        // Create mock workbook data for now
        const mockWorkbooks: WorkbookStatus[] = Array.from({ length: 6 }, (_, i) => ({
          weekNumber: i + 1,
          totalQuestions: 12,
          answeredQuestions: 0,
          isDraft: false,
          isSubmitted: false,
          completionPercentage: 0,
        }));
        setWorkbookStatuses(mockWorkbooks);
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
    const firstName = profile?.first_name || user?.user_metadata?.first_name || 'Beautiful Mama';
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
          greeting: `${getGreeting()}, amazing ${firstName}`,
          subtitle: "Every day you're growing stronger, wiser, and more beautiful in your motherhood",
          quote: "\"You are not the same woman who entered motherhood. You are braver, more intuitive, and infinitely more capable than you knew.\"",
          journeyInfo: `${Math.floor(daysSince / 30)} months into this incredible journey • You're becoming exactly who you were meant to be`
        };
      }
    }
    
    if (numChildren === 0) {
      return {
        greeting: `${getGreeting()}, beautiful ${firstName}`,
        subtitle: "Your heart is preparing for the greatest love story you'll ever know",
        quote: "\"A baby is something you carry inside you for nine months, in your arms for three years, and in your heart until the day you die.\"",
        journeyInfo: "Expecting your first miracle • Your body is creating life, and your heart is expanding in ways you never imagined"
      };
    } else if (numChildren === 1) {
      return {
        greeting: `${getGreeting()}, wonderful ${firstName}`,
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
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50">
      {/* Dashboard Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-bloom-sage/10">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl">
            <h1 className="text-3xl font-playfair text-bloom-dark mb-2">
              {getPersonalizedMessage().greeting}
            </h1>
            <p className="text-lg text-bloom-dark/70 mb-4 font-light">
              {getPersonalizedMessage().subtitle}
            </p>
            <div className="bg-gradient-to-r from-bloom-sage-50 to-bloompink/10 rounded-xl p-4 mb-4">
              <p className="text-bloom-dark/80 italic text-center font-light">
                {getPersonalizedMessage().quote}
              </p>
            </div>
            <p className="text-bloom-dark/60">
              {getPersonalizedMessage().journeyInfo}
            </p>
            {/* Debug info - remove later */}
            {process.env.NODE_ENV === 'development' && profile && (
              <div className="text-xs text-gray-500 mt-2">
                Debug: postpartum_date = {profile.postpartum_date || 'not set'}, 
                children = {profile.number_of_children || 'not set'}, 
                days_since = {getDaysSincePostpartum()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid gap-8">
          {/* Welcome Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-bloompink to-bloom-sage rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🌸</span>
            </div>
            <h2 className="text-2xl font-bold text-bloom-dark mb-4">
              {profile?.first_name ? `Welcome ${profile.first_name}!` : 'Welcome to Your Wellness Journey'}
            </h2>
            <p className="text-bloom-gray-600 mb-6">
              {profile ? (
                `You've successfully completed onboarding! Your personalized wellness experience is ready.`
              ) : (
                'Loading your personalized wellness experience...'
              )}
            </p>
            {/* Show wellness focus areas */}
            {profile && (
              <div className="bg-bloom-sage-50 rounded-lg p-4 mb-6 text-left">
                <h4 className="font-medium text-bloom-dark mb-3">Your Wellness Focus:</h4>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-bloom-dark/70">
                    <span className="text-lg">🧘‍♀️</span>
                    <span>Mind & emotional wellbeing</span>
                  </div>
                  <div className="flex items-center gap-2 text-bloom-dark/70">
                    <span className="text-lg">💪</span>
                    <span>Physical recovery & strength</span>
                  </div>
                  <div className="flex items-center gap-2 text-bloom-dark/70">
                    <span className="text-lg">👥</span>
                    <span>Connection & community</span>
                  </div>
                  <div className="flex items-center gap-2 text-bloom-dark/70">
                    <span className="text-lg">🌱</span>
                    <span>Personal growth & healing</span>
                  </div>
                </div>
              </div>
            )}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-bloom-sage-50 rounded-lg p-4">
                <h3 className="font-semibold text-bloom-dark mb-2">Courses</h3>
                <p className="text-sm text-bloom-gray-600">Explore our wellness programs</p>
              </div>
              <div className="bg-bloompink/10 rounded-lg p-4">
                <h3 className="font-semibold text-bloom-dark mb-2">Community</h3>
                <p className="text-sm text-bloom-gray-600">Connect with other mothers</p>
              </div>
              <div className="bg-bloom-accent/10 rounded-lg p-4">
                <h3 className="font-semibold text-bloom-dark mb-2">Support</h3>
                <p className="text-sm text-bloom-gray-600">Book sessions with Dr. Jana</p>
              </div>
            </div>
          </div>

          {/* Course Progress Section */}
          {courseStats && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-bloom-dark mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="text-2xl">🎓</span>
                  Course Progress
                </span>
                <span className="text-sm text-bloom-sage">
                  {courseStats.completionPercentage}% Complete
                </span>
              </h3>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-bloom-sage-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-bloom-dark">{courseStats.weeksCompleted}</div>
                  <div className="text-sm text-bloom-dark/60">Weeks Completed</div>
                </div>
                <div className="bg-bloompink/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-bloom-dark">{courseStats.lessonsCompleted}</div>
                  <div className="text-sm text-bloom-dark/60">Lessons Finished</div>
                </div>
                <div className="bg-bloom-accent/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-bloom-dark">{Math.floor(courseStats.totalTimeSpentMinutes / 60)}h</div>
                  <div className="text-sm text-bloom-dark/60">Time Invested</div>
                </div>
              </div>

              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-gradient-to-r from-bloom-sage to-bloompink transition-all duration-300"
                  style={{ width: `${courseStats.completionPercentage}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-bloom-dark/60">
                  {courseStats.lessonsCompleted} of {courseStats.totalLessons} lessons
                </span>
                <a 
                  href="/my-courses"
                  className="px-4 py-2 bg-bloom-sage text-white rounded-lg hover:bg-bloom-sage/90 transition-colors text-sm"
                >
                  Continue Learning →
                </a>
              </div>
            </div>
          )}

          {/* Appointments Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-bloom-dark mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="text-2xl">📅</span>
                Appointments & Sessions
              </span>
              <a 
                href="/appointments"
                className="text-sm text-bloom-sage hover:text-bloom-sage/80 underline"
              >
                View all →
              </a>
            </h3>
            
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
                            href={`/appointments`}
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
                    <a href="/appointments" className="text-bloom-sage hover:text-bloom-sage/80 text-sm underline">
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
                  href="/appointments"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-bloom-sage text-white rounded-lg hover:bg-bloom-sage/90 transition-colors"
                >
                  <span>📅</span>
                  Book Your First Appointment
                </a>
              </div>
            )}
          </div>

          {/* Workbook Progress Section */}
          {workbookStatuses.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-bloom-dark mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="text-2xl">📝</span>
                  Weekly Workbooks
                </span>
                <span className="text-sm text-bloom-sage">
                  {workbookStatuses.filter(w => w.isSubmitted).length} of 6 submitted
                </span>
              </h3>
              
              <div className="grid md:grid-cols-2 gap-3">
                {workbookStatuses.slice(0, 6).map((workbook) => (
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
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                          {workbook.isSubmitted ? (
                            <span className="text-green-600">✓</span>
                          ) : workbook.isDraft ? (
                            <span className="text-yellow-600">⏳</span>
                          ) : workbook.answeredQuestions > 0 ? (
                            <span className="text-blue-600">📄</span>
                          ) : (
                            <span className="text-gray-400">○</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-bloom-dark">Week {workbook.weekNumber}</h4>
                          <p className="text-sm text-bloom-dark/60">
                            {workbook.isSubmitted ? 'Submitted' : 
                             workbook.isDraft ? 'In Progress' : 
                             workbook.answeredQuestions > 0 ? 'Started' : 'Not Started'}
                          </p>
                        </div>
                      </div>
                      <a
                        href="/my-workbooks"
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
            </div>
          )}

          {/* Enhanced Achievements Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-bloom-dark mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                Your Stars & Achievements
              </span>
              <span className="text-sm text-bloom-sage">
                {profile?.total_stars || achievements.reduce((sum, a) => sum + a.points, 0)} stars earned
              </span>
            </h3>
            
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
                    <a href="/achievements" className="text-bloom-sage hover:text-bloom-sage/80 text-sm underline">
                      View all {achievements.length} achievements →
                    </a>
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

          {/* Compact Profile & Settings Hub */}
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <h3 className="text-lg font-semibold text-bloom-dark mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="text-xl">👤</span>
                Profile & Settings
              </span>
              {profile && getProfileCompleteness() < 100 && (
                <span className="text-xs text-bloom-sage bg-bloom-sage-50 px-2 py-1 rounded-full">
                  {getProfileCompleteness()}% complete
                </span>
              )}
            </h3>
            
            {/* Compact Profile Management Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {/* Edit Profile */}
              <a 
                href="/profile/edit"
                className="flex flex-col items-center gap-2 p-3 bg-bloom-sage-50 rounded-lg hover:bg-bloom-sage-100 transition-colors group text-center"
              >
                <div className="w-8 h-8 bg-bloom-sage rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-white text-sm">✏️</span>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-bloom-dark">Edit Profile</h4>
                </div>
              </a>

              {/* Notification Settings - Remove hash navigation for now */}
              <a 
                href="/profile/edit"
                className="flex flex-col items-center gap-2 p-3 bg-bloompink/10 rounded-lg hover:bg-bloompink/20 transition-colors group text-center"
              >
                <div className="w-8 h-8 bg-bloompink rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-white text-sm">🔔</span>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-bloom-dark">Notifications</h4>
                </div>
              </a>

              {/* Privacy Settings */}
              <a 
                href="/profile/edit"
                className="flex flex-col items-center gap-2 p-3 bg-bloom-accent/10 rounded-lg hover:bg-bloom-accent/20 transition-colors group text-center"
              >
                <div className="w-8 h-8 bg-bloom-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-white text-sm">🔒</span>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-bloom-dark">Privacy</h4>
                </div>
              </a>

              {/* Payment Methods */}
              <a 
                href="/appointments"
                className="flex flex-col items-center gap-2 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group text-center"
              >
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-white text-sm">💳</span>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-bloom-dark">Payment</h4>
                </div>
              </a>

              {/* Account Settings */}
              <a 
                href="/profile/edit"
                className="flex flex-col items-center gap-2 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group text-center"
              >
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-white text-sm">⚙️</span>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-bloom-dark">Account</h4>
                </div>
              </a>

              {/* Data Management */}
              <a 
                href="/profile/edit"
                className="flex flex-col items-center gap-2 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors group text-center"
              >
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-white text-sm">📊</span>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-bloom-dark">Data</h4>
                </div>
              </a>
            </div>

            {/* Profile completeness reminder if needed */}
            {profile && getProfileCompleteness() < 100 && (
              <div className="mt-3 p-2 bg-bloom-sage-50 rounded text-xs text-bloom-dark/70">
                <span className="font-medium">Quick tip:</span> Complete your profile for better personalized support
                {!profile.phone && <span> • Add phone</span>}
                {!profile.postpartum_date && <span> • Add birth date</span>}
                {!profile.emergency_contact_name && <span> • Add emergency contact</span>}
              </div>
            )}
          </div>

          {/* Compact Progress Analytics */}
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <h3 className="text-lg font-semibold text-bloom-dark mb-3 flex items-center gap-2">
              <span className="text-xl">📊</span>
              Your Progress
            </h3>
            
            {/* Overall Progress Summary */}
            <div className="bg-gradient-to-r from-bloom-sage-50 to-bloompink/10 rounded-lg p-3 mb-4">
              <div className="grid grid-cols-4 gap-3 text-center">
                <div>
                  <div className="text-lg font-bold text-bloom-sage">
                    {courseStats ? Math.round(courseStats.totalTimeSpentMinutes / 60) : 0}h
                  </div>
                  <div className="text-xs text-bloom-dark/60">Learning</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-bloompink">
                    {workbookStatuses.filter(w => w.isSubmitted).length}
                  </div>
                  <div className="text-xs text-bloom-dark/60">Workbooks</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-bloom-accent">
                    {upcomingAppointments.length}
                  </div>
                  <div className="text-xs text-bloom-dark/60">Sessions</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-600">
                    {achievements.length}
                  </div>
                  <div className="text-xs text-bloom-dark/60">Stars</div>
                </div>
              </div>
            </div>

            {/* Compact Progress Bars */}
            <div className="space-y-3">
              {/* Course Progress */}
              <div className="flex items-center gap-3">
                <span className="text-sm">🎓</span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Course Progress</span>
                    <span className="font-medium">{courseStats?.completionPercentage || 0}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-bloom-sage transition-all duration-300"
                      style={{ width: `${courseStats?.completionPercentage || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Workbook Progress */}
              <div className="flex items-center gap-3">
                <span className="text-sm">📝</span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Workbook Progress</span>
                    <span className="font-medium">{Math.round((workbookStatuses.filter(w => w.isSubmitted).length / 6) * 100)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-bloompink transition-all duration-300"
                      style={{ width: `${(workbookStatuses.filter(w => w.isSubmitted).length / 6) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Engagement Score */}
              <div className="flex items-center gap-3">
                <span className="text-sm">💫</span>
                <div className="flex-1">
                  {(() => {
                    const engagementScore = Math.min(100, Math.round(
                      ((courseStats?.lessonsCompleted || 0) * 2) + 
                      (workbookStatuses.filter(w => w.isSubmitted).length * 10) + 
                      (achievements.length * 5) + 
                      (upcomingAppointments.length * 10)
                    ));
                    return (
                      <>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Engagement Score</span>
                          <span className="font-medium">{engagementScore}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-bloom-accent transition-all duration-300"
                            style={{ width: `${engagementScore}%` }}
                          ></div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Compact Motivational Insight */}
            <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <div className="text-sm text-bloom-dark/80">
                {(() => {
                  const courseProgress = courseStats?.completionPercentage || 0;
                  const workbookProgress = (workbookStatuses.filter(w => w.isSubmitted).length / 6) * 100;
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

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-bloom-dark mb-4">Quick Actions</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <a 
                href="/my-courses" 
                className="flex items-center gap-3 p-4 bg-bloom-sage-50 rounded-lg hover:bg-bloom-sage-100 transition-colors"
              >
                <span className="text-2xl">🎓</span>
                <div>
                  <h4 className="font-medium text-bloom-dark">My Courses</h4>
                  <p className="text-sm text-bloom-gray-600">Continue learning</p>
                </div>
              </a>
              <a 
                href="/my-workbooks" 
                className="flex items-center gap-3 p-4 bg-bloompink/10 rounded-lg hover:bg-bloompink/20 transition-colors"
              >
                <span className="text-2xl">📝</span>
                <div>
                  <h4 className="font-medium text-bloom-dark">My Workbooks</h4>
                  <p className="text-sm text-bloom-gray-600">View submissions</p>
                </div>
              </a>
              <a 
                href="/appointments" 
                className="flex items-center gap-3 p-4 bg-bloom-accent/10 rounded-lg hover:bg-bloom-accent/20 transition-colors"
              >
                <span className="text-2xl">📅</span>
                <div>
                  <h4 className="font-medium text-bloom-dark">Appointments</h4>
                  <p className="text-sm text-bloom-gray-600">Book with Dr. Jana</p>
                </div>
              </a>
              <a 
                href="/settings" 
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-2xl">⚙️</span>
                <div>
                  <h4 className="font-medium text-bloom-dark">Settings</h4>
                  <p className="text-sm text-bloom-gray-600">Manage account</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}