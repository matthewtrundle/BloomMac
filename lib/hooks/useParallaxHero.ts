'use client';

import { useEffect, useRef, useState } from 'react';

interface UseParallaxHeroOptions {
  speedFactor?: number;
  maxOffset?: number;
}

export default function useParallaxHero(options: UseParallaxHeroOptions = {}) {
  const { speedFactor = 0.5, maxOffset = 500 } = options;
  const [offset, setOffset] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          // Calculate parallax offset, capped at maxOffset
          const parallaxOffset = Math.min(scrollY * speedFactor, maxOffset);
          setOffset(parallaxOffset);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial call
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speedFactor, maxOffset]);

  return offset;
}