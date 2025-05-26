'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ChatAnalytics {
  summary: {
    total_conversations: number;
    total_messages: number;
    avg_messages_per_conversation: number;
    period: string;
  };
  top_questions: {
    question: string;
    frequency: number;
    category: string;
    sentiment: 'positive' | 'neutral' | 'negative';
  }[];
  conversation_patterns: {
    pattern: string;
    frequency: number;
    description: string;
    improvement_suggestion: string;
  }[];
  user_pain_points: {
    pain_point: string;
    frequency: number;
    urgency: 'high' | 'medium' | 'low';
    suggested_content: string[];
  }[];
  bot_performance: {
    metric: string;
    value: number;
    benchmark: number;
    status: 'excellent' | 'good' | 'needs_improvement' | 'critical';
    recommendations: string[];
  }[];
  actionable_insights: {
    priority: 'critical' | 'high' | 'medium' | 'low';
    category: 'content' | 'bot_response' | 'user_experience' | 'service';
    insight: string;
    impact: string;
    effort: 'low' | 'medium' | 'high';
    implementation_steps: string[];
  }[];
}

interface BusinessAnalytics {
  summary: {
    total_visitors: number;
    total_conversions: number;
    overall_conversion_rate: number;
    revenue_potential: number;
    period: string;
  };
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

export default function AnalyticsPage() {
  const [chatAnalytics, setChatAnalytics] = useState<ChatAnalytics | null>(null);
  const [businessAnalytics, setBusinessAnalytics] = useState<BusinessAnalytics | null>(null);
  const [activeTab, setActiveTab] = useState<'business' | 'chat'>('business');
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [businessRes, chatRes] = await Promise.all([
        fetch(`/api/analytics?range=${timeRange}`),
        fetch(`/api/chat-analytics?range=${timeRange}`)
      ]);

      if (businessRes.ok) {
        const businessData = await businessRes.json();
        setBusinessAnalytics(businessData);
      }

      if (chatRes.ok) {
        const chatData = await chatRes.json();
        setChatAnalytics(chatData);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'needs_improvement': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bloompink mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">Actionable insights for Bloom Psychology</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-bloompink focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="container mx-auto px-4 pt-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('business')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'business' 
                ? 'bg-white text-bloompink shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Business Analytics
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'chat' 
                ? 'bg-white text-bloompink shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Chat Analytics
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {activeTab === 'business' && businessAnalytics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Business Summary */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Business Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-bloompink">{businessAnalytics.summary.total_visitors}</div>
                  <div className="text-sm text-gray-600">Visitors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-bloompink">{businessAnalytics.summary.total_conversions}</div>
                  <div className="text-sm text-gray-600">Conversions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-bloompink">{businessAnalytics.summary.overall_conversion_rate.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Conversion Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-bloompink">${businessAnalytics.summary.revenue_potential.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Revenue Potential</div>
                </div>
              </div>
            </div>

            {/* Business Insights */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Business Insights</h2>
              <div className="space-y-4">
                {businessAnalytics.actionable_insights.map((insight, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${getPriorityColor(insight.priority)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">{insight.insight}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-50">
                        {insight.priority} priority
                      </span>
                    </div>
                    <p className="text-sm mb-3">{insight.impact}</p>
                    <div className="mb-3">
                      <p className="text-sm font-medium">Expected Result:</p>
                      <p className="text-sm">{insight.expected_result}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Implementation Steps:</p>
                      <ul className="text-sm space-y-1">
                        {insight.implementation_steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start">
                            <span className="text-xs mr-2 mt-1">•</span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'chat' && chatAnalytics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Chat Summary */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Chat Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-bloompink">{chatAnalytics.summary.total_conversations}</div>
                  <div className="text-sm text-gray-600">Conversations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-bloompink">{chatAnalytics.summary.total_messages}</div>
                  <div className="text-sm text-gray-600">Total Messages</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-bloompink">{chatAnalytics.summary.avg_messages_per_conversation}</div>
                  <div className="text-sm text-gray-600">Avg Messages/Conv</div>
                </div>
              </div>
            </div>

            {/* Top Questions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Most Asked Questions</h2>
              <div className="space-y-3">
                {chatAnalytics.top_questions.map((question, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium capitalize">{question.question}</div>
                      <div className="text-sm text-gray-600">
                        {question.category} • {question.sentiment} sentiment
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-bloompink">{question.frequency}</div>
                      <div className="text-xs text-gray-500">times asked</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* User Pain Points */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">User Pain Points</h2>
              <div className="space-y-4">
                {chatAnalytics.user_pain_points.map((painPoint, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${getPriorityColor(painPoint.urgency)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">{painPoint.pain_point}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-50">
                          {painPoint.urgency} urgency
                        </span>
                        <span className="text-sm font-bold">{painPoint.frequency}x</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Suggested Content:</p>
                      <ul className="text-sm space-y-1">
                        {painPoint.suggested_content.map((content, contentIndex) => (
                          <li key={contentIndex} className="flex items-start">
                            <span className="text-xs mr-2 mt-1">•</span>
                            {content}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bot Performance */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Bot Performance</h2>
              <div className="space-y-4">
                {chatAnalytics.bot_performance.map((metric, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{metric.metric}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(metric.status)}`}>
                        {metric.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mb-3">
                      <div>
                        <span className="text-lg font-bold text-bloompink">{metric.value}</span>
                        <span className="text-sm text-gray-600 ml-1">/ {metric.benchmark} benchmark</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Recommendations:</p>
                      <ul className="text-sm space-y-1">
                        {metric.recommendations.map((rec, recIndex) => (
                          <li key={recIndex} className="flex items-start">
                            <span className="text-xs mr-2 mt-1">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Insights */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Chat Improvement Insights</h2>
              <div className="space-y-4">
                {chatAnalytics.actionable_insights.map((insight, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${getPriorityColor(insight.priority)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">{insight.insight}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-50">
                        {insight.priority} priority
                      </span>
                    </div>
                    <p className="text-sm mb-3">{insight.impact}</p>
                    <div>
                      <p className="text-sm font-medium mb-1">Implementation Steps:</p>
                      <ul className="text-sm space-y-1">
                        {insight.implementation_steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start">
                            <span className="text-xs mr-2 mt-1">•</span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}