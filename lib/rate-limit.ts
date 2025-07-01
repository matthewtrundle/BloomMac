import { NextRequest } from 'next/server';
import { headers } from 'next/headers';

// In-memory store for rate limiting (consider Redis for production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max requests per interval
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: Date;
}

// Default rate limits for different endpoint types
export const RATE_LIMITS = {
  // Strict limits for public form submissions
  contact: { interval: 60 * 60 * 1000, uniqueTokenPerInterval: 3 }, // 3 per hour
  newsletter: { interval: 60 * 60 * 1000, uniqueTokenPerInterval: 5 }, // 5 per hour
  careers: { interval: 60 * 60 * 1000, uniqueTokenPerInterval: 2 }, // 2 per hour
  
  // More lenient for authenticated endpoints
  emailSend: { interval: 60 * 1000, uniqueTokenPerInterval: 10 }, // 10 per minute
  
  // Very strict for auth endpoints
  login: { interval: 15 * 60 * 1000, uniqueTokenPerInterval: 5 }, // 5 per 15 minutes
  signup: { interval: 60 * 60 * 1000, uniqueTokenPerInterval: 3 }, // 3 per hour
  
  // General API limit
  api: { interval: 60 * 1000, uniqueTokenPerInterval: 60 }, // 60 per minute
};

export async function rateLimit(
  config: RateLimitConfig,
  identifier?: string
): Promise<RateLimitResult> {
  // Get identifier from IP address if not provided
  if (!identifier) {
    const headersList = headers();
    identifier = 
      headersList.get('x-forwarded-for') || 
      headersList.get('x-real-ip') || 
      'anonymous';
  }
  
  const now = Date.now();
  const resetTime = now + config.interval;
  
  // Get or create rate limit entry
  const key = `${identifier}:${config.interval}`;
  const entry = rateLimitStore.get(key);
  
  if (!entry || entry.resetTime < now) {
    // Create new entry
    rateLimitStore.set(key, { count: 1, resetTime });
    return {
      success: true,
      limit: config.uniqueTokenPerInterval,
      remaining: config.uniqueTokenPerInterval - 1,
      reset: new Date(resetTime),
    };
  }
  
  // Check if limit exceeded
  if (entry.count >= config.uniqueTokenPerInterval) {
    return {
      success: false,
      limit: config.uniqueTokenPerInterval,
      remaining: 0,
      reset: new Date(entry.resetTime),
    };
  }
  
  // Increment count
  entry.count++;
  rateLimitStore.set(key, entry);
  
  return {
    success: true,
    limit: config.uniqueTokenPerInterval,
    remaining: config.uniqueTokenPerInterval - entry.count,
    reset: new Date(entry.resetTime),
  };
}

// Helper function for middleware
export async function checkRateLimit(
  request: NextRequest,
  config: RateLimitConfig
): Promise<Response | null> {
  const identifier = 
    request.headers.get('x-forwarded-for') || 
    request.headers.get('x-real-ip') ||
    request.ip ||
    'anonymous';
    
  const result = await rateLimit(config, identifier);
  
  if (!result.success) {
    return new Response(
      JSON.stringify({
        error: 'Too many requests',
        message: `Rate limit exceeded. Please try again after ${result.reset.toISOString()}`,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': result.limit.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': result.reset.toISOString(),
          'Retry-After': Math.ceil((result.reset.getTime() - Date.now()) / 1000).toString(),
        },
      }
    );
  }
  
  // Add rate limit headers to successful responses
  const headers = new Headers();
  headers.set('X-RateLimit-Limit', result.limit.toString());
  headers.set('X-RateLimit-Remaining', result.remaining.toString());
  headers.set('X-RateLimit-Reset', result.reset.toISOString());
  
  return null;
}