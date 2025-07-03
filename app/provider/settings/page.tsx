'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface ProviderSettings {
  appointment_buffer_minutes: number;
  default_appointment_duration: number;
  no_show_fee_amount: number;
  cancellation_notice_hours: number;
  reminder_24h_enabled: boolean;
  reminder_2h_enabled: boolean;
  reminder_sms_enabled: boolean;
  working_hours: {
    [key: string]: { start: string; end: string; enabled: boolean };
  };
  vacation_dates: string[];
  appointment_types: {
    id: string;
    name: string;
    duration: number;
    price: number;
    enabled: boolean;
  }[];
}

const defaultSettings: ProviderSettings = {
  appointment_buffer_minutes: 15,
  default_appointment_duration: 50,
  no_show_fee_amount: 50,
  cancellation_notice_hours: 24,
  reminder_24h_enabled: true,
  reminder_2h_enabled: true,
  reminder_sms_enabled: false,
  working_hours: {
    monday: { start: '09:00', end: '17:00', enabled: true },
    tuesday: { start: '09:00', end: '17:00', enabled: true },
    wednesday: { start: '09:00', end: '17:00', enabled: true },
    thursday: { start: '09:00', end: '17:00', enabled: true },
    friday: { start: '09:00', end: '17:00', enabled: true },
    saturday: { start: '09:00', end: '12:00', enabled: false },
    sunday: { start: '09:00', end: '12:00', enabled: false }
  },
  vacation_dates: [],
  appointment_types: [
    { id: '1', name: 'Initial Consultation', duration: 50, price: 200, enabled: true },
    { id: '2', name: 'Follow-up Session', duration: 50, price: 175, enabled: true },
    { id: '3', name: 'Brief Check-in', duration: 25, price: 100, enabled: true },
    { id: '4', name: 'Extended Session', duration: 80, price: 250, enabled: false }
  ]
};

