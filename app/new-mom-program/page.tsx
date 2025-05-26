import React from 'react';
import { Metadata } from 'next';
import NewMomProgramContent from './content';

export const metadata: Metadata = {
  title: 'Becoming Mom Program | 8-Week Postpartum Support | Bloom Psychology',
  description: 'Private 1:1 support program for new mothers navigating the transition into motherhood. 8 weekly sessions with personalized guidance, journaling prompts, and emotional support. $960 investment.',
  keywords: [
    'becoming mom program',
    'postpartum support program', 
    'new mom therapy',
    'maternal mental health austin',
    'postpartum depression support',
    'new mother support group',
    '8 week postpartum program',
    'perinatal mental health',
    'motherhood transition support',
    'postpartum anxiety help'
  ],
  openGraph: {
    title: 'Becoming Mom - 8-Week Support Program for New Mothers',
    description: 'Feel seen, supported, and reconnected to yourself with weekly 1:1 sessions designed for pregnant and postpartum moms.',
    url: 'https://bloompsychologynorthaustin.com/new-mom-program',
    siteName: 'Bloom Psychology',
    type: 'website',
    images: [
      {
        url: '/images/Team/Jana Rundle.jpg',
        width: 500,
        height: 600,
        alt: 'Dr. Jana Rundle - Bloom Psychology',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Becoming Mom - 8-Week Support Program',
    description: 'Private 1:1 support for new mothers with Dr. Jana Rundle. Transform from overwhelm to grounded clarity.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://bloompsychologynorthaustin.com/new-mom-program',
  },
};

export default function NewMomProgramPage() {
  return <NewMomProgramContent />;
}