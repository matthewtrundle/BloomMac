'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CityGarden {
  name: string;
  x: number;
  y: number;
  flower: string;
  climate: string;
}

export default function TexasGardenMap() {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  
  const cities: CityGarden[] = [
    { name: 'Austin', x: 50, y: 65, flower: '🌻', climate: 'Greenhouse HQ' },
    { name: 'Houston', x: 70, y: 75, flower: '🌺', climate: 'Tropical Garden' },
    { name: 'Dallas', x: 52, y: 35, flower: '🌸', climate: 'Prairie Blooms' },
    { name: 'San Antonio', x: 48, y: 78, flower: '🌵', climate: 'Desert Flowers' },
    { name: 'El Paso', x: 5, y: 60, flower: '🏵️', climate: 'Mountain Oasis' },
  ];
  
  return (
    <div className="relative w-full aspect-[4/3] max-w-2xl mx-auto">
      {/* Texas outline - more accurate shape */}
      <svg 
        viewBox="0 0 100 100" 
        className="absolute inset-0 w-full h-full"
        style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
      >
        {/* More accurate Texas shape */}
        <path
          d="M 15,25 L 40,20 L 50,15 L 60,18 L 70,15 L 85,20 L 88,35 L 90,50 L 88,65 L 85,70 L 80,75 L 75,78 L 70,82 L 65,85 L 55,88 L 45,85 L 35,82 L 25,78 L 18,70 L 12,55 L 10,40 L 12,30 Z"
          fill="#F5F5DC"
          stroke="#8B7355"
          strokeWidth="1"
          opacity="0.2"
        />
        
        {/* Texas text label */}
        <text x="50" y="95" textAnchor="middle" className="fill-bloom/30 text-xs font-light uppercase tracking-wider">
          Texas
        </text>
        
        {/* Garden bed texture overlay */}
        <pattern id="gardenTexture" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.5" fill="#7A8B7F" opacity="0.1"/>
          <circle cx="3" cy="3" r="0.3" fill="#8B7355" opacity="0.08"/>
        </pattern>
        <path
          d="M 15,25 L 40,20 L 50,15 L 60,18 L 70,15 L 85,20 L 88,35 L 90,50 L 88,65 L 85,70 L 80,75 L 75,78 L 70,82 L 65,85 L 55,88 L 45,85 L 35,82 L 25,78 L 18,70 L 12,55 L 10,40 L 12,30 Z"
          fill="url(#gardenTexture)"
          opacity="0.3"
        />
        
        {/* Animated vine connections */}
        <AnimatePresence>
          {selectedCity && cities.map((city) => {
            const austin = cities.find(c => c.name === 'Austin');
            if (!austin || city.name === 'Austin') return null;
            
            return (
              <motion.path
                key={`vine-${city.name}`}
                d={`M ${austin.x},${austin.y} Q ${(austin.x + city.x) / 2},${(austin.y + city.y) / 2 - 10} ${city.x},${city.y}`}
                fill="none"
                stroke="#7A8B7F"
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                exit={{ pathLength: 0, opacity: 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
            );
          })}
        </AnimatePresence>
      </svg>
      
      {/* City gardens */}
      {cities.map((city) => (
        <motion.div
          key={city.name}
          className="absolute cursor-pointer"
          style={{ left: `${city.x}%`, top: `${city.y}%` }}
          onHoverStart={() => setHoveredCity(city.name)}
          onHoverEnd={() => setHoveredCity(null)}
          onClick={() => setSelectedCity(selectedCity === city.name ? null : city.name)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* City flower */}
          <motion.div
            className="relative"
            animate={city.name === 'Austin' ? {
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            } : {}}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <span className="text-3xl">{city.flower}</span>
            
            {/* Glow effect for Austin HQ */}
            {city.name === 'Austin' && (
              <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-yellow-300 rounded-full blur-xl opacity-30 animate-pulse"></div>
              </div>
            )}
          </motion.div>
          
          {/* City label */}
          <AnimatePresence>
            {(hoveredCity === city.name || selectedCity === city.name) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: -40 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap"
              >
                <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
                  <p className="text-sm font-medium text-bloom/90">{city.name}</p>
                  <p className="text-xs text-bloom/60">{city.climate}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
      
      {/* Floating seeds animation */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`seed-${i}`}
          className="absolute w-2 h-2 bg-pink-300 rounded-full opacity-30"
          initial={{ x: 50, y: 65 }}
          animate={{
            x: [50, 50 + (Math.random() - 0.5) * 60, 50 + (Math.random() - 0.5) * 80],
            y: [65, 65 + (Math.random() - 0.5) * 40, 65 + (Math.random() - 0.5) * 60],
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            delay: i * 2,
            ease: "linear"
          }}
        />
      ))}
      
      {/* Legend */}
      <div className="absolute bottom-0 left-0 bg-white/90 backdrop-blur-sm p-3 rounded-lg text-xs">
        <p className="text-bloom/70 mb-1">🌱 Click cities to see connections</p>
        <p className="text-bloom/70">🌻 Austin: Our main greenhouse</p>
      </div>
    </div>
  );
}