import React from 'react';

interface SmartTitleProps {
  title: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div';
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/**
 * SmartTitle component handles text wrapping intelligently to prevent awkward line breaks.
 * 
 * Features:
 * - Respects intentional line breaks (\n) in titles
 * - Prevents awkward word breaks like "Postpartum Depression S" + "upport" 
 * - Responsive design that works on all screen sizes
 * - Reusable across the entire site
 * 
 * Usage:
 * <SmartTitle title="Postpartum Depression Support" as="h1" className="text-3xl" />
 * <SmartTitle title="Anxiety &\nStress Management" as="h2" className="text-2xl" />
 */
export default function SmartTitle({ 
  title, 
  className = '', 
  as: Component = 'h1',
  style,
  children 
}: SmartTitleProps) {
  const baseClasses = 'text-smart-break';
  const combinedClasses = `${baseClasses} ${className}`.trim();

  const renderTitle = () => {
    if (title.includes('\n')) {
      // Handle intentional line breaks
      return title.split('\n').map((line, index) => (
        <span key={index} className="block title-no-orphans">
          {line}
        </span>
      ));
    } else {
      // Single line title with smart breaking
      return (
        <span className="title-no-orphans">
          {title}
        </span>
      );
    }
  };

  return (
    <Component className={combinedClasses} style={style}>
      {children ? children : renderTitle()}
    </Component>
  );
}

/**
 * Utility function for getting clean title text (useful for metadata, alt text, etc.)
 */
export function getCleanTitle(title: string): string {
  return title.replace(/\n/g, ' ');
}