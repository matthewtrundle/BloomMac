import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Clear the auth cookie
  res.setHeader('Set-Cookie', 'bloom-admin-auth=; Path=/; HttpOnly; Max-Age=0; SameSite=Strict');
  
  // Redirect to home page
  res.redirect('/');
}