'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertCircle, Mail, UserPlus } from 'lucide-react';
import Image from 'next/image';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const errorCode = searchParams.get('error_code');

  // Determine the error message and suggested action
  let title = 'Authentication Error';
  let message = errorDescription || 'An error occurred during authentication.';
  let suggestedAction = null;

  if (errorCode === 'otp_expired' || error === 'invalid_request') {
    title = 'Link Expired or Invalid';
    message = 'This authentication link has expired or is invalid. This can happen if:';
    suggestedAction = 'expired';
  } else if (errorDescription?.includes('User not found')) {
    title = 'No Account Found';
    message = 'We couldn\'t find an account with this email address.';
    suggestedAction = 'signup';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-6">
            <Link href="/" className="inline-block">
              <Image
                src="/images/Logo/BLOOM-LOGO.png"
                alt="Bloom Psychology"
                width={120}
                height={60}
                className="mx-auto"
              />
            </Link>
          </div>

          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          {/* Error Message */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-playfair text-bloom-dark mb-4">{title}</h1>
            <p className="text-bloom-dark/70 mb-4">{message}</p>
            
            {suggestedAction === 'expired' && (
              <ul className="text-sm text-bloom-dark/60 text-left max-w-xs mx-auto space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-bloom-sage mt-0.5">•</span>
                  <span>The link was already used</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-bloom-sage mt-0.5">•</span>
                  <span>More than 1 hour has passed since it was sent</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-bloom-sage mt-0.5">•</span>
                  <span>You don\'t have an account yet</span>
                </li>
              </ul>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {suggestedAction === 'signup' || suggestedAction === 'expired' ? (
              <>
                <Link href="/auth/signup" className="block">
                  <button className="w-full bg-bloompink text-white py-3 rounded-lg font-semibold hover:bg-bloom-pink-dark transition-colors flex items-center justify-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Create New Account
                  </button>
                </Link>
                <Link href="/auth/login" className="block">
                  <button className="w-full bg-white text-bloom-dark border-2 border-bloom-sage py-3 rounded-lg font-semibold hover:bg-bloom-sage-50 transition-colors flex items-center justify-center gap-2">
                    <Mail className="w-5 h-5" />
                    Request New Login Link
                  </button>
                </Link>
              </>
            ) : (
              <Link href="/auth/login" className="block">
                <button className="w-full bg-bloompink text-white py-3 rounded-lg font-semibold hover:bg-bloom-pink-dark transition-colors">
                  Try Again
                </button>
              </Link>
            )}
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-sm text-bloom-dark/60">
              Need help?{' '}
              <Link href="/contact" className="text-bloompink hover:text-bloom-pink-dark">
                Contact our support team
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}