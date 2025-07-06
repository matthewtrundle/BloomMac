import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase-unified';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    
    const { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(subscribers);
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscribers', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, source = 'admin' } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    
    const { data, error } = await supabase
      .from('subscribers')
      .insert({
        email: email.toLowerCase().trim(),
        source,
        subscribed: true,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Email already subscribed' }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error adding subscriber:', error);
    return NextResponse.json(
      { error: 'Failed to add subscriber', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    
    const { error } = await supabase
      .from('subscribers')
      .update({ 
        subscribed: false,
        unsubscribed_at: new Date().toISOString()
      })
      .eq('email', email);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error unsubscribing:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe', details: error.message },
      { status: 500 }
    );
  }
}
