import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

// UI Components
import OrganicShape from '@/components/ui/OrganicShape';
import GlassmorphismPanel from '@/components/ui/GlassmorphismPanel';
import CalendlyBookingWidget from '@/components/CalendlyBookingWidget';

export const metadata: Metadata = {
  title: 'Book Your Free Consultation | Bloom Psychology',
  description: 'Schedule your free 15-minute consultation with our licensed perinatal specialists. Same-week appointments available for virtual or in-person sessions in Texas.',
  keywords: [
    'book appointment',
    'free consultation', 
    'therapy appointment',
    'postpartum therapy',
    'North Austin psychologist',
    'perinatal mental health',
    'schedule therapy session'
  ],
  openGraph: {
    title: 'Book Your Free Consultation | Bloom Psychology',
    description: 'Schedule your free 15-minute consultation with our licensed perinatal specialists. Same-week appointments available.',
    url: 'https://bloompsychologynorthaustin.com/book',
    siteName: 'Bloom Psychology',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book Your Free Consultation | Bloom Psychology',
    description: 'Schedule your free 15-minute consultation with our licensed perinatal specialists. Same-week appointments available.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BookingPage() {
  return (
    <>
      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalBusiness",
            "@id": "https://bloompsychologynorthaustin.com",
            "name": "Bloom Psychology",
            "description": "Specialized therapy for women, moms, and parents in Texas.",
            "url": "https://bloompsychologynorthaustin.com/book",
            "telephone": "+15128989510",
            "email": "jana@bloompsychologynorthaustin.com",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "13706 N Highway 183, Suite 114",
              "addressLocality": "Austin",
              "addressRegion": "TX",
              "postalCode": "78750",
              "addressCountry": "US"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "30.452948",
              "longitude": "-97.802354"
            },
            "potentialAction": {
              "@type": "ReserveAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://bloompsychologynorthaustin.com/book",
                "inLanguage": "en-US",
                "actionPlatform": [
                  "http://schema.org/DesktopWebPlatform",
                  "http://schema.org/MobileWebPlatform"
                ]
              },
              "result": {
                "@type": "Reservation",
                "name": "Free 15-minute consultation"
              }
            }
          })
        }}
      />
      
      <div className="min-h-screen bg-[#FCFCFF]">
      {/* Header area with decorative elements */}
      <div className="relative">
        {/* Background gradient */}
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-bloom-pink-50 to-transparent z-0"></div>
        
        {/* Decorative shapes */}
        <OrganicShape
          variant="blob-1"
          color="var(--bloom-accent)"
          size="xl"
          position="top-left"
          opacity={0.04}
        />
        
        <OrganicShape
          variant="blob-3"
          color="var(--bloom-blush)"
          size="lg"
          position="top-right"
          opacity={0.05}
          rotate={45}
        />
      </div>

      {/* Main content area */}
      <div className="container mx-auto px-4 pt-24 pb-20 relative z-10 overflow-x-hidden">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Left side - title and contact info */}
          <div className="lg:w-1/3 lg:sticky lg:top-24">
            <h1 className="font-playfair text-bloom text-3xl md:text-4xl mb-6 animate-fade-in">
              Book Your <span className="text-bloompink font-semibold bg-gradient-to-r from-bloompink to-pink-400 bg-clip-text text-transparent">Free Consultation</span>
            </h1>
            
            <div className="w-32 h-1 bg-gradient-to-r from-[#C63780] to-[#FF9CB9] mb-6 rounded-full"></div>
            
            <p className="text-bloom/70 mb-10">
              Schedule your free 15-minute consultation directly using the calendar. We offer same-week appointments for virtual or in-person sessions.
            </p>

            {/* Contact card */}
            <GlassmorphismPanel variant="subtle" className="p-6 mb-6">
              <h3 className="font-playfair text-lg text-bloom mb-4">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-bloom-pink-50 rounded-full p-2 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-bloompink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-bloom/60 mb-1">Email</p>
                    <a href="mailto:jana@bloompsychologynorthaustin.com" className="text-bloompink hover:text-[#B03979] transition-colors font-medium break-words">
                      jana@bloompsychologynorthaustin.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-bloom-pink-50 rounded-full p-2 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-bloompink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-bloom/60 mb-1">Address</p>
                    <p className="text-bloom">
                      13706 N Highway 183, Suite 114<br />
                      Austin, Texas 78750
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-bloom-pink-50 rounded-full p-2 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-bloompink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-bloom/60 mb-1">Hours</p>
                    <p className="text-bloom">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Weekend appointments upon request
                    </p>
                  </div>
                </div>
              </div>
            </GlassmorphismPanel>

            {/* Alternative contact option */}
            <Link href="/contact" className="inline-flex items-center text-bloompink hover:text-[#B03979] transition-colors font-medium mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Prefer to send a message? Use our contact form
            </Link>
            
            {/* Location Map */}
            <div className="hidden md:block mt-6">
              <h3 className="font-playfair text-lg text-bloom mb-4">Our Location</h3>
              <div className="rounded-lg overflow-hidden shadow-md h-[200px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3442.1076133481174!2d-97.8045424!3d30.452954299999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8644cc6c16a6abf7%3A0xb7770fa5438d1f6a!2s13706%20N%20Hwy%20183%2C%20Austin%2C%20TX%2078750!5e0!3m2!1sen!2sus!4v1654345789012!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Bloom Psychology office location"
                ></iframe>
              </div>
            </div>
          </div>
          
          {/* Right side - Calendly widget */}
          <div className="lg:w-2/3 w-full max-w-full overflow-hidden">
            <CalendlyBookingWidget />
          </div>
        </div>
      </div>
      
      {/* Mobile-only map section at bottom */}
      <div className="md:hidden bg-white py-12">
        <div className="container mx-auto px-4">
          <h3 className="font-playfair text-2xl text-center text-bloom mb-6">Our Location</h3>
          <div className="rounded-lg overflow-hidden shadow-md h-[300px] max-w-lg mx-auto">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3442.1076133481174!2d-97.8045424!3d30.452954299999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8644cc6c16a6abf7%3A0xb7770fa5438d1f6a!2s13706%20N%20Hwy%20183%2C%20Austin%2C%20TX%2078750!5e0!3m2!1sen!2sus!4v1654345789012!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bloom Psychology office location"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}