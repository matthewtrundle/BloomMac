import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check which environment variables are defined
    const envCheck = {
      supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabase_anon_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabase_service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      jwt_secret: !!process.env.JWT_SECRET,
      node_env: process.env.NODE_ENV,
      vercel_env: process.env.VERCEL_ENV,
      // Add partial values for debugging (first few characters only)
      supabase_url_partial: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...',
      has_all_required: !!(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        process.env.SUPABASE_SERVICE_ROLE_KEY &&
        process.env.JWT_SECRET
      )
    };

    return res.status(200).json({
      success: true,
      environment: envCheck,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Environment check error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to check environment variables'
    });
  }
}