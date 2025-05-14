'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const ConsultLauncher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  
  // Only show after user has scrolled a bit
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setHasScrolled(scrollTop > 100); // Reduced from 300 to show after less scrolling
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Handle toggling the launcher
  const toggleLauncher = () => {
    setIsOpen(!isOpen);
  };

  // Animation variants
  const launcherVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        ease: "easeOut" 
      }
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: { 
        duration: 0.2,
        ease: "easeIn" 
      }
    }
  };
  
  const expandedVariants = {
    hidden: { 
      opacity: 0, 
      height: 0,
      width: '3rem'
    },
    visible: { 
      opacity: 1, 
      height: 'auto',
      width: 'auto',
      transition: { 
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      height: 0,
      width: '3rem',
      transition: { 
        duration: 0.2,
        ease: "easeIn" 
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  // If user hasn't scrolled enough, don't show
  if (!hasScrolled) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            key="expanded"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={expandedVariants}
            className="glass-panel-prominent rounded-lg p-4 shadow-xl max-w-xs"
          >
            <motion.div className="flex justify-between items-center mb-3" variants={itemVariants}>
              <h3 className="font-playfair text-lg text-bloom">Schedule a Free Consultation</h3>
              <button
                onClick={toggleLauncher}
                className="text-bloom hover:text-bloom-accent transition duration-300"
                aria-label="Close consultation launcher"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
            
            <motion.p className="text-sm text-bloom/80 mb-4" variants={itemVariants}>
              Ready to begin your journey? Book your free 15-minute consultation online today.
            </motion.p>
            
            <motion.div className="space-y-3" variants={itemVariants}>
              <Link
                href="/contact"
                className="btn-primary w-full block text-center"
              >
                Book Consultation
              </Link>
              
              {/* Phone number removed as requested */}
              
              <p className="text-xs text-bloom/70 text-center mt-3">
                Email us at <a href="mailto:jana@bloompsychologynorthaustin.com" className="text-bloom underline hover:text-bloom-accent transition duration-300">jana@bloompsychologynorthaustin.com</a>
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.button
            key="collapsed"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={launcherVariants}
            onClick={toggleLauncher}
            className="bg-bloom text-white p-3 rounded-full shadow-lg hover:bg-bloom-accent hover:text-bloom transition-all duration-300 animate-pulse-subtle focus:outline-none"
            aria-label="Open consultation launcher"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConsultLauncher;
