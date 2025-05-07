'use client';

import React from 'react';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
// Import specific components from framer-motion instead of the whole module
import { motion, Variants } from 'framer-motion';

interface ButtonProps {
  variant?: 'primary' | 'accent' | 'outline' | 'ghost' | 'pink' | 'pink-outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  pulseOnView?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  fullWidth?: boolean;
  ariaLabel?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const variantClasses = {
  primary: 'btn-primary',
  accent: 'btn-accent',
  outline: 'btn-outline',
  ghost: 'text-bloom hover:text-bloompink transition-colors duration-300',
  pink: 'bg-bloompink hover:bg-[#B03979] text-white font-bold shadow-md transition-all hover:-translate-y-0.5',
  'pink-outline': 'border-2 border-bloompink text-bloompink hover:bg-bloompink/5 transition-all hover:-translate-y-0.5'
};

const sizeClasses = {
  sm: 'text-xs py-2 px-4',
  md: 'text-sm py-3 px-6',
  lg: 'text-base py-4 px-8'
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  href,
  type = 'button',
  disabled = false,
  pulseOnView = false,
  children,
  onClick,
  fullWidth = false,
  ariaLabel,
  icon,
  iconPosition = 'left'
}) => {
  const classes = twMerge(
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    'font-medium rounded-md transition-all duration-300 flex items-center justify-center',
    className
  );

  // Motion variants for the pulse effect
  const pulseVariants = {
    initial: {
      boxShadow: '0 0 0 0 rgba(163, 216, 244, 0)',
    },
    pulse: {
      boxShadow: [
        '0 0 0 0 rgba(163, 216, 244, 0.7)',
        '0 0 0 10px rgba(163, 216, 244, 0)',
      ],
      transition: {
        duration: 2,
        repeat: 3,
        repeatType: 'loop' as const,
        repeatDelay: 1,
      },
    },
  };

  const ButtonContent = () => (
    <>
      {icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </>
  );

  // If there's an href, render a Link
  if (href) {
    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        <ButtonContent />
      </Link>
    );
  }

  // Otherwise, render a button with optional pulse effect
  if (pulseOnView) {
    return (
      <motion.button
        type={type}
        className={classes}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        variants={pulseVariants}
        initial="initial"
        whileInView="pulse"
        viewport={{ once: false, margin: '-100px' }}
      >
        <ButtonContent />
      </motion.button>
    );
  }

  // Regular button without pulse
  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      <ButtonContent />
    </button>
  );
};

export default Button;
