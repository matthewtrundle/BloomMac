'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxLayer {
  element: React.ReactNode;
  speed: number; // Positive: moves slower than scroll, Negative: moves opposite to scroll
  offset?: { x?: string; y?: string }; // Initial position offsets
  zIndex?: number;
}

interface ParallaxContainerProps {
  children: React.ReactNode; // Main content that scrolls normally
  className?: string;
  layers: ParallaxLayer[];
}

const ParallaxContainer: React.FC<ParallaxContainerProps> = ({
  children,
  className = '',
  layers,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerTop, setContainerTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const { scrollY } = useScroll();

  // Update container dimensions on resize and initial render
  useEffect(() => {
    // Set window height once we're on the client
    setWindowHeight(window.innerHeight);
    
    const updateContainerDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerTop(rect.top + window.scrollY);
        setContainerHeight(rect.height);
        setWindowHeight(window.innerHeight);
      }
    };

    // Initial measurement
    updateContainerDimensions();

    // Add resize listener
    window.addEventListener('resize', updateContainerDimensions);
    
    // Clean up
    return () => window.removeEventListener('resize', updateContainerDimensions);
  }, []);

  // Check if user prefers reduced motion - must be initialized early to maintain hook order
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  // Pre-create refs for all layer transforms to maintain consistent hook order
  const layerOutputRefs = useRef<Array<React.MutableRefObject<any>>>([]);
  
  // Initialize refs for each layer - must happen outside conditionals to maintain hook order
  if (layerOutputRefs.current.length !== layers.length) {
    layerOutputRefs.current = layers.map(() => React.createRef());
  }
  
  // Create all transform functions upfront, regardless of conditions
  layers.forEach((layer, index) => {
    const yOutput = useTransform(
      scrollY,
      [containerTop - windowHeight, containerTop + containerHeight],
      [windowHeight * 0.1 * layer.speed, -windowHeight * 0.1 * layer.speed]
    );
    
    // Store the transform value reference
    if (layerOutputRefs.current[index]) {
      layerOutputRefs.current[index].current = yOutput;
    }
  });
  
  // Set up reduced motion preference listener
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Parallax layers - Keep the DOM structure the same but conditionally disable animation */}
      {layers.map((layer, index) => {
        // Determine if animation should be active
        const shouldAnimate = !prefersReducedMotion && windowHeight > 0;
        
        return (
          <motion.div
            key={index}
            className="absolute w-full h-full top-0 left-0 pointer-events-none"
            style={{
              y: shouldAnimate ? layerOutputRefs.current[index]?.current : 0,
              top: layer.offset?.y || 0,
              left: layer.offset?.x || 0,
              zIndex: layer.zIndex || 0,
            }}
          >
            {layer.element}
          </motion.div>
        );
      })}
    </div>
  );
};

export default ParallaxContainer;
