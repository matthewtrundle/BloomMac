import { NextRequest, NextResponse } from 'next/server';
import { captureAppointmentPayment } from '@/lib/payment-management';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[Cron] Starting payment capture job...');
    
    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get current timestamp
    const now = new Date();
    
    // Find appointments that need payment capture (24 hours before appointment)
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Query appointments scheduled for tomorrow that haven't been captured yet
    const { data: appointments, error } = await supabase
      .from('appointment_data')
      .select(`
        *,
        appointment_payments!inner(
          id,
          payment_intent_id,
          status,
          amount
        )
      `)
      .eq('status', 'scheduled')
      .eq('payment_status', 'authorized')
      .gte('appointment_date', tomorrow.toISOString())
      .lt('appointment_date', new Date(tomorrow.getTime() + 60 * 60 * 1000).toISOString())
      .eq('appointment_payments.status', 'authorized');
    
    if (error) {
      console.error('[Cron] Error fetching appointments for payment capture:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: error.message,
          timestamp: now.toISOString()
        },
        { status: 500 }
      );
    }
    
    console.log(`[Cron] Found ${appointments?.length || 0} appointments needing payment capture`);
    
    let capturedCount = 0;
    let failedCount = 0;
    let totalAmount = 0;
    const errors: any[] = [];
    
    // Process each appointment
    if (appointments && appointments.length > 0) {
      for (const appointment of appointments) {
        try {
          // Skip if no payment data
          if (!appointment.appointment_payments || appointment.appointment_payments.length === 0) {
            console.warn(`[Cron] No payment data for appointment ${appointment.id}`);
            continue;
          }
          
          const payment = appointment.appointment_payments[0];
          
          // Capture the payment
          const result = await captureAppointmentPayment(appointment.id);
          
          if (result.success) {
            capturedCount++;
            totalAmount += payment.amount || 0;
            
            console.log(`[Cron] Successfully captured payment for appointment ${appointment.id}`);
            
            // Update appointment payment status
            await supabase
              .from('appointment_data')
              .update({ 
                payment_status: 'captured',
                payment_captured_at: new Date().toISOString()
              })
              .eq('id', appointment.id);
              
          } else {
            failedCount++;
            errors.push({
              appointmentId: appointment.id,
              error: result.error,
              userId: appointment.user_id
            });
            console.error(`[Cron] Failed to capture payment for appointment ${appointment.id}:`, result.error);
          }
          
        } catch (error) {
          failedCount++;
          errors.push({
            appointmentId: appointment.id,
            error: error instanceof Error ? error.message : 'Unknown error',
            userId: appointment.user_id
          });
          console.error(`[Cron] Error processing appointment ${appointment.id}:`, error);
        }
      }
    }
    
    const summary = {
      success: true,
      timestamp: now.toISOString(),
      payments: {
        checked: appointments?.length || 0,
        captured: capturedCount,
        failed: failedCount,
        totalAmount: totalAmount / 100 // Convert cents to dollars
      },
      errors: errors.length > 0 ? errors : undefined,
      message: `Captured ${capturedCount} payments totaling $${(totalAmount / 100).toFixed(2)} with ${failedCount} failures`
    };
    
    console.log('[Cron] Payment capture job completed:', summary);
    
    // Log summary to database for monitoring
    await supabase
      .from('cron_logs')
      .insert({
        job_name: 'capture-payments',
        status: failedCount === 0 ? 'success' : 'partial',
        summary,
        created_at: new Date().toISOString()
      });
    
    return NextResponse.json(summary);
    
  } catch (error) {
    console.error('[Cron] Payment capture job failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Also support POST for some cron services
export async function POST(request: NextRequest) {
  return GET(request);
}