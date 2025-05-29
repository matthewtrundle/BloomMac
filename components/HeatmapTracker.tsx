'use client';

import { useEffect } from 'react';
import { heatmapTracker } from '@/lib/heatmap-tracker';

export default function HeatmapTracker() {
  useEffect(() => {
    // Heatmap tracker initializes automatically when imported
    console.log('Heatmap tracking active');
    
    return () => {
      // Cleanup is handled internally by the tracker
    };
  }, []);

  return null; // This component doesn't render anything
}