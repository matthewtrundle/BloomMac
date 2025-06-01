'use client';

import React, { useState, useEffect } from 'react';
import NewsletterAdmin from '@/components/admin/NewsletterAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Mail, TrendingUp, Users, Clock, Zap, Target, CheckCircle, Play, Pause, Plus, ChevronRight } from 'lucide-react';

const EmailAdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'newsletter' | 'automation' | 'analytics'>('newsletter');
  const [emailAnalytics, setEmailAnalytics] = useState<any>(null);
  const [automationData, setAutomationData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showSequenceBuilder, setShowSequenceBuilder] = useState(false);
  const [newSequence, setNewSequence] = useState({
    name: '',
    trigger: 'newsletter_signup',
    emails: [
      { subject: '', content: '', delay_days: 0, delay_hours: 0 }
    ]
  });

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchEmailAnalytics();
    } else if (activeTab === 'automation') {
      fetchAutomationData();
    }
  }, [activeTab]);

  const fetchEmailAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/email-analytics?range=30d', {
        credentials: 'include'
      });
      
      if (!res.ok) {
        console.error('Email analytics fetch failed:', res.status, res.statusText);
        if (res.status === 401) {
          window.location.href = '/admin/login';
          return;
        }
      }
      
      const data = await res.json();
      setEmailAnalytics(data);
    } catch (error) {
      console.error('Error fetching email analytics:', error);
    }
    setLoading(false);
  };

  const fetchAutomationData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/email-automations', {
        credentials: 'include'
      });
      
      if (!res.ok) {
        console.error('Email automations fetch failed:', res.status, res.statusText);
        if (res.status === 401) {
          window.location.href = '/admin/login';
          return;
        }
      }
      
      const data = await res.json();
      setAutomationData(data);
    } catch (error) {
      console.error('Error fetching automation data:', error);
    }
    setLoading(false);
  };

  const createSequence = async () => {
    try {
      const res = await fetch('/api/email-automations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ sequence: newSequence })
      });
      
      if (res.ok) {
        setShowSequenceBuilder(false);
        setNewSequence({
          name: '',
          trigger: 'newsletter_signup',
          emails: [{ subject: '', content: '', delay_days: 0, delay_hours: 0 }]
        });
        fetchAutomationData();
      }
    } catch (error) {
      console.error('Error creating sequence:', error);
    }
  };

  const toggleSequenceStatus = async (sequenceId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    try {
      await fetch('/api/email-automations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ sequenceId, status: newStatus })
      });
      fetchAutomationData();
    } catch (error) {
      console.error('Error updating sequence:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Email Admin</h1>
              <p className="text-gray-600 mt-1">Manage newsletters, automation, and email analytics</p>
            </div>
            <div className="text-sm text-gray-500">
              Bloom Psychology Admin Panel
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="container mx-auto px-4 pt-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('newsletter')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'newsletter' 
                ? 'bg-white text-bloom-primary shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Newsletter Management
          </button>
          <button
            onClick={() => setActiveTab('automation')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'automation' 
                ? 'bg-white text-bloom-primary shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Email Automation
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'analytics' 
                ? 'bg-white text-bloom-primary shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Email Analytics
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {activeTab === 'newsletter' && <NewsletterAdmin />}
        
        {activeTab === 'automation' && (
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bloom-primary"></div>
              </div>
            ) : (
              <>
                {/* Automation Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Email Automation Sequences</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      All automated email sequences and their triggers
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Newsletter Signup Sequence */}
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900 flex items-center">
                              <Mail className="w-4 h-4 mr-2 text-bloom-primary" />
                              Newsletter Signup Sequence
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              <span className="font-medium">Trigger:</span> When someone signs up for the newsletter
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            Active
                          </span>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center text-sm">
                            <Clock className="w-3 h-3 mr-2 text-gray-400" />
                            <span className="font-medium">Email 1:</span>
                            <span className="ml-2">Welcome + Free Resource (Immediate)</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="w-3 h-3 mr-2 text-gray-400" />
                            <span className="font-medium">Email 2:</span>
                            <span className="ml-2">3 Quick Wins (After 3 days)</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="w-3 h-3 mr-2 text-gray-400" />
                            <span className="font-medium">Email 3:</span>
                            <span className="ml-2">You're Not Alone (After 7 days)</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="w-3 h-3 mr-2 text-gray-400" />
                            <span className="font-medium">Email 4:</span>
                            <span className="ml-2">Self-Care Reminder (After 14 days)</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="w-3 h-3 mr-2 text-gray-400" />
                            <span className="font-medium">Email 5:</span>
                            <span className="ml-2">30-Day Check-In + $25 Offer (After 30 days)</span>
                            <span className="ml-2 text-orange-600 font-medium">⏰ 48hr limit</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t">
                          <a 
                            href="/admin/email-editor" 
                            className="text-bloom-primary text-sm hover:underline flex items-center"
                          >
                            Edit Templates
                            <ChevronRight className="w-3 h-3 ml-1" />
                          </a>
                        </div>
                      </div>

                      {/* Contact Form Sequence */}
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900 flex items-center">
                              <Users className="w-4 h-4 mr-2 text-bloom-primary" />
                              Contact Form Follow-Up
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              <span className="font-medium">Trigger:</span> When someone submits the contact form
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            Active
                          </span>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center text-sm">
                            <Clock className="w-3 h-3 mr-2 text-gray-400" />
                            <span className="font-medium">Email 1:</span>
                            <span className="ml-2">Confirmation + Timeline (Immediate)</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="w-3 h-3 mr-2 text-gray-400" />
                            <span className="font-medium">Admin:</span>
                            <span className="ml-2">Notification to Jana (Immediate)</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="w-3 h-3 mr-2 text-gray-400" />
                            <span className="font-medium">Email 2:</span>
                            <span className="ml-2">Gentle Follow-Up (After 72 hours)</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="w-3 h-3 mr-2 text-gray-400" />
                            <span className="font-medium">Email 3:</span>
                            <span className="ml-2">Free Resources (After 7 days)</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t">
                          <a 
                            href="/admin/email-editor" 
                            className="text-bloom-primary text-sm hover:underline flex items-center"
                          >
                            Edit Templates
                            <ChevronRight className="w-3 h-3 ml-1" />
                          </a>
                        </div>
                      </div>

                      {/* Booking Confirmation Sequence */}
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900 flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2 text-bloom-primary" />
                              Booking Confirmation Sequence
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              <span className="font-medium">Trigger:</span> When someone books a consultation
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                            Via Calendly
                          </span>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center text-sm">
                            <Clock className="w-3 h-3 mr-2 text-gray-400" />
                            <span className="font-medium">Email 1:</span>
                            <span className="ml-2">Booking Confirmation (Immediate)</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="w-3 h-3 mr-2 text-gray-400" />
                            <span className="font-medium">Email 2:</span>
                            <span className="ml-2">Reminder (24 hours before)</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="w-3 h-3 mr-2 text-gray-400" />
                            <span className="font-medium">Email 3:</span>
                            <span className="ml-2">Follow-Up + $20 Offer (48 hours after)</span>
                            <span className="ml-2 text-orange-600 font-medium">⏰ 48hr limit</span>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                          <p className="font-medium mb-1">Note:</p>
                          <p>Currently handled by Calendly. Templates ready for future integration.</p>
                        </div>
                      </div>

                      {/* Lead Nurture Sequence */}
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900 flex items-center">
                              <Target className="w-4 h-4 mr-2 text-bloom-primary" />
                              Resource Download Follow-Up
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              <span className="font-medium">Trigger:</span> When someone downloads a free resource
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            Active
                          </span>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center text-sm">
                            <Clock className="w-3 h-3 mr-2 text-gray-400" />
                            <span className="font-medium">Email 1:</span>
                            <span className="ml-2">Resource Delivery + Tips (Immediate)</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="w-3 h-3 mr-2 text-gray-400" />
                            <span className="font-medium">Email 2:</span>
                            <span className="ml-2">Check-In (After 72 hours)</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="w-3 h-3 mr-2 text-gray-400" />
                            <span className="font-medium">Email 3:</span>
                            <span className="ml-2">Success Story (After 7 days)</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="w-3 h-3 mr-2 text-gray-400" />
                            <span className="font-medium">Email 4:</span>
                            <span className="ml-2">No-Pressure Support (After 14 days)</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t">
                          <a 
                            href="/admin/email-editor" 
                            className="text-bloom-primary text-sm hover:underline flex items-center"
                          >
                            Edit Templates
                            <ChevronRight className="w-3 h-3 ml-1" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600">Total Sequences</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">4</div>
                      <p className="text-xs text-gray-500 mt-1">Active email sequences</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600">Total Emails</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">17</div>
                      <p className="text-xs text-gray-500 mt-1">Across all sequences</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600">Time-Limited Offers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">2</div>
                      <p className="text-xs text-gray-500 mt-1">With 48-hour expiration</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Documentation Link */}
                <Card>
                  <CardHeader>
                    <CardTitle>Email Automation Documentation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      For detailed information about all email sequences, triggers, and timing:
                    </p>
                    <a 
                      href="/EMAIL_AUTOMATION_DOCUMENTATION.md" 
                      target="_blank"
                      className="inline-flex items-center text-bloom-primary hover:underline"
                    >
                      View Full Documentation
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </a>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bloom-primary"></div>
              </div>
            ) : emailAnalytics ? (
              <>
                {/* Overview Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600">Emails Sent</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{emailAnalytics.overview.totalSent.toLocaleString()}</div>
                      <p className="text-xs text-gray-500 mt-1">{emailAnalytics.overview.period}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600">Avg Open Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{emailAnalytics.overview.avgOpenRate}%</div>
                      <p className="text-xs text-green-600 mt-1">Industry avg: 21.5%</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600">Avg Click Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{emailAnalytics.overview.avgClickRate}%</div>
                      <p className="text-xs text-green-600 mt-1">Industry avg: 2.3%</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600">Unsubscribes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{emailAnalytics.overview.totalUnsubscribed}</div>
                      <p className="text-xs text-gray-500 mt-1">Keep under 1%</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Campaigns */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Campaigns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b text-left">
                            <th className="pb-3 font-medium text-sm text-gray-600">Campaign</th>
                            <th className="pb-3 font-medium text-sm text-gray-600 text-right">Sent</th>
                            <th className="pb-3 font-medium text-sm text-gray-600 text-right">Opens</th>
                            <th className="pb-3 font-medium text-sm text-gray-600 text-right">Clicks</th>
                            <th className="pb-3 font-medium text-sm text-gray-600 text-right">Open Rate</th>
                            <th className="pb-3 font-medium text-sm text-gray-600 text-right">Click Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {emailAnalytics.campaigns.map((campaign: any) => (
                            <tr key={campaign.id} className="border-b">
                              <td className="py-3">
                                <div>
                                  <p className="font-medium text-sm">{campaign.subject}</p>
                                  <p className="text-xs text-gray-500">{new Date(campaign.sentAt).toLocaleDateString()}</p>
                                </div>
                              </td>
                              <td className="py-3 text-right text-sm">{campaign.sent}</td>
                              <td className="py-3 text-right text-sm">{campaign.opened}</td>
                              <td className="py-3 text-right text-sm">{campaign.clicked}</td>
                              <td className="py-3 text-right text-sm font-medium">{campaign.openRate}%</td>
                              <td className="py-3 text-right text-sm font-medium">{campaign.clickRate}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Subscriber Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Subscriber Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Active Subscribers</span>
                          <span className="font-semibold">{emailAnalytics.subscriberMetrics.totalActive}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">New This Month</span>
                          <span className="font-semibold text-green-600">+{emailAnalytics.subscriberMetrics.newThisMonth}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Unsubscribed</span>
                          <span className="font-semibold text-red-600">-{emailAnalytics.subscriberMetrics.unsubscribedThisMonth}</span>
                        </div>
                        <div className="pt-3 border-t">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Growth Rate</span>
                            <span className="font-bold text-bloom-primary">{emailAnalytics.subscriberMetrics.growthRate}%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Most Engaged Subscribers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {emailAnalytics.subscriberMetrics.mostEngaged.map((subscriber: any, index: number) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm">{subscriber.email}</span>
                            <div className="flex items-center space-x-3 text-sm">
                              <span className="text-gray-500">{subscriber.opens} opens</span>
                              <span className="text-gray-500">{subscriber.clicks} clicks</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Engagement Patterns */}
                <Card>
                  <CardHeader>
                    <CardTitle>Engagement Patterns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Best Send Time: <span className="font-semibold text-bloom-primary">{emailAnalytics.engagement.bestSendTime}</span></p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Opens by Day of Week</h4>
                        <div className="flex items-end justify-between h-32 space-x-2">
                          {emailAnalytics.engagement.byDay.map((day: any) => (
                            <div key={day.day} className="flex-1 flex flex-col items-center">
                              <div 
                                className="w-full bg-bloom-primary rounded-t"
                                style={{ height: `${(day.opens / 120) * 100}%` }}
                              />
                              <span className="text-xs mt-1">{day.day}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : null}
          </div>
        )}
      </div>

      {/* Sequence Builder Modal */}
      {showSequenceBuilder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Create Email Sequence</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sequence Name
                </label>
                <input
                  type="text"
                  value={newSequence.name}
                  onChange={(e) => setNewSequence({...newSequence, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloom-primary focus:border-transparent"
                  placeholder="e.g., Welcome Series"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trigger
                </label>
                <select
                  value={newSequence.trigger}
                  onChange={(e) => setNewSequence({...newSequence, trigger: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloom-primary focus:border-transparent"
                >
                  <option value="newsletter_signup">Newsletter Signup</option>
                  <option value="contact_form">Contact Form Submission</option>
                  <option value="new_mom_program">New Mom Program Inquiry</option>
                  <option value="manual">Manual Trigger</option>
                </select>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Email Sequence</h3>
                {newSequence.emails.map((email, index) => (
                  <div key={index} className="mb-4 p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium">Email {index + 1}</h4>
                      {index > 0 && (
                        <button
                          onClick={() => {
                            const updatedEmails = newSequence.emails.filter((_, i) => i !== index);
                            setNewSequence({...newSequence, emails: updatedEmails});
                          }}
                          className="text-red-600 text-sm hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={email.subject}
                        onChange={(e) => {
                          const updatedEmails = [...newSequence.emails];
                          updatedEmails[index].subject = e.target.value;
                          setNewSequence({...newSequence, emails: updatedEmails});
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloom-primary focus:border-transparent"
                        placeholder="Email subject"
                      />
                      
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="text-xs text-gray-600">Delay (days)</label>
                          <input
                            type="number"
                            min="0"
                            value={email.delay_days}
                            onChange={(e) => {
                              const updatedEmails = [...newSequence.emails];
                              updatedEmails[index].delay_days = parseInt(e.target.value) || 0;
                              setNewSequence({...newSequence, emails: updatedEmails});
                            }}
                            className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloom-primary focus:border-transparent"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs text-gray-600">Delay (hours)</label>
                          <input
                            type="number"
                            min="0"
                            max="23"
                            value={email.delay_hours}
                            onChange={(e) => {
                              const updatedEmails = [...newSequence.emails];
                              updatedEmails[index].delay_hours = parseInt(e.target.value) || 0;
                              setNewSequence({...newSequence, emails: updatedEmails});
                            }}
                            className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloom-primary focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={() => {
                    setNewSequence({
                      ...newSequence,
                      emails: [...newSequence.emails, { subject: '', content: '', delay_days: 0, delay_hours: 0 }]
                    });
                  }}
                  className="text-bloom-primary text-sm hover:underline"
                >
                  + Add Another Email
                </button>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSequenceBuilder(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={createSequence}
                disabled={!newSequence.name || newSequence.emails.some(e => !e.subject)}
                className="px-4 py-2 bg-bloom-primary text-white rounded-lg hover:bg-bloom-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Sequence
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailAdminPage;