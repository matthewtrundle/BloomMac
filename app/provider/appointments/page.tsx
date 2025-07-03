'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { markAppointmentNoShow, processNoShow } from '@/lib/no-show-management';
import { sendAppointmentReminders } from '@/lib/reminder-system';
import Link from 'next/link';

interface DetailedAppointment {
  id: string;
  user_id: string;
  appointment_date: string;
  appointment_type: string;
  status: string;
  payment_status: string;
  payment_amount?: number;
  no_show_fee_charged: boolean;
  no_show_fee_amount?: number;
  reminder_24h_sent: boolean;
  reminder_2h_sent: boolean;
  confirmation_received: boolean;
  notes?: string;
  metadata?: any;
  created_at: string;
  user_profiles: {
    first_name: string;
    last_name: string;
    phone: string;
    email?: string;
    postpartum_date?: string;
    number_of_children?: number;
  };
  appointment_payments?: {
    id: string;
    amount: number;
    status: string;
    created_at: string;
  }[];
}

export default function ProviderAppointmentsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [appointments, setAppointments] = useState<DetailedAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<DetailedAppointment | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [stats, setStats] = useState({
    total: 0,
    scheduled: 0,
    completed: 0,
    noShows: 0,
    cancelled: 0,
    revenue: 0,
    noShowFees: 0
  });

  // Check provider role (in production, implement proper role checking)
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user, filterStatus, dateRange]);

  const fetchAppointments = async () => {
    if (!user) return;

    setLoading(true);
    try {
      let query = supabase
        .from('appointment_data')
        .select(`
          *,
          user_profiles!inner(
            first_name,
            last_name,
            phone,
            email,
            postpartum_date,
            number_of_children
          ),
          appointment_payments(
            id,
            amount,
            status,
            created_at
          )
        `)
        .gte('appointment_date', `${dateRange.start}T00:00:00`)
        .lte('appointment_date', `${dateRange.end}T23:59:59`)
        .order('appointment_date', { ascending: false });

      // Apply status filter
      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;

      if (!error && data) {
        setAppointments(data);
        calculateStats(data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (appointmentData: DetailedAppointment[]) => {
    const stats = appointmentData.reduce((acc, apt) => {
      acc.total++;
      
      switch (apt.status) {
        case 'scheduled':
          acc.scheduled++;
          break;
        case 'completed':
          acc.completed++;
          acc.revenue += apt.payment_amount || 0;
          break;
        case 'no_show':
          acc.noShows++;
          if (apt.no_show_fee_charged && apt.no_show_fee_amount) {
            acc.noShowFees += apt.no_show_fee_amount;
          }
          break;
        case 'cancelled':
          acc.cancelled++;
          break;
      }
      
      return acc;
    }, {
      total: 0,
      scheduled: 0,
      completed: 0,
      noShows: 0,
      cancelled: 0,
      revenue: 0,
      noShowFees: 0
    });

    setStats(stats);
  };

  const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
    try {
      if (newStatus === 'no_show') {
        // Use the no-show processing function
        const result = await processNoShow(appointmentId);
        if (!result.success) {
          alert(`Failed to process no-show: ${result.error}`);
          return;
        }
      } else {
        // Regular status update
        const { error } = await supabase
          .from('appointment_data')
          .update({ 
            status: newStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', appointmentId);

        if (error) {
          throw error;
        }
      }

      // Refresh appointments
      fetchAppointments();
      setSelectedAppointment(null);
      
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Failed to update appointment status');
    }
  };

  const handleSendReminder = async (appointmentId: string, type: '24hour' | '2hour') => {
    try {
      const result = await sendAppointmentReminders(appointmentId, type);
      
      if (result.success) {
        alert(`${type === '24hour' ? '24-hour' : '2-hour'} reminder sent successfully`);
        fetchAppointments();
      } else {
        alert(`Failed to send reminder: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending reminder:', error);
      alert('Failed to send reminder');
    }
  };

  const handleAddNote = async (appointmentId: string, note: string) => {
    try {
      const { error } = await supabase
        .from('appointment_data')
        .update({ 
          notes: note,
          updated_at: new Date().toISOString()
        })
        .eq('id', appointmentId);

      if (!error) {
        fetchAppointments();
        alert('Note added successfully');
      }
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Failed to add note');
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const fullName = `${apt.user_profiles.first_name} ${apt.user_profiles.last_name}`.toLowerCase();
      return fullName.includes(searchLower) || 
             apt.user_profiles.phone?.includes(searchTerm) ||
             apt.appointment_type.includes(searchLower);
    }
    return true;
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bloom-sage mx-auto"></div>
          <p className="mt-4 text-bloom-dark/60">Loading appointments...</p>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-playfair text-bloom-dark">Appointment Management</h1>
              <p className="text-bloom-dark/60 mt-1">Comprehensive appointment control center</p>
            </div>
            <Link
              href="/provider/dashboard"
              className="px-4 py-2 bg-bloom-sage text-white rounded-lg hover:bg-bloom-sage/90 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-bloom-dark/60">Total</p>
            <p className="text-2xl font-bold text-bloom-dark">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-bloom-dark/60">Scheduled</p>
            <p className="text-2xl font-bold text-green-600">{stats.scheduled}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-bloom-dark/60">Completed</p>
            <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-bloom-dark/60">No-Shows</p>
            <p className="text-2xl font-bold text-red-600">{stats.noShows}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-bloom-dark/60">Cancelled</p>
            <p className="text-2xl font-bold text-gray-600">{stats.cancelled}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-bloom-dark/60">Revenue</p>
            <p className="text-2xl font-bold text-bloom-dark">${(stats.revenue / 100).toFixed(0)}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-bloom-dark/60">No-Show Fees</p>
            <p className="text-2xl font-bold text-orange-600">${(stats.noShowFees / 100).toFixed(0)}</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="container mx-auto px-6 py-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-bloom-sage/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-bloom-sage"
              />
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-bloom-dark/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-bloom-sage/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-bloom-sage"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="no_show">No-Show</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Date Range */}
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="px-4 py-2 border border-bloom-sage/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-bloom-sage"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="px-4 py-2 border border-bloom-sage/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-bloom-sage"
            />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="container mx-auto px-6 pb-12">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Appointments List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-bloom-sage/10">
                <h2 className="text-xl font-semibold text-bloom-dark">
                  Appointments ({filteredAppointments.length})
                </h2>
              </div>
              
              <div className="max-h-[600px] overflow-y-auto">
                {filteredAppointments.length > 0 ? (
                  <div className="divide-y divide-bloom-sage/10">
                    {filteredAppointments.map((appointment) => (
                      <motion.div
                        key={appointment.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`p-4 hover:bg-bloom-sage-50/20 cursor-pointer transition-colors ${
                          selectedAppointment?.id === appointment.id ? 'bg-bloom-sage-50' : ''
                        }`}
                        onClick={() => setSelectedAppointment(appointment)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-medium text-bloom-dark">
                                {appointment.user_profiles.first_name} {appointment.user_profiles.last_name}
                              </h3>
                              <StatusBadge status={appointment.status} />
                              {appointment.confirmation_received && (
                                <span className="text-green-600 text-sm">✓ Confirmed</span>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-sm text-bloom-dark/60">
                              <p>📅 {new Date(appointment.appointment_date).toLocaleDateString()}</p>
                              <p>⏰ {new Date(appointment.appointment_date).toLocaleTimeString('en-US', { 
                                hour: 'numeric', 
                                minute: '2-digit' 
                              })}</p>
                              <p>📱 {appointment.user_profiles.phone}</p>
                              <p>🏷️ {appointment.appointment_type.replace(/-/g, ' ')}</p>
                            </div>
                            
                            {appointment.payment_amount && (
                              <p className="text-sm mt-2">
                                💳 ${(appointment.payment_amount / 100).toFixed(2)} 
                                <span className="text-bloom-dark/60 ml-2">({appointment.payment_status})</span>
                              </p>
                            )}
                          </div>
                          
                          <div className="ml-4">
                            <svg className="w-5 h-5 text-bloom-dark/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-bloom-dark/60">
                    No appointments found
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              {selectedAppointment ? (
                <motion.div
                  key={selectedAppointment.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-xl shadow-sm p-6 sticky top-6"
                >
                  <h3 className="text-lg font-semibold text-bloom-dark mb-4">
                    Appointment Details
                  </h3>
                  
                  {/* Client Info */}
                  <div className="mb-6">
                    <h4 className="font-medium text-bloom-dark mb-2">Client Information</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-bloom-dark/60">Name:</span>{' '}
                        {selectedAppointment.user_profiles.first_name} {selectedAppointment.user_profiles.last_name}
                      </p>
                      <p>
                        <span className="text-bloom-dark/60">Phone:</span>{' '}
                        {selectedAppointment.user_profiles.phone}
                      </p>
                      {selectedAppointment.user_profiles.email && (
                        <p>
                          <span className="text-bloom-dark/60">Email:</span>{' '}
                          {selectedAppointment.user_profiles.email}
                        </p>
                      )}
                      {selectedAppointment.user_profiles.postpartum_date && (
                        <p>
                          <span className="text-bloom-dark/60">Postpartum:</span>{' '}
                          {new Date(selectedAppointment.user_profiles.postpartum_date).toLocaleDateString()}
                        </p>
                      )}
                      {selectedAppointment.user_profiles.number_of_children !== null && (
                        <p>
                          <span className="text-bloom-dark/60">Children:</span>{' '}
                          {selectedAppointment.user_profiles.number_of_children}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Appointment Info */}
                  <div className="mb-6">
                    <h4 className="font-medium text-bloom-dark mb-2">Appointment Details</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-bloom-dark/60">Type:</span>{' '}
                        {selectedAppointment.appointment_type.replace(/-/g, ' ')}
                      </p>
                      <p>
                        <span className="text-bloom-dark/60">Date:</span>{' '}
                        {new Date(selectedAppointment.appointment_date).toLocaleString()}
                      </p>
                      <p>
                        <span className="text-bloom-dark/60">Status:</span>{' '}
                        <StatusBadge status={selectedAppointment.status} />
                      </p>
                      <p>
                        <span className="text-bloom-dark/60">Payment:</span>{' '}
                        {selectedAppointment.payment_status}
                        {selectedAppointment.payment_amount && 
                          ` - $${(selectedAppointment.payment_amount / 100).toFixed(2)}`
                        }
                      </p>
                    </div>
                  </div>

                  {/* Communication Status */}
                  <div className="mb-6">
                    <h4 className="font-medium text-bloom-dark mb-2">Communication</h4>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2">
                        {selectedAppointment.reminder_24h_sent ? '✅' : '❌'}
                        24-hour reminder
                      </p>
                      <p className="flex items-center gap-2">
                        {selectedAppointment.reminder_2h_sent ? '✅' : '❌'}
                        2-hour reminder
                      </p>
                      <p className="flex items-center gap-2">
                        {selectedAppointment.confirmation_received ? '✅' : '❌'}
                        Client confirmed
                      </p>
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedAppointment.notes && (
                    <div className="mb-6">
                      <h4 className="font-medium text-bloom-dark mb-2">Notes</h4>
                      <p className="text-sm text-bloom-dark/70 bg-bloom-sage-50 p-3 rounded">
                        {selectedAppointment.notes}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-bloom-dark">Quick Actions</h4>
                    
                    {/* Status Update */}
                    {selectedAppointment.status === 'scheduled' && 
                     new Date(selectedAppointment.appointment_date) < new Date() && (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleStatusUpdate(selectedAppointment.id, 'completed')}
                          className="px-3 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Mark Completed
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(selectedAppointment.id, 'no_show')}
                          className="px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Mark No-Show
                        </button>
                      </div>
                    )}
                    
                    {/* Send Reminders */}
                    {selectedAppointment.status === 'scheduled' && 
                     new Date(selectedAppointment.appointment_date) > new Date() && (
                      <div className="grid grid-cols-2 gap-2">
                        {!selectedAppointment.reminder_24h_sent && (
                          <button
                            onClick={() => handleSendReminder(selectedAppointment.id, '24hour')}
                            className="px-3 py-2 bg-bloom-sage text-white text-sm rounded-lg hover:bg-bloom-sage/90 transition-colors"
                          >
                            Send 24h Reminder
                          </button>
                        )}
                        {!selectedAppointment.reminder_2h_sent && (
                          <button
                            onClick={() => handleSendReminder(selectedAppointment.id, '2hour')}
                            className="px-3 py-2 bg-bloom-sage text-white text-sm rounded-lg hover:bg-bloom-sage/90 transition-colors"
                          >
                            Send 2h Reminder
                          </button>
                        )}
                      </div>
                    )}
                    
                    {/* Add Note */}
                    <button
                      onClick={() => {
                        const note = prompt('Add a note:', selectedAppointment.notes || '');
                        if (note !== null) {
                          handleAddNote(selectedAppointment.id, note);
                        }
                      }}
                      className="w-full px-3 py-2 bg-bloom-dark text-white text-sm rounded-lg hover:bg-bloom-dark/90 transition-colors"
                    >
                      {selectedAppointment.notes ? 'Edit Note' : 'Add Note'}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-xl shadow-sm p-6"
                >
                  <div className="text-center text-bloom-dark/60">
                    <svg className="w-16 h-16 mx-auto mb-4 text-bloom-sage/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p>Select an appointment to view details</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    scheduled: { bg: 'bg-green-100', text: 'text-green-800' },
    completed: { bg: 'bg-blue-100', text: 'text-blue-800' },
    no_show: { bg: 'bg-red-100', text: 'text-red-800' },
    cancelled: { bg: 'bg-gray-100', text: 'text-gray-800' }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.cancelled;

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {status.replace('_', ' ')}
    </span>
  );
}