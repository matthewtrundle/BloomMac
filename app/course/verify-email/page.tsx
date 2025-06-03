'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState('');

  const handleResendEmail = async () => {
    if (!email) return;
    
    setResending(true);
    setError('');

    try {
      const response = await fetch('/api/course/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setResent(true);
      } else {
        setError(data.error || 'Failed to resend verification email');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-soft p-8 text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          {/* Header */}
          <h1 className="text-3xl font-playfair text-bloom-dark mb-4">
            Check Your Email
          </h1>
          
          <div className="space-y-4 text-bloom-dark/70">
            <p className="text-lg">
              We've sent a verification email to:
            </p>
            
            {email && (
              <p className="text-xl font-medium text-bloompink">
                {email}
              </p>
            )}
            
            <div className="bg-bloom-sage-50 rounded-lg p-6 text-left">
              <h3 className="font-semibold text-bloom-dark mb-3">Next steps:</h3>
              <ol className="space-y-2 list-decimal list-inside text-sm">
                <li>Check your email inbox (and spam folder)</li>
                <li>Click the verification link in the email</li>
                <li>Once verified, you can sign in to access your course</li>
              </ol>
            </div>
            
            <div className="pt-4">
              <p className="text-sm mb-4">
                Didn't receive the email?
              </p>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              
              {resent && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-green-600 text-sm">Verification email sent successfully!</p>
                </div>
              )}
              
              <button
                onClick={handleResendEmail}
                disabled={resending || !email}
                className="bg-bloompink text-white px-6 py-2 rounded-lg hover:bg-bloom-pink-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resending ? 'Sending...' : 'Resend verification email'}
              </button>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="font-semibold text-bloom-dark mb-3">Need help?</h4>
            <div className="space-y-2 text-sm text-bloom-dark/60">
              <p>
                Email us at{' '}
                <a href="mailto:support@bloompsychologynorthaustin.com" className="text-bloompink hover:underline">
                  support@bloompsychologynorthaustin.com
                </a>
              </p>
              <p>
                Or call us at{' '}
                <a href="tel:+15127501234" className="text-bloompink hover:underline">
                  (512) 750-1234
                </a>
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
            <Link
              href="/my-courses"
              className="w-full bg-bloom-sage text-white py-3 px-6 rounded-lg hover:bg-bloom-sage-dark transition-colors block"
            >
              Try signing in
            </Link>
            
            <Link
              href="/course/register"
              className="text-bloompink hover:text-bloom-pink-dark font-medium"
            >
              Register a different email
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-soft p-8 text-center">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-6"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}