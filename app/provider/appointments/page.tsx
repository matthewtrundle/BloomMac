'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { motion } from 'framer-motion';

interface ProviderAppointment {
  id: string;
  user_id: string;
  appointment_date: string;
  appointment_type: string;
  status: string;
  payment_status: string;
  no_show_fee_charged: boolean;
  reminder_sent: boolean;
  confirmation_received: boolean;
  first_name: string;
  last_name: string;
  phone: string;
}

export default function ProviderAppointmentsPage() {
  const { user, loading: authLoading } = useAuth();
  const supabase = useSupabaseClient();
  const [appointments, setAppointments] = useState<ProviderAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('appointment_data')
        .select(`
          *,
          user_profiles (
            first_name,
            last_name,
            phone
          )
        `)
        .eq('therapist_id', user.id)
        .order('appointment_date', { ascending: false });

      if (error) {
        console.error('Error fetching appointments:', error);
      } else {
        setAppointments(data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

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
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h1 className="text-3xl font-playfair text-bloom-dark mb-8">Your Appointments</h1>
          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map(appointment => (
                <div key={appointment.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="font-medium text-lg">{appointment.first_name} {appointment.last_name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          appointment.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          appointment.status === 'no_show' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>📅 {new Date(appointment.appointment_date).toLocaleString()}</p>
                        <p>🏷️ {appointment.appointment_type}</p>
                        <p>💳 Payment: {appointment.payment_status}</p>
                        <p>
                          {appointment.reminder_sent ? '✅' : '❌'} Reminder sent
                          {appointment.confirmation_received ? ' | ✅ Confirmed' : ' | ⏳ Pending'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No appointments found.</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
