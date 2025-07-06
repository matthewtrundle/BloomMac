import { NextRequest, NextResponse } from 'next/server';
import { sequenceProcessor } from '@/lib/email-automation/sequence-processor';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes max

export async function GET(request: NextRequest) {
  try {
    // Verify the request is from a valid cron job
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // In production, verify the cron secret
    if (process.env.NODE_ENV === 'production' && cronSecret) {
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    console.log('🚀 Starting email sequence processing...');
    const startTime = Date.now();

    // Process sequences
    const result = await sequenceProcessor.processSequences();

    const duration = Date.now() - startTime;

    // Log the cron run
    await logCronRun({
      duration,
      processed: result.processed,
      sent: result.sent,
      errors: result.errors
    });

    console.log(`✅ Sequence processing complete in ${duration}ms`);

    return NextResponse.json({
      success: true,
      duration: `${duration}ms`,
      result
    });

  } catch (error) {
    console.error('Cron job error:', error);

    // Log the error
    await logCronError(error);

    return NextResponse.json(
      {
        error: 'Failed to process email sequences',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggering
export async function POST(request: NextRequest) {
  // For manual testing, you might want to add additional auth here
  return GET(request);
}

/**
 * Log successful cron run
 */
async function logCronRun(stats: {
  duration: number;
  processed: number;
  sent: number;
  errors: number;
}) {
  try {
    await supabaseAdmin
      .from('cron_logs')
      .insert({
        job_name: 'process_email_sequences',
        status: 'success',
        duration_ms: stats.duration,
        details: stats,
        created_at: new Date().toISOString()
      });
  } catch (error) {
    console.error('Failed to log cron run:', error);
  }
}

/**
 * Log cron error
 */
async function logCronError(error: any) {
  try {
    await supabaseAdmin
      .from('cron_logs')
      .insert({
        job_name: 'process_email_sequences',
        status: 'error',
        error_message: error instanceof Error ? error.message : 'Unknown error',
        details: {
          stack: error instanceof Error ? error.stack : undefined
        },
        created_at: new Date().toISOString()
      });
  } catch (logError) {
    console.error('Failed to log cron error:', logError);
  }
}