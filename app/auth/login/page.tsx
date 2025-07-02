'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [useMagicLink, setUseMagicLink] = useState(false);
  
  const { signIn, signInWithMagicLink } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (useMagicLink) {
        await signInWithMagicLink(email);
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      // Handle specific error for non-existent users trying magic link
      if (err.message?.includes('User not found') || err.message?.includes('Invalid login credentials')) {
        if (useMagicLink) {
          setError('No account found with this email. Please sign up first to create an account.');
          // Optionally redirect to signup after a delay
          setTimeout(() => {
            router.push(`/auth/signup?email=${encodeURIComponent(email)}`);
          }, 3000);
        } else {
          setError('Invalid email or password');
        }
      } else {
        setError(err.message || 'An error occurred during login');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <Image
                src="/images/Logo/BLOOM-LOGO.png"
                alt="Bloom Psychology"
                width={120}
                height={60}
                className="mx-auto"
              />
            </Link>
            <h1 className="text-2xl font-playfair text-bloom-dark mt-4">Welcome Back</h1>
            <p className="text-bloom-dark/60 mt-2">
              {useMagicLink ? 'Enter your email for a magic link' : 'Sign in to continue your wellness journey'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-bloom-dark mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bloom-dark/40 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {!useMagicLink && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-bloom-dark mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bloom-dark/40 w-5 h-5" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                    placeholder="••••••••"
                    required={!useMagicLink}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-bloom-dark/40 hover:text-bloom-dark"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setUseMagicLink(!useMagicLink)}
                className="text-sm text-bloompink hover:text-bloom-pink-dark"
              >
                {useMagicLink ? 'Use password instead' : 'Use magic link'}
              </button>
              
              {!useMagicLink && (
                <Link href="/auth/forgot-password" className="text-sm text-bloompink hover:text-bloom-pink-dark">
                  Forgot password?
                </Link>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-bloompink text-white py-3 rounded-lg font-semibold hover:bg-bloom-pink-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {useMagicLink ? 'Sending magic link...' : 'Signing in...'}
                </>
              ) : (
                useMagicLink ? 'Send Magic Link' : 'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-bloom-dark/60">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-bloompink hover:text-bloom-pink-dark font-medium">
                Sign up free
              </Link>
            </p>
            <p className="text-xs text-bloom-dark/40 mt-1">
              Get access to resources, track progress, and more
            </p>
          </div>

          {/* Divider */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-bloom-dark/40">or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Quick access for course purchasers */}
          <div className="mt-6 p-4 bg-bloom-sage-50 rounded-lg">
            <p className="text-sm text-bloom-dark/70 text-center">
              <strong>Purchased a course?</strong> Use the same email you used during checkout to access your content.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}