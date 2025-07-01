'use client';

import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import { useSearchParams } from 'next/navigation';

export default function OnboardingPage() {
  const searchParams = useSearchParams();
  const source = searchParams.get('source') || 'signup';
  const courseId = searchParams.get('courseId');
  
  return (
    <OnboardingFlow 
      source={source}
      courseId={courseId || undefined}
    />
  );
}