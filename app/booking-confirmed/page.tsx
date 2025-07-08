'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';

function BookingConfirmedContent() {
  const searchParams = useSearchParams();
  const eventType = searchParams.get('event_type') || 'consultation';
  
  useEffect(() => {
    // Fire Google Ads conversion when page loads
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        'send_to': 'AW-XXXXXXXXX/XXXXXXXXX', // Replace with your conversion ID
        'value': 0.0,
        'currency': 'USD',
        'transaction_id': Date.now().toString(),
      });
    }

    // Also track in Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'appointment_booked', {
        'event_category': 'booking',
        'event_label': eventType,
        'value': 1
      });
    }
  }, [eventType]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl md:text-4xl font-playfair text-bloom-dark mb-4">
            Your Appointment is Confirmed!
          </h1>
          
          <p className="text-lg text-bloom-dark/70 mb-8">
            Thank you for scheduling your session with Dr. Jana. You'll receive a confirmation email shortly with all the details.
          </p>

          <div className="bg-bloom-sage-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-bloom-dark mb-3">
              What's Next?
            </h2>
            <ul className="text-left text-bloom-dark/70 space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-bloom-sage mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Check your email for appointment details and intake forms</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-bloom-sage mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Complete any forms at least 24 hours before your session</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-bloom-sage mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>You'll receive a reminder 24 hours before your appointment</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-bloom-dark/60">
              Need to reschedule? Check your confirmation email for the rescheduling link.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/resources"
                className="inline-flex items-center justify-center px-6 py-3 bg-bloom-sage text-white rounded-lg hover:bg-bloom-sage/90 transition-colors"
              >
                Browse Free Resources
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-bloom-sage border border-bloom-sage rounded-lg hover:bg-bloom-sage/5 transition-colors"
              >
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingConfirmedPage() {
  return (
    <>
      {/* Google Ads Conversion Tracking */}
      <Script
        id="google-ads-conversion"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Google Ads Conversion Event will be fired in useEffect
            console.log('Booking confirmed page loaded');
          `,
        }}
      />
      
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bloom-sage"></div>
        </div>
      }>
        <BookingConfirmedContent />
      </Suspense>
    </>
  );
}