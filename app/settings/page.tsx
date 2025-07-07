'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Button from '@/components/ui/Button';
import NotificationPreferences from '@/components/settings/NotificationPreferences';
import { 
  Bell, 
  Shield, 
  CreditCard, 
  User, 
  Settings,
  ChevronRight,
  Lock,
  Mail,
  Smartphone,
  Database,
  Trash2,
  AlertCircle
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('notifications');
  const [loading, setLoading] = useState(false);
  
  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    share_data_research: false,
    analytics_enabled: true
  });
  const [savingPrivacy, setSavingPrivacy] = useState(false);
  const [privacyMessage, setPrivacyMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/login');
      } else {
        setUser(session.user);
      }
    };
    getUser();
  }, [router, supabase.auth]);

  // Fetch privacy settings when tab becomes active
  useEffect(() => {
    if (user && activeTab === 'privacy') {
      fetchPrivacySettings();
    }
  }, [user, activeTab]);

  async function fetchPrivacySettings() {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') { // Ignore error if no row found
        throw error;
      }

      if (data && data.privacy_settings) {
        setPrivacySettings(data.privacy_settings);
      }
    } catch (error) {
      console.error('Failed to fetch privacy settings:', error);
      setPrivacyMessage({ type: 'error', text: 'Failed to load privacy settings' });
    }
  }

  async function savePrivacySettings() {
    if (!user) return;
    try {
      setSavingPrivacy(true);
      setPrivacyMessage(null);
      
      const { error } = await supabase
        .from('user_preferences')
        .upsert({ 
          user_id: user.id, 
          privacy_settings: privacySettings,
          updated_at: new Date().toISOString()
        }, { 
          onConflict: 'user_id' 
        });
      
      if (error) {
        throw error;
      } else {
        setPrivacyMessage({ type: 'success', text: 'Privacy settings saved successfully!' });
      }
    } catch (error: any) {
      console.error('Failed to save privacy settings:', error);
      setPrivacyMessage({ type: 'error', text: error.message || 'Failed to save settings' });
    } finally {
      setSavingPrivacy(false);
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bloom-sage mx-auto"></div>
          <p className="mt-4 text-bloom-dark/60">Loading settings...</p>
        </div>
      </div>
    );
  }
  
  const handlePasswordChange = async () => {
    setLoading(true);
    setPasswordError('');
    setPasswordSuccess('');
    
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('Please fill out the new password fields.');
      setLoading(false);
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      setLoading(false);
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      const { error } = await supabase.auth.updateUser({ password: passwordData.newPassword });
      
      if (error) {
        setPasswordError(error.message);
      } else {
        setPasswordSuccess('Password changed successfully! Please sign in again.');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(async () => {
          await supabase.auth.signOut();
          router.push('/auth/login');
        }, 2000);
      }
    } catch (error: any) {
      setPasswordError(error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const handleAccountDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action is permanent and cannot be undone.'
    );
    if (confirmed) {
      setLoading(true);
      alert("Account deletion functionality is not yet implemented.");
      // Example of what it might look like:
      // const { error } = await supabase.rpc('delete_user_account');
      // if (error) {
      //   alert(`Failed to delete account: ${error.message}`);
      // } else {
      //   await supabase.auth.signOut();
      //   router.push('/');
      // }
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-bloom-gray-900">Settings</h1>
        <p className="text-bloom-gray-600 mt-2">
          Manage your account preferences and privacy settings
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        {/* Sidebar Navigation */}
        <div className="md:col-span-3">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === 'notifications'
                  ? 'bg-bloompink text-white'
                  : 'hover:bg-bloom-gray-100 text-bloom-gray-700'
              }`}
            >
              <Bell className="h-5 w-5 mr-3" />
              Notifications
            </button>
            
            <button
              onClick={() => setActiveTab('account')}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === 'account'
                  ? 'bg-bloompink text-white'
                  : 'hover:bg-bloom-gray-100 text-bloom-gray-700'
              }`}
            >
              <User className="h-5 w-5 mr-3" />
              Account
            </button>
            
            <button
              onClick={() => setActiveTab('privacy')}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === 'privacy'
                  ? 'bg-bloompink text-white'
                  : 'hover:bg-bloom-gray-100 text-bloom-gray-700'
              }`}
            >
              <Shield className="h-5 w-5 mr-3" />
              Privacy
            </button>
            
            <button
              onClick={() => setActiveTab('payment')}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === 'payment'
                  ? 'bg-bloompink text-white'
                  : 'hover:bg-bloom-gray-100 text-bloom-gray-700'
              }`}
            >
              <CreditCard className="h-5 w-5 mr-3" />
              Payment
            </button>
            
            <button
              onClick={() => setActiveTab('data')}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === 'data'
                  ? 'bg-bloompink text-white'
                  : 'hover:bg-bloom-gray-100 text-bloom-gray-700'
              }`}
            >
              <Database className="h-5 w-5 mr-3" />
              Data Management
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="md:col-span-9">
          <div className="bg-white rounded-xl shadow-lg">
            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">Notification Preferences</h2>
                  <p className="text-bloom-gray-600 mt-1">
                    Choose how and when you want to receive notifications
                  </p>
                </div>
                <div className="p-6">
                  <NotificationPreferences />
                </div>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div>
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">Account Settings</h2>
                  <p className="text-bloom-gray-600 mt-1">
                    Manage your account details and security
                  </p>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Email & Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-bloom-gray-700 mb-1">
                          Email Address
                        </label>
                        <div className="flex items-center">
                          <input
                            type="email"
                            value={user.email}
                            disabled
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                          />
                          <Button variant="outline" size="sm" className="ml-3" disabled>
                            Change Email
                          </Button>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3">Change Password</h4>
                        
                        {/* Password change messages */}
                        {passwordError && (
                          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                            {passwordError}
                          </div>
                        )}
                        {passwordSuccess && (
                          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                            {passwordSuccess}
                          </div>
                        )}
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-bloom-gray-700 mb-1">
                              Current Password
                            </label>
                            <input
                              type="password"
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData({
                                ...passwordData,
                                currentPassword: e.target.value
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                              placeholder="Enter current password"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-bloom-gray-700 mb-1">
                              New Password
                            </label>
                            <input
                              type="password"
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData({
                                ...passwordData,
                                newPassword: e.target.value
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                              placeholder="Enter new password (min 8 characters)"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-bloom-gray-700 mb-1">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData({
                                ...passwordData,
                                confirmPassword: e.target.value
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                              placeholder="Confirm new password"
                            />
                          </div>
                          
                          <Button 
                            onClick={handlePasswordChange}
                            variant="pink"
                            disabled={loading}
                            className="w-full"
                          >
                            {loading ? (
                              <>
                                <Lock className="h-4 w-4 mr-2 animate-spin" />
                                Changing Password...
                              </>
                            ) : (
                              <>
                                <Lock className="h-4 w-4 mr-2" />
                                Change Password
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                    <div className="p-4 bg-bloom-gray-50 rounded-lg">
                      <p className="text-sm text-bloom-gray-600 mb-3">
                        Add an extra layer of security to your account
                      </p>
                      <Button variant="outline" size="sm" disabled>
                        Enable 2FA (Coming Soon)
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div>
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">Privacy Settings</h2>
                  <p className="text-bloom-gray-600 mt-1">
                    Control your privacy and data sharing preferences
                  </p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Status message */}
                  {privacyMessage && (
                    <div className={`p-4 rounded-lg flex items-center space-x-2 ${
                      privacyMessage.type === 'success' 
                        ? 'bg-green-50 text-green-800' 
                        : 'bg-red-50 text-red-800'
                    }`}>
                      <p className="text-sm">{privacyMessage.text}</p>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="mr-3 w-4 h-4 text-bloompink rounded focus:ring-bloompink"
                          checked={privacySettings.share_data_research}
                          onChange={(e) => setPrivacySettings({
                            ...privacySettings,
                            share_data_research: e.target.checked
                          })}
                        />
                        <div>
                          <p className="font-medium">Share data for research</p>
                          <p className="text-sm text-bloom-gray-600">
                            Help improve maternal mental health research
                          </p>
                        </div>
                      </div>
                    </label>
                    
                    <label className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="mr-3 w-4 h-4 text-bloompink rounded focus:ring-bloompink"
                          checked={privacySettings.analytics_enabled}
                          onChange={(e) => setPrivacySettings({
                            ...privacySettings,
                            analytics_enabled: e.target.checked
                          })}
                        />
                        <div>
                          <p className="font-medium">Analytics & Improvements</p>
                          <p className="text-sm text-bloom-gray-600">
                            Allow us to collect usage data to improve your experience
                          </p>
                        </div>
                      </div>
                    </label>
                    
                  </div>
                  
                  <div className="pt-4">
                    <Button
                      onClick={savePrivacySettings}
                      variant="pink"
                      disabled={savingPrivacy}
                      className="w-full"
                    >
                      {savingPrivacy ? 'Saving...' : 'Save Privacy Settings'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Tab */}
            {activeTab === 'payment' && (
              <div>
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">Payment Methods</h2>
                  <p className="text-bloom-gray-600 mt-1">
                    Manage your payment methods and billing
                  </p>
                </div>
                <div className="p-6">
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-bloom-gray-400 mx-auto mb-3" />
                    <p className="text-bloom-gray-600">No payment methods on file</p>
                    <Button variant="pink" size="sm" className="mt-4">
                      Add Payment Method
                    </Button>
                  </div>
                </div>
              </div>
            )}


            {/* Data Management Tab */}
            {activeTab === 'data' && (
              <div>
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">Data Management</h2>
                  <p className="text-bloom-gray-600 mt-1">
                    Manage your account settings
                  </p>
                </div>
                <div className="p-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-red-600">Danger Zone</h3>
                    <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-red-900">Delete Account</p>
                          <p className="text-sm text-red-700 mt-1">
                            Permanently delete your account and all associated data. This action cannot be undone.
                          </p>
                          <Button 
                            onClick={handleAccountDelete}
                            variant="outline"
                            className="mt-4 border-red-600 text-red-600 hover:bg-red-50"
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete My Account
                          </Button>
                        </div>
                      </div>
                    </div>
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