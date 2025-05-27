'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
  quality?: number;
}

export default function ResponsiveImage({
  src,
  alt,
  width = 1200,
  height = 800,
  priority = false,
  className = '',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  quality = 85
}: ResponsiveImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isWebPSupported, setIsWebPSupported] = useState(false);

  useEffect(() => {
    // Check WebP support
    const checkWebP = () => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        setIsWebPSupported(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    };
    checkWebP();
  }, []);

  useEffect(() => {
    // Convert image path to WebP if supported
    if (isWebPSupported && src.match(/\.(png|jpg|jpeg)$/i)) {
      const pathWithoutExt = src.replace(/\.(png|jpg|jpeg)$/i, '');
      const filename = pathWithoutExt.split('/').pop();
      
      // Check if this is a Midjourney image
      if (filename?.startsWith('biff')) {
        setImageSrc(`/images/optimized/midjourney/${filename}.webp`);
      } else {
        // For other images, maintain directory structure
        const parts = src.split('/');
        const directory = parts[parts.length - 2];
        setImageSrc(`/images/optimized/${directory}/${filename}.webp`);
      }
    }
  }, [src, isWebPSupported]);

  // Generate srcSet for responsive images
  const generateSrcSet = () => {
    if (!isWebPSupported || !imageSrc.endsWith('.webp')) return undefined;
    
    const basePath = imageSrc.replace('.webp', '');
    const sizes = [640, 750, 1080, 1200, 1920];
    
    return sizes
      .map(size => `${basePath}-${size}w.webp ${size}w`)
      .join(', ');
  };

  // Get placeholder path
  const getPlaceholder = () => {
    if (!imageSrc.endsWith('.webp')) return undefined;
    return imageSrc.replace('.webp', '-placeholder.webp');
  };

  return (
    <div className={`relative ${className}`}>
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        quality={quality}
        sizes={sizes}
        className="object-cover"
        placeholder="blur"
        blurDataURL={getPlaceholder()}
        onError={() => {
          // Fallback to original image if WebP fails
          setImageSrc(src);
        }}
      />
    </div>
  );
}