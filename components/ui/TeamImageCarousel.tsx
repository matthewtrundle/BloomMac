'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const teamImages = [
  {
    src: '/images/optimized/Team/img_1599.webp',
    alt: 'Dr. Jana Rundle - Profile',
    caption: 'Empowering mothers through evidence-based care',
    mood: 'warm',
    focus: 'connection'
  },
  {
    src: '/images/optimized/Team/img_1602.webp',
    alt: 'Dr. Jana Rundle - Professional',
    caption: 'Building a supportive community for maternal wellness',
    mood: 'professional',
    focus: 'expertise'
  },
  {
    src: '/images/optimized/Team/img_1605.webp',
    alt: 'Dr. Jana Rundle - Consultation',
    caption: 'Your partner in postpartum recovery',
    mood: 'approachable',
    focus: 'support'
  },
  {
    src: '/images/optimized/Team/img_1623.webp',
    alt: 'Dr. Jana Rundle - Expert',
    caption: 'Professional guidance when you need it most',
    mood: 'confident',
    focus: 'leadership'
  },
  {
    src: '/images/optimized/Team/img_1627.webp',
    alt: 'Dr. Jana Rundle - Support',
    caption: 'Compassionate care for every mother\'s journey',
    mood: 'caring',
    focus: 'empathy'
  }
];

interface TeamImageCarouselProps {
  autoPlay?: boolean;
  interval?: number;
  showCaptions?: boolean;
  className?: string;
}

export default function TeamImageCarousel({ 
  autoPlay = true, 
  interval = 5000,
  showCaptions = true,
  className = ""
}: TeamImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % teamImages.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-gray-100 to-gray-50">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ 
              duration: 0.7,
              ease: [0.43, 0.13, 0.23, 0.96]
            }}
            className="relative"
          >
            {/* Professional frame effect */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#f8b5c4]/10 to-[#1e3a5f]/5 z-10" />
              <Image
                src={teamImages[currentIndex].src}
                alt={teamImages[currentIndex].alt}
                width={600}
                height={700}
                className="object-cover w-full h-full"
                priority
                quality={95}
              />
              
              {/* Subtle vignette effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/5 z-20" />
              
              {showCaptions && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1e3a5f]/95 via-[#1e3a5f]/80 to-transparent p-8 z-30"
                >
                  <p className="text-white text-lg font-light leading-relaxed">
                    {teamImages[currentIndex].caption}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-white/60 uppercase tracking-wider">
                      {teamImages[currentIndex].mood}
                    </span>
                    <span className="text-white/40">•</span>
                    <span className="text-xs text-white/60 uppercase tracking-wider">
                      {teamImages[currentIndex].focus}
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {teamImages.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white w-8' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}