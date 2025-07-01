'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface NewsletterPreferences {
  isSubscribed: boolean;
  email: string;
  subscriptionSource: string;
  subscribedAt: string;
}

const NewsletterPreferences: React.FC = () => {
  const [preferences, setPreferences] = useState<NewsletterPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/user/newsletter-preferences', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setPreferences(data);
      } else if (response.status === 404) {
        // User not subscribed
        setPreferences({
          isSubscribed: false,
          email: '',
          subscriptionSource: '',
          subscribedAt: ''
        });
      }
    } catch (error) {
      console.error('Failed to fetch newsletter preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionToggle = async () => {
    setUpdating(true);
    setMessage('');

    try {
      const endpoint = preferences?.isSubscribed 
        ? '/api/user/newsletter-unsubscribe'
        : '/api/user/newsletter-subscribe';

      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(preferences?.isSubscribed 
          ? '✅ Successfully unsubscribed from newsletter'
          : '✅ Successfully subscribed to newsletter'
        );
        await fetchPreferences(); // Refresh data
      } else {
        setMessage(`❌ ${result.error || 'Failed to update subscription'}`);
      }
    } catch (error) {
      setMessage('❌ An error occurred while updating your subscription');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Newsletter Preferences</h2>
        <p className="text-gray-600 mt-1">Manage your email subscription settings</p>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-4">
              <div className={`w-3 h-3 rounded-full mr-3 ${
                preferences?.isSubscribed ? 'bg-green-500' : 'bg-gray-400'
              }`}></div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {preferences?.isSubscribed ? 'Subscribed' : 'Not Subscribed'}
                </h3>
                <p className="text-sm text-gray-600">
                  {preferences?.isSubscribed 
                    ? 'You receive our weekly mental health insights and updates'
                    : 'You are not currently subscribed to our newsletter'
                  }
                </p>
              </div>
            </div>

            {preferences?.isSubscribed && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Subscription Details</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Email:</strong> {preferences.email}</p>
                  <p><strong>Subscribed:</strong> {new Date(preferences.subscribedAt).toLocaleDateString()}</p>
                  <p><strong>Source:</strong> {preferences.subscriptionSource.replace('_', ' ')}</p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">What you'll receive:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-bloompink rounded-full mr-3"></span>
                  Weekly mental health insights and tips
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-bloompink rounded-full mr-3"></span>
                  New blog post notifications
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-bloompink rounded-full mr-3"></span>
                  Exclusive resources and guides
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-bloompink rounded-full mr-3"></span>
                  Workshop and event announcements
                </li>
              </ul>
            </div>
          </div>

          <div className="ml-6">
            <button
              onClick={handleSubscriptionToggle}
              disabled={updating}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                preferences?.isSubscribed
                  ? 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400'
                  : 'bg-bloompink text-white hover:bg-[#B03979] disabled:bg-pink-400'
              } disabled:cursor-not-allowed`}
            >
              {updating ? (
                preferences?.isSubscribed ? 'Unsubscribing...' : 'Subscribing...'
              ) : (
                preferences?.isSubscribed ? 'Unsubscribe' : 'Subscribe'
              )}
            </button>
          </div>
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-3 rounded-md text-sm ${
              message.startsWith('✅') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </motion.div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Email Frequency</h4>
            <p className="text-sm text-blue-700">
              We typically send 1-2 emails per week. You can unsubscribe at any time using the link 
              in any email or by updating your preferences here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterPreferences;