import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { week } = req.query;
  const weekNumber = parseInt(week as string);

  if (isNaN(weekNumber) || weekNumber < 1 || weekNumber > 6) {
    return res.status(400).json({ error: 'Invalid week number' });
  }

  try {
    // Get authenticated user
    const supabase = createServerSupabaseClient({ req, res });
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        code: 'AUTH_REQUIRED'
      });
    }

    if (req.method === 'GET') {
      // Fetch user's responses for this week
      const { data: responses, error: fetchError } = await supabase
        .from('user_workbook_responses')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_number', weekNumber)
        .order('created_at', { ascending: true });

      if (fetchError) {
        console.error('Error fetching responses:', fetchError);
        return res.status(500).json({
          error: 'Failed to fetch responses',
          details: fetchError.message
        });
      }

      // Check if week has been submitted
      const { data: submission } = await supabase
        .from('user_week_submissions')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_number', weekNumber)
        .single();

      return res.status(200).json({
        weekNumber,
        responses: responses || [],
        submission: submission || null,
        isSubmitted: !!submission,
        completionPercentage: calculateCompletionPercentage(responses || [])
      });

    } else if (req.method === 'POST' && req.url?.endsWith('/submit')) {
      // Submit week for review
      const { courseId, responses } = req.body;

      if (!courseId || !responses || !Array.isArray(responses)) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['courseId', 'responses']
        });
      }

      // Check if already submitted
      const { data: existingSubmission } = await supabase
        .from('user_week_submissions')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .eq('week_number', weekNumber)
        .single();

      if (existingSubmission) {
        return res.status(400).json({
          error: 'Week already submitted',
          code: 'ALREADY_SUBMITTED'
        });
      }

      // Calculate completion percentage
      const completionPercentage = calculateCompletionPercentage(responses);

      // Mark all responses as non-draft
      const { error: updateError } = await supabase
        .from('user_workbook_responses')
        .update({ is_draft: false })
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .eq('week_number', weekNumber);

      if (updateError) {
        console.error('Error updating responses:', updateError);
        return res.status(500).json({
          error: 'Failed to update responses',
          details: updateError.message
        });
      }

      // Create submission record
      const { data: submission, error: submitError } = await supabase
        .from('user_week_submissions')
        .insert({
          user_id: user.id,
          course_id: courseId,
          week_number: weekNumber,
          submitted_at: new Date().toISOString(),
          completion_percentage: completionPercentage,
          total_responses: responses.length
        })
        .select()
        .single();

      if (submitError) {
        console.error('Error creating submission:', submitError);
        return res.status(500).json({
          error: 'Failed to submit week',
          details: submitError.message
        });
      }

      // Track activity
      await supabase
        .from('user_course_activity')
        .insert({
          user_id: user.id,
          course_id: courseId,
          activity_type: 'week_submitted',
          activity_data: {
            week_number: weekNumber,
            completion_percentage: completionPercentage,
            submission_id: submission.id
          }
        });

      // Check for achievements
      await checkWorkbookAchievements(supabase, user.id, courseId, weekNumber);

      return res.status(200).json({
        success: true,
        submission,
        message: `Week ${weekNumber} submitted successfully`
      });

    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error: any) {
    console.error('API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}

function calculateCompletionPercentage(responses: any[]): number {
  if (!responses || responses.length === 0) return 0;
  
  const answeredQuestions = responses.filter(r => 
    r.response_data?.value !== null && 
    r.response_data?.value !== undefined &&
    r.response_data?.value !== ''
  ).length;
  
  // Assuming minimum 10 questions per week
  const estimatedTotalQuestions = Math.max(responses.length, 10);
  return Math.round((answeredQuestions / estimatedTotalQuestions) * 100);
}

async function checkWorkbookAchievements(
  supabase: any, 
  userId: string, 
  courseId: string, 
  weekNumber: number
) {
  try {
    // Check if user has completed all weeks
    const { data: submissions } = await supabase
      .from('user_week_submissions')
      .select('week_number')
      .eq('user_id', userId)
      .eq('course_id', courseId);

    const completedWeeks = submissions?.map((s: any) => s.week_number) || [];
    
    // First week completion achievement
    if (weekNumber === 1) {
      await supabase
        .from('user_achievements')
        .upsert({
          user_id: userId,
          achievement_id: 'first_workbook',
          earned_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,achievement_id'
        });
    }

    // All weeks completion achievement
    if (completedWeeks.length === 6) {
      await supabase
        .from('user_achievements')
        .upsert({
          user_id: userId,
          achievement_id: 'workbook_champion',
          earned_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,achievement_id'
        });
    }

  } catch (error) {
    console.error('Error checking achievements:', error);
  }
}