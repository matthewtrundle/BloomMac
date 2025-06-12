import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Log headers to see what's being passed
  console.log('Test Email Access - Headers:', {
    cookie: req.headers.cookie,
    'x-user-id': req.headers['x-user-id'],
    'x-user-email': req.headers['x-user-email'],
    'x-user-role': req.headers['x-user-role']
  });

  return res.status(200).json({
    message: 'Email access test endpoint',
    headers: {
      hasAdminCookie: !!req.cookies.adminToken,
      userIdHeader: req.headers['x-user-id'] || 'Not set',
      userEmailHeader: req.headers['x-user-email'] || 'Not set',
      userRoleHeader: req.headers['x-user-role'] || 'Not set'
    }
  });
}