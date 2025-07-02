'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { OnboardingData } from '../OnboardingFlow';
import { useAuth } from '@/contexts/AuthContext';

interface WelcomeStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  source?: string;
}

export default function WelcomeStep({ data, updateData, nextStep, source }: WelcomeStepProps) {
  const { user } = useAuth();
  
  const getWelcomeMessage = () => {
    // Special message for users who just signed up
    if (source === 'signup' && user) {
      return {
        title: "Welcome to Bloom Psychology!",
        subtitle: "Your account is ready",
        description: "Let's personalize your experience in just a few quick steps."
      };
    }
    
    switch (source) {
      case 'teaser-video':
        return {
          title: "Ready to Transform Your Postpartum Journey?",
          subtitle: "You've taken the first step by watching Dr. Jana's message",
          description: "Let's create your personalized wellness plan and get you access to the support you need."
        };
      case 'course-page':
        return {
          title: "Welcome to Your Wellness Journey",
          subtitle: "Join hundreds of moms finding peace and confidence",
          description: "Let's set up your account and personalize your experience with Dr. Jana's evidence-based approach."
        };
      default:
        return {
          title: "Welcome to Bloom Psychology",
          subtitle: "Your journey to postpartum wellness starts here",
          description: "We'll guide you through a quick setup to personalize your experience and connect you with the right support."
        };
    }
  };

  const welcome = getWelcomeMessage();

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        {/* Icon/Logo */}
        <div className="w-20 h-20 bg-gradient-to-br from-bloompink to-bloom-sage rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>

        <h1 className="text-3xl md:text-4xl font-playfair text-bloom-dark mb-4">
          {welcome.title}
        </h1>

        <p className="text-lg text-bloompink mb-6 font-medium">
          {welcome.subtitle}
        </p>

        <p className="text-bloom-dark/70 mb-8 leading-relaxed">
          {welcome.description}
        </p>

        {/* Value Props */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center"
          >
            <div className="w-12 h-12 bg-bloom-sage/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-bloom-dark mb-2">Quick Setup</h3>
            <p className="text-sm text-bloom-dark/60">Just 2-3 minutes to get started</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <div className="w-12 h-12 bg-bloompink/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-bloompink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-semibold text-bloom-dark mb-2">HIPAA Secure</h3>
            <p className="text-sm text-bloom-dark/60">Your information is completely protected</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center"
          >
            <div className="w-12 h-12 bg-bloom-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-bloom-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-bloom-dark mb-2">Personalized</h3>
            <p className="text-sm text-bloom-dark/60">Tailored to your unique needs</p>
          </motion.div>
        </div>

        {/* Trust Indicators */}
        <div className="bg-bloom-sage-50/30 rounded-lg p-4 mb-8">
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-bloom-dark/60">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Licensed Psychologist</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>500+ Moms Helped</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Evidence-Based Methods</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-4">
          <Button 
            onClick={nextStep}
            variant="pink" 
            size="lg" 
            className="w-full md:w-auto px-12"
          >
            Let's Get Started
          </Button>
          
          <p className="text-xs text-bloom-dark/50">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </motion.div>
    </div>
  );
}