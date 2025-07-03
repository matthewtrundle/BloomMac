import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

interface CourseWorkbook {
  courseId: string;
  courseName: string;
  workbooks: WorkbookStatus[];
}

interface WorkbookStatus {
  weekNumber: number;
  totalQuestions: number;
  answeredQuestions: number;
  isDraft: boolean;
  isSubmitted: boolean;
  lastUpdated?: string;
  completionPercentage: number;
}

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
    
    // Get user's enrolled courses
    const { data: enrollments, error: enrollError } = await supabase
      .from('course_enrollments')
      .select('course_id')
      .eq('user_id', session.user.id)
      .eq('status', 'active');
    
    if (enrollError) throw enrollError;
    
    if (!enrollments || enrollments.length === 0) {
      return NextResponse.json({
        success: true,
        courses: []
      });
    }
    
    const courseWorkbooks: CourseWorkbook[] = [];
    
    // For each enrolled course, get workbook status
    for (const enrollment of enrollments) {
      // Handle the free "Becoming Mom" course
      if (enrollment.course_id === 'becoming-mom') {
        const { data: responses } = await supabase
          .from('user_workbook_responses')
          .select('week_number, question_id, is_draft, updated_at')
          .eq('user_id', session.user.id)
          .eq('course_id', 'becoming-mom');
        
        const { data: submissions } = await supabase
          .from('user_week_submissions')
          .select('week_number, submitted_at, completion_percentage')
          .eq('user_id', session.user.id)
          .eq('course_id', 'becoming-mom');
        
        // Create workbook statuses for 4 lessons
        const workbooks: WorkbookStatus[] = [];
        for (let week = 1; week <= 4; week++) {
          const weekResponses = responses?.filter(r => r.week_number === week) || [];
          const submission = submissions?.find(s => s.week_number === week);
          
          const totalQuestions = 3; // 3 questions per lesson
          const answeredQuestions = weekResponses.length;
          const completionPercentage = submission?.completion_percentage || 
            Math.round((answeredQuestions / totalQuestions) * 100);
          
          workbooks.push({
            weekNumber: week,
            totalQuestions,
            answeredQuestions,
            isDraft: weekResponses.some(r => r.is_draft) && !submission,
            isSubmitted: !!submission,
            lastUpdated: weekResponses.length > 0 
              ? weekResponses.reduce((latest, r) => 
                  r.updated_at > latest ? r.updated_at : latest, weekResponses[0].updated_at)
              : undefined,
            completionPercentage
          });
        }
        
        courseWorkbooks.push({
          courseId: 'becoming-mom',
          courseName: 'Becoming Mom',
          workbooks
        });
      } else {
        // Handle other courses (6-week format)
        const { data: responses } = await supabase
          .from('user_workbook_responses')
          .select('week_number, question_id, is_draft, updated_at')
          .eq('user_id', session.user.id)
          .eq('course_id', enrollment.course_id);
        
        const { data: submissions } = await supabase
          .from('user_week_submissions')
          .select('week_number, submitted_at, completion_percentage')
          .eq('user_id', session.user.id)
          .eq('course_id', enrollment.course_id);
        
        // Create workbook statuses for 6 weeks
        const workbooks: WorkbookStatus[] = [];
        for (let week = 1; week <= 6; week++) {
          const weekResponses = responses?.filter(r => r.week_number === week) || [];
          const submission = submissions?.find(s => s.week_number === week);
          
          const totalQuestions = 12; // Estimated questions per week
          const answeredQuestions = weekResponses.length;
          const completionPercentage = submission?.completion_percentage || 
            Math.round((answeredQuestions / totalQuestions) * 100);
          
          workbooks.push({
            weekNumber: week,
            totalQuestions,
            answeredQuestions,
            isDraft: weekResponses.some(r => r.is_draft) && !submission,
            isSubmitted: !!submission,
            lastUpdated: weekResponses.length > 0 
              ? weekResponses.reduce((latest, r) => 
                  r.updated_at > latest ? r.updated_at : latest, weekResponses[0].updated_at)
              : undefined,
            completionPercentage
          });
        }
        
        // Get course name
        const courseName = enrollment.course_id === 'postpartum-wellness-foundations'
          ? 'Postpartum Wellness Foundations'
          : enrollment.course_id;
        
        courseWorkbooks.push({
          courseId: enrollment.course_id,
          courseName,
          workbooks
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      courses: courseWorkbooks
    });
    
  } catch (error) {
    console.error('Error fetching enrolled workbooks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch workbook status' },
      { status: 500 }
    );
  }
}