import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let user = null;
    let authError = null;
    
    // First try with Authorization header
    if (req.headers.authorization) {
      const token = req.headers.authorization.replace('Bearer ', '');
      
      const supabaseService = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      
      const { data: { user: tokenUser }, error: tokenError } = await supabaseService.auth.getUser(token);
      
      if (tokenUser && !tokenError) {
        user = tokenUser;
      } else {
        authError = tokenError;
      }
    }
    
    // Fallback to cookie-based auth
    if (!user) {
      const supabaseAuth = createServerSupabaseClient({ req, res });
      const result = await supabaseAuth.auth.getUser();
      user = result.data.user;
      authError = result.error;
    }

    if (authError || !user) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        details: authError?.message || 'No user found'
      });
    }

    // Use service role client to bypass RLS
    const supabaseService = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Fetch user profile with more comprehensive data
    const { data: profile, error: profileError } = await supabaseService
      .from('user_profiles')
      .select(`
        id, first_name, last_name, phone, 
        postpartum_date, baby_due_date, number_of_children,
        emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
        total_stars, marketing_consent, timezone,
        created_at, updated_at
      `)
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      // Return basic user info if profile doesn't exist
      return res.status(200).json({ 
        profile: {
          id: user.id,
          first_name: user.user_metadata?.first_name || user.user_metadata?.full_name?.split(' ')[0] || '',
          last_name: user.user_metadata?.last_name || user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
          email: user.email,
          total_stars: 0,
          number_of_children: 1,
          created_at: user.created_at
        }
      });
    }

    return res.status(200).json({ profile });
  } catch (error: any) {
    console.error('Profile GET error:', error);
    
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
}