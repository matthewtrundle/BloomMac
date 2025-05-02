'use client';

import React from 'react';
import { motion } from 'framer-motion';

export type ShapeVariant = 'blob-1' | 'blob-2' | 'blob-3' | 'wave' | 'circle';
export type ShapeSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ShapePosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'center-left' | 'center-right';

interface OrganicShapeProps {
  variant: ShapeVariant;
  color?: string;
  size?: ShapeSize;
  position?: ShapePosition;
  parallaxFactor?: number;
  opacity?: number;
  rotate?: number;
  className?: string;
}

const shapeVariants = {
  'blob-1': (
    <path d="M165.2,86.6c-25.6,37-50.9,74.2-87.6,81.4C41,175.1,2.8,152.4,0.3,123.3c-2.6-29.1,30.5-64.8,66.2-74.3 C101.9,39.5,140.2,55.8,165.2,86.6z" />
  ),
  'blob-2': (
    <path d="M170.9,102.3c-21.4,42.7-55.3,92.6-92.9,90c-37.7-2.6-79.2-57.8-66.1-94.5C24.9,61.1,92.5,43,135.9,51.6 C179.2,60.2,192.3,59.6,170.9,102.3z" />
  ),
  'blob-3': (
    <path d="M165.4,117.5c-8.1,24.2-16.1,48.4-35.3,58.8c-19.2,10.5-49.8,7.1-69.5-8.5c-19.7-15.6-28.5-43.4-22.7-63.9 c5.9-20.4,26.5-33.7,52.4-38.3C115.9,60.8,147,65,165.4,84.5C183.7,104,173.4,93.3,165.4,117.5z" />
  ),
  'wave': (
    <path d="M0,92.5c0,0,23.7-3.8,39.5-2.7c15.9,1.1,29.2,7.6,44.6,7.6c15.4,0,31.9-4.1,47.9-5.2c15.9-1.1,32.2,0.8,47.4,0 c15.3-0.8,27.3-5.7,40.6-5.7c13.3,0,25.4,3,37.4,5.2c12,2.3,22.8,3.8,22.8,3.8v31.9H0V92.5z" />
  ),
  'circle': (
    <circle cx="100" cy="100" r="100" />
  ),
};

const sizeClasses = {
  'sm': 'w-32 h-32',
  'md': 'w-64 h-64',
  'lg': 'w-96 h-96',
  'xl': 'w-[30rem] h-[30rem]',
  'full': 'w-full h-full',
};

const positionClasses = {
  'top-left': '-top-10 -left-10',
  'top-right': '-top-10 -right-10',
  'bottom-left': '-bottom-10 -left-10',
  'bottom-right': '-bottom-10 -right-10',
  'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  'center-left': 'top-1/2 -left-10 -translate-y-1/2',
  'center-right': 'top-1/2 -right-10 -translate-y-1/2',
};

const OrganicShape: React.FC<OrganicShapeProps> = ({
  variant,
  color = 'var(--bloom-accent)',
  size = 'md',
  position = 'top-left',
  parallaxFactor = 0,
  opacity = 0.15,
  rotate = 0,
  className = '',
}) => {
  // Parallax effect
  const [y, setY] = React.useState(0);
  
  React.useEffect(() => {
    if (parallaxFactor === 0) return;
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setY(scrollY * parallaxFactor);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [parallaxFactor]);

  const positionClass = positionClasses[position];
  const sizeClass = sizeClasses[size];
  
  return (
    <motion.div 
      className={`absolute overflow-hidden pointer-events-none ${positionClass} ${sizeClass} ${className}`}
      style={{
        y: parallaxFactor ? y : 0,
        rotate: rotate,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: opacity }}
      transition={{ duration: 0.5 }}
    >
      <svg 
        viewBox="0 0 200 200" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <g fill={color}>
          {shapeVariants[variant]}
        </g>
      </svg>
    </motion.div>
  );
};

export default OrganicShape;
