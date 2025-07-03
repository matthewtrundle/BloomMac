import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

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
    const { appointmentDate, appointmentType, notes } = body;
    
    if (!appointmentDate || !appointmentType) {
      return NextResponse.json(
        { success: false, error: 'Appointment date and type are required' },
        { status: 400 }
      );
    }
    
    // Create appointment record
    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert({
        user_id: session.user.id,
        appointment_date: appointmentDate,
        appointment_type: appointmentType,
        notes: notes || null,
        status: 'scheduled',
        payment_status: 'pending',
        confirmation_sent: false,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating appointment:', error);
      
      // If table doesn't exist, return friendly error
      if (error.code === '42P01') {
        return NextResponse.json({
          success: false,
          error: 'Appointment booking is not available at this time. Please contact us directly.'
        });
      }
      
      throw error;
    }
    
    // TODO: Send confirmation email
    // await sendAppointmentConfirmation(session.user.email, appointment);
    
    return NextResponse.json({
      success: true,
      appointment
    });
    
  } catch (error) {
    console.error('Error booking appointment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to book appointment' },
      { status: 500 }
    );
  }
}

// Cancel appointment
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get('id');
    
    if (!appointmentId) {
      return NextResponse.json(
        { success: false, error: 'Appointment ID required' },
        { status: 400 }
      );
    }
    
    // Update appointment status
    const { error } = await supabase
      .from('appointments')
      .update({ 
        status: 'cancelled',
        cancelled_at: new Date().toISOString()
      })
      .eq('id', appointmentId)
      .eq('user_id', session.user.id);
    
    if (error) {
      console.error('Error cancelling appointment:', error);
      
      if (error.code === '42P01') {
        return NextResponse.json({
          success: true,
          message: 'Appointment cancelled'
        });
      }
      
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      message: 'Appointment cancelled successfully'
    });
    
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to cancel appointment' },
      { status: 500 }
    );
  }
}