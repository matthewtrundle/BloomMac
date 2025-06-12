'use client';

import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-bloom-sage-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-bloom-sage" />
          </div>

          <h1 className="text-2xl font-playfair text-bloom-dark mb-4">Check Your Email</h1>
          
          <p className="text-bloom-dark/70 mb-6">
            We've sent you a magic link. Click the link in your email to sign in instantly - no password needed!
          </p>

          <div className="bg-bloom-sage-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-bloom-dark/70">
              <strong>Tip:</strong> The magic link expires in 1 hour. If you don't see the email, check your spam folder.
            </p>
          </div>

          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center gap-2 py-3 text-bloom-dark/70 hover:text-bloom-dark transition-colors"
          >
            Back to Login
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}