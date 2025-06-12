const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addTestSubscribers() {
  console.log('📧 Adding test newsletter subscribers...');
  
  const testSubscribers = [
    {
      email: 'sarah.johnson@example.com',
      first_name: 'Sarah',
      last_name: 'Johnson',
      status: 'active',
      tags: ['new-mom', 'postpartum'],
      signup_source: 'website',
      interests: ['postpartum-support', 'mental-health', 'parenting'],
      metadata: { referrer: 'google' }
    },
    {
      email: 'emma.davis@example.com',
      first_name: 'Emma',
      last_name: 'Davis',
      status: 'active',
      tags: ['pregnancy', 'first-time-mom'],
      signup_source: 'blog',
      interests: ['pregnancy', 'mental-health', 'wellness-tips']
    },
    {
      email: 'jessica.miller@example.com',
      first_name: 'Jessica',
      last_name: 'Miller',
      status: 'active',
      tags: ['anxiety', 'therapy'],
      signup_source: 'consultation',
      interests: ['anxiety-management', 'therapy', 'self-care']
    },
    {
      email: 'maria.garcia@example.com',
      first_name: 'Maria',
      last_name: 'Garcia',
      status: 'active',
      tags: ['new-mom', 'spanish-speaking'],
      signup_source: 'new-mom-program',
      interests: ['postpartum-support', 'cultural-considerations', 'bilingual-resources']
    },
    {
      email: 'ashley.wilson@example.com',
      first_name: 'Ashley',
      last_name: 'Wilson',
      status: 'unsubscribed',
      tags: ['postpartum'],
      signup_source: 'website',
      interests: ['postpartum-support'],
      metadata: { unsubscribe_reason: 'no-longer-relevant' }
    }
  ];
  
  const { data, error } = await supabase
    .from('subscribers')
    .insert(testSubscribers)
    .select();
  
  if (error) {
    console.error('Error adding subscribers:', error);
    return false;
  }
  
  console.log(`✅ Added ${data.length} test subscribers`);
  return true;
}

async function addTestContactSubmissions() {
  console.log('📬 Adding test contact form submissions...');
  
  const testContacts = [
    {
      name: 'Rachel Green',
      email: 'rachel.green@example.com',
      phone: '(512) 555-0123',
      service: 'postpartum-depression-support',
      message: 'I recently had my second baby and I\'m struggling more than I did with my first. I\'d like to learn more about your postpartum support services.',
      status: 'new',
      source: 'website'
    },
    {
      name: 'Monica Geller',
      email: 'monica.geller@example.com',
      phone: '(512) 555-0456',
      service: 'anxiety-stress-management',
      message: 'I\'ve been dealing with severe anxiety since becoming a mom. I need help managing my stress and would like to schedule a consultation.',
      status: 'contacted',
      source: 'google-ads'
    },
    {
      name: 'Phoebe Buffay',
      email: 'phoebe.buffay@example.com',
      service: 'therapy-for-women',
      message: 'Looking for general therapy support. Going through some life transitions and need someone to talk to.',
      status: 'converted',
      source: 'website'
    }
  ];
  
  const { data, error } = await supabase
    .from('contact_submissions')
    .insert(testContacts)
    .select();
  
  if (error) {
    console.error('Error adding contact submissions:', error);
    return false;
  }
  
  console.log(`✅ Added ${data.length} test contact submissions`);
  return true;
}

async function addTestCareerApplications() {
  console.log('💼 Adding test career applications...');
  
  const testApplications = [
    {
      first_name: 'Lisa',
      last_name: 'Thompson',
      email: 'lisa.thompson@example.com',
      phone: '(512) 555-0789',
      position: 'Licensed Clinical Social Worker (LCSW)',
      experience: 'I have 8 years of experience in maternal mental health, including 3 years specializing in postpartum depression and anxiety. Currently working at Austin Community Mental Health Center.',
      motivation: 'I\'m passionate about supporting new mothers and would love to join a practice that specializes in this area. Your holistic approach aligns perfectly with my treatment philosophy.',
      availability: 'Full-time',
      status: 'reviewing'
    },
    {
      first_name: 'Amanda',
      last_name: 'Chen',
      email: 'amanda.chen@example.com',
      phone: '(512) 555-0234',
      position: 'Licensed Professional Counselor (LPC)',
      experience: '5 years in private practice, specializing in women\'s mental health and trauma-informed care. Certified in EMDR and perinatal mental health.',
      motivation: 'Looking to transition from solo practice to a collaborative team environment. Very interested in your integrated approach to maternal mental health.',
      availability: 'Part-time',
      status: 'new'
    }
  ];
  
  const { data, error } = await supabase
    .from('career_applications')
    .insert(testApplications)
    .select();
  
  if (error) {
    console.error('Error adding career applications:', error);
    return false;
  }
  
  console.log(`✅ Added ${data.length} test career applications`);
  return true;
}

