'use client';

import { useState } from 'react';

export default function DebugRegistrationPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runDebugTest = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug/test-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Network error', details: error });
    }
    setLoading(false);
  };

  const testActualRegistration = async () => {
    setLoading(true);
    try {
      const testData = {
        firstName: 'Test',
        lastName: 'User',
        email: `test-${Date.now()}@example.com`,
        password: 'testPassword123',
        hipaaConsent: true,
        termsAccepted: true,
        marketingConsent: false,
        courseId: 'postpartum-wellness-foundations'
      };

      const response = await fetch('/api/course/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });

      const data = await response.json();
      setResult({
        actualRegistration: true,
        status: response.status,
        data
      });
    } catch (error) {
      setResult({ 
        actualRegistration: true,
        error: 'Registration test failed', 
        details: error 
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Registration Debug Tool</h1>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={runDebugTest}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Database Connection & Tables'}
          </button>
          
          <button
            onClick={testActualRegistration}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 ml-4"
          >
            {loading ? 'Testing...' : 'Test Actual Registration API'}
          </button>
        </div>

        {result && (
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Debug Results:</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}