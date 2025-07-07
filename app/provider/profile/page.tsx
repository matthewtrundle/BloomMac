'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { motion } from 'framer-motion';

interface ProviderProfile {
  id: string;
  first_name: string;
  last_name: string;
  title: string;
  bio: string;
  specializations: string[];
  languages: string[];
  calendly_url: string;
  hourly_rate: number;
  license_number: string;
  license_state: string;
  years_experience: number;
}

export default function ProviderProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const supabase = useSupabaseClient();
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('therapist_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bloom-sage mx-auto"></div>
          <p className="mt-4 text-bloom-dark/60">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50">
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h1 className="text-3xl font-playfair text-bloom-dark mb-8">Your Profile</h1>
          {profile ? (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-lg text-gray-800">{profile.first_name} {profile.last_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Title</label>
                <p className="text-lg text-gray-800">{profile.title}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Bio</label>
                <p className="text-lg text-gray-800">{profile.bio}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Specializations</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.specializations.map(spec => (
                    <span key={spec} className="px-3 py-1 bg-bloom-sage-100 text-bloom-sage-800 rounded-full text-sm">{spec}</span>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Languages</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.languages.map(lang => (
                    <span key={lang} className="px-3 py-1 bg-bloom-sage-100 text-bloom-sage-800 rounded-full text-sm">{lang}</span>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Calendly URL</label>
                <p className="text-lg text-gray-800">{profile.calendly_url}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Hourly Rate</label>
                <p className="text-lg text-gray-800">${profile.hourly_rate}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">License</label>
                <p className="text-lg text-gray-800">{profile.license_number} ({profile.license_state})</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Years of Experience</label>
                <p className="text-lg text-gray-800">{profile.years_experience}</p>
              </div>
            </div>
          ) : (
            <p>No profile found.</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
