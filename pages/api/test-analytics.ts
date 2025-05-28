import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // This is a simple test endpoint that just returns mock data
  // It doesn't require authentication to test if the middleware is working
  
  return res.status(200).json({
    message: 'Analytics endpoint accessed successfully',
    timestamp: new Date().toISOString(),
    authenticated: req.headers['x-user-email'] ? true : false,
    userEmail: req.headers['x-user-email'] || 'none',
    userRole: req.headers['x-user-role'] || 'none'
  });
}