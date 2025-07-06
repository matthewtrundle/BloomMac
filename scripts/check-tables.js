#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTables() {
  console.log('=== CHECKING ALL TABLES ===\n');
  
  // List of potential tables to check
  const tablesToCheck = [
    'user_profiles',
    'profiles', 
    'admin_users',
    'subscribers',
    'email_templates',
    'email_queue',
    'contact_submissions',
    'analytics_events',
    'courses',
    'course_enrollments'
  ];
  
  for (const tableName of tablesToCheck) {
    try {
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
      
      if (!error) {
        console.log(`✓ ${tableName}: EXISTS (${count} rows)`);
        
        // Get column info
        const { data: sample } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
          
        if (sample && sample.length > 0) {
          console.log(`  Columns: ${Object.keys(sample[0]).join(', ')}`);
        }
      } else {
        console.log(`✗ ${tableName}: Does not exist`);
      }
    } catch (err) {
      console.log(`✗ ${tableName}: Error - ${err.message}`);
    }
    console.log('');
  }
}

checkTables();