const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkPhase1Tables() {
  console.log('📊 PHASE 1 TABLE STRUCTURE CHECK\n');
  
  // Tables our secure routes expect
  const tablesToCheck = [
    'user_profiles',
    'admin_users',
    'contact_submissions',
    'career_applications',
    'subscribers',
    'analytics_events',
    'admin_activity_log',
    'conversion_events',
    'newsletter_sends',
    'email_queue',
    'email_sends',
    'chatbot_interactions'
  ];
  
  for (const table of tablesToCheck) {
    console.log(`\n━━━ ${table.toUpperCase()} ━━━`);
    
    // Get one row to see structure
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ ERROR:', error.message);
      continue;
    }
    
    const { count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });
    
    console.log(`Rows: ${count}`);
    
    if (data && data.length > 0) {
      console.log('Columns:', Object.keys(data[0]));
    } else {
      // For empty tables, try to get structure differently
      console.log('Table is empty, inferring structure...');
      
      // Table-specific expected structures based on our routes
      const expectedStructures = {
        'career_applications': ['id', 'position', 'name', 'email', 'resume_url', 'created_at'],
        'conversion_events': ['id', 'event_type', 'session_id', 'user_id', 'page', 'value', 'metadata', 'created_at'],
        'newsletter_sends': ['id', 'subject', 'html_content', 'recipient_count', 'sent_count', 'status', 'created_at'],
        'email_sends': ['id', 'to_email', 'from_email', 'subject', 'status', 'created_at'],
        'chatbot_interactions': ['id', 'session_id', 'user_message', 'bot_response', 'created_at']
      };
      
      if (expectedStructures[table]) {
        console.log('Expected columns:', expectedStructures[table]);
      }
    }
  }
}

// Check functions
async function checkFunctions() {
  console.log('\n\n🔧 CHECKING RPC FUNCTIONS\n');
  
  const functions = [
    'check_user_role_unified',
    'get_user_info',
    'handle_newsletter_signup',
    'handle_email_unsubscribe',
    'get_analytics_summary',
    'get_analytics_dashboard',
    'get_email_analytics',
    'get_subscriber_stats',
    'get_career_applications',
    'get_contact_submissions'
  ];
  
  for (const func of functions) {
    try {
      // Try calling with minimal params
      const { error } = await supabase.rpc(func, {
        user_id: '00000000-0000-0000-0000-000000000000',
        required_role: 'admin',
        days_ago: 1,
        limit: 1
      });
      
      if (error && error.message.includes('does not exist')) {
        console.log(`❌ ${func}: MISSING`);
      } else {
        console.log(`✅ ${func}: EXISTS`);
      }
    } catch (e) {
      console.log(`❌ ${func}: ERROR`);
    }
  }
}

async function main() {
  await checkPhase1Tables();
  await checkFunctions();
}

main().catch(console.error);