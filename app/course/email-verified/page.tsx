'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EmailVerifiedPage() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Auto-redirect to course login after 5 seconds
    const timer = setTimeout(() => {
      setIsRedirecting(true);
      router.push('/my-courses');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  const handleContinue = () => {
    setIsRedirecting(true);
    router.push('/my-courses');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-soft p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          {/* Header */}
          <h1 className="text-3xl font-playfair text-bloom-dark mb-4">
            Email Verified Successfully! 🎉
          </h1>
          
          <div className="space-y-6 text-bloom-dark/70">
            <p className="text-lg">
              Welcome to your wellness journey with Bloom Psychology!
            </p>
            
            <div className="bg-bloom-sage-50 rounded-lg p-6">
              <h3 className="font-semibold text-bloom-dark mb-4">What's next?</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-bloompink rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-medium">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-bloom-dark">Sign in to your account</p>
                    <p className="text-sm text-bloom-dark/60">Use your email and password to access your courses</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-bloompink rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-medium">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-bloom-dark">Start your course</p>
                    <p className="text-sm text-bloom-dark/60">Begin Week 1 of your Postpartum Wellness Foundations journey</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-bloompink rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-medium">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-bloom-dark">Track your progress</p>
                    <p className="text-sm text-bloom-dark/60">Complete lessons and workbook exercises at your own pace</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-bloom-pink-50 rounded-lg p-6">
              <h4 className="font-semibold text-bloom-dark mb-2">Need support?</h4>
              <p className="text-sm text-bloom-dark/70 mb-3">
                Our team is here to help you every step of the way. Reach out anytime:
              </p>
              <div className="space-y-1 text-sm">
                <p>
                  📧 <a href="mailto:support@bloompsychologynorthaustin.com" className="text-bloompink hover:underline">
                    support@bloompsychologynorthaustin.com
                  </a>
                </p>
                <p>
                  📞 <a href="tel:+15127501234" className="text-bloompink hover:underline">
                    (512) 750-1234
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-4">
            <button
              onClick={handleContinue}
              disabled={isRedirecting}
              className="w-full bg-bloompink text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-bloom-pink-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isRedirecting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Redirecting...
                </>
              ) : (
                <>
                  Continue to My Courses
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
            
            <p className="text-sm text-bloom-dark/60">
              {isRedirecting ? 'Redirecting in a moment...' : 'Automatically redirecting in 5 seconds...'}
            </p>
          </div>

          {/* Additional Links */}
          <div className="mt-8 pt-6 border-t border-gray-200 space-y-2">
            <Link
              href="/"
              className="text-bloom-dark/60 hover:text-bloompink transition-colors"
            >
              Return to main site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}