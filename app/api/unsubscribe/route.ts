import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase-unified';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    
    // Unsubscribe the user
    const { error } = await supabase
      .from('subscribers')
      .update({ 
        subscribed: false,
        unsubscribed_at: new Date().toISOString()
      })
      .eq('email', email);

    if (error) throw error;

    // Return a success page
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Unsubscribed - Bloom Psychology</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
          .success { color: #28a745; }
        </style>
      </head>
      <body>
        <h1 class="success">Successfully Unsubscribed</h1>
        <p>You have been unsubscribed from our mailing list.</p>
        <p>Email: <strong>${email}</strong></p>
        <p><a href="/">Return to Bloom Psychology</a></p>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });

  } catch (error) {
    console.error('Error unsubscribing:', error);
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Error - Bloom Psychology</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
          .error { color: #dc3545; }
        </style>
      </head>
      <body>
        <h1 class="error">Error</h1>
        <p>There was an error processing your unsubscribe request.</p>
        <p><a href="/">Return to Bloom Psychology</a></p>
      </body>
      </html>
    `, {
      status: 500,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

export async function POST(request: NextRequest) {
  // Handle POST requests the same way as GET for form submissions
  return GET(request);
}
