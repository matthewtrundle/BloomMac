'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function SimpleWorkbooksPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeWeek, setActiveWeek] = useState(1);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bloom-sage mx-auto"></div>
          <p className="mt-4 text-bloom-dark/60">Loading your workbooks...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const workbooks = [
    { week: 1, title: "Beginning Your Journey", status: "completed", date: "2024-01-15" },
    { week: 2, title: "Finding Your Balance", status: "completed", date: "2024-01-22" },
    { week: 3, title: "Building Support", status: "in-progress", date: null },
    { week: 4, title: "Nurturing Growth", status: "not-started", date: null },
    { week: 5, title: "Embracing Change", status: "not-started", date: null },
    { week: 6, title: "Moving Forward", status: "not-started", date: null },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-bloom-sage/10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-bloom-dark/60 hover:text-bloom-dark transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-2xl font-playfair text-bloom-dark">My Workbooks</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Progress Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-bloom-sage/10 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-bloom-dark">Your Progress</h2>
              <span className="text-sm font-medium text-bloompink bg-bloompink/10 px-3 py-1 rounded-full">
                2 of 6 completed
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-bloom-sage to-bloompink transition-all duration-500"
                style={{ width: '33%' }}
              ></div>
            </div>
          </div>

          {/* Workbook List */}
          <div className="grid gap-4">
            {workbooks.map((workbook) => (
              <div 
                key={workbook.week}
                className={`bg-white rounded-xl shadow-sm border p-6 cursor-pointer transition-all duration-200 ${
                  activeWeek === workbook.week 
                    ? 'border-bloom-sage ring-2 ring-bloom-sage/20' 
                    : 'border-bloom-sage/10 hover:border-bloom-sage/30'
                }`}
                onClick={() => setActiveWeek(workbook.week)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      workbook.status === 'completed' 
                        ? 'bg-green-100' 
                        : workbook.status === 'in-progress'
                        ? 'bg-yellow-100'
                        : 'bg-gray-100'
                    }`}>
                      {workbook.status === 'completed' ? (
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : workbook.status === 'in-progress' ? (
                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-bloom-dark">
                        Week {workbook.week}: {workbook.title}
                      </h3>
                      <p className="text-sm text-bloom-dark/60">
                        {workbook.status === 'completed' && workbook.date
                          ? `Completed on ${new Date(workbook.date).toLocaleDateString()}`
                          : workbook.status === 'in-progress'
                          ? 'Currently working on this week'
                          : 'Ready to begin when you are'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {workbook.status === 'completed' && (
                      <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        Submitted
                      </span>
                    )}
                    <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      workbook.status === 'completed'
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : 'bg-bloompink text-white hover:bg-bloompink/90'
                    }`}>
                      {workbook.status === 'completed' ? 'Review' : workbook.status === 'in-progress' ? 'Continue' : 'Start'}
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {activeWeek === workbook.week && (
                  <div className="mt-6 pt-6 border-t border-bloom-sage/10">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-bloom-dark mb-3">About This Week</h4>
                        <p className="text-sm text-bloom-dark/70">
                          This week focuses on {workbook.title.toLowerCase()}. You'll explore important themes
                          and reflect on your personal journey through guided questions and exercises.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-bloom-dark mb-3">Your Progress</h4>
                        {workbook.status === 'completed' ? (
                          <div className="space-y-2">
                            <p className="text-sm text-bloom-dark/70">✅ All questions answered</p>
                            <p className="text-sm text-bloom-dark/70">✅ Workbook submitted</p>
                            <p className="text-sm text-bloom-dark/70">✅ Feedback available</p>
                          </div>
                        ) : workbook.status === 'in-progress' ? (
                          <div className="space-y-2">
                            <p className="text-sm text-bloom-dark/70">📝 3 of 10 questions answered</p>
                            <p className="text-sm text-bloom-dark/70">⏳ Draft saved automatically</p>
                          </div>
                        ) : (
                          <p className="text-sm text-bloom-dark/70">Ready to begin when you are</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-bloom-sage-50 rounded-xl p-6">
            <h3 className="font-semibold text-bloom-dark mb-3">Need Support?</h3>
            <p className="text-sm text-bloom-dark/70 mb-4">
              Your workbooks are an important part of your journey. If you have questions or need help,
              we're here for you.
            </p>
            <div className="flex gap-3">
              <a 
                href="/simple-appointments"
                className="inline-flex items-center gap-2 px-4 py-2 bg-bloom-sage text-white rounded-lg hover:bg-bloom-sage/90 transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Book a Session</span>
              </a>
              <button className="px-4 py-2 border border-bloom-sage text-bloom-sage rounded-lg hover:bg-bloom-sage/5 transition-colors text-sm">
                Contact Support
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}