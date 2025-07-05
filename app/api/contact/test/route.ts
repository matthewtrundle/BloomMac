import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Test contact route - received:', body);
    
    // Extract and normalize data
    const name = body.name || `${body.firstName || ''} ${body.lastName || ''}`.trim();
    const message = body.message || body.concerns || '';
    const { email, phone, service } = body;
    
    console.log('Normalized data:', { name, email, message });
    
    // Create public Supabase client
    const supabase = createPublicClient();
    
    // Call RPC function
    const { data, error } = await supabase
      .rpc('submit_contact_form', {
        contact_data: {
          p_name: name,
          p_email: email,
          p_phone: phone || null,
          p_service: service || 'general',
          p_message: message,
          p_page: '/test',
          p_user_agent: 'test',
          p_ip_address: '127.0.0.1'
        }
      });
    
    console.log('RPC result:', { data, error });
    
    if (error) {
      return NextResponse.json(
        { error: 'Database error', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Test submission successful',
      id: data?.id
    });
    
  } catch (error) {
    console.error('Test route error:', error);
    return NextResponse.json(
      { 
        error: 'Test route error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}