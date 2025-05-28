const fetch = require('node-fetch');

async function testAdminAuth() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🔐 Testing Admin Authentication\n');
  
  // Test 1: Try to access protected routes without auth
  console.log('1. Testing protected routes without authentication:');
  const protectedRoutes = [
    '/admin/analytics',
    '/admin/activity',
    '/admin/settings',
    '/admin/email',
    '/admin/email-sequences',
    '/admin/newsletter',
    '/admin/backup',
    '/admin/blog',
    '/admin/careers',
    '/admin/image-prompts',
    '/admin/email-test',
    '/api/newsletter-admin',
    '/api/email-analytics',
    '/api/email-automations',
    '/api/chat-analytics',
    '/api/admin/activity-log',
    '/api/backup',
    '/api/blog-admin'
  ];
  
  for (const route of protectedRoutes) {
    try {
      const res = await fetch(`${baseUrl}${route}`, {
        redirect: 'manual'
      });
      
      if (res.status === 308 || res.status === 307) {
        console.log(`✅ ${route} - Redirected to login (protected)`);
      } else if (res.status === 401) {
        console.log(`✅ ${route} - 401 Unauthorized (API protected)`);
      } else {
        console.log(`❌ ${route} - Status ${res.status} (NOT PROTECTED!)`);
      }
    } catch (error) {
      console.log(`⚠️  ${route} - Error: ${error.message}`);
    }
  }
  
  // Test 2: Login page should be accessible
  console.log('\n2. Testing login page accessibility:');
  try {
    const res = await fetch(`${baseUrl}/admin/login`);
    if (res.status === 200) {
      console.log('✅ /admin/login - Accessible without auth');
    } else {
      console.log(`❌ /admin/login - Status ${res.status}`);
    }
  } catch (error) {
    console.log(`⚠️  /admin/login - Error: ${error.message}`);
  }
  
  console.log('\n📌 Summary:');
  console.log('- All admin routes should redirect to login when not authenticated');
  console.log('- API routes should return 401 when not authenticated');
  console.log('- Only /admin/login should be accessible without auth');
  console.log('\nIf any routes show as NOT PROTECTED, the middleware needs adjustment.');
}

testAdminAuth().catch(console.error);