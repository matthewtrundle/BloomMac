'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import { OnboardingData } from '../OnboardingFlow';

interface CompleteStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  onComplete: () => void;
}

export default function CompleteStep({ 
  data, 
  onComplete,
  isLoading,
  setIsLoading,
  error,
  setError
}: CompleteStepProps) {
  const { user } = useAuth();

  const getAccessTypeMessage = () => {
    // Since we're not doing course selection, always show welcome message
    const firstName = data.firstName || user?.user_metadata?.first_name || '';
    return {
      title: firstName ? `Welcome to Bloom, ${firstName}!` : 'Welcome to Bloom Psychology!',
      description: 'Your personalized wellness journey begins here. We\'re so glad you\'re joining our community.',
      action: 'Explore Your Dashboard',
      icon: '🌸'
    };
  };

  const accessMessage = getAccessTypeMessage();

  const getNextSteps = () => {
    // Welcome steps for all new users
    return [
      'Explore your personalized dashboard',
      'Browse our upcoming courses and workshops',
      'Join our supportive community',
      'Check your email for wellness tips and updates'
    ];
  };

  const nextSteps = getNextSteps();

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2 
          }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-bloompink to-bloom-sage mb-6"
        >
          <span className="text-4xl">{accessMessage.icon}</span>
        </motion.div>

        <h1 className="text-3xl font-bold text-bloom-dark mb-4">
          {accessMessage.title}
        </h1>
        
        <p className="text-lg text-bloom-gray-600 mb-8 max-w-md mx-auto">
          {accessMessage.description}
        </p>

        {/* Next Steps */}
        <div className="bg-bloom-sage-50 rounded-xl p-6 mb-8 text-left max-w-md mx-auto">
          <h3 className="font-semibold text-bloom-dark mb-4">What\'s Next:</h3>
          <ul className="space-y-3">
            {nextSteps.map((step, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-start"
              >
                <span className="text-bloompink mr-2">✓</span>
                <span className="text-bloom-gray-700">{step}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Marketing consent reminder if they opted in */}
        {data.marketingConsent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mb-6 p-4 bg-blue-50 rounded-lg max-w-md mx-auto"
          >
            <p className="text-sm text-blue-800 flex items-start gap-2">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span>
                <strong>You're subscribed!</strong> You'll receive wellness tips and course updates. 
                You can unsubscribe anytime from your dashboard.
              </span>
            </p>
          </motion.div>
        )}

        {/* Action Button */}
        <Button
          onClick={onComplete}
          disabled={isLoading}
          variant="pink"
          size="lg"
          className="min-w-[200px]"
        >
          {isLoading ? 'Loading...' : accessMessage.action}
        </Button>

        {error && (
          <p className="text-red-500 text-sm mt-4">{error}</p>
        )}
      </motion.div>

      {/* Floating celebration elements */}
      {/* Personal welcome message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-8 text-center"
      >
        <p className="text-sm text-bloom-gray-600 italic">
          "Welcome to our community. Your journey to wellness is unique, and we\'re here to support you every step of the way."
        </p>
        <p className="text-xs text-bloom-gray-500 mt-2">— Dr. Jana Rundle</p>
      </motion.div>
    </div>
  );
}