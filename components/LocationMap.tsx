'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface LocationMapProps {
  height?: string;
  className?: string;
}

export default function LocationMap({ height = '200px', className = '' }: LocationMapProps) {
  const [mapError, setMapError] = useState(false);
  const address = '13706 N Highway 183, Suite 114, Austin, TX 78750';
  const googleMapsUrl = `https://www.google.com/maps/place/13706+N+Hwy+183,+Austin,+TX+78750/@30.4529543,-97.8045424,17z/data=!3m1!4b1!4m6!3m5!1s0x8644cc6c16a6abf7:0xb7770fa5438d1f6a!8m2!3d30.4529543!4d-97.8045424!16s%2Fg%2F11c5q6m8p8`;
  
  // Generate a static map URL as fallback
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=30.4529543,-97.8045424&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C30.4529543,-97.8045424&key=YOUR_API_KEY`;

  if (mapError) {
    return (
      <div className={`rounded-lg overflow-hidden shadow-md bg-gray-100 ${className}`} style={{ height }}>
        <div className="h-full flex flex-col items-center justify-center p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-bloompink mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-bloom font-medium mb-2">{address}</p>
          <a 
            href={googleMapsUrl}
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-bloompink hover:text-[#B03979] transition-colors font-medium mt-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View on Google Maps
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg overflow-hidden shadow-md relative bg-gray-100 ${className}`} style={{ height }}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3442.1076133481174!2d-97.8045424!3d30.452954299999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8644cc6c16a6abf7%3A0xb7770fa5438d1f6a!2s13706%20N%20Hwy%20183%2C%20Austin%2C%20TX%2078750!5e0!3m2!1sen!2sus!4v1654345789012!5m2!1sen!2sus"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Bloom Psychology office location"
        className="absolute inset-0"
        onError={() => setMapError(true)}
      />
    </div>
  );
}