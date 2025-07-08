'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';

// Dynamic import for Calendly widget
const InlineWidget = dynamic(
  () => import('react-calendly').then(mod => mod.InlineWidget),
  {
    loading: () => (
      <div className="h-[580px] w-full flex items-center justify-center">
        <p className="text-bloom/50 text-lg">Loading scheduling calendar...</p>
      </div>
    ),
    ssr: false
  }
);

export default function CalendlyBookingWidget() {
  useEffect(() => {
    // Listen for Calendly events
    const handleCalendlyEvent = (e: MessageEvent) => {
      // Check if this is a Calendly event
      if (e.origin !== 'https://calendly.com') return;
      
      // Log all Calendly events for debugging
      if (e.data.event && e.data.event.indexOf('calendly') === 0) {
        console.log('📅 Calendly Event:', e.data.event);
        
        // When someone successfully books
        if (e.data.event === 'calendly.event_scheduled') {
          console.log('🎉 Appointment booked! Firing Google Ads conversion...');
          
          // Fire Google Ads conversion
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'conversion', {
              'send_to': 'AW-16914020514/E8GTCPmLruwaEKLxnYE_',
              'value': 0.0,
              'currency': 'USD',
              'transaction_id': `booking_${Date.now()}`,
            });
            
            // Also track in Google Analytics
            (window as any).gtag('event', 'book_appointment', {
              'event_category': 'engagement',
              'event_label': 'calendly_booking',
              'value': 1
            });
            
            console.log('✅ Conversion tracked successfully!');
          } else {
            console.error('❌ gtag not found - conversion not tracked');
          }
        }
      }
    };

    // Add event listener
    window.addEventListener('message', handleCalendlyEvent);
    console.log('👂 Listening for Calendly events...');
    
    // Cleanup
    return () => {
      window.removeEventListener('message', handleCalendlyEvent);
    };
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden w-full">
      <div className="relative w-full overflow-x-hidden">
        {/* Calendly component */}
        <div className="calendly-inline-widget">
          <InlineWidget 
            url="https://calendly.com/bloompsychology/15-minute?hide_gdpr_banner=1&primary_color=C63780&hide_landing_page_details=1&hide_event_type_details=1"
            styles={{
              height: '580px',
              width: '100%',
              minWidth: '320px',
            }}
          />
        </div>
        
        {/* Fallback in case the Calendly widget fails to load */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-[-1] p-8 bg-white">
          <p className="text-bloom-dark/70 text-lg mb-4">
            If the scheduling calendar doesn't appear, please click the button below:
          </p>
          <a 
            href="https://calendly.com/bloompsychology/15-minute"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-bloompink hover:bg-[#B03979] text-white font-bold font-inter px-6 py-3 rounded-md shadow-md transition-all duration-300 text-center"
            onClick={() => {
              // Track fallback button click
              if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'click', {
                  'event_category': 'booking',
                  'event_label': 'calendly_external_fallback',
                });
              }
            }}
          >
            Open Scheduling Calendar
          </a>
        </div>
      </div>
    </div>
  );
}