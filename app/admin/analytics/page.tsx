'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Circle, Users, Calendar, TrendingUp, MessageSquare, Brain, Bot, AlertCircle, DollarSign, BarChart, Eye, Clock, Target } from 'lucide-react';

interface AnalyticsData {
  timeRange: string;
  visitors: number;
  pageViews: number;
  avgTimeOnSite: string;
  bounceRate: string;
  conversionRate: string;
  contactForms: number;
  newMomSignups: number;
  newsletterSignups: number;
  insights: {
    priority: 'high' | 'medium' | 'low';
    message: string;
    action: string;
  }[];
  trafficSources: {
    source: string;
    visits: number;
    conversions: number;
    roi: string;
  }[];
  pagePerformance: {
    page: string;
    views: number;
    avgTime: string;
    grade: string;
  }[];
  conversionFunnel: {
    stage: string;
    count: number;
    dropOff: number;
  }[];
  leadQuality: {
    score: number;
    breakdown: {
      category: string;
      percentage: number;
    }[];
  };
}

interface ChatAnalyticsData {
  totalInteractions: number;
  uniqueUsers: number;
  avgSessionDuration: string;
  completionRate: string;
  topQuestions: {
    question: string;
    count: number;
    sentiment: 'positive' | 'neutral' | 'negative';
  }[];
  userPainPoints: {
    category: string;
    frequency: number;
    severity: 'high' | 'medium' | 'low';
  }[];
  botPerformance: {
    metric: string;
    value: string;
    trend: 'up' | 'down' | 'stable';
  }[];
  conversionPaths: {
    path: string;
    conversions: number;
    avgTime: string;
  }[];
}

