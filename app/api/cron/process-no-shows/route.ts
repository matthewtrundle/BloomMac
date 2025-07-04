import { NextRequest, NextResponse } from 'next/server';
import { processNoShow } from '@/lib/no-show-management';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Verify this is a Vercel Cron job
    const authHeader = request.headers.get('authorization');
    
    // In production, Vercel adds CRON_SECRET automatically to cron requests
    if (process.env.NODE_ENV === 'production') {
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    console.log('[Cron] Starting no-show processing job...');
    
    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get current timestamp
    const now = new Date();
    
    // Find appointments that are past their scheduled time + 15 minutes grace period
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
    
    // Query appointments that should have happened but client didn't show
    const { data: appointments, error } = await supabase
      .from('appointment_data')
      .select(`
        *,
        users:user_id(
          email,
          raw_user_meta_data
        ),
        user_payment_methods!inner(
          id,
          stripe_payment_method_id
        )
      `)
      .eq('status', 'scheduled')
      .lte('appointment_date', fifteenMinutesAgo.toISOString())
      .is('no_show_processed', null);
    
    if (error) {
      console.error('[Cron] Error fetching potential no-show appointments:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: error.message,
          timestamp: now.toISOString()
        },
        { status: 500 }
      );
    }
    
    console.log(`[Cron] Found ${appointments?.length || 0} potential no-show appointments`);
    
    let processedCount = 0;
    let feesCharged = 0;
    let failedCount = 0;
    let totalFeesCollected = 0;
    const errors: any[] = [];
    
    // Process each potential no-show
    if (appointments && appointments.length > 0) {
      for (const appointment of appointments) {
        try {
          // Double-check this is actually a no-show
          // (In production, you might want to check with calendar system or other verification)
          
          console.log(`[Cron] Processing potential no-show for appointment ${appointment.id}`);
          
          // Process the no-show
          const result = await processNoShow(appointment.id);
          
          if (result.success) {
            processedCount++;
            if (result.feeCharged) {
              feesCharged++;
              totalFeesCollected += result.feeAmount || 0;
            }
            
            console.log(`[Cron] Successfully processed no-show for appointment ${appointment.id}`);
            
            // Update appointment status
            await supabase
              .from('appointment_data')
              .update({ 
                status: 'no_show',
                no_show_processed: true,
                no_show_processed_at: new Date().toISOString(),
                no_show_fee_charged: result.feeCharged,
                no_show_fee_amount: result.feeAmount
              })
              .eq('id', appointment.id);
              
          } else {
            failedCount++;
            errors.push({
              appointmentId: appointment.id,
              error: result.error,
              userId: appointment.user_id
            });
            console.error(`[Cron] Failed to process no-show for appointment ${appointment.id}:`, result.error);
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
      noShows: {
        checked: appointments?.length || 0,
        processed: processedCount,
        feesCharged,
        failed: failedCount,
        totalFeesCollected: totalFeesCollected / 100 // Convert cents to dollars
      },
      errors: errors.length > 0 ? errors : undefined,
      message: `Processed ${processedCount} no-shows, charged ${feesCharged} fees totaling $${(totalFeesCollected / 100).toFixed(2)}`
    };
    
    console.log('[Cron] No-show processing job completed:', summary);
    
    // Log summary to database for monitoring
    await supabase
      .from('cron_logs')
      .insert({
        job_name: 'process-no-shows',
        status: failedCount === 0 ? 'success' : 'partial',
        summary,
        created_at: new Date().toISOString()
      });
    
    // Send notification to provider if any no-shows were processed
    if (processedCount > 0) {
      // TODO: Send email to provider with no-show summary
      console.log('[Cron] TODO: Send provider notification about processed no-shows');
    }
    
    return NextResponse.json(summary);
    
  } catch (error) {
    console.error('[Cron] No-show processing job failed:', error);
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