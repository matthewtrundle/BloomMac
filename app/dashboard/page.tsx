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
}

export default function SimpleDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
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
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-playfair text-bloom-dark">
                {getGreeting()}, {profile?.first_name || user?.user_metadata?.first_name || 'Beautiful'}
              </h1>
              <p className="text-bloom-dark/60 mt-1">
                Welcome to your wellness hub
              </p>
            </div>
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
              Welcome to Your Wellness Journey
            </h2>
            <p className="text-bloom-gray-600 mb-6">
              You've successfully completed onboarding! Your personalized wellness experience is ready.
            </p>
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