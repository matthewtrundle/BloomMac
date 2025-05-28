import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // This endpoint is for testing - it shows what cookies are received
  const cookies = req.cookies;
  const headers = req.headers;
  
  return res.status(200).json({
    message: 'Auth test endpoint',
    cookies: cookies,
    adminToken: cookies.adminToken || 'Not found',
    cookieHeader: headers.cookie || 'No cookie header',
    allHeaders: Object.keys(headers)
  });
}