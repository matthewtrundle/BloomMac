'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

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

export default function EditProviderProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'specializations' | 'languages') => {
    const { value } = e.target;
    setProfile(prev => prev ? { ...prev, [field]: value.split(',').map(s => s.trim()) } : null);
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('therapist_profiles')
        .update(profile)
        .eq('id', profile.id);

      if (error) {
        console.error('Error updating profile:', error);
      } else {
        router.push('/provider/profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
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
          <h1 className="text-3xl font-playfair text-bloom-dark mb-8">Edit Your Profile</h1>
          {profile ? (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-500">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={profile.first_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloom-accent focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={profile.last_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloom-accent focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Title</label>
                <input
                  type="text"
                  name="title"
                  value={profile.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloom-accent focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Bio</label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloom-accent focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Specializations (comma-separated)</label>
                <input
                  type="text"
                  name="specializations"
                  value={profile.specializations.join(', ')}
                  onChange={(e) => handleArrayChange(e, 'specializations')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloom-accent focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Languages (comma-separated)</label>
                <input
                  type="text"
                  name="languages"
                  value={profile.languages.join(', ')}
                  onChange={(e) => handleArrayChange(e, 'languages')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloom-accent focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Calendly URL</label>
                <input
                  type="text"
                  name="calendly_url"
                  value={profile.calendly_url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloom-accent focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Hourly Rate</label>
                <input
                  type="number"
                  name="hourly_rate"
                  value={profile.hourly_rate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloom-accent focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">License Number</label>
                <input
                  type="text"
                  name="license_number"
                  value={profile.license_number}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloom-accent focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">License State</label>
                <input
                  type="text"
                  name="license_state"
                  value={profile.license_state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloom-accent focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Years of Experience</label>
                <input
                  type="number"
                  name="years_experience"
                  value={profile.years_experience}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloom-accent focus:border-transparent"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 bg-bloom-sage text-white rounded-lg hover:bg-bloom-sage-dark transition-colors"
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
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
