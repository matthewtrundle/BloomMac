import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase-unified';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    
    // Get all email templates from both tables
    const [templatesResult, customTemplatesResult, sequenceEmailsResult] = await Promise.all([
      // Standard templates
      supabase
        .from('email_templates')
        .select('*')
        .order('name', { ascending: true }),
      
      // Custom templates
      supabase
        .from('email_templates_custom')
        .select('*')
        .order('sequence', { ascending: true })
        .order('step', { ascending: true }),
      
      // Sequence emails (automated) - only from active sequences
      supabase
        .from('sequence_emails')
        .select(`
          *,
          email_sequences!inner (
            name,
            trigger,
            status
          )
        `)
        .eq('email_sequences.status', 'active')
        .order('sequence_id', { ascending: true })
        .order('position', { ascending: true })
    ]);

    if (templatesResult.error) throw templatesResult.error;
    if (customTemplatesResult.error) throw customTemplatesResult.error;
    if (sequenceEmailsResult.error) throw sequenceEmailsResult.error;

    const allTemplates = [];

    // Format standard templates
    if (templatesResult.data) {
      templatesResult.data.forEach(template => {
        allTemplates.push({
          id: template.id,
          name: template.name,
          subject: template.subject,
          content: template.content,
          category: template.category,
          variables: template.variables || ['firstName', 'lastName', 'email', 'unsubscribeLink'],
          lastModified: template.updated_at,
          modifiedBy: template.created_by || 'System',
          source: 'database'
        });
      });
    }

    // Format custom templates
    if (customTemplatesResult.data) {
      customTemplatesResult.data.forEach(template => {
        allTemplates.push({
          id: template.id,
          name: `${template.sequence} - ${template.step}`,
          subject: template.subject,
          content: template.content,
          category: template.sequence || 'custom',
          sequence: template.sequence,
          step: template.step,
          lastModified: template.updated_at,
          modifiedBy: template.modified_by || 'System',
          source: 'database'
        });
      });
    }

    // Format sequence emails (automated)
    if (sequenceEmailsResult.data) {
      sequenceEmailsResult.data.forEach(email => {
        const sequenceName = email.email_sequences?.name || 'Unknown Sequence';
        const trigger = email.email_sequences?.trigger || 'unknown';
        
        allTemplates.push({
          id: email.id,
          name: `${sequenceName} - Email ${email.position}`,
          subject: email.subject,
          content: email.content,
          category: 'automated',
          sequence: sequenceName,
          trigger: trigger,
          position: email.position,
          delay: `${email.delay_days || 0} days, ${email.delay_hours || 0} hours`,
          lastModified: email.updated_at,
          modifiedBy: 'System',
          source: 'enhanced',
          sequenceActive: email.email_sequences?.status === 'active'
        });
      });
    }

    return NextResponse.json({ 
      templates: allTemplates,
      stats: {
        totalTemplates: allTemplates.length,
        standardTemplates: templatesResult.data?.length || 0,
        customTemplates: customTemplatesResult.data?.length || 0,
        automatedTemplates: sequenceEmailsResult.data?.length || 0
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

export async function PUT(request: NextRequest) {
  try {
    const { id, subject, content, source } = await request.json();
    
    if (!id || !subject || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();
    let data, error;

    // Check which table to update based on the template source
    // First, try to find the template in each table
    const [templateCheck, customCheck, sequenceCheck] = await Promise.all([
      supabase.from('email_templates').select('id').eq('id', id).single(),
      supabase.from('email_templates_custom').select('id').eq('id', id).single(),
      supabase.from('sequence_emails').select('id').eq('id', id).single()
    ]);

    if (!templateCheck.error) {
      // Update in email_templates table
      const result = await supabase
        .from('email_templates')
        .update({
          subject,
          content,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      data = result.data;
      error = result.error;
    } else if (!customCheck.error) {
      // Update in email_templates_custom table
      const result = await supabase
        .from('email_templates_custom')
        .update({
          subject,
          content,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      data = result.data;
      error = result.error;
    } else if (!sequenceCheck.error) {
      // Update in sequence_emails table
      const result = await supabase
        .from('sequence_emails')
        .update({
          subject,
          content,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      data = result.data;
      error = result.error;
    } else {
      return NextResponse.json(
        { error: 'Template not found in any table' },
        { status: 404 }
      );
    }

    if (error) {
        console.error('Supabase error updating template:', error);
        throw error;
    }

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
        variables: ['firstName', 'lastName', 'email', 'unsubscribeLink'],
        is_public: true,
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
