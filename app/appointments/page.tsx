'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AppointmentScheduler from '@/components/appointments/AppointmentScheduler';
import PaymentMethodManager from '@/components/payments/PaymentMethodManager';
import { getUserPaymentHistory, getUserPaymentMethods } from '@/lib/payment-management';
import { Calendar, Clock, AlertCircle, ExternalLink } from 'lucide-react';
import Button from '@/components/ui/Button';

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_type: string;
  status: string;
  payment_status: string;
  no_show_fee_charged: boolean;
  confirmation_received: boolean;
  calendly_event_id?: string;
  reminder_sent?: boolean;
}

interface PaymentRecord {
  id: string;
  amount: number;
  status: string;
  type: string;
  date: string;
  appointment: {
    date: string;
    type: string;
    status: string;
  } | null;
}

export default function AppointmentsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'schedule' | 'history' | 'payments'>('schedule');

  const handleCancelAppointment = async (appointmentId: string) => {
    // Refresh appointments after cancellation
    fetchUserData();
  };

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

    setLoading(true);
    try {
      // Fetch appointments
      const { data: appointmentData, error: aptError } = await supabase
        .from('appointment_data')
        .select('*')
        .eq('user_id', user.id)
        .order('appointment_date', { ascending: false });

      if (!aptError && appointmentData) {
        setAppointments(appointmentData);
      }

      // Fetch payment history
      const paymentData = await getUserPaymentHistory(user.id);
      setPaymentHistory(paymentData);

      // Fetch payment methods
      const methodData = await getUserPaymentMethods(user.id);
      setPaymentMethods(methodData);

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentScheduled = () => {
    fetchUserData(); // Refresh data when new appointment is scheduled
  };

  const upcomingAppointments = appointments.filter(
    apt => new Date(apt.appointment_date) > new Date() && apt.status === 'scheduled'
  );

  const pastAppointments = appointments.filter(
    apt => new Date(apt.appointment_date) <= new Date() || apt.status !== 'scheduled'
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bloom-sage mx-auto"></div>
          <p className="mt-4 text-bloom-dark/60">Loading your appointments...</p>
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
            <h1 className="text-2xl font-playfair text-bloom-dark">Appointments & Payments</h1>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-6 py-4">
        <div className="flex space-x-1 bg-bloom-sage-50/30 rounded-lg p-1">
          {[
            { id: 'schedule', label: 'Schedule', icon: '📅' },
            { id: 'history', label: 'History', icon: '🕐' },
            { id: 'payments', label: 'Payments', icon: '💳' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-bloom-dark shadow-sm'
                  : 'text-bloom-dark/60 hover:text-bloom-dark'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Quick Stats */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-bloom-sage">{upcomingAppointments.length}</p>
                  <p className="text-sm text-bloom-dark/60">Upcoming</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-bloom-accent">{pastAppointments.length}</p>
                  <p className="text-sm text-bloom-dark/60">Completed</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-bloompink">{paymentMethods.length}</p>
                  <p className="text-sm text-bloom-dark/60">Payment Methods</p>
                </div>
              </div>

              {/* Appointment Scheduler */}
              <AppointmentScheduler
                appointmentType="consultation"
                onScheduled={handleAppointmentScheduled}
              />
            </motion.div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Upcoming Appointments */}
              {upcomingAppointments.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-bloom-dark mb-4">Upcoming Appointments</h2>
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <AppointmentCard 
                        key={appointment.id} 
                        appointment={appointment} 
                        isUpcoming={true} 
                        onUpdate={handleCancelAppointment}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Past Appointments */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-bloom-dark mb-4">Appointment History</h2>
                {pastAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {pastAppointments.map((appointment) => (
                      <AppointmentCard 
                        key={appointment.id} 
                        appointment={appointment} 
                        isUpcoming={false} 
                        onUpdate={handleCancelAppointment}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-bloom-dark/60">No past appointments yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Payment Methods */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-bloom-dark mb-4">Payment Methods</h2>
                <PaymentMethodManager onPaymentMethodAdded={fetchUserData} />
              </div>

              {/* Payment History */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-bloom-dark mb-4">Payment History</h2>
                {paymentHistory.length > 0 ? (
                  <div className="space-y-4">
                    {paymentHistory.map((payment) => (
                      <PaymentCard key={payment.id} payment={payment} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-bloom-dark/60">No payment history yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// Appointment Card Component
function AppointmentCard({ 
  appointment, 
  isUpcoming,
  onUpdate
}: { 
  appointment: Appointment; 
  isUpcoming: boolean;
  onUpdate: (appointmentId: string) => void;
}) {
  const appointmentDate = new Date(appointment.appointment_date);
  const [showCancelWarning, setShowCancelWarning] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const router = useRouter();

  const hoursUntilAppointment = (appointmentDate.getTime() - new Date().getTime()) / (1000 * 60 * 60);
  const canCancelWithoutFee = hoursUntilAppointment > 24;

  const handleCancel = async () => {
    if (!showCancelWarning) {
      setShowCancelWarning(true);
      return;
    }

    setCancelling(true);
    try {
      const { error } = await supabase
        .from('appointment_data')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', appointment.id);

      if (!error) {
        alert('Appointment cancelled successfully');
        onUpdate(appointment.id);
      } else {
        throw error;
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Failed to cancel appointment. Please try again.');
    } finally {
      setCancelling(false);
      setShowCancelWarning(false);
    }
  };

  const handleReschedule = () => {
    // Open Calendly reschedule link
    if (appointment.calendly_event_id) {
      window.open(`https://calendly.com/reschedule/${appointment.calendly_event_id}`, '_blank');
    } else {
      // Fallback to regular scheduler
      router.push('/appointments?reschedule=true');
    }
  };

  const handleAddToCalendar = () => {
    const startDate = appointmentDate.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endDate = new Date(appointmentDate.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, '');
    const details = `Bloom Psychology ${appointment.appointment_type.replace(/-/g, ' ')} appointment`;
    
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(details)}&dates=${startDate}/${endDate}&details=${encodeURIComponent('Your Bloom Psychology appointment')}&location=Online`;
    window.open(googleUrl, '_blank');
  };

  return (
    <div className={`p-4 rounded-lg border ${
      isUpcoming ? 'border-bloom-sage bg-bloom-sage-50/30' : 'border-gray-200 bg-gray-50'
    }`}>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="font-medium text-bloom-dark">
              {appointment.appointment_type.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-bloom-dark/60">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {appointmentDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {appointmentDate.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit'
                })}
              </span>
            </div>
            {appointment.reminder_sent && (
              <p className="text-xs text-green-600 mt-1">✓ Reminder sent</p>
            )}
            {appointment.no_show_fee_charged && (
              <p className="text-sm text-red-600 mt-1">No-show fee applied</p>
            )}
          </div>
          <div className="text-right">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              appointment.status === 'scheduled' 
                ? 'bg-green-100 text-green-800'
                : appointment.status === 'completed'
                ? 'bg-blue-100 text-blue-800'
                : appointment.status === 'cancelled'
                ? 'bg-gray-100 text-gray-800'
                : appointment.status === 'no_show'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {appointment.status.replace('_', ' ')}
            </span>
            {!appointment.confirmation_received && isUpcoming && (
              <p className="text-xs text-orange-600 mt-2">Confirmation needed</p>
            )}
          </div>
        </div>

        {/* Action buttons for upcoming appointments */}
        {isUpcoming && appointment.status === 'scheduled' && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-bloom-sage/20">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddToCalendar}
              className="flex items-center gap-1"
            >
              <Calendar className="h-3 w-3" />
              Add to Calendar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReschedule}
              className="flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              Reschedule
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={cancelling}
              className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:border-red-300"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Appointment'}
            </Button>
          </div>
        )}

        {/* Cancellation warning */}
        {showCancelWarning && (
          <div className="border border-orange-200 bg-orange-50 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
            <div className="text-sm">
              <strong className="block mb-1">Cancellation Policy:</strong>
              {canCancelWithoutFee ? (
                <span>You can cancel this appointment without any fees.</span>
              ) : (
                <span className="text-orange-700">
                  Cancelling less than 24 hours before your appointment will result in a $50 no-show fee.
                </span>
              )}
              <div className="mt-2 flex gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleCancel}
                  disabled={cancelling}
                >
                  {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowCancelWarning(false)}
                >
                  Keep Appointment
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Session notes for completed appointments */}
        {appointment.status === 'completed' && (
          <div className="pt-2 border-t border-bloom-sage/20">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              disabled
            >
              View Session Notes (Coming Soon)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Payment Card Component
function PaymentCard({ payment }: { payment: PaymentRecord }) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-white">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium text-bloom-dark">
            ${payment.amount.toFixed(2)}
          </p>
          <p className="text-sm text-bloom-dark/60 mt-1">
            {payment.type === 'no_show_fee' ? 'No-show fee' : 'Appointment payment'}
          </p>
          {payment.appointment && (
            <p className="text-sm text-bloom-dark/60">
              {new Date(payment.appointment.date).toLocaleDateString()}
            </p>
          )}
          <p className="text-xs text-bloom-dark/50 mt-1">
            {new Date(payment.date).toLocaleDateString()}
          </p>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          payment.status === 'charged' 
            ? 'bg-green-100 text-green-800'
            : payment.status === 'refunded'
            ? 'bg-blue-100 text-blue-800'
            : payment.status === 'failed'
            ? 'bg-red-100 text-red-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {payment.status}
        </span>
      </div>
    </div>
  );
}