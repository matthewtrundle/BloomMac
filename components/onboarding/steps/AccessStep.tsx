'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { OnboardingData } from '../OnboardingFlow';

interface AccessStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export default function AccessStep({ 
  data, 
  updateData, 
  nextStep, 
  prevStep,
  isLoading,
  setIsLoading,
  error,
  setError
}: AccessStepProps) {
  const [selectedAccess, setSelectedAccess] = useState<'course' | 'workshop' | 'waitlist'>(
    data.accessType || 'course'
  );

  const accessOptions = [
    {
      id: 'course' as const,
      title: 'Digital Course',
      subtitle: 'Self-paced online learning',
      price: '$197',
      originalPrice: '$297',
      description: 'Complete 6-week program with Dr. Jana\'s video lessons, workbooks, and lifetime access',
      features: [
        'Weekly video lessons with Dr. Jana',
        'Downloadable workbooks and exercises', 
        'Audio meditations for busy moms',
        'Lifetime access to all materials',
        'Certificate of completion',
        'Mobile-friendly platform'
      ],
      badge: '30% Launch Discount',
      available: false // Courses are coming soon
    },
    {
      id: 'workshop' as const,
      title: 'Live Workshop',
      subtitle: 'Interactive group sessions',
      price: '$97',
      originalPrice: null,
      description: 'Join Dr. Jana for live, interactive workshops with other new moms',
      features: [
        'Live sessions with Dr. Jana',
        'Small group discussions',
        'Real-time Q&A support',
        'Peer connection opportunities',
        'Workshop materials included',
        'Follow-up resources'
      ],
      badge: 'Limited Spots',
      available: false // Workshops coming soon
    },
    {
      id: 'waitlist' as const,
      title: 'Join Waitlist',
      subtitle: 'Get early access + special pricing',
      price: 'Free',
      originalPrice: null,
      description: 'Be the first to know when courses and workshops launch',
      features: [
        'Early access to all programs',
        'Special launch pricing (30% off)',
        'Exclusive pre-launch content',
        'Priority workshop registration',
        'Monthly wellness tips',
        'Community updates'
      ],
      badge: 'Most Popular',
      available: true
    }
  ];

  const handleContinue = async () => {
    setError(null);
    setIsLoading(true);

    try {
      // Update data with selection
      updateData({ accessType: selectedAccess });

      // Track access type selection
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'access_type_selected',
          data: {
            access_type: selectedAccess,
            onboarding_step: 'access'
          }
        })
      });

      // If waitlist, add to subscribers table
      if (selectedAccess === 'waitlist') {
        await fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            source: 'onboarding_waitlist',
            tags: ['course_waitlist', 'new_user']
          })
        });
      }

      nextStep();
    } catch (err) {
      setError('Failed to save your selection. Please try again.');
      console.error('Access selection error:', err);
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
            Choose Your Path to Wellness
          </h2>
          <p className="text-bloom-dark/70">
            Select the option that best fits your learning style and schedule
          </p>
        </div>

        <div className="space-y-6">
          {accessOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                selectedAccess === option.id
                  ? 'border-bloompink bg-bloompink/5 shadow-lg'
                  : option.available 
                    ? 'border-bloom-sage/20 hover:border-bloom-sage/40 hover:shadow-md'
                    : 'border-gray-200 bg-gray-50/50'
              } ${!option.available ? 'opacity-75' : ''}`}
              onClick={() => option.available && setSelectedAccess(option.id)}
            >
              {/* Badge */}
              {option.badge && (
                <div className={`absolute -top-3 left-6 px-3 py-1 rounded-full text-xs font-medium ${
                  option.id === 'waitlist' 
                    ? 'bg-bloompink text-white'
                    : option.available
                      ? 'bg-bloom-sage text-white'
                      : 'bg-gray-400 text-white'
                }`}>
                  {option.badge}
                </div>
              )}

              {/* Coming Soon Badge */}
              {!option.available && option.id !== 'waitlist' && (
                <div className="absolute -top-3 right-6 px-3 py-1 rounded-full text-xs font-medium bg-gray-400 text-white">
                  Coming Soon
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAccess === option.id
                        ? 'border-bloompink bg-bloompink'
                        : 'border-bloom-sage/30'
                    }`}>
                      {selectedAccess === option.id && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-bloom-dark">{option.title}</h3>
                      <p className="text-bloom-dark/60">{option.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-bloom-dark/70 mb-4">{option.description}</p>

                  {/* Features List */}
                  <div className="grid md:grid-cols-2 gap-2">
                    {option.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-bloom-dark/70">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div className="text-right ml-6">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-bold ${
                      option.id === 'waitlist' ? 'text-bloom-sage' : 'text-bloompink'
                    }`}>
                      {option.price}
                    </span>
                    {option.originalPrice && (
                      <span className="text-lg text-bloom-dark/40 line-through">
                        {option.originalPrice}
                      </span>
                    )}
                  </div>
                  {option.originalPrice && (
                    <p className="text-xs text-green-600 font-medium">Save $100</p>
                  )}
                </div>
              </div>

              {/* Availability Status */}
              {!option.available && option.id !== 'waitlist' && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Launching July 2025!</strong> Join the waitlist to be notified when this option becomes available.
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-bloom-sage-50/30 rounded-lg p-6">
          <h4 className="font-semibold text-bloom-dark mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Why Start with the Waitlist?
          </h4>
          
          <div className="grid md:grid-cols-2 gap-4 text-sm text-bloom-dark/70">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Get 30% off launch pricing when courses go live</span>
            </div>
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>First access to workshop registration spots</span>
            </div>
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Exclusive pre-launch wellness content</span>
            </div>
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Monthly wellness tips and community updates</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 mt-8">
          <Button
            onClick={handleContinue}
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
                Processing...
              </div>
            ) : (
              `Continue with ${accessOptions.find(o => o.id === selectedAccess)?.title}`
            )}
          </Button>

          <Button
            onClick={prevStep}
            variant="outline"
            size="md"
            disabled={isLoading}
            className="w-full md:w-auto"
          >
            Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
}