export default function ProviderSettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [settings, setSettings] = useState<ProviderSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'schedule' | 'reminders' | 'billing'>('general');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('provider_settings')
        .select('*')
        .eq('provider_id', user.id)
        .single();

      if (data) {
        setSettings({ ...defaultSettings, ...data.settings });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('provider_settings')
        .upsert({
          provider_id: user.id,
          settings,
          updated_at: new Date().toISOString()
        });

      if (!error) {
        alert('Settings saved successfully');
      } else {
        throw error;
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateWorkingHours = (day: string, field: string, value: any) => {
    setSettings({
      ...settings,
      working_hours: {
        ...settings.working_hours,
        [day]: {
          ...settings.working_hours[day],
          [field]: value
        }
      }
    });
  };

  const updateAppointmentType = (id: string, field: string, value: any) => {
    setSettings({
      ...settings,
      appointment_types: settings.appointment_types.map(type =>
        type.id === id ? { ...type, [field]: value } : type
      )
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bloom-sage mx-auto"></div>
          <p className="mt-4 text-bloom-dark/60">Loading settings...</p>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-playfair text-bloom-dark">Provider Settings</h1>
              <p className="text-bloom-dark/60 mt-1">Configure your practice preferences</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/provider/dashboard"
                className="px-4 py-2 text-bloom-dark/70 hover:text-bloom-dark transition-colors"
              >
                Back to Dashboard
              </Link>
              <button
                onClick={saveSettings}
                disabled={saving}
                className="px-6 py-2 bg-bloom-sage text-white rounded-lg hover:bg-bloom-sage/90 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-6 py-4">
        <div className="flex space-x-1 bg-white/50 rounded-lg p-1 max-w-2xl">
          {[
            { id: 'general', label: 'General' },
            { id: 'schedule', label: 'Schedule' },
            { id: 'reminders', label: 'Reminders' },
            { id: 'billing', label: 'Billing' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-bloom-dark shadow-sm'
                  : 'text-bloom-dark/60 hover:text-bloom-dark'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Settings Content */}
      <div className="container mx-auto px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-bloom-dark mb-4">General Settings</h2>
                
                <div>
                  <label className="block text-sm font-medium text-bloom-dark mb-2">
                    Default Appointment Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.default_appointment_duration}
                    onChange={(e) => setSettings({ ...settings, default_appointment_duration: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-bloom-sage/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-bloom-sage"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-bloom-dark mb-2">
                    Buffer Time Between Appointments (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.appointment_buffer_minutes}
                    onChange={(e) => setSettings({ ...settings, appointment_buffer_minutes: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-bloom-sage/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-bloom-sage"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-bloom-dark mb-2">
                    Cancellation Notice Required (hours)
                  </label>
                  <input
                    type="number"
                    value={settings.cancellation_notice_hours}
                    onChange={(e) => setSettings({ ...settings, cancellation_notice_hours: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-bloom-sage/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-bloom-sage"
                  />
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-bloom-dark mb-4">Working Hours</h2>
                
                {Object.entries(settings.working_hours).map(([day, hours]) => (
                  <div key={day} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      checked={hours.enabled}
                      onChange={(e) => updateWorkingHours(day, 'enabled', e.target.checked)}
                      className="w-5 h-5 text-bloom-sage rounded"
                    />
                    <span className="w-24 font-medium capitalize">{day}</span>
                    <input
                      type="time"
                      value={hours.start}
                      onChange={(e) => updateWorkingHours(day, 'start', e.target.value)}
                      disabled={!hours.enabled}
                      className="px-3 py-1 border border-bloom-sage/20 rounded"
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={hours.end}
                      onChange={(e) => updateWorkingHours(day, 'end', e.target.value)}
                      disabled={!hours.enabled}
                      className="px-3 py-1 border border-bloom-sage/20 rounded"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reminders' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-bloom-dark mb-4">Reminder Settings</h2>
                
                <div className="space-y-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.reminder_24h_enabled}
                      onChange={(e) => setSettings({ ...settings, reminder_24h_enabled: e.target.checked })}
                      className="w-5 h-5 text-bloom-sage rounded"
                    />
                    <span>Send 24-hour appointment reminders</span>
                  </label>
                  
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.reminder_2h_enabled}
                      onChange={(e) => setSettings({ ...settings, reminder_2h_enabled: e.target.checked })}
                      className="w-5 h-5 text-bloom-sage rounded"
                    />
                    <span>Send 2-hour appointment reminders</span>
                  </label>
                  
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.reminder_sms_enabled}
                      onChange={(e) => setSettings({ ...settings, reminder_sms_enabled: e.target.checked })}
                      className="w-5 h-5 text-bloom-sage rounded"
                    />
                    <span>Enable SMS reminders (in addition to email)</span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-bloom-dark mb-4">Billing Settings</h2>
                
                <div>
                  <label className="block text-sm font-medium text-bloom-dark mb-2">
                    No-Show Fee Amount ($)
                  </label>
                  <input
                    type="number"
                    value={settings.no_show_fee_amount}
                    onChange={(e) => setSettings({ ...settings, no_show_fee_amount: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-bloom-sage/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-bloom-sage"
                  />
                </div>

                <div>
                  <h3 className="font-medium text-bloom-dark mb-3">Appointment Types & Pricing</h3>
                  <div className="space-y-3">
                    {settings.appointment_types.map((type) => (
                      <div key={type.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <input
                          type="checkbox"
                          checked={type.enabled}
                          onChange={(e) => updateAppointmentType(type.id, 'enabled', e.target.checked)}
                          className="w-5 h-5 text-bloom-sage rounded"
                        />
                        <input
                          type="text"
                          value={type.name}
                          onChange={(e) => updateAppointmentType(type.id, 'name', e.target.value)}
                          className="flex-1 px-3 py-1 border border-bloom-sage/20 rounded"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={type.duration}
                            onChange={(e) => updateAppointmentType(type.id, 'duration', parseInt(e.target.value))}
                            className="w-20 px-3 py-1 border border-bloom-sage/20 rounded text-center"
                          />
                          <span className="text-sm text-bloom-dark/60">min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-bloom-dark/60">$</span>
                          <input
                            type="number"
                            value={type.price}
                            onChange={(e) => updateAppointmentType(type.id, 'price', parseInt(e.target.value))}
                            className="w-24 px-3 py-1 border border-bloom-sage/20 rounded text-center"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}