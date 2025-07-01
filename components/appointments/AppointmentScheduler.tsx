'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Script from 'next/script';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { awardAchievement } from '@/lib/achievements';
import { getUserPaymentMethods, createAppointmentPaymentIntent } from '@/lib/payment-management';
import PaymentRequiredModal from './PaymentRequiredModal';

interface AppointmentSchedulerProps {
  calendlyUrl?: string;
  appointmentType: 'consultation' | 'therapy' | 'workshop-followup';
  onScheduled?: (event: any) => void;
}

declare global {
  interface Window {
    Calendly: any;
  }
}

export default function AppointmentScheduler({ 
  calendlyUrl = 'https://calendly.com/bloom-psychology',
  appointmentType = 'consultation',
  onScheduled 
}: AppointmentSchedulerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showScheduler, setShowScheduler] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const { user } = useAuth();

  // Appointment type configurations
  const appointmentConfigs = {
    consultation: {
      title: 'Book a Consultation',
      description: 'Schedule a 30-minute consultation with Dr. Jana',
      icon: '💬',
      color: 'from-bloompink to-bloom-sage',
      calendlyEvent: '/initial-consultation'
    },
    therapy: {
      title: 'Schedule Therapy Session',
      description: 'Book a 50-minute therapy session',
      icon: '🌸',
      color: 'from-bloom-sage to-bloom-accent',
      calendlyEvent: '/therapy-session'
    },
    'workshop-followup': {
      title: 'Workshop Follow-up',
      description: 'Schedule a follow-up discussion after your workshop',
      icon: '🤝',
      color: 'from-bloom-accent to-bloompink',
      calendlyEvent: '/workshop-followup'
    }
  };

  const config = appointmentConfigs[appointmentType];

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch appointments
      const { data, error } = await supabase
        .from('appointment_data')
        .select('*')
        .eq('user_id', user.id)
        .order('appointment_date', { ascending: false });

      if (!error && data) {
        setAppointments(data);
      }

      // Fetch payment methods
      const methods = await getUserPaymentMethods(user.id);
      setPaymentMethods(methods);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const openCalendly = async () => {
    if (!user) return;

    // Check if user has payment method
    if (paymentMethods.length === 0) {
      setShowPaymentModal(true);
      return;
    }

    // Proceed with Calendly booking
    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: `${calendlyUrl}${config.calendlyEvent}`,
        prefill: {
          email: user.email,
          name: user.user_metadata?.full_name || '',
          customAnswers: {
            a1: user.id // Pass user ID for tracking
          }
        },
        utm: {
          utmSource: 'bloom-platform',
          utmMedium: 'dashboard',
          utmCampaign: appointmentType
        }
      });
    }
  };

  const handleCalendlyEvent = async (e: MessageEvent) => {
    if (e.origin !== 'https://calendly.com') return;

    if (e.data.event === 'calendly.event_scheduled') {
      // Save appointment to database
      try {
        const appointmentData = {
          user_id: user?.id,
          appointment_type: appointmentType,
          calendly_event_uri: e.data.payload.event.uri,
          calendly_invitee_uri: e.data.payload.invitee.uri,
          appointment_date: e.data.payload.event.start_time,
          appointment_end: e.data.payload.event.end_time,
          status: 'scheduled',
          metadata: {
            event_name: e.data.payload.event.name,
            location: e.data.payload.event.location,
            questions_answers: e.data.payload.questions_and_answers
          }
        };

        const { error } = await supabase
          .from('appointment_data')
          .insert(appointmentData);

        if (!error) {
          // Get the appointment ID from the insert
          const { data: newAppointment } = await supabase
            .from('appointment_data')
            .select('id')
            .eq('calendly_event_uri', e.data.payload.event.uri)
            .single();

          if (newAppointment) {
            // Authorize payment for the appointment
            try {
              await fetch('/api/payments/create-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  appointmentId: newAppointment.id,
                  amount: 150, // Default session fee
                  description: `${appointmentType} appointment`
                })
              });
            } catch (paymentError) {
              console.error('Error authorizing payment:', paymentError);
              // Note: appointment is still created even if payment fails
            }
          }

          // Award achievement for first appointment
          if (appointments.length === 0) {
            await fetch('/api/achievements', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                achievementId: 'appointment_scheduled'
              })
            });
          }

          // Refresh appointments list
          fetchUserData();

          // Call parent callback
          if (onScheduled) {
            onScheduled(e.data.payload);
          }
        }
      } catch (error) {
        console.error('Error saving appointment:', error);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('message', handleCalendlyEvent);
    return () => window.removeEventListener('message', handleCalendlyEvent);
  }, [user, appointments]);

  const upcomingAppointments = appointments.filter(
    apt => new Date(apt.appointment_date) > new Date() && apt.status === 'scheduled'
  );

  const pastAppointments = appointments.filter(
    apt => new Date(apt.appointment_date) <= new Date() || apt.status === 'completed'
  );

  return (
    <>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        onLoad={() => setIsLoading(false)}
      />

      <div className="space-y-6">
        {/* Schedule New Appointment Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className={`bg-gradient-to-r ${config.color} p-6 text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-semibold flex items-center gap-3">
                  <span className="text-3xl">{config.icon}</span>
                  {config.title}
                </h3>
                <p className="mt-2 opacity-90">{config.description}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {upcomingAppointments.length > 0 && (
              <div className="mb-6 p-4 bg-bloom-sage-50 rounded-lg">
                <p className="text-sm text-bloom-dark/70 mb-2">
                  You have {upcomingAppointments.length} upcoming appointment{upcomingAppointments.length > 1 ? 's' : ''}
                </p>
                <div className="space-y-2">
                  {upcomingAppointments.slice(0, 2).map((apt, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="font-medium">
                        {new Date(apt.appointment_date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </span>
                      <span className="text-bloom-sage">
                        {apt.appointment_type.replace('-', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={openCalendly}
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-lg font-medium transition-all
                ${isLoading 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r ' + config.color + ' text-white hover:shadow-lg transform hover:scale-[1.02]'
                }`}
            >
              {isLoading ? 'Loading scheduler...' : 'Schedule Appointment'}
            </button>

            <div className="mt-4 text-center text-sm text-bloom-dark/60">
              <p>Available times are shown in your local timezone</p>
            </div>
          </div>
        </motion.div>

        {/* Appointment History */}
        {appointments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h4 className="text-lg font-semibold text-bloom-dark mb-4">
              Appointment History
            </h4>

            <div className="space-y-3">
              {/* Upcoming */}
              {upcomingAppointments.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-bloom-dark/70 mb-2">Upcoming</h5>
                  {upcomingAppointments.map((apt, idx) => (
                    <AppointmentCard key={idx} appointment={apt} isUpcoming={true} />
                  ))}
                </div>
              )}

              {/* Past */}
              {pastAppointments.length > 0 && (
                <div className="mt-6">
                  <h5 className="text-sm font-medium text-bloom-dark/70 mb-2">Past Appointments</h5>
                  {pastAppointments.slice(0, 3).map((apt, idx) => (
                    <AppointmentCard key={idx} appointment={apt} isUpcoming={false} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Tips Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-bloom-sage-50 rounded-xl p-6"
        >
          <h4 className="font-semibold text-bloom-dark mb-3 flex items-center gap-2">
            <span>💡</span> Appointment Tips
          </h4>
          <ul className="space-y-2 text-sm text-bloom-dark/70">
            <li className="flex items-start gap-2">
              <span className="text-bloom-sage mt-0.5">•</span>
              <span>Find a quiet, private space for your session</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-bloom-sage mt-0.5">•</span>
              <span>Test your internet connection and camera beforehand</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-bloom-sage mt-0.5">•</span>
              <span>Have a notebook ready to jot down insights</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-bloom-sage mt-0.5">•</span>
              <span>Allow yourself 5 minutes before to center yourself</span>
            </li>
          </ul>
        </motion.div>

        {/* Payment Required Modal */}
        <PaymentRequiredModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onPaymentAdded={() => {
            setShowPaymentModal(false);
            fetchUserData(); // Refresh payment methods
            // Automatically open Calendly after payment is added
            setTimeout(() => openCalendly(), 500);
          }}
          appointmentType={config.title}
        />
      </div>
    </>
  );
}

// Appointment Card Component
function AppointmentCard({ 
  appointment, 
  isUpcoming 
}: { 
  appointment: any; 
  isUpcoming: boolean;
}) {
  const appointmentDate = new Date(appointment.appointment_date);
  const isPast = appointmentDate < new Date();

  return (
    <div className={`p-4 rounded-lg border ${
      isUpcoming ? 'border-bloom-sage bg-bloom-sage-50/30' : 'border-gray-200 bg-gray-50'
    } mb-3`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium text-bloom-dark">
            {appointment.appointment_type.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
          </p>
          <p className="text-sm text-bloom-dark/60 mt-1">
            {appointmentDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <p className="text-sm text-bloom-dark/60">
            {appointmentDate.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit'
            })}
          </p>
        </div>
        <div className="text-right">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            appointment.status === 'scheduled' 
              ? 'bg-green-100 text-green-800'
              : appointment.status === 'completed'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {appointment.status}
          </span>
          {isUpcoming && appointment.metadata?.location && (
            <p className="text-xs text-bloom-dark/50 mt-2">
              {appointment.metadata.location}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}