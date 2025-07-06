import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get the base URL for API calls (localhost in dev, production URL in prod)
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? `http://localhost:3000`
      : process.env.NEXT_PUBLIC_SITE_URL || 'https://bloompsychologynorthaustin.com';
    
    // Forward to the main newsletter signup endpoint
    const response = await fetch(`${baseUrl}/api/newsletter-signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...body,
        source: 'profile_settings'
      })
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('Newsletter signup forwarding failed:', result);
      return NextResponse.json(result, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      isSubscribed: true
    });

  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        body: body,
        baseUrl: baseUrl
      });
    }
    
    // Return more informative error message
    return NextResponse.json(
      { 
        error: 'Failed to subscribe to newsletter',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}