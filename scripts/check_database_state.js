const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client with service role key for full access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  }
);

async function checkDatabaseState() {
  console.log('🔍 Checking Supabase Database State...\n');

  try {
    // 1. Check all tables
    console.log('📊 TABLES IN DATABASE:');
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_all_tables', {});
    
    if (tablesError) {
      // Create the function if it doesn't exist
      await supabase.rpc('query', {
        query: `
          CREATE OR REPLACE FUNCTION get_all_tables()
          RETURNS TABLE(schemaname text, tablename text)
          LANGUAGE sql
          SECURITY DEFINER
          AS $$
            SELECT schemaname, tablename 
            FROM pg_tables 
            WHERE schemaname = 'public'
            ORDER BY tablename;
          $$;
        `
      });
      
      // Try again
      const { data: retryTables } = await supabase.rpc('get_all_tables', {});
      console.log(retryTables || 'No tables found');
    } else {
      console.log(tables);
    }

    // 2. Check specific tables we care about
    console.log('\n📋 CHECKING SPECIFIC TABLES:');
    const tablesToCheck = [
      'user_profiles',
      'admin_activity_log',
      'conversion_events',
      'newsletter_sends',
      'chatbot_interactions',
      'email_sends',
      'analytics_events',
      'subscribers',
      'contact_submissions',
      'career_applications',
      'email_queue',
      'email_templates'
    ];

    for (const table of tablesToCheck) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ ${table}: Does not exist or error accessing`);
      } else {
        console.log(`✅ ${table}: Exists (${count} rows)`);
      }
    }

    // 3. Check columns in key tables
    console.log('\n🔧 CHECKING TABLE STRUCTURES:');
    
    // Check user_profiles columns
    const { data: userProfileCols } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(0);
    
    if (userProfileCols !== null) {
      console.log('\nuser_profiles columns:', Object.keys(userProfileCols[0] || {}));
    }

    // Check subscribers columns
    const { data: subscriberCols } = await supabase
      .from('subscribers')
      .select('*')
      .limit(0);
    
    if (subscriberCols !== null) {
      console.log('\nsubscribers columns:', Object.keys(subscriberCols[0] || {}));
    }

    // 4. Check functions
    console.log('\n🔨 CHECKING FUNCTIONS:');
    const functionsToCheck = [
      'create_user_profile',
      'subscribe_to_newsletter',
      'handle_newsletter_signup',
      'handle_email_unsubscribe',
      'validate_unsubscribe_token',
      'get_analytics_summary',
      'get_analytics_dashboard',
      'get_email_analytics',
      'get_subscriber_stats',
      'get_email_engagement_patterns',
      'get_subscriber_growth_trend',
      'get_career_applications',
      'get_contact_submissions'
    ];

    for (const func of functionsToCheck) {
      try {
        // Try to get function info
        const { data, error } = await supabase.rpc(func, { days_ago: 1 }).limit(0);
        if (error && error.message.includes('does not exist')) {
          console.log(`❌ ${func}: Does not exist`);
        } else {
          console.log(`✅ ${func}: Exists`);
        }
      } catch (e) {
        console.log(`❌ ${func}: Does not exist or error`);
      }
    }

    // 5. Check for duplicate tables
    console.log('\n⚠️  CHECKING FOR DUPLICATES/ISSUES:');
    
    // Check email-related tables
    const emailTables = ['email_queue', 'email_sends', 'email_logs', 'email_templates'];
    for (const table of emailTables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (!error) {
        console.log(`📧 ${table}: ${count} rows`);
      }
    }

    // Check subscriber-related tables
    const subTables = ['subscribers', 'newsletter_subscribers'];
    for (const table of subTables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (!error) {
        console.log(`📬 ${table}: ${count} rows`);
      }
    }

  } catch (error) {
    console.error('Error checking database:', error);
  }
}

// Run the check
checkDatabaseState();