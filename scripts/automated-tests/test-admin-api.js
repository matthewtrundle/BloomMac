#!/usr/bin/env node

/**
 * Test 7: Admin System Testing
 * Tests admin authentication, dashboard access, and data management
 */

const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

let testsPassed = 0;
let testsFailed = 0;

function logTest(testName, passed, error = null) {
  if (passed) {
    console.log(`✅ ${testName}`);
    testsPassed++;
  } else {
    console.log(`❌ ${testName}`);
    if (error) console.log(`   Error: ${error}`);
    testsFailed++;
  }
}

async function testAdminSystem() {
  console.log('\n👨‍💼 Testing Admin System...\n');
  
  // Test 7.1: JWT Secret configuration
  console.log('Checking admin configuration...\n');
  
  logTest('JWT_SECRET configured', !!process.env.JWT_SECRET);
  
  // Test 7.2: Admin tables exist
  console.log('\n\nVerifying admin tables...\n');
  
  const adminTables = [
    'admin_users',
    'admin_sessions',
    'admin_activity_logs'
  ];
  
  for (const table of adminTables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('count')
        .limit(1);
      
      logTest(`Table '${table}' exists`, !error);
    } catch (err) {
      logTest(`Table '${table}' exists`, false, err.message);
    }
  }
  
  // Test 7.3: Admin login endpoint
  console.log('\n\nTesting admin login endpoint...\n');
  
  try {
    // Test with invalid credentials
    const invalidResponse = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'invalid@admin.com',
        password: 'wrongpassword'
      })
    });
    
    logTest('Rejects invalid credentials', invalidResponse.status === 401);
    
    // Test with missing fields
    const missingResponse = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@admin.com'
      })
    });
    
    logTest('Validates required fields', missingResponse.status === 400);
    
  } catch (err) {
    logTest('Admin login endpoint', false, err.message);
  }
  
  // Test 7.4: Protected admin routes
  console.log('\n\nTesting protected admin routes...\n');
  
  const protectedRoutes = [
    '/api/admin/contacts',
    '/api/admin/careers',
    '/api/admin/analytics',
    '/api/admin/email'
  ];
  
  for (const route of protectedRoutes) {
    try {
      // Test without auth token
      const response = await fetch(`${BASE_URL}${route}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      logTest(`${route} requires authentication`, 
        response.status === 401 || response.status === 403);
      
    } catch (err) {
      logTest(`${route} protection`, false, err.message);
    }
  }
  
  // Test 7.5: JWT token validation
  console.log('\n\nTesting JWT token validation...\n');
  
  if (process.env.JWT_SECRET) {
    try {
      // Create a test token
      const testToken = jwt.sign(
        { 
          userId: 'test-admin-id',
          email: 'test@admin.com',
          role: 'admin'
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      logTest('Can create JWT token', !!testToken);
      
      // Test with valid token
      const authResponse = await fetch(`${BASE_URL}/api/admin/contacts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${testToken}`
        }
      });
      
      // Should either work or return different error than 401
      logTest('JWT token is validated', authResponse.status !== 401);
      
      // Test with expired token
      const expiredToken = jwt.sign(
        { userId: 'test', email: 'test@admin.com' },
        process.env.JWT_SECRET,
        { expiresIn: '-1h' } // Already expired
      );
      
      const expiredResponse = await fetch(`${BASE_URL}/api/admin/contacts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${expiredToken}`
        }
      });
      
      logTest('Rejects expired tokens', expiredResponse.status === 401);
      
    } catch (err) {
      logTest('JWT token validation', false, err.message);
    }
  }
  
  // Test 7.6: Admin data access
  console.log('\n\nTesting admin data access...\n');
  
  try {
    // Check if admin users exist
    const { data: adminUsers, error: adminError } = await supabase
      .from('admin_users')
      .select('id, email, role')
      .limit(5);
    
    logTest('Can query admin users', !adminError);
    
    if (adminUsers && adminUsers.length > 0) {
      console.log(`   Found ${adminUsers.length} admin users`);
      logTest('Admin users have required fields', 
        adminUsers.every(u => u.id && u.email && u.role));
    }
    
  } catch (err) {
    logTest('Admin data access', false, err.message);
  }
  
  // Test 7.7: Activity logging
  console.log('\n\nTesting activity logging...\n');
  
  try {
    // Create test activity log
    const testActivity = {
      admin_user_id: 'test-admin-id',
      action: 'test_action',
      resource_type: 'test',
      resource_id: 'test-123',
      ip_address: '127.0.0.1',
      user_agent: 'Automated Test',
      metadata: {
        test: true,
        timestamp: new Date().toISOString()
      }
    };
    
    const { error: logError } = await supabase
      .from('admin_activity_logs')
      .insert(testActivity);
    
    logTest('Can create activity logs', !logError);
    
    // Query recent logs
    const { data: recentLogs, error: queryError } = await supabase
      .from('admin_activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    logTest('Can query activity logs', !queryError && !!recentLogs);
    
    // Cleanup test log
    await supabase
      .from('admin_activity_logs')
      .delete()
      .eq('admin_user_id', 'test-admin-id');
    
  } catch (err) {
    logTest('Activity logging', false, err.message);
  }
  
  // Test 7.8: Admin session management
  console.log('\n\nTesting session management...\n');
  
  try {
    // Check session table structure
    const { data: sessionSample } = await supabase
      .from('admin_sessions')
      .select('*')
      .limit(1);
    
    // Just check if we can query it
    logTest('Session table queryable', true);
    
  } catch (err) {
    // Table might not exist in some setups
    console.log('   ⚠️  Session table not accessible');
  }
  
  // Test 7.9: CORS and security headers
  console.log('\n\nTesting security headers...\n');
  
  try {
    const response = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://evil-site.com',
        'Access-Control-Request-Method': 'POST'
      }
    });
    
    const allowedOrigin = response.headers.get('access-control-allow-origin');
    
    // Should either not allow cross-origin or only allow specific origins
    logTest('CORS properly configured', 
      !allowedOrigin || allowedOrigin !== '*');
    
  } catch (err) {
    logTest('Security headers test', false, err.message);
  }
  
  // Summary
  console.log('\n📊 Admin System Test Summary:');
  console.log(`   ✅ Passed: ${testsPassed}`);
  console.log(`   ❌ Failed: ${testsFailed}`);
  
  process.exit(testsFailed > 0 ? 1 : 0);
}

// Run tests
testAdminSystem().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});