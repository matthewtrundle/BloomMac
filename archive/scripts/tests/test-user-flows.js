require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testUserFlows() {
  console.log('🧪 Testing User Flows...\n');

  const tests = {
    passed: [],
    failed: []
  };

  // Test 1: Course Content Flow
  console.log('1️⃣ Testing Course Content Flow...');
  try {
    // Get a course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', 'postpartum-wellness-foundations')
      .single();
    
    if (courseError) throw courseError;
    console.log('  ✅ Found course:', course.title);

    // Get modules for the course
    const { data: modules, error: modulesError } = await supabase
      .from('course_modules')
      .select('*, course_lessons(*)')
      .eq('course_id', course.id)
      .order('week_number');
    
    if (modulesError) throw modulesError;
    console.log(`  ✅ Found ${modules.length} modules`);

    // Check if lessons have content
    const totalLessons = modules.reduce((sum, m) => sum + m.course_lessons.length, 0);
    const lessonsWithSlides = modules.reduce((sum, m) => 
      sum + m.course_lessons.filter(l => l.slides_html).length, 0
    );
    console.log(`  ✅ ${lessonsWithSlides}/${totalLessons} lessons have HTML slides`);

    tests.passed.push('Course Content Flow');
  } catch (error) {
    console.log('  ❌ Error:', error.message);
    tests.failed.push({ test: 'Course Content Flow', error: error.message });
  }

  // Test 2: Blog System
  console.log('\n2️⃣ Testing Blog System...');
  try {
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .not('published_at', 'is', null)
      .limit(5);
    
    if (error) throw error;
    console.log(`  ✅ Found ${posts.length} published blog posts`);
    
    tests.passed.push('Blog System');
  } catch (error) {
    console.log('  ❌ Error:', error.message);
    tests.failed.push({ test: 'Blog System', error: error.message });
  }

  // Test 3: Email Templates
  console.log('\n3️⃣ Testing Email Templates...');
  try {
    const { data: templates, error } = await supabase
      .from('email_templates')
      .select('*')
      .limit(5);
    
    if (error) throw error;
    console.log(`  ✅ Found ${templates.length} email templates`);
    
    tests.passed.push('Email Templates');
  } catch (error) {
    console.log('  ❌ Error:', error.message);
    tests.failed.push({ test: 'Email Templates', error: error.message });
  }

  // Test 4: Analytics Events
  console.log('\n4️⃣ Testing Analytics Events...');
  try {
    const { data: events, error } = await supabase
      .from('analytics_events')
      .select('type')
      .limit(10);
    
    if (error) throw error;
    console.log(`  ✅ Found ${events.length} analytics events`);
    
    tests.passed.push('Analytics Events');
  } catch (error) {
    console.log('  ❌ Error:', error.message);
    tests.failed.push({ test: 'Analytics Events', error: error.message });
  }

  // Test 5: Contact Submissions
  console.log('\n5️⃣ Testing Contact Submissions...');
  try {
    const { count, error } = await supabase
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    console.log(`  ✅ Contact submissions table accessible (${count || 0} entries)`);
    
    tests.passed.push('Contact Submissions');
  } catch (error) {
    console.log('  ❌ Error:', error.message);
    tests.failed.push({ test: 'Contact Submissions', error: error.message });
  }

  // Test 6: Admin Users
  console.log('\n6️⃣ Testing Admin Users...');
  try {
    const { data: admins, error } = await supabase
      .from('admin_users')
      .select('email, name, role')
      .eq('is_active', true);
    
    if (error) throw error;
    console.log(`  ✅ Found ${admins.length} active admin users`);
    admins.forEach(admin => {
      console.log(`     - ${admin.name || admin.email} (${admin.role})`);
    });
    
    tests.passed.push('Admin Users');
  } catch (error) {
    console.log('  ❌ Error:', error.message);
    tests.failed.push({ test: 'Admin Users', error: error.message });
  }

  // Test 7: Storage Buckets
  console.log('\n7️⃣ Testing Storage Buckets...');
  try {
    const { data: files, error } = await supabase
      .storage
      .from('blog-images')
      .list('', { limit: 5 });
    
    if (error) throw error;
    console.log(`  ✅ Blog images bucket accessible (${files?.length || 0} files)`);
    
    tests.passed.push('Storage Buckets');
  } catch (error) {
    console.log('  ❌ Error:', error.message);
    tests.failed.push({ test: 'Storage Buckets', error: error.message });
  }

  // Summary
  console.log('\n📊 Test Summary:');
  console.log(`✅ Passed: ${tests.passed.length}`);
  console.log(`❌ Failed: ${tests.failed.length}`);

  if (tests.failed.length > 0) {
    console.log('\n❌ Failed Tests:');
    tests.failed.forEach(({ test, error }) => {
      console.log(`  - ${test}: ${error}`);
    });
  }

  // Check for data integrity issues
  console.log('\n🔍 Data Integrity Checks:');
  
  // Check for lessons without modules
  const { data: orphanLessons, error: orphanError } = await supabase
    .from('course_lessons')
    .select('id, title')
    .is('module_id', null);
  
  if (!orphanError && orphanLessons?.length > 0) {
    console.log(`  ⚠️  Found ${orphanLessons.length} lessons without modules`);
  } else {
    console.log('  ✅ All lessons have modules');
  }

  // Check for duplicate email templates
  const { data: emailTemplates } = await supabase
    .from('email_templates')
    .select('name');
  
  const templateNames = emailTemplates?.map(t => t.name) || [];
  const duplicates = templateNames.filter((name, index) => templateNames.indexOf(name) !== index);
  
  if (duplicates.length > 0) {
    console.log(`  ⚠️  Found duplicate email template names: ${duplicates.join(', ')}`);
  } else {
    console.log('  ✅ No duplicate email templates');
  }
}

testUserFlows().catch(console.error);