require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifyTables() {
  console.log('🔍 Verifying all Supabase tables...\n');

  const tablesToCheck = [
    // Course Management
    'courses',
    'course_modules', 
    'course_lessons',
    'course_resources',
    'course_content_versions',
    'user_courses',
    'course_progress',
    
    // Email System
    'email_templates',
    'email_automation_rules',
    'email_automation_logs',
    'email_analytics',
    'newsletter_subscribers',
    'newsletter_sends',
    
    // Content Management
    'blog_posts',
    'blog_images_metadata',
    
    // Analytics
    'analytics_events',
    'click_heatmap',
    'chat_conversations',
    
    // Contact/Booking
    'contact_submissions',
    'bookings',
    
    // Admin
    'admin_users',
    'admin_activity_log'
  ];

  const results = {
    existing: [],
    missing: [],
    errors: []
  };

  for (const table of tablesToCheck) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        if (error.message.includes('does not exist')) {
          results.missing.push(table);
          console.log(`❌ ${table} - Table does not exist`);
        } else {
          results.errors.push({ table, error: error.message });
          console.log(`⚠️  ${table} - Error: ${error.message}`);
        }
      } else {
        results.existing.push(table);
        console.log(`✅ ${table} - Table exists`);
      }
    } catch (err) {
      results.errors.push({ table, error: err.message });
      console.log(`⚠️  ${table} - Error: ${err.message}`);
    }
  }

  console.log('\n📊 Summary:');
  console.log(`✅ Existing tables: ${results.existing.length}`);
  console.log(`❌ Missing tables: ${results.missing.length}`);
  console.log(`⚠️  Tables with errors: ${results.errors.length}`);

  if (results.missing.length > 0) {
    console.log('\n❌ Missing tables:');
    results.missing.forEach(table => console.log(`  - ${table}`));
  }

  if (results.errors.length > 0) {
    console.log('\n⚠️  Tables with errors:');
    results.errors.forEach(({ table, error }) => {
      console.log(`  - ${table}: ${error}`);
    });
  }

  // Check storage buckets
  console.log('\n🗄️  Checking storage buckets...');
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.log('⚠️  Error listing buckets:', error.message);
    } else {
      console.log(`✅ Found ${buckets.length} storage buckets:`);
      buckets.forEach(bucket => {
        console.log(`  - ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
      });
    }
  } catch (err) {
    console.log('⚠️  Error checking buckets:', err.message);
  }
}

verifyTables().catch(console.error);