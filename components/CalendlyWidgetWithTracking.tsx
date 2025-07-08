'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import Script from 'next/script';

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

export default function CalendlyWidgetWithTracking() {
  useEffect(() => {
    // Listen for Calendly events
    const handleCalendlyEvent = (e: MessageEvent) => {
      if (e.data.event && e.data.event.indexOf('calendly') === 0) {
        console.log('Calendly Event:', e.data.event);
        
        // When someone successfully books
        if (e.data.event === 'calendly.event_scheduled') {
          console.log('Appointment booked! Firing conversion...');
          
          // Fire Google Ads conversion
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'conversion', {
              'send_to': 'AW-XXXXXXXXX/XXXXXXXXX', // REPLACE WITH YOUR CONVERSION ID/LABEL
              'value': 0.0,
              'currency': 'USD',
              'transaction_id': Date.now().toString(),
            });
            
            // Also track in Google Analytics
            (window as any).gtag('event', 'appointment_scheduled', {
              'event_category': 'booking',
              'event_label': 'calendly_inline',
              'value': 1
            });
          }
        }
      }
    };

    // Add event listener
    window.addEventListener('message', handleCalendlyEvent);
    
    // Cleanup
    return () => {
      window.removeEventListener('message', handleCalendlyEvent);
    };
  }, []);

  return (
    <>
      {/* Google Ads Event Snippet - This is what Google Ads gives you */}
      <Script
        id="google-ads-booking-conversion"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // This function will be called when someone books
            function trackBookingConversion() {
              gtag('event', 'conversion', {
                'send_to': 'AW-XXXXXXXXX/XXXXXXXXX', // REPLACE WITH YOUR CONVERSION ID/LABEL
                'value': 0.0,
                'currency': 'USD'
              });
            }
          `,
        }}
      />
      
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
              // Calendly provides these callbacks
              onEventScheduled={() => {
                console.log('Event scheduled via callback!');
                // Alternative way to track conversion
                if (typeof window !== 'undefined' && (window as any).trackBookingConversion) {
                  (window as any).trackBookingConversion();
                }
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
                // Track click to external booking
                if (typeof window !== 'undefined' && (window as any).gtag) {
                  (window as any).gtag('event', 'click', {
                    'event_category': 'booking',
                    'event_label': 'calendly_external',
                  });
                }
              }}
            >
              Open Scheduling Calendar
            </a>
          </div>
        </div>
      </div>
    </>
  );
}