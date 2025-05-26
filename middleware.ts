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
    if (!authCookie?.value || authCookie.value !== process.env.ADMIN_AUTH_TOKEN) {
      const loginUrl = new URL('/api/admin-login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      
      // If this is an admin page request, show the login form
      if (request.headers.get('accept')?.includes('text/html')) {
        return NextResponse.redirect(loginUrl);
      }
      
      // For API requests, return 401
      return new NextResponse('Unauthorized', { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};