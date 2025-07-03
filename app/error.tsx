'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log detailed error information
    console.error('=== DASHBOARD ERROR DETAILS ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    console.error('Error digest:', error.digest);
    console.error('Current URL:', window.location.href);
    console.error('User agent:', navigator.userAgent);
    console.error('=== END ERROR DETAILS ===');
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-bloom-dark mb-2">
          Oops! Something went wrong
        </h2>
        
        <p className="text-bloom-gray-600 mb-6">
          We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.
        </p>

        <div className="space-y-3">
          <Button
            onClick={reset}
            variant="pink"
            className="w-full"
          >
            Try Again
          </Button>
          
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="w-full"
          >
            Go to Homepage
          </Button>
        </div>

        <details className="mt-6 text-left">
          <summary className="cursor-pointer text-sm text-bloom-gray-500">
            Error details (click to expand)
          </summary>
          <div className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
            <div className="mb-2">
              <strong>Error:</strong> {error.message}
            </div>
            <div className="mb-2">
              <strong>Component:</strong> Dashboard Page
            </div>
            <div className="mb-2">
              <strong>URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Unknown'}
            </div>
            {error.stack && (
              <div>
                <strong>Stack trace:</strong>
                <pre className="text-xs mt-1 whitespace-pre-wrap">{error.stack}</pre>
              </div>
            )}
          </div>
        </details>
      </div>
    </div>
  );
}