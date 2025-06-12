'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { authHelpers } from '@/lib/supabase-auth';
import { Loader2, Lock } from 'lucide-react';
import Link from 'next/link';

interface CourseAccessGuardProps {
  children: React.ReactNode;
  courseId: string;
  courseName?: string;
}

export default function CourseAccessGuard({ children, courseId, courseName = 'this course' }: CourseAccessGuardProps) {
  const { user, loading: authLoading } = useAuth();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        router.push(`/auth/login?next=${encodeURIComponent(window.location.pathname)}`);
        return;
      }

      try {
        const { hasAccess: access } = await authHelpers.checkCourseAccess(user.id, courseId);
        setHasAccess(access);
      } catch (error) {
        console.error('Error checking course access:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      checkAccess();
    }
  }, [user, courseId, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-bloompink mx-auto mb-4" />
          <p className="text-bloom-dark/60">Checking access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  if (hasAccess === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-bloom-sage-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-bloom-sage" />
          </div>
          
          <h1 className="text-2xl font-playfair text-bloom-dark mb-4">Access Required</h1>
          
          <p className="text-bloom-dark/70 mb-6">
            You don't have access to {courseName} yet. Purchase the course to unlock all content and begin your journey.
          </p>

          <div className="space-y-3">
            <Link
              href={`/courses/${courseId}`}
              className="w-full inline-block bg-bloompink text-white py-3 px-6 rounded-lg font-semibold hover:bg-bloom-pink-dark transition-colors"
            >
              View Course Details
            </Link>
            
            <Link
              href="/my-courses"
              className="w-full inline-block py-3 px-6 text-bloom-dark/70 hover:text-bloom-dark transition-colors"
            >
              Back to My Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}