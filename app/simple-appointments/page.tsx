'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import AppointmentScheduler from '@/components/appointments/AppointmentScheduler';

export default function SimpleAppointmentsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'schedule' | 'history'>('schedule');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch appointments
      const { data: appointmentData, error: appointmentError } = await supabase
        .from('appointment_data')
        .select('*')
        .eq('user_id', user.id)
        .order('appointment_date', { ascending: false });

      if (!appointmentError && appointmentData) {
        setAppointments(appointmentData);
      }

      // Fetch payment methods
      const { data: paymentData, error: paymentError } = await supabase
        .from('user_payment_methods')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (!paymentError && paymentData) {
        setPaymentMethods(paymentData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentScheduled = (event: any) => {
    // Refresh appointments after scheduling
    fetchUserData();
    
    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    successMessage.textContent = 'Appointment scheduled successfully!';
    document.body.appendChild(successMessage);
    
    setTimeout(() => {
      successMessage.remove();
    }, 5000);
  };

  if (authLoading || loading) {
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

  const upcomingAppointments = appointments.filter(
    apt => new Date(apt.appointment_date) > new Date() && apt.status === 'scheduled'
  );

  const pastAppointments = appointments.filter(
    apt => new Date(apt.appointment_date) <= new Date() || apt.status === 'completed' || apt.status === 'cancelled'
  );

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
        <div className="flex space-x-1 bg-bloom-sage-50/30 rounded-lg p-1 max-w-md">
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
              {/* Session Types Information */}
              <div className="bg-white rounded-xl shadow-sm border border-bloom-sage/10 p-6">
                <h2 className="text-xl font-semibold text-bloom-dark mb-4">Available Sessions</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="border border-bloom-sage/20 rounded-lg p-4 hover:border-bloom-sage/40 transition-colors">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">💬</span>
                      <div>
                        <h3 className="font-medium text-bloom-dark">Initial Consultation</h3>
                        <p className="text-sm text-bloom-dark/60 mt-1">50 minutes · $200</p>
                        <p className="text-xs text-bloom-dark/50 mt-2">Comprehensive assessment and personalized treatment planning</p>
                      </div>
                    </div>
                  </div>
                  <div className="border border-bloom-sage/20 rounded-lg p-4 hover:border-bloom-sage/40 transition-colors">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🌸</span>
                      <div>
                        <h3 className="font-medium text-bloom-dark">Follow-up Session</h3>
                        <p className="text-sm text-bloom-dark/60 mt-1">50 minutes · $175</p>
                        <p className="text-xs text-bloom-dark/50 mt-2">Ongoing therapeutic support and progress monitoring</p>
                      </div>
                    </div>
                  </div>
                  <div className="border border-bloom-sage/20 rounded-lg p-4 hover:border-bloom-sage/40 transition-colors">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🤝</span>
                      <div>
                        <h3 className="font-medium text-bloom-dark">Brief Check-in</h3>
                        <p className="text-sm text-bloom-dark/60 mt-1">25 minutes · $100</p>
                        <p className="text-xs text-bloom-dark/50 mt-2">Quick support and guidance between regular sessions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Appointment Scheduler Component */}
              <AppointmentScheduler
                appointmentType="consultation"
                onScheduled={handleAppointmentScheduled}
              />

              {/* Payment Notice */}
              {paymentMethods.length === 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div className="flex-1">
                      <h4 className="font-medium text-amber-800">Payment Method Required</h4>
                      <p className="text-sm text-amber-700 mt-1">
                        A payment method is required before booking appointments. We'll hold the session fee and only charge after your appointment.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Policies */}
              <div className="bg-white rounded-xl shadow-sm border border-bloom-sage/10 p-6">
                <h2 className="text-xl font-semibold text-bloom-dark mb-4">Important Policies</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-bloom-sage-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-bloom-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-bloom-dark">24-Hour Cancellation Policy</h3>
                      <p className="text-sm text-bloom-dark/70 mt-1">
                        Please provide at least 24 hours notice for cancellations to avoid a $50 fee. 
                        We understand emergencies happen - contact us if you need to make changes.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-bloompink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-bloompink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-bloom-dark">Secure Payment Processing</h3>
                      <p className="text-sm text-bloom-dark/70 mt-1">
                        Payment is authorized at booking and charged 24 hours before your appointment. 
                        We accept all major credit cards, debit cards, and HSA/FSA cards.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-bloom-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-bloom-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-bloom-dark">Insurance & Superbills</h3>
                      <p className="text-sm text-bloom-dark/70 mt-1">
                        We're out-of-network providers but happy to provide superbills for insurance reimbursement. 
                        Just ask after your appointment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              {/* Upcoming Appointments */}
              {upcomingAppointments.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-bloom-sage/10 p-6">
                  <h2 className="text-xl font-semibold text-bloom-dark mb-4">Upcoming Appointments</h2>
                  <div className="space-y-3">
                    {upcomingAppointments.map((apt) => (
                      <div key={apt.id} className="p-4 bg-bloom-sage-50 rounded-lg border border-bloom-sage-200">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-bloom-dark">
                              {apt.appointment_type.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                            </h3>
                            <p className="text-sm text-bloom-dark/60 mt-1">
                              {new Date(apt.appointment_date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                            <p className="text-sm text-bloom-dark/60">
                              {new Date(apt.appointment_date).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Scheduled
                            </span>
                            {apt.payment_status && (
                              <p className="text-xs text-bloom-dark/60 mt-2">
                                Payment: {apt.payment_status}
                              </p>
                            )}
                          </div>
                        </div>
                        {apt.confirmation_received === false && (
                          <div className="mt-3 p-3 bg-amber-100 rounded-md">
                            <p className="text-sm text-amber-800">
                              ⚠️ Please confirm your attendance for this appointment
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Past Appointments */}
              <div className="bg-white rounded-xl shadow-sm border border-bloom-sage/10 p-6">
                <h2 className="text-xl font-semibold text-bloom-dark mb-4">Past Appointments</h2>
                {pastAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-bloom-dark/60">No past appointments yet</p>
                    <p className="text-sm text-bloom-dark/40 mt-2">Your appointment history will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pastAppointments.map((apt) => (
                      <div key={apt.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-bloom-dark">
                              {apt.appointment_type.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                            </h3>
                            <p className="text-sm text-bloom-dark/60 mt-1">
                              {new Date(apt.appointment_date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              apt.status === 'completed'
                                ? 'bg-blue-100 text-blue-800'
                                : apt.status === 'cancelled'
                                ? 'bg-gray-100 text-gray-800'
                                : apt.status === 'no_show'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {apt.status.replace('_', ' ')}
                            </span>
                            {apt.payment_amount && (
                              <p className="text-sm font-medium text-bloom-dark mt-2">
                                ${apt.payment_amount}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Superbill Request */}
                <div className="mt-6 p-4 bg-bloom-sage-50 rounded-lg">
                  <p className="text-sm text-bloom-dark/70">
                    Need documentation for insurance? 
                    <Link href="/contact" className="ml-1 text-bloom-sage hover:text-bloom-sage/80 font-medium">
                      Contact us for superbills
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}