'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Calendar, 
  DollarSign, 
  GraduationCap,
  Users,
  Moon,
  Check,
  Loader2
} from 'lucide-react';

interface NotificationSetting {
  key: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  email: boolean;
  sms: boolean;
  push: boolean;
}

export default function NotificationPreferences() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      key: 'appointment_reminders',
      label: 'Appointment Reminders',
      description: 'Get reminders before your scheduled appointments',
      icon: <Calendar className="h-5 w-5" />,
      email: true,
      sms: true,
      push: true
    },
    {
      key: 'course_updates',
      label: 'Course Updates',
      description: 'New lessons, content updates, and announcements',
      icon: <GraduationCap className="h-5 w-5" />,
      email: true,
      sms: false,
      push: true
    },
    {
      key: 'community_activity',
      label: 'Community Activity',
      description: 'Replies to your posts and community mentions',
      icon: <Users className="h-5 w-5" />,
      email: false,
      sms: false,
      push: true
    },
    {
      key: 'wellness_reminders',
      label: 'Wellness Check-ins',
      description: 'Gentle reminders for self-care and progress tracking',
      icon: <Bell className="h-5 w-5" />,
      email: true,
      sms: false,
      push: true
    },
    {
      key: 'billing_updates',
      label: 'Billing & Payments',
      description: 'Payment confirmations and billing notifications',
      icon: <DollarSign className="h-5 w-5" />,
      email: true,
      sms: false,
      push: false
    }
  ]);

  const [quietHours, setQuietHours] = useState({
    enabled: false,
    startTime: '22:00',
    endTime: '08:00'
  });

  useEffect(() => {
    if (user) {
      fetchPreferences();
    }
  }, [user]);

  async function fetchPreferences() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data?.notification_preferences) {
        // Update notifications state with saved preferences
        setNotifications(prev => prev.map(notif => ({
          ...notif,
          ...(data.notification_preferences[notif.key] || {})
        })));
      }

      if (data?.quiet_hours) {
        setQuietHours(data.quiet_hours);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  }

  async function savePreferences() {
    try {
      setSaving(true);
      setMessage(null);

      const notificationPrefs = notifications.reduce((acc, notif) => ({
        ...acc,
        [notif.key]: {
          email: notif.email,
          sms: notif.sms,
          push: notif.push
        }
      }), {});

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user!.id,
          notification_preferences: notificationPrefs,
          quiet_hours: quietHours,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Notification preferences saved successfully!' });
    } catch (error) {
      console.error('Error saving preferences:', error);
      setMessage({ type: 'error', text: 'Failed to save preferences' });
    } finally {
      setSaving(false);
    }
  }

  const toggleNotification = (key: string, type: 'email' | 'sms' | 'push') => {
    setNotifications(prev => prev.map(notif => 
      notif.key === key ? { ...notif, [type]: !notif[type] } : notif
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-bloompink" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg flex items-center space-x-2 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800' 
            : 'bg-red-50 text-red-800'
        }`}>
          <Check className="h-5 w-5" />
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      {/* Notification Channels */}
      <div>
        <h3 className="text-lg font-medium mb-4">Notification Channels</h3>
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div key={notif.key} className="border rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="text-bloompink mt-1">{notif.icon}</div>
                <div className="flex-1">
                  <h4 className="font-medium">{notif.label}</h4>
                  <p className="text-sm text-bloom-gray-600 mb-3">{notif.description}</p>
                  
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notif.email}
                        onChange={() => toggleNotification(notif.key, 'email')}
                        className="rounded text-bloompink focus:ring-bloompink"
                      />
                      <span className="text-sm flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </span>
                    </label>
                    
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notif.sms}
                        onChange={() => toggleNotification(notif.key, 'sms')}
                        className="rounded text-bloompink focus:ring-bloompink"
                      />
                      <span className="text-sm flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        SMS
                      </span>
                    </label>
                    
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notif.push}
                        onChange={() => toggleNotification(notif.key, 'push')}
                        className="rounded text-bloompink focus:ring-bloompink"
                      />
                      <span className="text-sm flex items-center">
                        <Bell className="h-4 w-4 mr-1" />
                        Push
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quiet Hours */}
      <div>
        <h3 className="text-lg font-medium mb-4">Quiet Hours</h3>
        <div className="border rounded-lg p-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={quietHours.enabled}
              onChange={(e) => setQuietHours({ ...quietHours, enabled: e.target.checked })}
              className="rounded text-bloompink focus:ring-bloompink"
            />
            <div className="flex-1">
              <div className="flex items-center">
                <Moon className="h-5 w-5 text-bloompink mr-2" />
                <span className="font-medium">Enable Quiet Hours</span>
              </div>
              <p className="text-sm text-bloom-gray-600">
                Pause non-urgent notifications during your quiet hours
              </p>
            </div>
          </label>
          
          {quietHours.enabled && (
            <div className="mt-4 pl-8 space-y-3">
              <div>
                <label className="block text-sm font-medium text-bloom-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={quietHours.startTime}
                  onChange={(e) => setQuietHours({ ...quietHours, startTime: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-bloom-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={quietHours.endTime}
                  onChange={(e) => setQuietHours({ ...quietHours, endTime: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={savePreferences}
          variant="pink"
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Preferences'
          )}
        </Button>
      </div>
    </div>
  );
}