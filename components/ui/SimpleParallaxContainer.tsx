'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface SimpleParallaxContainerProps {
  children: React.ReactNode;
  className?: string;
  bgImageUrl?: string;
  bgColor?: string;
  bgOpacity?: number;
  speed?: number;
}

const SimpleParallaxContainer: React.FC<SimpleParallaxContainerProps> = ({
  children,
  className = '',
  bgImageUrl,
  bgColor = 'rgba(0, 0, 0, 0.5)',
  bgOpacity = 0.5,
  speed = 0.2
}) => {
  const { scrollYProgress } = useScroll();
  
  // Simple parallax effect
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 20}%`]);
  
  const bgStyle = bgImageUrl ? {
    backgroundImage: `url(${bgImageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: bgOpacity
  } : {
    backgroundColor: bgColor,
    opacity: bgOpacity
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background with parallax effect */}
      <motion.div 
        className="absolute inset-0 w-full h-full -z-1"
        style={{ 
          ...bgStyle,
          y: yBg
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default SimpleParallaxContainer;
