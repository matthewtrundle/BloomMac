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
  '/images/Hero/herooptimzed.png': '/images/Hero-optimized/herooptimzed.webp',
  '/images/Hero/hero15.png': '/images/Hero-optimized/hero15.webp',
  '/images/Team/Jana Rundle.jpg': '/images/Team-optimized/Jana Rundle.webp',
  '/images/Home/new-mom.png': '/images/Home-optimized/new-mom.webp',
  '/images/Home/Confident Women.png': '/images/Home-optimized/Confident Women.webp',
  '/images/Home/Cozy Sunlit movie room.png': '/images/Home-optimized/Cozy Sunlit movie room.webp',
  '/images/Services/AnxietyManagement1.png': '/images/Services-optimized/AnxietyManagement1.webp',
  '/images/Services/AnxietyManagement2.png': '/images/Services-optimized/AnxietyManagement2.webp',
  '/images/Services/New Mothers.png': '/images/Services-optimized/New Mothers.webp',
  '/images/Services/Experienced Parents.png': '/images/Services-optimized/Experienced Parents.webp',
  '/images/Services/Walking through fields.png': '/images/Services-optimized/Walking through fields.webp',
  '/images/Services/Symbolic Shoes.png': '/images/Services-optimized/Symbolic Shoes.webp',
  '/images/Services/Hopeful Hands.png': '/images/Services-optimized/Hopeful Hands.webp',
  '/images/Services/Empty Armchair.png': '/images/Services-optimized/Empty Armchair.webp',
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