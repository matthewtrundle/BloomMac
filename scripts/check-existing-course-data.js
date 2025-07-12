const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkExistingData() {
  console.log('📊 CHECKING EXISTING COURSE DATA\n');
  
  // 1. Check all data in user_course_access
  console.log('1️⃣ USER_COURSE_ACCESS DATA:');
  const { data: accessData } = await supabase
    .from('user_course_access')
    .select('*');
    
  if (accessData && accessData.length > 0) {
    console.log(`Found ${accessData.length} access records:\n`);
    accessData.forEach((record, idx) => {
      console.log(`Record ${idx + 1}:`);
      console.log(`  Email: ${record.customer_email}`);
      console.log(`  Course: ${record.course_id}`);
      console.log(`  Payment Status: ${record.payment_status}`);
      console.log(`  Granted: ${new Date(record.access_granted_at).toLocaleDateString()}`);
      console.log(`  Stripe Customer: ${record.stripe_customer_id || 'None'}`);
      console.log(`  Stripe Session: ${record.stripe_session_id || 'None'}`);
      console.log('');
    });
  } else {
    console.log('No access records found.\n');
  }
  
  // 2. Check all data in course_progress
  console.log('\n2️⃣ COURSE_PROGRESS DATA:');
  const { data: progressData } = await supabase
    .from('course_progress')
    .select('*');
    
  if (progressData && progressData.length > 0) {
    console.log(`Found ${progressData.length} progress records:\n`);
    progressData.forEach((record, idx) => {
      console.log(`Record ${idx + 1}:`);
      console.log(`  User ID: ${record.user_id}`);
      console.log(`  Course: ${record.course_id}`);
      console.log(`  Week ${record.week_number}, Lesson ${record.lesson_number}`);
      console.log(`  Status: ${record.status}`);
      console.log(`  Video Progress: ${record.video_progress_percentage}%`);
      console.log(`  Time Spent: ${record.time_spent_minutes} minutes`);
      console.log('');
    });
  } else {
    console.log('No progress records found.\n');
  }
  
  // 3. Check if any of the emails in user_course_access have matching users
  console.log('\n3️⃣ CHECKING USER MATCHES:');
  if (accessData && accessData.length > 0) {
    for (const record of accessData) {
      const { data: users } = await supabase
        .auth.admin.listUsers();
        
      const matchingUser = users?.users?.find(u => u.email === record.customer_email);
      
      if (matchingUser) {
        console.log(`✅ Found user for ${record.customer_email}: ${matchingUser.id}`);
      } else {
        console.log(`❌ No user found for ${record.customer_email}`);
      }
    }
  }
  
  // 4. Check course_enrollments (even though it's empty)
  console.log('\n\n4️⃣ COURSE_ENROLLMENTS DATA:');
  const { count: enrollmentCount } = await supabase
    .from('course_enrollments')
    .select('*', { count: 'exact', head: true });
  console.log(`Count: ${enrollmentCount} (empty table)`);
  
  // 5. Check course_purchases (even though it's empty)
  console.log('\n5️⃣ COURSE_PURCHASES DATA:');
  const { count: purchaseCount } = await supabase
    .from('course_purchases')
    .select('*', { count: 'exact', head: true });
  console.log(`Count: ${purchaseCount} (empty table)`);
}

checkExistingData().catch(console.error);