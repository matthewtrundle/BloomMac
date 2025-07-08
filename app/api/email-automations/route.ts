import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase-unified';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    
    // Get active email sequences with their emails
    const { data: sequences, error: sequencesError } = await supabase
      .from('email_sequences')
      .select(`
        *,
        sequence_emails (
          id,
          position,
          subject,
          delay_days,
          delay_hours
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: true });
    
    if (sequencesError) throw sequencesError;
    
    // Format the sequences for the UI
    const formattedSequences = sequences?.map(seq => ({
      id: seq.id,
      name: seq.name,
      trigger: seq.trigger,
      status: seq.status,
      description: seq.description,
      emailCount: seq.sequence_emails?.length || 0,
      emails: seq.sequence_emails?.map((email: any) => ({
        position: email.position,
        subject: email.subject,
        delay: `${email.delay_days || 0} days, ${email.delay_hours || 0} hours`
      })).sort((a: any, b: any) => a.position - b.position) || []
    })) || [];
    
    // Get enrollment stats
    const { data: enrollmentStats, error: statsError } = await supabase
      .from('sequence_enrollments')
      .select('sequence_id, status')
      .eq('status', 'active');
    
    if (statsError) {
      console.error('Error fetching enrollment stats:', statsError);
    }
    
    // Count active enrollments per sequence
    const enrollmentCounts: Record<string, number> = {};
    enrollmentStats?.forEach(enrollment => {
      enrollmentCounts[enrollment.sequence_id] = (enrollmentCounts[enrollment.sequence_id] || 0) + 1;
    });
    
    // Add enrollment counts to sequences
    const sequencesWithStats = formattedSequences.map(seq => ({
      ...seq,
      activeEnrollments: enrollmentCounts[seq.id] || 0
    }));
    
    return NextResponse.json({
      sequences: sequencesWithStats,
      totalSequences: sequencesWithStats.length,
      status: 'active',
      message: 'Email automation system is active'
    });

  } catch (error) {
    console.error('Error fetching email automations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email automations', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, trigger, templates } = await request.json();
    
    // Placeholder for creating automations
    return NextResponse.json({
      success: true,
      message: 'Automation feature coming soon',
      automation: null
    });

  } catch (error) {
    console.error('Error creating automation:', error);
    return NextResponse.json(
      { error: 'Failed to create automation', details: error.message },
      { status: 500 }
    );
  }
}