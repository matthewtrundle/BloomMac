'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

interface NewsletterSignupProps {
  variant?: 'banner' | 'inline' | 'modal' | 'footer';
  className?: string;
  onSuccess?: () => void;
  source?: string;
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ 
  variant = 'inline', 
  className = '',
  onSuccess,
  source = 'other'
}) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/newsletter-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          firstName: firstName || undefined,
          source,
          interests: ['mental-health', 'postpartum-support', 'wellness-tips']
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      setIsSuccess(true);
      setEmail('');
      setFirstName('');
      
      // Fire analytics event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'newsletter_signup', {
          event_category: 'engagement',
          event_label: source,
          value: 1
        });
      }

      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {
      console.error('Newsletter signup error:', error);
      setError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Footer variant (horizontal, minimal styling for footer context)
  if (variant === 'footer') {
    return (
      <form onSubmit={handleSubmit} className={`${className}`}>
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="form"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-bloom-accent focus:border-transparent disabled:opacity-50 backdrop-blur-sm"
              />
              <button
                type="submit"
                disabled={isLoading || !email}
                className="px-6 py-2.5 bg-bloom-accent hover:bg-bloom-accent/90 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isLoading ? 'Subscribing...' : 'Subscribe Free'}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center text-white py-3"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">You're subscribed! Check your email.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="text-red-300 text-sm mt-2 text-center"
          >
            {error}
          </motion.p>
        )}
      </form>
    );
  }

  // Banner variant (compact, horizontal)
  if (variant === 'banner') {
    return (
      <div className={`bg-gradient-to-r from-bloom-blush/20 to-bloom-accent/20 border border-bloom-accent/30 rounded-lg p-4 ${className}`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-semibold text-bloom text-lg mb-1">
              Weekly Mental Health Insights 🌸
            </h3>
            <p className="text-sm text-gray-600">
              Evidence-based tips for women, mothers & parents. Join 500+ subscribers.
            </p>
          </div>
          
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={isLoading}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-bloompink focus:border-transparent disabled:opacity-50 min-w-[200px]"
                />
                <Button
                  type="submit"
                  variant="pink"
                  size="sm"
                  disabled={isLoading || !email}
                  className="whitespace-nowrap"
                >
                  {isLoading ? 'Subscribing...' : 'Subscribe Free'}
                </Button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center text-green-600 font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                You're subscribed! 🎉
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="text-red-600 text-sm mt-2"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }

  // Inline variant (full form)
  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-bloom mb-2">
          Weekly Mental Health Insights
        </h3>
        <p className="text-gray-600">
          Join our community of 500+ women, mothers, and parents receiving evidence-based wellness tips every week.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.form
            key="form"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name (optional)
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Jane"
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloompink focus:border-transparent disabled:opacity-50"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  required
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloompink focus:border-transparent disabled:opacity-50"
                />
              </div>
            </div>

            <div className="bg-bloom-blush/10 p-4 rounded-lg">
              <h4 className="font-medium text-bloom mb-2">What you'll receive:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-bloom-accent rounded-full mr-2"></span>
                  Weekly blog posts on mental health topics
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-bloom-accent rounded-full mr-2"></span>
                  Evidence-based wellness strategies
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-bloom-accent rounded-full mr-2"></span>
                  Resources for postpartum & parenting challenges
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-bloom-accent rounded-full mr-2"></span>
                  Updates on workshops and services
                </li>
              </ul>
            </div>

            <Button
              type="submit"
              variant="pink"
              disabled={isLoading || !email}
              className="w-full"
            >
              {isLoading ? 'Subscribing...' : 'Subscribe to Newsletter'}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              We respect your privacy. Unsubscribe at any time. No spam, ever.
            </p>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-green-600 mb-2">Welcome to our community! 🎉</h3>
            <p className="text-gray-600 mb-4">
              Thank you for subscribing. Check your inbox for a welcome email with our latest resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a 
                href="/blog" 
                className="inline-flex items-center justify-center px-4 py-2 border border-bloom-accent text-bloom-accent rounded-md hover:bg-bloom-accent hover:text-white transition-colors"
              >
                Read Latest Articles
              </a>
              <a 
                href="/book" 
                className="inline-flex items-center justify-center px-4 py-2 bg-bloompink text-white rounded-md hover:bg-[#B03979] transition-colors"
              >
                Book Consultation
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-red-600 text-sm mt-4 text-center"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default NewsletterSignup;