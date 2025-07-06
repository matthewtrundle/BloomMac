'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface NewsletterSubscriber {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  signupSource: string;
  timestamp: string;
  interests: string[];
}

interface NewsletterStats {
  total_subscribers: number;
  active_subscribers: number;
  unsubscribed: number;
  recent_signups: number;
  signup_sources: {
    source: string;
    count: number;
    percentage: number;
  }[];
  growth_trend: {
    date: string;
    subscribers: number;
  }[];
}

interface NewsletterData {
  stats: NewsletterStats;
  subscribers: NewsletterSubscriber[];
}

const NewsletterAdmin: React.FC = () => {
  const [data, setData] = useState<NewsletterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<string>('');
  
  // Newsletter composition
  const [subject, setSubject] = useState('');
  const [preview, setPreview] = useState('');
  const [content, setContent] = useState('');

  // Subscriber management
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [managingSubscribers, setManagingSubscribers] = useState(false);
  const [managementResult, setManagementResult] = useState<string>('');

  useEffect(() => {
    fetchNewsletterData();
  }, []);

  const fetchNewsletterData = async () => {
    try {
      const response = await fetch('/api/newsletter-admin', {
        credentials: 'include'
      });

      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else if (response.status === 401) {
        // Redirect to login if unauthorized
        window.location.href = '/admin/login';
      }
    } catch (error) {
      console.error('Failed to fetch newsletter data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNewsletter = async () => {
    if (!subject || !content) {
      setSendResult('Subject and content are required');
      return;
    }

    setSending(true);
    setSendResult('');

    try {
      const response = await fetch('/api/newsletter-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ subject, content, preview })
      });

      const result = await response.json();

      if (response.ok) {
        setSendResult(`✅ ${result.message}`);
        setSubject('');
        setContent('');
        setPreview('');
      } else {
        setSendResult(`❌ ${result.error}`);
      }
    } catch (error) {
      setSendResult('❌ Failed to send newsletter');
    } finally {
      setSending(false);
    }
  };

  const loadTemplate = (templateType: 'monthly_blog' | 'tips' | 'announcement') => {
    const templates = {
      monthly_blog: {
        subject: 'Weekly Insights: [Blog Post Title] 🌸',
        preview: 'This week we explore [topic] and share practical strategies for [specific benefit]',
        content: `
<h2 style="color: #6B21A8; margin-bottom: 20px;">This Week's Mental Health Insights</h2>

<p style="margin-bottom: 20px; font-size: 16px; color: #4B5563;">
  Hi there,
</p>

<p style="margin-bottom: 20px; font-size: 16px; color: #4B5563;">
  This week, I want to talk about [topic] – something many of the women and mothers I work with ask about regularly.
</p>

<div style="background-color: #F3F4F6; padding: 25px; border-radius: 8px; margin: 25px 0;">
  <h3 style="color: #6B21A8; margin-top: 0; font-size: 18px;">[Blog Post Title]</h3>
  <p style="margin: 15px 0; color: #4B5563;">
    [Brief excerpt or summary of the blog post - 2-3 sentences]
  </p>
  <a href="[BLOG_POST_URL]" style="display: inline-block; background-color: #A855F7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: 500;">
    Read Full Article
  </a>
</div>

<h3 style="color: #6B21A8; margin-bottom: 15px;">Quick Tip of the Week</h3>
<p style="margin-bottom: 20px; font-size: 16px; color: #4B5563;">
  [Practical tip related to the blog post topic]
</p>

<p style="margin-bottom: 20px; font-size: 16px; color: #4B5563;">
  Remember, seeking support is a sign of strength, not weakness. If you're struggling, please reach out.
</p>

<div style="text-align: center; margin: 30px 0;">
  <a href="https://bloompsychologynorthaustin.com/book" style="display: inline-block; background-color: #A855F7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px;">
    Book a Free Consultation
  </a>
</div>

<p style="margin-bottom: 0; font-size: 16px; color: #4B5563;">
  Take care,<br>
  <strong style="color: #6B21A8;">Dr. Jana Rundle</strong>
</p>`
      },
      tips: {
        subject: '5 Evidence-Based Tips for [Topic] 💡',
        preview: 'Practical strategies you can implement today to improve your [specific area]',
        content: `
<h2 style="color: #6B21A8; margin-bottom: 20px;">5 Evidence-Based Tips for [Topic]</h2>

<p style="margin-bottom: 20px; font-size: 16px; color: #4B5563;">
  Hello,
</p>

<p style="margin-bottom: 25px; font-size: 16px; color: #4B5563;">
  Today I'm sharing five practical, evidence-based strategies for [topic] that you can start implementing right away.
</p>

<div style="background-color: #F3F4F6; padding: 25px; border-radius: 8px; margin: 25px 0;">
  <h3 style="color: #6B21A8; margin-top: 0;">1. [Tip Title]</h3>
  <p style="color: #4B5563; margin-bottom: 15px;">[Explanation and how to implement]</p>

  <h3 style="color: #6B21A8;">2. [Tip Title]</h3>
  <p style="color: #4B5563; margin-bottom: 15px;">[Explanation and how to implement]</p>

  <h3 style="color: #6B21A8;">3. [Tip Title]</h3>
  <p style="color: #4B5563; margin-bottom: 15px;">[Explanation and how to implement]</p>

  <h3 style="color: #6B21A8;">4. [Tip Title]</h3>
  <p style="color: #4B5563; margin-bottom: 15px;">[Explanation and how to implement]</p>

  <h3 style="color: #6B21A8; margin-bottom: 8px;">5. [Tip Title]</h3>
  <p style="color: #4B5563; margin-bottom: 0;">[Explanation and how to implement]</p>
</div>

<p style="margin-bottom: 20px; font-size: 16px; color: #4B5563;">
  Remember, small consistent steps often lead to the biggest changes. Pick one tip that resonates with you and try it this week.
</p>

<p style="margin-bottom: 0; font-size: 16px; color: #4B5563;">
  Supporting your journey,<br>
  <strong style="color: #6B21A8;">Dr. Jana Rundle</strong>
</p>`
      },
      announcement: {
        subject: 'Exciting News from Bloom Psychology! 🎉',
        preview: 'We have some exciting updates to share about new services and upcoming events',
        content: `
<h2 style="color: #6B21A8; margin-bottom: 20px;">Exciting Updates from Bloom Psychology</h2>

<p style="margin-bottom: 20px; font-size: 16px; color: #4B5563;">
  Dear friends,
</p>

<p style="margin-bottom: 25px; font-size: 16px; color: #4B5563;">
  I'm excited to share some wonderful updates with our community!
</p>

<div style="background-color: #F3F4F6; padding: 25px; border-radius: 8px; margin: 25px 0;">
  <h3 style="color: #6B21A8; margin-top: 0;">[Announcement Title]</h3>
  <p style="color: #4B5563; margin-bottom: 15px;">
    [Details about the announcement - new service, workshop, event, etc.]
  </p>
  <p style="color: #4B5563; margin-bottom: 0;">
    [How it benefits the community and next steps]
  </p>
</div>

<h3 style="color: #6B21A8; margin-bottom: 15px;">What This Means for You</h3>
<p style="margin-bottom: 20px; font-size: 16px; color: #4B5563;">
  [Explain the benefits and how subscribers can take advantage]
</p>

<div style="text-align: center; margin: 30px 0;">
  <a href="[RELEVANT_LINK]" style="display: inline-block; background-color: #A855F7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px;">
    Learn More
  </a>
</div>

<p style="margin-bottom: 0; font-size: 16px; color: #4B5563;">
  Thank you for being part of our community,<br>
  <strong style="color: #6B21A8;">Dr. Jana Rundle & The Bloom Psychology Team</strong>
</p>`
      }
    };

    const template = templates[templateType];
    setSubject(template.subject);
    setPreview(template.preview);
    setContent(template.content);
  };

  const handleUnsubscribeSelected = async () => {
    if (selectedSubscribers.length === 0) {
      setManagementResult('❌ Please select subscribers to unsubscribe');
      return;
    }

    if (!confirm(`Are you sure you want to unsubscribe ${selectedSubscribers.length} subscriber(s)? This action cannot be undone.`)) {
      return;
    }

    setManagingSubscribers(true);
    setManagementResult('');

    try {
      const response = await fetch('/api/newsletter-admin', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ subscriberIds: selectedSubscribers })
      });

      const result = await response.json();

      if (response.ok) {
        setManagementResult(`✅ Successfully unsubscribed ${selectedSubscribers.length} subscriber(s)`);
        setSelectedSubscribers([]);
        // Refresh data
        await fetchNewsletterData();
      } else {
        const errorDetails = result.details ? ` (${result.details})` : '';
        setManagementResult(`❌ ${result.error}${errorDetails}`);
        console.error('Unsubscribe error:', result);
      }
    } catch (error) {
      console.error('Unsubscribe request failed:', error);
      setManagementResult(`❌ Failed to unsubscribe subscribers: ${error.message || 'Network error'}`);
    } finally {
      setManagingSubscribers(false);
    }
  };

  const handleSelectSubscriber = (subscriberId: string) => {
    setSelectedSubscribers(prev => 
      prev.includes(subscriberId)
        ? prev.filter(id => id !== subscriberId)
        : [...prev, subscriberId]
    );
  };

  const handleSelectAll = () => {
    if (selectedSubscribers.length === data?.subscribers.length) {
      setSelectedSubscribers([]);
    } else {
      setSelectedSubscribers(data?.subscribers.map(s => s.id) || []);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bloompink"></div>
        <span className="ml-3 text-gray-600">Loading newsletter data...</span>
      </div>
    );
  }

  if (!data) {
    return <div className="text-red-600">Failed to load newsletter data</div>;
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <div className="text-3xl font-bold text-bloompink mb-2">{data.stats.active_subscribers}</div>
          <div className="text-sm text-gray-600">Active Subscribers</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{data.stats.recent_signups}</div>
          <div className="text-sm text-gray-600">New This Week</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {(data.stats.signup_sources[0]?.source || 'N/A').replace('_', ' ')}
          </div>
          <div className="text-sm text-gray-600">Top Source</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">{data.stats.unsubscribed}</div>
          <div className="text-sm text-gray-600">Unsubscribed</div>
        </div>
      </div>

      {/* Newsletter Composer */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Send Newsletter</h2>
          <p className="text-gray-600 mt-1">Compose and send a newsletter to all active subscribers</p>
        </div>
        
        <div className="p-6">
          {/* Template Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Templates
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => loadTemplate('monthly_blog')}
                className="px-3 py-2 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors"
              >
                Weekly Blog
              </button>
              <button
                onClick={() => loadTemplate('tips')}
                className="px-3 py-2 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200 transition-colors"
              >
                Tips & Strategies
              </button>
              <button
                onClick={() => loadTemplate('announcement')}
                className="px-3 py-2 bg-purple-100 text-purple-700 rounded-md text-sm hover:bg-purple-200 transition-colors"
              >
                Announcement
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject Line
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Monthly Mental Health Insights..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloompink focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="preview" className="block text-sm font-medium text-gray-700 mb-1">
                Preview Text (optional)
              </label>
              <input
                type="text"
                id="preview"
                value={preview}
                onChange={(e) => setPreview(e.target.value)}
                placeholder="Brief preview that appears in email clients..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloompink focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Email Content (HTML)
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your newsletter content here..."
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloompink focus:border-transparent font-mono text-sm"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Will be sent to {data.stats.active_subscribers} active subscribers
              </div>
              <button
                onClick={handleSendNewsletter}
                disabled={sending || !subject || !content}
                className="px-6 py-2 bg-bloompink text-white rounded-md hover:bg-[#B03979] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {sending ? 'Sending...' : 'Send Newsletter'}
              </button>
            </div>

            {sendResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-md text-sm ${
                  sendResult.startsWith('✅') 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {sendResult}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Signup Sources */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Signup Sources</h2>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {data.stats.signup_sources.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-bloompink rounded-full mr-3"></div>
                  <span className="capitalize">{(source.source || 'unknown').replace('_', ' ')}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">{source.count} subscribers</span>
                  <span className="text-sm font-medium">{source.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subscriber Management */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Subscriber Management</h2>
              <p className="text-gray-600 mt-1">Manage your newsletter subscribers</p>
            </div>
            <div className="flex items-center space-x-3">
              {selectedSubscribers.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {selectedSubscribers.length} selected
                  </span>
                  <button
                    onClick={handleUnsubscribeSelected}
                    disabled={managingSubscribers}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                  >
                    {managingSubscribers ? 'Unsubscribing...' : 'Unsubscribe Selected'}
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {managementResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-3 rounded-md text-sm ${
                managementResult.startsWith('✅') 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {managementResult}
            </motion.div>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedSubscribers.length === data.subscribers.length && data.subscribers.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-bloompink focus:ring-bloompink"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.subscribers.map((subscriber) => (
                <tr key={subscriber.id} className={selectedSubscribers.includes(subscriber.id) ? 'bg-blue-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedSubscribers.includes(subscriber.id)}
                      onChange={() => handleSelectSubscriber(subscriber.id)}
                      className="rounded border-gray-300 text-bloompink focus:ring-bloompink"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {subscriber.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {subscriber.firstName ? `${subscriber.firstName} ${subscriber.lastName || ''}`.trim() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {(subscriber.signupSource || 'unknown').replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(subscriber.timestamp).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {data.subscribers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">No subscribers found</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterAdmin;