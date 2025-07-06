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
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
}