export default function AdminAnalyticsPage() {
  const [businessData, setBusinessData] = useState<AnalyticsData | null>(null);
  const [chatData, setChatData] = useState<ChatAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [activeTab, setActiveTab] = useState<'overview' | 'business' | 'chat' | 'funnel' | 'traffic' | 'pages'>('overview');
  const [checkedSteps, setCheckedSteps] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch business analytics
      const businessRes = await fetch(`/api/analytics?range=${timeRange}`);
      const businessData = await businessRes.json();
      setBusinessData(businessData);

      // Fetch chat analytics
      const chatRes = await fetch(`/api/chat-analytics?range=${timeRange}`);
      const chatData = await chatRes.json();
      setChatData(chatData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
    setLoading(false);
  };

  const toggleStep = (step: string) => {
    setCheckedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(step)) {
        newSet.delete(step);
      } else {
        newSet.add(step);
      }
      return newSet;
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600';
      case 'B': return 'text-blue-600';
      case 'C': return 'text-yellow-600';
      case 'D': return 'text-orange-600';
      case 'F': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bloom-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!businessData || !chatData) {
    return <div>Error loading analytics data</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart },
            { id: 'business', label: 'Business Metrics', icon: TrendingUp },
            { id: 'chat', label: 'Chat Analytics', icon: MessageSquare },
            { id: 'funnel', label: 'Conversion Funnel', icon: Target },
            { id: 'traffic', label: 'Traffic Sources', icon: Users },
            { id: 'pages', label: 'Page Performance', icon: Eye }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`pb-4 px-2 flex items-center space-x-2 border-b-2 transition-colors ${
                activeTab === id
                  ? 'border-bloom-primary text-bloom-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Visitors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{businessData.visitors.toLocaleString()}</div>
                <p className="text-xs text-gray-500 mt-1">+12% from last period</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{businessData.conversionRate}</div>
                <p className="text-xs text-gray-500 mt-1">Industry avg: 2-3%</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Chat Interactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{chatData.totalInteractions}</div>
                <p className="text-xs text-gray-500 mt-1">{chatData.completionRate} completion</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Lead Quality Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{businessData.leadQuality.score}/100</div>
                <p className="text-xs text-gray-500 mt-1">Above average</p>
              </CardContent>
            </Card>
          </div>

          {/* Actionable Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span>Actionable Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {businessData.insights.map((insight, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <div className={`mt-1 ${getPriorityColor(insight.priority)}`}>
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{insight.message}</p>
                      <p className="text-xs text-gray-600 mt-1">{insight.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Form Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Contact Forms</span>
                    <span className="font-medium">{businessData.contactForms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">New Mom Signups</span>
                    <span className="font-medium">{businessData.newMomSignups}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Newsletter</span>
                    <span className="font-medium">{businessData.newsletterSignups}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">User Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Avg Time on Site</span>
                    <span className="font-medium">{businessData.avgTimeOnSite}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Bounce Rate</span>
                    <span className="font-medium">{businessData.bounceRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Pages/Session</span>
                    <span className="font-medium">3.2</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Chat Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Unique Users</span>
                    <span className="font-medium">{chatData.uniqueUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Avg Session</span>
                    <span className="font-medium">{chatData.avgSessionDuration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Completion Rate</span>
                    <span className="font-medium">{chatData.completionRate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Business Metrics Tab */}
      {activeTab === 'business' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Visitors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{businessData.visitors.toLocaleString()}</div>
                <p className="text-xs text-gray-500 mt-1">{businessData.pageViews.toLocaleString()} page views</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Avg Session Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{businessData.avgTimeOnSite}</div>
                <p className="text-xs text-gray-500 mt-1">Industry avg: 2-3 min</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Bounce Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{businessData.bounceRate}</div>
                <p className="text-xs text-gray-500 mt-1">Target: &lt;40%</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{businessData.conversionRate}</div>
                <p className="text-xs text-gray-500 mt-1">Target: 3-5%</p>
              </CardContent>
            </Card>
          </div>

          {/* Lead Quality Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Lead Quality Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Score</span>
                  <span className="text-2xl font-bold">{businessData.leadQuality.score}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-bloom-primary h-2 rounded-full"
                    style={{ width: `${businessData.leadQuality.score}%` }}
                  />
                </div>
              </div>
              <div className="space-y-3">
                {businessData.leadQuality.breakdown.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm">{item.category}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-bloom-secondary h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Implementation Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>Optimization Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  'Set up Google Analytics 4 with enhanced ecommerce tracking',
                  'Implement Facebook Pixel for retargeting campaigns',
                  'Add heatmap tracking (Hotjar/Clarity) to understand user behavior',
                  'Configure goal tracking for all conversion events',
                  'Set up A/B testing for landing pages',
                  'Create custom dashboards for weekly reporting'
                ].map((step, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <button
                      onClick={() => toggleStep(step)}
                      className="mt-0.5 text-bloom-primary"
                    >
                      {checkedSteps.has(step) ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    <span className={`text-sm ${checkedSteps.has(step) ? 'line-through text-gray-400' : ''}`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chat Analytics Tab */}
      {activeTab === 'chat' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Interactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{chatData.totalInteractions}</div>
                <p className="text-xs text-gray-500 mt-1">{chatData.uniqueUsers} unique users</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Avg Session Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{chatData.avgSessionDuration}</div>
                <p className="text-xs text-gray-500 mt-1">Target: 3-5 min</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{chatData.completionRate}</div>
                <p className="text-xs text-gray-500 mt-1">Industry avg: 60-70%</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">&lt;1s</div>
                <p className="text-xs text-gray-500 mt-1">Excellent</p>
              </CardContent>
            </Card>
          </div>

          {/* Top Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Top Questions Asked</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {chatData.topQuestions.map((question, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{question.question}</p>
                      <p className="text-xs text-gray-500">Asked {question.count} times</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      question.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                      question.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {question.sentiment}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* User Pain Points */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5" />
                <span>Identified User Pain Points</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {chatData.userPainPoints.map((point, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{point.category}</p>
                      <p className="text-xs text-gray-500">Mentioned {point.frequency} times</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      point.severity === 'high' ? 'bg-red-100 text-red-800' :
                      point.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {point.severity} severity
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bot Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <span>Bot Performance Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {chatData.botPerformance.map((metric, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm">{metric.metric}</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{metric.value}</span>
                      <span className={`text-xs ${
                        metric.trend === 'up' ? 'text-green-600' :
                        metric.trend === 'down' ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Conversion Funnel Tab */}
      {activeTab === 'funnel' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {businessData.conversionFunnel.map((stage, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium">{stage.stage}</p>
                        <p className="text-sm text-gray-500">{stage.count.toLocaleString()} users</p>
                      </div>
                      {i > 0 && (
                        <span className="text-sm text-red-600">
                          -{stage.dropOff}% drop-off
                        </span>
                      )}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-bloom-primary h-4 rounded-full"
                        style={{ 
                          width: `${(stage.count / businessData.conversionFunnel[0].count) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversion Paths from Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {chatData.conversionPaths.map((path, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{path.path}</p>
                      <p className="text-xs text-gray-500">Avg time: {path.avgTime}</p>
                    </div>
                    <span className="text-lg font-bold text-bloom-primary">
                      {path.conversions}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Traffic Sources Tab */}
      {activeTab === 'traffic' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Source Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 text-sm font-medium">Source</th>
                      <th className="text-right py-2 text-sm font-medium">Visits</th>
                      <th className="text-right py-2 text-sm font-medium">Conversions</th>
                      <th className="text-right py-2 text-sm font-medium">Conv. Rate</th>
                      <th className="text-right py-2 text-sm font-medium">ROI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {businessData.trafficSources.map((source, i) => (
                      <tr key={i} className="border-b">
                        <td className="py-3 text-sm">{source.source}</td>
                        <td className="py-3 text-sm text-right">{source.visits.toLocaleString()}</td>
                        <td className="py-3 text-sm text-right">{source.conversions}</td>
                        <td className="py-3 text-sm text-right">
                          {((source.conversions / source.visits) * 100).toFixed(1)}%
                        </td>
                        <td className={`py-3 text-sm text-right font-medium ${
                          source.roi.startsWith('+') ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {source.roi}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Traffic Acquisition Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { channel: 'Google Ads', recommendation: 'Increase budget for "postpartum anxiety" keywords - showing 320% ROI', priority: 'high' },
                  { channel: 'Facebook', recommendation: 'Target lookalike audiences based on New Mom Program signups', priority: 'medium' },
                  { channel: 'SEO', recommendation: 'Create more content around "new mom support" - organic traffic up 45%', priority: 'high' },
                  { channel: 'Email', recommendation: 'Implement abandoned cart emails for consultation bookings', priority: 'medium' }
                ].map((item, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm">{item.channel}</p>
                        <p className="text-xs text-gray-600 mt-1">{item.recommendation}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        item.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Page Performance Tab */}
      {activeTab === 'pages' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Performance Grades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {businessData.pagePerformance.map((page, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{page.page}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500">{page.views.toLocaleString()} views</span>
                        <span className="text-xs text-gray-500">Avg time: {page.avgTime}</span>
                      </div>
                    </div>
                    <div className={`text-2xl font-bold ${getGradeColor(page.grade)}`}>
                      {page.grade}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Page Optimization Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { page: 'Home', task: 'Reduce hero image size - currently 2.3MB causing slow load', impact: 'high' },
                  { page: 'New Mom Program', task: 'Add testimonials section to increase trust signals', impact: 'high' },
                  { page: 'About', task: 'Include therapist credentials more prominently', impact: 'medium' },
                  { page: 'Contact', task: 'Simplify form to just name, email, and message', impact: 'medium' },
                  { page: 'Blog', task: 'Implement related posts to increase engagement', impact: 'low' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <button
                      onClick={() => toggleStep(item.task)}
                      className="mt-0.5 text-bloom-primary"
                    >
                      {checkedSteps.has(item.task) ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${checkedSteps.has(item.task) ? 'line-through text-gray-400' : ''}`}>
                        {item.page}: {item.task}
                      </p>
                      <span className={`text-xs ${
                        item.impact === 'high' ? 'text-red-600' :
                        item.impact === 'medium' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {item.impact} impact
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}