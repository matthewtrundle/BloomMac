'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface LoadingScreenProps {
  onLoadComplete?: () => void;
  minimumDuration?: number;
}

export default function LoadingScreen({ 
  onLoadComplete,
  minimumDuration = 2500 
}: LoadingScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showTagline, setShowTagline] = useState(false);
  
  // Tagline words for progressive reveal
  const taglineWords = ["Life", "changes—", "so", "do", "you."];
  
  useEffect(() => {
    // Start showing tagline after logo animation
    const taglineTimer = setTimeout(() => {
      setShowTagline(true);
    }, 800);
    
    // Minimum loading duration for smooth experience
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      if (onLoadComplete) {
        // Small delay before callback to ensure exit animation completes
        setTimeout(onLoadComplete, 500);
      }
    }, minimumDuration);
    
    return () => {
      clearTimeout(taglineTimer);
      clearTimeout(loadingTimer);
    };
  }, [minimumDuration, onLoadComplete]);
  
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-bloom-blush via-white to-pink-50"
        >
          {/* Animated background patterns */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 20,
                repeat: Infinity,
                ease: "linear" 
              }}
              className="absolute -top-1/2 -left-1/2 w-full h-full opacity-5"
            >
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-bloompink" />
                <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-bloompink" />
                <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-bloompink" />
              </svg>
            </motion.div>
            
            {/* Floating flower elements */}
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                x: [0, 10, 0],
                rotate: [0, 360]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="absolute top-20 right-20 opacity-10"
            >
              <Image
                src="/images/flower no stem.svg"
                alt=""
                width={60}
                height={60}
              />
            </motion.div>
            
            <motion.div
              animate={{ 
                y: [0, 20, 0],
                x: [0, -10, 0],
                rotate: [360, 0]
              }}
              transition={{ 
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute bottom-20 left-20 opacity-10"
            >
              <Image
                src="/images/flower no stem.svg"
                alt=""
                width={80}
                height={80}
              />
            </motion.div>
          </div>
          
          {/* Main content container */}
          <div className="relative z-10 text-center px-6">
            {/* Logo with bloom animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: [0.8, 1.05, 1],
                opacity: 1
              }}
              transition={{ 
                duration: 0.8,
                times: [0, 0.6, 1],
                ease: "easeOut"
              }}
              className="mb-8 relative"
            >
              {/* Pulsing glow effect */}
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.1, 0.3]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-bloompink/20 rounded-full blur-3xl"
              />
              
              {/* Logo */}
              <div className="relative w-32 h-32 mx-auto">
                <Image
                  src="/images/Logo/BLOOM-LOGO.png"
                  alt="Bloom Psychology"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>
            
            {/* Brand name with elegant reveal */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="font-playfair text-3xl md:text-4xl text-bloom/90 mb-6"
            >
              Bloom Psychology
            </motion.h1>
            
            {/* Progressive tagline reveal */}
            <div className="h-8 flex items-center justify-center space-x-2">
              {showTagline && taglineWords.map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.2,
                    duration: 0.5,
                    ease: "easeOut"
                  }}
                  className={`font-light text-xl md:text-2xl ${
                    index < 2 ? 'text-bloom/80' : 'text-bloompink/90'
                  }`}
                >
                  {word}
                </motion.span>
              ))}
            </div>
            
            {/* Loading progress indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="mt-12"
            >
              <div className="w-48 h-1 bg-bloom/10 rounded-full mx-auto overflow-hidden">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ 
                    duration: minimumDuration / 1000 - 0.5,
                    ease: "easeInOut"
                  }}
                  className="h-full bg-gradient-to-r from-bloompink/60 to-bloompink rounded-full"
                />
              </div>
            </motion.div>
            
            {/* Accessibility loading text */}
            <span className="sr-only" role="status">Loading Bloom Psychology</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}