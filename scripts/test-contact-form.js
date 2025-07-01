const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testContactForm() {
  console.log('🧪 Testing Contact Form System\n');

  // 1. Check if contact_submissions table exists
  console.log('1️⃣ Checking contact_submissions table...');
  try {
    const { count, error } = await supabase
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Table error:', error);
    } else {
      console.log(`✅ Table exists with ${count} submissions`);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }

  // 2. Check email templates
  console.log('\n2️⃣ Checking email templates...');
  try {
    const { data: templates, error } = await supabase
      .from('email_templates')
      .select('name, category, is_active')
      .in('name', ['contact_form_auto_response', 'application_received']);
    
    if (error) {
      console.error('❌ Templates error:', error);
    } else {
      console.log(`✅ Found ${templates.length} email templates:`);
      templates.forEach(t => {
        console.log(`   - ${t.name} (${t.category}) - Active: ${t.is_active}`);
      });
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }

  // 3. Check admin settings
  console.log('\n3️⃣ Checking admin notification settings...');
  try {
    const { data: settings, error } = await supabase
      .from('admin_settings')
      .select('key, value')
      .eq('key', 'admin_notification_emails')
      .single();
    
    if (error) {
      console.error('❌ Settings error:', error);
    } else {
      console.log(`✅ Admin notification emails: ${JSON.stringify(settings.value)}`);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }

  // 4. Test submission (optional)
  console.log('\n4️⃣ Test Submission Instructions:');
  console.log('To test the contact form:');
  console.log('1. Start the dev server: npm run dev');
  console.log('2. Go to: http://localhost:3000/contact');
  console.log('3. Fill out and submit the form');
  console.log('4. Check the admin panel: http://localhost:3000/admin/contacts');
  
  // 5. Show recent submissions
  console.log('\n5️⃣ Recent Contact Submissions:');
  try {
    const { data: recent, error } = await supabase
      .from('contact_submissions')
      .select('name, email, service, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) {
      console.error('❌ Error fetching submissions:', error);
    } else if (recent.length === 0) {
      console.log('📭 No contact submissions yet');
    } else {
      console.log(`📬 Last ${recent.length} submissions:`);
      recent.forEach(s => {
        const date = new Date(s.created_at).toLocaleString();
        console.log(`   - ${s.name} (${s.email}) - ${s.service || 'general'} - ${s.status} - ${date}`);
      });
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }

  console.log('\n✅ Contact form system check complete!');
}

testContactForm().catch(console.error);