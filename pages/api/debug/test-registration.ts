import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Test 1: Check Supabase connection
    const { data: testData, error: testError } = await supabase
      .from('courses')
      .select('*')
      .limit(1);

    if (testError) {
      return res.status(500).json({ 
        error: 'Database connection failed',
        details: testError.message,
        code: testError.code
      });
    }

    // Test 2: Check if tables exist
    const tables = ['user_profiles', 'user_consents', 'course_enrollments', 'courses'];
    const tableChecks = [];

    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      tableChecks.push({
        table,
        exists: !error,
        error: error?.message
      });
    }

    // Test 3: Try creating a test user with signUp (same as production)
    const testEmail = `test-${Date.now()}@example.com`;
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: 'testPassword123',
      options: {
        data: {
          first_name: 'Test',
          last_name: 'User',
          course_registration: true
        }
      }
    });

    let userCreationResult = null;
    if (authError) {
      userCreationResult = { 
        success: false, 
        error: authError.message,
        errorCode: authError.status,
        fullError: authError
      };
    } else {
      userCreationResult = { 
        success: true, 
        userId: authData.user?.id,
        needsEmailConfirmation: !authData.user?.email_confirmed_at
      };
      
      // Clean up test user if possible
      if (authData.user) {
        await supabase.auth.admin.deleteUser(authData.user.id);
      }
    }

    return res.status(200).json({
      databaseConnection: !!testData,
      tablesExist: tableChecks,
      userCreation: userCreationResult,
      environment: {
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        hasSiteUrl: !!process.env.NEXT_PUBLIC_SITE_URL
      }
    });

  } catch (error) {
    console.error('Debug test error:', error);
    return res.status(500).json({ 
      error: 'Debug test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}