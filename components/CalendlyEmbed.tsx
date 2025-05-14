'use client';

import React from 'react';
import { InlineWidget } from 'react-calendly';
import OrganicShape from './ui/OrganicShape';

interface CalendlyEmbedProps {
  className?: string;
}

const CalendlyEmbed: React.FC<CalendlyEmbedProps> = ({ className = '' }) => {
  return (
    <div className={`w-full py-12 md:py-16 bg-white relative overflow-hidden ${className}`}>
      {/* Decorative shapes */}
      <OrganicShape
        variant="blob-2"
        color="var(--bloom-blush)"
        size="md"
        position="top-right"
        opacity={0.05}
        rotate={15}
      />
      
      <OrganicShape
        variant="blob-1"
        color="var(--bloom-accent)"
        size="sm"
        position="bottom-left"
        opacity={0.04}
      />
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8">
          <h2 className="font-playfair text-bloom text-3xl md:text-4xl mb-4">
            Book Your Free 15-Minute Consultation
          </h2>
          
          <div className="w-32 h-1 bg-bloompink mx-auto mb-6 rounded-full"></div>
          
          <p className="text-bloom/70 max-w-2xl mx-auto mb-10">
            A chance to talk, ask questions, and see if we're a good fit for your postpartum needs.
          </p>
        </div>
        
        <div className="shadow-lg rounded-lg overflow-hidden bg-white">
          <div className="relative">
            <InlineWidget 
              url="https://calendly.com/bloompsychology/15-minute?hide_gdpr_banner=1&primary_color=C63780&hide_landing_page_details=1&hide_event_type_details=1"
              styles={{
                height: '580px',
                width: '100%',
              }}
            />
            {/* Fallback in case the Calendly widget fails to load */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-[-1] p-8">
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
      </div>
    </div>
  );
};

export default CalendlyEmbed;