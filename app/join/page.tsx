'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Check, Gift, Heart, Sparkles } from 'lucide-react';
// JsonLd import removed - using inline script tag instead

// Metadata is handled in layout.tsx for client components

export default function InstagramNewsletterPage() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setStatus('idle');

    try {
      const response = await fetch('/api/user/newsletter-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          firstName,
          source: 'instagram-join',
          interests: ['mental-wellness', 'self-care', 'therapy-resources']
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Welcome to the Bloom family! Check your inbox for your free gift 🎁');
        
        // Track conversion
        if (window.gtag) {
          window.gtag('event', 'conversion', {
            'send_to': 'instagram_newsletter_signup',
            'value': 1.0,
            'currency': 'USD'
          });
        }
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const testimonials = [
    { name: "Sarah M.", text: "These emails are like therapy between therapy! 💕", rating: 5 },
    { name: "Jessica R.", text: "Finally, mental health tips that actually work", rating: 5 },
    { name: "Maria L.", text: "The free guide literally changed my anxiety game", rating: 5 }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Join Bloom Psychology Newsletter - Free Mental Wellness Guide",
            "description": "Get weekly mental health tips, self-care strategies, and a FREE anxiety relief guide. Join our community prioritizing mental wellness.",
            "url": "https://bloompsychologynorthaustin.com/join",
            "inLanguage": "en-US",
            "publisher": {
              "@type": "Organization",
              "name": "Bloom Psychology",
              "logo": {
                "@type": "ImageObject",
                "url": "https://bloompsychologynorthaustin.com/images/Logo/logo.jpg"
              }
            }
          })
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
        {/* Hero Section - Mobile Optimized */}
        <section className="relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-200 rounded-full blur-3xl opacity-20" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20" />
          
          <div className="relative z-10 px-4 pt-8 pb-12 max-w-lg mx-auto">
            {/* Logo */}
            <div className="text-center mb-6">
              <h1 className="text-4xl font-playfair text-bloom-darkGrey mb-2">
                <span className="text-bloompink">Bloom</span> Psychology
              </h1>
              <p className="text-sm text-gray-600">Your weekly dose of mental wellness 🌸</p>
            </div>


            {/* Value Proposition */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Transform Your Mental Health in 
                <span className="text-bloompink"> 5 Minutes a Week</span>
              </h2>
              <p className="text-gray-600">
                Get evidence-based tips that actually work
              </p>
            </div>


            {/* Sign Up Form */}
            <AnimatePresence mode="wait">
              {status !== 'success' ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-4 mb-8"
                >
                  <div>
                    <input
                      type="text"
                      placeholder="First name (optional) 💕"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent text-center"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Your email address 📧"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent text-center"
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={isLoading || !email}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-bloompink hover:bg-[#B03979] text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50 text-lg"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Joining...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Get Your FREE Guide Now
                        <Sparkles className="w-5 h-5" />
                      </span>
                    )}
                  </motion.button>
                  {status === 'error' && (
                    <p className="text-red-600 text-sm text-center">{message}</p>
                  )}
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">You're In! 🎉</h3>
                  <p className="text-gray-600 mb-4">{message}</p>
                  <p className="text-sm text-gray-500">
                    P.S. Check your spam folder if you don't see our email
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* What You Get */}
            {status !== 'success' && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-bloompink" />
                  What You'll Get (100% Free):
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <span className="font-medium">Instant Access:</span>
                      <span className="text-gray-600"> "5 Grounding Techniques for Anxious Moments" guide</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <span className="font-medium">Weekly Wisdom:</span>
                      <span className="text-gray-600"> Evidence-based mental health tips every Thursday</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <span className="font-medium">Exclusive Access:</span>
                      <span className="text-gray-600"> First dibs on workshops & special offers</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <span className="font-medium">Real Stories:</span>
                      <span className="text-gray-600"> Inspiring journeys from women like you</span>
                    </div>
                  </li>
                </ul>
              </div>
            )}


            {/* Trust Badges */}
            <div className="text-center space-y-3 mb-8">
              <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-red-500" />
                  No spam ever
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-green-500" />
                  Unsubscribe anytime
                </span>
              </div>
              <p className="text-xs text-gray-500">
                By a licensed psychologist who gets it 👩‍⚕️
              </p>
            </div>

            {/* About Section */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 text-center">
              <div className="w-20 h-20 mx-auto mb-4 relative">
                <Image
                  src="/images/Team/Jana Rundle.jpg"
                  alt="Dr. Jana Rundle"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <h4 className="font-bold text-gray-900 mb-1">Dr. Jana Rundle</h4>
              <p className="text-sm text-gray-600 mb-3">
                Licensed Psychologist & Founder of Bloom Psychology
              </p>
              <p className="text-sm text-gray-600 italic">
                "I created this newsletter because I believe every woman deserves 
                accessible mental health support. These are the exact strategies 
                I share with my clients - now available to you for free."
              </p>
            </div>

            {/* Instagram Follow CTA */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 mb-2">Want daily tips? Follow us! 👇</p>
              <a
                href="https://www.instagram.com/bloompsychology.atx/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-bloompink font-medium hover:underline"
              >
                @bloompsychology.atx
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                </svg>
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}