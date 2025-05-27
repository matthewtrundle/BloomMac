'use client';

import dynamic from 'next/dynamic';

const NewsletterSignup = dynamic(() => import('./NewsletterSignup'), {
  loading: () => (
    <div className="w-full h-24 bg-gray-100 animate-pulse rounded-lg" />
  ),
  ssr: false
});

export default function LazyNewsletterSignup() {
  return <NewsletterSignup />;
}