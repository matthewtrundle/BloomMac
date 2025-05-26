'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrollConsultationBannerProps {
  enabled?: boolean;
  scrollThreshold?: number;
  delay?: number;
  pageType?: 'service' | 'blog' | 'general';
}

const ScrollConsultationBanner: React.FC<ScrollConsultationBannerProps> = ({ 
  enabled = true,
  scrollThreshold = 70,
  delay = 5000,
  pageType = 'general'
}) => {
  const [showBanner, setShowBanner] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!enabled || hasShown || dismissed) return;

    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      if (scrollPercent >= scrollThreshold && !hasShown && !dismissed) {
        // Add delay before showing banner
        timeoutId = setTimeout(() => {
          setShowBanner(true);
          setHasShown(true);
          
          // Fire GA4 event
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'scroll_consultation_banner_shown', {
              event_category: 'engagement',
              event_label: `scroll_${pageType}`,
              scroll_percentage: Math.round(scrollPercent)
            });
          }
        }, 1000);
      }
    };

    // Add initial delay before enabling scroll detection
    const initialTimer = setTimeout(() => {
      window.addEventListener('scroll', handleScroll);
    }, delay);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [enabled, hasShown, dismissed, scrollThreshold, delay, pageType]);

  const handleDismiss = () => {
    setDismissed(true);
    setShowBanner(false);
    
    // Fire GA4 event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'scroll_consultation_banner_dismissed', {
        event_category: 'engagement',
        event_label: `scroll_${pageType}`
      });
    }
  };

  const handleBookingClick = () => {
    // Fire GA4 event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'scroll_consultation_booking_click', {
        event_category: 'conversion',
        event_label: `scroll_${pageType}`
      });
    }
  };

  const getMessageByPageType = () => {
    switch (pageType) {
      case 'service':
        return {
          title: "Ready to Take the Next Step?",
          subtitle: "Book your free consultation to discuss this service"
        };
      case 'blog':
        return {
          title: "Found This Helpful?",
          subtitle: "Schedule a consultation to get personalized support"
        };
      default:
        return {
          title: "Ready to Get Started?",
          subtitle: "Book your free 15-minute consultation today"
        };
    }
  };

  const message = getMessageByPageType();

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 z-40 md:left-auto md:right-4 md:max-w-sm"
        >
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 relative">
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Dismiss banner"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="pr-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-bloompink bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-bloompink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                
                <div className="flex-1">
                  <h4 className="font-semibold text-bloom text-sm mb-1">
                    {message.title}
                  </h4>
                  <p className="text-bloom/70 text-xs mb-3">
                    {message.subtitle}
                  </p>
                  
                  <div className="flex gap-2">
                    <Link
                      href="/book"
                      onClick={handleBookingClick}
                      className="bg-bloompink hover:bg-[#B03979] text-white text-xs font-medium py-2 px-3 rounded transition-colors"
                    >
                      Book Now
                    </Link>
                    
                    <button
                      onClick={handleDismiss}
                      className="text-bloom/50 hover:text-bloom/70 text-xs font-medium py-2 px-3 transition-colors"
                    >
                      Not Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollConsultationBanner;