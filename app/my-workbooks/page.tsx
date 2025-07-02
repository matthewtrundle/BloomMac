'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, Calendar, FileText, Download, ChevronRight, Clock } from 'lucide-react';
import Button from '@/components/ui/Button';

interface WorkbookSubmission {
  id: string;
  week_number: number;
  submitted_at: string;
  completion_percentage: number;
  instructor_feedback?: string;
  instructor_rating?: number;
  total_responses: number;
}

interface WorkbookResponse {
  question_id: string;
  response_data: {
    value: any;
    response_type: string;
    word_count?: number;
  };
  created_at: string;
}

export default function MyWorkbooksPage() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<WorkbookSubmission[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [weekResponses, setWeekResponses] = useState<WorkbookResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [courseId] = useState('postpartum-wellness-foundations'); // Default course

  useEffect(() => {
    if (user) {
      fetchSubmissions();
    }
  }, [user]);

  useEffect(() => {
    if (selectedWeek && user) {
      fetchWeekResponses(selectedWeek);
    }
  }, [selectedWeek, user]);

  const fetchSubmissions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_week_submissions')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .order('week_number', { ascending: true });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeekResponses = async (weekNumber: number) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_workbook_responses')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .eq('week_number', weekNumber)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setWeekResponses(data || []);
    } catch (error) {
      console.error('Error fetching responses:', error);
    }
  };

  const exportToPDF = async (weekNumber: number) => {
    // This would generate a PDF of the workbook responses
    // Implementation would use a library like jsPDF
    console.log('Exporting week', weekNumber, 'to PDF');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-bloom-sage border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-playfair text-bloom-dark">My Workbooks</h1>
              <p className="text-bloom-dark/70 mt-1">
                Review your submitted workbook responses and feedback
              </p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Submissions List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-bloom-dark mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-bloom-sage" />
                Submitted Workbooks
              </h2>

              {submissions.length === 0 ? (
                <p className="text-bloom-dark/60 text-center py-8">
                  No workbooks submitted yet
                </p>
              ) : (
                <div className="space-y-3">
                  {submissions.map((submission) => (
                    <motion.button
                      key={submission.id}
                      onClick={() => setSelectedWeek(submission.week_number)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        selectedWeek === submission.week_number
                          ? 'border-bloom-sage bg-bloom-sage/5'
                          : 'border-gray-200 hover:border-bloom-sage/50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-bloom-dark">
                          Week {submission.week_number}
                        </h3>
                        <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${
                          selectedWeek === submission.week_number ? 'rotate-90' : ''
                        }`} />
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-bloom-dark/60">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(submission.submitted_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {submission.total_responses} responses
                        </span>
                      </div>

                      {submission.instructor_feedback && (
                        <div className="mt-2 text-xs text-green-600 font-medium">
                          ✓ Instructor feedback available
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Stats Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-bloom-dark/60">Total Submitted</span>
                    <span className="font-medium text-bloom-dark">
                      {submissions.length} / 6 weeks
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-bloom-dark/60">Average Completion</span>
                    <span className="font-medium text-bloom-dark">
                      {submissions.length > 0
                        ? Math.round(
                            submissions.reduce((sum, s) => sum + s.completion_percentage, 0) /
                            submissions.length
                          )
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Response Details */}
          <div className="lg:col-span-2">
            {selectedWeek ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-bloom-dark">
                    Week {selectedWeek} Responses
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportToPDF(selectedWeek)}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export PDF
                  </Button>
                </div>

                {/* Instructor Feedback (if available) */}
                {submissions.find(s => s.week_number === selectedWeek)?.instructor_feedback && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-medium text-green-800 mb-2">
                      Instructor Feedback
                    </h3>
                    <p className="text-green-700">
                      {submissions.find(s => s.week_number === selectedWeek)?.instructor_feedback}
                    </p>
                  </div>
                )}

                {/* Responses */}
                <div className="space-y-6">
                  {weekResponses.map((response, index) => (
                    <div key={response.question_id} className="border-b border-gray-200 pb-6 last:border-0">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-bloom-dark">
                          Question {index + 1}
                        </h4>
                        <span className="text-xs text-bloom-dark/50">
                          {response.response_data.response_type}
                        </span>
                      </div>
                      
                      <div className="mt-3">
                        {response.response_data.response_type === 'scale' ? (
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-bloom-sage">
                              {response.response_data.value}
                            </span>
                            <span className="text-bloom-dark/60">/ 5</span>
                          </div>
                        ) : (
                          <p className="text-bloom-dark/80 whitespace-pre-wrap">
                            {response.response_data.value}
                          </p>
                        )}
                        
                        {response.response_data.word_count && (
                          <p className="text-xs text-bloom-dark/50 mt-2">
                            {response.response_data.word_count} words
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-bloom-dark/60">
                  Select a week to view your responses
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}