async function addTestChatConversations() {
  console.log('💬 Adding test chat conversations...');
  
  const testChats = [
    {
      session_id: 'test-session-001',
      user_name: 'Emily',
      user_email: 'emily.test@example.com',
      messages: [
        {
          role: 'user',
          content: 'Hi, do you offer virtual sessions?',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          role: 'assistant',
          content: 'Yes! We offer both in-person and virtual therapy sessions. Many of our clients find virtual sessions convenient, especially new mothers who may have childcare considerations. Would you like to learn more about our virtual session options?',
          timestamp: new Date(Date.now() - 3500000).toISOString()
        },
        {
          role: 'user',
          content: 'Yes, that would be great. Also, do you take insurance?',
          timestamp: new Date(Date.now() - 3400000).toISOString()
        },
        {
          role: 'assistant',
          content: 'We are out-of-network providers, but we can provide you with a superbill for insurance reimbursement if you have out-of-network benefits. We also offer sliding scale fees for those who qualify. Would you like to schedule a free 15-minute consultation to discuss your specific needs and insurance situation?',
          timestamp: new Date(Date.now() - 3300000).toISOString()
        }
      ],
      status: 'active',
      metadata: { converted: true, scheduled_consultation: true }
    },
    {
      session_id: 'test-session-002',
      messages: [
        {
          role: 'user',
          content: 'What\'s the difference between postpartum depression and baby blues?',
          timestamp: new Date(Date.now() - 7200000).toISOString()
        },
        {
          role: 'assistant',
          content: 'Great question! Baby blues are very common (affecting up to 80% of new mothers) and typically last 2 weeks or less after birth. Symptoms include mood swings, crying, and feeling overwhelmed. Postpartum depression is more severe and long-lasting, affecting about 10-15% of new mothers. It can start anytime in the first year and includes symptoms like persistent sadness, anxiety, difficulty bonding with baby, and changes in sleep/appetite beyond what\'s expected with a newborn. If you\'re experiencing symptoms lasting more than 2 weeks, it\'s important to reach out for support.',
          timestamp: new Date(Date.now() - 7100000).toISOString()
        }
      ],
      status: 'active'
    }
  ];
  
  const { data, error } = await supabase
    .from('chat_conversations')
    .insert(testChats)
    .select();
  
  if (error) {
    console.error('Error adding chat conversations:', error);
    return false;
  }
  
  console.log(`✅ Added ${data.length} test chat conversations`);
  return true;
}

async function addTestAnalytics() {
  console.log('📊 Adding test analytics events...');
  
  // Generate some realistic analytics data for the past week
  const events = [];
  const pages = ['/', '/services/postpartum-depression-support', '/about', '/contact', '/blog', '/new-mom-program'];
  const sessionPrefix = 'test-session-';
  
  for (let i = 0; i < 50; i++) {
    const daysAgo = Math.floor(Math.random() * 7);
    const hoursAgo = Math.floor(Math.random() * 24);
    const timestamp = new Date(Date.now() - (daysAgo * 24 + hoursAgo) * 3600000);
    const sessionId = sessionPrefix + Math.floor(i / 3); // Group events by session
    
    events.push({
      type: 'page_view',
      page: pages[Math.floor(Math.random() * pages.length)],
      session_id: sessionId,
      user_id: 'test-user-' + Math.floor(i / 5),
      data: {
        source: ['google', 'direct', 'facebook', 'instagram'][Math.floor(Math.random() * 4)],
        device: ['mobile', 'desktop', 'tablet'][Math.floor(Math.random() * 3)]
      },
      created_at: timestamp
    });
  }
  
  // Add some conversion events
  events.push(
    {
      type: 'newsletter_signup',
      page: '/blog',
      session_id: 'test-session-5',
      data: { email: 'test@example.com' },
      created_at: new Date(Date.now() - 86400000)
    },
    {
      type: 'contact_form',
      page: '/contact',
      session_id: 'test-session-8',
      data: { service: 'anxiety-management' },
      created_at: new Date(Date.now() - 172800000)
    },
    {
      type: 'booking_click',
      page: '/services/postpartum-depression-support',
      session_id: 'test-session-12',
      data: { service: 'postpartum-support' },
      created_at: new Date(Date.now() - 259200000)
    }
  );
  
  const { data, error } = await supabase
    .from('analytics_events')
    .insert(events)
    .select();
  
  if (error) {
    console.error('Error adding analytics events:', error);
    return false;
  }
  
  console.log(`✅ Added ${data.length} test analytics events`);
  return true;
}

async function main() {
  console.log('🚀 Adding test data to Supabase...\n');
  
  // Add all test data
  await addTestSubscribers();
  console.log('');
  
  await addTestContactSubmissions();
  console.log('');
  
  await addTestCareerApplications();
  console.log('');
  
  await addTestChatConversations();
  console.log('');
  
  await addTestAnalytics();
  console.log('');
  
  console.log('✅ All test data added successfully!');
  console.log('\nYou can now view this data in:');
  console.log('- Supabase Table Editor: https://supabase.com/dashboard/project/utetcmirepwdxbtrcczv/editor');
  console.log('- Your admin panel at /admin (once we update the endpoints)');
}

main().catch(console.error);