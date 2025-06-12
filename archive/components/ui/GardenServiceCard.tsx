'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { serviceFlowers } from './ServiceFlowers';

interface GardenServiceCardProps {
  service: {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    tagline?: string;
    keyBenefits?: string[];
    featured?: boolean;
    category?: string;
  };
  index: number;
  isInView: boolean;
}

export default function GardenServiceCard({ service, index, isInView }: GardenServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const FlowerComponent = serviceFlowers[service.id] || serviceFlowers['therapy-for-women'];
  
  // Staggered reveal animation
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.8,
      rotateX: -15
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        delay: index * 0.15,
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1]
      }
    }
  };
  
  // Bloom animation on hover
  const bloomVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20
      }
    }
  };
  
  // Petal scatter animation
  const petalVariants = {
    initial: { scale: 0, rotate: 0, opacity: 0 },
    animate: (i: number) => ({
      scale: [0, 1, 0.8, 0],
      rotate: [0, 120, 240, 360],
      opacity: [0, 1, 1, 0],
      x: [0, (i % 2 ? 30 : -30), (i % 2 ? 50 : -50), (i % 2 ? 40 : -40)],
      y: [0, -20, -40, 20],
      transition: {
        duration: 2,
        delay: i * 0.1,
        ease: "easeOut"
      }
    })
  };
  
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative ${service.featured ? 'md:col-span-2 md:row-span-2' : ''}`}
    >
      <motion.div
        variants={bloomVariants}
        className="relative h-full group"
      >
        {/* Garden bed background */}
        <div className="absolute inset-0 bg-gradient-to-br from-bloom-blush/10 to-bloom-sage-50/20 rounded-2xl" />
        
        {/* Organic shape background */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200" preserveAspectRatio="none">
          <motion.path
            d="M40,20 Q80,10 120,20 T180,40 Q190,80 180,120 T160,180 Q120,190 80,180 T20,160 Q10,120 20,80 T40,20"
            fill="url(#gardenGradient)"
            fillOpacity="0.1"
            animate={isHovered ? { 
              d: "M50,30 Q90,20 130,30 T170,50 Q180,90 170,130 T150,170 Q110,180 70,170 T30,150 Q20,110 30,70 T50,30"
            } : {}}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="gardenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFB6C1" />
              <stop offset="100%" stopColor="#DDA0DD" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Main card content */}
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 h-full shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
          {/* Decorative vines */}
          <svg className="absolute top-0 right-0 w-32 h-32 opacity-10" viewBox="0 0 100 100">
            <path
              d="M90,10 Q80,20 70,30 T50,50 Q40,60 30,70 T10,90"
              stroke="#7A8B7F"
              strokeWidth="2"
              fill="none"
            />
            <circle cx="70" cy="30" r="3" fill="#7A8B7F" />
            <circle cx="50" cy="50" r="3" fill="#7A8B7F" />
            <circle cx="30" cy="70" r="3" fill="#7A8B7F" />
          </svg>
          
          {/* Flower icon */}
          <div className="mb-4 relative">
            <FlowerComponent isHovered={isHovered} className="w-16 h-16 md:w-20 md:h-20" />
            
            {/* Hover petals animation */}
            <AnimatePresence>
              {isHovered && (
                <>
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      custom={i}
                      variants={petalVariants}
                      initial="initial"
                      animate="animate"
                      exit="initial"
                      className="absolute top-1/2 left-1/2 w-2 h-2 bg-pink-300 rounded-full"
                      style={{ originX: 0.5, originY: 0.5 }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>
          </div>
          
          {/* Featured badge */}
          {service.featured && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-4 right-4 bg-bloompink/90 text-white text-xs px-3 py-1 rounded-full font-medium"
            >
              Most Popular
            </motion.div>
          )}
          
          {/* Title with growing animation */}
          <motion.h3 
            className="font-playfair text-xl md:text-2xl text-bloom/90 mb-2"
            animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {service.title.split('\n').map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </motion.h3>
          
          {/* Tagline */}
          {service.tagline && (
            <p className="text-bloompink/70 text-sm mb-3 italic font-light">
              {service.tagline}
            </p>
          )}
          
          {/* Description */}
          <p className="text-bloom/60 text-sm mb-4">
            {service.shortDescription}
          </p>
          
          {/* Key benefits - revealed on hover */}
          <AnimatePresence>
            {isHovered && service.keyBenefits && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-4 space-y-1 overflow-hidden"
              >
                {service.keyBenefits.map((benefit, i) => (
                  <motion.li
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center text-xs text-bloom/70"
                  >
                    <span className="w-1.5 h-1.5 bg-bloompink/60 rounded-full mr-2" />
                    {benefit}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
          
          {/* CTA Button with grow animation */}
          <Link href={`/services/${service.slug}`}>
            <motion.button
              className="group relative bg-bloom/90 text-white px-6 py-2.5 rounded-full text-sm font-medium overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Growing background effect */}
              <motion.div
                className="absolute inset-0 bg-bloompink/90"
                initial={{ scale: 0, originX: 0.5, originY: 0.5 }}
                whileHover={{ scale: 1.5 }}
                transition={{ duration: 0.4 }}
              />
              <span className="relative z-10 flex items-center">
                Explore {service.title.split('\n')[0]}
                <motion.span
                  className="ml-2"
                  animate={isHovered ? { x: 5 } : { x: 0 }}
                >
                  →
                </motion.span>
              </span>
            </motion.button>
          </Link>
          
          {/* Growing roots animation on hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                exit={{ scaleY: 0 }}
                className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-bloom-sage-50/30 to-transparent"
                style={{ originY: 1 }}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}