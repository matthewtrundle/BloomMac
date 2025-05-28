const fetch = require('node-fetch');

async function testLogin() {
  const baseUrl = 'http://localhost:3003';
  
  console.log('🔍 Testing Admin Login Flow\n');

  // Test 1: Check if login endpoint exists
  console.log('1. Testing login endpoint...');
  try {
    const response = await fetch(`${baseUrl}/api/admin/simple-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@bloom.com',
        password: 'bloom-admin-2024'
      })
    });

    console.log(`   Status: ${response.status}`);
    const data = await response.json();
    console.log(`   Response:`, data);
    
    // Check for Set-Cookie header
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      console.log(`   ✅ Cookie set:`, setCookie);
      
      // Extract the cookie value
      const cookieMatch = setCookie.match(/adminToken=([^;]+)/);
      if (cookieMatch) {
        const token = cookieMatch[1];
        console.log(`   Token extracted:`, token.substring(0, 50) + '...');
        
        // Test 2: Try to access protected route with cookie
        console.log('\n2. Testing protected route access...');
        const protectedResponse = await fetch(`${baseUrl}/admin/analytics`, {
          headers: {
            'Cookie': `adminToken=${token}`
          },
          redirect: 'manual'
        });
        
        console.log(`   Status: ${protectedResponse.status}`);
        if (protectedResponse.status === 200) {
          console.log('   ✅ Successfully accessed protected route!');
        } else if (protectedResponse.status === 302 || protectedResponse.status === 308) {
          console.log(`   ❌ Redirected to: ${protectedResponse.headers.get('location')}`);
        } else {
          console.log('   ❌ Failed to access protected route');
        }
      }
    } else {
      console.log('   ❌ No cookie set in response');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  // Test 3: Check middleware
  console.log('\n3. Testing middleware protection...');
  try {
    const unprotectedResponse = await fetch(`${baseUrl}/admin/analytics`, {
      redirect: 'manual'
    });
    
    if (unprotectedResponse.status === 308 || unprotectedResponse.status === 307) {
      console.log('   ✅ Middleware is protecting routes (redirected to login)');
    } else {
      console.log(`   ❌ Unexpected status: ${unprotectedResponse.status}`);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testLogin().catch(console.error);