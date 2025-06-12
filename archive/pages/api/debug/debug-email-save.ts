import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Debug Email Save - Method:', req.method);
  console.log('Debug Email Save - Headers:', req.headers);
  console.log('Debug Email Save - Body:', req.body);
  
  // Check environment variables
  const envCheck = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    NODE_ENV: process.env.NODE_ENV,
  };
  
  console.log('Debug Email Save - Environment:', envCheck);
  
  // Check authentication from middleware
  const authInfo = {
    userEmail: req.headers['x-user-email'],
    userRole: req.headers['x-user-role'],
    userId: req.headers['x-user-id'],
  };
  
  console.log('Debug Email Save - Auth:', authInfo);
  
  res.status(200).json({
    message: 'Debug endpoint reached',
    method: req.method,
    body: req.body,
    environment: envCheck,
    auth: authInfo,
    timestamp: new Date().toISOString()
  });
}