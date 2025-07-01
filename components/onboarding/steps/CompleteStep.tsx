'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@supabase/auth-helpers-react';
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
  const user = useUser();

  const getAccessTypeMessage = () => {
    switch (data.accessType) {
      case 'course':
        return {
          title: 'Course Access Ready!',
          description: 'You now have access to Dr. Jana\'s complete wellness program',
          action: 'Start Your Course',
          icon: '📚'
        };
      case 'workshop':
        return {
          title: 'Workshop Registration Complete!',
          description: 'You\'ll receive details about upcoming live sessions',
          action: 'View Workshop Schedule',
          icon: '👥'
        };
      case 'waitlist':
        return {
          title: 'Welcome to the Waitlist!',
          description: 'You\'ll be the first to know when courses and workshops launch',
          action: 'Go to Dashboard',
          icon: '⭐'
        };
      default:
        return {
          title: 'Welcome to Bloom Psychology!',
          description: 'Your wellness journey starts now',
          action: 'Continue',
          icon: '🌸'
        };
    }
  };

  const accessMessage = getAccessTypeMessage();

  const getNextSteps = () => {
    if (data.accessType === 'waitlist') {
      return [
        'Check your email for a welcome message',
        'Follow us on social media for updates',
        'Look out for early access notifications',
        'Explore our free resources in the meantime'
      ];
    } else if (data.accessType === 'workshop') {
      return [
        'Check your email for workshop details',
        'Add workshop dates to your calendar',
        'Prepare any questions you\'d like to ask',
        'Join our community discussion group'
      ];
    } else {
      return [
        'Start with Week 1: Understanding Your Journey',
        'Complete your wellness assessment',
        'Set up your daily meditation practice',
        'Join our private community group'
      ];
    }
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
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="w-24 h-24 bg-gradient-to-br from-bloompink to-bloom-sage rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-4xl"
          >
            {accessMessage.icon}
          </motion.div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-3xl md:text-4xl font-playfair text-bloom-dark mb-4"
        >
          {accessMessage.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg text-bloom-dark/70 mb-8"
        >
          {accessMessage.description}
        </motion.p>

        {/* User Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-bloom-sage-50/30 rounded-lg p-6 mb-8"
        >
          <h3 className="font-semibold text-bloom-dark mb-4">Your Account Summary</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="text-left">
              <p className="text-bloom-dark/60">Welcome,</p>
              <p className="font-medium text-bloom-dark">
                {data.firstName} {data.lastName}
              </p>
            </div>
            <div className="text-left">
              <p className="text-bloom-dark/60">Access Type</p>
              <p className="font-medium text-bloom-dark capitalize">
                {data.accessType === 'waitlist' ? 'Waitlist Member' : data.accessType}
              </p>
            </div>
            {data.numberOfChildren && (
              <div className="text-left">
                <p className="text-bloom-dark/60">Children</p>
                <p className="font-medium text-bloom-dark">
                  {data.numberOfChildren} {data.numberOfChildren === 1 ? 'child' : 'children'}
                </p>
              </div>
            )}
            <div className="text-left">
              <p className="text-bloom-dark/60">Email</p>
              <p className="font-medium text-bloom-dark">{data.email}</p>
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-bloompink/5 rounded-lg p-6 mb-8"
        >
          <h3 className="font-semibold text-bloom-dark mb-4 flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-bloompink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            What's Next?
          </h3>
          <div className="space-y-3">
            {nextSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-start gap-3 text-left"
              >
                <span className="flex-shrink-0 w-6 h-6 bg-bloompink text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <span className="text-sm text-bloom-dark/70">{step}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Special Messages */}
        {data.accessType === 'waitlist' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-bloom-accent/10 rounded-lg p-4 mb-8"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <svg className="w-5 h-5 text-bloom-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-bloom-accent">Launch Date: July 2025</span>
            </div>
            <p className="text-sm text-bloom-dark/60">
              You'll receive an email with early access pricing 30 days before our official launch
            </p>
          </motion.div>
        )}

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="space-y-4"
        >
          <Button
            onClick={onComplete}
            variant="pink"
            size="lg"
            className="w-full md:w-auto px-12"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Setting up your dashboard...
              </div>
            ) : (
              accessMessage.action
            )}
          </Button>

          <div className="flex items-center justify-center gap-4 text-sm text-bloom-dark/50">
            <span>Need help?</span>
            <a href="/contact" className="text-bloompink hover:underline">
              Contact Support
            </a>
          </div>
        </div>

        {/* Celebration Confetti Effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute inset-0 pointer-events-none overflow-hidden"
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-bloompink rounded-full"
              initial={{ 
                x: Math.random() * 400,
                y: -20,
                opacity: 0
              }}
              animate={{ 
                y: 400,
                opacity: [0, 1, 0],
                rotate: 360
              }}
              transition={{ 
                duration: 3,
                delay: i * 0.2,
                repeat: Infinity,
                repeatDelay: 5
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}