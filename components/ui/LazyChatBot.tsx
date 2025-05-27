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
    // Load ChatBot after 2 seconds (gives time for critical content to load first)
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!shouldLoad) return null;

  return <ChatBot />;
}