'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Script from 'next/script';
import PaymentRequiredModal from './PaymentRequiredModal';
import { SupabaseClient } from '@supabase/supabase-js';

interface AppointmentSchedulerProps {
  user: any;
  supabase: SupabaseClient;
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
  user,
  supabase,
  calendlyUrl = 'https://calendly.com/bloom-psychology',
  appointmentType = 'consultation',
  onScheduled 
}: AppointmentSchedulerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

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
      fetchComponentData();
    }
  }, [user]);

  const fetchComponentData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('appointment_data')
        .select('*')
        .eq('user_id', user.id)
        .order('appointment_date', { ascending: false });

      if (error) throw error;
      setAppointments(data || []);

      const { data: methods, error: methodsError } = await supabase
        .from('stripe_payment_methods')
        .select('id, card_brand, card_last4, is_default')
        .eq('user_id', user.id);
      
      if (methodsError) throw methodsError;
      setPaymentMethods(methods || []);

    } catch (error) {
      console.error('Error fetching scheduler data:', error);
    }
  };

  const openCalendly = async () => {
    if (!user) {
      console.error("Cannot open Calendly: user is not authenticated.");
      return;
    }

    if (paymentMethods.length === 0) {
      setShowPaymentModal(true);
      return;
    }

    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: `${calendlyUrl}${config.calendlyEvent}`,
        prefill: {
          email: user.email,
          name: user.user_metadata?.full_name || `${user.user_metadata?.first_name} ${user.user_metadata?.last_name}` || '',
          customAnswers: {
            a1: user.id
          }
        },
        utm: {
          utmSource: 'bloom-platform',
          utmMedium: 'dashboard',
          utmCampaign: appointmentType
        }
      });
    } else {
      console.error("Calendly script not loaded.");
    }
  };

  const handleCalendlyEvent = async (e: MessageEvent) => {
    if (e.origin !== 'https://calendly.com' || !e.data.event) return;

    if (e.data.event === 'calendly.event_scheduled') {
      try {
        const { error } = await supabase.rpc('create_appointment_from_calendly', {
          p_user_id: user.id,
          p_appointment_type: appointmentType,
          p_calendly_event_uri: e.data.payload.event.uri,
          p_calendly_invitee_uri: e.data.payload.invitee.uri,
          p_appointment_date: e.data.payload.event.start_time,
          p_appointment_end: e.data.payload.event.end_time,
          p_metadata: {
            event_name: e.data.payload.event.name,
            location: e.data.payload.event.location,
            questions_answers: e.data.payload.questions_and_answers
          }
        });

        if (error) throw error;

        await fetchComponentData();

        if (onScheduled) {
          onScheduled(e.data.payload);
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

  // Diagnostic Logging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('AppointmentScheduler Props:', { user, supabase, appointmentType });
    }
  }, [user, supabase, appointmentType]);

  if (!user) {
    return (
        <div className="p-6 text-center">
            <p className="text-bloom-dark/60">Please log in to schedule an appointment.</p>
        </div>
    );
  }

  return (
    <>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          console.error("Failed to load Calendly script.");
        }}
      />

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className={`bg-gradient-to-r ${config.color} p-6 text-white`}>
            <h3 className="text-2xl font-semibold flex items-center gap-3">
              <span className="text-3xl">{config.icon}</span>
              {config.title}
            </h3>
            <p className="mt-2 opacity-90">{config.description}</p>
          </div>

          <div className="p-6">
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

        <PaymentRequiredModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onPaymentAdded={() => {
            setShowPaymentModal(false);
            fetchComponentData();
            setTimeout(() => openCalendly(), 500);
          }}
          appointmentType={config.title}
        />
      </div>
    </>
  );
}