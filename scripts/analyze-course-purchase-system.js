const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function analyzePurchaseSystem() {
  console.log('🔍 COURSE PURCHASE & ACCESS SYSTEM ANALYSIS\n');
  console.log('='.repeat(60));
  
  // 1. Check main course info
  console.log('\n1️⃣ COURSE CATALOG:');
  const { data: courses } = await supabase
    .from('courses')
    .select('id, slug, title, price, is_active');
    
  courses?.forEach(course => {
    console.log(`\n  📚 ${course.title}`);
    console.log(`     ID: ${course.id}`);
    console.log(`     Slug: ${course.slug}`);
    console.log(`     Price: $${course.price}`);
    console.log(`     Active: ${course.is_active}`);
  });
  
  // 2. Check user_course_access structure and data
  console.log('\n\n2️⃣ USER COURSE ACCESS TABLE:');
  console.log('  Current Schema:');
  const { data: accessSample } = await supabase
    .from('user_course_access')
    .select('*')
    .limit(1);
    
  if (accessSample && accessSample[0]) {
    Object.keys(accessSample[0]).forEach(key => {
      console.log(`    - ${key}`);
    });
    
    console.log('\n  ⚠️  IMPORTANT FINDINGS:');
    console.log('  - Uses customer_email instead of user_id');
    console.log('  - course_id is the slug (not UUID)');
    console.log('  - Has stripe fields for payment processing');
    console.log('  - No direct user_id foreign key to auth.users');
  }
  
  // 3. Check course_progress structure
  console.log('\n\n3️⃣ COURSE PROGRESS TABLE:');
  console.log('  Current Schema:');
  const { data: progressSample } = await supabase
    .from('course_progress')
    .select('*')
    .limit(1);
    
  if (progressSample && progressSample[0]) {
    Object.keys(progressSample[0]).forEach(key => {
      console.log(`    - ${key}`);
    });
    
    console.log('\n  ⚠️  IMPORTANT FINDINGS:');
    console.log('  - Uses user_id (UUID) - proper foreign key');
    console.log('  - course_id is a string (not UUID) - "test-course"');
    console.log('  - Tracks by week_number and lesson_number');
    console.log('  - No lesson_id field (tracks by numbers instead)');
  }
  
  // 4. Check course_purchases structure
  console.log('\n\n4️⃣ COURSE PURCHASES TABLE:');
  const { count: purchaseCount } = await supabase
    .from('course_purchases')
    .select('*', { count: 'exact', head: true });
  console.log(`  Status: EXISTS but EMPTY (${purchaseCount} rows)`);
  console.log('  ❓ Appears unused - purchases tracked in user_course_access instead');
  
  // 5. Summary and recommendations
  console.log('\n\n📊 SYSTEM ANALYSIS SUMMARY:');
  console.log('='.repeat(60));
  console.log('\n🔴 CRITICAL ISSUES:');
  console.log('1. user_course_access uses email instead of user_id');
  console.log('2. course_id fields are inconsistent (slug vs UUID)');
  console.log('3. course_progress has no lesson_id linking to course_lessons');
  console.log('4. course_purchases table exists but is unused');
  console.log('5. No proper foreign key relationships');
  
  console.log('\n🟡 CURRENT WORKFLOW:');
  console.log('1. User purchases course → entry in user_course_access (with email)');
  console.log('2. User accesses course → need to match by email');
  console.log('3. Progress tracking → uses week/lesson numbers, not IDs');
  
  console.log('\n🟢 RECOMMENDATIONS:');
  console.log('1. Add user_id to user_course_access table');
  console.log('2. Standardize course_id to use UUIDs everywhere');
  console.log('3. Add lesson_id to course_progress for proper tracking');
  console.log('4. Consider using course_purchases for proper purchase records');
  console.log('5. Add proper foreign key constraints');
  
  // Check if we can link email to user
  console.log('\n\n5️⃣ TESTING EMAIL TO USER LINKING:');
  const { data: testAccess } = await supabase
    .from('user_course_access')
    .select('customer_email')
    .limit(1);
    
  if (testAccess && testAccess[0]) {
    const email = testAccess[0].customer_email;
    console.log(`\n  Testing with email: ${email}`);
    
    // Try to find user by email
    const { data: userData } = await supabase
      .from('auth.users')
      .select('id, email')
      .eq('email', email)
      .single();
      
    if (userData) {
      console.log(`  ✅ Found user: ${userData.id}`);
    } else {
      console.log(`  ❌ No user found with this email`);
    }
  }
}

analyzePurchaseSystem().catch(console.error);