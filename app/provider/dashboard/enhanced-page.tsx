'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

interface DashboardStats {
  todayAppointments: number;
  weekAppointments: number;
  monthRevenue: number;
  noShowRate: number;
  averageSessionsPerClient: number;
  clientRetentionRate: number;
  upcomingToday: any[];
  recentNoShows: any[];
  needsAttention: any[];
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: string;
  client: string;
}

export default function EnhancedProviderDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<'overview' | 'calendar' | 'analytics'>('overview');
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [chartData, setChartData] = useState({
    revenue: [],
    appointments: [],
    clientTypes: []
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch multiple data sets in parallel
      const [
        todayAppts,
        weekAppts,
        monthAppts,
        noShows,
        allClients
      ] = await Promise.all([
        // Today's appointments
        supabase
          .from('appointment_data')
          .select('*, user_profiles(*)')
          .gte('appointment_date', new Date().toISOString().split('T')[0])
          .lt('appointment_date', new Date(Date.now() + 86400000).toISOString().split('T')[0])
          .order('appointment_date', { ascending: true }),
        
        // This week's appointments
        supabase
          .from('appointment_data')
          .select('*')
          .gte('appointment_date', getWeekStart())
          .lte('appointment_date', getWeekEnd()),
        
        // This month's completed appointments with payments
        supabase
          .from('appointment_data')
          .select('*, appointment_payments(*)')
          .eq('status', 'completed')
          .gte('appointment_date', getMonthStart())
          .lte('appointment_date', getMonthEnd()),
        
        // Recent no-shows
        supabase
          .from('appointment_data')
          .select('*, user_profiles(*)')
          .eq('status', 'no_show')
          .order('appointment_date', { ascending: false })
          .limit(5),
        
        // All clients for retention calculation
        supabase
          .from('appointment_data')
          .select('user_id, appointment_date, status')
          .order('appointment_date', { ascending: false })
      ]);

      // Calculate statistics
      const todayCount = todayAppts.data?.length || 0;
      const weekCount = weekAppts.data?.length || 0;
      
      // Calculate monthly revenue
      const monthRevenue = monthAppts.data?.reduce((sum, apt) => {
        const payment = apt.appointment_payments?.[0];
        return sum + (payment?.amount || 0);
      }, 0) || 0;
      
      // Calculate no-show rate (last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);
      const recentAppointments = allClients.data?.filter(apt => 
        new Date(apt.appointment_date) > thirtyDaysAgo
      ) || [];
      const recentNoShows = recentAppointments.filter(apt => apt.status === 'no_show').length;
      const noShowRate = recentAppointments.length > 0 
        ? (recentNoShows / recentAppointments.length) * 100 
        : 0;
      
      // Calculate client metrics
      const clientMetrics = calculateClientMetrics(allClients.data || []);
      
      // Identify appointments needing attention
      const needsAttention = todayAppts.data?.filter(apt => 
        !apt.confirmation_received && 
        apt.status === 'scheduled' &&
        new Date(apt.appointment_date) > new Date()
      ) || [];
      
      setStats({
        todayAppointments: todayCount,
        weekAppointments: weekCount,
        monthRevenue: monthRevenue / 100,
        noShowRate: Math.round(noShowRate),
        averageSessionsPerClient: clientMetrics.averageSessions,
        clientRetentionRate: clientMetrics.retentionRate,
        upcomingToday: todayAppts.data?.filter(apt => 
          apt.status === 'scheduled' && new Date(apt.appointment_date) > new Date()
        ) || [],
        recentNoShows: noShows.data || [],
        needsAttention
      });
      
      // Prepare calendar events
      if (weekAppts.data) {
        const events = weekAppts.data.map(apt => ({
          id: apt.id,
          title: apt.appointment_type.replace(/-/g, ' '),
          start: new Date(apt.appointment_date),
          end: new Date(new Date(apt.appointment_date).getTime() + 3600000), // 1 hour
          status: apt.status,
          client: `${apt.user_profiles?.first_name || ''} ${apt.user_profiles?.last_name || ''}`
        }));
        setCalendarEvents(events);
      }
      
      // Prepare chart data
      await prepareChartData();
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateClientMetrics = (appointments: any[]) => {
    const clientSessions: { [key: string]: number } = {};
    const uniqueClients = new Set<string>();
    const returningClients = new Set<string>();
    
    appointments.forEach(apt => {
      uniqueClients.add(apt.user_id);
      clientSessions[apt.user_id] = (clientSessions[apt.user_id] || 0) + 1;
      
      if (clientSessions[apt.user_id] > 1) {
        returningClients.add(apt.user_id);
      }
    });
    
    const totalSessions = Object.values(clientSessions).reduce((sum, count) => sum + count, 0);
    const averageSessions = uniqueClients.size > 0 
      ? Math.round(totalSessions / uniqueClients.size * 10) / 10 
      : 0;
    
    const retentionRate = uniqueClients.size > 0 
      ? Math.round((returningClients.size / uniqueClients.size) * 100) 
      : 0;
    
    return { averageSessions, retentionRate };
  };

  const prepareChartData = async () => {
    // Revenue over last 6 months
    const revenueData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const { data } = await supabase
        .from('appointment_payments')
        .select('amount')
        .eq('status', 'captured')
        .gte('created_at', monthStart.toISOString())
        .lte('created_at', monthEnd.toISOString());
      
      const total = data?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
      
      revenueData.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
        revenue: total / 100
      });
    }
    
    // Appointment types distribution
    const { data: typeData } = await supabase
      .from('appointment_data')
      .select('appointment_type')
      .eq('status', 'completed')
      .gte('appointment_date', getMonthStart());
    
    const typeCounts: { [key: string]: number } = {};
    typeData?.forEach(apt => {
      typeCounts[apt.appointment_type] = (typeCounts[apt.appointment_type] || 0) + 1;
    });
    
    const clientTypes = Object.entries(typeCounts).map(([type, count]) => ({
      name: type.replace(/-/g, ' '),
      value: count
    }));
    
    setChartData({
      revenue: revenueData,
      appointments: [], // TODO: Add appointment trends
      clientTypes
    });
  };

  const getWeekStart = () => {
    const date = new Date();
    const day = date.getDay();
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff)).toISOString().split('T')[0];
  };

  const getWeekEnd = () => {
    const date = new Date();
    const day = date.getDay();
    const diff = date.getDate() + (6 - day);
    return new Date(date.setDate(diff)).toISOString().split('T')[0];
  };

  const getMonthStart = () => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
  };

  const getMonthEnd = () => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bloom-sage mx-auto"></div>
          <p className="mt-4 text-bloom-dark/60">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !stats) return null;

  const COLORS = ['#8B9B7A', '#E8A0A6', '#D4A574', '#94A3B8'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-bloom-sage/10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-playfair text-bloom-dark">Provider Dashboard</h1>
              <p className="text-bloom-dark/60 mt-1">Welcome back, Dr. Jana</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/provider/appointments"
                className="px-4 py-2 bg-bloom-sage text-white rounded-lg hover:bg-bloom-sage/90 transition-colors"
              >
                Manage Appointments
              </Link>
              <button
                onClick={() => {
                  supabase.auth.signOut();
                  router.push('/');
                }}
                className="px-4 py-2 text-bloom-dark/70 hover:text-bloom-dark transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="container mx-auto px-6 py-4">
        <div className="flex space-x-1 bg-white/50 rounded-lg p-1 max-w-md">
          {['overview', 'calendar', 'analytics'].map((view) => (
            <button
              key={view}
              onClick={() => setSelectedView(view as any)}
              className={`flex-1 px-4 py-2 rounded-md transition-colors capitalize ${
                selectedView === view
                  ? 'bg-white text-bloom-dark shadow-sm'
                  : 'text-bloom-dark/60 hover:text-bloom-dark'
              }`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-12">
        <AnimatePresence mode="wait">
          {selectedView === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                <MetricCard
                  title="Today"
                  value={stats.todayAppointments}
                  icon="📅"
                  trend="+2 from yesterday"
                  color="bg-bloom-sage"
                />
                <MetricCard
                  title="This Week"
                  value={stats.weekAppointments}
                  icon="📊"
                  trend={`${stats.weekAppointments} scheduled`}
                  color="bg-bloom-accent"
                />
                <MetricCard
                  title="Month Revenue"
                  value={`$${stats.monthRevenue.toLocaleString()}`}
                  icon="💰"
                  trend="+15% from last month"
                  color="bg-green-500"
                />
                <MetricCard
                  title="No-Show Rate"
                  value={`${stats.noShowRate}%`}
                  icon="🚫"
                  trend="Target: <10%"
                  color="bg-red-500"
                />
                <MetricCard
                  title="Avg Sessions"
                  value={stats.averageSessionsPerClient}
                  icon="👥"
                  trend="Per client"
                  color="bg-blue-500"
                />
                <MetricCard
                  title="Retention"
                  value={`${stats.clientRetentionRate}%`}
                  icon="🔄"
                  trend="Returning clients"
                  color="bg-purple-500"
                />
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Today's Schedule */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-bloom-dark mb-4">Today's Schedule</h2>
                    {stats.upcomingToday.length > 0 ? (
                      <div className="space-y-3">
                        {stats.upcomingToday.map((apt) => (
                          <div key={apt.id} className="flex items-center justify-between p-4 bg-bloom-sage-50 rounded-lg">
                            <div>
                              <p className="font-medium text-bloom-dark">
                                {apt.user_profiles.first_name} {apt.user_profiles.last_name}
                              </p>
                              <p className="text-sm text-bloom-dark/60">
                                {new Date(apt.appointment_date).toLocaleTimeString('en-US', {
                                  hour: 'numeric',
                                  minute: '2-digit'
                                })} - {apt.appointment_type.replace(/-/g, ' ')}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {apt.confirmation_received ? (
                                <span className="text-green-600 text-sm">✓ Confirmed</span>
                              ) : (
                                <span className="text-amber-600 text-sm">⚠️ Unconfirmed</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-bloom-dark/60 text-center py-8">No appointments scheduled for today</p>
                    )}
                  </div>
                </div>

                {/* Action Items */}
                <div className="space-y-6">
                  {/* Needs Attention */}
                  {stats.needsAttention.length > 0 && (
                    <div className="bg-amber-50 rounded-xl shadow-sm p-6 border border-amber-200">
                      <h3 className="text-lg font-semibold text-amber-800 mb-3">Needs Attention</h3>
                      <div className="space-y-2">
                        {stats.needsAttention.map((apt) => (
                          <div key={apt.id} className="text-sm">
                            <p className="font-medium text-amber-700">
                              {apt.user_profiles.first_name} - Unconfirmed
                            </p>
                            <p className="text-amber-600">
                              {new Date(apt.appointment_date).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent No-Shows */}
                  {stats.recentNoShows.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h3 className="text-lg font-semibold text-bloom-dark mb-3">Recent No-Shows</h3>
                      <div className="space-y-2">
                        {stats.recentNoShows.slice(0, 3).map((apt) => (
                          <div key={apt.id} className="text-sm">
                            <p className="font-medium text-bloom-dark">
                              {apt.user_profiles.first_name} {apt.user_profiles.last_name}
                            </p>
                            <p className="text-bloom-dark/60">
                              {new Date(apt.appointment_date).toLocaleDateString()}
                              {apt.no_show_fee_charged && 
                                <span className="ml-2 text-green-600">Fee charged</span>
                              }
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {selectedView === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Revenue Chart */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-bloom-dark mb-4">Revenue Trend</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData.revenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#8B9B7A" 
                      strokeWidth={2}
                      dot={{ fill: '#8B9B7A' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Appointment Types */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-bloom-dark mb-4">Session Types</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData.clientTypes}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => entry.name}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.clientTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-bloom-dark mb-4">Performance Metrics</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-bloom-dark/70">Busiest Day</span>
                      <span className="font-medium">Wednesday</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-bloom-dark/70">Peak Hours</span>
                      <span className="font-medium">2:00 PM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-bloom-dark/70">Avg Session Duration</span>
                      <span className="font-medium">50 minutes</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-bloom-dark/70">Client Satisfaction</span>
                      <span className="font-medium text-green-600">98%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({ 
  title, 
  value, 
  icon, 
  trend, 
  color 
}: { 
  title: string;
  value: string | number;
  icon: string;
  trend: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-bloom-dark/60">{title}</p>
        <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center text-white text-sm`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-bloom-dark">{value}</p>
      <p className="text-xs text-bloom-dark/50 mt-1">{trend}</p>
    </div>
  );
}