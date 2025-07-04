'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import NotificationPreferences from '@/components/settings/NotificationPreferences';
import { 
  Bell, 
  Shield, 
  CreditCard, 
  User, 
  Download, 
  Link2, 
  Settings,
  ChevronRight,
  Lock,
  Mail,
  Smartphone,
  Activity,
  Globe,
  Database,
  Trash2,
  AlertCircle
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('notifications');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bloom-sage mx-auto"></div>
          <p className="mt-4 text-bloom-dark/60">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handlePasswordReset = async () => {
    setLoading(true);
    // Password reset logic would go here
    setLoading(false);
  };

  const handleDataExport = async () => {
    setLoading(true);
    // Data export logic would go here
    setLoading(false);
  };

  const handleAccountDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (confirmed) {
      setLoading(true);
      // Account deletion logic would go here
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
              onClick={() => setActiveTab('connected')}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === 'connected'
                  ? 'bg-bloompink text-white'
                  : 'hover:bg-bloom-gray-100 text-bloom-gray-700'
              }`}
            >
              <Link2 className="h-5 w-5 mr-3" />
              Connected Apps
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
                      
                      <div>
                        <Button 
                          onClick={handlePasswordReset}
                          variant="outline"
                          disabled={loading}
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          Reset Password
                        </Button>
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
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-3" />
                        <div>
                          <p className="font-medium">Share data for research</p>
                          <p className="text-sm text-bloom-gray-600">
                            Help improve maternal mental health research
                          </p>
                        </div>
                      </div>
                    </label>
                    
                    <label className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-3" />
                        <div>
                          <p className="font-medium">Profile visibility</p>
                          <p className="text-sm text-bloom-gray-600">
                            Allow other community members to see your profile
                          </p>
                        </div>
                      </div>
                    </label>
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

            {/* Connected Apps Tab */}
            {activeTab === 'connected' && (
              <div>
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">Connected Apps</h2>
                  <p className="text-bloom-gray-600 mt-1">
                    Manage third-party app connections
                  </p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Activity className="h-8 w-8 text-red-500 mr-3" />
                        <div>
                          <p className="font-medium">Apple Health</p>
                          <p className="text-sm text-bloom-gray-600">Not connected</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" disabled>
                        Connect (Coming Soon)
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Activity className="h-8 w-8 text-blue-500 mr-3" />
                        <div>
                          <p className="font-medium">Google Fit</p>
                          <p className="text-sm text-bloom-gray-600">Not connected</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" disabled>
                        Connect (Coming Soon)
                      </Button>
                    </div>
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
                    Export or delete your account data
                  </p>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Export Your Data</h3>
                    <p className="text-bloom-gray-600 mb-4">
                      Download all your data including profile information, course progress, and activity history.
                    </p>
                    <Button 
                      onClick={handleDataExport}
                      variant="outline"
                      disabled={loading}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Request Data Export
                    </Button>
                  </div>
                  
                  <div className="border-t pt-6">
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