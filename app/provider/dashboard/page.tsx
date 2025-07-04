'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { motion } from 'framer-motion';
import { getNoShowStats, markAppointmentNoShow } from '@/lib/no-show-management-client';
import { getReminderStats } from '@/lib/reminder-system';

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
  user_profiles: {
    first_name: string;
    last_name: string;
    phone: string;
  };
}

interface Stats {
  totalAppointments: number;
  noShows: number;
  noShowRate: number;
  feesCharged: number;
  remindersSent: number;
  confirmationRate: number;
}

export default function ProviderDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = useSupabaseClient();
  
  const [appointments, setAppointments] = useState<ProviderAppointment[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'today' | 'week' | 'month'>('today');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchAppointments();
      fetchStats();
    }
  }, [user, selectedDate, viewMode]);

  const fetchAppointments = async () => {
    if (!user) return;

    setLoading(true);
    try {
      let startDate = selectedDate;
      let endDate = selectedDate;

      // Calculate date range based on view mode
      if (viewMode === 'week') {
        const date = new Date(selectedDate);
        const dayOfWeek = date.getDay();
        const startOfWeek = new Date(date.getTime() - dayOfWeek * 24 * 60 * 60 * 1000);
        const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);
        startDate = startOfWeek.toISOString().split('T')[0];
        endDate = endOfWeek.toISOString().split('T')[0];
      } else if (viewMode === 'month') {
        const date = new Date(selectedDate);
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        startDate = startOfMonth.toISOString().split('T')[0];
        endDate = endOfMonth.toISOString().split('T')[0];
      }

      const { data: appointmentData, error } = await supabase
        .from('appointment_data')
        .select(`
          *,
          user_profiles (
            first_name,
            last_name,
            phone
          )
        `)
        .gte('appointment_date', `${startDate}T00:00:00.000Z`)
        .lte('appointment_date', `${endDate}T23:59:59.999Z`)
        .order('appointment_date', { ascending: true });

      if (!error && appointmentData) {
        setAppointments(appointmentData);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Get date range for stats (last 30 days)
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

      const [noShowResult, reminderResult] = await Promise.all([
        getNoShowStats(undefined, startDate.toISOString(), endDate.toISOString()),
        getReminderStats(startDate.toISOString(), endDate.toISOString())
      ]);

      if (noShowResult.success && reminderResult.success) {
        setStats({
          totalAppointments: noShowResult.stats.totalAppointments,
          noShows: noShowResult.stats.noShows,
          noShowRate: noShowResult.stats.noShowRate,
          feesCharged: noShowResult.stats.feesCharged,
          remindersSent: reminderResult.stats.remindersSent,
          confirmationRate: reminderResult.stats.confirmationRate
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleMarkNoShow = async (appointmentId: string) => {
    const confirmed = window.confirm('Mark this appointment as a no-show and charge the fee?');
    if (!confirmed) return;

    try {
      const result = await markAppointmentNoShow(appointmentId, true, 50);
      
      if (result.success) {
        // Refresh appointments
        fetchAppointments();
        fetchStats();
        alert('Appointment marked as no-show and fee charged successfully');
      } else {
        alert(`Failed to process no-show: ${result.error}`);
      }
    } catch (error) {
      console.error('Error marking no-show:', error);
      alert('Failed to mark appointment as no-show');
    }
  };

  const handleMarkCompleted = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointment_data')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', appointmentId);

      if (!error) {
        fetchAppointments();
        alert('Appointment marked as completed');
      }
    } catch (error) {
      console.error('Error marking completed:', error);
      alert('Failed to mark appointment as completed');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bloom-sage mx-auto"></div>
          <p className="mt-4 text-bloom-dark/60">Loading provider dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const todayAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.appointment_date);
    const today = new Date();
    return aptDate.toDateString() === today.toDateString();
  });

  const upcomingAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.appointment_date);
    const now = new Date();
    return aptDate > now && apt.status === 'scheduled';
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-bloom-sage/10">
        <div className="container mx-auto px-6 py-6">
          <h1 className="text-2xl font-playfair text-bloom-dark">Provider Dashboard</h1>
          <p className="text-bloom-dark/60 mt-1">Manage your appointments and client interactions</p>
        </div>
      </div>

      {/* Controls */}
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex space-x-1 bg-bloom-sage-50/30 rounded-lg p-1">
            {[
              { id: 'today', label: 'Today' },
              { id: 'week', label: 'Week' },
              { id: 'month', label: 'Month' }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as typeof viewMode)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  viewMode === mode.id
                    ? 'bg-white text-bloom-dark shadow-sm'
                    : 'text-bloom-dark/60 hover:text-bloom-dark'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {/* Date Picker */}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-bloom-sage/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-bloom-sage"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Stats Cards */}
          <div className="lg:col-span-4 grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              title="Today's Appointments"
              value={todayAppointments.length}
              icon="📅"
              color="bg-bloom-sage"
            />
            <StatsCard
              title="Upcoming"
              value={upcomingAppointments.length}
              icon="⏰"
              color="bg-bloom-accent"
            />
            <StatsCard
              title="No-Show Rate"
              value={`${stats?.noShowRate || 0}%`}
              icon="🚫"
              color="bg-red-500"
            />
            <StatsCard
              title="Confirmation Rate"
              value={`${stats?.confirmationRate || 0}%`}
              icon="✅"
              color="bg-green-500"
            />
          </div>

          {/* Appointments List */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-bloom-dark mb-6">
                Appointments ({viewMode})
              </h2>
              
              {appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <AppointmentRow
                      key={appointment.id}
                      appointment={appointment}
                      onMarkNoShow={handleMarkNoShow}
                      onMarkCompleted={handleMarkCompleted}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-bloom-dark/60">No appointments for selected period</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-bloom-dark mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={fetchAppointments}
                  className="w-full p-3 text-left hover:bg-bloom-sage-50 rounded-lg transition-colors"
                >
                  🔄 Refresh Appointments
                </button>
                <button
                  onClick={fetchStats}
                  className="w-full p-3 text-left hover:bg-bloom-sage-50 rounded-lg transition-colors"
                >
                  📊 Update Statistics
                </button>
                <a
                  href="/provider/settings"
                  className="block w-full p-3 text-left hover:bg-bloom-sage-50 rounded-lg transition-colors"
                >
                  ⚙️ Provider Settings
                </a>
              </div>
            </motion.div>

            {/* Recent Stats */}
            {stats && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-lg font-semibold text-bloom-dark mb-4">30-Day Statistics</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Total Appointments:</span>
                    <span className="font-medium">{stats.totalAppointments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>No-Shows:</span>
                    <span className="font-medium">{stats.noShows}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fees Collected:</span>
                    <span className="font-medium">{stats.feesCharged}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reminders Sent:</span>
                    <span className="font-medium">{stats.remindersSent}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Stats Card Component
function StatsCard({ 
  title, 
  value, 
  icon, 
  color 
}: { 
  title: string; 
  value: string | number; 
  icon: string; 
  color: string; 
}) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-bloom-dark/60">{title}</p>
          <p className="text-2xl font-bold text-bloom-dark">{value}</p>
        </div>
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white text-xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Appointment Row Component
function AppointmentRow({ 
  appointment, 
  onMarkNoShow, 
  onMarkCompleted 
}: { 
  appointment: ProviderAppointment;
  onMarkNoShow: (id: string) => void;
  onMarkCompleted: (id: string) => void;
}) {
  const appointmentDate = new Date(appointment.appointment_date);
  const isPast = appointmentDate < new Date();
  const isToday = appointmentDate.toDateString() === new Date().toDateString();

  return (
    <div className={`p-4 border rounded-lg ${
      isToday ? 'border-bloom-sage bg-bloom-sage-50/30' : 'border-gray-200'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-medium text-bloom-dark">
              {appointment.user_profiles?.first_name} {appointment.user_profiles?.last_name}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              appointment.status === 'scheduled' 
                ? 'bg-green-100 text-green-800'
                : appointment.status === 'completed'
                ? 'bg-blue-100 text-blue-800'
                : appointment.status === 'no_show'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {appointment.status.replace('_', ' ')}
            </span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-2 text-sm text-bloom-dark/60">
            <p>
              📅 {appointmentDate.toLocaleDateString()} at {appointmentDate.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit' 
              })}
            </p>
            <p>🏷️ {appointment.appointment_type.replace(/-/g, ' ')}</p>
            <p>💳 Payment: {appointment.payment_status}</p>
            <p>
              {appointment.reminder_sent ? '✅' : '❌'} Reminder sent
              {appointment.confirmation_received ? ' | ✅ Confirmed' : ' | ⏳ Pending'}
            </p>
          </div>

          {appointment.no_show_fee_charged && (
            <p className="text-sm text-red-600 mt-2">No-show fee charged</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 ml-4">
          {appointment.status === 'scheduled' && isPast && (
            <>
              <button
                onClick={() => onMarkCompleted(appointment.id)}
                className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
              >
                Complete
              </button>
              <button
                onClick={() => onMarkNoShow(appointment.id)}
                className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
              >
                No-Show
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}