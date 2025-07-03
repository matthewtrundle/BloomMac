'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function SimpleAppointmentsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'schedule' | 'history'>('schedule');

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
          <p className="mt-4 text-bloom-dark/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

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
            <h1 className="text-2xl font-playfair text-bloom-dark">Appointments</h1>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-6 py-4">
        <div className="flex space-x-1 bg-bloom-sage-50/30 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-colors ${
              activeTab === 'schedule'
                ? 'bg-white text-bloom-dark shadow-sm'
                : 'text-bloom-dark/60 hover:text-bloom-dark'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-medium">Schedule</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-colors ${
              activeTab === 'history'
                ? 'bg-white text-bloom-dark shadow-sm'
                : 'text-bloom-dark/60 hover:text-bloom-dark'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">History</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              {/* Booking Information */}
              <div className="bg-white rounded-xl shadow-sm border border-bloom-sage/10 p-6">
                <h2 className="text-xl font-semibold text-bloom-dark mb-4">Book Your Session</h2>
                <p className="text-bloom-dark/70 mb-6">
                  Schedule a personalized session with Dr. Jana Rundle to support your wellness journey.
                </p>
                
                {/* Session Types */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="border border-bloom-sage/20 rounded-lg p-4">
                    <h3 className="font-medium text-bloom-dark mb-2">Initial Consultation</h3>
                    <p className="text-sm text-bloom-dark/60 mb-3">50 minutes · $200</p>
                    <p className="text-xs text-bloom-dark/50">Comprehensive assessment and treatment planning</p>
                  </div>
                  <div className="border border-bloom-sage/20 rounded-lg p-4">
                    <h3 className="font-medium text-bloom-dark mb-2">Follow-up Session</h3>
                    <p className="text-sm text-bloom-dark/60 mb-3">50 minutes · $175</p>
                    <p className="text-xs text-bloom-dark/50">Ongoing support and progress review</p>
                  </div>
                  <div className="border border-bloom-sage/20 rounded-lg p-4">
                    <h3 className="font-medium text-bloom-dark mb-2">Brief Check-in</h3>
                    <p className="text-sm text-bloom-dark/60 mb-3">25 minutes · $100</p>
                    <p className="text-xs text-bloom-dark/50">Quick support between regular sessions</p>
                  </div>
                </div>

                {/* Calendly Embed Alternative */}
                <div className="bg-bloom-sage-50 rounded-lg p-8 text-center">
                  <div className="w-16 h-16 bg-bloom-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-bloom-dark mb-2">Ready to Schedule?</h3>
                  <p className="text-bloom-dark/60 mb-4">Click below to view available times and book your appointment</p>
                  <a
                    href="https://calendly.com/bloompsychology"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-bloom-sage text-white rounded-lg hover:bg-bloom-sage/90 transition-colors"
                  >
                    <span>View Available Times</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Policies */}
              <div className="bg-white rounded-xl shadow-sm border border-bloom-sage/10 p-6">
                <h2 className="text-xl font-semibold text-bloom-dark mb-4">Important Policies</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-bloom-dark mb-2">Cancellation Policy</h3>
                    <p className="text-sm text-bloom-dark/70">
                      Please provide at least 24 hours notice for cancellations. 
                      Late cancellations or no-shows may result in a $50 fee.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-bloom-dark mb-2">Payment</h3>
                    <p className="text-sm text-bloom-dark/70">
                      Payment is due at the time of service. We accept credit cards, debit cards, and HSA/FSA cards.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-bloom-dark mb-2">Insurance</h3>
                    <p className="text-sm text-bloom-dark/70">
                      We are out-of-network providers. We can provide superbills for insurance reimbursement upon request.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="bg-white rounded-xl shadow-sm border border-bloom-sage/10 p-6">
              <h2 className="text-xl font-semibold text-bloom-dark mb-4">Appointment History</h2>
              
              {/* Mock appointment history */}
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-bloom-dark">Follow-up Session</h3>
                      <p className="text-sm text-bloom-dark/60 mt-1">January 15, 2024 at 2:00 PM</p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                        Completed
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-bloom-dark">$175</p>
                      <p className="text-xs text-bloom-dark/60">Paid</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-bloom-dark">Initial Consultation</h3>
                      <p className="text-sm text-bloom-dark/60 mt-1">January 2, 2024 at 10:00 AM</p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                        Completed
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-bloom-dark">$200</p>
                      <p className="text-xs text-bloom-dark/60">Paid</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-bloom-sage-50 rounded-lg">
                <p className="text-sm text-bloom-dark/70">
                  Your full appointment history and payment records are available upon request. 
                  Please contact us if you need documentation for insurance or tax purposes.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}