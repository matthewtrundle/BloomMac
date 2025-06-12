'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { authHelpers } from '@/lib/supabase-auth';
import { Loader2, BookOpen, Clock, ArrowRight } from 'lucide-react';

interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail_url?: string;
}

interface UserCourse {
  course_id: string;
  enrolled_at: string;
  payment_status: string;
  courses: Course;
}

export default function MyCoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<UserCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUserCourses = async () => {
      if (!user) return;

      try {
        const userCourses = await authHelpers.getUserCourses(user.id);
        setCourses(userCourses || []);
      } catch (err: any) {
        console.error('Error loading courses:', err);
        setError('Failed to load your courses. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };

    loadUserCourses();
  }, [user]);

  const getEnrollmentDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-white to-bloom-offwhite">
        <div className="pt-32 pb-20 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-playfair text-bloom-dark mb-2">
                  My Learning Dashboard
                </h1>
                <p className="text-bloom-dark/70">
                  Welcome back, {user?.user_metadata?.full_name || user?.email}! Continue your journey to wellness.
                </p>
              </div>

              {loading ? (
                <div className="bg-white rounded-2xl shadow-soft p-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-bloompink mx-auto mb-4" />
                  <p className="text-bloom-dark/60">Loading your courses...</p>
                </div>
              ) : error ? (
                <div className="bg-white rounded-2xl shadow-soft p-12 text-center">
                  <p className="text-red-600 mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="text-bloompink hover:text-bloom-pink-dark font-medium"
                  >
                    Try Again
                  </button>
                </div>
              ) : courses.length > 0 ? (
                <div className="grid gap-8">
                  {courses.map((userCourse) => {
                    const course = userCourse.courses;
                    return (
                      <div key={course.id} className="bg-white rounded-2xl shadow-soft overflow-hidden">
                        <div className="md:flex">
                          <div className="md:w-1/3">
                            {course.thumbnail_url ? (
                              <Image
                                src={course.thumbnail_url}
                                alt={course.title}
                                width={400}
                                height={300}
                                className="w-full h-64 md:h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-64 md:h-full bg-bloom-sage-50 flex items-center justify-center">
                                <BookOpen className="w-12 h-12 text-bloom-sage" />
                              </div>
                            )}
                          </div>
                          <div className="md:w-2/3 p-8">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h2 className="text-2xl font-semibold text-bloom-dark mb-2">
                                  {course.title}
                                </h2>
                                <p className="text-bloom-dark/70 mb-4">
                                  {course.description}
                                </p>
                              </div>
                              <span className="bg-bloom-sage-50 text-bloom-sage px-3 py-1 rounded-full text-sm font-medium">
                                {userCourse.payment_status === 'test_paid' ? 'Test Access' : 'Enrolled'}
                              </span>
                            </div>

                            {/* Enrollment Info */}
                            <div className="flex items-center gap-2 text-sm text-bloom-dark/60 mb-6">
                              <Clock className="w-4 h-4" />
                              <span>Enrolled {getEnrollmentDate(userCourse.enrolled_at)}</span>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4">
                              <Link
                                href={`/learn/${course.id}`}
                                className="bg-bloompink text-white px-6 py-3 rounded-lg font-medium hover:bg-bloom-pink-dark transition-colors text-center inline-flex items-center justify-center gap-2"
                              >
                                Continue Learning
                                <ArrowRight className="w-4 h-4" />
                              </Link>
                              <Link
                                href={`/courses/${course.slug || course.id}`}
                                className="bg-white text-bloom-dark px-6 py-3 rounded-lg font-medium border-2 border-bloom-sage hover:bg-bloom-sage-50 transition-colors text-center"
                              >
                                Course Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-soft p-12 text-center">
                  <div className="w-16 h-16 bg-bloom-sage-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="w-8 h-8 text-bloom-sage" />
                  </div>
                  <h2 className="text-2xl font-semibold text-bloom-dark mb-4">
                    No Courses Yet
                  </h2>
                  <p className="text-bloom-dark/70 mb-6">
                    You haven't enrolled in any courses yet. Explore our offerings to start your learning journey.
                  </p>
                  <Link
                    href="/courses"
                    className="inline-block bg-bloompink text-white px-6 py-3 rounded-lg font-medium hover:bg-bloom-pink-dark transition-colors"
                  >
                    Browse Courses
                  </Link>
                </div>
              )}

              {/* Support */}
              <div className="mt-12 bg-bloom-sage-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-bloom-dark mb-2">
                  Need Help?
                </h3>
                <p className="text-bloom-dark/70 mb-4">
                  If you're having trouble accessing your courses or have questions about the content, we're here to help.
                </p>
                <Link
                  href="/contact"
                  className="text-bloompink hover:text-bloom-pink-dark font-medium"
                >
                  Contact Support →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}