'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { OnboardingData } from '../OnboardingFlow';

interface ConsentStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export default function ConsentStep({ 
  data, 
  updateData, 
  nextStep, 
  prevStep,
  isLoading,
  setIsLoading,
  error,
  setError
}: ConsentStepProps) {
  const [consents, setConsents] = useState({
    hipaaConsent: data.hipaaConsent || false,
    marketingConsent: data.marketingConsent || false,
    termsAccepted: data.termsAccepted || false
  });

  const handleConsentChange = (consentType: keyof typeof consents, value: boolean) => {
    setConsents(prev => ({
      ...prev,
      [consentType]: value
    }));
    setError(null);
  };

  const handleContinue = async () => {
    setError(null);

    // HIPAA consent is required for healthcare services
    if (!consents.hipaaConsent) {
      setError('HIPAA consent is required to access our wellness programs');
      return;
    }

    // Terms must be accepted
    if (!consents.termsAccepted) {
      setError('Please accept the Terms of Service to continue');
      return;
    }

    setIsLoading(true);

    try {
      // Update data with consents
      updateData(consents);

      // Track consent completion
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'consent_completed',
          data: {
            hipaa_consent: consents.hipaaConsent,
            marketing_consent: consents.marketingConsent,
            terms_accepted: consents.termsAccepted,
            onboarding_step: 'consent'
          }
        })
      });

      nextStep();
    } catch (err) {
      setError('Failed to save consent preferences. Please try again.');
      console.error('Consent save error:', err);
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
            Privacy & Consent
          </h2>
          <p className="text-bloom-dark/70">
            Your privacy and consent are essential to providing you with the best care
          </p>
        </div>

        <div className="space-y-6">
          {/* HIPAA Consent - Required */}
          <div className="bg-bloom-sage-50/30 rounded-lg p-6 border-2 border-bloom-sage/20">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consents.hipaaConsent}
                    onChange={(e) => handleConsentChange('hipaaConsent', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-6 h-6 bg-white border-2 border-bloom-sage peer-focus:ring-2 peer-focus:ring-bloompink rounded peer-checked:bg-bloom-sage peer-checked:border-bloom-sage transition-colors">
                    {consents.hipaaConsent && (
                      <svg className="w-4 h-4 text-white m-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </label>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-bloom-dark">HIPAA Authorization</h3>
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">Required</span>
                </div>
                <p className="text-sm text-bloom-dark/70 mb-3">
                  I authorize Bloom Psychology to use and disclose my health information as described in the 
                  <a href="/privacy-policy" target="_blank" className="text-bloompink hover:underline"> HIPAA Notice of Privacy Practices</a>.
                </p>
                <div className="text-xs text-bloom-dark/60 space-y-1">
                  <p>• This authorization covers information needed to provide your wellness care</p>
                  <p>• You may revoke this authorization at any time by contacting us</p>
                  <p>• This authorization expires when your care with us ends</p>
                </div>
              </div>
            </div>
          </div>

          {/* Terms of Service - Required */}
          <div className="bg-bloompink/5 rounded-lg p-6 border-2 border-bloompink/20">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consents.termsAccepted}
                    onChange={(e) => handleConsentChange('termsAccepted', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-6 h-6 bg-white border-2 border-bloompink peer-focus:ring-2 peer-focus:ring-bloompink rounded peer-checked:bg-bloompink peer-checked:border-bloompink transition-colors">
                    {consents.termsAccepted && (
                      <svg className="w-4 h-4 text-white m-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </label>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-bloom-dark">Terms of Service</h3>
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">Required</span>
                </div>
                <p className="text-sm text-bloom-dark/70">
                  I have read and agree to the 
                  <a href="/terms" target="_blank" className="text-bloompink hover:underline"> Terms of Service</a> and 
                  <a href="/privacy-policy" target="_blank" className="text-bloompink hover:underline"> Privacy Policy</a>.
                </p>
              </div>
            </div>
          </div>

          {/* Marketing Consent - Optional */}
          <div className="bg-bloom-accent/5 rounded-lg p-6 border border-bloom-accent/20">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consents.marketingConsent}
                    onChange={(e) => handleConsentChange('marketingConsent', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-6 h-6 bg-white border-2 border-bloom-accent peer-focus:ring-2 peer-focus:ring-bloom-accent rounded peer-checked:bg-bloom-accent peer-checked:border-bloom-accent transition-colors">
                    {consents.marketingConsent && (
                      <svg className="w-4 h-4 text-white m-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </label>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-bloom-dark">Marketing Communications</h3>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">Optional</span>
                </div>
                <p className="text-sm text-bloom-dark/70">
                  I would like to receive helpful wellness tips, course updates, and special offers via email.
                </p>
                <p className="text-xs text-bloom-dark/50 mt-1">
                  You can unsubscribe at any time. We never share your email with third parties.
                </p>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-yellow-800">Important Reminder</p>
                <p className="text-xs text-yellow-700 mt-1">
                  Our wellness programs are educational and supportive in nature. If you're experiencing a mental health emergency, 
                  please contact 911 or the 988 Suicide & Crisis Lifeline immediately.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <Button
              onClick={handleContinue}
              variant="pink"
              size="lg"
              className="w-full"
              disabled={isLoading || !consents.hipaaConsent || !consents.termsAccepted}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving Consents...
                </div>
              ) : (
                'Continue'
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

          {/* Privacy Assurance */}
          <div className="text-center pt-4">
            <div className="flex items-center justify-center gap-2 text-bloom-sage">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm font-medium">256-bit SSL Encryption</span>
            </div>
            <p className="text-xs text-bloom-dark/50 mt-1">
              Your information is encrypted and stored securely
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}