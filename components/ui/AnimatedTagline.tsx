'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedTaglineProps {
  text?: string;
  className?: string;
  animated?: boolean;
}

export default function AnimatedTagline({ 
  text,
  className = '',
  animated = true 
}: AnimatedTaglineProps) {
  const words = ['self', 'life', 'journey', 'story', 'future'];
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (!animated) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % words.length);
    }, 2500); // Change every 2.5 seconds
    
    return () => clearInterval(interval);
  }, [animated]);
  
  // If text prop is provided, use it as a simple text component
  if (text) {
    return (
      <div className={className}>
        {text}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Main animated tagline */}
      <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] tracking-tight text-[#1e3a5f]">
        <span className="block">Bloom into your</span>
        <span className="block relative h-[1.2em]">
          best{' '}
          <AnimatePresence mode="wait">
            <motion.span
              key={words[currentIndex]}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="inline-block absolute"
              style={{ 
                color: currentIndex % 2 === 0 ? '#f8b5c4' : '#fca5a5',
                minWidth: '4em'
              }}
            >
              {words[currentIndex]}
            </motion.span>
          </AnimatePresence>
          <span className="invisible">journey</span>.
        </span>
      </h1>
      
      {/* Subtitle */}
      <p className="font-normal text-lg sm:text-xl md:text-xl lg:text-2xl text-gray-700 leading-relaxed">
        Bloom Psychology provides individual therapy for women and moms in Austin and online for all of Texas.
      </p>
    </div>
  );
}