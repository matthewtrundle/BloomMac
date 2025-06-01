const fetch = require('node-fetch');
const { serialize } = require('cookie');
const crypto = require('crypto');
const { SignJWT } = require('jose');

require('dotenv').config({ path: '.env.local' });

const BASE_URL = 'http://localhost:3000';
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'bloom-admin-secret-key-change-in-production'
);

async function generateToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

async function testEmailEditorAPI() {
  console.log('Testing Email Editor API with Authentication...\n');
  
  try {
    // 1. Generate a test admin token
    console.log('1. Generating admin token...');
    const token = await generateToken({
      id: 'test-admin-id',
      email: 'admin@bloommaternaltherapy.com',
      name: 'Test Admin',
      role: 'admin'
    });
    console.log('✅ Token generated');
    
    // 2. Test GET /api/email-templates without auth
    console.log('\n2. Testing GET without authentication...');
    try {
      const noAuthResponse = await fetch(`${BASE_URL}/api/email-templates`);
      console.log(`   Status: ${noAuthResponse.status}`);
      if (noAuthResponse.status === 401) {
        console.log('✅ Correctly rejected unauthorized request');
      } else {
        console.log('⚠️  Expected 401 but got:', noAuthResponse.status);
      }
    } catch (error) {
      console.log('❌ Request failed:', error.message);
    }
    
    // 3. Test GET /api/email-templates with auth
    console.log('\n3. Testing GET with authentication...');
    const cookie = serialize('adminToken', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/'
    });
    
    try {
      const authResponse = await fetch(`${BASE_URL}/api/email-templates`, {
        headers: {
          'Cookie': cookie
        }
      });
      console.log(`   Status: ${authResponse.status}`);
      
      if (authResponse.ok) {
        const data = await authResponse.json();
        console.log(`✅ Successfully loaded ${data.templates.length} templates`);
      } else {
        const error = await authResponse.text();
        console.log('❌ Failed to load templates:', error);
      }
    } catch (error) {
      console.log('❌ Request failed:', error.message);
    }
    
    // 4. Test PUT /api/email-templates with auth
    console.log('\n4. Testing PUT (save) with authentication...');
    const testSaveData = {
      sequence: 'newsletter',
      step: 'welcome',
      subject: 'Updated Test Subject - ' + new Date().toISOString(),
      content: 'Updated Test Content from API test'
    };
    
    try {
      const saveResponse = await fetch(`${BASE_URL}/api/email-templates`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookie
        },
        body: JSON.stringify(testSaveData)
      });
      console.log(`   Status: ${saveResponse.status}`);
      
      if (saveResponse.ok) {
        const result = await saveResponse.json();
        console.log('✅ Save successful:', result);
      } else {
        const error = await saveResponse.text();
        console.log('❌ Save failed:', error);
      }
    } catch (error) {
      console.log('❌ Request failed:', error.message);
    }
    
    // 5. Verify the save by loading templates again
    console.log('\n5. Verifying saved data...');
    try {
      const verifyResponse = await fetch(`${BASE_URL}/api/email-templates`, {
        headers: {
          'Cookie': cookie
        }
      });
      
      if (verifyResponse.ok) {
        const data = await verifyResponse.json();
        const savedTemplate = data.templates.find(
          t => t.sequence === 'newsletter' && t.step === 'welcome'
        );
        
        if (savedTemplate && savedTemplate.subject === testSaveData.subject) {
          console.log('✅ Save verified - template was updated correctly');
          console.log('   Subject:', savedTemplate.subject);
          console.log('   Modified:', savedTemplate.lastModified);
        } else {
          console.log('⚠️  Template not found or not updated');
        }
      }
    } catch (error) {
      console.log('❌ Verification failed:', error.message);
    }
    
  } catch (error) {
    console.error('\n❌ Test failed with error:', error);
  }
}

// Check if dev server is running
console.log('NOTE: Make sure the Next.js dev server is running (npm run dev)\n');
console.log('Starting test in 3 seconds...\n');

setTimeout(() => {
  testEmailEditorAPI();
}, 3000);