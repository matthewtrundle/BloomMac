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
          <h3 className="font-semibold text-bloom-dark mb-4">Your Next Steps:</h3>
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
      <motion.div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-bloompink/20 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: '100%'
            }}
            initial={{ 
              y: 0,
              opacity: 0
            }}
            animate={{ 
              y: -400,
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
    </div>
  );
}