'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, CheckCircle, Clock, AlertCircle, FileText, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface WorkbookStatus {
  weekNumber: number;
  totalQuestions: number;
  answeredQuestions: number;
  isDraft: boolean;
  isSubmitted: boolean;
  lastUpdated?: string;
  completionPercentage: number;
}

interface WorkbookProgressProps {
  userId: string;
  courseId: string;
}

export default function WorkbookProgress({ userId, courseId }: WorkbookProgressProps) {
  const [workbookStatuses, setWorkbookStatuses] = useState<WorkbookStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    fetchWorkbookProgress();
  }, [userId, courseId]);

  const fetchWorkbookProgress = async () => {
    if (!userId || !courseId) {
      setError('Missing required parameters');
      setLoading(false);
      return;
    }
    
    try {
      setError(null);
      // Fetch all workbook responses for this user and course
      const { data: responses, error: responsesError } = await supabase
        .from('user_workbook_responses')
        .select('week_number, question_id, is_draft, updated_at')
        .eq('user_id', userId)
        .eq('course_id', courseId);

      if (responsesError) throw responsesError;

      // Fetch submission status for each week
      const { data: submissions, error: submissionsError } = await supabase
        .from('user_week_submissions')
        .select('week_number, submitted_at, completion_percentage')
        .eq('user_id', userId)
        .eq('course_id', courseId);

      if (submissionsError) throw submissionsError;

      // Process data by week (assuming 6 weeks)
      const weekStatuses: WorkbookStatus[] = [];
      let totalCompleted = 0;

      for (let week = 1; week <= 6; week++) {
        const weekResponses = responses?.filter(r => r.week_number === week) || [];
        const submission = submissions?.find(s => s.week_number === week);
        
        // Estimate 10-15 questions per week (you can adjust based on actual data)
        const estimatedQuestions = 12;
        const answeredQuestions = weekResponses.length;
        const completionPercentage = submission?.completion_percentage || 
          Math.round((answeredQuestions / estimatedQuestions) * 100);

        const status: WorkbookStatus = {
          weekNumber: week,
          totalQuestions: estimatedQuestions,
          answeredQuestions,
          isDraft: weekResponses.some(r => r.is_draft) && !submission,
          isSubmitted: !!submission,
          lastUpdated: weekResponses.length > 0 
            ? weekResponses.reduce((latest, r) => 
                r.updated_at > latest ? r.updated_at : latest, weekResponses[0].updated_at)
            : undefined,
          completionPercentage
        };

        weekStatuses.push(status);
        if (status.isSubmitted) totalCompleted++;
      }

      setWorkbookStatuses(weekStatuses);
      setOverallProgress(Math.round((totalCompleted / 6) * 100));
    } catch (error) {
      console.error('Error fetching workbook progress:', error);
      setError('Unable to load workbook progress');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: WorkbookStatus) => {
    if (status.isSubmitted) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    } else if (status.isDraft) {
      return <Clock className="w-5 h-5 text-yellow-600" />;
    } else if (status.answeredQuestions > 0) {
      return <FileText className="w-5 h-5 text-blue-600" />;
    } else {
      return <BookOpen className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: WorkbookStatus) => {
    if (status.isSubmitted) {
      return 'Submitted';
    } else if (status.isDraft) {
      return 'In Progress';
    } else if (status.answeredQuestions > 0) {
      return 'Started';
    } else {
      return 'Not Started';
    }
  };

  const getStatusColor = (status: WorkbookStatus) => {
    if (status.isSubmitted) {
      return 'bg-green-50 border-green-200';
    } else if (status.isDraft) {
      return 'bg-yellow-50 border-yellow-200';
    } else if (status.answeredQuestions > 0) {
      return 'bg-blue-50 border-blue-200';
    } else {
      return 'bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center py-4">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600 text-sm">{error}</p>
          <button 
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchWorkbookProgress();
            }}
            className="mt-2 text-bloom-sage hover:text-bloom-sage/80 text-sm underline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-bloom-dark flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-bloom-sage" />
          Workbook Progress
        </h3>
        <div className="text-sm text-bloom-dark/70">
          {overallProgress}% Complete
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-6">
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-bloom-sage to-bloompink"
          />
        </div>
        <p className="text-xs text-bloom-dark/60 mt-2">
          {workbookStatuses.filter(s => s.isSubmitted).length} of 6 weeks submitted
        </p>
      </div>

      {/* Weekly Status Cards */}
      <div className="space-y-3">
        {workbookStatuses.map((status) => (
          <motion.div
            key={status.weekNumber}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: status.weekNumber * 0.05 }}
            className={`border rounded-lg p-4 transition-all hover:shadow-md ${getStatusColor(status)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(status)}
                <div>
                  <h4 className="font-medium text-bloom-dark">
                    Week {status.weekNumber}
                  </h4>
                  <p className="text-sm text-bloom-dark/60">
                    {getStatusText(status)}
                    {status.lastUpdated && (
                      <span className="ml-2">
                        • Last saved {new Date(status.lastUpdated).toLocaleDateString()}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Progress for non-submitted workbooks */}
                {!status.isSubmitted && status.answeredQuestions > 0 && (
                  <div className="text-right">
                    <div className="text-sm font-medium text-bloom-dark">
                      {status.completionPercentage}%
                    </div>
                    <div className="text-xs text-bloom-dark/60">
                      {status.answeredQuestions}/{status.totalQuestions} questions
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Link
                  href={`/course/week${status.weekNumber}/workbook`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    status.isSubmitted
                      ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      : status.isDraft
                      ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                      : 'bg-bloom-sage text-white hover:bg-bloom-sage/90'
                  }`}
                >
                  {status.isSubmitted ? 'Review' : status.isDraft ? 'Continue' : 'Start'}
                </Link>
              </div>
            </div>

            {/* Progress bar for in-progress workbooks */}
            {!status.isSubmitted && status.answeredQuestions > 0 && (
              <div className="mt-3">
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-bloom-sage to-bloompink transition-all duration-300"
                    style={{ width: `${status.completionPercentage}%` }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-bloom-sage/5 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-bloom-sage mt-0.5" />
          <div className="text-sm text-bloom-dark/70">
            <p className="font-medium mb-1">About Workbooks</p>
            <p>Complete weekly workbooks to track your progress and reflections. Your responses are saved automatically and can be reviewed by your care provider once submitted.</p>
          </div>
        </div>
      </div>
    </div>
  );
}