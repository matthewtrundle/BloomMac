'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
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
// Note: 'access' step is currently skipped in the flow but kept for future use

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
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  // Determine initial step based on auth state and source
  const getInitialStep = (): OnboardingStep => {
    // If coming from signup, we know user just created account
    if (source === 'signup') {
      return 'profile'; // Go to profile to collect additional info (phone, etc)
    }
    // If user is already authenticated, skip to profile
    if (user) {
      return 'profile';
    }
    return initialStep;
  };
  
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(getInitialStep());
  const [data, setData] = useState<OnboardingData>({
    email: user?.email, // Prefill email if user is authenticated
    courseId,
    workshopId,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    notificationPreferences: {
      email: true,
      sms: false,
      push: true
    },
    // If coming from signup, user already accepted terms
    termsAccepted: source === 'signup' ? true : false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update step when auth state changes
  useEffect(() => {
    if (!authLoading && user) {
      // If user is authenticated and on welcome/account steps, skip to profile
      if (currentStep === 'welcome' || currentStep === 'account') {
        setCurrentStep('profile');
      }
      // Update email if available
      if (user.email && !data.email) {
        setData(prev => ({ ...prev, email: user.email }));
      }
    }
  }, [user, authLoading, currentStep]);

  // Dynamic steps based on authentication status and source
  const steps: OnboardingStep[] = (() => {
    if (source === 'signup' && user) {
      // User just signed up - skip welcome and account, and skip access (course selection)
      return ['profile', 'consent', 'complete'];
    } else if (user) {
      // Existing authenticated user - skip access (course selection)
      return ['profile', 'consent', 'complete'];
    } else {
      // New user, not authenticated - skip access (course selection)
      return ['welcome', 'account', 'profile', 'consent', 'complete'];
    }
  })();
    
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const updateData = (newData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
      // Scroll to top when moving to next step
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
      // Scroll to top when moving to previous step
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const completeOnboarding = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // For new signups, ensure session is established before proceeding
      if (source === 'signup' && user) {
        console.log('Verifying session for new signup...');
        
        // Try to refresh the session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          console.error('Session not ready:', sessionError);
          
          // Wait a bit and try again
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Force a session refresh
          const { data: { session: retrySession } } = await supabase.auth.getSession();
          
          if (!retrySession) {
            setError('Your session is being established. Please wait a moment and try again.');
            setIsLoading(false);
            
            // Retry after 3 seconds
            setTimeout(() => {
              completeOnboarding();
            }, 3000);
            return;
          }
        }
      }
      
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
      <div className="fixed top-[88px] left-0 right-0 z-40 bg-white/90 backdrop-blur-sm border-b border-bloom-sage/10">
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
      <div className="pt-48 pb-12">
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
              <p className="text-sm opacity-90">{error || 'An unexpected error occurred'}</p>
              <p className="text-xs opacity-75 mt-1">Step: {currentStep}</p>
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