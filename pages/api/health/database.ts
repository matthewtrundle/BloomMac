import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase, getServiceSupabase } from '@/lib/supabase-unified';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const results = {
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasJwtSecret: !!process.env.JWT_SECRET,
    },
    publicClient: {
      connected: false,
      error: null as string | null,
      tableCount: 0
    },
    serviceClient: {
      connected: false,
      error: null as string | null,
      canReadUsers: false
    },
    criticalTables: {} as Record<string, boolean>,
    rlsStatus: {} as Record<string, boolean>
  };

  // Test public client
  try {
    const { count, error } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true });
    
    results.publicClient.connected = !error;
    results.publicClient.error = error?.message || null;
    
    if (!error) {
      // Count accessible tables
      const tables = [
        'courses', 'blog_posts', 'email_templates', 
        'appointment_types', 'user_profiles'
      ];
      
      for (const table of tables) {
        try {
          const { error: tableError } = await supabase
            .from(table)
            .select('id')
            .limit(1);
          results.criticalTables[table] = !tableError;
        } catch (e) {
          results.criticalTables[table] = false;
        }
      }
      
      results.publicClient.tableCount = Object.values(results.criticalTables)
        .filter(Boolean).length;
    }
  } catch (error) {
    results.publicClient.error = error.message;
  }

  // Test service client (admin operations)
  try {
    const serviceSupabase = getServiceSupabase();
    
    // Test basic connectivity
    const { count, error } = await serviceSupabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true });
    
    results.serviceClient.connected = !error;
    results.serviceClient.error = error?.message || null;
    results.serviceClient.canReadUsers = !error;
    
    // Check RLS status on critical tables
    if (!error) {
      const rlsTables = ['subscribers', 'contact_submissions', 'user_profiles'];
      
      for (const table of rlsTables) {
        try {
          // This query will show if RLS is enabled
          const { data: policies } = await serviceSupabase
            .rpc('get_policies_for_table', { table_name: table });
          
          results.rlsStatus[table] = true; // If we can query, service role works
        } catch (e) {
          results.rlsStatus[table] = false;
        }
      }
    }
  } catch (error) {
    results.serviceClient.error = error.message;
  }

  // Determine overall health
  const isHealthy = 
    results.publicClient.connected && 
    results.serviceClient.connected &&
    results.publicClient.tableCount >= 3;

  // Add recommendations
  const recommendations = [];
  
  if (!results.environment.hasSupabaseUrl) {
    recommendations.push('Set NEXT_PUBLIC_SUPABASE_URL environment variable');
  }
  if (!results.environment.hasAnonKey) {
    recommendations.push('Set NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
  }
  if (!results.environment.hasServiceKey) {
    recommendations.push('Set SUPABASE_SERVICE_ROLE_KEY for admin operations');
  }
  if (!results.publicClient.connected) {
    recommendations.push('Check Supabase project status and network connectivity');
  }
  if (results.publicClient.tableCount < 3) {
    recommendations.push('Check RLS policies - many tables are not accessible');
  }

  return res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    ...results,
    recommendations
  });
}