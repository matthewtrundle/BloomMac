'use client';

import { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Circle, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface WorkbookStatusProps {
  userId: string;
  courseId: string;
  weekNumber: number;
  isLocked?: boolean;
}

export function CourseWorkbookStatus({ 
  userId, 
  courseId, 
  weekNumber, 
  isLocked = false 
}: WorkbookStatusProps) {
  const [status, setStatus] = useState<{
    hasStarted: boolean;
    isSubmitted: boolean;
    completionPercentage: number;
  }>({
    hasStarted: false,
    isSubmitted: false,
    completionPercentage: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkbookStatus();
  }, [userId, courseId, weekNumber]);

  const fetchWorkbookStatus = async () => {
    try {
      // Check if user has any responses for this week
      const { data: responses, error: responsesError } = await supabase
        .from('user_workbook_responses')
        .select('question_id')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .eq('week_number', weekNumber);

      if (responsesError) throw responsesError;

      // Check if week is submitted
      const { data: submission, error: submissionError } = await supabase
        .from('user_week_submissions')
        .select('submitted_at, completion_percentage')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .eq('week_number', weekNumber)
        .single();

      const hasStarted = responses && responses.length > 0;
      const isSubmitted = !!submission;
      const completionPercentage = submission?.completion_percentage || 
        (hasStarted ? Math.round((responses.length / 12) * 100) : 0); // Assuming ~12 questions per week

      setStatus({
        hasStarted,
        isSubmitted,
        completionPercentage
      });
    } catch (error) {
      console.error('Error fetching workbook status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-24"></div>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="flex items-center gap-2 text-gray-400">
        <Lock className="w-4 h-4" />
        <span className="text-sm">Locked</span>
      </div>
    );
  }

  const getStatusDisplay = () => {
    if (status.isSubmitted) {
      return {
        icon: <CheckCircle className="w-5 h-5 text-green-600" />,
        text: 'Completed',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
    } else if (status.hasStarted) {
      return {
        icon: <BookOpen className="w-5 h-5 text-yellow-600" />,
        text: `${status.completionPercentage}% Complete`,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
      };
    } else {
      return {
        icon: <Circle className="w-5 h-5 text-gray-400" />,
        text: 'Not Started',
        color: 'text-gray-500',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200'
      };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <Link
      href={`/course/week${weekNumber}/workbook`}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:shadow-md ${statusDisplay.bgColor} ${statusDisplay.borderColor} border ${statusDisplay.color}`}
    >
      {statusDisplay.icon}
      <span>{statusDisplay.text}</span>
    </Link>
  );
}