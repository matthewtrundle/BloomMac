import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

// UI Components
import Button from '@/components/ui/Button';
import OrganicShape from '@/components/ui/OrganicShape';

export const metadata: Metadata = {
  title: 'Book New Mom Program | Individual Postpartum Therapy',
  description: 'Schedule your individual therapy sessions designed specifically for new mothers. Expert postpartum support with Dr. Jana Rundle.',
  keywords: [
    'book new mom therapy',
    'schedule postpartum therapy',
    'new mom therapy appointment',
    'postpartum therapy booking',
    'maternal mental health appointment',
    'new mother therapy session'
  ],
  openGraph: {
    title: 'Book New Mom Program | Individual Postpartum Therapy',
    description: 'Schedule your individual therapy sessions designed specifically for new mothers.',
    url: 'https://bloompsychologynorthaustin.com/book-new-mom-program',
    siteName: 'Bloom Psychology',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BookNewMomProgramPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-bloom-blush/10 via-white to-bloom-accent/5 relative overflow-hidden">
        <OrganicShape
          variant="blob-1"
          color="var(--bloom-accent)"
          size="xl"
          position="top-right"
          opacity={0.03}
        />
        <OrganicShape
          variant="blob-3"
          color="var(--bloom-blush)"
          size="lg"
          position="bottom-left"
          opacity={0.05}
        />
        
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-bloom-accent/10 text-bloom-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Individual Therapy for New Moms
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-bloom mb-6">
              Book Your New Mom
              <span className="text-bloom-accent block mt-2">
                Therapy Session
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Take the first step toward personalized support designed specifically for your unique postpartum experience.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Options */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-bloom mb-4">
                How to Get Started
              </h2>
              <p className="text-gray-600 text-lg">
                Choose the option that works best for you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Direct Booking */}
              <div className="bg-gradient-to-br from-bloom-blush/5 to-white border-2 border-bloom-accent/20 rounded-xl p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-bloom-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-bloom mb-3">Schedule Online</h3>
                  <p className="text-gray-600 mb-6">
                    Book your appointment directly through our secure online scheduling system. 
                    Available times updated in real-time.
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Immediate confirmation
                    </div>
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Virtual or in-person options
                    </div>
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Flexible scheduling
                    </div>
                  </div>
                  <Button 
                    href="https://bloompsychologynorthaustin.com/book"
                    variant="pink"
                    size="lg"
                    className="w-full"
                  >
                    Book Appointment Online
                  </Button>
                </div>
              </div>

              {/* Contact First */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-bloom rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-bloom mb-3">Call to Schedule</h3>
                  <p className="text-gray-600 mb-6">
                    Prefer to speak with someone first? Call our office to discuss your needs 
                    and schedule the best appointment time for you.
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Personal consultation
                    </div>
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Insurance verification
                    </div>
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Answer questions
                    </div>
                  </div>
                  <Button 
                    href="tel:+15128989510"
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    Call (512) 898-9510
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-bloom mb-4">
                What to Expect
              </h2>
              <p className="text-gray-600 text-lg">
                Your journey to wellness starts here
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-bloom-accent rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-bloom mb-2">Initial Consultation</h3>
                  <p className="text-gray-600">
                    During your first session, we'll discuss your postpartum experience, current challenges, 
                    and therapy goals. This helps Dr. Rundle understand your unique situation and develop 
                    a personalized treatment plan.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-bloom-accent rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-bloom mb-2">Ongoing Therapy Sessions</h3>
                  <p className="text-gray-600">
                    Regular 60-minute sessions focused on your specific needs. We'll work together using 
                    evidence-based approaches to address anxiety, depression, bonding concerns, identity 
                    changes, and other postpartum challenges.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-bloom-accent rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-white font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-bloom mb-2">Progress & Growth</h3>
                  <p className="text-gray-600">
                    As you develop coping strategies and process your experiences, you'll notice increased 
                    confidence, better emotional regulation, and a stronger sense of your maternal identity. 
                    Sessions are adjusted based on your progress and changing needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Insurance & Logistics */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold text-bloom mb-6">Insurance & Payment</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-bloom-accent mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-gray-900">Most Insurance Accepted</h4>
                      <p className="text-gray-600 text-sm">We work with most major insurance plans and can verify your benefits</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-bloom-accent mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-gray-900">Super Bills Provided</h4>
                      <p className="text-gray-600 text-sm">For out-of-network plans, we provide detailed receipts for reimbursement</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-bloom-accent mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-gray-900">Sliding Scale Available</h4>
                      <p className="text-gray-600 text-sm">Limited sliding scale spots available for those experiencing financial hardship</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-bloom mb-6">Session Options</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-bloom-accent mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-gray-900">Virtual Therapy</h4>
                      <p className="text-gray-600 text-sm">Secure video sessions from the comfort of your home</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-bloom-accent mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-gray-900">In-Person Sessions</h4>
                      <p className="text-gray-600 text-sm">Meet at our comfortable North Austin office</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-bloom-accent mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-gray-900">Flexible Scheduling</h4>
                      <p className="text-gray-600 text-sm">Morning, afternoon, and some evening appointments available</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-bloom to-bloom-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            You Don't Have to Navigate This Alone
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Take the first step toward the support and healing you deserve. Your journey to wellness starts with a single appointment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              href="https://bloompsychologynorthaustin.com/book"
              variant="white"
              size="lg"
              className="inline-flex items-center"
            >
              Book Online Now
            </Button>
            <Button 
              href="tel:+15128989510"
              variant="outline-white"
              size="lg" 
              className="inline-flex items-center"
            >
              Call (512) 898-9510
            </Button>
          </div>
          <p className="text-white/80 text-sm mt-6">
            Questions? <Link href="/contact?subject=New Mom Program" className="underline hover:text-white">Contact us</Link> • 
            Learn more about <Link href="/new-mom-program" className="underline hover:text-white">our approach</Link>
          </p>
        </div>
      </section>
    </>
  );
}