'use client';

import { useState } from 'react';

export default function TestLoginPage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    setResult('Testing login...\n');

    try {
      // Test 1: Make login request
      const loginRes = await fetch('/api/admin/simple-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: 'admin@bloom.com', 
          password: 'bloom-admin-2024' 
        }),
        credentials: 'include' // Important for cookies
      });

      const loginData = await loginRes.json();
      setResult(prev => prev + `Login response: ${JSON.stringify(loginData)}\n`);
      setResult(prev => prev + `Status: ${loginRes.status}\n`);

      if (loginRes.ok) {
        // Test 2: Check what cookies we have
        setResult(prev => prev + '\nTesting cookie presence...\n');
        
        const testRes = await fetch('/api/test-auth', {
          credentials: 'include'
        });
        const testData = await testRes.json();
        setResult(prev => prev + `Cookie test: ${JSON.stringify(testData, null, 2)}\n`);
        
        // Test 3: Check if we can access protected route
        setResult(prev => prev + '\nTesting protected route access...\n');
        
        const protectedRes = await fetch('/api/newsletter-admin', {
          credentials: 'include'
        });
        
        setResult(prev => prev + `Protected route status: ${protectedRes.status}\n`);
        
        if (protectedRes.ok) {
          setResult(prev => prev + '✅ Authentication working!\n');
        } else {
          setResult(prev => prev + '❌ Authentication failed - cannot access protected route\n');
        }
      }
    } catch (error) {
      setResult(prev => prev + `Error: ${error.message}\n`);
    }

    setLoading(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Login Test</h1>
      
      <button 
        onClick={testLogin}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 mb-4"
      >
        {loading ? 'Testing...' : 'Test Login'}
      </button>

      <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
        {result || 'Click "Test Login" to start'}
      </pre>

      <div className="mt-4">
        <a href="/admin/analytics" className="text-blue-500 underline">
          Try to access /admin/analytics
        </a>
      </div>
    </div>
  );
}