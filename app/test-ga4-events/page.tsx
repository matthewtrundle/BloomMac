'use client';

import { useState } from 'react';

export default function TestGA4EventsPage() {
  const [eventLog, setEventLog] = useState<string[]>([]);

  const addLog = (message: string) => {
    setEventLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testContactFormEvent = () => {
    addLog('Firing contact_form_submit event...');
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'contact_form_submit', {
        event_category: 'lead',
        event_label: 'contact_page',
        service: 'test_service'
      });
      addLog('✅ contact_form_submit sent to GA4');
    } else {
      addLog('❌ gtag not found');
    }
  };

  const testBookingEvent = () => {
    addLog('Firing book_appointment event...');
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'book_appointment', {
        event_category: 'engagement',
        event_label: 'calendly_booking',
        value: 1
      });
      addLog('✅ book_appointment sent to GA4');
    } else {
      addLog('❌ gtag not found');
    }
  };

  const testNewsletterEvent = () => {
    addLog('Firing newsletter_signup event...');
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'newsletter_signup', {
        event_category: 'lead',
        event_label: 'footer_signup'
      });
      addLog('✅ newsletter_signup sent to GA4');
    } else {
      addLog('❌ gtag not found');
    }
  };

  const testPageView = () => {
    addLog('Firing page_view event...');
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_location: window.location.href,
        page_title: 'Test GA4 Events'
      });
      addLog('✅ page_view sent to GA4');
    } else {
      addLog('❌ gtag not found');
    }
  };

  const checkGtagStatus = () => {
    if (typeof window !== 'undefined') {
      const hasGtag = !!(window as any).gtag;
      const hasDataLayer = !!(window as any).dataLayer;
      addLog(`gtag available: ${hasGtag ? '✅' : '❌'}`);
      addLog(`dataLayer available: ${hasDataLayer ? '✅' : '❌'}`);
      
      if (hasDataLayer) {
        addLog(`dataLayer length: ${(window as any).dataLayer.length}`);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">GA4 Event Testing Page</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Test Controls */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Test Events</h2>
          
          <div className="space-y-4">
            <button
              onClick={checkGtagStatus}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold px-6 py-3 rounded-md transition-colors"
            >
              Check gtag Status
            </button>

            <button
              onClick={testPageView}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-md transition-colors"
            >
              Test Page View Event
            </button>

            <button
              onClick={testContactFormEvent}
              className="w-full bg-bloompink hover:bg-[#B03979] text-white font-bold px-6 py-3 rounded-md transition-colors"
            >
              Test Contact Form Submit
            </button>

            <button
              onClick={testBookingEvent}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-md transition-colors"
            >
              Test Book Appointment
            </button>

            <button
              onClick={testNewsletterEvent}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-md transition-colors"
            >
              Test Newsletter Signup
            </button>
          </div>

          <div className="mt-8 p-6 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold mb-2">How to Use:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Open Google Analytics 4 Realtime report</li>
              <li>Click the test buttons above</li>
              <li>Watch for events in GA4 Realtime</li>
              <li>Check the Event Log on the right</li>
            </ol>
          </div>
        </div>

        {/* Event Log */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Event Log</h2>
          <div className="bg-gray-100 rounded-lg p-4 h-96 overflow-y-auto">
            {eventLog.length === 0 ? (
              <p className="text-gray-500">No events fired yet. Click a test button!</p>
            ) : (
              <div className="space-y-2">
                {eventLog.map((log, index) => (
                  <div key={index} className="text-sm font-mono">
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {eventLog.length > 0 && (
            <button
              onClick={() => setEventLog([])}
              className="mt-4 text-sm text-red-600 hover:text-red-800"
            >
              Clear Log
            </button>
          )}
        </div>
      </div>

      <div className="mt-12 p-6 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Expected GA4 Configuration:</h3>
        <p className="text-sm mb-2">Your GA4 ID: {process.env.NEXT_PUBLIC_GA_ID || 'NOT SET'}</p>
        <p className="text-sm">If events aren't showing in GA4, check:</p>
        <ul className="list-disc list-inside mt-2 text-sm space-y-1">
          <li>GA4 property ID matches your .env.local</li>
          <li>No ad blockers are active</li>
          <li>You're looking at the correct GA4 property</li>
          <li>Realtime reports are enabled</li>
        </ul>
      </div>
    </div>
  );
}