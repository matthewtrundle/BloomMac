'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface KineticTypographyProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  children: string;
  animation?: 'letter-by-letter' | 'word-by-word' | 'fade-in' | 'none';
  delay?: number;
  staggered?: boolean;
  className?: string;
  once?: boolean;
}

const KineticTypography: React.FC<KineticTypographyProps> = ({
  as = 'div',
  children,
  animation = 'letter-by-letter',
  delay = 0,
  staggered = true,
  className = '',
  once = true,
}) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsInView(false);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );
    
    observer.observe(currentRef);
    
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [once]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { 
        staggerChildren: staggered ? 0.03 : 0,
        delayChildren: delay || 0,
        ease: "easeOut",
      },
    }),
  };
  
  const letterVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut",
      }
    },
  };
  
  const wordVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.7,
        ease: "easeOut",
      }
    },
  };
  
  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        duration: 0.8,
        delay: delay || 0,
      }
    },
  };

  const Component = motion[as];
  
  // Letter by letter animation
  if (animation === 'letter-by-letter') {
    const letters = children.split('');
    
    return (
      <Component
        ref={ref}
        className={className}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        aria-label={children}
      >
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            variants={letterVariants}
            style={{ display: 'inline-block' }}
          >
            {letter === ' ' ? '\u00A0' : letter }
          </motion.span>
        ))}
      </Component>
    );
  }
  
  // Word by word animation
  if (animation === 'word-by-word') {
    const words = children.split(' ');
    
    return (
      <Component
        ref={ref}
        className={className}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        aria-label={children}
      >
        {words.map((word, index) => (
          <React.Fragment key={index}>
            <motion.span
              variants={wordVariants}
              style={{ display: 'inline-block' }}
            >
              {word}
            </motion.span>
            {index < words.length - 1 && '\u00A0'}
          </React.Fragment>
        ))}
      </Component>
    );
  }
  
  // Simple fade in animation
  if (animation === 'fade-in') {
    return (
      <Component
        ref={ref}
        className={className}
        variants={fadeVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {children}
      </Component>
    );
  }
  
  // No animation
  return (
    <Component ref={ref} className={className}>
      {children}
    </Component>
  );
};

export default KineticTypography;
