'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface ScrollingTickerProps {
  words: string[];
  separator?: string;
  bgColor?: string;
  textColor?: string;
  speed?: number; // pixels per second
  className?: string;
}

const ScrollingTicker: React.FC<ScrollingTickerProps> = ({
  words = ['HEALING', 'GROWTH', 'DISCOVERY'],
  separator = '•',
  bgColor = '',
  textColor = 'text-bloom-blush-700',
  speed = 40,
  className = '',
}) => {
  const [duplicatedWords, setDuplicatedWords] = useState<string[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  // Check if user prefers reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  // Create a duplicated array of words to ensure smooth infinite scrolling
  useEffect(() => {
    // Duplicate the words array enough times to ensure continuous scrolling
    setDuplicatedWords([...words, ...words, ...words]);
  }, [words]);
  
  // Measure container and content width for animation calculations
  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;
    
    const measureWidths = () => {
      if (containerRef.current && contentRef.current) {
        const cWidth = containerRef.current.offsetWidth;
        const contentW = contentRef.current.offsetWidth / 3; // Divide by 3 since we tripled the content
        setContainerWidth(cWidth);
        setContentWidth(contentW);
      }
    };
    
    measureWidths();
    window.addEventListener('resize', measureWidths);
    
    return () => window.removeEventListener('resize', measureWidths);
  }, [duplicatedWords]);
  
  // Calculate animation duration based on content width and speed
  const duration = contentWidth / speed;
  
  return (
    <div 
      ref={containerRef}
      className={`overflow-hidden relative ${bgColor} ${className}`}
    >
      {prefersReducedMotion ? (
        // Static version for users who prefer reduced motion
        <div className="py-3 px-4 flex items-center justify-center">
          <div className={`flex items-center space-x-4 ${textColor} font-medium text-sm md:text-base`}>
            {words.map((word, index) => (
              <React.Fragment key={index}>
                <span>{word}</span>
                {index < words.length - 1 && <span className="opacity-50 mx-2">{separator}</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      ) : (
        // Animated version
        <div className="py-3 relative">
          <motion.div
            ref={contentRef}
            className={`flex items-center whitespace-nowrap ${textColor} font-medium text-sm md:text-base`}
            animate={{
              x: [-contentWidth, -contentWidth * 2],
            }}
            transition={{
              x: {
                duration: duration,
                repeat: Infinity,
                ease: 'linear',
                repeatType: 'loop',
              },
            }}
          >
            {duplicatedWords.map((word, index) => (
              <React.Fragment key={index}>
                <span className="whitespace-nowrap px-2">{word}</span>
                <span className="opacity-50 mx-2">{separator}</span>
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ScrollingTicker;
