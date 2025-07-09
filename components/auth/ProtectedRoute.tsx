'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ensureValidSession } from '@/lib/session-refresh';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = '/auth/login' 
}: ProtectedRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      // Wait for auth to load
      if (authLoading) return;

      // No user, redirect to login
      if (!user) {
        router.push(redirectTo);
        return;
      }

      // Validate session on server
      const isValid = await ensureValidSession();
      if (!isValid) {
        router.push(redirectTo);
        return;
      }

      setIsValidating(false);
    };

    validateSession();
  }, [user, authLoading, router, redirectTo]);

  // Show loading state while checking auth
  if (authLoading || isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bloom-sage mx-auto"></div>
          <p className="mt-4 text-bloom-dark/60">Verifying access...</p>
        </div>
      </div>
    );
  }

  // User is authenticated and session is valid
  return <>{children}</>;
}