import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { applySecurityHeaders, applyCorsHeaders } from '@/lib/middleware/security-headers';

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
  '/api/email-templates',
  '/api/chat-analytics',
  '/api/backup',
  '/api/admin/activity-log',
  '/api/admin/contacts',
  '/api/admin/careers',
  '/api/admin/analytics',
  '/api/blog-admin',
  '/api/blog-admin-supabase',
  '/api/upload-blog-image',
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
  
  // Admin auth routes should also get headers but don't require protection
  const isAdminAuthRoute = path.startsWith('/api/admin/auth/');
  
  if (isProtectedRoute || isProtectedApiRoute || isAdminAuthRoute) {
    // Get token from cookie
    const token = request.cookies.get('adminToken')?.value;
    
    if (!token) {
      // For admin auth routes, allow access without token (they handle their own auth)
      if (isAdminAuthRoute && !isProtectedApiRoute) {
        return NextResponse.next();
      }
      
      console.log(`[Middleware] No token for protected route: ${path}`);
      // Redirect to login if no token
      if (isProtectedApiRoute) {
        let response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        response = applySecurityHeaders(response, request);
        response = applyCorsHeaders(response, request);
        return response;
      }
      let response = NextResponse.redirect(new URL('/admin/login', request.url));
      response = applySecurityHeaders(response, request);
      return response;
    }
    
    // Verify token
    const decoded = await verifyToken(token);
    if (!decoded) {
      console.log(`[Middleware] Invalid token for protected route: ${path}`);
      // Clear invalid token and redirect to login
      let response = isProtectedApiRoute
        ? NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        : NextResponse.redirect(new URL('/admin/login', request.url));
      
      response.cookies.delete('adminToken');
      response = applySecurityHeaders(response, request);
      if (isProtectedApiRoute) {
        response = applyCorsHeaders(response, request);
      }
      return response;
    }
    
    console.log(`[Middleware] Valid token for user: ${decoded.email}`);
    
    // Add user info to headers for API routes
    if (isProtectedApiRoute || isAdminAuthRoute) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', decoded.userId || decoded.id);
      requestHeaders.set('x-user-email', decoded.email);
      requestHeaders.set('x-user-role', decoded.role);
      
      let response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
      response = applySecurityHeaders(response, request);
      response = applyCorsHeaders(response, request);
      return response;
    }
  }
  
  // Allow login page only if not authenticated
  if (path === '/admin/login') {
    const token = request.cookies.get('adminToken')?.value;
    if (token) {
      const decoded = await verifyToken(token);
      if (decoded) {
        let response = NextResponse.redirect(new URL('/admin/analytics', request.url));
        response = applySecurityHeaders(response, request);
        return response;
      }
    }
  }
  
  // Default response
  let response = NextResponse.next();
  
  // Apply security headers to all responses
  response = applySecurityHeaders(response, request);
  
  // Apply CORS headers to API routes
  if (path.startsWith('/api/')) {
    response = applyCorsHeaders(response, request);
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ]
};