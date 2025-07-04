'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  postpartum_date?: string;
  baby_due_date?: string;
  number_of_children?: number;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  timezone?: string;
}

export default function SimpleEditProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    first_name: '',
    last_name: '',
    phone: '',
    postpartum_date: '',
    baby_due_date: '',
    number_of_children: 1,
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const response = await fetch('/api/profile/get');

      if (response.ok) {
        const data = await response.json();
        if (data.profile) {
          setProfile({
            id: data.profile.id || user.id,
            first_name: data.profile.first_name || user.user_metadata?.first_name || '',
            last_name: data.profile.last_name || user.user_metadata?.last_name || '',
            phone: data.profile.phone || '',
            postpartum_date: data.profile.postpartum_date || '',
            baby_due_date: data.profile.baby_due_date || '',
            number_of_children: data.profile.number_of_children || 1,
            emergency_contact_name: data.profile.emergency_contact_name || '',
            emergency_contact_phone: data.profile.emergency_contact_phone || '',
            emergency_contact_relationship: data.profile.emergency_contact_relationship || '',
            timezone: data.profile.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
          });
        }
      } else {
        console.error('Failed to fetch profile:', response.status);
        setMessage({ type: 'error', text: 'Failed to load profile data' });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile data' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: profile.first_name.trim(),
          last_name: profile.last_name.trim(),
          phone: profile.phone?.trim() || null,
          postpartum_date: profile.postpartum_date || null,
          baby_due_date: profile.baby_due_date || null,
          number_of_children: profile.number_of_children || null,
          emergency_contact_name: profile.emergency_contact_name?.trim() || null,
          emergency_contact_phone: profile.emergency_contact_phone?.trim() || null,
          emergency_contact_relationship: profile.emergency_contact_relationship?.trim() || null,
          timezone: profile.timezone || null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        // Update local state with the saved data
        if (data.profile) {
          setProfile(prev => ({ ...prev, ...data.profile }));
        }
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        const errorData = await response.json();
        console.error('Profile update failed:', errorData);
        setMessage({ 
          type: 'error', 
          text: errorData.details || errorData.error || 'Failed to update profile. Please try again.' 
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile' });
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
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h1 className="text-3xl font-playfair text-bloom-dark mb-2">
              Edit Your Profile
            </h1>
            <p className="text-bloom-dark/60">
              Update your information to help us provide better personalized support.
            </p>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
            <div className="grid gap-8">
              {/* Personal Information */}
              <div>
                <h2 className="text-xl font-semibold text-bloom-dark mb-4 flex items-center gap-2">
                  <span className="text-2xl">👤</span>
                  Personal Information
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-bloom-dark mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      required
                      value={profile.first_name}
                      onChange={(e) => setProfile(prev => ({ ...prev, first_name: e.target.value }))}
                      className="w-full px-4 py-3 border border-bloom-sage/20 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-bloom-dark mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      required
                      value={profile.last_name}
                      onChange={(e) => setProfile(prev => ({ ...prev, last_name: e.target.value }))}
                      className="w-full px-4 py-3 border border-bloom-sage/20 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-bloom-dark mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-bloom-sage/20 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <label htmlFor="number_of_children" className="block text-sm font-medium text-bloom-dark mb-2">
                      Number of Children
                    </label>
                    <select
                      id="number_of_children"
                      value={profile.number_of_children}
                      onChange={(e) => setProfile(prev => ({ ...prev, number_of_children: parseInt(e.target.value) }))}
                      className="w-full px-4 py-3 border border-bloom-sage/20 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                    >
                      <option value={0}>Expecting first child</option>
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'child' : 'children'}
                        </option>
                      ))}
                      <option value={7}>7+ children</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Maternal Health */}
              <div>
                <h2 className="text-xl font-semibold text-bloom-dark mb-4 flex items-center gap-2">
                  <span className="text-2xl">👶</span>
                  Maternal Health Information
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="postpartum_date" className="block text-sm font-medium text-bloom-dark mb-2">
                      Baby's Birth Date
                    </label>
                    <input
                      type="date"
                      id="postpartum_date"
                      value={profile.postpartum_date}
                      onChange={(e) => setProfile(prev => ({ ...prev, postpartum_date: e.target.value }))}
                      className="w-full px-4 py-3 border border-bloom-sage/20 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="baby_due_date" className="block text-sm font-medium text-bloom-dark mb-2">
                      Due Date (if expecting)
                    </label>
                    <input
                      type="date"
                      id="baby_due_date"
                      value={profile.baby_due_date}
                      onChange={(e) => setProfile(prev => ({ ...prev, baby_due_date: e.target.value }))}
                      className="w-full px-4 py-3 border border-bloom-sage/20 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h2 className="text-xl font-semibold text-bloom-dark mb-4 flex items-center gap-2">
                  <span className="text-2xl">🚨</span>
                  Emergency Contact
                </h2>
                <div className="grid gap-6">
                  <div>
                    <label htmlFor="emergency_contact_name" className="block text-sm font-medium text-bloom-dark mb-2">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      id="emergency_contact_name"
                      value={profile.emergency_contact_name}
                      onChange={(e) => setProfile(prev => ({ ...prev, emergency_contact_name: e.target.value }))}
                      className="w-full px-4 py-3 border border-bloom-sage/20 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                      placeholder="Full name"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="emergency_contact_phone" className="block text-sm font-medium text-bloom-dark mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="emergency_contact_phone"
                        value={profile.emergency_contact_phone}
                        onChange={(e) => setProfile(prev => ({ ...prev, emergency_contact_phone: e.target.value }))}
                        className="w-full px-4 py-3 border border-bloom-sage/20 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <label htmlFor="emergency_contact_relationship" className="block text-sm font-medium text-bloom-dark mb-2">
                        Relationship
                      </label>
                      <select
                        id="emergency_contact_relationship"
                        value={profile.emergency_contact_relationship}
                        onChange={(e) => setProfile(prev => ({ ...prev, emergency_contact_relationship: e.target.value }))}
                        className="w-full px-4 py-3 border border-bloom-sage/20 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                      >
                        <option value="">Select relationship</option>
                        <option value="spouse">Spouse</option>
                        <option value="partner">Partner</option>
                        <option value="parent">Parent</option>
                        <option value="sibling">Sibling</option>
                        <option value="friend">Friend</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-bloom-sage/20">
                <Button
                  type="submit"
                  variant="pink"
                  disabled={saving}
                  className="flex-1"
                >
                  {saving ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Saving...
                    </div>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                  disabled={saving}
                  className="flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}