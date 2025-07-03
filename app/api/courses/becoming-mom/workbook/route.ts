import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import workbookStructure from '../structure.json';

// Get workbook responses
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get user's workbook responses
    const { data: responses, error } = await supabase
      .from('user_workbook_responses')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('course_id', 'becoming-mom');
    
    if (error) throw error;
    
    // Combine with workbook structure
    const workbookWithResponses = {
      ...workbookStructure.workbook,
      sections: workbookStructure.workbook.sections.map(section => ({
        ...section,
        responses: section.prompts.map((prompt, index) => {
          const response = responses?.find(
            r => r.week_number === section.lesson && r.question_id === `lesson-${section.lesson}-q${index + 1}`
          );
          return {
            prompt,
            response: response?.response || '',
            saved: !!response
          };
        })
      }))
    };
    
    return NextResponse.json({
      success: true,
      workbook: workbookWithResponses
    });
  } catch (error) {
    console.error('Error fetching workbook:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch workbook' },
      { status: 500 }
    );
  }
}

// Save workbook response
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { lessonNumber, questionId, response, isDraft } = body;
    
    if (!lessonNumber || !questionId) {
      return NextResponse.json(
        { success: false, error: 'Lesson number and question ID required' },
        { status: 400 }
      );
    }
    
    // Upsert response
    const { error } = await supabase
      .from('user_workbook_responses')
      .upsert({
        user_id: session.user.id,
        course_id: 'becoming-mom',
        week_number: lessonNumber,
        question_id: questionId,
        response: response || '',
        is_draft: isDraft !== false,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,course_id,week_number,question_id'
      });
    
    if (error) throw error;
    
    // Log activity
    await supabase
      .from('course_activity_logs')
      .insert({
        user_id: session.user.id,
        course_id: 'becoming-mom',
        activity_type: 'workbook_response',
        activity_data: { 
          lessonNumber, 
          questionId,
          isDraft
        }
      });
    
    return NextResponse.json({
      success: true,
      message: 'Response saved successfully'
    });
  } catch (error) {
    console.error('Error saving response:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save response' },
      { status: 500 }
    );
  }
}

// Submit workbook for a lesson
export async function PUT(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { lessonNumber } = body;
    
    if (!lessonNumber) {
      return NextResponse.json(
        { success: false, error: 'Lesson number required' },
        { status: 400 }
      );
    }
    
    // Mark all responses for this lesson as submitted
    const { error: updateError } = await supabase
      .from('user_workbook_responses')
      .update({ 
        is_draft: false,
        submitted_at: new Date().toISOString()
      })
      .eq('user_id', session.user.id)
      .eq('course_id', 'becoming-mom')
      .eq('week_number', lessonNumber);
    
    if (updateError) throw updateError;
    
    // Create submission record
    const { error: submissionError } = await supabase
      .from('user_week_submissions')
      .insert({
        user_id: session.user.id,
        course_id: 'becoming-mom',
        week_number: lessonNumber,
        submitted_at: new Date().toISOString(),
        completion_percentage: 100
      });
    
    if (submissionError && submissionError.code !== '23505') { // Ignore duplicate key error
      throw submissionError;
    }
    
    // Log activity
    await supabase
      .from('course_activity_logs')
      .insert({
        user_id: session.user.id,
        course_id: 'becoming-mom',
        activity_type: 'workbook_submitted',
        activity_data: { lessonNumber }
      });
    
    return NextResponse.json({
      success: true,
      message: 'Workbook submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting workbook:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit workbook' },
      { status: 500 }
    );
  }
}