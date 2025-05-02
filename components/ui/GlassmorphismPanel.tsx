'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';

export type PanelVariant = 'subtle' | 'medium' | 'prominent' | 'pink' | 'pink-prominent';
export type PanelShape = 'rounded' | 'rounded-lg' | 'rounded-xl' | 'rounded-full' | 'organic';

interface GlassmorphismPanelProps {
  variant?: PanelVariant;
  shape?: PanelShape;
  className?: string;
  children: React.ReactNode;
  hoverEffect?: 'lift' | 'glow' | 'none';
}

const variantClasses = {
  'subtle': 'glass-panel-subtle',
  'medium': 'glass-panel',
  'prominent': 'glass-panel-prominent',
  'pink': 'glass-panel-pink',
  'pink-prominent': 'glass-panel-pink-prominent'
};

const shapeClasses = {
  'rounded': 'rounded-md',
  'rounded-lg': 'rounded-lg',
  'rounded-xl': 'rounded-xl',
  'rounded-full': 'rounded-full',
  'organic': 'rounded-[30%_70%_70%_30%/30%_30%_70%_70%]' // Organic blob-like shape
};

const hoverClasses = {
  'lift': 'hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ease-in-out',
  'glow': 'hover:shadow-[0_0_15px_rgba(163,216,244,0.5)] transition-all duration-300 ease-in-out',
  'none': ''
};

const GlassmorphismPanel: React.FC<GlassmorphismPanelProps> = ({
  variant = 'medium',
  shape = 'rounded-lg',
  className = '',
  children,
  hoverEffect = 'none'
}) => {
  const variantClass = variantClasses[variant];
  const shapeClass = shapeClasses[shape];
  const hoverClass = hoverClasses[hoverEffect];
  
  const combinedClasses = twMerge(
    variantClass,
    shapeClass,
    hoverClass,
    className
  );
  
  return (
    <div className={combinedClasses}>
      {children}
    </div>
  );
};

export default GlassmorphismPanel;
