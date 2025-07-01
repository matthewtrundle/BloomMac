import { NextRequest, NextResponse } from 'next/server';

// Legacy endpoint - redirects to new careers endpoint
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  
  // Forward to new careers endpoint
  const response = await fetch(new URL('/api/careers/apply', request.url), {
    method: 'POST',
    body: formData,
    headers: {
      // Forward original headers
      'referer': request.headers.get('referer') || '',
      'x-forwarded-for': request.headers.get('x-forwarded-for') || '',
      'x-real-ip': request.headers.get('x-real-ip') || '',
      'user-agent': request.headers.get('user-agent') || ''
    }
  });

  const data = await response.json();
  
  return NextResponse.json(data, { status: response.status });
}