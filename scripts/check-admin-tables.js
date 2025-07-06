#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTables() {
  console.log('🗄️ DATABASE TABLE CHECK FOR ADMIN FEATURES\n');
  console.log('=' .repeat(60));

  const tablesToCheck = [
    // Core admin tables
    { name: 'admin_users', purpose: 'Admin authentication', required: true },
    { name: 'admin_activity_log', purpose: 'Activity tracking', required: true },
    { name: 'system_settings', purpose: 'System configuration', required: false },
    
    // Content tables
    { name: 'blog_posts', purpose: 'Blog content', required: true },
    { name: 'contact_submissions', purpose: 'Contact form entries', required: true },
    { name: 'careers_applications', purpose: 'Job applications', required: false },
    { name: 'careers_postings', purpose: 'Job listings', required: false },
    
    // Email tables
    { name: 'email_templates', purpose: 'Email templates', required: true },
    { name: 'email_queue', purpose: 'Email sending queue', required: true },
    { name: 'email_logs', purpose: 'Email send history', required: true },
    { name: 'email_analytics', purpose: 'Email tracking', required: false },
    { name: 'email_automations', purpose: 'Email sequences', required: false },
    { name: 'subscribers', purpose: 'Newsletter subscribers', required: true },
    
    // Analytics tables
    { name: 'analytics_events', purpose: 'Page view tracking', required: true },
    { name: 'user_sessions', purpose: 'Session tracking', required: false },
    
    // Course tables
    { name: 'courses', purpose: 'Course definitions', required: false },
    { name: 'course_enrollments', purpose: 'User enrollments', required: false },
    { name: 'course_progress', purpose: 'User progress', required: false }
  ];

  const results = {
    existing: [],
    missing: [],
    empty: [],
    populated: []
  };

  for (const table of tablesToCheck) {
    try {
      const { count, error } = await supabase
        .from(table.name)
        .select('*', { count: 'exact', head: true });

      if (error) {
        results.missing.push(table);
        console.log(`❌ ${table.name.padEnd(25)} - MISSING ${table.required ? '(REQUIRED!)' : ''}`);
      } else {
        results.existing.push(table);
        if (count === 0) {
          results.empty.push(table);
          console.log(`⚠️  ${table.name.padEnd(25)} - EXISTS but EMPTY (${count} rows)`);
        } else {
          results.populated.push(table);
          console.log(`✅ ${table.name.padEnd(25)} - OK (${count} rows)`);
        }
      }
    } catch (error) {
      results.missing.push(table);
      console.log(`❌ ${table.name.padEnd(25)} - ERROR: ${error.message}`);
    }
  }

  // Summary
  console.log('\n\n📊 SUMMARY:');
  console.log('=' .repeat(60));
  console.log(`✅ Existing tables: ${results.existing.length}`);
  console.log(`❌ Missing tables: ${results.missing.length}`);
  console.log(`⚠️  Empty tables: ${results.empty.length}`);
  console.log(`📈 Populated tables: ${results.populated.length}`);

  // Critical missing tables
  const criticalMissing = results.missing.filter(t => t.required);
  if (criticalMissing.length > 0) {
    console.log('\n\n🚨 CRITICAL MISSING TABLES:');
    console.log('=' .repeat(60));
    criticalMissing.forEach(table => {
      console.log(`- ${table.name}: ${table.purpose}`);
    });
  }

  // Empty but important tables
  const importantEmpty = results.empty.filter(t => t.required);
  if (importantEmpty.length > 0) {
    console.log('\n\n⚠️  EMPTY REQUIRED TABLES:');
    console.log('=' .repeat(60));
    importantEmpty.forEach(table => {
      console.log(`- ${table.name}: ${table.purpose}`);
    });
  }

  // Check specific table structures
  console.log('\n\n🔍 TABLE STRUCTURE CHECKS:');
  console.log('=' .repeat(60));

  // Check analytics_events structure
  if (results.existing.find(t => t.name === 'analytics_events')) {
    const { data: sample } = await supabase
      .from('analytics_events')
      .select('*')
      .limit(1);
    
    if (sample && sample.length > 0) {
      console.log('\nanalytics_events columns:');
      Object.keys(sample[0]).forEach(col => {
        console.log(`  - ${col}`);
      });
    }
  }

  // Check contact_submissions structure
  if (results.existing.find(t => t.name === 'contact_submissions')) {
    const { data: sample } = await supabase
      .from('contact_submissions')
      .select('*')
      .limit(1);
    
    if (sample && sample.length > 0) {
      console.log('\ncontact_submissions columns:');
      Object.keys(sample[0]).forEach(col => {
        console.log(`  - ${col}`);
      });
    }
  }
}

checkTables().catch(console.error);