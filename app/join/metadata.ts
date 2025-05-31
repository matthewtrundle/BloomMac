import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Mental Wellness Guide - Join Bloom Psychology Newsletter',
  description: 'Get weekly mental health tips & your FREE anxiety relief guide. Join 2,000+ women prioritizing their wellness with evidence-based strategies that actually work.',
  keywords: 'mental health newsletter, anxiety relief guide, therapy tips, self-care strategies, women mental health, bloom psychology',
  openGraph: {
    title: 'Get Your FREE Anxiety Relief Guide 🎁',
    description: 'Join 2,000+ women getting weekly mental health tips that actually work. Plus instant access to our 5 Grounding Techniques guide!',
    url: 'https://bloompsychologynorthaustin.com/join',
    siteName: 'Bloom Psychology',
    images: [
      {
        url: 'https://bloompsychologynorthaustin.com/images/join-newsletter-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Join Bloom Psychology Newsletter - Free Mental Wellness Guide',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Get Your FREE Anxiety Relief Guide 🎁',
    description: 'Join 2,000+ women getting weekly mental health tips. Instant download!',
    images: ['https://bloompsychologynorthaustin.com/images/join-newsletter-og.jpg'],
  },
  alternates: {
    canonical: 'https://bloompsychologynorthaustin.com/join',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};