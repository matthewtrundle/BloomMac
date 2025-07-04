'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function SimpleSettingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

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
            <h1 className="text-2xl font-playfair text-bloom-dark">Settings & Preferences</h1>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-6 py-4">
        <div className="flex space-x-1 bg-bloom-sage-50/30 rounded-lg p-1">
          {[
            { id: 'profile', label: 'Profile', icon: '👤' },
            { id: 'notifications', label: 'Notifications', icon: '🔔' },
            { id: 'privacy', label: 'Privacy', icon: '🔒' },
            { id: 'account', label: 'Account', icon: '⚙️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-bloom-dark shadow-sm'
                  : 'text-bloom-dark/60 hover:text-bloom-dark'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-12">
        <div className="max-w-2xl mx-auto">
          
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-bloom-dark mb-4">Profile Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-bloom-sage-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-bloom-dark">Edit Profile Information</h3>
                    <p className="text-sm text-bloom-dark/60">Update your personal details and preferences</p>
                  </div>
                  <Link
                    href="/profile/edit"
                    className="px-4 py-2 bg-bloom-sage text-white rounded-lg hover:bg-bloom-sage/90 transition-colors"
                  >
                    Edit →
                  </Link>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-bloom-dark/60">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-bloom-dark/60">Account Status</p>
                    <p className="font-medium text-green-600">Active</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-bloom-dark mb-4">Notification Preferences</h2>
              <div className="space-y-4">
                <div className="border border-bloom-sage/20 rounded-lg p-4">
                  <h3 className="font-medium text-bloom-dark mb-2">Email Notifications</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="rounded border-bloom-sage/20" />
                      <span className="text-sm">Course updates and new content</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="rounded border-bloom-sage/20" />
                      <span className="text-sm">Appointment reminders</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="rounded border-bloom-sage/20" />
                      <span className="text-sm">Weekly wellness tips</span>
                    </label>
                  </div>
                </div>
                
                <div className="border border-bloom-sage/20 rounded-lg p-4">
                  <h3 className="font-medium text-bloom-dark mb-2">SMS Notifications</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="rounded border-bloom-sage/20" />
                      <span className="text-sm">Appointment reminders (24 hours before)</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="rounded border-bloom-sage/20" />
                      <span className="text-sm">Important account updates</span>
                    </label>
                  </div>
                </div>
                
                <button className="w-full px-4 py-2 bg-bloom-sage text-white rounded-lg hover:bg-bloom-sage/90 transition-colors">
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-bloom-dark mb-4">Privacy & Security</h2>
              <div className="space-y-4">
                <div className="border border-bloom-sage/20 rounded-lg p-4">
                  <h3 className="font-medium text-bloom-dark mb-2">Data Privacy</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="rounded border-bloom-sage/20" />
                      <span className="text-sm">Allow analytics to improve your experience</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="rounded border-bloom-sage/20" />
                      <span className="text-sm">Share anonymized data for research</span>
                    </label>
                  </div>
                </div>

                <div className="border border-bloom-sage/20 rounded-lg p-4">
                  <h3 className="font-medium text-bloom-dark mb-2">Account Security</h3>
                  <div className="space-y-3">
                    <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Change Password</span>
                        <span>→</span>
                      </div>
                    </button>
                    <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Download My Data</span>
                        <span>→</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-bloom-dark mb-4">Account Management</h2>
              <div className="space-y-4">
                <div className="border border-bloom-sage/20 rounded-lg p-4">
                  <h3 className="font-medium text-bloom-dark mb-2">Payment Methods</h3>
                  <p className="text-sm text-bloom-dark/60 mb-3">Manage your payment information for appointments</p>
                  <Link
                    href="/appointments"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <span>💳</span>
                    <span>Manage Payment Methods</span>
                  </Link>
                </div>

                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <h3 className="font-medium text-red-800 mb-2">Danger Zone</h3>
                  <p className="text-sm text-red-600 mb-3">These actions cannot be undone</p>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}