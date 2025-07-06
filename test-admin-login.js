const fetch = require('node-fetch');

async function testAdminLogin() {
  const baseUrl = 'https://bloompsychologynorthaustin.com';
  
  console.log('🔐 Testing Admin Login...\n');
  
  // Test login endpoint
  try {
    const response = await fetch(`${baseUrl}/api/admin/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@bloompsychologynorthaustin.com',
        password: 'AdminPassword123!'
      })
    });
    
    const data = await response.json();
    
    console.log('Response Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n✅ Admin login endpoint is working!');
      console.log('Admin user:', data.user);
      
      // Get cookies from response
      const cookies = response.headers.get('set-cookie');
      console.log('\nCookies set:', cookies ? 'Yes' : 'No');
    } else {
      console.log('\n❌ Admin login failed:', data.error);
      
      if (data.error === 'Access denied. Admin privileges required.') {
        console.log('\n💡 The user exists but is not in the admin_users table.');
        console.log('   Run the fix-admin-panel.sql script to create admin access.');
      }
    }
  } catch (error) {
    console.error('\n❌ Error connecting to admin endpoint:', error.message);
    console.log('\n💡 Possible issues:');
    console.log('   - The API endpoint is not deployed yet');
    console.log('   - The server is down');
    console.log('   - Network/CORS issues');
  }
  
  // Test if admin pages are accessible
  console.log('\n📄 Testing Admin Pages...\n');
  
  try {
    const pageResponse = await fetch(`${baseUrl}/admin/login`);
    console.log('Admin login page status:', pageResponse.status);
    
    if (pageResponse.ok) {
      console.log('✅ Admin login page is accessible');
    } else {
      console.log('❌ Admin login page returned:', pageResponse.status);
    }
  } catch (error) {
    console.error('❌ Error accessing admin pages:', error.message);
  }
}

// Run the test
console.log('🧪 Admin Panel Test\n');
console.log('Testing:', 'https://bloompsychologynorthaustin.com');
console.log('Default credentials:');
console.log('Email: admin@bloompsychologynorthaustin.com');
console.log('Password: AdminPassword123!');
console.log('\n' + '='.repeat(50) + '\n');

testAdminLogin();