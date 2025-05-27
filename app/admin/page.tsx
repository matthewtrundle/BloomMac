'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Users, 
  Mail, 
  TrendingUp, 
  Activity,
  Calendar,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

interface QuickStats {
  todayVisitors: number;
  weeklyConversions: number;
  activeSubscribers: number;
  pendingApplications: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<QuickStats>({
    todayVisitors: 0,
    weeklyConversions: 0,
    activeSubscribers: 0,
    pendingApplications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch real analytics data
      const analyticsRes = await fetch('/api/analytics?range=24h');
      const analyticsData = await analyticsRes.json();
      
      // Fetch newsletter subscribers count
      const newsletterRes = await fetch('/api/newsletter-admin');
      const newsletterData = await newsletterRes.json();
      
      // Calculate real stats
      setStats({
        todayVisitors: analyticsData.visitors || 0,
        weeklyConversions: (analyticsData.contactForms || 0) + (analyticsData.newsletterSignups || 0) + (analyticsData.newMomSignups || 0),
        activeSubscribers: newsletterData.subscribers?.length || 0,
        pendingApplications: 0 // This would come from careers API if implemented
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set to zeros on error
      setStats({
        todayVisitors: 0,
        weeklyConversions: 0,
        activeSubscribers: 0,
        pendingApplications: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'View Analytics',
      description: 'Check site performance and visitor insights',
      href: '/admin/analytics',
      icon: BarChart,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'Email Captures',
      description: 'Review contact form submissions',
      href: '/admin/email',
      icon: Mail,
      color: 'text-green-600 bg-green-100'
    },
    {
      title: 'Newsletter',
      description: 'Manage subscriber list',
      href: '/admin/newsletter',
      icon: Users,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      title: 'Test Emails',
      description: 'Verify email functionality',
      href: '/admin/email-test',
      icon: Activity,
      color: 'text-orange-600 bg-orange-100'
    }
  ];

  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Fetch recent activity from analytics
  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const res = await fetch('/api/recent-activity?limit=5');
        if (res.ok) {
          const events = await res.json();
          const activities = events.map((event: any) => {
            const time = new Date(event.timestamp);
            const now = new Date();
            const diff = now.getTime() - time.getTime();
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const days = Math.floor(hours / 24);
            
            let timeAgo = 'just now';
            if (days > 0) {
              timeAgo = `${days} day${days > 1 ? 's' : ''} ago`;
            } else if (hours > 0) {
              timeAgo = `${hours} hour${hours > 1 ? 's' : ''} ago`;
            }
            
            const typeMap: any = {
              'newsletter_signup': { message: 'New newsletter subscriber', icon: Users },
              'contact_form': { message: 'Contact form submission', icon: Mail },
              'page_view': { message: `Page view: ${event.page}`, icon: Activity },
              'booking_click': { message: 'Booking button clicked', icon: Calendar },
              'new_mom_signup': { message: 'New Mom Program signup', icon: CheckCircle }
            };
            
            const activityInfo = typeMap[event.type] || { message: event.type, icon: Activity };
            
            return {
              type: event.type,
              message: activityInfo.message,
              time: timeAgo,
              icon: activityInfo.icon
            };
          }).slice(0, 4);
          
          setRecentActivity(activities);
        }
      } catch (error) {
        console.error('Error fetching recent activity:', error);
        // Set default if error
        setRecentActivity([
          { type: 'info', message: 'No recent activity', time: 'N/A', icon: AlertCircle }
        ]);
      }
    };
    
    fetchRecentActivity();
  }, []);

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's an overview of your site's performance.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Today's Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? (
                <span className="inline-block w-12 h-6 bg-gray-200 animate-pulse rounded"></span>
              ) : (
                stats.todayVisitors
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              {stats.todayVisitors > 0 ? (
                <>
                  <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                  <span>Active tracking</span>
                </>
              ) : (
                <span>No data yet</span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Weekly Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.weeklyConversions}</div>
            <p className="text-xs text-gray-500 mt-1">Contact forms & signups</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Active Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.activeSubscribers}</div>
            <p className="text-xs text-gray-500 mt-1">Newsletter recipients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</div>
            <p className="text-xs text-gray-500 mt-1">Career applications</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.href}
                      href={action.href}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow group"
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${action.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 group-hover:text-bloom-primary transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-bloom-primary transition-colors mt-1" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="p-1.5 bg-gray-100 rounded">
                        <Icon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Items */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <span>Action Items</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Configure Email Settings</p>
                <p className="text-xs text-gray-600">Ensure RESEND_API_KEY is set in environment variables</p>
              </div>
              <Link href="/admin/email-test" className="text-sm text-bloom-primary hover:underline">
                Test Now
              </Link>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <Activity className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Review Analytics</p>
                <p className="text-xs text-gray-600">Check conversion rates and optimize underperforming pages</p>
              </div>
              <Link href="/admin/analytics" className="text-sm text-bloom-primary hover:underline">
                View Analytics
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}