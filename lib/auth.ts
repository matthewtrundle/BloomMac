import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from './supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'bloom-admin-secret-key-change-in-production';
const TOKEN_EXPIRY = '24h';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
}

export interface AuthToken {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(user: { id: string; email: string; role: string }): string {
  return jwt.sign(
    {
      id: user.id,
      userId: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

// Verify JWT token
export function verifyToken(token: string): AuthToken | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthToken;
  } catch (error) {
    return null;
  }
}

// Middleware to check authentication
export async function withAuth(
  handler: (req: NextApiRequest, res: NextApiResponse, user: AuthToken) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Get token from cookie or authorization header
      const token = req.cookies?.adminToken || req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized - No token provided' });
      }
      
      // Verify token
      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ error: 'Unauthorized - Invalid token' });
      }
      
      // Pass the user info to the handler
      return handler(req, res, decoded);
      
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({ error: 'Unauthorized' });
    }
  };
}

// Create default admin user if none exists
export async function ensureAdminUser() {
  try {
    // Check if any admin users exist
    const { data: existingAdmins } = await supabaseAdmin
      .from('admin_users')
      .select('id')
      .limit(1);
    
    if (!existingAdmins || existingAdmins.length === 0) {
      // Create default admin user
      const defaultPassword = 'bloom-admin-2024'; // Change this immediately after first login
      const hashedPassword = await hashPassword(defaultPassword);
      
      const { error } = await supabaseAdmin
        .from('admin_users')
        .insert({
          email: 'admin@bloompsychologynorthaustin.com',
          password: hashedPassword,
          name: 'Admin User',
          role: 'super_admin',
          is_active: true
        });
      
      if (error) {
        console.error('Error creating default admin:', error);
      } else {
        console.log('Default admin user created. Email: admin@bloompsychologynorthaustin.com, Password: bloom-admin-2024');
      }
    }
  } catch (error) {
    console.error('Error ensuring admin user:', error);
  }
}