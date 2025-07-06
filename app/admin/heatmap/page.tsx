'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Eye, MousePointer, TrendingUp, Filter, Calendar } from 'lucide-react';
import FeatureNotAvailable from '@/components/admin/FeatureNotAvailable';

interface HeatmapPoint {
  x_percent: number;
  y_percent: number;
  click_count: number;
  intensity: number;
}

interface ClickElement {
  element: string;
  count: number;
  type: string;
}

interface HeatmapData {
  heatmapData: HeatmapPoint[];
  clickElements: ClickElement[];
  stats: {
    totalClicks: number;
    uniqueSessions: number;
    period: string;
    page: string;
  };
}

export default function HeatmapPage() {
  const [data, setData] = useState<HeatmapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState('/');
  const [timeRange, setTimeRange] = useState('7d');
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [previewUrl, setPreviewUrl] = useState('');

  const pages = [
    { value: '/', label: 'Homepage' },
    { value: '/contact', label: 'Contact' },
    { value: '/about', label: 'About' },
    { value: '/services/postpartum-depression-support', label: 'Postpartum Support' },
    { value: '/services/anxiety-stress-management', label: 'Anxiety Management' },
    { value: '/blog', label: 'Blog' }
  ];

  useEffect(() => {
    fetchHeatmapData();
  }, [selectedPage, timeRange]);

  const fetchHeatmapData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/heatmap-data?page=${encodeURIComponent(selectedPage)}&range=${timeRange}`,
        { credentials: 'include' }
      );
      
      if (!response.ok) throw new Error('Failed to fetch heatmap data');
      
      const data = await response.json();
      setData(data);
      
      // Set preview URL
      const baseUrl = window.location.origin;
      setPreviewUrl(`${baseUrl}${selectedPage}`);
    } catch (error) {
      console.error('Error fetching heatmap data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHeatmapColor = (intensity: number) => {
    // Create gradient from blue (cold) to red (hot)
    if (intensity < 20) return 'rgba(59, 130, 246, 0.3)'; // Blue
    if (intensity < 40) return 'rgba(34, 197, 94, 0.4)'; // Green
    if (intensity < 60) return 'rgba(251, 191, 36, 0.5)'; // Yellow
    if (intensity < 80) return 'rgba(251, 146, 60, 0.6)'; // Orange
    return 'rgba(239, 68, 68, 0.7)'; // Red
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bloom-primary"></div>
      </div>
    );
  }

  // Check if feature is available
  if (!data?.heatmapData || data.heatmapData.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Click Heatmap Analysis</h1>
          <p className="text-gray-600">Visualize where users are clicking on your site</p>
        </div>
        
        <FeatureNotAvailable
          featureName="Click Heatmap Analytics"
          description="Advanced click tracking and heatmap visualization will help you understand user behavior patterns. This feature will show you exactly where users click on your pages, helping optimize your site layout."
          plannedDate="Q2 2025"
        />
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <MousePointer className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Click Tracking</p>
                <p className="text-xs text-gray-500 mt-1">Coming Soon</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Activity className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Scroll Maps</p>
                <p className="text-xs text-gray-500 mt-1">Coming Soon</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Eye className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Session Replay</p>
                <p className="text-xs text-gray-500 mt-1">Coming Soon</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Alternative Solutions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                While we build our native heatmap solution, consider these excellent third-party tools:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <span className="text-sm">• <strong>Hotjar</strong> - Comprehensive heatmaps and session recordings</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-sm">• <strong>Microsoft Clarity</strong> - Free heatmaps and analytics</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-sm">• <strong>FullStory</strong> - Advanced user experience analytics</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Click Heatmap Analysis</h1>
        <p className="text-gray-600">Visualize where users are clicking on your site</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Page Selector */}
          <select
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-bloom-primary focus:border-bloom-primary"
          >
            {pages.map(page => (
              <option key={page.value} value={page.value}>{page.label}</option>
            ))}
          </select>

          {/* Time Range */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-bloom-primary focus:border-bloom-primary"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>

          {/* Toggle Heatmap */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-4 py-2 rounded-md transition ${
              showHeatmap 
                ? 'bg-bloom-primary text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            <Eye className="inline h-4 w-4 mr-2" />
            {showHeatmap ? 'Hide' : 'Show'} Heatmap
          </button>

          {/* Open Page */}
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Open Page
          </a>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center">
              <MousePointer className="h-4 w-4 mr-2 text-blue-600" />
              Total Clicks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data?.stats?.totalClicks || 0}</p>
            <p className="text-sm text-gray-500">{data?.stats?.period || 'Last 7 days'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center">
              <Activity className="h-4 w-4 mr-2 text-green-600" />
              Unique Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data?.stats?.uniqueSessions || 0}</p>
            <p className="text-sm text-gray-500">Active users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-purple-600" />
              Avg Clicks/Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {data?.stats?.uniqueSessions && data?.stats?.totalClicks
                ? (data.stats.totalClicks / data.stats.uniqueSessions).toFixed(1)
                : '0'}
            </p>
            <p className="text-sm text-gray-500">Engagement rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap Visualization */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Click Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '600px' }}>
                {/* Page Preview */}
                <iframe
                  src={previewUrl}
                  className="w-full h-full pointer-events-none"
                  style={{ transform: 'scale(0.8)', transformOrigin: 'top left' }}
                />
                
                {/* Heatmap Overlay */}
                {showHeatmap && data?.heatmapData && (
                  <div className="absolute inset-0 pointer-events-none">
                    {data.heatmapData.map((point, index) => (
                      <div
                        key={index}
                        className="absolute rounded-full blur-xl"
                        style={{
                          left: `${point.x_percent}%`,
                          top: `${point.y_percent}%`,
                          width: '40px',
                          height: '40px',
                          background: getHeatmapColor(point.intensity),
                          transform: 'translate(-50%, -50%)',
                          opacity: Math.min(point.intensity / 100 + 0.3, 1)
                        }}
                      />
                    ))}
                  </div>
                )}
                
                {/* No data message */}
                {(!data?.heatmapData || data.heatmapData.length === 0) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/10">
                    <div className="text-center">
                      <MousePointer className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">No click data available for this period</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Heatmap Legend */}
              {showHeatmap && (
                <div className="mt-4 flex items-center justify-center space-x-2">
                  <span className="text-sm text-gray-600">Cold</span>
                  <div className="flex h-6 w-48 rounded overflow-hidden">
                    <div className="flex-1 bg-blue-400"></div>
                    <div className="flex-1 bg-green-400"></div>
                    <div className="flex-1 bg-yellow-400"></div>
                    <div className="flex-1 bg-orange-400"></div>
                    <div className="flex-1 bg-red-400"></div>
                  </div>
                  <span className="text-sm text-gray-600">Hot</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Clicked Elements */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Top Clicked Elements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data?.clickElements && data.clickElements.length > 0 ? (
                  data.clickElements.map((element, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{element.element}</p>
                        <p className="text-xs text-gray-500">{element.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">{element.count}</p>
                        <p className="text-xs text-gray-500">clicks</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No element data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}