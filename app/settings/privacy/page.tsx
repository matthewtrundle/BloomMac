'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface PrivacySettings {
  marketingEmails: boolean;
  workshopNotifications: boolean;
  appointmentReminders: boolean;
  courseUpdates: boolean;
  communityNotifications: boolean;
  profileVisibility: 'private' | 'community' | 'public';
  shareProgress: boolean;
  allowDataAnalytics: boolean;
}

export default function PrivacySettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = useSupabaseClient();
  
  const [settings, setSettings] = useState<PrivacySettings>({
    marketingEmails: true,
    workshopNotifications: true,
    appointmentReminders: true,
    courseUpdates: true,
    communityNotifications: false,
    profileVisibility: 'private',
    shareProgress: false,
    allowDataAnalytics: true
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchPrivacySettings();
    }
  }, [user]);

  const fetchPrivacySettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('privacy_settings')
        .eq('user_id', user.id)
        .single();

      if (data?.privacy_settings) {
        setSettings(data.privacy_settings);
      }
    } catch (error) {
      console.error('Error fetching privacy settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!user) return;

    setSaving(true);
    setShowSuccess(false);

    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          privacy_settings: settings,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving privacy settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (key: keyof PrivacySettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleVisibilityChange = (visibility: 'private' | 'community' | 'public') => {
    setSettings(prev => ({
      ...prev,
      profileVisibility: visibility
    }));
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bloom-sage mx-auto"></div>
          <p className="mt-4 text-bloom-dark/60">Loading privacy settings...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-bloom-sage/10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-bloom-dark/60 hover:text-bloom-dark transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-2xl font-playfair text-bloom-dark">Privacy Settings</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-green-100 border border-green-400 rounded-lg flex items-center gap-3"
            >
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-700">Privacy settings saved successfully!</span>
            </motion.div>
          )}

          {/* Email Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-6"
          >
            <h2 className="text-xl font-semibold text-bloom-dark mb-6 flex items-center gap-2">
              <span className="text-2xl">📧</span>
              Email Notifications
            </h2>
            
            <div className="space-y-4">
              <ToggleOption
                label="Marketing Emails"
                description="Receive updates about new courses, workshops, and special offers"
                checked={settings.marketingEmails}
                onChange={() => handleToggle('marketingEmails')}
              />
              
              <ToggleOption
                label="Workshop Notifications"
                description="Get reminders about upcoming workshops you've registered for"
                checked={settings.workshopNotifications}
                onChange={() => handleToggle('workshopNotifications')}
              />
              
              <ToggleOption
                label="Appointment Reminders"
                description="Receive reminders about your scheduled appointments"
                checked={settings.appointmentReminders}
                onChange={() => handleToggle('appointmentReminders')}
              />
              
              <ToggleOption
                label="Course Updates"
                description="Get notified about new content and updates in your enrolled courses"
                checked={settings.courseUpdates}
                onChange={() => handleToggle('courseUpdates')}
              />
              
              <ToggleOption
                label="Community Notifications"
                description="Receive updates from the Bloom community forums"
                checked={settings.communityNotifications}
                onChange={() => handleToggle('communityNotifications')}
              />
            </div>
          </motion.div>

          {/* Profile Privacy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-6"
          >
            <h2 className="text-xl font-semibold text-bloom-dark mb-6 flex items-center gap-2">
              <span className="text-2xl">🔒</span>
              Profile Privacy
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-bloom-dark mb-3">
                  Profile Visibility
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border border-bloom-sage/20 rounded-lg cursor-pointer hover:bg-bloom-sage-50/30 transition-colors">
                    <input
                      type="radio"
                      name="visibility"
                      checked={settings.profileVisibility === 'private'}
                      onChange={() => handleVisibilityChange('private')}
                      className="text-bloom-sage focus:ring-bloom-sage"
                    />
                    <div>
                      <p className="font-medium text-bloom-dark">Private</p>
                      <p className="text-sm text-bloom-dark/60">Only you can see your profile</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 p-3 border border-bloom-sage/20 rounded-lg cursor-pointer hover:bg-bloom-sage-50/30 transition-colors">
                    <input
                      type="radio"
                      name="visibility"
                      checked={settings.profileVisibility === 'community'}
                      onChange={() => handleVisibilityChange('community')}
                      className="text-bloom-sage focus:ring-bloom-sage"
                    />
                    <div>
                      <p className="font-medium text-bloom-dark">Community</p>
                      <p className="text-sm text-bloom-dark/60">Other Bloom members can see your profile</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 p-3 border border-bloom-sage/20 rounded-lg cursor-pointer hover:bg-bloom-sage-50/30 transition-colors">
                    <input
                      type="radio"
                      name="visibility"
                      checked={settings.profileVisibility === 'public'}
                      onChange={() => handleVisibilityChange('public')}
                      className="text-bloom-sage focus:ring-bloom-sage"
                    />
                    <div>
                      <p className="font-medium text-bloom-dark">Public</p>
                      <p className="text-sm text-bloom-dark/60">Anyone can see your profile</p>
                    </div>
                  </label>
                </div>
              </div>
              
              <ToggleOption
                label="Share Progress"
                description="Allow other members to see your course progress and achievements"
                checked={settings.shareProgress}
                onChange={() => handleToggle('shareProgress')}
              />
            </div>
          </motion.div>

          {/* Data & Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-6"
          >
            <h2 className="text-xl font-semibold text-bloom-dark mb-6 flex items-center gap-2">
              <span className="text-2xl">📊</span>
              Data & Analytics
            </h2>
            
            <ToggleOption
              label="Allow Data Analytics"
              description="Help us improve Bloom by sharing anonymous usage data"
              checked={settings.allowDataAnalytics}
              onChange={() => handleToggle('allowDataAnalytics')}
            />
            
            <div className="mt-4 p-4 bg-bloom-sage-50/30 rounded-lg">
              <p className="text-sm text-bloom-dark/70">
                We take your privacy seriously. All data is anonymized and used solely to improve 
                our services. You can opt out at any time.
              </p>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-end gap-4"
          >
            <Link
              href="/dashboard"
              className="px-6 py-3 text-bloom-dark/60 hover:text-bloom-dark transition-colors"
            >
              Cancel
            </Link>
            <button
              onClick={saveSettings}
              disabled={saving}
              className="px-8 py-3 bg-bloom-sage text-white rounded-lg hover:bg-bloom-sage/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 text-center text-sm text-bloom-dark/60"
          >
            <p>
              Have questions about your privacy? Check out our{' '}
              <Link href="/privacy-policy" className="text-bloom-sage hover:underline">
                Privacy Policy
              </Link>{' '}
              or{' '}
              <Link href="/contact" className="text-bloom-sage hover:underline">
                contact us
              </Link>.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Toggle Option Component
function ToggleOption({ 
  label, 
  description, 
  checked, 
  onChange 
}: { 
  label: string; 
  description: string; 
  checked: boolean; 
  onChange: () => void;
}) {
  return (
    <label className="flex items-start gap-4 cursor-pointer group">
      <div className="relative mt-1">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div className={`w-12 h-6 rounded-full transition-colors ${
          checked ? 'bg-bloom-sage' : 'bg-gray-300'
        }`}>
          <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-0'
          }`} />
        </div>
      </div>
      <div className="flex-1">
        <p className="font-medium text-bloom-dark group-hover:text-bloom-sage transition-colors">
          {label}
        </p>
        <p className="text-sm text-bloom-dark/60 mt-0.5">{description}</p>
      </div>
    </label>
  );
}