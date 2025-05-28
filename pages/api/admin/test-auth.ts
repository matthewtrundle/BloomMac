import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '../../../lib/auth';

export default withAuth(async (req: NextApiRequest, res: NextApiResponse, user) => {
  // This endpoint is protected by authentication
  return res.status(200).json({
    success: true,
    message: 'You are authenticated!',
    user: {
      id: user.userId,
      email: user.email,
      role: user.role
    }
  });
});