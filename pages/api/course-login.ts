import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

// Mock course users - in production this would be in your database
const courseUsers = [
  {
    id: '1',
    email: 'demo@bloompsychology.com',
    password: 'demo123',
    first_name: 'Demo',
    last_name: 'User',
    enrolledCourses: ['postpartum-wellness-foundations'],
    status: 'active'
  },
  {
    id: '2',
    email: 'test@example.com',
    password: 'test123',
    first_name: 'Test',
    last_name: 'User',
    enrolledCourses: ['postpartum-wellness-foundations'],
    status: 'active'
  }
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user (in production, hash password and compare)
    const user = courseUsers.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password &&
      u.status === 'active'
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token (in production, use proper secret)
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        type: 'course_access'
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        enrolledCourses: user.enrolledCourses
      }
    });

  } catch (error) {
    console.error('Course login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}