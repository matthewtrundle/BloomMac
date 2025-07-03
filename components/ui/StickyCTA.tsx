'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface StickyCTAProps {
  className?: string;
}

export default function StickyCTA({ className = '' }: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA after user scrolls 500px
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`fixed bottom-4 left-4 right-4 z-50 md:hidden ${className}`}
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4">
            <div className="flex flex-col gap-3">
              {/* Primary CTA */}
              <Link href="/book">
                <button className="w-full bg-gradient-to-r from-[#f8b5c4] to-[#f472b6] text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
                  <span>📅</span>
                  <span>Book Free 15-Min Consultation</span>
                </button>
              </Link>
              
              {/* Secondary CTA */}
              <Link href="tel:+15128989510">
                <button className="w-full border-2 border-[#1e3a5f] text-[#1e3a5f] py-3 rounded-xl font-medium hover:bg-[#1e3a5f] hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
                  <span>📞</span>
                  <span>Call/Text: (512) 898-9510</span>
                </button>
              </Link>
            </div>
            
            {/* Trust indicator */}
            <div className="text-center mt-2">
              <p className="text-xs text-gray-500">
                ✨ Same-week appointments available
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}