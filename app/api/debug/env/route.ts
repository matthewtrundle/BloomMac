import { NextResponse } from 'next/server';

// API endpoint to check environment variables in production
// Access at: https://your-domain.com/api/debug/env
export async function GET() {
  const envCheck = {
    nodeEnv: process.env.NODE_ENV,
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasResendKey: !!process.env.RESEND_API_KEY,
    hasSiteUrl: !!process.env.NEXT_PUBLIC_SITE_URL,
    
    // Show first few characters for verification (safe to expose)
    supabaseUrlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30),
    supabaseKeyPrefix: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 30),
    
    // List all NEXT_PUBLIC variables (these are safe to expose)
    publicVars: Object.keys(process.env)
      .filter(key => key.startsWith('NEXT_PUBLIC'))
      .reduce((acc, key) => {
        acc[key] = !!process.env[key];
        return acc;
      }, {} as Record<string, boolean>),
      
    timestamp: new Date().toISOString()
  };

  // Test Supabase client creation
  try {
    const { createClient } = require('@supabase/supabase-js');
    
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const testClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      envCheck.supabaseClientTest = {
        created: true,
        hasAuth: !!testClient.auth,
        hasFrom: !!testClient.from
      };
    } else {
      envCheck.supabaseClientTest = {
        created: false,
        error: 'Missing URL or Key'
      };
    }
  } catch (error) {
    envCheck.supabaseClientTest = {
      created: false,
      error: error.message
    };
  }

  return NextResponse.json(envCheck, { 
    status: 200,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    }
  });
}