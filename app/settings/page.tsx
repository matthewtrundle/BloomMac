'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@supabase/auth-helpers-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
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
  Globe,
  Database,
  LogOut
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const user = useUser();
  const [activeTab, setActiveTab] = useState('notifications');

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  const settingsSections = [
    {
      id: 'account',
      title: 'Account Settings',
      description: 'Manage your account details and password',
      icon: User,
      items: [
        { title: 'Email Address', value: user.email, action: 'Change Email', disabled: true },
        { title: 'Password', value: '••••••••', action: 'Change Password', onClick: () => router.push('/auth/reset-password') },
        { title: 'Two-Factor Authentication', value: 'Disabled', action: 'Enable', disabled: true }
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      description: 'Control your data and privacy settings',
      icon: Shield,
      items: [
        { title: 'Profile Visibility', value: 'Private', action: 'Change', onClick: () => router.push('/privacy') },
        { title: 'Data Sharing', value: 'Limited', action: 'Manage', onClick: () => router.push('/privacy') },
        { title: 'Login History', value: 'View recent logins', action: 'View', disabled: true }
      ]
    },
    {
      id: 'payment',
      title: 'Payment Methods',
      description: 'Manage your payment information',
      icon: CreditCard,
      items: [
        { title: 'Default Payment Method', value: 'Visa ending in 4242', action: 'Manage', onClick: () => router.push('/payment-methods') },
        { title: 'Billing History', value: 'View past transactions', action: 'View', onClick: () => router.push('/billing') },
        { title: 'Auto-pay', value: 'Enabled', action: 'Change', disabled: true }
      ]
    },
    {
      id: 'connected',
      title: 'Connected Apps',
      description: 'Manage third-party integrations',
      icon: Link2,
      items: [
        { title: 'Calendly', value: 'Connected', action: 'Manage', disabled: true },
        { title: 'Apple Health', value: 'Not connected', action: 'Connect', disabled: true },
        { title: 'Google Fit', value: 'Not connected', action: 'Connect', disabled: true }
      ]
    },
    {
      id: 'data',
      title: 'Data Management',
      description: 'Export or delete your data',
      icon: Database,
      items: [
        { title: 'Export All Data', value: 'Download your information', action: 'Export', onClick: handleDataExport },
        { title: 'Delete Account', value: 'Permanently remove your data', action: 'Delete', onClick: handleDeleteAccount, danger: true }
      ]
    }
  ];

  async function handleDataExport() {
    if (confirm('This will prepare an export of all your data. You will receive an email when it\'s ready. Continue?')) {
      alert('Data export initiated. You will receive an email within 24 hours.');
    }
  }

  async function handleDeleteAccount() {
    if (confirm('WARNING: This will permanently delete your account and all associated data. This action cannot be undone. Are you sure?')) {
      if (confirm('This is your final warning. All your data will be permanently deleted. Continue?')) {
        // In production, this would call an API to delete the account
        alert('Account deletion requested. You will receive a confirmation email.');
      }
    }
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-bloom-gray-900">Settings</h1>
        <p className="text-bloom-gray-600 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Account</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Payment</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Data</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="mt-6">
          <NotificationPreferences />
        </TabsContent>

        {settingsSections.map((section) => (
          <TabsContent key={section.id} value={section.id} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <section.icon className="h-5 w-5" />
                  {section.title}
                </CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {section.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium text-bloom-gray-900">{item.title}</p>
                        <p className="text-sm text-bloom-gray-600">{item.value}</p>
                      </div>
                      <Button
                        variant={item.danger ? "destructive" : "outline"}
                        size="sm"
                        onClick={item.onClick}
                        disabled={item.disabled}
                      >
                        {item.action}
                        {!item.disabled && <ChevronRight className="h-4 w-4 ml-1" />}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Quick Links */}
      <div className="mt-12 grid md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/profile/edit')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-bloom-gray-900">Edit Profile</h3>
                <p className="text-sm text-bloom-gray-600 mt-1">Update your personal information</p>
              </div>
              <User className="h-8 w-8 text-bloompink" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/help')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-bloom-gray-900">Help Center</h3>
                <p className="text-sm text-bloom-gray-600 mt-1">Get support and view FAQs</p>
              </div>
              <Settings className="h-8 w-8 text-bloompink" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/auth/logout')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-bloom-gray-900">Sign Out</h3>
                <p className="text-sm text-bloom-gray-600 mt-1">Sign out of your account</p>
              </div>
              <LogOut className="h-8 w-8 text-bloompink" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}