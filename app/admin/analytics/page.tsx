'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AnalyticsData {
  summary: {
    total_visitors: number;
    total_conversions: number;
    overall_conversion_rate: number;
    revenue_potential: number;
    period: string;
  };
  conversion_funnel: {
    stage: string;
    visitors: number;
    conversion_rate: number;
    drop_off: number;
    insights: string[];
    actions: string[];
  }[];
  traffic_sources: {
    source: string;
    visitors: number;
    conversions: number;
    conversion_rate: number;
    value_score: number;
    cost_effectiveness: 'high' | 'medium' | 'low';
    recommendations: string[];
  }[];
  page_performance: {
    page: string;
    views: number;
    conversions: number;
    conversion_rate: number;
    performance_grade: 'A' | 'B' | 'C' | 'D' | 'F';
    issues: string[];
    optimizations: string[];
  }[];
  engagement_metrics: {
    metric: string;
    value: number;
    benchmark: number;
    status: 'excellent' | 'good' | 'needs_improvement' | 'critical';
    impact: string;
    recommendations: string[];
  }[];
  lead_quality: {
    source: string;
    lead_score: number;
    conversion_likelihood: number;
    follow_up_priority: 'high' | 'medium' | 'low';
    characteristics: string[];
  }[];
  actionable_insights: {
    priority: 'critical' | 'high' | 'medium' | 'low';
    category: 'conversion' | 'traffic' | 'engagement' | 'technical';
    insight: string;
    impact: string;
    effort: 'low' | 'medium' | 'high';
    expected_result: string;
    implementation_steps: string[];
  }[];
}

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'bloom2024admin') {
      setAuthenticated(true);
      loadAnalytics();
    } else {
      setError('Invalid password');
    }
  };

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics?range=${dateRange}`);
      
      if (!response.ok) {
        throw new Error('Failed to load analytics');
      }
      
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      loadAnalytics();
    }
  }, [dateRange, authenticated]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'needs_improvement': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-100';
      case 'B': return 'text-blue-600 bg-blue-100';
      case 'C': return 'text-yellow-600 bg-yellow-100';
      case 'D': return 'text-orange-600 bg-orange-100';
      case 'F': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Analytics Dashboard</h1>
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloompink focus:border-transparent"
                required
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-bloompink hover:bg-[#B03979] text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bloompink mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Insights Dashboard</h1>
              <p className="text-gray-600">Real-time data with actionable recommendations</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloompink focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <button
                onClick={loadAnalytics}
                className="bg-bloompink hover:bg-[#B03979] text-white px-4 py-2 rounded transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview' },
                { id: 'conversion', name: 'Conversion Funnel' },
                { id: 'traffic', name: 'Traffic Sources' },
                { id: 'pages', name: 'Page Performance' },
                { id: 'insights', name: 'Action Items' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-bloompink text-bloompink'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {analyticsData && (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-md p-6"
                  >
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Total Visitors</h3>
                    <p className="text-3xl font-bold text-gray-900">{analyticsData.summary.total_visitors}</p>
                    <p className="text-sm text-gray-500 mt-1">{analyticsData.summary.period}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-lg shadow-md p-6"
                  >
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Total Conversions</h3>
                    <p className="text-3xl font-bold text-bloompink">{analyticsData.summary.total_conversions}</p>
                    <p className="text-sm text-gray-500 mt-1">Contact forms + bookings</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-lg shadow-md p-6"
                  >
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Conversion Rate</h3>
                    <p className="text-3xl font-bold text-green-600">{analyticsData.summary.overall_conversion_rate.toFixed(1)}%</p>
                    <p className="text-sm text-gray-500 mt-1">Industry avg: 5-7%</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-lg shadow-md p-6"
                  >
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Revenue Potential</h3>
                    <p className="text-3xl font-bold text-purple-600">${analyticsData.summary.revenue_potential.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-1">Est. client value</p>
                  </motion.div>
                </div>

                {/* Critical Insights */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">🚨 Critical Action Items</h3>
                  <div className="space-y-4">
                    {analyticsData.actionable_insights
                      .filter(insight => insight.priority === 'critical')
                      .map((insight, index) => (
                        <div key={index} className="border border-red-200 bg-red-50 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-red-800">{insight.insight}</h4>
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                              {insight.effort} effort
                            </span>
                          </div>
                          <p className="text-red-700 text-sm mb-3">{insight.impact}</p>
                          <p className="text-green-700 text-sm font-medium mb-3">Expected: {insight.expected_result}</p>
                          <details className="text-sm">
                            <summary className="cursor-pointer text-red-800 font-medium">Implementation Steps</summary>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-red-700">
                              {insight.implementation_steps.map((step, stepIndex) => (
                                <li key={stepIndex}>{step}</li>
                              ))}
                            </ul>
                          </details>
                        </div>
                      ))}
                  </div>
                </motion.div>

                {/* Engagement Metrics */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Health Check</h3>
                  <div className="space-y-4">
                    {analyticsData.engagement_metrics.map((metric, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-900">{metric.metric}</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(metric.status)}`}>
                              {metric.status.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <span>Current: <strong>{metric.value}{metric.metric.includes('Rate') ? '%' : metric.metric.includes('Duration') ? 'min' : ''}</strong></span>
                            <span>Benchmark: <strong>{metric.benchmark}{metric.metric.includes('Rate') ? '%' : metric.metric.includes('Duration') ? 'min' : ''}</strong></span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{metric.impact}</p>
                          <details className="text-sm">
                            <summary className="cursor-pointer text-bloompink font-medium">Recommendations</summary>
                            <ul className="list-disc list-inside mt-1 space-y-1 text-gray-600">
                              {metric.recommendations.map((rec, recIndex) => (
                                <li key={recIndex}>{rec}</li>
                              ))}
                            </ul>
                          </details>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {/* Conversion Funnel Tab */}
            {activeTab === 'conversion' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Conversion Funnel Analysis</h3>
                  <div className="space-y-6">
                    {analyticsData.conversion_funnel.map((stage, index) => (
                      <div key={index} className="border rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-gray-900">{stage.stage}</h4>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-bloompink">{stage.visitors}</p>
                            <p className="text-sm text-gray-600">{stage.conversion_rate}% of total</p>
                            {stage.drop_off > 0 && (
                              <p className="text-sm text-red-600">-{stage.drop_off}% drop-off</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">💡 Insights</h5>
                            <ul className="space-y-1 text-sm text-gray-600">
                              {stage.insights.map((insight, insightIndex) => (
                                <li key={insightIndex} className="flex items-start">
                                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                  {insight}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">🎯 Action Items</h5>
                            <ul className="space-y-1 text-sm text-gray-600">
                              {stage.actions.map((action, actionIndex) => (
                                <li key={actionIndex} className="flex items-start">
                                  <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                  {action}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Traffic Sources Tab */}
            {activeTab === 'traffic' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Traffic Source Performance</h3>
                  <div className="space-y-4">
                    {analyticsData.traffic_sources.map((source, index) => (
                      <div key={index} className="border rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-gray-900">{source.source}</h4>
                          <div className="flex items-center space-x-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              source.cost_effectiveness === 'high' ? 'bg-green-100 text-green-800' :
                              source.cost_effectiveness === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {source.cost_effectiveness} ROI
                            </span>
                            <span className="text-sm text-gray-600">Value Score: {source.value_score}/100</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">{source.visitors}</p>
                            <p className="text-sm text-gray-600">Visitors</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-bloompink">{source.conversions}</p>
                            <p className="text-sm text-gray-600">Conversions</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{source.conversion_rate.toFixed(1)}%</p>
                            <p className="text-sm text-gray-600">Conv. Rate</p>
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">📈 Optimization Recommendations</h5>
                          <ul className="space-y-1 text-sm text-gray-600">
                            {source.recommendations.map((rec, recIndex) => (
                              <li key={recIndex} className="flex items-start">
                                <span className="w-2 h-2 bg-bloompink rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Page Performance Tab */}
            {activeTab === 'pages' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Page Performance Analysis</h3>
                  <div className="space-y-4">
                    {analyticsData.page_performance.map((page, index) => (
                      <div key={index} className="border rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-gray-900">{page.page}</h4>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(page.performance_grade)}`}>
                            Grade: {page.performance_grade}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">{page.views}</p>
                            <p className="text-sm text-gray-600">Page Views</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-bloompink">{page.conversions}</p>
                            <p className="text-sm text-gray-600">Conversions</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{page.conversion_rate.toFixed(1)}%</p>
                            <p className="text-sm text-gray-600">Conv. Rate</p>
                          </div>
                        </div>
                        
                        {page.issues.length > 0 && (
                          <div className="mb-4">
                            <h5 className="font-medium text-red-700 mb-2">⚠️ Issues Identified</h5>
                            <ul className="space-y-1 text-sm text-red-600">
                              {page.issues.map((issue, issueIndex) => (
                                <li key={issueIndex} className="flex items-start">
                                  <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                  {issue}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">🔧 Optimization Opportunities</h5>
                          <ul className="space-y-1 text-sm text-gray-600">
                            {page.optimizations.map((opt, optIndex) => (
                              <li key={optIndex} className="flex items-start">
                                <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                {opt}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Action Items Tab */}
            {activeTab === 'insights' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Prioritized Action Items</h3>
                  <div className="space-y-4">
                    {analyticsData.actionable_insights.map((insight, index) => (
                      <div key={index} className={`border-l-4 rounded-lg p-6 ${getPriorityColor(insight.priority)}`}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                insight.priority === 'critical' ? 'bg-red-200 text-red-800' :
                                insight.priority === 'high' ? 'bg-orange-200 text-orange-800' :
                                insight.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                                'bg-green-200 text-green-800'
                              }`}>
                                {insight.priority} priority
                              </span>
                              <span className="px-2 py-1 bg-gray-200 text-gray-800 rounded text-xs font-medium">
                                {insight.category}
                              </span>
                              <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs font-medium">
                                {insight.effort} effort
                              </span>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">{insight.insight}</h4>
                            <p className="text-gray-700 mb-2"><strong>Impact:</strong> {insight.impact}</p>
                            <p className="text-green-700 mb-4"><strong>Expected Result:</strong> {insight.expected_result}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Implementation Checklist</h5>
                          <div className="space-y-2">
                            {insight.implementation_steps.map((step, stepIndex) => (
                              <label key={stepIndex} className="flex items-start space-x-2 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="mt-1 rounded border-gray-300 text-bloompink focus:ring-bloompink" 
                                />
                                <span className="text-sm text-gray-700">{step}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}