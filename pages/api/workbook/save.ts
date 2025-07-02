import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

interface SaveWorkbookRequest {
  courseId: string;
  weekNumber: number;
  questionId: string;
  value: any;
  responseType: string;
  isDraft: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get authenticated user
    const supabase = createServerSupabaseClient({ req, res });
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Auth error:', authError);
      return res.status(401).json({ 
        error: 'Unauthorized',
        code: 'AUTH_REQUIRED'
      });
    }

    // Validate request body
    const { 
      courseId, 
      weekNumber, 
      questionId, 
      value, 
      responseType, 
      isDraft 
    }: SaveWorkbookRequest = req.body;

    if (!courseId || !weekNumber || !questionId || value === undefined) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['courseId', 'weekNumber', 'questionId', 'value']
      });
    }

    // Calculate word count for text responses
    let wordCount = null;
    if (responseType === 'text' || responseType === 'reflection') {
      wordCount = value ? String(value).trim().split(/\s+/).filter(Boolean).length : 0;
    }

    // Prepare response data
    const responseData = {
      user_id: user.id,
      course_id: courseId,
      week_number: weekNumber,
      question_id: questionId,
      response_data: {
        value,
        response_type: responseType,
        word_count: wordCount
      },
      is_draft: isDraft,
      updated_at: new Date().toISOString()
    };

    console.log('Saving workbook response:', {
      userId: user.id,
      questionId,
      weekNumber,
      isDraft
    });

    // Upsert the response (insert or update)
    const { data, error } = await supabase
      .from('user_workbook_responses')
      .upsert(responseData, {
        onConflict: 'user_id,course_id,week_number,question_id',
        returning: 'minimal'
      });

    if (error) {
      console.error('Database error:', error);
      
      // Handle specific errors
      if (error.code === '23505') {
        return res.status(400).json({
          error: 'Response already exists',
          code: 'DUPLICATE_RESPONSE'
        });
      }
      
      return res.status(500).json({
        error: 'Failed to save response',
        details: error.message
      });
    }

    // Track activity for progress
    await supabase
      .from('user_course_activity')
      .insert({
        user_id: user.id,
        course_id: courseId,
        activity_type: 'workbook_response',
        activity_data: {
          week_number: weekNumber,
          question_id: questionId,
          is_draft: isDraft
        }
      })
      .select()
      .single();

    // Check if this response triggers any safety flags
    if (responseType === 'scale' && questionId.includes('epds')) {
      // EPDS screening - check for high scores
      if (typeof value === 'number' && value >= 3) {
        // Flag for clinical review
        await supabase
          .from('user_workbook_responses')
          .update({ flagged_for_review: true })
          .eq('user_id', user.id)
          .eq('question_id', questionId);

        console.warn('High EPDS score flagged for review:', {
          userId: user.id,
          questionId,
          value
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Response saved successfully',
      savedAt: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}