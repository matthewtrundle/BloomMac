'use client';

interface CardAccentProps {
  text?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  rotate?: number;
}

/**
 * A decorative accent to add to cards, typically used to highlight special offers
 */
export default function CardAccent({
  text = 'free',
  position = 'top-left',
  color = 'text-pink-500',
  size = 'md',
  rotate = -15
}: CardAccentProps) {
  // Map size to text size classes
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };
  
  // Map position to position classes
  const positionClasses = {
    'top-left': '-top-3 -left-3',
    'top-right': '-top-3 -right-3',
    'bottom-left': '-bottom-3 -left-3',
    'bottom-right': '-bottom-3 -right-3'
  };
  
  return (
    <span 
      className={`absolute ${positionClasses[position]} ${sizeClasses[size]} font-script ${color}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {text}
    </span>
  );
}
