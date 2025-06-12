'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AnimatedTagline() {
  const words = ['self', 'life', 'journey', 'story', 'future'];
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % words.length);
    }, 2500); // Change every 2.5 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="space-y-4">
      {/* Main animated tagline */}
      <h1 className="font-bold text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] tracking-tight text-[#1e3a5f]">
        <span className="block">
          Bloom into your best{' '}
          <AnimatePresence mode="wait">
            <motion.span
              key={words[currentIndex]}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="inline-block"
              style={{ 
                color: currentIndex % 2 === 0 ? '#f8b5c4' : '#fca5a5',
                transition: 'color 0.5s ease-in-out'
              }}
            >
              {words[currentIndex]}
            </motion.span>
          </AnimatePresence>
          .
        </span>
      </h1>
      
      {/* Subtitle */}
      <p className="font-normal text-lg sm:text-xl md:text-xl lg:text-2xl text-gray-700 leading-relaxed">
        Bloom Psychology provides individual therapy for women and moms in Austin and online for all of Texas.
      </p>
    </div>
  );
}