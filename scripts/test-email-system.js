#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testEmailSystem() {
  console.log('🧪 Testing Email Automation System\n');
  
  let allGood = true;
  
  try {
    // 1. Test environment variables
    console.log('1️⃣ Checking Environment Configuration...');
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
      'RESEND_API_KEY'
    ];
    
    for (const envVar of requiredEnvVars) {
      if (process.env[envVar]) {
        console.log(`   ✅ ${envVar}: configured`);
      } else {
        console.log(`   ❌ ${envVar}: missing`);
        allGood = false;
      }
    }
    
    // 2. Test database connectivity
    console.log('\n2️⃣ Testing Database Connectivity...');
    const { data: test, error: dbError } = await supabase
      .from('subscribers')
      .select('count')
      .limit(1);
    
    if (dbError) {
      console.log(`   ❌ Database connection failed: ${dbError.message}`);
      allGood = false;
    } else {
      console.log('   ✅ Database connection successful');
    }
    
    // 3. Check critical email automation tables
    console.log('\n3️⃣ Checking Email Automation Tables...');
    const tables = [
      'subscribers',
      'email_sequences', 
      'sequence_emails',
      'email_automation_logs',
      'email_automation_triggers',
      'contact_submissions'
    ];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1);
        
        if (error) {
          console.log(`   ❌ Table '${table}': ${error.message}`);
          allGood = false;
        } else {
          console.log(`   ✅ Table '${table}': accessible`);
        }
      } catch (err) {
        console.log(`   ❌ Table '${table}': ${err.message}`);
        allGood = false;
      }
    }
    
    // 4. Check current email automation data
    console.log('\n4️⃣ Current Email Automation Status...');
    
    // Subscribers
    const { data: subscribers, error: subError } = await supabase
      .from('subscribers')
      .select('id, email, status, source')
      .eq('status', 'active');
    
    if (subError) {
      console.log(`   ❌ Error fetching subscribers: ${subError.message}`);
      allGood = false;
    } else {
      console.log(`   📊 Active subscribers: ${subscribers.length}`);
      
      // Show sample emails (first 3)
      if (subscribers.length > 0) {
        console.log('   📧 Sample subscriber emails:');
        subscribers.slice(0, 3).forEach((sub, i) => {
          console.log(`      ${i + 1}. ${sub.email} (source: ${sub.source || 'unknown'})`);
        });
      }
    }
    
    // Email sequences
    const { data: sequences, error: seqError } = await supabase
      .from('email_sequences')
      .select('id, name, trigger, status');
    
    if (seqError) {
      console.log(`   ❌ Error fetching sequences: ${seqError.message}`);
      allGood = false;
    } else {
      console.log(`   📋 Email sequences: ${sequences.length}`);
      sequences.forEach(seq => {
        console.log(`      • ${seq.name} (trigger: ${seq.trigger}, status: ${seq.status})`);
      });
    }
    
    // Recent automation logs
    const { data: recentLogs, error: logError } = await supabase
      .from('email_automation_logs')
      .select('id, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (logError) {
      console.log(`   ⚠️  Could not fetch recent logs: ${logError.message}`);
    } else {
      console.log(`   📝 Recent email logs: ${recentLogs.length}`);
      if (recentLogs.length > 0) {
        recentLogs.forEach(log => {
          const date = new Date(log.created_at).toLocaleDateString();
          console.log(`      • ${log.status} on ${date}`);
        });
      } else {
        console.log('      (no recent email activity)');
      }
    }
    
    // Email automation triggers
    const { data: triggers, error: triggerError } = await supabase
      .from('email_automation_triggers')
      .select('id, trigger_type, triggered_at')
      .order('triggered_at', { ascending: false })
      .limit(5);
    
    if (triggerError) {
      console.log(`   ⚠️  Could not fetch automation triggers: ${triggerError.message}`);
    } else {
      console.log(`   🎯 Recent automation triggers: ${triggers.length}`);
      if (triggers.length > 0) {
        triggers.forEach(trigger => {
          const date = new Date(trigger.triggered_at).toLocaleDateString();
          console.log(`      • ${trigger.trigger_type} on ${date}`);
        });
      } else {
        console.log('      (no recent triggers)');
      }
    }
    
    // 5. Test the key email flows
    console.log('\n5️⃣ Testing Key Email Flows...');
    
    // Check if contact form is connected to email automation
    console.log('   📝 Contact Form → Email Automation:');
    const { data: contactSubs, error: contactError } = await supabase
      .from('subscribers')
      .select('id, email, created_at')
      .eq('source', 'contact_form')
      .limit(3);
    
    if (contactError) {
      console.log(`      ❌ Error checking contact form subscribers: ${contactError.message}`);
    } else if (contactSubs.length > 0) {
      console.log(`      ✅ Found ${contactSubs.length} subscribers from contact form`);
      contactSubs.forEach(sub => {
        const date = new Date(sub.created_at).toLocaleDateString();
        console.log(`         • ${sub.email} (${date})`);
      });
    } else {
      console.log('      ⚠️  No contact form subscribers found');
    }
    
    // Check resource download subscribers
    console.log('   📚 Resource Download → Email Automation:');
    const { data: resourceSubs, error: resourceError } = await supabase
      .from('subscribers')
      .select('id, email, created_at')
      .eq('source', 'resource_download')
      .limit(3);
    
    if (resourceError) {
      console.log(`      ❌ Error checking resource download subscribers: ${resourceError.message}`);
    } else if (resourceSubs.length > 0) {
      console.log(`      ✅ Found ${resourceSubs.length} subscribers from resource downloads`);
      resourceSubs.forEach(sub => {
        const date = new Date(sub.created_at).toLocaleDateString();
        console.log(`         • ${sub.email} (${date})`);
      });
    } else {
      console.log('      ⚠️  No resource download subscribers found');
    }
    
    // 6. Final assessment
    console.log('\n🏁 Email System Assessment:');
    
    if (allGood) {
      console.log('✅ Email automation system appears to be properly configured!');
      console.log('\nNext steps to verify full functionality:');
      console.log('1. Submit a test contact form to trigger email automation');
      console.log('2. Check the cron job is running: /api/process-email-automation');
      console.log('3. Monitor email_automation_logs for activity');
    } else {
      console.log('❌ Email automation system has configuration issues that need to be resolved.');
    }
    
    console.log('\n📊 Summary:');
    console.log(`   • Subscribers: ${subscribers?.length || 0}`);
    console.log(`   • Email Sequences: ${sequences?.length || 0}`);
    console.log(`   • Recent Email Activity: ${recentLogs?.length || 0}`);
    console.log(`   • Recent Triggers: ${triggers?.length || 0}`);
    
  } catch (error) {
    console.error('❌ Error during email system test:', error);
    console.log('\nThis might indicate a critical configuration issue.');
  }
}

testEmailSystem().catch(console.error);