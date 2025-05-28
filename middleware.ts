import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'bloom-admin-secret-key-change-in-production'
);

// List of protected routes - all admin pages except login
const protectedRoutes = [
  '/admin', // This will match all /admin/* routes
];

// Exclude login page from protection
const excludedRoutes = [
  '/admin/login',
  '/admin/test-login'
];

// Protected API routes
const protectedApiRoutes = [
  '/api/newsletter-admin',
  '/api/email-analytics',
  '/api/email-automations',
  '/api/chat-analytics',
  '/api/backup',
  '/api/admin/activity-log',
  '/api/blog-admin',
  '/api/recent-activity',
  '/api/generate-blog-image',
  '/api/upload-image',
  '/api/careers-application',
  '/api/analytics'
  // Note: /api/test-analytics is intentionally not protected for testing
];

async function verifyToken(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    console.error('[Middleware] JWT verification error:', error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Debug logging
  if (path.startsWith('/api/') || path.startsWith('/admin/')) {
    console.log(`[Middleware] Path: ${path}`);
    const adminToken = request.cookies.get('adminToken');
    console.log(`[Middleware] Admin token present: ${!!adminToken}`);
  }
  
  // Check if it's an excluded route (like login)
  const isExcludedRoute = excludedRoutes.some(route => path === route);
  
  // Check if the path is protected
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route)) && !isExcludedRoute;
  const isProtectedApiRoute = protectedApiRoutes.some(route => path.startsWith(route));
  
  if (isProtectedRoute || isProtectedApiRoute) {
    // Get token from cookie
    const token = request.cookies.get('adminToken')?.value;
    
    if (!token) {
      console.log(`[Middleware] No token for protected route: ${path}`);
      // Redirect to login if no token
      if (isProtectedApiRoute) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    // Verify token
    const decoded = await verifyToken(token);
    if (!decoded) {
      console.log(`[Middleware] Invalid token for protected route: ${path}`);
      // Clear invalid token and redirect to login
      const response = isProtectedApiRoute
        ? NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        : NextResponse.redirect(new URL('/admin/login', request.url));
      
      response.cookies.delete('adminToken');
      return response;
    }
    
    console.log(`[Middleware] Valid token for user: ${decoded.email}`);
    
    // Add user info to headers for API routes
    if (isProtectedApiRoute) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', decoded.userId || decoded.id);
      requestHeaders.set('x-user-email', decoded.email);
      requestHeaders.set('x-user-role', decoded.role);
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }
  }
  
  // Allow login page only if not authenticated
  if (path === '/admin/login') {
    const token = request.cookies.get('adminToken')?.value;
    if (token) {
      const decoded = await verifyToken(token);
      if (decoded) {
        return NextResponse.redirect(new URL('/admin/analytics', request.url));
      }
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/newsletter-admin',
    '/api/email-analytics',
    '/api/email-automations',
    '/api/chat-analytics',
    '/api/backup',
    '/api/admin/:path*',
    '/api/blog-admin',
    '/api/recent-activity',
    '/api/generate-blog-image',
    '/api/upload-image',
    '/api/careers-application',
    '/api/analytics'
  ]
};