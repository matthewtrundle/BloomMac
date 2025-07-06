const fetch = require('node-fetch');

const API_URL = process.env.API_URL || 'http://localhost:3000';
const TEST_EMAIL = `test-${Date.now()}@example.com`;
const TEST_PASSWORD = 'Test123456!';

async function testSignupWithSession() {
  console.log('Testing signup with session establishment...\n');

  try {
    // 1. Test signup
    console.log('1. Creating account...');
    const signupResponse = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        firstName: 'Test',
        lastName: 'User',
        phone: '1234567890'
      }),
    });

    const signupData = await signupResponse.json();
    console.log('Signup response:', {
      status: signupResponse.status,
      data: signupData,
      cookies: signupResponse.headers.get('set-cookie')
    });

    if (!signupResponse.ok) {
      throw new Error(`Signup failed: ${signupData.error}`);
    }

    // Extract cookies from signup response
    const cookies = signupResponse.headers.raw()['set-cookie'] || [];
    const cookieString = cookies.join('; ');
    
    console.log('\nCookies received:', cookies.length > 0 ? 'Yes' : 'No');
    
    // 2. Test if session was established by accessing protected route
    console.log('\n2. Testing protected route access...');
    const profileResponse = await fetch(`${API_URL}/api/profile/get`, {
      method: 'GET',
      headers: {
        'Cookie': cookieString
      }
    });

    const profileData = await profileResponse.json();
    console.log('Profile response:', {
      status: profileResponse.status,
      success: profileData.success,
      hasProfile: !!profileData.profile
    });

    if (profileResponse.ok && profileData.success) {
      console.log('\n✅ SUCCESS: User can access protected routes after signup!');
      console.log('Profile data:', profileData.profile);
    } else {
      console.log('\n❌ ISSUE: User cannot access protected routes after signup');
      console.log('This might be because:');
      console.log('1. Email confirmation is required');
      console.log('2. Session cookies are not being set properly');
      console.log('3. There\'s a timing issue with session establishment');
    }

    // 3. Check if email confirmation is required
    if (signupData.requiresEmailConfirmation) {
      console.log('\n⚠️  Email confirmation is required for this account');
      console.log('User will need to confirm their email before accessing protected routes');
    }

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error);
  }
}

// Run the test
testSignupWithSession().catch(console.error);