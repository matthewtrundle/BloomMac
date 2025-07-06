#!/usr/bin/env node

/**
 * Email Audit Cleanup Script
 * Implements recommendations from EMAIL_AUDIT_REPORT.md
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function cleanupEmails() {
  console.log('🧹 Starting Email Audit Cleanup...\n');

  // 1. Delete legacy welcome template
  console.log('1. Deleting legacy "Welcome to Bloom Psychology" template...');
  const { error: deleteError } = await supabase
    .from('email_templates')
    .delete()
    .eq('name', 'Welcome to Bloom Psychology')
    .eq('category', 'welcome');

  if (deleteError) {
    console.error('   ❌ Error:', deleteError.message);
  } else {
    console.log('   ✅ Successfully deleted legacy welcome template');
  }

  // 2. Verify remaining templates
  console.log('\n2. Verifying remaining database templates...');
  const { data: templates, error: fetchError } = await supabase
    .from('email_templates')
    .select('id, name, category');

  if (fetchError) {
    console.error('   ❌ Error:', fetchError.message);
  } else {
    console.log('   ✅ Remaining templates:', templates.length);
    templates.forEach(t => {
      console.log(`      - ${t.name} (${t.category})`);
    });
  }

  console.log('\n✅ Email cleanup complete!');
}

// Run the cleanup
cleanupEmails().catch(console.error);