'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabaseAuth } from '@/lib/supabase-auth';

export default function AuthDebugPage() {
  const { user, loading } = useAuth();
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [cookies, setCookies] = useState<string>('');

  useEffect(() => {
    const checkSession = async () => {
      if (supabaseAuth) {
        const { data: { session }, error } = await supabaseAuth.auth.getSession();
        setSessionInfo({ session, error });
      }
      setCookies(document.cookie);
    };

    checkSession();
    
    // Refresh every 2 seconds
    const interval = setInterval(checkSession, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleTestLogin = async () => {
    try {
      const { data, error } = await supabaseAuth.auth.signInWithPassword({
        email: 'matthewtrundle@gmail.com',
        password: 'BloomAdmin2025!'
      });
      
      console.log('Direct login result:', { data, error });
      alert(`Login result: ${JSON.stringify({ success: !!data.user, error: error?.message })}`);
      
      // Check session after login
      setTimeout(async () => {
        const { data: { session } } = await supabaseAuth.auth.getSession();
        console.log('Session after login:', session);
        setSessionInfo({ session });
      }, 1000);
    } catch (err) {
      console.error('Test login error:', err);
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Auth Debug Page</h1>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Auth Context State</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify({ user, loading }, null, 2)}
            </pre>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Supabase Session</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(sessionInfo, null, 2)}
            </pre>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Cookies</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {cookies || 'No cookies found'}
            </pre>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Test Direct Login</h2>
            <button
              onClick={handleTestLogin}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Test Login with matthewtrundle@gmail.com
            </button>
            <p className="text-sm text-gray-600 mt-2">
              Check browser console for detailed results
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Navigation</h2>
            <div className="space-x-4">
              <a href="/auth/login" className="text-blue-500 hover:underline">Login Page</a>
              <a href="/dashboard" className="text-blue-500 hover:underline">Dashboard</a>
              <a href="/" className="text-blue-500 hover:underline">Home</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}