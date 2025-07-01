import { NextRequest, NextResponse } from 'next/server';

// Legacy endpoint - redirects to new contact submission endpoint
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Forward to new contact endpoint
  const response = await fetch(new URL('/api/contact/submit', request.url), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Forward original headers
      'referer': request.headers.get('referer') || '',
      'x-forwarded-for': request.headers.get('x-forwarded-for') || '',
      'x-real-ip': request.headers.get('x-real-ip') || '',
      'user-agent': request.headers.get('user-agent') || ''
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  
  return NextResponse.json(data, { status: response.status });
}