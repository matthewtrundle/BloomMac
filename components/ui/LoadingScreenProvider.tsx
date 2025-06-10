'use client';

import React, { useState, useEffect } from 'react';
import LoadingScreen from './LoadingScreen';

interface LoadingScreenProviderProps {
  children: React.ReactNode;
}

export default function LoadingScreenProvider({ children }: LoadingScreenProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    // Check if this is the first visit in this session
    const hasLoadedThisSession = sessionStorage.getItem('bloom-loaded');
    
    if (hasLoadedThisSession) {
      // Skip loading screen if already shown this session
      setIsLoading(false);
    }
    
    setIsMounted(true);
  }, []);
  
  const handleLoadComplete = () => {
    setIsLoading(false);
    // Mark that we've shown the loading screen this session
    sessionStorage.setItem('bloom-loaded', 'true');
  };
  
  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return null;
  }
  
  return (
    <>
      {isLoading && (
        <LoadingScreen 
          onLoadComplete={handleLoadComplete}
          minimumDuration={2800}
        />
      )}
      <div className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}>
        {children}
      </div>
    </>
  );
}