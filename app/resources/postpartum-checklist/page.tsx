'use client';

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// UI Components
import OrganicShape from '@/components/ui/OrganicShape';
import GlassmorphismPanel from '@/components/ui/GlassmorphismPanel';
import MobileResource from '@/components/ui/MobileResource';

const checklistData = {
  title: "Postpartum Recovery Checklist",
  description: "A comprehensive guide to support your healing journey after birth",
  sections: [
    {
      id: "immediate-care",
      title: "First 24-48 Hours",
      type: "checklist" as const,
      description: "Essential care for the first few days",
      items: [
        "Rest as much as possible between feedings",
        "Stay hydrated - keep water bottle nearby",
        "Take prescribed medications on schedule",
        "Accept all offers of help with meals/chores",
        "Monitor bleeding - notify provider if concerning",
        "Begin gentle breathing exercises",
        "Skin-to-skin contact with baby when possible",
        "Ask questions - no question is too small"
      ]
    },
    {
      id: "first-week",
      title: "First Week Recovery",
      type: "checklist" as const,
      description: "Building your recovery routine",
      items: [
        "Establish feeding routine that works for you",
        "Take daily showers (even if brief)",
        "Begin gentle walks as cleared by provider",
        "Eat nutritious meals and snacks regularly",
        "Sleep when baby sleeps (really!)",
        "Limit visitors if feeling overwhelmed",
        "Practice saying 'yes' to help",
        "Begin journaling or mood tracking",
        "Contact provider with any concerns"
      ]
    },
    {
      id: "warning-signs",
      title: "When to Call Your Provider",
      type: "warning" as const,
      description: "Don't wait - seek help immediately for these symptoms",
      items: [
        "Heavy bleeding (soaking pad every hour)",
        "Large blood clots (bigger than a golf ball)",
        "Signs of infection (fever, chills, foul-smelling discharge)",
        "Severe headache or vision changes",
        "Difficulty breathing or chest pain",
        "Thoughts of harming yourself or baby",
        "Inability to sleep for several days",
        "Severe mood changes or anxiety"
      ]
    },
    {
      id: "emotional-care",
      title: "Emotional Wellbeing",
      type: "tips" as const,
      description: "Supporting your mental health",
      items: [
        "It's normal to feel overwhelmed sometimes",
        "Crying is okay and often necessary",
        "Bond with baby at your own pace",
        "Your worth isn't measured by milk supply",
        "Ask for emotional support, not just practical help",
        "Consider joining a new mom support group",
        "Practice self-compassion daily",
        "Remember: you're doing better than you think"
      ]
    },
    {
      id: "month-one",
      title: "First Month Milestones",
      type: "checklist" as const,
      description: "What to focus on in your first month",
      items: [
        "Establish your own routine (flexible is fine)",
        "Find at least one mom friend or support group",
        "Get fresh air daily, even if just stepping outside",
        "Celebrate small victories",
        "Schedule your 6-week postpartum checkup",
        "Discuss contraception with your provider",
        "Begin planning return to work if applicable",
        "Consider professional support if struggling"
      ]
    }
  ]
};

