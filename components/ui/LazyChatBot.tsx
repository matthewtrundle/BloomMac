'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const ChatBot = dynamic(() => import('./ChatBot'), {
  loading: () => null,
  ssr: false
});

export default function LazyChatBot() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Check if mobile
    const isMobile = window.innerWidth < 768;
    
    // Load ChatBot after delay (longer on mobile)
    const delay = isMobile ? 5000 : 2000; // 5 seconds on mobile, 2 seconds on desktop
    
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  if (!shouldLoad) return null;

  return <ChatBot />;
}