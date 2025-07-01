import { NextRequest, NextResponse } from 'next/server';

// Legacy endpoint - redirects to new auth endpoint
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Forward to new auth endpoint
  const response = await fetch(new URL('/api/admin/auth/login', request.url), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Forward original headers
      'x-forwarded-for': request.headers.get('x-forwarded-for') || '',
      'x-real-ip': request.headers.get('x-real-ip') || '',
      'user-agent': request.headers.get('user-agent') || ''
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  
  // Create new response with same status
  const newResponse = NextResponse.json(data, { status: response.status });
  
  // Copy cookies from auth response
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'set-cookie') {
      newResponse.headers.append(key, value);
    }
  });
  
  return newResponse;
}