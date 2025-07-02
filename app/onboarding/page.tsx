'use client';

import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function OnboardingPage() {
  const searchParams = useSearchParams();
  const source = searchParams.get('source') || 'signup';
  const courseId = searchParams.get('courseId');
  
  // Log onboarding page load for debugging
  useEffect(() => {
    console.log('Onboarding page loaded with:', {
      source,
      courseId,
      url: window.location.href
    });
  }, [source, courseId]);
  
  return (
    <ErrorBoundary>
      <OnboardingFlow 
        source={source}
        courseId={courseId || undefined}
      />
    </ErrorBoundary>
  );
}