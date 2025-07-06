import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Only allow in development or with a secret query param
  const secret = request.nextUrl.searchParams.get('secret');
  if (process.env.NODE_ENV !== 'development' && secret !== 'bloom-debug-2024') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const baseUrl = process.env.NODE_ENV === 'development' 
    ? `http://localhost:3000`
    : process.env.NEXT_PUBLIC_SITE_URL || 'https://bloompsychologynorthaustin.com';

  // Test the newsletter endpoint
  let endpointTest = { status: 'unknown', error: null };
  try {
    const testResponse = await fetch(`${baseUrl}/api/newsletter-signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test-debug@example.com',
        firstName: 'Debug',
        source: 'debug_test'
      })
    });
    
    const result = await testResponse.json();
    endpointTest = {
      status: testResponse.status,
      ok: testResponse.ok,
      result: result
    };
  } catch (error) {
    endpointTest = {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }

  return NextResponse.json({
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'not set',
      baseUrl: baseUrl,
      hasResendKey: !!process.env.RESEND_API_KEY,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    },
    endpointTest: endpointTest,
    timestamp: new Date().toISOString()
  });
}