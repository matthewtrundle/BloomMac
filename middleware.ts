import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of protected routes
const protectedRoutes = [
  '/admin',
];

export function middleware(request: NextRequest) {
  // Check if the path starts with any protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Check for auth cookie
    const authCookie = request.cookies.get('bloom-admin-auth');
    
    // If no auth cookie, redirect to login
    if (!authCookie?.value) {
      const loginUrl = new URL('/api/admin-login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      
      // If this is an admin page request, show the login form
      if (request.headers.get('accept')?.includes('text/html')) {
        return NextResponse.redirect(loginUrl);
      }
      
      // For API requests, return 401
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    // Validate the auth token format (should be base64 encoded and start with 'bloom-admin-')
    try {
      const decoded = Buffer.from(authCookie.value, 'base64').toString();
      if (!decoded.startsWith('bloom-admin-')) {
        throw new Error('Invalid token format');
      }
    } catch (error) {
      // Invalid token, redirect to login
      const loginUrl = new URL('/api/admin-login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      
      if (request.headers.get('accept')?.includes('text/html')) {
        return NextResponse.redirect(loginUrl);
      }
      
      return new NextResponse('Unauthorized', { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};