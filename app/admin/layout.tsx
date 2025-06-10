'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart, 
  Mail, 
  Users, 
  FileText, 
  Image, 
  TestTube,
  LogOut,
  Home,
  Shield,
  Sparkles,
  Archive,
  Activity,
  Settings,
  MessageSquare,
  MousePointerClick,
  BookOpen
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart },
    { name: 'Click Heatmap', href: '/admin/heatmap', icon: MousePointerClick },
    { name: 'Course Management', href: '/admin/courses', icon: BookOpen, badge: 'NEW' },
    { name: 'Contact Submissions', href: '/admin/contacts', icon: MessageSquare },
    { name: 'Email Management', href: '/admin/email', icon: Mail },
    { name: 'Email Editor', href: '/admin/email-editor', icon: Sparkles },
    { name: 'Email Testing', href: '/admin/email-test', icon: TestTube },
    { name: 'Newsletter', href: '/admin/newsletter', icon: Users },
    { name: 'Blog Posts', href: '/admin/blog', icon: FileText },
    { name: 'Career Applications', href: '/admin/careers', icon: FileText },
    { name: 'Activity Log', href: '/admin/activity', icon: Activity },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
    { name: 'Backup & Export', href: '/admin/backup', icon: Archive },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Shield className="w-6 h-6 text-bloom-primary" />
              <h1 className="text-xl font-semibold text-gray-900">Bloom Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Back to Site</span>
              </Link>
              <button 
                onClick={async () => {
                  await fetch('/api/admin/logout', { method: 'POST' });
                  window.location.href = '/admin/login';
                }}
                className="text-sm text-red-600 hover:text-red-700 flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white shadow-lg min-h-[calc(100vh-4rem)]">
          <div className="p-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Management
            </h2>
            <ul className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive(item.href)
                          ? 'bg-bloom-primary/10 text-bloom-primary font-medium'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm">{item.name}</span>
                      {item.badge && (
                        <span className="ml-auto bg-bloompink text-white text-xs px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Quick Stats */}
          <div className="p-4 border-t border-gray-200">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Quick Stats
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Today's Visitors</span>
                <span className="font-medium text-gray-900">--</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">New Leads</span>
                <span className="font-medium text-gray-900">--</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Conversion Rate</span>
                <span className="font-medium text-gray-900">--%</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}