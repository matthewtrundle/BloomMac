'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GardenZoneCardProps {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
}

export default function GardenZoneCard({ icon, title, subtitle, description }: GardenZoneCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      className="bg-white/80 backdrop-blur-sm p-5 rounded-xl shadow-soft border border-bloom-sage/10"
    >
      <div className="flex items-start gap-4">
        <motion.div 
          className="text-3xl"
          whileHover={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.div>
        <div className="flex-1">
          <h3 className="font-medium text-bloom-dark/90 mb-1">{title}</h3>
          <p className="text-sm text-bloompink/70 mb-1">{subtitle}</p>
          <p className="text-xs text-bloom-dark/60">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}