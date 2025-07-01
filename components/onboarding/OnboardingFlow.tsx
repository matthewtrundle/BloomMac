'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import WelcomeStep from './steps/WelcomeStep';
import AccountStep from './steps/AccountStep';
import ProfileStep from './steps/ProfileStep';
import AccessStep from './steps/AccessStep';
import ConsentStep from './steps/ConsentStep';
import CompleteStep from './steps/CompleteStep';

export type OnboardingData = {
  // Account info
  email?: string;
  password?: string;
  
  // Profile info
  firstName?: string;
  lastName?: string;
  phone?: string;
  
  // Maternal health info
  postpartumDate?: string;
  babyDueDate?: string;
  numberOfChildren?: number;
  
  // Emergency contact
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  
  // Access preferences
  accessType?: 'course' | 'workshop' | 'waitlist';
  courseId?: string;
  workshopId?: string;
  
  // Preferences
  timezone?: string;
  notificationPreferences?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  
  // Consents
  hipaaConsent?: boolean;
  marketingConsent?: boolean;
  termsAccepted?: boolean;
};

type OnboardingStep = 'welcome' | 'account' | 'profile' | 'access' | 'consent' | 'complete';

interface OnboardingFlowProps {
  initialStep?: OnboardingStep;
  courseId?: string;
  workshopId?: string;
  source?: string; // Track where user came from (e.g., 'teaser-video')
}

export default function OnboardingFlow({ 
  initialStep = 'welcome',
  courseId,
  workshopId,
  source = 'direct'
}: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(initialStep);
  const [data, setData] = useState<OnboardingData>({
    courseId,
    workshopId,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    notificationPreferences: {
      email: true,
      sms: false,
      push: true
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = useSupabaseClient();
  const user = useUser();

  // If user is already logged in, skip to profile step
  useEffect(() => {
    if (user && currentStep === 'welcome') {
      setCurrentStep('profile');
    }
  }, [user, currentStep]);

  const steps: OnboardingStep[] = ['welcome', 'account', 'profile', 'access', 'consent', 'complete'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const updateData = (newData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const prevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  const completeOnboarding = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Track onboarding completion
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'onboarding_completed',
          data: {
            source,
            access_type: data.accessType,
            course_id: data.courseId,
            workshop_id: data.workshopId
          }
        })
      });

      // Award welcome star achievement
      await fetch('/api/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          achievementId: 'welcome_star'
        })
      });

      // Always redirect to dashboard after onboarding
      // Users can access their courses/workshops from there
      router.push('/dashboard');
    } catch (err) {
      setError('Failed to complete onboarding. Please try again.');
      console.error('Onboarding completion error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    const stepProps = {
      data,
      updateData,
      nextStep,
      prevStep,
      isLoading,
      setIsLoading,
      error,
      setError
    };

    switch (currentStep) {
      case 'welcome':
        return <WelcomeStep {...stepProps} source={source} />;
      case 'account':
        return <AccountStep {...stepProps} />;
      case 'profile':
        return <ProfileStep {...stepProps} />;
      case 'access':
        return <AccessStep {...stepProps} />;
      case 'consent':
        return <ConsentStep {...stepProps} />;
      case 'complete':
        return <CompleteStep {...stepProps} onComplete={completeOnboarding} />;
      default:
        return <WelcomeStep {...stepProps} source={source} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-bloom-sage/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg font-semibold text-bloom-dark">Welcome to Bloom Psychology</h1>
            <span className="text-sm text-bloom-dark/60">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
          </div>
          <div className="w-full bg-bloom-sage/10 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-bloompink to-bloom-sage h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 bg-red-500 text-white p-4 rounded-lg shadow-lg max-w-md"
        >
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium">Something went wrong</p>
              <p className="text-sm opacity-90">{error}</p>
            </div>
            <button 
              onClick={() => setError(null)}
              className="ml-auto flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}