'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const CalendlyEmbed = dynamic(() => import('./CalendlyEmbed'), {
  loading: () => (
    <div className="w-full h-[600px] bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
      <div className="text-gray-500">Loading scheduler...</div>
    </div>
  ),
  ssr: false
});

export default function LazyCalendlyEmbed() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Only load Calendly when user scrolls near it or after 3 seconds
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    const element = document.getElementById('calendly-container');
    if (element) observer.observe(element);

    // Fallback: load after 3 seconds if not scrolled
    const timer = setTimeout(() => setShouldLoad(true), 3000);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div id="calendly-container">
      {shouldLoad ? <CalendlyEmbed /> : (
        <div className="w-full h-[600px] bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-gray-400">Scheduler will load when needed</div>
        </div>
      )}
    </div>
  );
}