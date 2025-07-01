'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Calendar, 
  DollarSign, 
  GraduationCap,
  Users,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface NotificationSettings {
  // Email notifications
  email_appointments: boolean;
  email_payments: boolean;
  email_courses: boolean;
  email_workshops: boolean;
  email_achievements: boolean;
  email_wellness_reminders: boolean;
  email_marketing: boolean;
  
  // SMS notifications
  sms_enabled: boolean;
  sms_appointments: boolean;
  sms_reminders_hours: number; // Hours before appointment
  
  // In-app notifications
  push_enabled: boolean;
  push_appointments: boolean;
  push_achievements: boolean;
  push_messages: boolean;
  
  // Preferences
  quiet_hours_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  timezone: string;
}

const defaultSettings: NotificationSettings = {
  email_appointments: true,
  email_payments: true,
  email_courses: true,
  email_workshops: true,
  email_achievements: true,
  email_wellness_reminders: true,
  email_marketing: true,
  sms_enabled: false,
  sms_appointments: true,
  sms_reminders_hours: 24,
  push_enabled: true,
  push_appointments: true,
  push_achievements: true,
  push_messages: true,
  quiet_hours_enabled: false,
  quiet_hours_start: '22:00',
  quiet_hours_end: '08:00',
  timezone: 'America/Chicago'
};

export default function NotificationPreferences() {
  const user = useUser();
  const supabase = useSupabaseClient();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (user) {
      fetchPreferences();
    }
  }, [user]);

  async function fetchPreferences() {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('reminder_settings')
        .eq('user_id', user!.id)
        .single();

      if (error) throw error;

      if (data?.reminder_settings) {
        setSettings({ ...defaultSettings, ...data.reminder_settings });
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

      const { error } = await supabase
        .from('user_preferences')
        .update({
          reminder_settings: settings,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user!.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Notification preferences saved successfully!' });
    } catch (error) {
      console.error('Error saving preferences:', error);
      setMessage({ type: 'error', text: 'Failed to save preferences' });
    } finally {
      setSaving(false);
    }
  }

  const updateSetting = (key: keyof NotificationSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-bloompink" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <Alert className={message.type === 'success' ? "border-green-500" : "border-red-500"}>
          {message.type === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications
          </CardTitle>
          <CardDescription>
            Choose which emails you'd like to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-appointments">Appointment Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Confirmations and reminders for your appointments
              </p>
            </div>
            <Switch
              id="email-appointments"
              checked={settings.email_appointments}
              onCheckedChange={(checked) => updateSetting('email_appointments', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-payments">Payment Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receipts and payment confirmations
              </p>
            </div>
            <Switch
              id="email-payments"
              checked={settings.email_payments}
              onCheckedChange={(checked) => updateSetting('email_payments', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-courses">Course Updates</Label>
              <p className="text-sm text-muted-foreground">
                New lessons and course announcements
              </p>
            </div>
            <Switch
              id="email-courses"
              checked={settings.email_courses}
              onCheckedChange={(checked) => updateSetting('email_courses', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-workshops">Workshop Invitations</Label>
              <p className="text-sm text-muted-foreground">
                Upcoming workshops and events
              </p>
            </div>
            <Switch
              id="email-workshops"
              checked={settings.email_workshops}
              onCheckedChange={(checked) => updateSetting('email_workshops', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-wellness">Wellness Check-ins</Label>
              <p className="text-sm text-muted-foreground">
                Daily wellness reminders and tips
              </p>
            </div>
            <Switch
              id="email-wellness"
              checked={settings.email_wellness_reminders}
              onCheckedChange={(checked) => updateSetting('email_wellness_reminders', checked)}
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-marketing">Marketing & Promotions</Label>
                <p className="text-sm text-muted-foreground">
                  Special offers and newsletter
                </p>
              </div>
              <Switch
                id="email-marketing"
                checked={settings.email_marketing}
                onCheckedChange={(checked) => updateSetting('email_marketing', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SMS Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            SMS Notifications
          </CardTitle>
          <CardDescription>
            Text message reminders (standard rates apply)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sms-enabled">Enable SMS Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Receive appointment reminders via text
              </p>
            </div>
            <Switch
              id="sms-enabled"
              checked={settings.sms_enabled}
              onCheckedChange={(checked) => updateSetting('sms_enabled', checked)}
            />
          </div>

          {settings.sms_enabled && (
            <div className="pl-6 space-y-4">
              <div>
                <Label htmlFor="sms-timing">Reminder Timing</Label>
                <Select
                  value={settings.sms_reminders_hours.toString()}
                  onValueChange={(value) => updateSetting('sms_reminders_hours', parseInt(value))}
                >
                  <SelectTrigger id="sms-timing" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 hours before</SelectItem>
                    <SelectItem value="4">4 hours before</SelectItem>
                    <SelectItem value="24">24 hours before</SelectItem>
                    <SelectItem value="48">48 hours before</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            In-app and browser notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-enabled">Enable Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications in your browser
              </p>
            </div>
            <Switch
              id="push-enabled"
              checked={settings.push_enabled}
              onCheckedChange={(checked) => updateSetting('push_enabled', checked)}
            />
          </div>

          {settings.push_enabled && (
            <div className="pl-6 space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="push-appointments">Appointments</Label>
                <Switch
                  id="push-appointments"
                  checked={settings.push_appointments}
                  onCheckedChange={(checked) => updateSetting('push_appointments', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="push-achievements">Achievements</Label>
                <Switch
                  id="push-achievements"
                  checked={settings.push_achievements}
                  onCheckedChange={(checked) => updateSetting('push_achievements', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="push-messages">Messages</Label>
                <Switch
                  id="push-messages"
                  checked={settings.push_messages}
                  onCheckedChange={(checked) => updateSetting('push_messages', checked)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Quiet Hours</CardTitle>
          <CardDescription>
            Pause notifications during specific hours
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="quiet-hours">Enable Quiet Hours</Label>
            <Switch
              id="quiet-hours"
              checked={settings.quiet_hours_enabled}
              onCheckedChange={(checked) => updateSetting('quiet_hours_enabled', checked)}
            />
          </div>

          {settings.quiet_hours_enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quiet-start">Start Time</Label>
                <Input
                  id="quiet-start"
                  type="time"
                  value={settings.quiet_hours_start}
                  onChange={(e) => updateSetting('quiet_hours_start', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="quiet-end">End Time</Label>
                <Input
                  id="quiet-end"
                  type="time"
                  value={settings.quiet_hours_end}
                  onChange={(e) => updateSetting('quiet_hours_end', e.target.value)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={savePreferences} 
          disabled={saving}
          className="bg-bloompink hover:bg-bloompink/90"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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