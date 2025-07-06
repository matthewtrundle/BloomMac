const http = require('http');

async function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(data);
    }
    
    req.end();
  });
}

async function testFunctionality() {
  console.log('🧪 Testing Bloom Psychology Functionality\n');

  // 1. Test Admin Login
  console.log('1️⃣ Testing Admin Login...');
  const loginData = JSON.stringify({
    email: 'testadmin@bloom.local',
    password: 'TestAdmin123!'
  });

  const loginResponse = await makeRequest({
    hostname: 'localhost',
    port: 3002,
    path: '/api/admin/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': loginData.length
    }
  }, loginData);

  console.log(`   Status: ${loginResponse.status}`);
  
  if (loginResponse.status === 200) {
    console.log('   ✅ Admin login successful');
    const cookies = loginResponse.headers['set-cookie'];
    const cookieString = cookies ? cookies.join('; ') : '';
    
    // 2. Test Admin Session
    console.log('\n2️⃣ Testing Admin Session...');
    const sessionResponse = await makeRequest({
      hostname: 'localhost',
      port: 3002,
      path: '/api/admin/auth/session',
      method: 'GET',
      headers: {
        'Cookie': cookieString
      }
    });
    
    console.log(`   Status: ${sessionResponse.status}`);
    if (sessionResponse.status === 200) {
      console.log('   ✅ Session valid');
    } else {
      console.log('   ❌ Session check failed');
    }
    
    // 3. Test Contact Management
    console.log('\n3️⃣ Testing Contact Management...');
    const contactsResponse = await makeRequest({
      hostname: 'localhost',
      port: 3002,
      path: '/api/admin/contacts',
      method: 'GET',
      headers: {
        'Cookie': cookieString
      }
    });
    
    console.log(`   Status: ${contactsResponse.status}`);
    if (contactsResponse.status === 200) {
      const data = JSON.parse(contactsResponse.body);
      console.log(`   ✅ Retrieved ${data.contacts?.length || 0} contacts`);
    } else {
      console.log(`   ❌ Failed to retrieve contacts: ${contactsResponse.body}`);
    }
    
    // 4. Test Career Applications
    console.log('\n4️⃣ Testing Career Applications...');
    const careersResponse = await makeRequest({
      hostname: 'localhost',
      port: 3002,
      path: '/api/admin/careers',
      method: 'GET',
      headers: {
        'Cookie': cookieString
      }
    });
    
    console.log(`   Status: ${careersResponse.status}`);
    if (careersResponse.status === 200) {
      const data = JSON.parse(careersResponse.body);
      console.log(`   ✅ Retrieved ${data.data?.length || 0} applications`);
    } else {
      console.log(`   ❌ Failed to retrieve careers: ${careersResponse.body}`);
    }
    
    // 5. Test Analytics
    console.log('\n5️⃣ Testing Analytics...');
    const analyticsResponse = await makeRequest({
      hostname: 'localhost',
      port: 3002,
      path: '/api/admin/analytics',
      method: 'GET',
      headers: {
        'Cookie': cookieString
      }
    });
    
    console.log(`   Status: ${analyticsResponse.status}`);
    if (analyticsResponse.status === 200) {
      const data = JSON.parse(analyticsResponse.body);
      console.log(`   ✅ Analytics data retrieved`);
    } else {
      console.log(`   ❌ Failed to retrieve analytics: ${analyticsResponse.body}`);
    }
    
    // 6. Test Logout
    console.log('\n6️⃣ Testing Logout...');
    const logoutResponse = await makeRequest({
      hostname: 'localhost',
      port: 3002,
      path: '/api/admin/auth/logout',
      method: 'POST',
      headers: {
        'Cookie': cookieString
      }
    });
    
    console.log(`   Status: ${logoutResponse.status}`);
    if (logoutResponse.status === 200) {
      console.log('   ✅ Logout successful');
    } else {
      console.log('   ❌ Logout failed');
    }
    
  } else {
    console.log(`   ❌ Admin login failed: ${loginResponse.body}`);
  }
  
  // 7. Test Public Contact Form
  console.log('\n7️⃣ Testing Public Contact Form...');
  const contactData = JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    message: 'Test message from functionality test',
    service: 'therapy'
  });
  
  const contactResponse = await makeRequest({
    hostname: 'localhost',
    port: 3002,
    path: '/api/contact/submit',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': contactData.length
    }
  }, contactData);
  
  console.log(`   Status: ${contactResponse.status}`);
  if (contactResponse.status === 200) {
    const data = JSON.parse(contactResponse.body);
    console.log(`   ✅ Contact form submitted: ${data.id}`);
  } else {
    console.log(`   ❌ Contact form failed: ${contactResponse.body}`);
  }
  
  // 8. Test Wellness Hub Registration
  console.log('\n8️⃣ Testing User Registration...');
  const userData = JSON.stringify({
    email: `testuser${Date.now()}@example.com`,
    password: 'Test123!',
    firstName: 'Test',
    lastName: 'User'
  });
  
  const registerResponse = await makeRequest({
    hostname: 'localhost',
    port: 3002,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': userData.length
    }
  }, userData);
  
  console.log(`   Status: ${registerResponse.status}`);
  if (registerResponse.status === 200 || registerResponse.status === 201) {
    console.log('   ✅ User registration successful');
  } else {
    console.log(`   ❌ Registration failed: ${registerResponse.body}`);
  }
  
  console.log('\n\n📊 Test Summary');
  console.log('================');
  console.log('Admin functionality tested:');
  console.log('  - Login/Logout');
  console.log('  - Session management');
  console.log('  - Contact management');
  console.log('  - Career applications');
  console.log('  - Analytics');
  console.log('\nPublic functionality tested:');
  console.log('  - Contact form');
  console.log('  - User registration');
  
  console.log('\n✅ Functionality test complete!');
}

testFunctionality().catch(console.error);