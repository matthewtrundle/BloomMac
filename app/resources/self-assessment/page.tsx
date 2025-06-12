import React from 'react';
import { Metadata } from 'next';
import SelfAssessmentContent from '@/components/resources/SelfAssessmentContent';

export const metadata: Metadata = {
  title: 'Am I Okay? Mental Health Self-Assessment | Bloom Psychology',
  description: 'A gentle self-assessment checklist to help you check in with your mental health and recognize when professional support might be helpful.',
  keywords: ['mental health assessment', 'self assessment', 'mental health checklist', 'therapy assessment', 'am I okay'],
  openGraph: {
    title: 'Am I Okay? Mental Health Self-Assessment',
    description: 'Check in with yourself using our gentle mental health self-assessment guide.',
    images: ['/images/Hero/Hero3.png'],
  },
};

export default function SelfAssessmentPage() {
  return <SelfAssessmentContent />;
}