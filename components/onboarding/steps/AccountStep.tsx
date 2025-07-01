'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Button from '@/components/ui/Button';
import { OnboardingData } from '../OnboardingFlow';

interface AccountStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export default function AccountStep({ 
  data, 
  updateData, 
  nextStep, 
  prevStep, 
  isLoading, 
  setIsLoading, 
  error, 
  setError 
}: AccountStepProps) {
  const [email, setEmail] = useState(data.email || '');
  const [password, setPassword] = useState(data.password || '');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  
  const supabase = useSupabaseClient();

  const validateForm = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (!password) {
      setError('Password is required');
      return false;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleCreateAccount = async () => {
    setError(null);
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Check if email already exists
      const { data: existingUser } = await supabase.auth.signInWithPassword({
        email,
        password: 'dummy' // This will fail but tell us if email exists
      });

      if (existingUser) {
        setEmailExists(true);
        setError('An account with this email already exists. Please sign in instead.');
        setIsLoading(false);
        return;
      }
    } catch (err: any) {
      // If error is "Invalid login credentials", email might not exist (good)
      // If error is different, handle accordingly
      if (!err.message?.includes('Invalid login credentials')) {
        setError('Something went wrong. Please try again.');
        setIsLoading(false);
        return;
      }
    }

    try {
      // Create the account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            onboarding_source: 'course_signup',
            onboarding_step: 'account_created'
          }
        }
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          setEmailExists(true);
          setError('An account with this email already exists. Please sign in instead.');
        } else {
          setError(authError.message);
        }
        return;
      }

      if (authData.user) {
        // Update onboarding data
        updateData({ email, password });
        
        // Track account creation
        try {
          await fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event: 'account_created',
              data: {
                user_id: authData.user.id,
                email,
                source: 'onboarding'
              }
            })
          });
        } catch (analyticsError) {
          console.error('Analytics tracking failed:', analyticsError);
          // Don't block user flow for analytics errors
        }

        // Move to next step
        nextStep();
      }
    } catch (err: any) {
      setError('Failed to create account. Please try again.');
      console.error('Account creation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setError('Invalid email or password');
        return;
      }

      if (data.user) {
        updateData({ email });
        nextStep();
      }
    } catch (err: any) {
      setError('Failed to sign in. Please try again.');
      console.error('Sign in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-playfair text-bloom-dark mb-4">
            {emailExists ? 'Welcome Back!' : 'Create Your Account'}
          </h2>
          <p className="text-bloom-dark/70">
            {emailExists 
              ? 'Sign in to continue your journey' 
              : 'Your secure account for accessing Dr. Jana\'s wellness programs'
            }
          </p>
        </div>

        <div className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-bloom-dark mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailExists(false);
                setError(null);
              }}
              className="w-full px-4 py-3 border border-bloom-sage/20 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent transition-colors"
              placeholder="your@email.com"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-bloom-dark mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                className="w-full px-4 py-3 pr-12 border border-bloom-sage/20 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent transition-colors"
                placeholder={emailExists ? 'Enter your password' : 'Choose a secure password'}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-bloom-dark/40 hover:text-bloom-dark/60"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {!emailExists && (
              <p className="text-xs text-bloom-dark/50 mt-1">
                Minimum 6 characters
              </p>
            )}
          </div>

          {/* Confirm Password (only for new accounts) */}
          {!emailExists && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-bloom-dark mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError(null);
                }}
                className="w-full px-4 py-3 border border-bloom-sage/20 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent transition-colors"
                placeholder="Confirm your password"
                required
              />
            </div>
          )}

          {/* Security Notice */}
          <div className="bg-bloom-sage-50/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-bloom-sage mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-bloom-dark">HIPAA-Compliant Security</p>
                <p className="text-xs text-bloom-dark/60 mt-1">
                  Your account is protected with enterprise-grade security and meets all healthcare privacy requirements.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <Button
              onClick={emailExists ? handleSignIn : handleCreateAccount}
              variant="pink"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {emailExists ? 'Signing In...' : 'Creating Account...'}
                </div>
              ) : (
                emailExists ? 'Sign In' : 'Create Account'
              )}
            </Button>

            <div className="flex justify-between items-center">
              <Button
                onClick={prevStep}
                variant="outline"
                size="md"
                disabled={isLoading}
              >
                Back
              </Button>

              {emailExists && (
                <button
                  onClick={() => {
                    setEmailExists(false);
                    setPassword('');
                    setConfirmPassword('');
                    setError(null);
                  }}
                  className="text-sm text-bloompink hover:underline"
                >
                  Create new account instead
                </button>
              )}
            </div>
          </div>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-xs text-bloom-dark/50">
              Need help? <a href="/contact" className="text-bloompink hover:underline">Contact our support team</a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}