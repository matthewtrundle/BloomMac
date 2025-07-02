'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthDebug() {
  const { user, loading } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true);
      checkAuthState();
    }
  }, [user, loading]);

  const checkAuthState = async () => {
    try {
      const response = await fetch('/api/auth/debug');
      const data = await response.json();
      setDebugInfo(data);
    } catch (error) {
      console.error('Failed to fetch debug info:', error);
    }
  };

  const forceSignOut = async () => {
    try {
      await fetch('/api/auth/debug', { method: 'DELETE' });
      window.location.reload();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm text-xs z-50">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div className="space-y-1">
        <p><strong>Client State:</strong></p>
        <p>Loading: {loading ? 'Yes' : 'No'}</p>
        <p>User: {user ? user.email : 'None'}</p>
        
        {debugInfo && (
          <>
            <p className="mt-2"><strong>Server State:</strong></p>
            <p>Session: {debugInfo.hasSession ? 'Yes' : 'No'}</p>
            <p>Email: {debugInfo.user?.email || 'None'}</p>
          </>
        )}
        
        {(user || debugInfo?.hasSession) && (
          <button
            onClick={forceSignOut}
            className="mt-2 bg-red-500 text-white px-2 py-1 rounded text-xs"
          >
            Force Sign Out
          </button>
        )}
      </div>
    </div>
  );
}