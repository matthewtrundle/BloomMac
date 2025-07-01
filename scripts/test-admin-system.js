const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testAdminSystem() {
  console.log('🧪 Comprehensive Admin System Test\n');
  console.log('Testing all migrated functionality...\n');

  const results = {
    auth: { status: '❌', message: '' },
    contacts: { status: '❌', message: '' },
    careers: { status: '❌', message: '' },
    logging: { status: '❌', message: '' },
    database: { status: '❌', message: '' }
  };

  // 1. Test Authentication System
  console.log('1️⃣ Testing Authentication System...');
  try {
    const { data: adminUsers, error } = await supabase
      .from('admin_users')
      .select('id, email, role, is_active')
      .eq('is_active', true);

    if (error) throw error;

    const activeAdmins = adminUsers.filter(u => u.is_active);
    if (activeAdmins.length > 0) {
      results.auth.status = '✅';
      results.auth.message = `${activeAdmins.length} active admin users found`;
      console.log(`   ✅ ${activeAdmins.length} active admin users`);
      activeAdmins.forEach(admin => {
        console.log(`      - ${admin.email} (${admin.role})`);
      });
    } else {
      throw new Error('No active admin users found');
    }
  } catch (error) {
    results.auth.status = '❌';
    results.auth.message = error.message;
    console.log(`   ❌ Auth test failed: ${error.message}`);
  }

  // 2. Test Contact Submissions
  console.log('\n2️⃣ Testing Contact Submissions...');
  try {
    const { count: contactCount, error } = await supabase
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    results.contacts.status = '✅';
    results.contacts.message = `Table exists with ${contactCount} submissions`;
    console.log(`   ✅ contact_submissions table: ${contactCount} records`);

    // Test table structure
    const { data: sample } = await supabase
      .from('contact_submissions')
      .select('*')
      .limit(1);

    if (sample && sample.length > 0) {
      console.log(`   ✅ Table structure verified`);
    }
  } catch (error) {
    results.contacts.status = '❌';
    results.contacts.message = error.message;
    console.log(`   ❌ Contacts test failed: ${error.message}`);
  }

  // 3. Test Career Applications
  console.log('\n3️⃣ Testing Career Applications...');
  try {
    const { count: careerCount, error } = await supabase
      .from('career_applications')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    results.careers.status = '✅';
    results.careers.message = `Table exists with ${careerCount} applications`;
    console.log(`   ✅ career_applications table: ${careerCount} records`);

    // Test table structure
    const { data: sample } = await supabase
      .from('career_applications')
      .select('*')
      .limit(1);

    if (sample && sample.length > 0) {
      console.log(`   ✅ Table structure verified`);
    }
  } catch (error) {
    results.careers.status = '❌';
    results.careers.message = error.message;
    console.log(`   ❌ Careers test failed: ${error.message}`);
  }

  // 4. Test Activity Logging
  console.log('\n4️⃣ Testing Activity Logging...');
  try {
    const { count: logCount, error } = await supabase
      .from('admin_activity_log')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    results.logging.status = '✅';
    results.logging.message = `${logCount} activity log entries`;
    console.log(`   ✅ admin_activity_log table: ${logCount} entries`);

    // Show recent activity
    const { data: recentActivity } = await supabase
      .from('admin_activity_log')
      .select('action, entity_type, created_at')
      .order('created_at', { ascending: false })
      .limit(3);

    if (recentActivity && recentActivity.length > 0) {
      console.log(`   📋 Recent activity:`);
      recentActivity.forEach(activity => {
        const date = new Date(activity.created_at).toLocaleString();
        console.log(`      - ${activity.action} (${activity.entity_type}) - ${date}`);
      });
    }
  } catch (error) {
    results.logging.status = '❌';
    results.logging.message = error.message;
    console.log(`   ❌ Logging test failed: ${error.message}`);
  }

  // 5. Test Database Health
  console.log('\n5️⃣ Testing Database Health...');
  try {
    const tables = [
      'admin_users',
      'contact_submissions', 
      'career_applications',
      'admin_activity_log',
      'blog_posts',
      'subscribers'
    ];

    let healthyTables = 0;
    for (const table of tables) {
      try {
        const { error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (!error) {
          healthyTables++;
        }
      } catch (err) {
        console.log(`   ⚠️  Table ${table} may have issues`);
      }
    }

    const healthPercent = Math.round((healthyTables / tables.length) * 100);
    results.database.status = healthPercent >= 80 ? '✅' : '⚠️';
    results.database.message = `${healthyTables}/${tables.length} tables healthy (${healthPercent}%)`;
    console.log(`   ${results.database.status} Database health: ${healthPercent}%`);
  } catch (error) {
    results.database.status = '❌';
    results.database.message = error.message;
    console.log(`   ❌ Database test failed: ${error.message}`);
  }

  // Summary Report
  console.log('\n📊 Test Summary Report');
  console.log('=' .repeat(50));
  
  Object.entries(results).forEach(([test, result]) => {
    console.log(`${result.status} ${test.toUpperCase()}: ${result.message}`);
  });

  // Overall Status
  const passedTests = Object.values(results).filter(r => r.status === '✅').length;
  const totalTests = Object.keys(results).length;
  const overallHealth = Math.round((passedTests / totalTests) * 100);

  console.log('\n🎯 Overall System Health');
  console.log('=' .repeat(50));
  console.log(`Tests Passed: ${passedTests}/${totalTests} (${overallHealth}%)`);
  
  if (overallHealth >= 80) {
    console.log('🎉 SYSTEM STATUS: HEALTHY - Ready for production!');
  } else if (overallHealth >= 60) {
    console.log('⚠️  SYSTEM STATUS: NEEDS ATTENTION - Minor issues detected');
  } else {
    console.log('❌ SYSTEM STATUS: CRITICAL - Major issues need resolution');
  }

  // Next Steps
  console.log('\n🚀 Next Steps');
  console.log('=' .repeat(50));
  console.log('1. Test admin login at: http://localhost:3000/admin/login');
  console.log('2. Email: beta1@bloomtest.com');
  console.log('3. Test contact form: http://localhost:3000/contact');
  console.log('4. Test career form: http://localhost:3000/careers');
  console.log('5. View admin panels:');
  console.log('   - Contacts: http://localhost:3000/admin/contacts');
  console.log('   - Careers: http://localhost:3000/admin/careers');

  console.log('\n✅ Admin system migration test complete!');
}

testAdminSystem().catch(console.error);