export default function PostpartumChecklistPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    stage: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showResource, setShowResource] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Removed duplicate email - email automation handles the confirmation
      // The email automation sequence below will send the proper download email

      // Start email automation sequence
      await fetch('/api/email-automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          sequenceType: 'lead_nurture',
          step: 1,
          resourceName: 'Postpartum Recovery Checklist',
          leadSource: 'postpartum_checklist_download',
          serviceInterest: 'postpartum_support'
        }),
      });

      setSubmitSuccess(true);
      setShowResource(true);
      
      // Fire GA4 event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'resource_access', {
          event_category: 'lead',
          event_label: 'postpartum_checklist',
          resource_type: 'mobile_friendly'
        });
      }

    } catch (error) {
      console.error('Error:', error);
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFCFF]">
      {/* Header area with decorative elements */}
      <div className="relative">
        {/* Background gradient */}
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-bloom-pink-50 to-transparent z-0"></div>
        
        {/* Decorative shapes */}
        <OrganicShape
          variant="blob-1"
          color="var(--bloom-accent)"
          size="xl"
          position="top-left"
          opacity={0.04}
        />
        
        <OrganicShape
          variant="blob-3"
          color="var(--bloom-blush)"
          size="lg"
          position="top-right"
          opacity={0.05}
          rotate={45}
        />
      </div>

      {/* Main content area */}
      <div className="container mx-auto px-4 pt-24 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-playfair text-bloom text-3xl md:text-4xl mb-6">
              Free <span className="text-bloompink font-semibold bg-gradient-to-r from-bloompink to-pink-400 bg-clip-text text-transparent">Postpartum Recovery</span> Checklist
            </h1>
            
            <div className="w-32 h-1 bg-gradient-to-r from-[#C63780] to-[#FF9CB9] mb-6 rounded-full mx-auto"></div>
            
            <p className="text-bloom/70 text-lg max-w-2xl mx-auto">
              A comprehensive guide to help you navigate the postpartum period with confidence and clarity.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left side - Resource preview */}
            <div>
              <GlassmorphismPanel variant="subtle" className="p-8 mb-8">
                <div className="text-center mb-6">
                  <div className="w-24 h-32 bg-bloom-pink-50 rounded-lg mx-auto mb-4 flex items-center justify-center border-2 border-bloom-pink-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-bloompink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-playfair text-xl text-bloom mb-2">What's Included:</h3>
                </div>

                <ul className="space-y-3 text-bloom/70">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-bloompink mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Physical recovery milestones and what to expect
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-bloompink mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Emotional well-being checkpoints
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-bloompink mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    When to seek professional support
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-bloompink mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Self-care strategies for new moms
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-bloompink mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Partner and family support guidance
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-bloompink mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Local Austin resources and support groups
                  </li>
                </ul>
              </GlassmorphismPanel>

              <div className="text-center">
                <p className="text-bloom/60 text-sm mb-4">
                  Created by licensed perinatal specialists
                </p>
                <Link href="/book" className="text-bloompink hover:text-[#B03979] transition-colors font-medium">
                  Want personalized support? Book a free consultation →
                </Link>
              </div>
            </div>
            
            {/* Right side - Download form */}
            <div>
              <GlassmorphismPanel variant="subtle" className="p-8">
                {submitSuccess ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-playfair text-bloom mb-2">Download Starting!</h3>
                    <p className="text-bloom/70 mb-4">Your checklist should begin downloading shortly.</p>
                    <p className="text-sm text-bloom/60">We've also sent you some helpful follow-up resources by email.</p>
                  </div>
                ) : (
                  <>
                    <h2 className="font-playfair text-2xl text-bloom mb-2">Get Your Free Checklist</h2>
                    <p className="text-bloom/60 mb-6">Enter your details below to download instantly.</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-bloom mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent transition-colors"
                          placeholder="Your first name"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-bloom mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent transition-colors"
                          placeholder="your.email@example.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="stage" className="block text-sm font-medium text-bloom mb-2">
                          Where are you in your journey?
                        </label>
                        <select
                          id="stage"
                          name="stage"
                          value={formData.stage}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent transition-colors"
                        >
                          <option value="">Select your stage</option>
                          <option value="pregnant">Currently pregnant</option>
                          <option value="0-6_weeks">0-6 weeks postpartum</option>
                          <option value="6-12_weeks">6-12 weeks postpartum</option>
                          <option value="3-6_months">3-6 months postpartum</option>
                          <option value="6-12_months">6-12 months postpartum</option>
                          <option value="1_year_plus">1+ years postpartum</option>
                          <option value="supporting_someone">Supporting someone else</option>
                        </select>
                      </div>

                      {submitError && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-600 text-sm">{submitError}</p>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-bloompink hover:bg-[#B03979] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 font-inter"
                      >
                        {isSubmitting ? 'Processing...' : 'Download Free Checklist'}
                      </button>

                      <p className="text-xs text-center text-bloom/50 mt-4">
                        By downloading, you agree to receive helpful emails from Bloom Psychology. Unsubscribe anytime.
                      </p>
                    </form>
                  </>
                )}
              </GlassmorphismPanel>
            </div>
          </div>
        </div>

        {/* Mobile Resource Display */}
        {showResource && (
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="font-playfair text-3xl text-bloom mb-4">
                Your <span className="text-bloompink">Postpartum Recovery Checklist</span>
              </h2>
              <p className="text-bloom/70 max-w-2xl mx-auto">
                Use this interactive checklist to track your recovery journey. You can check off items as you complete them and save it to your phone for easy access.
              </p>
            </div>
            
            <MobileResource 
              {...checklistData}
              downloadTitle="Save Checklist to Phone"
              onDownload={() => {
                // Track download
                if (typeof window !== 'undefined' && window.gtag) {
                  window.gtag('event', 'resource_download', {
                    event_category: 'engagement',
                    event_label: 'postpartum_checklist_mobile',
                    resource_type: 'text_file'
                  });
                }
              }}
            />


            <div className="text-center mt-8">
              <Link 
                href="/book" 
                className="inline-flex items-center bg-bloom hover:bg-bloom/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Need personalized support? Book a consultation
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}