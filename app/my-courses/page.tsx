'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Mock course data - in production this would come from your database
const availableCourses = [
  {
    id: 'postpartum-wellness-foundations',
    title: 'Postpartum Wellness Foundations',
    description: 'Navigate your fourth trimester with confidence and support',
    image: '/images/optimized/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__1c12cc3c-cebd-47e2-ad9b-66b9bbca6480_0.webp',
    totalLessons: 24,
    completedLessons: 0,
    lastAccessed: null,
    price: 297
  }
];

export default function MyCoursesPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    error: ''
  });
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('course_auth_token');
    if (token) {
      setIsLoggedIn(true);
      // In production, verify token and load user's courses
      loadUserCourses();
    }
    setIsLoading(false);
  }, []);

  const loadUserCourses = () => {
    // Mock loading enrolled courses
    // In production, this would be an API call
    setEnrolledCourses(availableCourses);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginForm(prev => ({ ...prev, error: '' }));

    try {
      // Login with demo users (temporary)
      const response = await fetch('/api/course-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password
        })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('course_auth_token', data.token);
        setIsLoggedIn(true);
        loadUserCourses();
      } else {
        const error = await response.json();
        setLoginForm(prev => ({ ...prev, error: error.error || 'Login failed' }));
      }
    } catch (error) {
      setLoginForm(prev => ({ ...prev, error: 'Network error. Please try again.' }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('course_auth_token');
    setIsLoggedIn(false);
    setEnrolledCourses([]);
    setLoginForm({ email: '', password: '', error: '' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-bloom-offwhite flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bloompink mx-auto mb-4"></div>
          <p className="text-bloom-dark/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-bloom-offwhite">
        <div className="pt-32 pb-20 px-4">
          <div className="container mx-auto">
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-2xl shadow-soft p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-bloompink/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-bloompink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-playfair text-bloom-dark mb-2">
                    Access Your Courses
                  </h1>
                  <p className="text-bloom-dark/70">
                    Enter the login credentials you received via email after purchase
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  {loginForm.error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-600 text-sm">{loginForm.error}</p>
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-bloom-dark mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-bloom-dark mb-2">
                      Course Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      required
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                      placeholder="Enter your course password"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-bloompink text-white py-3 px-6 rounded-lg font-medium hover:bg-bloom-pink-dark transition-colors"
                  >
                    Access My Courses
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="text-center space-y-3">
                    <p className="text-sm text-bloom-dark/60">
                      Don't have access yet?
                    </p>
                    <Link
                      href="/courses"
                      className="text-bloompink hover:text-bloom-pink-dark text-sm font-medium"
                    >
                      Browse Courses
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-bloom-offwhite">
      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-playfair text-bloom-dark mb-2">
                  My Learning Dashboard
                </h1>
                <p className="text-bloom-dark/70">
                  Welcome back! Continue your journey to wellness.
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="text-bloom-dark/60 hover:text-bloom-dark text-sm"
              >
                Sign Out
              </button>
            </div>

            {/* Courses Grid */}
            {enrolledCourses.length > 0 ? (
              <div className="grid gap-8">
                {enrolledCourses.map((course) => (
                  <div key={course.id} className="bg-white rounded-2xl shadow-soft overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <Image
                          src={course.image}
                          alt={course.title}
                          width={400}
                          height={300}
                          className="w-full h-64 md:h-full object-cover"
                        />
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
                            Enrolled
                          </span>
                        </div>

                        {/* Progress */}
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-bloom-dark">Progress</span>
                            <span className="text-sm text-bloom-dark/60">
                              {course.completedLessons} of {course.totalLessons} lessons
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-bloompink h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(course.completedLessons / course.totalLessons) * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4">
                          <Link
                            href={`/learn/${course.id}`}
                            className="bg-bloompink text-white px-6 py-3 rounded-lg font-medium hover:bg-bloom-pink-dark transition-colors text-center"
                          >
                            {course.completedLessons > 0 ? 'Continue Learning' : 'Start Course'}
                          </Link>
                          <Link
                            href={`/courses/${course.id}`}
                            className="bg-white text-bloom-dark px-6 py-3 rounded-lg font-medium border-2 border-bloom-sage hover:bg-bloom-sage-50 transition-colors text-center"
                          >
                            Course Details
                          </Link>
                        </div>

                        {course.lastAccessed && (
                          <p className="text-sm text-bloom-dark/60 mt-4">
                            Last accessed: {new Date(course.lastAccessed).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-soft p-12 text-center">
                <div className="w-16 h-16 bg-bloom-sage-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
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
  );
}