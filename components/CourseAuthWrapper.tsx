'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface CourseAuthWrapperProps {
  children: React.ReactNode;
  courseSlug: string;
  requiresPurchase?: boolean;
}

export default function CourseAuthWrapper({ 
  children, 
  courseSlug,
  requiresPurchase = true 
}: CourseAuthWrapperProps) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // If no user, redirect to login
        if (!authLoading && !user) {
          router.push(`/auth/login?redirect=/course/${courseSlug}`);
          return;
        }

        // If user exists, check course access
        if (user) {
          // First check user_course_access table (for Stripe purchases)
          const { data: emailAccess, error: emailError } = await supabase
            .from('user_course_access')
            .select('*')
            .eq('customer_email', user.email)
            .eq('course_id', courseSlug)
            .in('payment_status', ['paid', 'test_paid'])
            .single();

          if (emailAccess && !emailError) {
            setHasAccess(true);
            setLoading(false);
            return;
          }

          // Then check course_enrollments table (for direct enrollments)
          const { data: enrollment, error: enrollError } = await supabase
            .from('course_enrollments')
            .select(`
              *,
              courses!inner(slug)
            `)
            .eq('user_id', user.id)
            .eq('courses.slug', courseSlug)
            .eq('status', 'active')
            .single();

          if (enrollment && !enrollError) {
            setHasAccess(true);
            setLoading(false);
            return;
          }

          // No access found
          setError('You don\'t have access to this course');
          setHasAccess(false);
          setLoading(false);
          
          // Redirect to course purchase page
          setTimeout(() => {
            router.push(`/courses/${courseSlug}?no_access=true`);
          }, 2000);
        }
      } catch (err) {
        console.error('Error checking course access:', err);
        setError('Error checking access');
        setLoading(false);
      }
    };

    checkAccess();
  }, [user, authLoading, courseSlug, router]);

  // Show loading state
  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-bloom-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bloom-coral mx-auto mb-4"></div>
          <p className="text-bloom-gray">Checking access...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-bloom-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-4">
            <svg className="w-16 h-16 text-bloom-coral mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v.01M12 9v2m0 8a9 9 0 110-18 9 9 0 010 18z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-bloom-charcoal mb-2">Access Denied</h2>
          <p className="text-bloom-gray mb-4">{error}</p>
          <p className="text-sm text-bloom-gray">Redirecting to course page...</p>
        </div>
      </div>
    );
  }

  // Show content if has access
  if (hasAccess) {
    return <>{children}</>;
  }

  // Default: no access
  return null;
}