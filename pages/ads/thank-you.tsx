import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import AdPageLayout from '@/components/layout/AdPageLayout';

export default function ThankYouPage() {
  // Fire GA4 conversion event on page load
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        event_category: 'lead',
        event_label: 'postpartum_thank_you_page'
      });
    }
  }, []);

  return (
    <AdPageLayout
      title="Thank You | Bloom Psychology"
      description="Thank you for your interest in postpartum therapy services at Bloom Psychology."
    >
      {/* Page Container */}
      <div className="flex flex-col">
        
        {/* Thank You Content */}
        <section className="bg-bloom-pink-50 py-20 flex-grow flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center bg-white rounded-lg shadow-md p-8">
              {/* Logo as focal point */}
              <div className="relative mx-auto mb-8 w-40 h-40">
                <Image
                  src="/images/Logo/BLOOM-LOGO.png"
                  alt="Bloom Psychology Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              
              <h1 className="font-playfair text-3xl md:text-4xl text-bloom mb-6">
                Thank You for Reaching Out
              </h1>
              
              <p className="text-lg text-bloom/80 mb-6">
                We've received your request for a free consultation. One of our perinatal specialists will contact you within 24 hours to schedule your appointment.
              </p>
              
              <p className="text-lg text-bloom mb-8">
                While you wait, you may want to learn more about our approach to postpartum care.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  href="/"
                  variant="outline"
                  size="md"
                >
                  Return to Home
                </Button>
                
                <Button
                  href="/blog"
                  variant="pink"
                  size="md"
                >
                  Explore Our Resources
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Minimal Footer */}
        <footer className="py-4 bg-bloom text-white text-sm">
          <div className="container mx-auto px-4 text-center">
            <p className="text-white/70 text-xs">
              Bloom Psychology • 13706 N Highway 183, Suite 114, Austin, TX 78750 • (512) 898-9510
            </p>
            <Link href="/privacy-policy" className="text-xs text-white/50 hover:text-white mt-2 inline-block">
              Privacy Policy
            </Link>
          </div>
        </footer>
      </div>
    </AdPageLayout>
  );
}

// Add global gtag type definition
declare global {
  interface Window {
    gtag?: (command: string, action: string, params: object) => void;
  }
}
