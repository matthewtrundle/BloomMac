import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  const supabase = createPublicClient();
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const token = searchParams.get('token'); // Optional security token

  if (!email) {
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Unsubscribe - Bloom Psychology</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            .error { color: #d32f2f; background: #ffebee; padding: 20px; border-radius: 8px; }
          </style>
        </head>
        <body>
          <h1>Unsubscribe Error</h1>
          <div class="error">
            <p>Invalid unsubscribe link. Email address is required.</p>
          </div>
        </body>
      </html>
    `, {
      status: 400,
      headers: { 'Content-Type': 'text/html' }
    });
  }

  try {
    // Update subscriber status to unsubscribed
    const { data, error } = await supabase
      .from('subscribers')
      .update({ 
        status: 'unsubscribed',
        updated_at: new Date().toISOString()
      })
      .eq('email', email.toLowerCase())
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Subscriber not found
        return new NextResponse(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Unsubscribe - Bloom Psychology</title>
              <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
                .warning { color: #f57c00; background: #fff3e0; padding: 20px; border-radius: 8px; }
                .logo { text-align: center; margin-bottom: 20px; }
              </style>
            </head>
            <body>
              <div class="logo">
                <img src="https://www.bloompsychologynorthaustin.com/images/Logo/logo.jpg" alt="Bloom Psychology" style="max-width: 120px;">
              </div>
              <h1>Already Unsubscribed</h1>
              <div class="warning">
                <p>The email address <strong>${email}</strong> is not found in our subscriber list or has already been unsubscribed.</p>
                <p>If you continue to receive emails, please contact us at <a href="mailto:support@bloompsychologynorthaustin.com">support@bloompsychologynorthaustin.com</a></p>
              </div>
            </body>
          </html>
        `, {
          status: 200,
          headers: { 'Content-Type': 'text/html' }
        });
      }
      throw error;
    }

    // Log the unsubscribe event
    await supabase
      .from('analytics_events')
      .insert({
        type: 'newsletter_unsubscribe',
        page: '/unsubscribe',
        session_id: crypto.randomUUID(),
        data: {
          email: email,
          unsubscribe_method: 'email_link',
          user_agent: request.headers.get('user-agent'),
          ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
        }
      });

    return new NextResponse(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Unsubscribed - Bloom Psychology</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px; 
              line-height: 1.6;
              color: #333;
            }
            .success { 
              color: #2e7d32; 
              background: #e8f5e8; 
              padding: 20px; 
              border-radius: 8px; 
              border-left: 4px solid #4caf50;
            }
            .logo { 
              text-align: center; 
              margin-bottom: 30px; 
            }
            .actions {
              margin-top: 30px;
              text-align: center;
            }
            .btn {
              display: inline-block;
              padding: 12px 24px;
              background: #6B21A8;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              margin: 10px;
            }
            .btn:hover {
              background: #553285;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              text-align: center;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="logo">
            <img src="https://www.bloompsychologynorthaustin.com/images/Logo/logo.jpg" alt="Bloom Psychology" style="max-width: 120px;">
          </div>
          
          <h1>Successfully Unsubscribed</h1>
          
          <div class="success">
            <p><strong>You have been successfully unsubscribed.</strong></p>
            <p>The email address <strong>${email}</strong> has been removed from our newsletter list.</p>
            <p>You will no longer receive marketing emails from Bloom Psychology.</p>
          </div>

          <p>We're sorry to see you go! If you unsubscribed by mistake, you can easily resubscribe at any time.</p>

          <div class="actions">
            <a href="https://www.bloompsychologynorthaustin.com/newsletter" class="btn">Resubscribe</a>
            <a href="https://www.bloompsychologynorthaustin.com" class="btn">Visit Our Website</a>
          </div>

          <div class="footer">
            <p>If you have any questions or concerns, please contact us:</p>
            <p>
              <strong>Bloom Psychology</strong><br>
              13706 N Highway 183, Suite 114<br>
              Austin, TX 78750<br>
              <a href="mailto:support@bloompsychologynorthaustin.com">support@bloompsychologynorthaustin.com</a>
            </p>
          </div>
        </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });

  } catch (error) {
    console.error('Unsubscribe error:', error);
    
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Unsubscribe Error - Bloom Psychology</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            .error { color: #d32f2f; background: #ffebee; padding: 20px; border-radius: 8px; }
          </style>
        </head>
        <body>
          <h1>Unsubscribe Error</h1>
          <div class="error">
            <p>We encountered an error processing your unsubscribe request.</p>
            <p>Please contact us directly at <a href="mailto:support@bloompsychologynorthaustin.com">support@bloompsychologynorthaustin.com</a></p>
          </div>
        </body>
      </html>
    `, {
      status: 500,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Handle POST requests for form-based unsubscribe
export async function POST(request: NextRequest) {
  const supabase = createPublicClient();
  
  try {
    const formData = await request.formData();
    const email = formData.get('email') as string;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Reuse the same logic as GET
    const url = new URL(request.url);
    url.searchParams.set('email', email);
    
    // Create a new request with the email as a query parameter
    const getRequest = new NextRequest(url.toString(), {
      method: 'GET',
      headers: request.headers
    });

    return await GET(getRequest);

  } catch (error) {
    console.error('POST unsubscribe error:', error);
    return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 });
  }
}