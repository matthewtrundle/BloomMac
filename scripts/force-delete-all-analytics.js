// Force delete ALL analytics data - no exceptions
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Please check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function forceDeleteAllAnalytics() {
  console.log('FORCE DELETING ALL ANALYTICS DATA...\n');

  // 1. Delete ALL analytics_events
  console.log('Deleting ALL analytics_events...');
  const { error: analyticsError } = await supabase
    .from('analytics_events')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete everything
    
  if (analyticsError) {
    console.error('Error deleting analytics_events:', analyticsError);
  } else {
    const { count } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true });
    console.log(`✓ analytics_events cleared. Remaining: ${count}`);
  }

  // 2. Delete ALL chat_conversations
  console.log('\nDeleting ALL chat_conversations...');
  try {
    const { error } = await supabase
      .from('chat_conversations')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
      
    if (!error) {
      const { count } = await supabase
        .from('chat_conversations')
        .select('*', { count: 'exact', head: true });
      console.log(`✓ chat_conversations cleared. Remaining: ${count}`);
    }
  } catch (err) {
    console.log('⚠️  chat_conversations table might not exist');
  }

  // 3. Delete ALL click_heatmap
  console.log('\nDeleting ALL click_heatmap data...');
  try {
    const { error } = await supabase
      .from('click_heatmap')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
      
    if (!error) {
      const { count } = await supabase
        .from('click_heatmap')
        .select('*', { count: 'exact', head: true });
      console.log(`✓ click_heatmap cleared. Remaining: ${count}`);
    }
  } catch (err) {
    console.log('⚠️  click_heatmap table might not exist');
  }

  // 4. Delete ALL admin_activity_log
  console.log('\nDeleting ALL admin_activity_log...');
  const { error: adminError } = await supabase
    .from('admin_activity_log')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
    
  if (adminError) {
    console.error('Error deleting admin_activity_log:', adminError);
  } else {
    const { count } = await supabase
      .from('admin_activity_log')
      .select('*', { count: 'exact', head: true });
    console.log(`✓ admin_activity_log cleared. Remaining: ${count}`);
  }

  // 5. Delete ALL email_automation_logs
  console.log('\nDeleting ALL email_automation_logs...');
  try {
    const { error } = await supabase
      .from('email_automation_logs')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
      
    if (!error) {
      const { count } = await supabase
        .from('email_automation_logs')
        .select('*', { count: 'exact', head: true });
      console.log(`✓ email_automation_logs cleared. Remaining: ${count}`);
    }
  } catch (err) {
    console.log('⚠️  email_automation_logs table might not exist');
  }

  console.log('\n=== VERIFICATION ===');
  
  // Final verification
  const tables = [
    'analytics_events',
    'chat_conversations',
    'click_heatmap',
    'admin_activity_log',
    'email_automation_logs'
  ];
  
  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
        
      if (!error) {
        console.log(`${table}: ${count} records ${count === 0 ? '✓' : '✗ STILL HAS DATA!'}`);
      }
    } catch (err) {
      console.log(`${table}: Table might not exist`);
    }
  }
  
  console.log('\n=== PRESERVED DATA (Not deleted) ===');
  
  // Check preserved data
  const preservedTables = ['blog_posts', 'contact_submissions', 'subscribers', 'career_applications'];
  
  for (const table of preservedTables) {
    try {
      const { count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      console.log(`${table}: ${count} records (preserved)`);
    } catch (err) {
      console.log(`${table}: Error checking`);
    }
  }
}

forceDeleteAllAnalytics().catch(console.error);