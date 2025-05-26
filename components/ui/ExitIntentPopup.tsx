'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface ExitIntentPopupProps {
  enabled?: boolean;
  delay?: number;
}

const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({ 
  enabled = true, 
  delay = 3000 
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    if (!enabled || hasShown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse is leaving toward top of screen (tab/close button area)
      if (e.clientY <= 0 && !hasShown) {
        setShowPopup(true);
        setHasShown(true);
        
        // Fire GA4 event
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'exit_intent_popup_shown', {
            event_category: 'engagement',
            event_label: 'exit_intent'
          });
        }
      }
    };

    // Add delay before enabling exit intent detection
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, delay);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enabled, hasShown, delay]);

  const handleClose = () => {
    setShowPopup(false);
    
    // Fire GA4 event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exit_intent_popup_closed', {
        event_category: 'engagement',
        event_label: 'exit_intent'
      });
    }
  };

  const handleBookingClick = () => {
    // Fire GA4 event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exit_intent_booking_click', {
        event_category: 'conversion',
        event_label: 'exit_intent'
      });
    }
  };

  const handleContactClick = () => {
    // Fire GA4 event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exit_intent_contact_click', {
        event_category: 'lead',
        event_label: 'exit_intent'
      });
    }
  };

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close popup"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="text-center">
              <div className="w-16 h-16 bg-bloompink bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-bloompink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h3 className="font-playfair text-2xl text-bloom mb-3">
                Wait! Don't Go Just Yet
              </h3>
              
              <p className="text-bloom/70 mb-6">
                Take the first step toward feeling better. Get your free 15-minute consultation with our licensed specialists.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/book"
                  onClick={handleBookingClick}
                  className="bg-bloompink hover:bg-[#B03979] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 text-center"
                >
                  Book Free Consultation
                </Link>
                
                <Link
                  href="/contact"
                  onClick={handleContactClick}
                  className="border border-bloompink text-bloompink hover:bg-bloompink hover:text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 text-center"
                >
                  Ask Questions First
                </Link>
              </div>

              <p className="text-xs text-bloom/50 mt-4">
                Same-week appointments available
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExitIntentPopup;