'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';

export default function HeaderAuthSection() {
  const { user, loading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('HeaderAuthSection mounted:', {
        user: user?.email,
        authLoading,
        mounted: true
      });
    }
  }, [user, authLoading]);

  // Always show loading on server and initial mount
  if (!mounted || authLoading) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-20 h-9 bg-gray-200 animate-pulse rounded-md"></div>
        <div className="w-32 h-9 bg-gray-200 animate-pulse rounded-md"></div>
      </div>
    );
  }

  // Explicit check for valid user
  const hasValidUser = !!(user && user.email && user.id);

  if (hasValidUser) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/wellness-hub"
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-full transition-all duration-300 group"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
            {user.email!.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-blue-700 group-hover:text-blue-800 transition-colors">
            Growth Studio
          </span>
        </Link>
        <Button 
          href="/book"
          variant="pink"
          size="md"
          className="shadow-sm hover:shadow-md"
        >
          Book Session
        </Button>
      </div>
    );
  }

  // Default: show login buttons
  return (
    <div className="flex items-center gap-3">
      <Button
        href="/auth/login"
        variant="ghost"
        size="sm"
        className="text-bloom-dark hover:text-bloom-sage border border-gray-200 hover:border-bloom-sage/30"
      >
        Login
      </Button>
      <Button 
        href="/book"
        variant="pink"
        size="md"
        className="shadow-sm hover:shadow-md"
      >
        Book Free Consultation
      </Button>
    </div>
  );
}