'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface GardenResourceCardProps {
  resource: {
    category: string;
    title: string;
    description: string;
    type: string;
    icon: string;
    link: string;
  };
  index: number;
}

export default function GardenResourceCard({ resource, index }: GardenResourceCardProps) {
  // Keep original resource types
  const typeToGarden = {
    'PDF Guide': '📄 PDF Guide',
    'Interactive': '🌟 Interactive',
    'Video Series': '🎥 Video Series',
    'Worksheet': '📝 Worksheet',
    'Checklist': '✅ Checklist',
    'Guide': '📋 Guide'
  };

  // Category-based card colors
  const categoryColors = {
    'moms': 'from-pink-50 to-bloom-pink-50',
    'partners': 'from-red-50 to-pink-50',
    'families': 'from-green-50 to-bloom-sage-50',
    'emergency': 'from-yellow-50 to-orange-50'
  };

  const cardColor = categoryColors[resource.category as keyof typeof categoryColors] || 'from-gray-50 to-white';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="h-full"
    >
      <Link href={resource.link} className="block h-full">
        <div className={`relative bg-gradient-to-br ${cardColor} rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group h-full border border-bloom-sage/10`}>
          {/* Seed packet style header */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-bloom-sage/20 to-transparent"></div>
          
          {/* Content */}
          <div className="p-6 flex flex-col h-full">
            {/* Icon and Type */}
            <div className="flex items-start justify-between mb-4">
              <motion.span 
                className="text-4xl"
                whileHover={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                {resource.icon}
              </motion.span>
              <span className="text-xs font-medium text-bloom-sage bg-white/70 px-3 py-1 rounded-full">
                {typeToGarden[resource.type as keyof typeof typeToGarden] || resource.type}
              </span>
            </div>
            
            {/* Title with hover effect */}
            <h3 className="text-xl font-semibold text-bloom-dark mb-2 group-hover:text-bloom-sage transition-colors">
              {resource.title}
            </h3>
            
            {/* Description */}
            <p className="text-bloom text-sm flex-grow">
              {resource.description}
            </p>
            
            {/* Action link */}
            <div className="mt-4 flex items-center text-bloom-sage font-medium">
              <span className="text-sm">Access Resource</span>
              <motion.svg 
                className="w-4 h-4 ml-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </motion.svg>
            </div>
          </div>
          
          {/* Decorative corner flourish */}
          <div className="absolute bottom-0 right-0 w-20 h-20 opacity-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="text-4xl"
            >
              🌿
            </motion.div>
          </div>
          
          {/* Hover glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-bloom-sage/0 to-bloom-sage/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
      </Link>
    </motion.div>
  );
}