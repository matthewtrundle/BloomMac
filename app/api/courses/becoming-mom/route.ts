import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import courseStructure from './structure.json';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check if user is authenticated (optional for free course)
    const { data: { session } } = await supabase.auth.getSession();
    
    // Return course structure
    return NextResponse.json({
      success: true,
      course: courseStructure.course,
      modules: courseStructure.modules,
      resources: courseStructure.resources,
      workbook: courseStructure.workbook,
      isEnrolled: session ? await checkEnrollment(supabase, session.user.id) : false
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}

// Enroll in free course
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Check if already enrolled
    const isEnrolled = await checkEnrollment(supabase, session.user.id);
    if (isEnrolled) {
      return NextResponse.json({
        success: true,
        message: 'Already enrolled in course'
      });
    }
    
    // Create enrollment record
    const { error: enrollError } = await supabase
      .from('course_enrollments')
      .insert({
        user_id: session.user.id,
        course_id: 'becoming-mom',
        enrollment_method: 'free',
        amount_paid: 0,
        status: 'active'
      });
    
    if (enrollError) {
      console.error('Enrollment error:', enrollError);
      throw new Error('Failed to enroll in course');
    }
    
    // Log activity
    await supabase
      .from('course_activity_logs')
      .insert({
        user_id: session.user.id,
        course_id: 'becoming-mom',
        activity_type: 'enrollment',
        activity_data: { method: 'free' }
      });
    
    // Send welcome email (optional)
    // await sendCourseWelcomeEmail(session.user.email, 'Becoming Mom');
    
    return NextResponse.json({
      success: true,
      message: 'Successfully enrolled in Becoming Mom course'
    });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to enroll in course' },
      { status: 500 }
    );
  }
}

async function checkEnrollment(supabase: any, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('course_enrollments')
    .select('id')
    .eq('user_id', userId)
    .eq('course_id', 'becoming-mom')
    .eq('status', 'active')
    .single();
  
  return !!data;
}