import type { NextApiRequest, NextApiResponse } from 'next';
import { getServiceSupabase } from '@/lib/supabase-unified';

// Emergency endpoint to fix newsletter functionality
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow in development or with secret key
  const emergencyKey = req.headers['x-emergency-key'];
  if (process.env.NODE_ENV === 'production' && emergencyKey !== process.env.EMERGENCY_FIX_KEY) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method === 'POST') {
    // Handle newsletter signup without auth
    const { email, source = 'website' } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email required' });
    }

    try {
      const supabase = getServiceSupabase();
      
      // First, check if RLS is blocking
      const { data: rlsCheck, error: rlsError } = await supabase
        .rpc('check_rls_status', { table_name: 'subscribers' });
      
      // Insert with service role (bypasses RLS)
      const { data, error } = await supabase
        .from('subscribers')
        .insert({
          email: email.toLowerCase().trim(),
          source,
          subscribed: true,
          verified: false,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          // Already exists - update instead
          const { data: updated, error: updateError } = await supabase
            .from('subscribers')
            .update({ 
              subscribed: true,
              updated_at: new Date().toISOString()
            })
            .eq('email', email.toLowerCase().trim())
            .select()
            .single();

          if (updateError) throw updateError;
          
          return res.status(200).json({ 
            success: true, 
            message: 'Subscription updated',
            data: updated
          });
        }
        throw error;
      }

      return res.status(200).json({ 
        success: true, 
        message: 'Successfully subscribed',
        data,
        rlsEnabled: rlsCheck
      });

    } catch (error) {
      console.error('Newsletter error:', error);
      return res.status(500).json({ 
        error: 'Failed to subscribe',
        details: error.message,
        hint: 'Check if SUPABASE_SERVICE_ROLE_KEY is set'
      });
    }
  }

  // GET method - check newsletter table status
  if (req.method === 'GET') {
    try {
      const supabase = getServiceSupabase();
      
      // Get table info
      const { count, error } = await supabase
        .from('subscribers')
        .select('*', { count: 'exact', head: true });

      // Check if we can insert
      let canInsert = false;
      try {
        const testEmail = `test-${Date.now()}@emergency-check.com`;
        const { error: insertError } = await supabase
          .from('subscribers')
          .insert({ email: testEmail })
          .single();
        
        canInsert = !insertError;
        
        // Clean up test
        if (!insertError) {
          await supabase
            .from('subscribers')
            .delete()
            .eq('email', testEmail);
        }
      } catch (e) {
        // Ignore cleanup errors
      }

      return res.status(200).json({
        table: 'subscribers',
        accessible: !error,
        recordCount: count || 0,
        canInsert,
        error: error?.message
      });

    } catch (error) {
      return res.status(500).json({ 
        error: 'Failed to check status',
        details: error.message
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}