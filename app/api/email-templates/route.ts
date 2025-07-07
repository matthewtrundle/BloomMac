import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase-unified';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    
    // Get all email templates from database
    const { data: templates, error } = await supabase
      .from('email_templates')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    // Format templates for consistency
    const formattedTemplates = templates.map(template => ({
      id: template.id,
      name: template.name,
      subject: template.subject,
      content: template.content,
      category: template.category,
      variables: template.variables || ['firstName', 'lastName', 'email', 'unsubscribeLink'],
      lastModified: template.updated_at,
      modifiedBy: template.created_by || 'System',
      source: 'database'
    }));

    return NextResponse.json({ 
      templates: formattedTemplates,
      stats: {
        totalTemplates: formattedTemplates.length
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
