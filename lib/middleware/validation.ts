import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError, ZodSchema } from 'zod';

export class ValidationError extends Error {
  constructor(
    public errors: Array<{ path: string; message: string }>,
    message = 'Validation failed'
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Middleware to validate request body against a Zod schema
 */
export function validateRequest<T>(schema: ZodSchema<T>) {
  return async (
    handler: (req: NextRequest, validated: T) => Promise<Response>
  ) => {
    return async (req: NextRequest) => {
      try {
        // Parse request body
        const body = await req.json();
        
        // Validate against schema
        const validated = schema.parse(body);
        
        // Call the handler with validated data
        return handler(req, validated);
      } catch (error) {
        if (error instanceof ZodError) {
          // Format Zod errors
          const errors = error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }));
          
          return NextResponse.json(
            {
              error: 'Validation failed',
              details: errors
            },
            { status: 400 }
          );
        }
        
        if (error instanceof SyntaxError) {
          return NextResponse.json(
            { error: 'Invalid JSON in request body' },
            { status: 400 }
          );
        }
        
        // Re-throw other errors
        throw error;
      }
    };
  };
}

/**
 * Validate query parameters
 */
export function validateQuery<T>(schema: ZodSchema<T>) {
  return (
    handler: (req: NextRequest, validated: T) => Promise<Response>
  ) => {
    return async (req: NextRequest) => {
      try {
        const { searchParams } = new URL(req.url);
        const query = Object.fromEntries(searchParams.entries());
        
        // Validate query parameters
        const validated = schema.parse(query);
        
        // Call the handler with validated data
        return handler(req, validated);
      } catch (error) {
        if (error instanceof ZodError) {
          const errors = error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }));
          
          return NextResponse.json(
            {
              error: 'Invalid query parameters',
              details: errors
            },
            { status: 400 }
          );
        }
        
        throw error;
      }
    };
  };
}

/**
 * Common validation schemas
 */
export const commonSchemas = {
  // Pagination
  pagination: z.object({
    limit: z.string().regex(/^\d+$/).transform(Number).default('50'),
    offset: z.string().regex(/^\d+$/).transform(Number).default('0'),
    sort: z.enum(['asc', 'desc']).optional(),
    sortBy: z.string().optional()
  }),
  
  // Email
  email: z.string().email('Invalid email address'),
  
  // Password (minimum 8 chars, at least one number and letter)
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/(?=.*[A-Za-z])(?=.*\d)/, 'Password must contain at least one letter and one number'),
  
  // Phone number (basic validation)
  phone: z.string()
    .regex(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number')
    .optional(),
  
  // UUID
  uuid: z.string().uuid('Invalid ID format'),
  
  // Date range
  dateRange: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional()
  })
};

/**
 * Sanitize HTML content to prevent XSS
 */
export function sanitizeHtml(html: string): string {
  // Basic HTML sanitization - in production, use a library like DOMPurify
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/&(?!(amp|lt|gt|quot|#039);)/g, '&amp;');
}

/**
 * Validate and sanitize user input
 */
export const sanitizers = {
  // Remove any HTML tags
  stripHtml: (input: string) => input.replace(/<[^>]*>/g, ''),
  
  // Trim whitespace
  trim: (input: string) => input.trim(),
  
  // Normalize whitespace
  normalizeWhitespace: (input: string) => input.replace(/\s+/g, ' ').trim(),
  
  // Escape SQL special characters (basic - use parameterized queries instead)
  escapeSql: (input: string) => input.replace(/['";\\]/g, '\\$&'),
  
  // Validate and clean file paths
  cleanPath: (path: string) => path.replace(/[^a-zA-Z0-9\-_\/\.]/g, '')
};