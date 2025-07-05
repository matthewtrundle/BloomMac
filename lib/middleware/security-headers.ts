import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Security headers configuration
 */
export const securityHeaders = {
  // Prevent clickjacking attacks
  'X-Frame-Options': 'DENY',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Enable browser XSS protection (legacy browsers)
  'X-XSS-Protection': '1; mode=block',
  
  // Control referrer information
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions Policy (formerly Feature Policy)
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  
  // Strict Transport Security (HSTS) - only in production
  ...(process.env.NODE_ENV === 'production' && {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
  })
};

/**
 * Content Security Policy configuration
 */
export function getCSPHeader(nonce?: string): string {
  const directives = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      nonce ? `'nonce-${nonce}'` : "'unsafe-inline'",
      "'unsafe-eval'", // Required for Next.js in dev
      'https://calendly.com',
      'https://assets.calendly.com',
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com'
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Required for styled-components/emotion
      'https://fonts.googleapis.com',
      'https://calendly.com'
    ],
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https:',
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com'
    ],
    'font-src': [
      "'self'",
      'https://fonts.gstatic.com',
      'data:'
    ],
    'connect-src': [
      "'self'",
      'https://*.supabase.co',
      'wss://*.supabase.co',
      'https://calendly.com',
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com',
      process.env.NODE_ENV === 'development' ? 'ws://localhost:*' : ''
    ].filter(Boolean),
    'media-src': ["'self'"],
    'object-src': ["'none'"],
    'child-src': ["'self'", 'https://calendly.com'],
    'frame-src': ["'self'", 'https://calendly.com'],
    'worker-src': ["'self'", 'blob:'],
    'form-action': ["'self'"],
    'base-uri': ["'self'"],
    'manifest-src': ["'self'"],
    'upgrade-insecure-requests': process.env.NODE_ENV === 'production' ? [''] : undefined
  };

  return Object.entries(directives)
    .filter(([, values]) => values && values.length > 0)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
}

/**
 * Apply security headers to response
 */
export function applySecurityHeaders(
  response: NextResponse,
  request: NextRequest,
  nonce?: string
): NextResponse {
  // Apply all security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    if (value) {
      response.headers.set(key, value);
    }
  });

  // Apply CSP header
  const cspHeader = getCSPHeader(nonce);
  response.headers.set('Content-Security-Policy', cspHeader);

  // Additional headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Prevent caching of API responses by default
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    
    // CORS headers are handled separately
  }

  return response;
}

/**
 * CORS configuration
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_SITE_URL || '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400', // 24 hours
};

/**
 * Apply CORS headers for API routes
 */
export function applyCorsHeaders(
  response: NextResponse,
  request: NextRequest
): NextResponse {
  const origin = request.headers.get('origin');
  
  // Check if origin is allowed
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_SITE_URL,
    'https://bloompsychologynorthaustin.com',
    'https://www.bloompsychologynorthaustin.com',
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '',
    process.env.NODE_ENV === 'development' ? 'http://localhost:3002' : ''
  ].filter(Boolean);

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  } else if (process.env.NODE_ENV === 'development') {
    // More permissive in development
    response.headers.set('Access-Control-Allow-Origin', '*');
  }

  // Apply other CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    if (key !== 'Access-Control-Allow-Origin') {
      response.headers.set(key, value);
    }
  });

  return response;
}

/**
 * Generate a nonce for CSP
 */
export function generateNonce(): string {
  return Buffer.from(crypto.randomUUID()).toString('base64');
}