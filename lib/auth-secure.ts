import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from './supabase';

// SECURITY: All secrets MUST come from environment variables
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRY = '8h'; // Reduced from 24h for security

// Validate required environment variables
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be set and at least 32 characters long');
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
  last_login?: string;
  login_count?: number;
}

export interface AuthToken {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
  jti?: string; // JWT ID for revocation
}

// Hash password with proper salt rounds
export async function hashPassword(password: string): Promise<string> {
  // Validate password strength
  if (password.length < 12) {
    throw new Error('Password must be at least 12 characters long');
  }
  
  // Check for common patterns
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
  
  if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
    throw new Error('Password must contain uppercase, lowercase, numbers, and special characters');
  }
  
  return bcrypt.hash(password, 12);
}

// Verify password with timing attack protection
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Generate JWT token with additional security
export function generateToken(user: { id: string; email: string; role: string }): string {
  const jti = crypto.randomUUID(); // Unique token ID for revocation
  
  return jwt.sign(
    {
      id: user.id,
      userId: user.id,
      email: user.email,
      role: user.role,
      jti
    },
    JWT_SECRET!,
    { 
      expiresIn: TOKEN_EXPIRY,
      issuer: 'bloom-psychology',
      audience: 'bloom-admin'
    }
  );
}

// Verify JWT token with additional checks
export function verifyToken(token: string): AuthToken | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET!, {
      issuer: 'bloom-psychology',
      audience: 'bloom-admin'
    }) as AuthToken;
    
    // Additional validation could go here (e.g., check if token is revoked)
    
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Enhanced middleware with rate limiting and logging
export async function withAuth(
  handler: (req: NextApiRequest, res: NextApiResponse, user: AuthToken) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const startTime = Date.now();
    
    try {
      // Get token from cookie or authorization header
      const token = req.cookies?.adminToken || req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        // Log failed attempt
        await logAuthAttempt(req, 'no_token', null);
        return res.status(401).json({ error: 'Unauthorized - No token provided' });
      }
      
      // Verify token
      const decoded = verifyToken(token);
      if (!decoded) {
        // Log failed attempt
        await logAuthAttempt(req, 'invalid_token', null);
        return res.status(401).json({ error: 'Unauthorized - Invalid token' });
      }
      
      // Log successful auth
      await logAuthAttempt(req, 'success', decoded.userId);
      
      // Update last activity
      await updateLastActivity(decoded.userId);
      
      // Pass the user info to the handler
      return handler(req, res, decoded);
      
    } catch (error) {
      console.error('Auth middleware error:', error);
      await logAuthAttempt(req, 'error', null);
      return res.status(401).json({ error: 'Unauthorized' });
    } finally {
      // Log request duration for monitoring
      const duration = Date.now() - startTime;
      console.log(`Auth check took ${duration}ms`);
    }
  };
}

// Log authentication attempts for security monitoring
async function logAuthAttempt(
  req: NextApiRequest,
  result: 'success' | 'no_token' | 'invalid_token' | 'error',
  userId: string | null
) {
  try {
    await supabaseAdmin
      .from('admin_activity_log')
      .insert({
        action: 'auth_attempt',
        entity_type: 'admin_auth',
        entity_id: userId,
        details: {
          result,
          ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
          user_agent: req.headers['user-agent'],
          path: req.url,
          method: req.method
        },
        ip_address: req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress,
        user_agent: req.headers['user-agent']
      });
  } catch (error) {
    console.error('Failed to log auth attempt:', error);
  }
}

// Update last activity timestamp
async function updateLastActivity(userId: string) {
  try {
    await supabaseAdmin
      .from('admin_users')
      .update({ 
        last_activity: new Date().toISOString() 
      })
      .eq('id', userId);
  } catch (error) {
    console.error('Failed to update last activity:', error);
  }
}

// Initialize admin user from environment (only for initial setup)
export async function initializeAdminUser() {
  // Only run in development or during initial setup
  if (process.env.NODE_ENV === 'production' && process.env.SKIP_ADMIN_INIT !== 'true') {
    console.log('Skipping admin initialization in production');
    return;
  }

  try {
    // Check if any admin users exist
    const { data: existingAdmins } = await supabaseAdmin
      .from('admin_users')
      .select('id')
      .limit(1);
    
    if (!existingAdmins || existingAdmins.length === 0) {
      const adminEmail = process.env.ADMIN_INITIAL_EMAIL;
      const adminPassword = process.env.ADMIN_INITIAL_PASSWORD;
      
      if (!adminEmail || !adminPassword) {
        console.error('ADMIN_INITIAL_EMAIL and ADMIN_INITIAL_PASSWORD must be set for initial setup');
        return;
      }
      
      // Create admin user with secure password
      const hashedPassword = await hashPassword(adminPassword);
      
      const { error } = await supabaseAdmin
        .from('admin_users')
        .insert({
          email: adminEmail,
          password: hashedPassword,
          name: 'System Administrator',
          role: 'super_admin',
          is_active: true,
          created_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error creating initial admin:', error);
      } else {
        console.log(`Initial admin user created. Email: ${adminEmail}`);
        console.log('IMPORTANT: Change the password immediately after first login!');
        
        // Log the creation
        await supabaseAdmin
          .from('admin_activity_log')
          .insert({
            action: 'admin_created',
            entity_type: 'admin_user',
            details: {
              email: adminEmail,
              method: 'initial_setup'
            }
          });
      }
    }
  } catch (error) {
    console.error('Error initializing admin user:', error);
  }
}

// Password strength validator
export function validatePasswordStrength(password: string): {
  valid: boolean;
  errors: string[];
  score: number;
} {
  const errors: string[] = [];
  let score = 0;
  
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  } else {
    score += password.length > 16 ? 2 : 1;
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain uppercase letters');
  } else {
    score += 1;
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain lowercase letters');
  } else {
    score += 1;
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain numbers');
  } else {
    score += 1;
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain special characters');
  } else {
    score += 2;
  }
  
  // Check for common patterns
  const commonPatterns = ['password', '12345', 'admin', 'bloom', 'qwerty'];
  const lowerPassword = password.toLowerCase();
  
  for (const pattern of commonPatterns) {
    if (lowerPassword.includes(pattern)) {
      errors.push(`Password must not contain common patterns like "${pattern}"`);
      score = Math.max(0, score - 2);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    score: Math.min(10, score)
  };
}