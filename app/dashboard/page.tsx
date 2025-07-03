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

export default function SimpleDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
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
      
      // Simple fetch without external dependencies
      const response = await fetch('/api/profile/get', {
        headers: {
          'Authorization': `Bearer ${user.access_token || ''}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
        
        // Fetch achievements if profile loaded successfully
        if (data.profile) {
          try {
            const achievementsResponse = await fetch('/api/achievements/get', {
              headers: {
                'Authorization': `Bearer ${user.access_token || ''}`,
              },
            });
            
            if (achievementsResponse.ok) {
              const achievementsData = await achievementsResponse.json();
              setAchievements(achievementsData.achievements || []);
            }
          } catch (achievementError) {
            console.error('Failed to fetch achievements:', achievementError);
            // Don't fail the whole dashboard for achievements
          }
        }
      } else {
        console.error('Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Unable to load profile data');
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

          {/* Achievements Section */}
          {achievements.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-bloom-dark mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  Your Stars
                </span>
                <span className="text-sm text-bloom-sage">
                  {profile?.total_stars || achievements.length} stars earned
                </span>
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {achievements.slice(0, 12).map((achievement) => (
                  <div key={achievement.id} className="text-center group">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg group-hover:scale-110 transition-transform">
                      <span className="text-xl">{achievement.icon}</span>
                    </div>
                    <p className="text-xs text-bloom-dark/60 leading-tight">{achievement.name}</p>
                  </div>
                ))}
                {achievements.length === 0 && (
                  <div className="col-span-full text-center py-4">
                    <p className="text-bloom-dark/60 text-sm">Complete activities to earn your first star!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Profile Completeness */}
          {profile && getProfileCompleteness() < 100 && (
            <div className="bg-gradient-to-r from-bloom-sage-50 to-bloompink/10 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-bloom-dark mb-3 flex items-center gap-2">
                <span className="text-xl">✨</span>
                Complete Your Profile
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 bg-white rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-bloom-sage to-bloompink transition-all duration-300"
                    style={{ width: `${getProfileCompleteness()}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-bloom-dark">{getProfileCompleteness()}%</span>
              </div>
              <p className="text-sm text-bloom-dark/70 mb-3">
                A complete profile helps us provide better personalized support.
              </p>
              {/* Show specific missing items */}
              <div className="mb-4">
                <p className="text-xs text-bloom-dark/60 mb-2">Missing information:</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  {!profile.phone && (
                    <span className="px-2 py-1 bg-white rounded-full text-bloom-dark/70">• Phone number</span>
                  )}
                  {!profile.postpartum_date && (
                    <span className="px-2 py-1 bg-white rounded-full text-bloom-dark/70">• Baby's birth date</span>
                  )}
                  {!profile.emergency_contact_name && (
                    <span className="px-2 py-1 bg-white rounded-full text-bloom-dark/70">• Emergency contact</span>
                  )}
                </div>
              </div>
              <a 
                href="/profile/edit"
                className="inline-flex items-center gap-2 px-4 py-2 bg-bloom-sage text-white rounded-lg hover:bg-bloom-sage/90 transition-colors text-sm"
              >
                <span>Update Profile</span>
                <span>→</span>
              </a>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-bloom-dark mb-4">Quick Actions</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <a 
                href="/courses" 
                className="flex items-center gap-3 p-4 bg-bloom-sage-50 rounded-lg hover:bg-bloom-sage-100 transition-colors"
              >
                <span className="text-2xl">📚</span>
                <div>
                  <h4 className="font-medium text-bloom-dark">Browse Courses</h4>
                  <p className="text-sm text-bloom-gray-600">Discover wellness programs</p>
                </div>
              </a>
              <a 
                href="/appointments" 
                className="flex items-center gap-3 p-4 bg-bloompink/10 rounded-lg hover:bg-bloompink/20 transition-colors"
              >
                <span className="text-2xl">📅</span>
                <div>
                  <h4 className="font-medium text-bloom-dark">Book Session</h4>
                  <p className="text-sm text-bloom-gray-600">Schedule with Dr. Jana</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}