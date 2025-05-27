import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
}

// Map old image paths to optimized versions
const imageMap: Record<string, string> = {
  '/images/optimized/Hero/herooptimzed.webp': '/images/Hero-optimized/herooptimzed.webp',
  '/images/optimized/Hero/hero15.webp': '/images/Hero-optimized/hero15.webp',
  '/images/optimized/Team/Jana Rundle.webp': '/images/Team-optimized/Jana Rundle.webp',
  '/images/optimized/Home/new-mom.webp': '/images/Home-optimized/new-mom.webp',
  '/images/optimized/Home/Confident Women.webp': '/images/Home-optimized/Confident Women.webp',
  '/images/optimized/Home/Cozy Sunlit movie room.webp': '/images/Home-optimized/Cozy Sunlit movie room.webp',
  '/images/optimized/Services/AnxietyManagement1.webp': '/images/Services-optimized/AnxietyManagement1.webp',
  '/images/optimized/Services/AnxietyManagement2.webp': '/images/Services-optimized/AnxietyManagement2.webp',
  '/images/optimized/Services/New Mothers.webp': '/images/Services-optimized/New Mothers.webp',
  '/images/optimized/Services/Experienced Parents.webp': '/images/Services-optimized/Experienced Parents.webp',
  '/images/optimized/Services/Walking through fields.webp': '/images/Services-optimized/Walking through fields.webp',
  '/images/optimized/Services/Symbolic Shoes.webp': '/images/Services-optimized/Symbolic Shoes.webp',
  '/images/optimized/Services/Hopeful Hands.webp': '/images/Services-optimized/Hopeful Hands.webp',
  '/images/optimized/Services/Empty Armchair.webp': '/images/Services-optimized/Empty Armchair.webp',
};

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  className = '',
  sizes
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(imageMap[src] || src);
  const [isLoading, setIsLoading] = useState(true);

  // Fallback to original if optimized version fails
  const handleError = () => {
    if (imgSrc !== src) {
      setImgSrc(src);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        priority={priority}
        sizes={sizes || (fill ? '100vw' : undefined)}
        onLoad={() => setIsLoading(false)}
        onError={handleError}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      />
    </div>
  );
}