const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testCareerApplications() {
  console.log('💼 Testing Career Applications System\n');

  // 1. Check if career_applications table exists
  console.log('1️⃣ Checking career_applications table...');
  try {
    const { count, error } = await supabase
      .from('career_applications')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Table error:', error);
    } else {
      console.log(`✅ Table exists with ${count} applications`);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }

  // 2. Show recent applications
  console.log('\n2️⃣ Recent Career Applications:');
  try {
    const { data: recent, error } = await supabase
      .from('career_applications')
      .select('first_name, last_name, email, position, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) {
      console.error('❌ Error fetching applications:', error);
    } else if (recent.length === 0) {
      console.log('📭 No career applications yet');
    } else {
      console.log(`📬 Last ${recent.length} applications:`);
      recent.forEach(a => {
        const date = new Date(a.created_at).toLocaleString();
        console.log(`   - ${a.first_name} ${a.last_name} (${a.email}) - ${a.position} - ${a.status} - ${date}`);
      });
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }

  // 3. Test API endpoints
  console.log('\n3️⃣ Test Application Submission:');
  console.log('To test the career application form:');
  console.log('1. Start the dev server: npm run dev');
  console.log('2. Go to: http://localhost:3000/careers');
  console.log('3. Fill out and submit the application form');
  console.log('4. Check the admin panel: http://localhost:3000/admin/careers');

  // 4. Check admin access
  console.log('\n4️⃣ Admin Access:');
  console.log('- Login at: http://localhost:3000/admin/login');
  console.log('- Use: beta1@bloomtest.com');
  console.log('- Career applications: http://localhost:3000/admin/careers');

  // 5. Show application stats by status
  console.log('\n5️⃣ Application Statistics:');
  try {
    const { data: stats, error } = await supabase
      .from('career_applications')
      .select('status, position');
    
    if (error) {
      console.error('❌ Error:', error);
    } else if (stats.length === 0) {
      console.log('📊 No applications to analyze');
    } else {
      const statusCounts = {};
      const positionCounts = {};
      
      stats.forEach(app => {
        statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
        positionCounts[app.position] = (positionCounts[app.position] || 0) + 1;
      });
      
      console.log('📊 By Status:');
      Object.entries(statusCounts).forEach(([status, count]) => {
        console.log(`   - ${status}: ${count}`);
      });
      
      console.log('📊 By Position:');
      Object.entries(positionCounts).forEach(([position, count]) => {
        console.log(`   - ${position}: ${count}`);
      });
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }

  console.log('\n✅ Career applications system check complete!');
}

testCareerApplications().catch(console.error);