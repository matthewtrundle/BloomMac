'use client';

import { useEffect } from 'react';

export default function TestConversionPage() {
  useEffect(() => {
    // Check if gtag is available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      console.log('✅ gtag is available');
      console.log('Google Ads ID:', process.env.NEXT_PUBLIC_GOOGLE_ADS_ID);
    } else {
      console.log('❌ gtag is NOT available');
    }

    // Log all window messages to see Calendly events
    const handleMessage = (e: MessageEvent) => {
      console.log('📩 Message received:', {
        origin: e.origin,
        data: e.data
      });
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const testConversion = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      console.log('🚀 Firing test conversion...');
      (window as any).gtag('event', 'conversion', {
        'send_to': 'AW-16914020514/E8GTCPmLruwaEKLxnYE_',
        'value': 0.0,
        'currency': 'USD',
        'transaction_id': `test_${Date.now()}`
      });
      console.log('✅ Conversion fired!');
    } else {
      console.log('❌ Cannot fire conversion - gtag not found');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Conversion Tracking Test Page</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Information</h2>
          <p>Google Ads ID: {process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || 'NOT SET'}</p>
          <p>Conversion Label: E8GTCPmLruwaEKLxnYE_</p>
          <p>Full send_to: AW-16914020514/E8GTCPmLruwaEKLxnYE_</p>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Conversion</h2>
          <p className="mb-4">Click the button below to fire a test conversion:</p>
          <button
            onClick={testConversion}
            className="bg-bloompink hover:bg-[#B03979] text-white font-bold px-6 py-3 rounded-md transition-colors"
          >
            Fire Test Conversion
          </button>
        </div>

        <div className="bg-yellow-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">How to Test</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Open Chrome DevTools (F12) and go to Console tab</li>
            <li>Click "Fire Test Conversion" button</li>
            <li>Look for console logs confirming conversion fired</li>
            <li>Install Google Tag Assistant Chrome extension</li>
            <li>Enable Tag Assistant and refresh page</li>
            <li>Check that both GA and Google Ads tags are detected</li>
          </ol>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test on Book Page</h2>
          <p>To test the actual conversion:</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Go to <a href="/book" className="text-bloompink hover:underline">/book</a></li>
            <li>Open Console (F12)</li>
            <li>Complete a test booking in Calendly</li>
            <li>Look for "🎉 Appointment booked!" in console</li>
            <li>Verify "✅ Conversion tracked successfully!" appears</li>
          </ol>
        </div>
      </div>
    </div>
  );
}