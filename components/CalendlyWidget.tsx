'use client';

import dynamic from 'next/dynamic';

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

export default function CalendlyWidget() {
  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
      <div className="relative">
        {/* Calendly component */}
        <InlineWidget 
          url="https://calendly.com/bloompsychology/15-minute?hide_gdpr_banner=1&primary_color=C63780&hide_landing_page_details=1&hide_event_type_details=1"
          styles={{
            height: '580px',
            width: '100%',
          }}
        />
        
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
          >
            Open Scheduling Calendar
          </a>
        </div>
      </div>
    </div>
  );
}