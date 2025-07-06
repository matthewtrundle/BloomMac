import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase-unified';
import { enhancedEmailTemplates } from '@/lib/email-templates/enhanced-emails';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    
    // Get all email templates from database
    const { data: dbTemplates, error } = await supabase
      .from('email_templates')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Format database templates
    const formattedDbTemplates = dbTemplates.map(template => ({
      id: template.id,
      name: template.name,
      subject: template.subject,
      content: template.content,
      category: template.category,
      variables: template.variables || [],
      lastModified: template.updated_at,
      modifiedBy: template.created_by || 'System',
      source: 'database'
    }));

    // Format enhanced templates from code
    const formattedEnhancedTemplates = [];
    const sequences = [];
    
    Object.entries(enhancedEmailTemplates).forEach(([sequenceKey, sequence]) => {
      const sequenceInfo = {
        id: sequenceKey,
        name: getSequenceName(sequenceKey),
        emails: []
      };
      
      Object.entries(sequence).forEach(([emailKey, email]: [string, any]) => {
        const template = {
          id: `${sequenceKey}-${emailKey}`,
          name: `${getSequenceName(sequenceKey)} - ${getEmailName(emailKey)}`,
          subject: email.subject,
          content: typeof email.content === 'function' ? email.content('{{firstName}}') : email.content,
          category: sequenceKey,
          variables: ['firstName', 'unsubscribeLink'],
          lastModified: null,
          modifiedBy: 'System',
          source: 'enhanced',
          sequence: sequenceKey,
          step: emailKey,
          delay: email.delay
        };
        
        formattedEnhancedTemplates.push(template);
        sequenceInfo.emails.push({
          id: emailKey,
          name: getEmailName(emailKey),
          subject: email.subject,
          delay: email.delay
        });
      });
      
      sequences.push(sequenceInfo);
    });

    // Combine all templates
    const allTemplates = [...formattedDbTemplates, ...formattedEnhancedTemplates];

    return NextResponse.json({ 
      templates: allTemplates,
      sequences: sequences,
      stats: {
        databaseTemplates: formattedDbTemplates.length,
        enhancedTemplates: formattedEnhancedTemplates.length,
        totalTemplates: allTemplates.length
      }
    });

  } catch (error) {
    console.error('Error fetching email templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email templates', details: error.message },
      { status: 500 }
    );
  }
}

function getSequenceName(key: string): string {
  const names = {
    newsletter: 'Newsletter Welcome Series',
    contactFollowup: 'Contact Form Follow-up',
    bookingConfirmation: 'Booking Confirmations',
    leadNurture: 'Lead Nurture Campaign'
  };
  return names[key] || key;
}

function getEmailName(key: string): string {
  const names = {
    welcome: 'Welcome Email',
    day3: 'Day 3 Follow-up',
    day7: 'Week 1 Check-in',
    day14: '2 Week Follow-up',
    day30: 'Month 1 Check-in',
    immediate: 'Immediate Response',
    followup72: '72 Hour Follow-up',
    resources7: 'Week 1 Resources',
    confirmation: 'Booking Confirmation',
    reminder24: '24 Hour Reminder',
    followup48: '48 Hour Follow-up',
    thankYou: 'Thank You Email',
    helpful72: '72 Hour Check-in',
    successStory7: 'Success Story',
    readyWhen14: '2 Week Follow-up'
  };
  return names[key] || key;
}

export async function PUT(request: NextRequest) {
  try {
    const { id, subject, content } = await request.json();
    
    if (!id || !subject || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();
    
    const { data, error } = await supabase
      .from('email_templates')
      .update({
        subject,
        content,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      success: true,
      message: 'Template saved successfully',
      template: data
    });

  } catch (error) {
    console.error('Error updating email template:', error);
    return NextResponse.json(
      { error: 'Failed to update template', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, subject, content, category } = await request.json();
    
    if (!name || !subject || !content || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();
    
    const { data, error } = await supabase
      .from('email_templates')
      .insert({
        name,
        subject,
        content,
        category,
        variables: [],
        is_public: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      success: true,
      message: 'Template created successfully',
      template: data
    });

  } catch (error) {
    console.error('Error creating email template:', error);
    return NextResponse.json(
      { error: 'Failed to create template', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();
    
    const { error } = await supabase
      .from('email_templates')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting email template:', error);
    return NextResponse.json(
      { error: 'Failed to delete template', details: error.message },
      { status: 500 }
    );
  }
}