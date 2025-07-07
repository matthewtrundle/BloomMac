'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { motion } from 'framer-motion';

interface WorkbookSubmission {
  id: string;
  user_id: string;
  course_id: string;
  week_number: number;
  submitted_at: string;
  all_lessons_completed: boolean;
  all_workbook_completed: boolean;
  completion_percentage: number;
  instructor_feedback: string;
  instructor_rating: number;
  feedback_date: string;
  first_name: string;
  last_name: string;
}

export default function ProviderWorkbooksPage() {
  const { user, loading: authLoading } = useAuth();
  const supabase = useSupabaseClient();
  const [submissions, setSubmissions] = useState<WorkbookSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubmissions();
    }
  }, [user]);

  const fetchSubmissions = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_week_submissions')
        .select(`
          *,
          user_profiles (
            first_name,
            last_name
          )
        `)
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error fetching submissions:', error);
      } else {
        setSubmissions(data);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bloom-sage mx-auto"></div>
          <p className="mt-4 text-bloom-dark/60">Loading workbook submissions...</p>
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
          <h1 className="text-3xl font-playfair text-bloom-dark mb-8">Workbook Submissions</h1>
          {submissions.length > 0 ? (
            <div className="space-y-4">
              {submissions.map(submission => (
                <div key={submission.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="font-medium text-lg">{submission.first_name} {submission.last_name}</h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-bloom-sage-100 text-bloom-sage-800">
                          Week {submission.week_number}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>📅 Submitted: {new Date(submission.submitted_at).toLocaleString()}</p>
                        <p>📈 Completion: {submission.completion_percentage}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No workbook submissions found.</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
