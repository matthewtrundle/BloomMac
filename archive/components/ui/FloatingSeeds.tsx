'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface FloatingSeed {
  id: number;
  size: string;
  startX: number;
  delay: number;
  duration: number;
  opacity: number;
}

export default function FloatingSeeds() {
  // Generate multiple floating seeds with different properties
  const seeds: FloatingSeed[] = [
    { id: 1, size: 'w-3 h-3', startX: 10, delay: 0, duration: 15, opacity: 0.3 },
    { id: 2, size: 'w-2 h-2', startX: 30, delay: 3, duration: 20, opacity: 0.2 },
    { id: 3, size: 'w-4 h-4', startX: 50, delay: 7, duration: 18, opacity: 0.25 },
    { id: 4, size: 'w-2 h-2', startX: 70, delay: 10, duration: 22, opacity: 0.15 },
    { id: 5, size: 'w-3 h-3', startX: 90, delay: 5, duration: 17, opacity: 0.2 },
  ];
  
  // Dandelion seed path animation
  const seedPath = {
    hidden: { opacity: 0 },
    visible: (custom: FloatingSeed) => ({
      opacity: custom.opacity,
      transition: {
        delay: custom.delay,
        duration: 1
      }
    })
  };
  
  const floatAnimation = (seed: FloatingSeed) => ({
    x: [0, 30, -20, 40, 0],
    y: [0, -100, -200, -300, -400],
    rotate: [0, 360, 720, 1080, 1440],
    scale: [1, 1.2, 0.8, 0.6, 0],
    transition: {
      duration: seed.duration,
      repeat: Infinity,
      delay: seed.delay,
      ease: "linear"
    }
  });
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Dandelion seeds */}
      {seeds.map((seed) => (
        <motion.div
          key={seed.id}
          custom={seed}
          variants={seedPath}
          initial="hidden"
          animate="visible"
          className={`absolute bottom-20`}
          style={{ left: `${seed.startX}%` }}
        >
          <motion.div
            animate={floatAnimation(seed)}
            className="relative"
          >
            {/* Dandelion seed SVG */}
            <svg 
              className={`${seed.size}`} 
              viewBox="0 0 40 40" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Seed body */}
              <ellipse cx="20" cy="30" rx="3" ry="5" fill="#8B7355" opacity="0.6" />
              
              {/* Pappus (fluffy part) */}
              <g opacity="0.4">
                {[...Array(8)].map((_, i) => (
                  <line
                    key={i}
                    x1="20"
                    y1="28"
                    x2={20 + 12 * Math.cos((i * Math.PI * 2) / 8)}
                    y2={28 - 12 * Math.sin((i * Math.PI * 2) / 8)}
                    stroke="#E8B4B8"
                    strokeWidth="0.5"
                  />
                ))}
                {[...Array(8)].map((_, i) => (
                  <circle
                    key={i}
                    cx={20 + 12 * Math.cos((i * Math.PI * 2) / 8)}
                    cy={28 - 12 * Math.sin((i * Math.PI * 2) / 8)}
                    r="2"
                    fill="#FFB6C1"
                    opacity="0.3"
                  />
                ))}
              </g>
            </svg>
          </motion.div>
        </motion.div>
      ))}
      
      {/* Additional decorative elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-bloom-sage/10 blur-3xl"
      />
      
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-1/4 left-1/4 w-40 h-40 rounded-full bg-bloompink/10 blur-3xl"
      />
    </div>
  );
}