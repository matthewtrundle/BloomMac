'use client';

import { useEffect } from 'react';

export default function PerformanceMonitor() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') return;

    // Web Vitals monitoring
    if ('web-vital' in window) {
      const reportWebVitals = (metric: any) => {
        // Send to Google Analytics
        if (window.gtag) {
          window.gtag('event', metric.name, {
            event_category: 'Web Vitals',
            event_label: metric.id,
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
            non_interaction: true,
          });
        }
      };

      // @ts-ignore
      window.addEventListener('web-vital', reportWebVitals);
    }

    // Performance Observer for resource timing
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource' && entry.name.includes('images')) {
            // Track slow loading images
            if (entry.duration > 1000) {
              console.warn('Slow image load:', entry.name, entry.duration);
            }
          }
        }
      });

      observer.observe({ entryTypes: ['resource'] });
    }

    // Log initial page load performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as any;
        if (perfData) {
          console.log('Page Load Performance:', {
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
            totalTime: perfData.loadEventEnd - perfData.fetchStart,
          });
        }
      }, 0);
    });
  }, []);

  return null;
}