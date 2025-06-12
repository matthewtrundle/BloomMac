require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkInvalidEmails() {
  console.log('Checking for subscribers with invalid emails...\n');

  try {
    // Find subscribers with null or empty emails
    const { data: invalidEmails, error } = await supabase
      .from('subscribers')
      .select('id, email, signup_source, created_at')
      .or('email.is.null,email.eq.');

    if (error) {
      console.error('Error querying subscribers:', error);
      return;
    }

    if (!invalidEmails || invalidEmails.length === 0) {
      console.log('✅ No subscribers with invalid emails found!');
      return;
    }

    console.log(`⚠️  Found ${invalidEmails.length} subscribers with invalid emails:\n`);
    
    invalidEmails.forEach(subscriber => {
      console.log(`ID: ${subscriber.id}`);
      console.log(`Email: "${subscriber.email || 'NULL'}"`);
      console.log(`Source: ${subscriber.signup_source}`);
      console.log(`Created: ${subscriber.created_at}`);
      console.log('---');
    });

    // Also check for subscribers that might have email-like strings but are malformed
    const { data: suspiciousEmails, error: suspiciousError } = await supabase
      .from('subscribers')
      .select('id, email, signup_source, created_at')
      .not('email', 'is', null)
      .not('email', 'eq', '');

    if (!suspiciousError && suspiciousEmails) {
      const malformed = suspiciousEmails.filter(sub => {
        const email = sub.email;
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(email);
      });

      if (malformed.length > 0) {
        console.log(`\n⚠️  Found ${malformed.length} subscribers with malformed emails:\n`);
        malformed.forEach(subscriber => {
          console.log(`ID: ${subscriber.id}`);
          console.log(`Email: "${subscriber.email}"`);
          console.log(`Source: ${subscriber.signup_source}`);
          console.log('---');
        });
      }
    }

    // Check if any of these subscribers are in active email sequences
    if (invalidEmails.length > 0) {
      const subscriberIds = invalidEmails.map(s => s.id);
      
      const { data: activeSequences, error: seqError } = await supabase
        .from('email_automation_logs')
        .select('subscriber_id, sequence_id, email_id, created_at')
        .in('subscriber_id', subscriberIds)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!seqError && activeSequences && activeSequences.length > 0) {
        console.log(`\n⚠️  These invalid email subscribers have automation logs:\n`);
        activeSequences.forEach(log => {
          console.log(`Subscriber: ${log.subscriber_id}`);
          console.log(`Sequence: ${log.sequence_id}`);
          console.log(`Sent at: ${log.created_at}`);
          console.log('---');
        });
      }
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

checkInvalidEmails();