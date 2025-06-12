'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  avgSessionDuration: string;
  bounceRate: number;
  topPages: { page: string; views: number }[];
  topSources: { source: string; visits: number }[];
  conversions: {
    contactForm: number;
    bookingClicks: number;
    newsletterSignups: number;
    resourceDownloads: number;
  };
  realtimeUsers: number;
}

export default function AnalyticsDashboardPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics?timeframe=${timeframe}`);
      if (response.ok) {
        const analyticsData = await response.json();
        setData(analyticsData);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <Link
            href="/admin"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Back to Admin
          </Link>
        </div>
        
        {/* Timeframe Selector */}
        <div className="mt-6 flex gap-2">
          {(['24h', '7d', '30d'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                timeframe === period
                  ? 'bg-[#1e3a5f] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {period === '24h' ? 'Last 24 Hours' : period === '7d' ? 'Last 7 Days' : 'Last 30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Page Views</h3>
          <p className="text-3xl font-bold text-gray-900">{data?.pageViews.toLocaleString() || '0'}</p>
          <p className="text-sm text-gray-500 mt-1">Total page views</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Unique Visitors</h3>
          <p className="text-3xl font-bold text-gray-900">{data?.uniqueVisitors.toLocaleString() || '0'}</p>
          <p className="text-sm text-gray-500 mt-1">Individual users</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Avg Session Duration</h3>
          <p className="text-3xl font-bold text-gray-900">{data?.avgSessionDuration || '0:00'}</p>
          <p className="text-sm text-gray-500 mt-1">Time spent on site</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Bounce Rate</h3>
          <p className="text-3xl font-bold text-gray-900">{data?.bounceRate || 0}%</p>
          <p className="text-sm text-gray-500 mt-1">Single page sessions</p>
        </div>
      </div>

      {/* Conversions */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Conversions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-[#1e3a5f]">{data?.conversions.contactForm || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Contact Forms</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-[#1e3a5f]">{data?.conversions.bookingClicks || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Booking Clicks</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-[#1e3a5f]">{data?.conversions.newsletterSignups || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Newsletter Signups</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-[#1e3a5f]">{data?.conversions.resourceDownloads || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Resource Downloads</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Pages */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top Pages</h2>
          <div className="space-y-3">
            {data?.topPages.map((page, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-700 truncate max-w-xs">{page.page}</span>
                <span className="text-gray-900 font-medium">{page.views.toLocaleString()}</span>
              </div>
            )) || <p className="text-gray-500">No data available</p>}
          </div>
        </div>

        {/* Top Sources */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top Traffic Sources</h2>
          <div className="space-y-3">
            {data?.topSources.map((source, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-700 capitalize">{source.source}</span>
                <span className="text-gray-900 font-medium">{source.visits.toLocaleString()}</span>
              </div>
            )) || <p className="text-gray-500">No data available</p>}
          </div>
        </div>
      </div>

      {/* GA4 Integration Note */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Google Analytics 4 Integration</h3>
        <p className="text-blue-800 mb-4">
          This dashboard shows data from our internal analytics. For more detailed insights:
        </p>
        <ul className="list-disc list-inside text-blue-800 space-y-1 mb-4">
          <li>Real-time user activity and geographic data</li>
          <li>Detailed user demographics and interests</li>
          <li>Advanced conversion funnel analysis</li>
          <li>Custom audience segments</li>
        </ul>
        <a
          href={`https://analytics.google.com/analytics/web/#/p${process.env.NEXT_PUBLIC_GA_ID?.replace('G-', '')}/reports/intelligenthome`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-900 font-medium hover:text-blue-700"
        >
          View in Google Analytics 4 →
        </a>
      </div>

      {/* Real-time Users (if available from GA4) */}
      {data?.realtimeUsers !== undefined && (
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-900">Real-time Users</h3>
              <p className="text-green-700">Active users on site right now</p>
            </div>
            <div className="text-4xl font-bold text-green-900">{data.realtimeUsers}</div>
          </div>
        </div>
      )}
    </div>
  );
}