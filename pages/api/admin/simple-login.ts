import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';

const ADMIN_EMAIL = 'admin@bloom.com';
const ADMIN_PASSWORD = 'bloom-admin-2024';
const JWT_SECRET = process.env.JWT_SECRET || 'bloom-admin-secret-key-change-in-production';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check credentials
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: 'admin-user',
        userId: 'admin-user',
        email: ADMIN_EMAIL,
        role: 'admin'
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set cookie
    const cookie = serialize('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/'
    });

    res.setHeader('Set-Cookie', cookie);

    return res.status(200).json({
      success: true,
      user: {
        id: 'admin-user',
        email: ADMIN_EMAIL,
        name: 'Admin User',
        role: 'admin'
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}