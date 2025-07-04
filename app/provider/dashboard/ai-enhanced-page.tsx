'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Brain, Calendar, TrendingUp, Users, AlertTriangle, 
  Clock, DollarSign, Target, Sparkles, MessageSquare,
  FileText, Activity, Shield, Zap
} from 'lucide-react';

interface PatientInsight {
  id: string;
  name: string;
  risk_level: 'low' | 'medium' | 'high';
  progress_trend: 'improving' | 'stable' | 'declining';
  next_session: string;
  ai_recommendations: string[];
  mood_score: number;
  engagement_score: number;
}

interface AIRecommendation {
  type: 'scheduling' | 'clinical' | 'revenue' | 'risk';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action: string;
  potential_impact: string;
}

export default function AIEnhancedProviderDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = useSupabaseClient();
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [patientInsights, setPatientInsights] = useState<PatientInsight[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalPatients: 0,
    upcomingToday: 0,
    weeklyRevenue: 0,
    avgSessionRating: 0,
    noShowPrediction: 0,
    revenueOptimization: 0
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchAIInsights();
    }
  }, [user]);

  const fetchAIInsights = async () => {
    setLoading(true);
    try {
      // Simulate AI-powered insights
      setPatientInsights([
        {
          id: '1',
          name: 'Sarah M.',
          risk_level: 'medium',
          progress_trend: 'improving',
          next_session: '2025-01-07T14:00:00Z',
          ai_recommendations: [
            'Consider extending session frequency',
            'Introduce mindfulness techniques',
            'Review medication adherence'
          ],
          mood_score: 7.2,
          engagement_score: 8.5
        },
        {
          id: '2',
          name: 'Jennifer K.',
          risk_level: 'high',
          progress_trend: 'declining',
          next_session: '2025-01-08T10:00:00Z',
          ai_recommendations: [
            'Immediate follow-up recommended',
            'Consider crisis intervention protocol',
            'Family support assessment needed'
          ],
          mood_score: 4.1,
          engagement_score: 5.2
        },
        {
          id: '3',
          name: 'Maria R.',
          risk_level: 'low',
          progress_trend: 'stable',
          next_session: '2025-01-09T16:00:00Z',
          ai_recommendations: [
            'Maintain current treatment plan',
            'Consider graduation timeline',
            'Peer support group referral'
          ],
          mood_score: 8.7,
          engagement_score: 9.1
        }
      ]);

      setAiRecommendations([
        {
          type: 'risk',
          priority: 'high',
          title: 'Patient Risk Alert',
          description: 'Jennifer K. showing declining mood patterns',
          action: 'Schedule immediate check-in',
          potential_impact: 'Prevent crisis intervention'
        },
        {
          type: 'revenue',
          priority: 'medium',
          title: 'Schedule Optimization',
          description: 'Thursday 2-4pm slot consistently unfilled',
          action: 'Offer flexible booking incentive',
          potential_impact: '$800/month revenue increase'
        },
        {
          type: 'clinical',
          priority: 'medium',
          title: 'Treatment Enhancement',
          description: '3 patients would benefit from group therapy',
          action: 'Launch postpartum support group',
          potential_impact: 'Improved outcomes + efficiency'
        }
      ]);

      setDashboardStats({
        totalPatients: 47,
        upcomingToday: 6,
        weeklyRevenue: 3240,
        avgSessionRating: 4.8,
        noShowPrediction: 12,
        revenueOptimization: 23
      });

    } catch (error) {
      console.error('Error fetching AI insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading AI insights...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Brain className="h-8 w-8 text-blue-600" />
                AI-Enhanced Provider Hub
              </h1>
              <p className="text-gray-600 mt-1">Intelligent insights for better patient outcomes</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">AI Active</span>
              </div>
              <Link href="/provider/settings" className="text-gray-600 hover:text-gray-900">
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-6 py-4">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'overview', label: 'AI Overview', icon: Brain },
            { id: 'patients', label: 'Patient Insights', icon: Users },
            { id: 'recommendations', label: 'AI Recommendations', icon: Target },
            { id: 'analytics', label: 'Predictive Analytics', icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-12">
        {/* AI Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Active Patients"
                value={dashboardStats.totalPatients}
                change="+3 this week"
                icon={Users}
                color="blue"
              />
              <MetricCard
                title="Today's Sessions"
                value={dashboardStats.upcomingToday}
                change="2 high priority"
                icon={Calendar}
                color="green"
              />
              <MetricCard
                title="Weekly Revenue"
                value={`$${dashboardStats.weeklyRevenue.toLocaleString()}`}
                change="+15% vs last week"
                icon={DollarSign}
                color="purple"
              />
              <MetricCard
                title="Avg Session Rating"
                value={dashboardStats.avgSessionRating}
                change="98% satisfaction"
                icon={Target}
                color="amber"
              />
            </div>

            {/* AI Insights Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Risk Alerts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Risk Alerts</h3>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-red-800">Jennifer K.</span>
                      <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">HIGH</span>
                    </div>
                    <p className="text-sm text-red-700">Declining mood patterns detected</p>
                    <button className="text-xs text-red-600 hover:text-red-800 mt-2">
                      Schedule immediate follow-up →
                    </button>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-amber-800">Sarah M.</span>
                      <span className="text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded">MEDIUM</span>
                    </div>
                    <p className="text-sm text-amber-700">Treatment plan optimization needed</p>
                    <button className="text-xs text-amber-600 hover:text-amber-800 mt-2">
                      Review recommendations →
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* AI Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Brain className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-1">Revenue Optimization</h4>
                    <p className="text-sm text-blue-700 mb-2">
                      Thursday 2-4pm consistently unfilled
                    </p>
                    <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                      +$800/month potential
                    </span>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-1">Group Therapy Opportunity</h4>
                    <p className="text-sm text-green-700 mb-2">
                      3 patients ideal for postpartum support group
                    </p>
                    <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                      Better outcomes
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Smart Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Zap className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Smart Actions</h3>
                </div>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-purple-900">Generate Session Notes</span>
                      <FileText className="h-4 w-4 text-purple-600" />
                    </div>
                    <p className="text-sm text-purple-700 mt-1">AI-powered documentation for today's sessions</p>
                  </button>
                  <button className="w-full text-left p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-purple-900">Optimize Schedule</span>
                      <Clock className="h-4 w-4 text-purple-600" />
                    </div>
                    <p className="text-sm text-purple-700 mt-1">AI scheduling recommendations for next week</p>
                  </button>
                  <button className="w-full text-left p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-purple-900">Patient Check-ins</span>
                      <MessageSquare className="h-4 w-4 text-purple-600" />
                    </div>
                    <p className="text-sm text-purple-700 mt-1">Send AI-personalized wellness messages</p>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Patient Insights Tab */}
        {activeTab === 'patients' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">AI Patient Insights</h2>
              <div className="space-y-4">
                {patientInsights.map((patient) => (
                  <PatientInsightCard key={patient.id} patient={patient} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">AI Recommendations</h2>
              <div className="space-y-4">
                {aiRecommendations.map((rec, index) => (
                  <RecommendationCard key={index} recommendation={rec} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Predictive Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">No-Show Prediction</h3>
                <div className="text-center py-8">
                  <div className="text-4xl font-bold text-orange-600 mb-2">
                    {dashboardStats.noShowPrediction}%
                  </div>
                  <p className="text-gray-600">Predicted no-show rate this week</p>
                  <p className="text-sm text-orange-600 mt-2">3 high-risk appointments identified</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Optimization</h3>
                <div className="text-center py-8">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    +{dashboardStats.revenueOptimization}%
                  </div>
                  <p className="text-gray-600">Potential revenue increase</p>
                  <p className="text-sm text-green-600 mt-2">Through AI-optimized scheduling</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Component for metric cards
function MetricCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color 
}: { 
  title: string; 
  value: string | number; 
  change: string; 
  icon: any; 
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    amber: 'bg-amber-100 text-amber-600'
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-xs text-gray-500">{change}</p>
      </div>
    </div>
  );
}

// Component for patient insight cards
function PatientInsightCard({ patient }: { patient: PatientInsight }) {
  const riskColors = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-amber-100 text-amber-800 border-amber-200',
    high: 'bg-red-100 text-red-800 border-red-200'
  };

  const trendIcons = {
    improving: '📈',
    stable: '➡️',
    declining: '📉'
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-medium text-gray-900">{patient.name}</h4>
          <p className="text-sm text-gray-600">
            Next session: {new Date(patient.next_session).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs font-medium border ${riskColors[patient.risk_level]}`}>
            {patient.risk_level.toUpperCase()} RISK
          </span>
          <span className="text-lg" title={`Trend: ${patient.progress_trend}`}>
            {trendIcons[patient.progress_trend]}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <p className="text-xs text-gray-500">Mood Score</p>
          <p className="font-medium">{patient.mood_score}/10</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Engagement</p>
          <p className="font-medium">{patient.engagement_score}/10</p>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-900 mb-2">AI Recommendations:</p>
        <ul className="text-xs text-gray-600 space-y-1">
          {patient.ai_recommendations.map((rec, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Component for recommendation cards
function RecommendationCard({ recommendation }: { recommendation: AIRecommendation }) {
  const typeColors = {
    scheduling: 'bg-blue-50 border-blue-200',
    clinical: 'bg-green-50 border-green-200',
    revenue: 'bg-purple-50 border-purple-200',
    risk: 'bg-red-50 border-red-200'
  };

  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-amber-100 text-amber-800',
    low: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className={`border rounded-lg p-4 ${typeColors[recommendation.type]}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-medium text-gray-900">{recommendation.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{recommendation.description}</p>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[recommendation.priority]}`}>
          {recommendation.priority.toUpperCase()}
        </span>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm">
          <span className="font-medium text-gray-900">Action:</span> {recommendation.action}
        </p>
        <p className="text-sm">
          <span className="font-medium text-gray-900">Impact:</span> {recommendation.potential_impact}
        </p>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Implement recommendation →
        </button>
      </div>
    </div>
  );
}