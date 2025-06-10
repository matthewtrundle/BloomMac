'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface SeedPacketCardProps {
  title: string;
  seedType: string;
  icon: string;
  growthTime: string;
  description: string;
  benefits: string[];
  color: string;
  href: string;
  featured?: boolean;
  index: number;
}

export default function SeedPacketCard({
  title,
  seedType,
  icon,
  growthTime,
  description,
  benefits,
  color,
  href,
  featured = false,
  index
}: SeedPacketCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWatered, setIsWatered] = useState(false);
  
  // Staggered reveal animation
  const packetVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      rotateX: -30
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        delay: index * 0.2,
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1]
      }
    }
  };
  
  // Seed planting animation
  const seedAnimation = {
    initial: { scale: 0, y: -20, rotate: 0 },
    planted: { 
      scale: [0, 1.2, 1],
      y: [0, 10, 0],
      rotate: [0, 180, 360],
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };
  
  // Water droplet animation
  const waterDroplets = [
    { x: -10, delay: 0 },
    { x: 0, delay: 0.1 },
    { x: 10, delay: 0.2 }
  ];
  
  return (
    <motion.div
      variants={packetVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative ${featured ? 'md:col-span-2' : ''}`}
    >
      {/* Seed packet container */}
      <motion.div
        animate={isHovered ? { scale: 1.05, y: -5 } : { scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative h-full"
      >
        {/* Vintage seed packet background with pink tones and uniform height */}
        <div className="relative bg-gradient-to-br from-white via-pink-50/30 to-bloom-blush/20 rounded-lg shadow-lg overflow-hidden border-2 border-bloom/10 h-full flex flex-col">
          {/* Sun rays from top left - more visible */}
          <div className="absolute -top-6 -left-6 w-40 h-40 opacity-40">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-yellow-200/50 to-transparent rounded-full blur-xl"></div>
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
              {[...Array(8)].map((_, i) => (
                <line
                  key={i}
                  x1="50"
                  y1="50"
                  x2={50 + 45 * Math.cos((i * Math.PI * 2) / 8)}
                  y2={50 + 45 * Math.sin((i * Math.PI * 2) / 8)}
                  stroke="rgba(255, 223, 0, 0.5)"
                  strokeWidth="2"
                />
              ))}
            </svg>
          </div>
          
          {/* Digital course badge */}
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-bloompink/90 text-white text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
              <span>💻</span>
              <span>Digital Course</span>
            </div>
          </div>
          
          {/* Soil texture at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 200 40" preserveAspectRatio="none">
              <defs>
                <pattern id={`soil-${index}`} x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="#8B6F47" opacity="0.15"/>
                  <circle cx="6" cy="6" r="0.8" fill="#A0826D" opacity="0.1"/>
                  <circle cx="1" cy="5" r="0.6" fill="#6B5D54" opacity="0.12"/>
                  <circle cx="7" cy="3" r="0.9" fill="#8B7355" opacity="0.08"/>
                </pattern>
                <linearGradient id={`soil-gradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8B6F47" stopOpacity="0" />
                  <stop offset="100%" stopColor="#8B6F47" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <rect width="200" height="40" fill={`url(#soil-${index})`} />
              <rect width="200" height="40" fill={`url(#soil-gradient-${index})`} />
            </svg>
          </div>
          
          {/* Growth depth markers */}
          <div className="absolute left-2 top-1/3 bottom-1/4 w-px bg-gradient-to-b from-transparent via-bloom/10 to-transparent"></div>
          <div className="absolute right-2 top-1/3 bottom-1/4 w-px bg-gradient-to-b from-transparent via-bloom/10 to-transparent"></div>
          
          {/* Texture overlay */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="paper-texture" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <rect width="100" height="100" fill="#8B7355" opacity="0.05"/>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#8B7355" strokeWidth="0.5" opacity="0.1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#paper-texture)" />
            </svg>
          </div>
          
          {/* Morning dew drops */}
          <AnimatePresence>
            {isHovered && (
              <>
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={`dew-${i}`}
                    className="absolute w-1.5 h-1.5 bg-blue-300/40 rounded-full"
                    style={{
                      left: `${20 + i * 30}%`,
                      top: `${25 + (i % 2) * 15}%`
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: [0, 1, 1.2, 1],
                      opacity: [0, 0.6, 0.4, 0.6]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
          
          {/* Seed packet label */}
          <div className="relative p-5 text-center flex flex-col flex-1">
            {/* Vintage label header */}
            <div className="border-2 border-bloom/20 rounded p-1.5 mb-3 bg-white/50">
              <p className="text-xs text-bloom/60 uppercase tracking-wider">Self-Paced • Online • At Your Speed</p>
            </div>
            
            {/* Seed icon with growth animation - more compact */}
            <motion.div
              className="text-5xl mb-3 relative inline-block"
              animate={isHovered ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span>{icon}</span>
              
              {/* Growing sprout on hover */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ scale: 0, y: 10 }}
                    animate={{ scale: 1, y: -5 }}
                    exit={{ scale: 0, y: 10 }}
                    className="absolute -right-2 -top-2"
                  >
                    <span className="text-2xl">🌱</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            
            {/* Course title - more prominent */}
            <h3 className="font-playfair text-2xl text-bloom/90 mb-2 font-medium">{title}</h3>
            <p className="text-sm text-bloompink/70 font-light italic mb-2">{seedType} Course</p>
            
            {/* Growth time badge - smaller */}
            <div className="inline-flex items-center gap-1.5 bg-bloom/10 px-2.5 py-1 rounded-full mb-3">
              <span className="text-xs">🕐</span>
              <span className="text-xs text-bloom/80">{growthTime} program</span>
            </div>
            
            {/* Description - shorter */}
            <p className="text-sm text-bloom/60 mb-3 line-clamp-2">{description}</p>
            
            {/* Growing instructions (benefits) on hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-bloom/10 pt-4 mb-4">
                    <p className="text-xs text-bloom/70 font-medium mb-2">What You'll Learn:</p>
                    <ul className="text-xs text-bloom/60 space-y-1">
                      {benefits.map((benefit, i) => (
                        <motion.li
                          key={i}
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center"
                        >
                          <span className="mr-1">•</span>
                          {benefit}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Interactive CTA button - clearer digital course action */}
            <div className="mt-auto">
              <Link href={href}>
                <motion.button
                  className="relative w-full bg-bloompink/90 hover:bg-bloompink text-white px-6 py-3 rounded-full text-sm font-medium overflow-hidden group shadow-md hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onMouseEnter={() => setIsWatered(true)}
                  onMouseLeave={() => setIsWatered(false)}
                >
                  {/* Shimmer effect background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={isWatered ? { x: "100%" } : { x: "-100%" }}
                    transition={{ duration: 0.7 }}
                  />
                  
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span>Start Course</span>
                    <motion.span
                      animate={isWatered ? { x: 3 } : { x: 0 }}
                      className="inline-block"
                    >
                      →
                    </motion.span>
                  </span>
                </motion.button>
              </Link>
              
              {/* Click encouragement text */}
              <p className="text-xs text-bloom/50 text-center mt-2">
                Click to learn more & enroll
              </p>
            </div>
            
            
            {/* Seed packet corners */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-bloom/20"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-bloom/20"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-bloom/20"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-bloom/20"></div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}